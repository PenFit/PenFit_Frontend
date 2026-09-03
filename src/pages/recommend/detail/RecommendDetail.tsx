import { useNavigate } from 'react-router-dom';
import { isAxiosError } from 'axios';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { deleteSavedProduct, getPensionProductDetail, saveProduct } from '../../../apis/recommend';
import BottomNav from '../../../components/BottomNav';
import {
  getSelectedProductRecommendationId,
} from '../recommendationStorage';

export default function RecommendDetail() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const productId = getSelectedProductRecommendationId();
  const secondaryButtonClassName =
    'block w-full rounded-lg border border-background-300 py-3 text-center text-sm font-semibold leading-5 text-foreground-700 transition-colors hover:bg-background-100';
  const {
    data: product,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['pensionProductDetail', productId],
    queryFn: () => getPensionProductDetail(productId as number),
    enabled: productId !== null,
  });
  const [savedOverride, setSavedOverride] = useState<{
    productId: number | null;
    saved: boolean;
  } | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveErrorMessage, setSaveErrorMessage] = useState('');
  const saved =
    savedOverride?.productId === productId
      ? savedOverride.saved
      : product?.saved ?? false;

  const updateSavedCache = (nextSaved: boolean) => {
    queryClient.setQueryData(['pensionProductDetail', productId], {
      ...product,
      saved: nextSaved,
    });
    queryClient.invalidateQueries({ queryKey: ['mySavedProducts'] });
  };

  const handleSaveToggle = async () => {
    if (!product || isSaving) {
      return;
    }

    setIsSaving(true);
    setSaveErrorMessage('');

    try {
      if (saved) {
        await deleteSavedProduct(product.productId);

        setSavedOverride({ productId, saved: false });
        updateSavedCache(false);
        return;
      }

      await saveProduct(product.productId);

      setSavedOverride({ productId, saved: true });
      updateSavedCache(true);
    } catch (error) {
      if (isAxiosError(error)) {
        console.error(saved ? '담은 상품 취소 실패 응답' : '상품 담기 실패 응답', error.response?.data);

        if (error.response?.data?.code === 'PR4091') {
          setSavedOverride({ productId, saved: true });
          updateSavedCache(true);
          return;
        }
      }

      console.error(saved ? '담은 상품 취소에 실패했어요.' : '상품 담기에 실패했어요.', error);
      setSaveErrorMessage(
        saved
          ? '담기 취소를 처리하지 못했어요. 다시 시도해주세요.'
          : '상품을 담지 못했어요. 다시 시도해주세요.',
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <>
        <div className="flex-1 overflow-y-auto pb-24">
          <div className="flex h-full flex-col items-center justify-center px-5">
            <i className="ri-loader-4-line mb-3 flex h-8 w-8 animate-spin items-center justify-center text-2xl text-primary-500" />
            <p className="text-sm text-foreground-500">상품 상세 정보를 불러오는 중...</p>
          </div>
        </div>
        <BottomNav />
      </>
    );
  }

  if (!productId || isError || !product) {
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
              추천 상품이 없어요
            </h1>
            <p className="mb-6 text-sm leading-relaxed text-foreground-500">
              {errorMessage ?? '맞춤 추천을 먼저 받은 뒤 상세 정보를 확인할 수 있어요.'}
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

  const providerTypeName = product.providerType?.displayName ?? '금융사';
  const accountTypeName = product.accountType?.displayName ?? '-';
  const productTypeName = product.productType?.displayName ?? '-';
  const features = Array.isArray(product.features) ? product.features : [];
  const cautions = Array.isArray(product.cautions) ? product.cautions : [];

  return (
    <>
        <div className="flex-1 overflow-y-auto pb-24">
      {/* 헤더 */}
      <div className="px-5 pt-6 pb-4">
        <span className="text-xs text-foreground-500">
          {providerTypeName} · {product.providerName}
        </span>
        <h1 className="text-xl font-bold text-foreground-950 mt-0.5">
          {product.productName}
        </h1>
      </div>

      {/* 요약 카드 */}
      <div className="px-5 mt-2">
        <div className="bg-background-50 border border-background-200 rounded-xl p-4">
          <h2 className="text-sm font-bold text-foreground-800 mb-2">
            상품 요약
          </h2>
          <p className="text-sm text-foreground-600 leading-relaxed">
            {product.summary}
          </p>
        </div>
      </div>

      {/* 추천 이유 */}
      <div className="px-5 mt-4">
        <div className="bg-background-50 border border-background-200 rounded-xl p-4">
          <h2 className="text-sm font-bold text-foreground-800 mb-2">
            나에게 추천한 이유
          </h2>
          <p className="text-sm text-foreground-600 leading-relaxed">
            {product.recommendationReason ?? '추천 결과를 받은 뒤 추천 이유를 확인할 수 있어요.'}
          </p>
        </div>
      </div>

      {/* 특징 */}
      <div className="px-5 mt-4">
        <div className="bg-background-50 border border-background-200 rounded-xl p-4">
          <h2 className="text-sm font-bold text-foreground-800 mb-3">
            추천 기준
          </h2>
          <div className="space-y-2">
            <div className="flex items-center justify-between rounded-lg bg-background-100 px-3 py-2">
              <span className="text-sm text-foreground-600">계좌 유형</span>
              <span className="text-sm font-semibold text-foreground-950">
                {accountTypeName}
              </span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-background-100 px-3 py-2">
              <span className="text-sm text-foreground-600">상품 유형</span>
              <span className="text-sm font-semibold text-foreground-950">
                {productTypeName}
              </span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-background-100 px-3 py-2">
              <span className="text-sm text-foreground-600">수수료</span>
              <span className="text-sm font-semibold text-foreground-950">
                연 {product.feeMinRate}%~{product.feeMaxRate}%
              </span>
            </div>
            <div className="rounded-lg bg-background-100 px-3 py-2">
              <p className="mb-1 text-sm text-foreground-600">투자상품 선택 범위</p>
              <p className="text-sm font-semibold leading-relaxed text-foreground-950">
                {product.investmentScope}
              </p>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-background-100 px-3 py-2">
              <span className="text-sm text-foreground-600">담기 여부</span>
              <span className="text-sm font-semibold text-primary-600">
                {saved ? '담아둔 상품' : '아직 담지 않음'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 특징 */}
      <div className="px-5 mt-4">
        <div className="bg-background-50 border border-background-200 rounded-xl p-4">
          <h2 className="text-sm font-bold text-foreground-800 mb-3">
            주요 특징
          </h2>
          {features.length > 0 ? (
            <ul className="space-y-2">
              {features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <i className="ri-check-line text-primary-500 mt-0.5" />
                  <span className="text-sm text-foreground-700">{feature}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-foreground-500">
              주요 특징 정보가 아직 없어요.
            </p>
          )}
        </div>
      </div>

      {/* 경고 */}
      <div className="px-5 mt-4">
        <div className="bg-accent-50 border border-accent-200 rounded-xl p-4">
          <h2 className="text-sm font-bold text-accent-900 mb-3">
            주의사항
          </h2>
          {cautions.length > 0 ? (
            <ul className="space-y-2">
              {cautions.map((caution, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <i className="ri-error-warning-line text-accent-500 mt-0.5" />
                  <span className="text-sm text-accent-800">{caution}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-accent-800">
              별도 주의사항 정보가 아직 없어요.
            </p>
          )}
        </div>
      </div>

      {/* 면책 조항 */}
      <div className="px-5 mt-4">
        <p className="text-xs text-foreground-400 leading-relaxed bg-background-100 rounded-lg p-3">
          이 정보는 참고용이며, 정확한 내용은 금융회사 공식 채널에서 확인하세요.
        </p>
      </div>

      {/* 하단 버튼 */}
      <div className="px-5 mt-6">
        {saveErrorMessage && (
          <p className="mb-3 text-center text-sm font-medium text-accent-600">
            {saveErrorMessage}
          </p>
        )}
        <button
          type="button"
          onClick={handleSaveToggle}
          disabled={isSaving}
          className={`
            w-full rounded-lg py-3.5 text-sm font-semibold leading-5 cursor-pointer whitespace-nowrap transition-colors
            ${saved
              ? 'bg-background-100 text-foreground-700 border border-background-300 hover:bg-background-200'
              : 'bg-primary-500 text-background-50 hover:bg-primary-600'
            }
          `}
        >
          {isSaving ? (saved ? '취소 중' : '담는 중') : saved ? '담기 취소' : '이 상품 담아두기'}
        </button>

        {product.officialUrl && (
          <a
            href={product.officialUrl}
            target="_blank"
            rel="noreferrer"
            className={`mt-3 ${secondaryButtonClassName}`}
          >
            공식 사이트 보기
          </a>
        )}

        {saved && (
          <button
            type="button"
            onClick={() => navigate('/recommend')}
            className={`mt-3 cursor-pointer whitespace-nowrap ${secondaryButtonClassName}`}
          >
            내 상품 리스트로 가기
          </button>
        )}
      </div>
        </div>
        <BottomNav />
    </>
  );
}
