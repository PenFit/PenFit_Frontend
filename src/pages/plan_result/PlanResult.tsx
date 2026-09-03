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

  const assetAllocation = plan.assetAllocation ?? {
    stockRatio: 0,
    bondRatio: 0,
    depositRatio: 0,
  };
  const accountTypeName = plan.accountType?.displayName ?? '-';
  const advantages = Array.isArray(plan.advantages) ? plan.advantages : [];

  return (
    <>
      <div className="flex-1 overflow-y-auto pb-24">
        <section className="px-6 pb-5 pt-6">
          <div className="rounded-2xl border border-primary-100 bg-primary-50 p-5 shadow-sm">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="mb-1 text-xs font-medium text-primary-700">
                  맞춤 연금 계획
                </p>
                <h1 className="font-heading text-2xl font-bold leading-tight text-foreground-950">
                  {plan.planName}
                </h1>
              </div>
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary-500">
                <i className="ri-sparkling-2-line flex h-6 w-6 items-center justify-center text-xl" />
              </div>
            </div>

            <p className="text-sm leading-relaxed text-foreground-700">
              {plan.recommendationReason}
            </p>
          </div>
        </section>

        {/* 핵심 지표 */}
        <div className="grid grid-cols-2 gap-3 px-6 pb-5">
          <div className="rounded-2xl bg-primary-50 p-4">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-primary-500 text-background-50">
              <i className="ri-wallet-3-line flex h-5 w-5 items-center justify-center text-lg" />
            </div>
            <p className="mb-1 text-xs font-medium text-primary-700">월 납입액</p>
            <p className="text-xl font-bold text-foreground-950">
              {formatWon(plan.monthlyContribution)}
            </p>
          </div>
          <div className="rounded-2xl bg-background-100 p-4">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-secondary-500 text-background-50">
              <i className="ri-line-chart-line flex h-5 w-5 items-center justify-center text-lg" />
            </div>
            <p className="mb-1 text-xs font-medium text-foreground-500">
              {plan.contributionYears}년 예상
            </p>
            <p className="text-lg font-bold leading-tight text-primary-600">
              {formatKoreanAsset(plan.expectedFutureAsset)}
            </p>
          </div>
          <div className="col-span-2 rounded-2xl border border-background-200 bg-background-50 p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="mb-1 text-xs font-medium text-foreground-500">추천 계좌</p>
                <p className="text-base font-bold text-foreground-950">
                  {accountTypeName}
                </p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-background-100 text-secondary-600">
                <i className="ri-bank-card-line flex h-5 w-5 items-center justify-center text-lg" />
              </div>
            </div>
          </div>
        </div>

        {/* 자산 비율 */}
        <div className="px-6 pb-4">
          <h3 className="text-base font-bold text-foreground-950 mb-3">
            자산 구성
          </h3>
          <div className="rounded-2xl bg-background-100 p-4">
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
          <div className="space-y-3 rounded-2xl bg-background-100 p-4">
            {advantages.length > 0 ? (
              advantages.map((advantage) => (
                <div key={advantage} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary-500 flex items-center justify-center shrink-0 mt-0.5">
                    <i className="ri-check-line text-background-50 text-xs w-3 h-3 flex items-center justify-center" />
                  </div>
                  <p className="text-sm text-foreground-700">{advantage}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-foreground-500">
                계획 장점 정보가 아직 없어요.
              </p>
            )}
          </div>
          <div className="mt-4 bg-background-200 rounded-xl p-3">
            <p className="text-xs text-foreground-500 text-center">
              이 계획은 예상치일 뿐 실제 수익률과 다를 수 있어요
            </p>
          </div>
        </div>

        <div className="px-6">
          <button
            type="button"
            onClick={() => navigate('/home')}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary-500 py-4 text-sm font-semibold text-background-50 transition-colors hover:bg-primary-600"
          >
            <i className="ri-home-5-line flex h-5 w-5 items-center justify-center text-lg" />
            홈으로 가기
          </button>
        </div>
      </div>

      <BottomNav />
    </>
  );
}
