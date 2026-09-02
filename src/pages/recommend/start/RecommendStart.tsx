import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAxiosError } from 'axios';
import {
  createProductRecommendations,
  getMyProductRecommendations,
  type ProductRecommendation,
} from '../../../apis/recommend';
import RecommendProductCard from '../../../components/RecommendProductCard';
import BottomNav from '../../../components/BottomNav';
import {
  getStoredProductRecommendations,
  mapRecommendationToCardProduct,
  saveProductRecommendations,
} from '../recommendationStorage';

export default function RecommendStart() {
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState<ProductRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const storedRecommendations = getStoredProductRecommendations();

    if (storedRecommendations.length > 0) {
      setRecommendations(storedRecommendations);
      setIsLoading(false);
      return;
    }

    const fetchRecommendations = async () => {
      try {
        const existingRecommendations = await getMyProductRecommendations();

        saveProductRecommendations(existingRecommendations);
        setRecommendations(existingRecommendations);
      } catch (error) {
        if (isAxiosError(error) && error.response?.status === 404) {
          try {
            const nextRecommendations = await createProductRecommendations();

            saveProductRecommendations(nextRecommendations);
            setRecommendations(nextRecommendations);
          } catch (createError) {
            if (isAxiosError(createError)) {
              console.error('맞춤 연금 상품 추천 생성 실패 응답', createError.response?.data);
              setErrorMessage(createError.response?.data?.message ?? '상품 추천을 불러오지 못했어요.');
              return;
            }

            console.error('맞춤 연금 상품 추천 생성에 실패했어요.', createError);
            setErrorMessage('상품 추천을 불러오지 못했어요.');
          }

          return;
        }

        if (isAxiosError(error)) {
          console.error('맞춤 연금 상품 추천 조회 실패 응답', error.response?.data);
          setErrorMessage(error.response?.data?.message ?? '상품 추천을 불러오지 못했어요.');
          return;
        }

        console.error('맞춤 연금 상품 추천 조회에 실패했어요.', error);
        setErrorMessage('상품 추천을 불러오지 못했어요.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  const products = recommendations
    .slice()
    .sort((a, b) => a.rank - b.rank)
    .map(mapRecommendationToCardProduct);

  return (
    <>
        <div className="flex-1 overflow-y-auto pb-24">
      {/* 헤더 */}
      <div className="px-5 pt-6 pb-4 flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground-950">
            나에게 맞는
            <br />
            연금 상품
          </h1>
          <p className="text-sm text-foreground-500 mt-2">
            연금계획의 계좌 종류에 맞춰 추천했어요
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/recommend/compare')}
          className="text-sm font-medium text-primary-500 hover:text-primary-600 transition-colors whitespace-nowrap cursor-pointer pt-1"
        >
          비교하기
        </button>
      </div>

      {/* 상품 리스트 */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center px-5 py-20">
          <i className="ri-loader-4-line mb-3 flex h-8 w-8 animate-spin items-center justify-center text-2xl text-primary-500" />
          <p className="text-sm text-foreground-500">맞춤 상품을 찾는 중...</p>
        </div>
      )}

      {!isLoading && errorMessage && (
        <div className="px-5 mt-8">
          <div className="rounded-xl bg-background-100 p-6 text-center">
            <p className="mb-4 text-sm leading-relaxed text-foreground-600">
              {errorMessage}
            </p>
            <button
              type="button"
              onClick={() => navigate('/plan-result')}
              className="w-full rounded-lg bg-primary-500 py-3.5 text-sm font-semibold text-background-50"
            >
              연금계획 확인하기
            </button>
          </div>
        </div>
      )}

      {!isLoading && !errorMessage && (
        <div className="px-5 space-y-4 mt-2">
          {products.map((product, idx) => (
            <RecommendProductCard
              key={product.id}
              product={product}
              rank={idx + 1}
            />
          ))}
        </div>
      )}
        </div>
        <BottomNav />
    </>
  );
}
