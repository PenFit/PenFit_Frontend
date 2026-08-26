import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ProgressBar from '../../components/ProgressBar';
import SimOptionCard from '../../components/SimOptionCard';
import NotFound from '../NotFound';
import { useSimulation, useSimulations } from '../../hooks/useSimulations';
import { Navigate } from 'react-router-dom';

export default function Simulation() {
  const navigate = useNavigate();
  const { step } = useParams<{ step: string }>();

  const stepNum = parseInt(step || '1', 10);
  const { data: simulation, isLoading } = useSimulation(stepNum);
  const { data: allSimulations } = useSimulations();
  const total = allSimulations?.length ?? 0;

  const [selected, setSelected] = useState<string>('');

  // step 값이 숫자가 아니거나 문항 범위를 벗어나면 첫 번째 시뮬레이션으로 이동
  if (step && (Number.isNaN(stepNum) || stepNum < 1 || stepNum > total)) {
    return <Navigate to="/simulation/1" replace />;
  }

  if (isLoading) {
    return (
      <>
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <i className="ri-loader-4-line animate-spin text-accent-500 text-2xl w-8 h-8 flex items-center justify-center" />
            <p className="text-sm text-foreground-500">시뮬레이션을 불러오는 중...</p>
          </div>
        </div>
      </>
    );
  }

  if (!simulation) {
    return <NotFound />;
  }

  const isLast = stepNum === total;
  const nextPath = isLast ? '/loading' : `/simulation/${stepNum + 1}`;

  return (
    <>
        <ProgressBar current={stepNum} total={6} />

        {/* 뱃지 */}
        <div className="px-6 pt-5 pb-2 shrink-0">
          <span className="inline-block px-3 py-1.5 rounded-full bg-foreground-900 text-background-50 text-xs font-medium">
            {simulation.badge}
          </span>
        </div>

        {/* 제목 */}
        <div className="px-6 pb-3 shrink-0">
          <h1 className="text-xl font-bold text-foreground-950 font-heading">
            {simulation.title}
          </h1>
        </div>

        {/* 설명 */}
        <div className="px-6 pb-4 shrink-0">
          <div className="border-l-2 border-accent-500 pl-3 py-1.5 bg-accent-50/30 rounded-r-lg">
            <p className="text-sm text-foreground-700 leading-relaxed">
              {simulation.description}
            </p>
          </div>
        </div>

        {/* 부가 상황 */}
        <div className="px-6 pb-2 shrink-0 grid grid-cols-2 gap-3">
          {simulation.stats.map((stat, idx) => (
            <div key={idx} className="bg-background-100 rounded-xl p-3">
              <p className="text-xs text-foreground-500 mb-0.5">{stat.label}</p>
              <p className="text-sm font-bold text-foreground-950">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* 질문 + 선택지 */}
        <div className="flex-1 overflow-y-auto px-6 pt-4 pb-4 space-y-3">
          <h2 className="text-base font-bold text-foreground-950 font-heading">
            {simulation.question}
          </h2>
          <div className="space-y-2.5">
            {simulation.options.map((opt) => (
              <SimOptionCard
                key={opt.value}
                letter={opt.value.toUpperCase()}
                label={opt.label}
                subtitle={opt.subtitle}
                selected={selected === opt.value}
                onClick={() => setSelected(opt.value)}
              />
            ))}
          </div>
        </div>

        {/* 다음 버튼 */}
        <div className="px-6 py-5 shrink-0 bg-background-50 border-t border-background-100">
          <button
            type="button"
            onClick={() => navigate(nextPath)}
            disabled={!selected}
            className={`
              w-full font-semibold py-4 rounded-lg transition-colors whitespace-nowrap
              ${selected
                ? 'bg-primary-500 hover:bg-primary-600 text-background-50'
                : 'bg-background-200 text-foreground-400 cursor-not-allowed'
              }
            `}
          >
            {isLast ? '분석 시작하기' : '다음 단계'}
          </button>
        </div>
    </>
  );
}
