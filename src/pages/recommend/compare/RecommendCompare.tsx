import { useNavigate } from 'react-router-dom';
import { isAxiosError } from 'axios';
import { useQuery } from '@tanstack/react-query';
import {
  getMySavedProducts,
  getPensionProductDetail,
  getProductRecommendationComparison,
  type ProductRecommendationComparison,
  type ProductRecommendationComparisonItem,
} from '../../../apis/recommend';
import BottomNav from '../../../components/BottomNav';
import { getStoredProductRecommendations } from '../recommendationStorage';

const compareCriteria = [
  { key: 'fee', label: '수수료' },
  { key: 'investmentScope', label: '투자상품 선택 범위' },
  { key: 'fitLevel', label: '적합도' },
];

const SAVED_PRODUCT_FIT_LEVEL = {
  code: 'SAVED_PRODUCT',
  displayName: '담은 상품',
};

function getSavedAtTime(savedAt: string) {
  const savedAtTime = new Date(savedAt).getTime();

  return Number.isFinite(savedAtTime) ? savedAtTime : Number.MAX_SAFE_INTEGER;
}

async function getComparisonWithFallback(): Promise<ProductRecommendationComparison> {
  try {
    return await getProductRecommendationComparison();
  } catch (error) {
    if (!isAxiosError(error) || error.response?.status !== 404) {
      throw error;
    }

    const storedRecommendations = getStoredProductRecommendations()
      .slice()
      .sort((a, b) => a.rank - b.rank)
      .slice(0, 3);

    if (storedRecommendations.length > 0) {
      const products = await Promise.all(
        storedRecommendations.map(async (recommendation) => {
          const detail = await getPensionProductDetail(recommendation.productId);

          return {
            rank: recommendation.rank,
            productId: recommendation.productId,
            providerName: detail.providerName,
            productName: detail.productName,
            feeMinRate: detail.feeMinRate,
            feeMaxRate: detail.feeMaxRate,
            investmentScope: detail.investmentScope,
            fitLevel: recommendation.fitLevel,
          };
        }),
      );

      return { products };
    }

    const savedProducts = await getMySavedProducts();
    const products: ProductRecommendationComparisonItem[] = savedProducts
      .slice()
      .sort((a, b) => getSavedAtTime(a.savedAt) - getSavedAtTime(b.savedAt))
      .slice(0, 3)
      .map((product, index) => ({
        rank: index + 1,
        productId: product.productId,
        providerName: product.providerName,
        productName: product.productName,
        feeMinRate: product.feeMinRate,
        feeMaxRate: product.feeMaxRate,
        investmentScope: product.investmentScope,
        fitLevel: SAVED_PRODUCT_FIT_LEVEL,
      }));

    if (products.length === 0) {
      throw error;
    }

    return { products };
  }
}

