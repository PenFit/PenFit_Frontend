import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../../components/BottomNav';
import { emailReportItems, weeklyMissions } from '../../mocks/missionData';

export default function Mission() {
  const navigate = useNavigate();
  const [agreed, setAgreed] = useState(false);
  const [emailConsentChecked, setEmailConsentChecked] = useState(false);
  const [email, setEmail] = useState('jaewon@email.com');

  const hasMissions = weeklyMissions.length > 0;

  if (!agreed) {
    return (
      <>
          <div className="flex-1 overflow-y-auto pb-24 px-6 pt-8">
            {/* 헤더 */}
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-xl bg-accent-100 flex items-center justify-center">
                <i className="ri-mail-send-line text-accent-600 text-xl w-6 h-6 flex items-center justify-center" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-foreground-950 font-heading">
                  이메일 리포트
                </h1>
                <p className="text-sm text-foreground-500">
                  주간 미션 분석 결과를 받아보세요
                </p>
              </div>
            </div>

            {/* 간단 요약 */}
            <div className="bg-background-100 rounded-xl p-5 mb-6">
              <h3 className="text-sm font-semibold text-foreground-700 mb-4">
                이메일로 받게 되는 내용
              </h3>
              <div className="space-y-3">
                {emailReportItems.map((item) => (
                  <div key={item.title} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-background-50 flex items-center justify-center shrink-0">
                      <i className={`${item.icon} text-foreground-400 text-sm w-4 h-4 flex items-center justify-center`} />
                    </div>
                    <p className="text-sm text-foreground-600 pt-1">{item.title}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 이메일 작성 input */}
            <div className="mb-6">
              <label className="text-sm font-medium text-foreground-700 block mb-2">
                이메일 주소
              </label>
              <div className="flex items-center gap-3 bg-background-100 rounded-xl px-4 py-3">
                <i className="ri-mail-line text-foreground-400 text-sm w-4 h-4 flex items-center justify-center" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-transparent text-sm text-foreground-950 outline-none flex-1"
                  placeholder="email@example.com"
                />
              </div>
            </div>

            {/* 동의 */}
            <div className="flex items-start gap-3 mb-8">
              <button
                type="button"
                onClick={() => setEmailConsentChecked(!emailConsentChecked)}
                className="mt-0.5 w-5 h-5 rounded border-2 border-background-300 flex items-center justify-center shrink-0 cursor-pointer"
              >
                {emailConsentChecked && (
                  <i className="ri-check-line text-primary-500 text-xs w-4 h-4 flex items-center justify-center" />
                )}
              </button>
              <p className="text-sm text-foreground-600 leading-relaxed">
                이메일 수신에 동의합니다
              </p>
            </div>

            {/* 제출 버튼 */}
            <button
              type="button"
              disabled={!emailConsentChecked}
              onClick={() => setAgreed(true)}
              className={`
                w-full py-3.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap cursor-pointer
                ${emailConsentChecked
                  ? 'bg-primary-500 hover:bg-primary-600 text-background-50'
                  : 'bg-background-200 text-foreground-400 cursor-not-allowed'
                }
              `}
            >
              미션 분석 받기
            </button>
          </div>

          <BottomNav />
      </>
    );
  }

  return (
    <>
        <div className="flex-1 overflow-y-auto pb-24">
          {/* 헤더 */}
          <div className="px-6 pt-6 pb-2">
            <p className="text-sm text-foreground-500">이번 주 미션</p>
            <h1 className="text-xl font-bold text-foreground-950 font-heading">
              행동 미션
            </h1>
          </div>

          {/* AI 소비패턴 분석 */}
          <div className="px-6 pb-4">
            <button
              type="button"
              onClick={() => navigate('/mission/analysis')}
              className="w-full bg-background-100 rounded-xl p-5 text-left hover:bg-background-200 transition-colors cursor-pointer group"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-xs font-medium text-accent-600 bg-accent-100 px-2 py-0.5 rounded-full">
                    AI 소비패턴 분석
                  </span>
                  <h3 className="text-base font-bold text-foreground-950 mt-1">
                    소비 패턴을 찾았어요
                  </h3>
                </div>
                <div className="w-6 h-6 flex items-center justify-center shrink-0 mt-1">
                  <i className="ri-arrow-right-s-line text-foreground-400 text-xl group-hover:text-primary-500 transition-colors w-5 h-5 flex items-center justify-center" />
                </div>
              </div>
              <p className="text-sm text-foreground-600 mt-2">
                AI가 이번 달 소비 내역을 분석했어요. 절약할 수 있는 부분을 찾아봤어요.
              </p>
              <p className="text-sm font-semibold text-primary-500 mt-1.5 group-hover:text-primary-600 transition-colors flex items-center gap-1">
                분석 결과 보기
                <i className="ri-arrow-right-line text-xs w-3 h-3 flex items-center justify-center" />
              </p>
            </button>
          </div>

          {/* 이번 주 미션 */}
          {hasMissions && (
            <div className="px-6 pb-4">
              <div className="border-2 border-accent-400 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-semibold text-background-50 bg-accent-500 px-2.5 py-1 rounded-full">
                    이번 주 미션
                  </span>
                </div>
                <h3 className="text-lg font-bold text-foreground-950 mb-2">
                  {weeklyMissions[0].title}
                </h3>
                <p className="text-sm text-foreground-600 mb-4">
                  {weeklyMissions[0].goal}
                </p>

                <div className="grid grid-cols-3 gap-2 mb-4">
                  {weeklyMissions[0].metrics.map((metric) => (
                    <div key={metric.label} className="bg-background-100 rounded-lg p-2.5 text-center">
                      <p className="text-xs text-foreground-400 mb-1">{metric.label}</p>
                      <p className="text-base font-bold text-foreground-950">{metric.value}</p>
                      <p className="text-[10px] text-foreground-400">{metric.desc}</p>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => navigate('/mission/weekly')}
                  className="w-full bg-primary-500 hover:bg-primary-600 text-background-50 font-semibold py-3 rounded-lg text-sm transition-colors whitespace-nowrap cursor-pointer"
                >
                  미션 확인하기
                </button>
              </div>
            </div>
          )}

          {/* 다른 미션 */}
          {weeklyMissions.length > 1 && (
            <div className="px-6 pb-6">
              <h3 className="text-sm font-semibold text-foreground-700 mb-3">
                다른 미션 선택하기
              </h3>
              <div className="space-y-3">
                {weeklyMissions.slice(1).map((mission) => (
                  <button
                    key={mission.id}
                    type="button"
                    onClick={() => navigate('/mission/weekly')}
                    className="w-full bg-background-100 rounded-xl p-4 text-left hover:bg-background-200 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-secondary-600 bg-secondary-100 px-2 py-0.5 rounded-full">
                        {mission.subtitle}
                      </span>
                      <span className="text-xs text-foreground-400">{mission.deadline}</span>
                    </div>
                    <h4 className="text-sm font-semibold text-foreground-950 mt-1.5">
                      {mission.title}
                    </h4>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <BottomNav />
    </>
  );
}
