import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAxiosError } from 'axios';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  completeBehaviorMission,
  getCurrentBehaviorMission,
  startBehaviorMission,
} from '../../../apis/mission';
import BottomNav from '../../../components/BottomNav';
import Button from '../../../components/Button';

function formatWon(amount: number) {
  return `${amount.toLocaleString('ko-KR')}원`;
}

function isStartedStatus(code: string) {
  return ['IN_PROGRESS', 'STARTED', 'PROGRESS', 'ACTIVE'].includes(code);
}

function isCompletedStatus(code: string) {
  return ['COMPLETED', 'COMPLETE', 'DONE'].includes(code);
}

export default function MissionWeekly() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    data: mission,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['currentBehaviorMission'],
    queryFn: getCurrentBehaviorMission,
    retry: false,
  });

  const handleStart = async () => {
    if (!mission || isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      const startedMission = await startBehaviorMission(mission.missionId);

      queryClient.setQueryData(['currentBehaviorMission'], startedMission);
    } catch (error) {
      if (isAxiosError(error)) {
        console.error('행동 미션 시작 실패 응답', error.response?.data);
      }
      console.error('행동 미션 시작에 실패했어요.', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleComplete = async () => {
    if (!mission || isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      const completedMission = await completeBehaviorMission(mission.missionId);

      queryClient.setQueryData(['currentBehaviorMission'], completedMission);
      queryClient.invalidateQueries({ queryKey: ['behaviorMissionCompletions'] });
      navigate('/mission/complete');
    } catch (error) {
      if (isAxiosError(error)) {
        console.error('행동 미션 완료 실패 응답', error.response?.data);
      }
      console.error('행동 미션 완료에 실패했어요.', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <>
        <div className="flex-1 overflow-y-auto pb-24 px-6 pt-6">
          <div className="flex h-full flex-col items-center justify-center">
            <i className="ri-loader-4-line mb-3 flex h-8 w-8 animate-spin items-center justify-center text-2xl text-primary-500" />
            <p className="text-sm text-foreground-500">미션을 불러오는 중...</p>
          </div>
        </div>
        <BottomNav />
      </>
    );
  }

  if (isError || !mission) {
    const errorMessage = isAxiosError(error)
      ? error.response?.data?.message
      : undefined;

    return (
      <>
        <div className="flex-1 overflow-y-auto pb-24 px-6 pt-6">
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-background-100">
              <i className="ri-flag-line text-2xl text-foreground-400" />
            </div>
            <h1 className="mb-2 text-xl font-bold text-foreground-950">진행할 미션이 없어요</h1>
            <p className="mb-6 text-sm leading-relaxed text-foreground-500">
              {errorMessage ?? '소비 분석을 먼저 받고 행동 미션을 확인해주세요.'}
            </p>
            <Button className="py-3" onClick={() => navigate('/mission')}>
              미션 홈으로 가기
            </Button>
          </div>
        </div>
        <BottomNav />
      </>
    );
  }

  const started = isStartedStatus(mission.status.code);
  const completed = isCompletedStatus(mission.status.code);

  return (
    <>
      <div className="flex-1 overflow-y-auto pb-24 px-6 pt-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-foreground-950 font-heading">
            이번 주 미션
          </h1>
          <span className="text-xs font-semibold text-background-50 bg-accent-500 px-2.5 py-1 rounded-full">
            D-{mission.daysLeft}
          </span>
        </div>

        <div className="border-2 border-accent-400 rounded-xl p-5 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-semibold text-background-50 bg-accent-500 px-2.5 py-1 rounded-full">
              {mission.status.displayName}
            </span>
          </div>
          <h2 className="text-xl font-bold text-foreground-950 mb-2">
            {mission.title}
          </h2>
          <p className="text-sm text-foreground-600 leading-relaxed mb-4">
            {mission.description}
          </p>

          <div className="space-y-3 mb-5">
            <div className="flex items-center gap-3 bg-background-100 rounded-lg p-3">
              <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center shrink-0">
                <i className="ri-pie-chart-line text-primary-500 text-sm w-4 h-4 flex items-center justify-center" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-foreground-500">주요 지출</p>
                <p className="text-sm font-semibold text-foreground-950">
                  {mission.topCategory.displayName} {mission.topCategoryRatio}%
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-background-100 rounded-lg p-3">
              <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center shrink-0">
                <i className="ri-coin-line text-primary-500 text-sm w-4 h-4 flex items-center justify-center" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-foreground-500">목표 금액</p>
                <p className="text-sm font-semibold text-foreground-950">
                  {formatWon(mission.targetAmount)}
                </p>
              </div>
              <p className="text-xs text-foreground-400">{mission.durationDays}일 동안</p>
            </div>
            <div className="flex items-center gap-3 bg-background-100 rounded-lg p-3">
              <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center shrink-0">
                <i className="ri-calendar-line text-primary-500 text-sm w-4 h-4 flex items-center justify-center" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-foreground-500">마감일</p>
                <p className="text-sm font-semibold text-foreground-950">{mission.dueDate}</p>
              </div>
            </div>
          </div>

          <div className="bg-accent-50 rounded-lg p-4 mb-5">
            <div className="flex items-center gap-2 mb-1">
              <i className="ri-focus-3-line text-accent-600 text-sm w-4 h-4 flex items-center justify-center" />
              <span className="text-xs font-semibold text-accent-700">
                미션 이유
              </span>
            </div>
            <p className="text-sm font-semibold text-foreground-950">
              {mission.reason}
            </p>
          </div>

          <div className="flex items-center gap-2 mb-5">
            <i className="ri-gift-line text-primary-500 text-sm w-4 h-4 flex items-center justify-center" />
            <span className="text-sm text-foreground-600">
              예상 연금자산 증가: <span className="font-semibold text-primary-600">{formatWon(mission.pensionImpactAmount)}</span>
            </span>
          </div>

	          <button
	            type="button"
	            disabled={isSubmitting}
	            onClick={completed ? () => navigate('/mission/complete') : started ? handleComplete : handleStart}
	            className={`w-full rounded-xl py-3.5 text-sm font-semibold text-background-50 transition-colors whitespace-nowrap ${
	              isSubmitting
	                ? 'cursor-not-allowed bg-background-300'
	                : 'cursor-pointer bg-primary-500 hover:bg-primary-600'
	            }`}
	          >
	            {isSubmitting ? '처리 중' : completed ? '완료 결과 보기' : started ? '미션 완료하기' : '미션 시작하기'}
	          </button>
        </div>
      </div>

      <BottomNav />
    </>
  );
}
