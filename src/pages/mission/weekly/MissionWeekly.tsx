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

function formatWon(amount?: number | null) {
  return `${(amount ?? 0).toLocaleString('ko-KR')}원`;
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
  const [showCompleteConfirm, setShowCompleteConfirm] = useState(false);
  const {
    data: mission,
    isLoading,
    isError,
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

    setShowCompleteConfirm(false);
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
    return (
      <>
        <div className="flex-1 overflow-y-auto pb-24 px-6 pt-6">
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-background-100">
              <i className="ri-flag-line text-2xl text-foreground-400" />
            </div>
            <h1 className="mb-2 text-xl font-bold text-foreground-950">진행할 미션이 없어요</h1>
            <p className="mb-6 text-sm leading-relaxed text-foreground-500">
              소비 분석을 먼저 받고 행동 미션을 확인해주세요.
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

  const missionStatusCode = mission.status?.code ?? '';
  const started = isStartedStatus(missionStatusCode);
  const completed = isCompletedStatus(missionStatusCode);
  const statusDisplayName = mission.status?.displayName ?? '미션';
  const topCategoryDisplayName = mission.topCategory?.displayName ?? '주요 지출';
  const topCategoryRatio = mission.topCategoryRatio ?? 0;
  const daysLeft = mission.daysLeft ?? 0;
  const durationDays = mission.durationDays ?? 0;
  const dueDate = mission.dueDate ?? '';

  return (
    <>
      <div className="flex-1 overflow-y-auto pb-24 px-6 pt-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-foreground-950 font-heading">
            이번 주 미션
          </h1>
          <span className="text-xs font-semibold text-background-50 bg-accent-500 px-2.5 py-1 rounded-full">
            D-{daysLeft}
          </span>
        </div>

        <div className="border-2 border-accent-400 rounded-xl p-5 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-semibold text-background-50 bg-accent-500 px-2.5 py-1 rounded-full">
              {statusDisplayName}
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
                  {topCategoryDisplayName} {topCategoryRatio}%
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
              <p className="text-xs text-foreground-400">{durationDays}일 동안</p>
            </div>
            <div className="flex items-center gap-3 bg-background-100 rounded-lg p-3">
              <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center shrink-0">
                <i className="ri-calendar-line text-primary-500 text-sm w-4 h-4 flex items-center justify-center" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-foreground-500">마감일</p>
                <p className="text-sm font-semibold text-foreground-950">{dueDate}</p>
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

          {started && !completed && (
            <div className="mb-5 rounded-xl border border-primary-100 bg-primary-50 p-4">
              <div className="mb-2 flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary-500">
                  <i className="ri-run-line flex h-4 w-4 items-center justify-center text-sm text-background-50" />
                </div>
                <p className="text-sm font-bold text-primary-700">
                  진행 중인 미션
                </p>
              </div>
              <p className="text-sm leading-relaxed text-foreground-700">
                오늘부터 이 목표를 실천해보세요. 완료했다면 아래 버튼으로 기록할 수 있어요.
              </p>
            </div>
          )}

	          <button
	            type="button"
	            disabled={isSubmitting}
	            onClick={completed ? () => navigate('/mission/complete') : started ? () => setShowCompleteConfirm(true) : handleStart}
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

      {showCompleteConfirm && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 px-6 animate-fade-in">
          <section className="w-full max-w-sm rounded-xl bg-background-50 p-6 text-center shadow-lg">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary-50">
              <i className="ri-checkbox-circle-line flex h-7 w-7 items-center justify-center text-2xl text-primary-500" />
            </div>
            <h2 className="mb-2 font-heading text-lg font-bold text-foreground-950">
              이번 주 미션을 완료했나요?
            </h2>
            <p className="mb-6 text-sm leading-relaxed text-foreground-600">
              완료하면 이번 주 절약 성과와 예상 연금자산 증가분이 기록돼요.
            </p>
            <div className="space-y-3">
              <button
                type="button"
                onClick={handleComplete}
                disabled={isSubmitting}
                className="w-full rounded-lg bg-primary-500 py-3.5 text-sm font-semibold text-background-50 transition-colors hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? '완료 처리 중' : '완료하기'}
              </button>
              <button
                type="button"
                onClick={() => setShowCompleteConfirm(false)}
                disabled={isSubmitting}
                className="w-full rounded-lg bg-background-100 py-3.5 text-sm font-semibold text-foreground-700 transition-colors hover:bg-background-200 disabled:cursor-not-allowed disabled:opacity-60"
              >
                계속 진행하기
              </button>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
