import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import BottomNav from '../../components/BottomNav';

interface SavedProduct {
  id: string;
  name: string;
  shortName: string;
  productType?: string;
  summary: string;
  addedAt: string;
}

export default function RecommendMain() {
  const navigate = useNavigate();
  const [savedProducts, setSavedProducts] = useState<SavedProduct[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem('pension_saved_products');
    if (raw) {
      try {
        setSavedProducts(JSON.parse(raw));
      } catch {
        setSavedProducts([]);
      }
    }
  }, []);

  const handleRemove = (id: string) => {
    const next = savedProducts.filter((p) => p.id !== id);
    setSavedProducts(next);
    localStorage.setItem('pension_saved_products', JSON.stringify(next));
  };

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

      {/* 빈상태 or 리스트 */}
      {savedProducts.length === 0 ? (
        <div className="px-5 mt-8">
          <div className="bg-background-100 rounded-xl p-8 text-center">
            <div className="w-16 h-16 mx-auto bg-background-200 rounded-full flex items-center justify-center mb-4">
              <i className="ri-gift-line text-2xl text-foreground-400" />
            </div>
            <p className="text-base font-semibold text-foreground-700 mb-2">
              아직 담은 상품이 없어요
            </p>
            <p className="text-sm text-foreground-500 mb-6 leading-relaxed">
              처음에 아무것도 없으면
              <br />
              추천 받으라고 문구
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
      ) : (
        <div className="px-5 mt-4 space-y-3">
          {savedProducts.map((product) => (
            <div
              key={product.id}
              className="bg-background-50 border border-background-200 rounded-xl p-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <span className="inline-block bg-secondary-100 text-secondary-900 text-xs font-semibold px-2 py-0.5 rounded-md mb-2">
                    {product.productType ?? (product.name.includes('계좌') ? '연금저축계좌' : '연금저축펀드')}
                  </span>
                  <h3 className="text-base font-bold text-foreground-950">
                    {product.name}
                  </h3>
                  <p className="text-sm text-foreground-500 mt-1">
                    {product.summary}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemove(product.id)}
                  className="ml-3 w-8 h-8 flex items-center justify-center text-foreground-400 hover:text-accent-500 transition-colors cursor-pointer"
                >
                  <i className="ri-close-line text-lg" />
                </button>
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => navigate('/recommend/detail')}
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
