import { useNavigate } from 'react-router-dom';
import { recommendProducts, compareCriteria } from '../../../mocks/recommendProducts';
import BottomNav from '../../../components/BottomNav';

export default function RecommendCompare() {
  const navigate = useNavigate();
  const products = recommendProducts.slice(0, 3);
  const primaryProductId = products[0]?.id;

  const getValue = (product: (typeof recommendProducts)[number], key: string) => {
    switch (key) {
      case 'fee':
        return `연 ${product.feeMin}~${product.feeMax}%`;
      case 'range':
        return `ETF ${product.etfCount}종 +\n펀드 ${product.fundCount}종`;
      case 'fit':
        return product.accountFit;
      default:
        return '';
    }
  };

  return (
    <>
        <div className="flex-1 overflow-y-auto pb-24">
      {/* 헤더 */}
      <div className="px-5 pt-6 pb-4">
        <h1 className="text-xl font-bold text-foreground-950">상품 비교</h1>
        <p className="text-sm text-foreground-500 mt-1">
          가장 중요한 기준 먼저 보여드려요
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
                const isPrimary = product.id === primaryProductId;

                return (
                  <div
                    key={product.id}
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
                const isPrimary = product.id === primaryProductId;

                return (
                  <div
                    key={product.id}
                    className={`p-3 text-center text-sm font-bold text-foreground-950 ${
                      isPrimary ? 'bg-primary-50' : 'bg-background-100'
                    }`}
                  >
                    {product.shortName}
                    <br />
                    <span className="text-xs font-normal text-foreground-500">
                      {product.productType}
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
                  const isPrimary = product.id === primaryProductId;

                  return (
                    <div
                      key={`${criteria.key}-${product.id}`}
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
          세밀해지고 자격 조건은 상품 가입 전 확인이 필요해요.
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
