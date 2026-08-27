import { useNavigate } from 'react-router-dom';
import BottomNav from '../../../components/BottomNav';
import { weeklyMissions } from '../../../mocks/missionData';

export default function MissionWeekly() {
  const navigate = useNavigate();

  const mission = weeklyMissions[0];

  return (
    <>
        <div className="flex-1 overflow-y-auto pb-24 px-6 pt-6">
          {/* 헤더 */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-bold text-foreground-950 font-heading">
              이번 주 미션
            </h1>
            <span className="text-xs font-semibold text-background-50 bg-accent-500 px-2.5 py-1 rounded-full">
              {mission.metrics[2].value}
            </span>
          </div>

          {/* 주 미션 카드 */}
          <div className="border-2 border-accent-400 rounded-xl p-5 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-semibold text-background-50 bg-accent-500 px-2.5 py-1 rounded-full">
                이번 주 미션
              </span>
            </div>
            <h2 className="text-xl font-bold text-foreground-950 mb-2">
              {mission.title}
            </h2>
            <p className="text-sm text-foreground-600 leading-relaxed mb-4">
              {mission.description}
            </p>

            {/* 간단 요약 */}
            <div className="space-y-3 mb-5">
              {mission.metrics.map((metric) => (
                <div key={metric.label} className="flex items-center gap-3 bg-background-100 rounded-lg p-3">
                  <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center shrink-0">
                    <i className="ri-coin-line text-primary-500 text-sm w-4 h-4 flex items-center justify-center" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-foreground-500">{metric.label}</p>
                    <p className="text-sm font-semibold text-foreground-950">{metric.value}</p>
                  </div>
                  <p className="text-xs text-foreground-400">{metric.desc}</p>
                </div>
              ))}
            </div>

            {/* 목표 카드 */}
            <div className="bg-accent-50 rounded-lg p-4 mb-5">
              <div className="flex items-center gap-2 mb-1">
                <i className="ri-focus-3-line text-accent-600 text-sm w-4 h-4 flex items-center justify-center" />
                <span className="text-xs font-semibold text-accent-700">
                  미션 목표
                </span>
              </div>
              <p className="text-sm font-semibold text-foreground-950">
                {mission.goal}
              </p>
              <p className="text-xs text-foreground-400 mt-1">
                마감: {mission.deadline}
              </p>
            </div>

            {/* 보상 */}
            <div className="flex items-center gap-2 mb-5">
              <i className="ri-gift-line text-primary-500 text-sm w-4 h-4 flex items-center justify-center" />
              <span className="text-sm text-foreground-600">
                완료 보상: <span className="font-semibold text-primary-600">{mission.reward}</span>
              </span>
            </div>

            {/* 완료 버튼 */}
            <button
              type="button"
              onClick={() => navigate('/mission/complete')}
              className="w-full bg-primary-500 hover:bg-primary-600 text-background-50 font-semibold py-3.5 rounded-xl text-sm transition-colors whitespace-nowrap cursor-pointer"
            >
              미션 완료하기
            </button>
          </div>
        </div>

        <BottomNav />
    </>
  );
}