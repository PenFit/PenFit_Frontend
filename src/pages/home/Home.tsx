import { useNavigate } from 'react-router-dom';
import BottomNav from '../../components/BottomNav';
import RecommendProductCard from '../../components/RecommendProductCard';
import { recommendProducts } from '../../mocks/recommendProducts'; 

export default function Home() {
  const navigate = useNavigate();

  return (
    <>
        <div className="flex-1 overflow-y-auto pb-24">
          <div className="px-6 pt-6 pb-2">
            <p className="text-sm text-foreground-500">안녕하세요,</p>
            <h1 className="text-xl font-bold text-foreground-950 font-heading">
              이재원님의 연금생활
            </h1>
          </div>

          {/* 패스포트 */}
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
                성실한 개척자형
              </h3>

              <p className="mb-5 text-sm leading-relaxed text-primary-50">
                시장을 믿고 꾸준히 밀고 나가는 성향이에요
              </p>

              <button
                type="button"
                onClick={() => navigate('/passport')}
                className="flex w-full items-center justify-between rounded-lg bg-background-50 px-4 py-3 text-sm font-semibold text-primary-700 transition-colors hover:bg-primary-50 cursor-pointer"
              >
                <span>패스포트 자세히 보기</span>
                <i className="ri-arrow-right-line flex h-4 w-4 items-center justify-center" />
              </button>
            </div>
          </div>

          {/* 진행 중인 연금 계획 */}
          <div className="px-6 pb-4">
            <div className="bg-background-100 rounded-xl p-5">
              <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-sm font-semibold text-foreground-700">
                    현재 진행 중인 연금계획
                  </h3>
                  <p className="mt-1 text-xs text-foreground-500">
                    30년 뒤 예상 연금자산
                  </p>
                </div>
                <div className="shrink-0 rounded-full bg-primary-100 px-3 py-1 text-xs font-semibold text-primary-700">
                  진행 중
                </div>
              </div>

              <div className="mb-4 rounded-xl bg-background-50 p-4">
                <div className="flex items-baseline gap-1">
                  <span className="font-heading text-3xl font-bold text-primary-600">
                    9,980
                  </span>
                  <span className="text-sm font-semibold text-foreground-700">
                    만원
                  </span>
                </div>
              </div>

              <div className="mb-4 grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-background-50 p-3">
                  <p className="mb-1 text-xs text-foreground-500">월 납입액</p>
                  <p className="text-base font-bold text-foreground-950">12만원</p>
                </div>
                <div className="rounded-lg bg-background-50 p-3">
                  <p className="mb-1 text-xs text-foreground-500">계좌</p>
                  <p className="text-sm font-semibold leading-snug text-foreground-950">
                    연금저축펀드
                  </p>
                </div>
              </div>

              <button
                type="button"
                className="flex items-center gap-1 text-sm font-medium text-primary-500 hover:text-primary-600 transition-colors cursor-pointer"
              >
                계획 수정하기
                <i className="ri-arrow-right-line w-4 h-4 flex items-center justify-center" />
              </button>
            </div>
          </div>

          {/* 미션 카드 */}
          <div className="px-6 pb-4">
            <div className="bg-accent-50 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-accent-800 mb-2">
                이번 주 행동 미션
              </h3>
              <h4 className="text-base font-bold text-foreground-950 mb-1">
                커피값 아껴서 연금 넣어보기
              </h4>
              <p className="text-sm text-foreground-600 mb-4">
                목표: 3만원 아껴서 연금에 추가 납입
              </p>
              <button
                type="button"
                onClick={() => navigate('/mission/weekly')}
                className="w-full bg-primary-500 hover:bg-primary-600 text-background-50 font-semibold py-3 rounded-lg text-sm transition-colors whitespace-nowrap cursor-pointer"
              >
                미션 시작하기
              </button>
            </div>
          </div>

          {/* 저장한 추천상품 */}
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
            <div className="space-y-3">
              {recommendProducts.slice(0, 1).map((product, idx) => (
                <RecommendProductCard
                  key={product.id}
                  product={product}
                  rank={idx + 1}
                  compact
                />
              ))}
            </div>
          </div>
        </div>

        <BottomNav />
    </>
  );
}
