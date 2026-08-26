import { useNavigate } from 'react-router-dom';
import { recommendProducts } from '../../../mocks/recommendProducts';
import { useState } from 'react';
import BottomNav from '../../../components/BottomNav';

export default function RecommendDetail() {
  const navigate = useNavigate();
  const product = recommendProducts[0];
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    const raw = localStorage.getItem('pension_saved_products');
    let savedList = [];
    if (raw) {
      try {
        savedList = JSON.parse(raw);
      } catch {
        savedList = [];
      }
    }

    const already = savedList.some((p: { id: string }) => p.id === product.id);
    if (!already) {
      savedList.push({
        id: product.id,
        name: product.name,
        shortName: product.shortName,
        summary: product.summary,
        addedAt: new Date().toISOString(),
      });
      localStorage.setItem('pension_saved_products', JSON.stringify(savedList));
    }
    setSaved(true);
  };

  return (
    <>
        <div className="flex-1 overflow-y-auto pb-24">
      {/* 헤더 */}
      <div className="px-5 pt-6 pb-4">
        <span className="text-xs text-foreground-500">미래에셋증권</span>
        <h1 className="text-xl font-bold text-foreground-950 mt-0.5">
          {product.name}
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
            {product.reason}
          </p>
        </div>
      </div>

      {/* 특징 */}
      <div className="px-5 mt-4">
        <div className="bg-background-50 border border-background-200 rounded-xl p-4">
          <h2 className="text-sm font-bold text-foreground-800 mb-3">
            수수료 특징
          </h2>
          <ul className="space-y-2">
            {product.features.map((feature, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <i className="ri-check-line text-primary-500 mt-0.5" />
                <span className="text-sm text-foreground-700">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 경고 */}
      <div className="px-5 mt-4">
        <div className="bg-accent-50 border border-accent-200 rounded-xl p-4">
          <h2 className="text-sm font-bold text-accent-900 mb-3">
            주의사항
          </h2>
          <ul className="space-y-2">
            {product.warnings.map((warning, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <i className="ri-error-warning-line text-accent-500 mt-0.5" />
                <span className="text-sm text-accent-800">{warning}</span>
              </li>
            ))}
          </ul>
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
        <button
          type="button"
          onClick={handleSave}
          disabled={saved}
          className={`
            w-full font-semibold py-3.5 rounded-lg cursor-pointer whitespace-nowrap transition-colors
            ${saved
              ? 'bg-secondary-500 text-background-50'
              : 'bg-primary-500 text-background-50 hover:bg-primary-600'
            }
          `}
        >
          {saved ? '담기 완료!' : '이 상품 담아두기'}
        </button>

        {saved && (
          <button
            type="button"
            onClick={() => navigate('/recommend')}
            className="w-full mt-3 border border-background-300 text-foreground-700 font-medium py-3 rounded-lg cursor-pointer whitespace-nowrap"
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