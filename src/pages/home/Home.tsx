import { useNavigate } from 'react-router-dom';
import { isAxiosError } from 'axios';
import { useQuery } from '@tanstack/react-query';
import { getMyHome, type HomeSavedProduct } from '../../apis/home';
import BottomNav from '../../components/BottomNav';
import { saveSelectedProductRecommendation } from '../recommend/recommendationStorage';

function formatWon(amount: number) {
  return `${amount.toLocaleString('ko-KR')}원`;
}

function formatKoreanAsset(amount: number) {
  const manwon = Math.round(amount / 10000);

  if (manwon < 10000) {
    return `${manwon.toLocaleString('ko-KR')}만원`;
  }

  const eok = Math.floor(manwon / 10000);
  const rest = manwon % 10000;

  return rest > 0
    ? `${eok.toLocaleString('ko-KR')}억 ${rest.toLocaleString('ko-KR')}만원`
    : `${eok.toLocaleString('ko-KR')}억원`;
}

function SavedProductPreview({ product }: { product: HomeSavedProduct }) {
  const navigate = useNavigate();

  const handleDetail = () => {
    saveSelectedProductRecommendation(String(product.productId));
    navigate('/recommend/detail');
  };

  return (
    <button
      type="button"
      onClick={handleDetail}
      className="w-full rounded-xl border border-background-200 bg-background-50 p-4 text-left transition-colors hover:border-primary-200 hover:bg-primary-50/30"
    >
      <div className="mb-2 flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium text-foreground-500">{product.providerName}</p>
          <h4 className="mt-0.5 text-base font-bold text-foreground-950">
            {product.productName}
          </h4>
        </div>
        <i className="ri-arrow-right-line flex h-5 w-5 shrink-0 items-center justify-center text-foreground-400" />
      </div>
      <p className="mb-3 text-sm leading-relaxed text-foreground-600">
        {product.investmentScope}
      </p>
      <span className="text-xs font-semibold text-primary-600">
        연 {product.feeMinRate}%~{product.feeMaxRate}%
      </span>
    </button>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const {
    data: home,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['myHome'],
    queryFn: getMyHome,
    retry: false,
  });

  if (isLoading) {
    return (
      <>
        <div className="flex-1 overflow-y-auto pb-24">
          <div className="flex h-full flex-col items-center justify-center px-6">
            <i className="ri-loader-4-line mb-3 flex h-8 w-8 animate-spin items-center justify-center text-2xl text-primary-500" />
            <p className="text-sm text-foreground-500">홈 정보를 불러오는 중...</p>
          </div>
        </div>
        <BottomNav />
      </>
    );
  }

  if (isError || !home) {
    const errorMessage = isAxiosError(error)
      ? error.response?.data?.message
      : undefined;

    return (
      <>
        <div className="flex-1 overflow-y-auto pb-24">
          <div className="flex h-full flex-col items-center justify-center px-6 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-background-100">
              <i className="ri-home-line text-2xl text-foreground-400" />
            </div>
            <h1 className="mb-2 text-xl font-bold text-foreground-950">홈 정보를 불러오지 못했어요</h1>
            <p className="mb-6 text-sm leading-relaxed text-foreground-500">
              {errorMessage ?? '잠시 후 다시 시도해주세요.'}
            </p>
            <button
              type="button"
              onClick={() => navigate('/mypage')}
              className="w-full rounded-lg bg-primary-500 py-3.5 text-sm font-semibold text-background-50"
            >
              마이페이지로 가기
            </button>
          </div>
        </div>
        <BottomNav />
      </>
    );
  }

  return (
    <>
      <div className="flex-1 overflow-y-auto pb-24">
        <div className="px-6 pt-6 pb-2">
          <p className="text-sm text-foreground-500">안녕하세요,</p>
          <h1 className="text-xl font-bold text-foreground-950 font-heading">
            {home.nickname}님의 연금생활
          </h1>
        </div>

        <div className="px-6 pb-4">
          <div className="rounded-xl bg-primary-500 p-5 text-background-50">
            <div className="mb-5 flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-background-50/15">
                  <i className="ri-passport-line flex h-5 w-5 items-center justify-center text-base text-background-50" />
                </div>
                <span className="text-xs font-semibold text-primary-100">
                  연금 패스포트
                </span>
              </div>
              <span className="shrink-0 rounded-full bg-background-50/15 px-3 py-1 text-xs font-semibold text-primary-50">
                투자 성향
              </span>
            </div>

            <h3 className="mb-2 font-heading text-xl font-bold">
              {home.passport?.type.displayName ?? '아직 분석 전이에요'}
            </h3>

            <p className="mb-5 text-sm leading-relaxed text-primary-50">
              {home.passport?.typeSummary ?? '연금 리허설을 완료하면 내 성향을 확인할 수 있어요.'}
            </p>

            <button
              type="button"
              onClick={() => navigate(home.passport ? '/passport' : '/result-preview')}
              className="flex w-full items-center justify-between rounded-lg bg-background-50 px-4 py-3 text-sm font-semibold text-primary-700 transition-colors hover:bg-primary-50 cursor-pointer"
            >
              <span>{home.passport ? '패스포트 자세히 보기' : '리허설 하러 가기'}</span>
              <i className="ri-arrow-right-line flex h-4 w-4 items-center justify-center" />
            </button>
          </div>
        </div>

        <div className="px-6 pb-4">
          <div className="bg-background-100 rounded-xl p-5">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold text-foreground-700">
                  현재 진행 중인 연금계획
                </h3>
                <p className="mt-1 text-xs text-foreground-500">
                  {home.pensionPlan ? `${home.pensionPlan.contributionYears}년 뒤 예상 연금자산` : '내 연금계획을 만들어보세요'}
                </p>
              </div>
              <div className="shrink-0 rounded-full bg-primary-100 px-3 py-1 text-xs font-semibold text-primary-700">
                {home.pensionPlan ? '진행 중' : '준비 필요'}
              </div>
            </div>

            <div className="mb-4 rounded-xl bg-background-50 p-4">
              <div className="flex items-baseline gap-1">
                <span className="font-heading text-3xl font-bold text-primary-600">
                  {home.pensionPlan ? formatKoreanAsset(home.pensionPlan.expectedFutureAsset) : '-'}
                </span>
              </div>
            </div>

            <div className="mb-4 grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-background-50 p-3">
                <p className="mb-1 text-xs text-foreground-500">월 납입액</p>
                <p className="text-base font-bold text-foreground-950">
                  {home.pensionPlan ? formatWon(home.pensionPlan.monthlyContribution) : '-'}
                </p>
              </div>
              <div className="rounded-lg bg-background-50 p-3">
                <p className="mb-1 text-xs text-foreground-500">계좌</p>
                <p className="text-sm font-semibold leading-snug text-foreground-950">
                  {home.pensionPlan?.accountType.displayName ?? '-'}
                </p>
              </div>
            </div>

            <button
              type="button"
              className="flex items-center gap-1 text-sm font-medium text-primary-500 hover:text-primary-600 transition-colors cursor-pointer"
              onClick={() => navigate(home.pensionPlan ? '/plan-result' : '/account-select')}
            >
              {home.pensionPlan ? '계획 확인하기' : '계획 만들기'}
              <i className="ri-arrow-right-line w-4 h-4 flex items-center justify-center" />
            </button>
          </div>
        </div>

        <div className="px-6 pb-4">
          <div className="bg-accent-50 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-accent-800 mb-2">
              이번 주 행동 미션
            </h3>
            <h4 className="text-base font-bold text-foreground-950 mb-1">
              {home.mission?.title ?? '진행 중인 미션이 없어요'}
            </h4>
            <p className="text-sm text-foreground-600 mb-4">
              {home.mission
                ? `목표: ${formatWon(home.mission.targetAmount)} 절약`
                : '소비 분석을 받으면 이번 주 행동 미션을 확인할 수 있어요.'}
            </p>
            {home.mission && (
              <div className="mb-4 flex items-center justify-between rounded-lg bg-background-50/70 px-3 py-2">
                <span className="text-xs font-semibold text-foreground-600">
                  {home.mission.status.displayName}
                </span>
                <span className="text-xs font-semibold text-accent-700">
                  D-{home.mission.daysLeft} · {home.mission.dueDate}
                </span>
              </div>
            )}
            <button
              type="button"
              onClick={() => navigate(home.mission ? '/mission/weekly' : '/mission')}
              className="w-full bg-primary-500 hover:bg-primary-600 text-background-50 font-semibold py-3 rounded-lg text-sm transition-colors whitespace-nowrap cursor-pointer"
            >
              {home.mission ? '미션 확인하기' : '미션 받으러 가기'}
            </button>
          </div>
        </div>

        <div className="px-6 pb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-foreground-700">
              저장한 추천상품
            </h3>
            <button
              type="button"
              onClick={() => navigate('/recommend')}
              className="text-xs text-primary-500 hover:text-primary-600 transition-colors flex items-center gap-0.5 cursor-pointer whitespace-nowrap"
            >
              전체 보기
              <i className="ri-arrow-right-line w-3 h-3 flex items-center justify-center" />
            </button>
          </div>

          {home.savedProducts.length > 0 ? (
            <div className="space-y-3">
              {home.savedProducts.slice(0, 2).map((product) => (
                <SavedProductPreview key={product.productId} product={product} />
              ))}
            </div>
          ) : (
            <div className="rounded-xl bg-background-100 p-5 text-center">
              <p className="mb-4 text-sm text-foreground-500">
                아직 담아둔 상품이 없어요.
              </p>
              <button
                type="button"
                onClick={() => navigate('/recommend/start')}
                className="w-full rounded-lg bg-primary-500 py-3 text-sm font-semibold text-background-50"
              >
                추천 상품 보러 가기
              </button>
            </div>
          )}
        </div>
      </div>

      <BottomNav />
    </>
  );
}
