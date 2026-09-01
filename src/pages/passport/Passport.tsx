import { useState } from 'react';
import { isAxiosError } from 'axios';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { getMyPensionPassport } from '../../apis/passport';
import BottomNav from '../../components/BottomNav';

function formatWon(amount: number) {
  return `${amount.toLocaleString()}원`;
}

export default function Passport() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'personality' | 'detail'>('personality');
  const {
    data: passport,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['pensionPassport'],
    queryFn: getMyPensionPassport,
  });

  const errorMessage = isAxiosError(error)
    ? error.response?.data?.message
    : undefined;
  const hasNoSustainableContribution = passport?.sustainableMonthlyContribution === 0;

  if (isLoading) {
    return (
      <>
        <div className="flex-1 overflow-y-auto pb-24">
          <div className="flex h-full flex-col items-center justify-center px-6">
            <i className="ri-loader-4-line mb-3 flex h-8 w-8 animate-spin items-center justify-center text-2xl text-primary-500" />
            <p className="text-sm text-foreground-500">패스포트를 불러오는 중...</p>
          </div>
        </div>
        <BottomNav />
      </>
    );
  }

  if (isError || !passport) {
    return (
      <>
        <div className="flex-1 overflow-y-auto pb-24">
          <div className="flex h-full flex-col items-center justify-center px-6 text-center">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-background-100">
              <i className="ri-passport-line flex h-8 w-8 items-center justify-center text-2xl text-foreground-400" />
            </div>
            <h1 className="mb-2 text-xl font-bold text-foreground-950 font-heading">
              패스포트가 아직 없어요
            </h1>
            <p className="mb-6 text-sm leading-relaxed text-foreground-500">
              {errorMessage ?? '연금 리허설 분석이 완료되면 패스포트를 확인할 수 있어요.'}
            </p>
            <button
              type="button"
              onClick={() => navigate('/result-preview')}
              className="w-full rounded-lg bg-primary-500 py-4 text-sm font-semibold text-background-50 transition-colors hover:bg-primary-600"
            >
              리허설 하러 가기
            </button>
          </div>
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
            <h1 className="text-xl font-bold text-foreground-950 font-heading">
              연금 패스포트
            </h1>
            <p className="text-sm text-foreground-500">
              {passport.type.displayName}
            </p>
          </div>

          {/* 아이콘 */}
          <div className="px-6 pb-4 flex justify-center">
            <div className="w-16 h-16 rounded-2xl bg-primary-500 flex items-center justify-center">
              <i className="ri-passport-line text-background-50 text-2xl w-8 h-8 flex items-center justify-center" />
            </div>
          </div>

          {/* 탭 */}
          <div className="px-6 pb-4 flex border-b border-background-200">
            <button
              type="button"
              onClick={() => setActiveTab('personality')}
              className={`flex-1 pb-2 text-sm font-semibold transition-colors cursor-pointer ${
                activeTab === 'personality'
                  ? 'text-primary-500 border-b-2 border-primary-500'
                  : 'text-foreground-400'
              }`}
            >
              성향
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('detail')}
              className={`flex-1 pb-2 text-sm font-semibold transition-colors cursor-pointer ${
                activeTab === 'detail'
                  ? 'text-primary-500 border-b-2 border-primary-500'
                  : 'text-foreground-400'
              }`}
            >
              세부 분석
            </button>
          </div>

          {/* 각 탭마다의 내용 */}
          {activeTab === 'personality' && (
            <div className="animate-fade-in">
              <div className="px-6 pb-4 grid grid-cols-1 gap-3">
                <div className="bg-background-100 rounded-xl p-4">
                  <p className="text-xs text-foreground-500 mb-1">월 납입액 유지 가능액</p>
                  {hasNoSustainableContribution ? (
                    <p className="text-sm font-semibold leading-relaxed text-accent-600">
                      지금은 연금 납입보다 비상금과 현금 흐름 확보가 먼저예요
                    </p>
                  ) : (
                    <p className="text-lg font-bold text-foreground-950">
                      {formatWon(passport.sustainableMonthlyContribution)}
                    </p>
                  )}
                </div>
                <div className="bg-background-100 rounded-xl p-4">
                  <p className="text-xs text-foreground-500 mb-1">가장 큰 흐름 위험</p>
                  <p className="text-base font-bold text-accent-600">
                    {passport.biggestInterruptionRisk.displayName}
                  </p>
                </div>
                <div className="bg-background-100 rounded-xl p-4">
                  <p className="text-xs text-foreground-500 mb-1">시장 위험도</p>
                  <p className="text-base font-bold text-primary-600">
                    {passport.marketRiskLevel.displayName}
                  </p>
                </div>
              </div>

              <div className="px-6 pb-6">
                <div className="rounded-xl bg-primary-50 p-4">
                  <p className="mb-1 text-sm font-bold text-primary-700">
                    {passport.type.displayName}
                  </p>
	                  <p className="text-sm leading-relaxed text-foreground-700">
	                    {passport.typeSummary}
	                  </p>
                </div>
              </div>

              {/* AI 분석 요약 */}
              <div className="px-6 pb-6">
                <h3 className="text-base font-bold text-foreground-950 mb-3">
                  AI 분석 요약
                </h3>
                <div className="bg-background-100 rounded-xl p-4">
                  <p className="text-sm text-foreground-700 leading-relaxed mb-3">
                    {passport.summary}
                  </p>
                  <button
                    type="button"
                    className="text-sm font-medium text-primary-500 hover:text-primary-600 transition-colors cursor-pointer"
                    onClick={() => setActiveTab('detail')}
                  >
                    AI가 이렇게 판단한 이유
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'detail' && (
            <div className="px-6 pb-6 animate-fade-in space-y-4">
              <div className="rounded-xl bg-background-100 p-4">
                <p className="mb-2 text-sm font-bold text-foreground-950">판단 이유</p>
                <p className="text-sm leading-relaxed text-foreground-700">
                  {passport.judgmentReason}
                </p>
              </div>

	              <div className="rounded-xl border border-background-200 bg-background-50 p-4">
	                <p className="whitespace-pre-line text-sm leading-relaxed text-foreground-600">
	                  {passport.detailedAnalysisReport}
	                </p>
	              </div>
	            </div>
          )}
        </div>

        <BottomNav />
    </>
  );
}
