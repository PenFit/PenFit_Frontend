import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { getMyPensionPlan } from '../../apis/plan';
import BottomNav from '../../components/BottomNav';
import Button from '../../components/Button';

function formatWon(amount: number) {
  return `${amount.toLocaleString('ko-KR')}원`;
}

function formatKoreanAsset(amount: number) {
  const manwon = Math.floor(amount / 10000);

  if (manwon < 10000) {
    return `${manwon.toLocaleString('ko-KR')}만원`;
  }

  const eok = Math.floor(manwon / 10000);
  const rest = manwon % 10000;

  return rest > 0
    ? `${eok.toLocaleString('ko-KR')}억 ${rest.toLocaleString('ko-KR')}만원`
    : `${eok.toLocaleString('ko-KR')}억원`;
}

function formatPercent(value: number) {
  return `${value.toLocaleString('ko-KR')}%`;
}

export default function PlanResult() {
  const navigate = useNavigate();
  const {
    data: plan,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['myPensionPlan'],
    queryFn: getMyPensionPlan,
    retry: false,
  });

  if (isLoading) {
    return (
      <>
        <div className="flex-1 overflow-y-auto pb-24">
          <div className="flex h-full flex-col items-center justify-center px-6">
            <i className="ri-loader-4-line mb-3 flex h-8 w-8 animate-spin items-center justify-center text-2xl text-primary-500" />
            <p className="text-sm text-foreground-500">연금계획을 불러오는 중...</p>
          </div>
        </div>
        <BottomNav />
      </>
    );
  }

  if (isError || !plan) {
    return (
      <>
        <div className="flex-1 overflow-y-auto pb-24">
          <div className="flex h-full flex-col items-center justify-center px-6 text-center">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-background-100">
              <i className="ri-file-list-3-line flex h-8 w-8 items-center justify-center text-2xl text-foreground-400" />
            </div>
            <h1 className="mb-2 text-xl font-bold text-foreground-950 font-heading">
              연금계획이 아직 없어요
            </h1>
            <p className="mb-6 text-sm leading-relaxed text-foreground-500">
              리허설 분석을 완료하면 맞춤 연금계획을 확인할 수 있어요.
            </p>
            <Button className="py-3" onClick={() => navigate('/result-preview')}>
              리허설 하러 가기
            </Button>
          </div>
        </div>
        <BottomNav />
      </>
    );
  }

  const { assetAllocation } = plan;

  return (
    <>
      <div className="flex-1 overflow-y-auto pb-24">
        {/* 헤더 */}
        <div className="px-6 pt-6 pb-2">
          <h1 className="text-xl font-bold text-foreground-950 font-heading">
            {plan.planName}
          </h1>
          <p className="text-sm text-foreground-500">
            {plan.recommendationReason}
          </p>
        </div>

        {/* 요약 */}
        <div className="px-6 pb-4 grid grid-cols-3 gap-3">
          <div className="bg-background-100 rounded-xl p-4 text-center">
            <p className="text-xs text-foreground-500 mb-1">월 납입액</p>
            <p className="text-base font-bold text-foreground-950">
              {formatWon(plan.monthlyContribution)}
            </p>
          </div>
          <div className="bg-background-100 rounded-xl p-4 text-center">
            <p className="text-xs text-foreground-500 mb-1">{plan.contributionYears}년 예상</p>
            <p className="text-base font-bold text-primary-600">
              {formatKoreanAsset(plan.expectedFutureAsset)}
            </p>
          </div>
          <div className="bg-background-100 rounded-xl p-4 text-center">
            <p className="text-xs text-foreground-500 mb-1">계좌</p>
            <p className="text-sm font-semibold text-foreground-950">
              {plan.accountType.displayName}
            </p>
          </div>
        </div>

        {/* 자산 비율 */}
        <div className="px-6 pb-4">
          <h3 className="text-base font-bold text-foreground-950 mb-3">
            자산 구성
          </h3>
          <div className="bg-background-100 rounded-xl p-4">
            <div className="flex gap-1 mb-4">
              <div
                className="h-3 rounded-full bg-primary-500"
                style={{ width: `${assetAllocation.stockRatio}%` }}
              />
              <div
                className="h-3 rounded-full bg-secondary-500"
                style={{ width: `${assetAllocation.bondRatio}%` }}
              />
              <div
                className="h-3 rounded-full bg-accent-500"
                style={{ width: `${assetAllocation.depositRatio}%` }}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary-500" />
                  <span className="text-sm text-foreground-700">주식</span>
                </div>
                <span className="text-sm font-bold text-foreground-950">
                  {formatPercent(assetAllocation.stockRatio)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-secondary-500" />
                  <span className="text-sm text-foreground-700">채권</span>
                </div>
                <span className="text-sm font-bold text-foreground-950">
                  {formatPercent(assetAllocation.bondRatio)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-accent-500" />
                  <span className="text-sm text-foreground-700">예금</span>
                </div>
                <span className="text-sm font-bold text-foreground-950">
                  {formatPercent(assetAllocation.depositRatio)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 장점 */}
        <div className="px-6 pb-6">
          <h3 className="text-base font-bold text-foreground-950 mb-3">
            이 계획의 장점
          </h3>
          <div className="space-y-3">
            {plan.advantages.map((advantage) => (
              <div key={advantage} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-primary-500 flex items-center justify-center shrink-0 mt-0.5">
                  <i className="ri-check-line text-background-50 text-xs w-3 h-3 flex items-center justify-center" />
                </div>
                <p className="text-sm text-foreground-700">{advantage}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 bg-background-200 rounded-xl p-3">
            <p className="text-xs text-foreground-500 text-center">
              이 계획은 예상치일 뿐 실제 수익률과 다를 수 있어요
            </p>
          </div>
        </div>
      </div>

      <BottomNav />
    </>
  );
}
