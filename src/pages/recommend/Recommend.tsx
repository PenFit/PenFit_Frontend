import { useNavigate } from 'react-router-dom';
import { isAxiosError } from 'axios';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { deleteSavedProduct, getMySavedProducts } from '../../apis/recommend';
import BottomNav from '../../components/BottomNav';
import { saveSelectedProductRecommendation } from './recommendationStorage';

export default function RecommendMain() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [deleteErrorMessage, setDeleteErrorMessage] = useState('');
  const {
    data: savedProducts = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['mySavedProducts'],
    queryFn: getMySavedProducts,
  });

  const handleDetail = (productId: number) => {
    saveSelectedProductRecommendation(String(productId));
    navigate('/recommend/detail');
  };

  const handleDelete = async (productId: number) => {
    setDeleteErrorMessage('');

    try {
      await deleteSavedProduct(productId);

      queryClient.invalidateQueries({ queryKey: ['mySavedProducts'] });
      queryClient.invalidateQueries({ queryKey: ['pensionProductDetail', productId] });
    } catch (error) {
      if (isAxiosError(error)) {
        console.error('담은 상품 취소 실패 응답', error.response?.data);
      }
      console.error('담은 상품 취소에 실패했어요.', error);
      setDeleteErrorMessage('담은 상품을 취소하지 못했어요. 다시 시도해주세요.');
    }
  };

  const errorMessage = isAxiosError(error)
    ? error.response?.data?.message
    : undefined;

  return (
    <>
        <div className="flex-1 overflow-y-auto pb-24">
      {/* 헤더 */}
      <div className="px-5 pt-6 pb-4 flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-foreground-950">
            내가 담은 상품 리스트
          </h1>
          <p className="text-sm text-foreground-500 mt-1">
            관심 있는 연금 상품을 모아서 비교하고 상세 정보를 확인하세요
          </p>
        </div>
        {savedProducts.length > 0 && (
          <button
            type="button"
            onClick={() => navigate('/recommend/start')}
            className="shrink-0 mt-1 inline-flex items-center gap-1 text-sm font-semibold text-primary-600 underline underline-offset-2 cursor-pointer whitespace-nowrap"
          >
            상품 더 추천받기
            <i className="ri-arrow-right-line text-sm" />
          </button>
        )}
      </div>

      {deleteErrorMessage && (
        <div className="px-5">
          <p className="rounded-lg bg-accent-50 px-4 py-3 text-sm font-medium text-accent-700">
            {deleteErrorMessage}
          </p>
        </div>
      )}

      {/* 빈상태 or 리스트 */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center px-5 py-20">
          <i className="ri-loader-4-line mb-3 flex h-8 w-8 animate-spin items-center justify-center text-2xl text-primary-500" />
          <p className="text-sm text-foreground-500">담은 상품을 불러오는 중...</p>
        </div>
      )}

      {!isLoading && (isError || savedProducts.length === 0) ? (
        <div className="px-5 mt-8">
          <div className="bg-background-100 rounded-xl p-8 text-center">
            <div className="w-16 h-16 mx-auto bg-background-200 rounded-full flex items-center justify-center mb-4">
              <i className="ri-gift-line text-2xl text-foreground-400" />
            </div>
            <p className="text-base font-semibold text-foreground-700 mb-2">
              아직 담은 상품이 없어요
            </p>
            <p className="text-sm text-foreground-500 mb-6 leading-relaxed">
              {errorMessage ?? '관심 있는 상품을 담으면'}
              <br />
              여기에서 다시 확인할 수 있어요
            </p>
            <button
              type="button"
              onClick={() => navigate('/recommend/start')}
              className="w-full bg-primary-500 text-background-50 font-semibold py-3.5 rounded-lg cursor-pointer whitespace-nowrap"
            >
              상품 추천 페이지로 가기
            </button>
          </div>
        </div>
      ) : null}

      {!isLoading && !isError && savedProducts.length > 0 && (
        <div className="px-5 mt-4 space-y-3">
          {savedProducts.map((product) => (
            <div
              key={product.productId}
              className="bg-background-50 border border-background-200 rounded-xl p-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <span className="inline-block bg-secondary-100 text-secondary-900 text-xs font-semibold px-2 py-0.5 rounded-md mb-2">
                    {product.accountType.displayName}
                  </span>
                  <h3 className="text-base font-bold text-foreground-950">
                    {product.providerName} {product.productName}
                  </h3>
                  <p className="text-sm text-foreground-500 mt-1">
                    {product.summary}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleDelete(product.productId)}
                  className="ml-3 flex h-8 w-8 shrink-0 items-center justify-center text-foreground-400 transition-colors hover:text-accent-500"
                  aria-label="담은 상품 취소"
                >
                  <i className="ri-close-line text-lg" />
                </button>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <div className="rounded-lg bg-background-100 px-3 py-2">
                  <p className="text-[10px] font-medium text-foreground-500">수수료</p>
                  <p className="text-xs font-bold text-foreground-950">
                    연 {product.feeMinRate}%~{product.feeMaxRate}%
                  </p>
                </div>
                <div className="rounded-lg bg-background-100 px-3 py-2">
                  <p className="text-[10px] font-medium text-foreground-500">담은 날짜</p>
                  <p className="text-xs font-bold text-foreground-950">
                    {new Date(product.savedAt).toLocaleDateString('ko-KR')}
                  </p>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => handleDetail(product.productId)}
                  className="flex-1 border border-background-300 text-foreground-700 text-sm font-medium py-2 rounded-lg cursor-pointer whitespace-nowrap"
                >
                  상세보기
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/recommend/compare')}
                  className="flex-1 bg-primary-500 text-background-50 text-sm font-medium py-2 rounded-lg cursor-pointer whitespace-nowrap"
                >
                  비교하기
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
        </div>
        <BottomNav />
    </>
  );
}
