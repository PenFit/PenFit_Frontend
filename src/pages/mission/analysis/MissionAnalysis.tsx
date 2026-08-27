import { useNavigate } from 'react-router-dom';
import BottomNav from '../../../components/BottomNav';
import { spendingPattern } from '../../../mocks/missionData';

export default function MissionAnalysis() {
  const navigate = useNavigate();

  const maxAmount = Math.max(...spendingPattern.categories.map((c) => c.amount));

  return (
    <>
        <div className="flex-1 overflow-y-auto pb-24 px-6 pt-6">
          {/* 헤더 */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-accent-100 flex items-center justify-center">
              <i className="ri-sparkling-line text-accent-600 text-lg w-5 h-5 flex items-center justify-center" />
            </div>
            <div>
              <span className="text-xs font-medium text-accent-600 bg-accent-100 px-2 py-0.5 rounded-full">
                AI 소비패턴 분석
              </span>
              <h1 className="text-lg font-bold text-foreground-950 font-heading mt-1">
                소비 패턴을 찾았어요
              </h1>
            </div>
          </div>

          {/* 상단 요약 */}
          <div className="flex items-end gap-4 mb-6">
            <div>
              <p className="text-xs text-foreground-500 mb-1">
                가장 큰 소비 영역
              </p>
              <p className="text-2xl font-bold text-foreground-950">
                {spendingPattern.total}
              </p>
            </div>
            <div className="pb-1">
              <span className="text-sm font-semibold text-accent-600">
                {spendingPattern.totalAmount}
              </span>
            </div>
            <div className="pb-1 ml-auto">
              <span className="text-lg font-bold text-accent-500">
                {spendingPattern.topPercentage}
              </span>
            </div>
          </div>

          {/* 차트 */}
          <div className="bg-background-100 rounded-xl p-5 mb-6">
            <h3 className="text-sm font-semibold text-foreground-700 mb-4">
              영역별 지출
            </h3>
            <div className="space-y-4">
              {spendingPattern.categories.map((cat) => (
                <div key={cat.name}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm text-foreground-700">{cat.name}</span>
                    <span className="text-sm font-semibold text-foreground-950">
                      {(cat.amount / 10000).toFixed(0)}만원
                    </span>
                  </div>
                  <div className="w-full h-3 bg-background-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ${cat.color}`}
                      style={{ width: `${(cat.amount / maxAmount) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 핵심 소비 */}
          <div className="bg-background-100 rounded-xl p-5 mb-6">
            <h3 className="text-sm font-semibold text-foreground-700 mb-4">
              핵심 소비 3개
            </h3>
            <div className="space-y-3">
              {spendingPattern.keySpending.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-accent-100 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-accent-600">{idx + 1}</span>
                  </div>
                  <p className="text-sm text-foreground-700 leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 버튼 */}
          <button
            type="button"
            onClick={() => navigate('/mission/weekly')}
            className="w-full bg-primary-500 hover:bg-primary-600 text-background-50 font-semibold py-3.5 rounded-xl text-sm transition-colors whitespace-nowrap cursor-pointer mb-4"
          >
            주간 미션 보러 가기
          </button>

          <button
            type="button"
            onClick={() => navigate('/mission')}
            className="w-full text-sm text-foreground-400 hover:text-foreground-600 transition-colors py-2 cursor-pointer"
          >
            뒤로가기
          </button>
        </div>

        <BottomNav />
    </>
  );
}