export default function RecommendCompare() {
  const navigate = useNavigate();
  const {
    data: comparison,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['productRecommendationComparison'],
    queryFn: getComparisonWithFallback,
    retry: false,
  });

  const products = comparison?.products
    .slice()
    .sort((a, b) => a.rank - b.rank)
    .slice(0, 3) ?? [];
  const primaryProductId = products[0]?.productId;

  const getValue = (product: (typeof products)[number], key: string) => {
    switch (key) {
      case 'fee':
        return `연 ${product.feeMinRate}%~${product.feeMaxRate}%`;
      case 'investmentScope':
        return product.investmentScope;
      case 'fitLevel':
        return product.fitLevel.displayName;
      default:
        return '';
    }
  };

  if (isLoading) {
    return (
      <>
        <div className="flex-1 overflow-y-auto pb-24">
          <div className="flex h-full flex-col items-center justify-center px-5">
            <i className="ri-loader-4-line mb-3 flex h-8 w-8 animate-spin items-center justify-center text-2xl text-primary-500" />
            <p className="text-sm text-foreground-500">비교 정보를 불러오는 중...</p>
          </div>
        </div>
        <BottomNav />
      </>
    );
  }

  if (isError || products.length === 0) {
    const errorMessage = isAxiosError(error)
      ? error.response?.data?.message
      : undefined;

    return (
      <>
        <div className="flex-1 overflow-y-auto pb-24">
          <div className="flex h-full flex-col items-center justify-center px-5 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-background-100">
              <i className="ri-gift-line text-2xl text-foreground-400" />
            </div>
            <h1 className="mb-2 text-xl font-bold text-foreground-950">
              비교할 상품이 없어요
            </h1>
            <p className="mb-6 text-sm leading-relaxed text-foreground-500">
              {errorMessage ?? '맞춤 추천을 먼저 받은 뒤 상품을 비교할 수 있어요.'}
            </p>
            <button
              type="button"
              onClick={() => navigate('/recommend/start')}
              className="w-full rounded-lg bg-primary-500 py-3.5 text-sm font-semibold text-background-50"
            >
              상품 추천 받기
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
      {/* 헤더 */}
      <div className="px-5 pt-6 pb-4">
        <h1 className="text-xl font-bold text-foreground-950">상품 비교</h1>
        <p className="text-sm text-foreground-500 mt-1">
          추천된 세 가지 상품을 한눈에 비교해보세요
        </p>
      </div>

      {/* 비교 테이블 */}
      <div className="px-5 mt-2">
        <div className="overflow-x-auto rounded-xl border border-background-200 bg-background-50">
          <div className="min-w-130">
            {/* 테이블 헤더*/}
            <div className="grid grid-cols-[88px_repeat(3,minmax(144px,1fr))] border-b border-background-200">
              <div className="flex items-center justify-center bg-background-100 p-3 text-xs font-semibold text-foreground-500">
                비교 기준
              </div>
              {products.map((product, index) => {
                const isPrimary = product.productId === primaryProductId;

                return (
                  <div
                    key={product.productId}
                    className={`flex items-center justify-center p-3 text-xs font-bold ${
                      isPrimary ? 'bg-primary-50 text-primary-700' : 'bg-background-100 text-foreground-700'
                    }`}
                  >
                    {String.fromCharCode(65 + index)}상품
                  </div>
                );
              })}
            </div>

            {/* 상품명 */}
            <div className="grid grid-cols-[88px_repeat(3,minmax(144px,1fr))] border-b border-background-200">
              <div className="flex items-center bg-background-100 p-3 text-xs font-semibold text-foreground-500">
                상품명
              </div>
              {products.map((product) => {
                const isPrimary = product.productId === primaryProductId;

                return (
                  <div
                    key={product.productId}
                    className={`p-3 text-center text-sm font-bold text-foreground-950 ${
                      isPrimary ? 'bg-primary-50' : 'bg-background-100'
                    }`}
                  >
                    {product.providerName}
                    <br />
                    <span className="text-xs font-normal text-foreground-500">
                      {product.productName}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* 조건 만족하는 행 */}
            {compareCriteria.map((criteria) => (
              <div
                key={criteria.key}
                className="grid grid-cols-[88px_repeat(3,minmax(144px,1fr))] border-b border-background-200 last:border-b-0"
              >
                <div className="flex items-center bg-background-100 p-3 text-xs font-semibold text-foreground-600">
                  {criteria.label}
                </div>
                {products.map((product) => {
                  const isPrimary = product.productId === primaryProductId;

                  return (
                    <div
                      key={`${criteria.key}-${product.productId}`}
                      className={`p-3 text-center text-sm leading-relaxed text-foreground-800 whitespace-pre-line ${
                        isPrimary ? 'bg-primary-50' : 'bg-background-100'
                      }`}
                    >
                      {getValue(product, criteria.key)}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
        <p className="mt-2 text-[11px] text-foreground-400">
          좌우로 밀어 C상품까지 비교할 수 있어요.
        </p>
      </div>

      {/* 경고 */}
      <div className="px-5 mt-4">
        <p className="text-xs text-foreground-400 leading-relaxed bg-background-100 rounded-lg p-3">
          세부 조건과 가입 가능 여부는 상품 가입 전 금융회사 공식 채널에서 확인하세요.
        </p>
      </div>

      {/* 돌아가기 버튼 */}
      <div className="px-5 mt-6 space-y-3">
        <button
          type="button"
          onClick={() => navigate('/recommend/start')}
          className="w-full border border-background-300 text-foreground-700 font-medium py-3 rounded-lg cursor-pointer whitespace-nowrap"
        >
          돌아가기
        </button>
      </div>
        </div>
        <BottomNav />
    </>
  );
}
