import BottomNav from '../../components/BottomNav';

export default function PlanResult() {
  return (
    <>
        <div className="flex-1 overflow-y-auto pb-24">
          {/* 헤더 */}
          <div className="px-6 pt-6 pb-2">
            <h1 className="text-xl font-bold text-foreground-950 font-heading">
              균형 있게 시작
            </h1>
            <p className="text-sm text-foreground-500">
              주석색권을 반영한 연금과 성향의 균형
            </p>
          </div>

          {/* 요약 */}
          <div className="px-6 pb-4 grid grid-cols-3 gap-3">
            <div className="bg-background-100 rounded-xl p-4 text-center">
              <p className="text-xs text-foreground-500 mb-1">월 납입액</p>
              <p className="text-lg font-bold text-foreground-950">12만원</p>
            </div>
            <div className="bg-background-100 rounded-xl p-4 text-center">
              <p className="text-xs text-foreground-500 mb-1">30년 예상</p>
              <p className="text-lg font-bold text-primary-600">9,980만원</p>
            </div>
            <div className="bg-background-100 rounded-xl p-4 text-center">
              <p className="text-xs text-foreground-500 mb-1">계좌</p>
              <p className="text-sm font-semibold text-foreground-950">연금저축펀드</p>
            </div>
          </div>

          {/* 자산 비율 */}
          <div className="px-6 pb-4">
            <h3 className="text-base font-bold text-foreground-950 mb-3">
              자산 구성
            </h3>
            <div className="bg-background-100 rounded-xl p-4">
              {/* Horizontal bars */}
              <div className="flex gap-1 mb-4">
                <div
                  className="h-3 rounded-full bg-primary-500"
                  style={{ width: '50%' }}
                />
                <div
                  className="h-3 rounded-full bg-secondary-500"
                  style={{ width: '40%' }}
                />
                <div
                  className="h-3 rounded-full bg-accent-500"
                  style={{ width: '10%' }}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-primary-500" />
                    <span className="text-sm text-foreground-700">주식</span>
                  </div>
                  <span className="text-sm font-bold text-foreground-950">50%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-secondary-500" />
                    <span className="text-sm text-foreground-700">채권</span>
                  </div>
                  <span className="text-sm font-bold text-foreground-950">40%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-accent-500" />
                    <span className="text-sm text-foreground-700">예금</span>
                  </div>
                  <span className="text-sm font-bold text-foreground-950">10%</span>
                </div>
              </div>
            </div>
          </div>

          {/* 장점 */}
          <div className="px-6 pb-6">
            <h3 className="text-base font-bold text-foreground-950 mb-3">
              이 계획의 장점
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-primary-500 flex items-center justify-center shrink-0 mt-0.5">
                  <i className="ri-check-line text-background-50 text-xs w-3 h-3 flex items-center justify-center" />
                </div>
                <p className="text-sm text-foreground-700">위험과 수익의 균형이 좋아요</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-primary-500 flex items-center justify-center shrink-0 mt-0.5">
                  <i className="ri-check-line text-background-50 text-xs w-3 h-3 flex items-center justify-center" />
                </div>
                <p className="text-sm text-foreground-700">장기 자산 성장에 적합해요</p>
              </div>
            </div>
            <div className="mt-4 bg-background-200 rounded-xl p-3">
              <p className="text-xs text-foreground-500 text-center">
                이 계획은 예상치일 뿐 실제 수익률과 다를 수 있어요
              </p>
            </div>
          </div>
        </div>

        <BottomNav />
    </>
  );
}