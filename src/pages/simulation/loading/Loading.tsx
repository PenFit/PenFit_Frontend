import { useEffect, useRef, useState } from 'react';
import { isAxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import { createPensionPlan } from '../../../apis/plan';
import { getMyPensionPassport } from '../../../apis/passport';
import { getRehearsalProgress, retryRehearsalAnalysis } from '../../../apis/simulation';
import { getStoredRehearsalId } from '../../../utils/rehearsalStorage';

interface CheckItem {
  label: string;
  status: 'pending' | 'loading' | 'done';
}

const initialItems: CheckItem[] = [
  { label: '납입 행동 분석 중', status: 'loading' },
  { label: '시장 대응 성향 분석 중', status: 'pending' },
  { label: '유지 가능한 연금계획 생성 중', status: 'pending' },
];

const REHEARSAL_STATUS = {
  ANALYZING: 'ANALYZING',
  FAILED: 'FAILED',
  COMPLETED: 'COMPLETED',
} as const;

const MAX_POLL_COUNT = 40;
const POLL_INTERVAL_MS = 3000;
const MAX_FAILED_AFTER_RETRY_COUNT = 5;

interface LoadingErrorState {
  code?: string;
  message?: string;
}

export default function Loading() {
  const navigate = useNavigate();
  const hasRequestedPlanRef = useRef(false);
  const hasRetriedAnalysisRef = useRef(false);

  const [items, setItems] = useState<CheckItem[]>(initialItems);
  const [message, setMessage] = useState('당신의 연금 성향을 분석하고 있어요');

  useEffect(() => {
    const rehearsalId = getStoredRehearsalId();
    let isMounted = true;
    let pollCount = 0;
    let failedAfterRetryCount = 0;
    let pollTimer: number | undefined;

    if (!rehearsalId) {
      navigate('/result-preview', { replace: true });
      return undefined;
    }

    setMessage('당신의 연금 성향을 분석하고 있어요');

    const navigateToError = (state?: LoadingErrorState) => {
      navigate('/status/error', {
        replace: true,
        state,
      });
    };

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

        if (progress.status.code === REHEARSAL_STATUS.FAILED) {
          console.error('리허설 AI 분석 실패 상태', progress);

          if (!hasRetriedAnalysisRef.current) {
            hasRetriedAnalysisRef.current = true;

            try {
              await retryRehearsalAnalysis(rehearsalId);
            } catch (error) {
              const errorData = isAxiosError(error) ? error.response?.data : undefined;
              console.error('리허설 AI 분석 재시도 실패 응답', errorData);
              navigateToError({
                code: errorData?.code ?? progress.failureCode,
                message: errorData?.message ?? progress.failureMessage,
              });
              return;
            }

            if (!isMounted) {
              return;
            }

            pollTimer = window.setTimeout(pollAnalysis, POLL_INTERVAL_MS);
            return;
          }

          failedAfterRetryCount += 1;

          if (failedAfterRetryCount < MAX_FAILED_AFTER_RETRY_COUNT) {
            pollTimer = window.setTimeout(pollAnalysis, POLL_INTERVAL_MS);
            return;
          }

          navigateToError({
            code: progress.failureCode || progress.status.code,
            message: progress.failureMessage || `${progress.status.displayName} 상태가 계속 반환되고 있어요. 재시도 횟수: ${progress.retryCount}`,
          });
          return;
        }

        failedAfterRetryCount = 0;

        setItems([
          { label: '납입 행동 분석 중', status: 'done' },
          { label: '시장 대응 성향 분석 중', status: 'loading' },
          { label: '유지 가능한 연금계획 생성 중', status: 'pending' },
        ]);

        if (progress.status.code === REHEARSAL_STATUS.ANALYZING) {
          if (pollCount < MAX_POLL_COUNT) {
            pollTimer = window.setTimeout(pollAnalysis, POLL_INTERVAL_MS);
            return;
          }

          navigateToError({
            code: 'TIMEOUT',
            message: '분석이 예상보다 오래 걸리고 있어요.',
          });
          return;
        }

        if (progress.status.code !== REHEARSAL_STATUS.COMPLETED) {
          navigateToError({
            code: progress.status.code,
            message: progress.status.displayName,
          });
          return;
        }

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

            navigateToError({
              code: 'PP4041',
              message: '연금 패스포트 생성이 아직 완료되지 않았어요.',
            });
            return;
          }

          if (isAxiosError(error)) {
            console.error('패스포트 조회 또는 연금 계획 생성 실패 응답', error.response?.data);

            if (error.response?.data?.code === 'PN4221') {
              navigate('/status/empty', { replace: true });
              return;
            }
          }

          console.error('패스포트 조회 또는 연금 계획 생성에 실패했어요.', error);
          navigateToError({
            code: isAxiosError(error) ? error.response?.data?.code : undefined,
            message: isAxiosError(error) ? error.response?.data?.message : undefined,
          });
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
        navigateToError({
          code: isAxiosError(error) ? error.response?.data?.code : undefined,
          message: isAxiosError(error) ? error.response?.data?.message : undefined,
        });
      }
    };

    pollTimer = window.setTimeout(pollAnalysis, 0);

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
