import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProgressBar from '../../../components/ProgressBar';
import BarChart from '../../../components/BarChart';

const chartData = [
  { label: '10년', value: 1550 },
  { label: '15년', value: 2690 },
  { label: '20년', value: 4150 },
  { label: '25년', value: 5960 },
  { label: '30년', value: 8320 },
];

export default function ResultPreview() {
  const navigate = useNavigate();
  const [showDetails, setShowDetails] = useState(false);

  return (
    <>
        <ProgressBar current={3} total={3} />

        {/* 헤더 */}
        <div className="px-6 pt-6 pb-2 shrink-0">
          <h1 className="text-xl font-bold text-foreground-950 mb-1 font-heading">
            월 10만원이 30년 후에?
          </h1>
          <p className="text-sm text-foreground-500">
            연금리축액산 · 기성 수익률 5%
          </p>
        </div>

        {/* 내용 */}
        <div className="flex-1 overflow-y-auto px-6 pb-4">
          {/* 결과 */}
          <div className="text-center py-6">
            <p className="text-xs text-foreground-500 mb-2">30년 후 예상 연금자산</p>
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-4xl font-bold text-primary-600 font-heading">
                8,320
              </span>
              <span className="text-lg text-foreground-700">만원</span>
            </div>
            <p className="text-xs text-foreground-400 mt-2">
              예상 수익률 연 5% 가정 (변동 가능)
            </p>
          </div>

          {/* 차트 */}
          <div className="bg-background-100 rounded-xl p-4 mb-4">
            <BarChart data={chartData} highlightIndex={4} />
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
                <span className="text-sm font-semibold text-foreground-950">10만원</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-foreground-600">납입 기간</span>
                <span className="text-sm font-semibold text-foreground-950">30년</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-foreground-600">총 납입액</span>
                <span className="text-sm font-semibold text-foreground-950">3,600만원</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-foreground-600">예상 수익률</span>
                <span className="text-sm font-semibold text-foreground-950">연 5%</span>
              </div>
              <div className="border-t border-background-200 pt-3 flex justify-between items-center">
                <span className="text-sm font-semibold text-foreground-700">예상 총 자산</span>
                <span className="text-lg font-bold text-primary-600">8,320만원</span>
              </div>
            </div>
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