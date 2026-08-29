import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPensionSetup, type PensionSetup } from '../../../apis/setup';
import ProgressBar from '../../../components/ProgressBar';
import BarChart from '../../../components/BarChart';

const PREVIEW_STORAGE_KEY = 'pensionSetupPreview';

function formatWon(value: number) {
  return `${value.toLocaleString('ko-KR')}원`;
}

function formatManwonValue(value: number) {
  return Math.round(value / 10000).toLocaleString('ko-KR');
}

function formatKoreanAsset(value: number) {
  const manwon = Math.round(value / 10000);

  if (manwon < 10000) {
    return `${manwon.toLocaleString('ko-KR')}만원`;
  }

  const eok = Math.floor(manwon / 10000);
  const remainingManwon = manwon % 10000;

  if (remainingManwon === 0) {
    return `${eok.toLocaleString('ko-KR')}억원`;
  }

  return `${eok.toLocaleString('ko-KR')}억 ${remainingManwon.toLocaleString('ko-KR')}만원`;
}

function getStoredPensionSetup() {
  const storedPreview = sessionStorage.getItem(PREVIEW_STORAGE_KEY);

  if (!storedPreview) {
    return null;
  }

  try {
    return JSON.parse(storedPreview) as PensionSetup;
  } catch {
    return null;
  }
}

export default function ResultPreview() {
  const navigate = useNavigate();
  const [showDetails, setShowDetails] = useState(false);
  const [pensionSetup, setPensionSetup] = useState<PensionSetup | null>(() => getStoredPensionSetup());
  const [isLoading, setIsLoading] = useState(() => !sessionStorage.getItem(PREVIEW_STORAGE_KEY));
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (pensionSetup) {
      return;
    }

    const fetchPensionSetup = async () => {
      try {
        const setup = await getPensionSetup();
        setPensionSetup(setup);
        sessionStorage.setItem(PREVIEW_STORAGE_KEY, JSON.stringify(setup));
      } catch (error) {
        console.error('연금 설정 조회에 실패했어요.', error);
        setErrorMessage('연금 설정 정보를 불러오지 못했어요.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPensionSetup();
  }, [pensionSetup]);

  const chartData =
    pensionSetup?.growth.map((item) => ({
      label: `${item.years}년`,
      value: Math.round(item.futureAsset / 10000),
    })) ?? [];
  const highlightedChartIndex = chartData.length > 0 ? chartData.length - 1 : undefined;
  const monthlyContributionText = pensionSetup ? formatWon(pensionSetup.monthlyContribution) : '';
  const futureAssetText = pensionSetup ? formatKoreanAsset(pensionSetup.previewFutureAsset) : '0만원';
  const totalContribution = pensionSetup
    ? pensionSetup.monthlyContribution * 12 * pensionSetup.contributionYears
    : 0;

  return (
    <>
        <ProgressBar current={3} total={3} />

        {/* 헤더 */}
        <div className="px-6 pt-6 pb-2 shrink-0">
          <h1 className="text-xl font-bold text-foreground-950 mb-1 font-heading">
            {pensionSetup
              ? `월 ${formatManwonValue(pensionSetup.monthlyContribution)}만원이 ${pensionSetup.contributionYears}년 후에?`
              : '예상 연금자산을 확인해볼까요?'}
          </h1>
          <p className="text-sm text-foreground-500">
            {pensionSetup
              ? `${pensionSetup.accountType.displayName} · 예상 수익률 ${pensionSetup.expectedReturnRate}%`
              : '가상 연금 설정을 불러오고 있어요'}
          </p>
        </div>

        {/* 내용 */}
        <div className="flex-1 overflow-y-auto px-6 pb-4">
          {isLoading && (
            <div className="flex h-full items-center justify-center">
              <p className="text-sm font-semibold text-foreground-500">
                예상 결과를 불러오는 중이에요
              </p>
            </div>
          )}

          {!isLoading && errorMessage && (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent-100">
                <i className="ri-error-warning-line flex h-6 w-6 items-center justify-center text-xl text-accent-600" />
              </div>
              <p className="mb-5 text-sm font-semibold text-foreground-700">
                {errorMessage}
              </p>
              <button
                type="button"
                onClick={() => navigate('/account-select')}
                className="rounded-xl bg-primary-500 px-5 py-3 text-sm font-semibold text-background-50 transition-colors hover:bg-primary-600"
              >
                계좌 선택하러 가기
              </button>
            </div>
          )}

          {!isLoading && !errorMessage && pensionSetup && (
            <>
          {/* 결과 */}
          <div className="text-center py-6">
            <p className="text-xs text-foreground-500 mb-2">
              {pensionSetup.contributionYears}년 후 예상 연금자산
            </p>
            <div className="flex items-baseline justify-center gap-1">
              <span className="break-keep text-3xl font-bold text-primary-600 font-heading">
                {futureAssetText}
              </span>
            </div>
            <p className="text-xs text-foreground-400 mt-2">
              예상 수익률 연 {pensionSetup.expectedReturnRate}% 가정 (변동 가능)
            </p>
          </div>

          {/* 차트 */}
          <div className="bg-background-100 rounded-xl p-4 mb-4">
            <BarChart data={chartData} highlightIndex={highlightedChartIndex} />
          </div>

          {/* 자세히보기 토글 */}
          <button
            type="button"
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center gap-1 text-sm text-foreground-500 hover:text-primary-600 transition-colors mb-4"
          >
            <i className={`${showDetails ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line'} w-4 h-4 flex items-center justify-center`} />
            계산 기준 보기
          </button>

          {/* 자세히보기 패널 */}
          {showDetails && (
            <div className="bg-background-100 rounded-xl p-5 space-y-3 animate-fade-in">
              <div className="flex justify-between items-center">
                <span className="text-sm text-foreground-600">월 납입금</span>
                <span className="text-sm font-semibold text-foreground-950">
                  {monthlyContributionText}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-foreground-600">납입 기간</span>
                <span className="text-sm font-semibold text-foreground-950">
                  {pensionSetup.contributionYears}년
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-foreground-600">총 납입액</span>
                <span className="text-sm font-semibold text-foreground-950">
                  {formatWon(totalContribution)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-foreground-600">예상 수익률</span>
                <span className="text-sm font-semibold text-foreground-950">
                  연 {pensionSetup.expectedReturnRate}%
                </span>
              </div>
              <div className="border-t border-background-200 pt-3 flex justify-between items-center">
                <span className="text-sm font-semibold text-foreground-700">예상 총 자산</span>
                <span className="text-lg font-bold text-primary-600">
                  {futureAssetText}
                </span>
              </div>
            </div>
          )}
            </>
          )}
        </div>

        {/* 시작하기 버튼 */}
        <div className="px-6 py-5 shrink-0 bg-background-50 border-t border-background-100">
          <button
            type="button"
            onClick={() => navigate('/simulation/1')}
            className="w-full bg-primary-500 hover:bg-primary-600 text-background-50 font-semibold py-4 rounded-lg transition-colors whitespace-nowrap"
          >
            30년 리허설 시작하기
          </button>
        </div>
    </>
  );
}
