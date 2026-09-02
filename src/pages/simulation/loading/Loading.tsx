import { useEffect, useRef, useState } from 'react';
import { isAxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import { createPensionPlan } from '../../../apis/plan';
import { getMyPensionPassport } from '../../../apis/passport';
import { getRehearsalProgress } from '../../../apis/simulation';
import {
  REHEARSAL_ANSWER_STATUS_STORAGE_KEY,
  getStoredRehearsalId,
} from '../../../utils/rehearsalStorage';

interface CheckItem {
  label: string;
  status: 'pending' | 'loading' | 'done';
}

const initialItems: CheckItem[] = [
  { label: '납입 행동 분석 중', status: 'loading' },
  { label: '시장 대응 성향 분석 중', status: 'pending' },
  { label: '유지 가능한 연금계획 생성 중', status: 'pending' },
];

const FAILED_STATUS_CODES = new Set([
  'FAILED',
  'FAIL',
  'ERROR',
  'ANALYSIS_FAILED',
]);

const MAX_POLL_COUNT = 40;
const POLL_INTERVAL_MS = 3000;

export default function Loading() {
  const navigate = useNavigate();
  const hasRequestedPlanRef = useRef(false);

  const [items, setItems] = useState<CheckItem[]>(initialItems);
  const [message, setMessage] = useState('당신의 연금 성향을 분석하고 있어요');

  useEffect(() => {
    const rehearsalId = getStoredRehearsalId();
    let isMounted = true;
    let pollCount = 0;
    let pollTimer: number | undefined;

    if (!rehearsalId) {
      navigate('/result-preview', { replace: true });
      return undefined;
    }

    sessionStorage.removeItem(REHEARSAL_ANSWER_STATUS_STORAGE_KEY);

    const pollAnalysis = async () => {
      if (!isMounted) {
        return;
      }

      pollCount += 1;

      try {
        const progress = await getRehearsalProgress(rehearsalId);

        if (!isMounted) {
          return;
        }

        sessionStorage.setItem(REHEARSAL_ANSWER_STATUS_STORAGE_KEY, JSON.stringify(progress));

        if (FAILED_STATUS_CODES.has(progress.status.code)) {
          navigate('/status/error', { replace: true });
          return;
        }

        setItems([
          { label: '납입 행동 분석 중', status: 'done' },
          { label: '시장 대응 성향 분석 중', status: 'loading' },
          { label: '유지 가능한 연금계획 생성 중', status: 'pending' },
        ]);

        try {
          const passport = await getMyPensionPassport();

          if (!isMounted) {
            return;
          }

          if (passport.sustainableMonthlyContribution === 0) {
            setItems([
              { label: '납입 행동 분석 중', status: 'done' },
              { label: '시장 대응 성향 분석 중', status: 'done' },
              { label: '유지 가능한 연금계획 생성 중', status: 'done' },
            ]);

            navigate('/passport', { replace: true });
            return;
          }

          setItems([
            { label: '납입 행동 분석 중', status: 'done' },
            { label: '시장 대응 성향 분석 중', status: 'done' },
            { label: '유지 가능한 연금계획 생성 중', status: 'loading' },
          ]);
          setMessage('분석 결과를 바탕으로 연금계획을 만들고 있어요');

          if (!hasRequestedPlanRef.current) {
            hasRequestedPlanRef.current = true;
            await createPensionPlan();
          }

          if (!isMounted) {
            return;
          }

          setItems([
            { label: '납입 행동 분석 중', status: 'done' },
            { label: '시장 대응 성향 분석 중', status: 'done' },
            { label: '유지 가능한 연금계획 생성 중', status: 'done' },
          ]);

          navigate('/plan-result', { replace: true });
          return;
        } catch (error) {
          if (!isMounted) {
            return;
          }

          if (isAxiosError(error) && error.response?.status === 404) {
            if (pollCount < MAX_POLL_COUNT) {
              pollTimer = window.setTimeout(pollAnalysis, POLL_INTERVAL_MS);
              return;
            }
          }

          if (isAxiosError(error)) {
            console.error('패스포트 조회 또는 연금 계획 생성 실패 응답', error.response?.data);

            if (error.response?.data?.code === 'PN4221') {
              navigate('/status/empty', { replace: true });
              return;
            }
          }

          console.error('패스포트 조회 또는 연금 계획 생성에 실패했어요.', error);
          navigate('/status/error', { replace: true });
          return;
        }
      } catch (error) {
        if (!isMounted) {
          return;
        }

        if (isAxiosError(error)) {
          console.error('리허설 분석 상태 조회 실패 응답', error.response?.data);
        }
        console.error('리허설 분석 상태 조회에 실패했어요.', error);
        navigate('/status/error', { replace: true });
      }
    };

    pollAnalysis();

    return () => {
      isMounted = false;

      if (pollTimer) {
        window.clearTimeout(pollTimer);
      }
    };
  }, [navigate]);

  return (
    <>
        <div className="flex-1 flex flex-col items-center justify-center px-6">
          {/* 제목 */}
          <div className="text-center mb-10">
            <h1 className="text-xl font-bold text-foreground-950 font-heading mb-2 animate-fade-in">
              AI가 분석 중이에요
            </h1>
            <p className="text-sm text-foreground-500 leading-relaxed animate-fade-in">
              방금 선택한 행동을 바탕으로
              <br />
              {message}
            </p>
          </div>

          {/* 스피너 */}
          <div className="relative w-24 h-24 mb-12">
            <div className="absolute inset-0 spinner-arc-1" />
            <div className="absolute inset-0 spinner-arc-2" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-primary-50 flex items-center justify-center">
                <i className="ri-shield-check-line text-primary-500 text-xl w-6 h-6 flex items-center justify-center" />
              </div>
            </div>
          </div>

          {/* 체크리스트 */}
          <div className="w-full space-y-4 mb-10">
            {items.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 transition-all duration-500"
              >
                {item.status === 'done' && (
                  <div className="w-5 h-5 rounded-full bg-primary-500 flex items-center justify-center shrink-0">
                    <i className="ri-check-line text-background-50 text-xs w-3 h-3 flex items-center justify-center" />
                  </div>
                )}
                {item.status === 'loading' && (
                  <div className="w-5 h-5 rounded-full border-2 border-primary-500 border-t-transparent animate-spin shrink-0" />
                )}
                {item.status === 'pending' && (
                  <div className="w-5 h-5 rounded-full border-2 border-background-300 shrink-0" />
                )}
                <span className={`
                  text-sm font-medium transition-colors duration-500
                  ${item.status === 'done' ? 'text-foreground-700' : ''}
                  ${item.status === 'loading' ? 'text-foreground-950' : ''}
                  ${item.status === 'pending' ? 'text-foreground-400' : ''}
                `}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>

          {/* 푸터 힌트 */}
          <p className="text-xs text-foreground-400 text-center leading-relaxed animate-fade-in">
            분석이 끝날 때까지 잠시만 기다려주세요.
            <br />
            완료되면 자동으로 리포트 페이지로 넘어갑니다.
          </p>
        </div>
    </>
  );
}
