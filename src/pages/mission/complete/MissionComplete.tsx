import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  getBehaviorMissionCompletions,
  type BehaviorMission,
  type BehaviorMissionCompletion,
} from '../../../apis/mission';
import BottomNav from '../../../components/BottomNav';

function formatWon(amount: number) {
  return `${amount.toLocaleString('ko-KR')}원`;
}

function getStoredCompletedMission() {
  const storedMission = sessionStorage.getItem('completedBehaviorMission');

  if (!storedMission) {
    return null;
  }

  try {
    return JSON.parse(storedMission) as BehaviorMission;
  } catch {
    return null;
  }
}

export default function MissionComplete() {
  const navigate = useNavigate();
  const storedMission = useMemo(() => getStoredCompletedMission(), []);
  const { data: completions } = useQuery({
    queryKey: ['behaviorMissionCompletions'],
    queryFn: () => getBehaviorMissionCompletions(),
    enabled: !storedMission,
    retry: false,
  });

  const latestCompletion: BehaviorMissionCompletion | null =
    completions?.completions[0] ?? null;
  const title = storedMission?.title ?? latestCompletion?.title ?? '미션 완료!';
  const targetAmount = storedMission?.targetAmount ?? latestCompletion?.targetAmount ?? 0;
  const pensionImpactAmount =
    storedMission?.pensionImpactAmount ?? latestCompletion?.pensionImpactAmount ?? 0;
  const monthlySavedAmount = targetAmount * 4;

  return (
    <>
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-24">
        <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center mb-6 animate-fade-in">
          <i className="ri-check-line text-primary-500 text-4xl w-10 h-10 flex items-center justify-center" />
        </div>

        <h1 className="text-2xl font-bold text-foreground-950 font-heading mb-2 animate-fade-in">
          미션 완료!
        </h1>
        <p className="text-sm text-foreground-600 mb-10 animate-fade-in">
          {title}
        </p>

	        <div className="text-center mb-8 animate-fade-in">
	          <p className="text-xs text-foreground-500 mb-1">
	            이번 주 아낀 금액
	          </p>
	          <p className="text-4xl font-bold text-primary-500">
	            {formatWon(targetAmount)}
	          </p>
	          <p className="mt-3 text-sm leading-relaxed text-foreground-600">
	            매주 이만큼 아끼면 한 달에 약 {formatWon(monthlySavedAmount)}을 확보할 수 있어요
	          </p>
	        </div>

        <div className="w-full bg-primary-50 rounded-xl p-5 mb-10 animate-fade-in">
          <p className="text-sm font-semibold text-primary-800 text-center mb-2">
            연금계획에 미치는 영향
          </p>
	          <p className="text-sm text-foreground-700 text-center leading-relaxed">
	            이번 주 절약한 금액을 30년간 매월 추가 납입하면
	          </p>
	          <div className="mt-3 text-center">
	            <span className="text-lg font-bold text-primary-600">
	              예상 연금자산이 약 {formatWon(pensionImpactAmount)} 늘어날 수 있어요
	            </span>
	          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate('/mission')}
          className="w-full bg-primary-500 hover:bg-primary-600 text-background-50 font-semibold py-3.5 rounded-xl text-sm transition-colors whitespace-nowrap cursor-pointer animate-fade-in"
        >
          미션 홈으로 가기
        </button>
      </div>

      <BottomNav />
    </>
  );
}
