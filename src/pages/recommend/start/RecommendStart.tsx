import { useNavigate } from 'react-router-dom';
import { recommendProducts } from '../../../mocks/recommendProducts';
import RecommendProductCard from '../../../components/RecommendProductCard';
import BottomNav from '../../../components/BottomNav';

export default function RecommendStart() {
  const navigate = useNavigate();

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
            프로필 분석 기준 3개월에 맞춰 추천했어요
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
      <div className="px-5 space-y-4 mt-2">
        {recommendProducts.map((product, idx) => (
          <RecommendProductCard
            key={product.id}
            product={product}
            rank={idx + 1}
          />
        ))}
      </div>
        </div>
        <BottomNav />
    </>
  );
}