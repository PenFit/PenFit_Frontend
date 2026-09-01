import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAxiosError } from 'axios';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getMyInformation, updateEmailConsent, updateMyEmail } from '../../apis/user';
import {
  createSpendingAnalysis,
  getBehaviorMissionCompletions,
  getCurrentBehaviorMission,
} from '../../apis/mission';
import Button from '../../components/Button';
import BottomNav from '../../components/BottomNav';
import { emailReportItems } from '../../mocks/missionData';

function formatWon(amount: number) {
  return `${amount.toLocaleString('ko-KR')}원`;
}

export default function Mission() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [agreed, setAgreed] = useState(false);
  const [emailConsentChecked, setEmailConsentChecked] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmittingConsent, setIsSubmittingConsent] = useState(false);
  const [showEmailRequiredAlert, setShowEmailRequiredAlert] = useState(false);

  const {
    data: currentMission,
    isLoading: isMissionLoading,
  } = useQuery({
    queryKey: ['currentBehaviorMission'],
    queryFn: getCurrentBehaviorMission,
    enabled: agreed,
    retry: false,
  });

  const {
    data: completions,
  } = useQuery({
    queryKey: ['behaviorMissionCompletions'],
    queryFn: () => getBehaviorMissionCompletions(),
    enabled: agreed,
    retry: false,
  });

  useEffect(() => {
    const fetchMyInformation = async () => {
      try {
        const myInformation = await getMyInformation();
        setEmail(myInformation.email);
        setAgreed(myInformation.emailConsent);
      } catch (error) {
        console.error('이메일 정보 조회에 실패했어요.', error);
      }
    };

    fetchMyInformation();
  }, []);

  const handleReceiveMissionAnalysis = async () => {
    const nextEmail = email.trim();

    if (!emailConsentChecked || !nextEmail || isSubmittingConsent) {
      return;
    }

    setIsSubmittingConsent(true);

    try {
      await updateMyEmail(nextEmail);
      const updatedUser = await updateEmailConsent(true);
      const analysis = await createSpendingAnalysis();

      setEmail(updatedUser.email);
      setAgreed(true);
      queryClient.invalidateQueries({ queryKey: ['currentBehaviorMission'] });
      queryClient.invalidateQueries({ queryKey: ['spendingAnalysis'] });
      console.log('이메일 수신 동의 및 소비 분석 생성 성공', { updatedUser, analysis });
      navigate('/mission/analysis');
    } catch (error) {
      if (isAxiosError(error)) {
        console.error('미션 분석 생성 실패 응답', error.response?.data);
      }
      console.error('이메일 수신 동의에 실패했어요.', error);
    } finally {
      setIsSubmittingConsent(false);
    }
  };

  const handleToggleEmailConsent = () => {
    if (!email.trim()) {
      setShowEmailRequiredAlert(true);
      return;
    }

    setEmailConsentChecked(!emailConsentChecked);
  };

  if (!agreed) {
    return (
      <>
          <div className="flex-1 overflow-y-auto pb-24 px-6 pt-8">
            {/* 헤더 */}
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-xl bg-accent-100 flex items-center justify-center">
                <i className="ri-mail-send-line text-accent-600 text-xl w-6 h-6 flex items-center justify-center" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-foreground-950 font-heading">
                  이메일 리포트
                </h1>
                <p className="text-sm text-foreground-500">
                  주간 미션 분석 결과를 받아보세요
                </p>
              </div>
            </div>

            {/* 간단 요약 */}
            <div className="bg-background-100 rounded-xl p-5 mb-6">
              <h3 className="text-sm font-semibold text-foreground-700 mb-4">
                이메일로 받게 되는 내용
              </h3>
              <div className="space-y-3">
                {emailReportItems.map((item) => (
                  <div key={item.title} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-background-50 flex items-center justify-center shrink-0">
                      <i className={`${item.icon} text-foreground-400 text-sm w-4 h-4 flex items-center justify-center`} />
                    </div>
                    <p className="text-sm text-foreground-600 pt-1">{item.title}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 이메일 작성 input */}
            <div className="mb-6">
              <label className="text-sm font-medium text-foreground-700 block mb-2">
                이메일 주소
              </label>
              <div className="flex items-center gap-3 bg-background-100 rounded-xl px-4 py-3">
                <i className="ri-mail-line text-foreground-400 text-sm w-4 h-4 flex items-center justify-center" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-transparent text-sm text-foreground-950 outline-none flex-1"
                  placeholder="email@example.com"
                />
              </div>
            </div>

            {/* 동의 */}
            <div className="flex items-start gap-3 mb-8">
              <button
                type="button"
                onClick={handleToggleEmailConsent}
                className="mt-0.5 w-5 h-5 rounded border-2 border-background-300 flex items-center justify-center shrink-0 cursor-pointer"
              >
                {emailConsentChecked && (
                  <i className="ri-check-line text-primary-500 text-xs w-4 h-4 flex items-center justify-center" />
                )}
              </button>
              <p className="text-sm text-foreground-600 leading-relaxed">
                이메일 수신에 동의합니다
              </p>
            </div>

            {/* 제출 버튼 */}
            <button
              type="button"
              disabled={!emailConsentChecked || !email.trim() || isSubmittingConsent}
              onClick={handleReceiveMissionAnalysis}
              className={`
                w-full py-3.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap cursor-pointer
                ${emailConsentChecked && email.trim()
                  ? 'bg-primary-500 hover:bg-primary-600 text-background-50'
                  : 'bg-background-200 text-foreground-400 cursor-not-allowed'
                }
              `}
            >
              {isSubmittingConsent ? '처리 중' : '미션 분석 받기'}
            </button>
          </div>

          <BottomNav />

          {showEmailRequiredAlert && (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 px-6 animate-fade-in">
              <section className="w-full max-w-sm rounded-lg bg-background-50 p-6 text-center">
                <h2 className="mb-2 font-heading text-base font-bold text-foreground-950">
                  이메일을 먼저 입력해주세요
                </h2>
                <p className="mb-5 text-sm leading-relaxed text-foreground-700">
                  주간 미션 분석 결과를 받을 이메일 주소가 필요해요.
                </p>
                <Button className="py-3" onClick={() => setShowEmailRequiredAlert(false)}>
                  확인
                </Button>
              </section>
            </div>
          )}
      </>
    );
  }

  return (
    <>
        <div className="flex-1 overflow-y-auto pb-24">
          {/* 헤더 */}
          <div className="px-6 pt-6 pb-2">
            <p className="text-sm text-foreground-500">이번 주 미션</p>
            <h1 className="text-xl font-bold text-foreground-950 font-heading">
              행동 미션
            </h1>
          </div>

          {/* AI 소비패턴 분석 */}
          <div className="px-6 pb-4">
            <button
              type="button"
              onClick={() => navigate('/mission/analysis')}
              className="w-full bg-background-100 rounded-xl p-5 text-left hover:bg-background-200 transition-colors cursor-pointer group"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-xs font-medium text-accent-600 bg-accent-100 px-2 py-0.5 rounded-full">
                    AI 소비패턴 분석
                  </span>
	                  <h3 className="text-base font-bold text-foreground-950 mt-1">
	                    {currentMission ? '최근 7일 소비 패턴을 찾았어요' : '최근 7일 소비 분석을 준비 중이에요'}
	                  </h3>
                </div>
                <div className="w-6 h-6 flex items-center justify-center shrink-0 mt-1">
                  <i className="ri-arrow-right-s-line text-foreground-400 text-xl group-hover:text-primary-500 transition-colors w-5 h-5 flex items-center justify-center" />
                </div>
              </div>
              <p className="text-sm text-foreground-600 mt-2">
	                {currentMission
	                  ? `최근 7일 ${currentMission.topCategory.displayName} 지출에서 줄일 수 있는 부분을 찾아봤어요.`
	                  : '최근 7일 분석 결과가 만들어지면 절약할 수 있는 부분을 확인할 수 있어요.'}
	              </p>
              <p className="text-sm font-semibold text-primary-500 mt-1.5 group-hover:text-primary-600 transition-colors flex items-center gap-1">
                분석 결과 보기
                <i className="ri-arrow-right-line text-xs w-3 h-3 flex items-center justify-center" />
              </p>
            </button>
          </div>

          {/* 이번 주 미션 */}
          {isMissionLoading && (
            <div className="px-6 pb-4">
              <div className="flex items-center justify-center rounded-xl bg-background-100 p-8">
                <i className="ri-loader-4-line mr-2 animate-spin text-primary-500" />
                <span className="text-sm text-foreground-500">미션을 불러오는 중...</span>
              </div>
            </div>
          )}

          {!isMissionLoading && currentMission && (
            <div className="px-6 pb-4">
              <div className="border-2 border-accent-400 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-semibold text-background-50 bg-accent-500 px-2.5 py-1 rounded-full">
                    이번 주 미션
                  </span>
                </div>
                <h3 className="text-lg font-bold text-foreground-950 mb-2">
                  {currentMission.title}
                </h3>
                <p className="text-sm text-foreground-600 mb-4">
                  {currentMission.description}
                </p>

                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="bg-background-100 rounded-lg p-2.5 text-center">
                    <p className="text-xs text-foreground-400 mb-1">{currentMission.topCategory.displayName}</p>
                    <p className="text-base font-bold text-foreground-950">{currentMission.topCategoryRatio}%</p>
                    <p className="text-[10px] text-foreground-400">주요 지출</p>
                  </div>
                  <div className="bg-background-100 rounded-lg p-2.5 text-center">
                    <p className="text-xs text-foreground-400 mb-1">목표</p>
                    <p className="text-base font-bold text-foreground-950">{formatWon(currentMission.targetAmount)}</p>
                    <p className="text-[10px] text-foreground-400">절약 금액</p>
                  </div>
                  <div className="bg-background-100 rounded-lg p-2.5 text-center">
                    <p className="text-xs text-foreground-400 mb-1">마감</p>
                    <p className="text-base font-bold text-foreground-950">D-{currentMission.daysLeft}</p>
                    <p className="text-[10px] text-foreground-400">{currentMission.dueDate}까지</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => navigate('/mission/weekly')}
                  className="w-full bg-primary-500 hover:bg-primary-600 text-background-50 font-semibold py-3 rounded-lg text-sm transition-colors whitespace-nowrap cursor-pointer"
                >
                  미션 확인하기
                </button>
              </div>
            </div>
          )}

          {!isMissionLoading && !currentMission && (
            <div className="px-6 pb-6">
              <div className="rounded-xl bg-background-100 p-6 text-center">
                <p className="mb-4 text-sm text-foreground-500">
                  현재 진행 중인 미션이 없어요.
                </p>
                <Button className="py-3" onClick={() => navigate('/mission/analysis')}>
                  분석 결과 보기
                </Button>
              </div>
            </div>
          )}

          {completions && completions.completedCount > 0 && (
            <div className="px-6 pb-6">
              <h3 className="text-sm font-semibold text-foreground-700 mb-3">
                올해 완료한 미션
              </h3>
              <div className="rounded-xl bg-background-100 p-4">
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <p className="text-xs text-foreground-400">완료</p>
                    <p className="text-base font-bold text-foreground-950">{completions.completedCount}개</p>
                  </div>
                  <div>
                    <p className="text-xs text-foreground-400">절약</p>
                    <p className="text-base font-bold text-primary-600">{formatWon(completions.totalSavedAmount)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-foreground-400">연금 효과</p>
                    <p className="text-base font-bold text-accent-600">{formatWon(completions.totalPensionImpactAmount)}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <BottomNav />
    </>
  );
}
