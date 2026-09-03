import { useEffect, useRef, useState } from 'react';
import { isAxiosError } from 'axios';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { completeRehearsal, saveRehearsalAnswer } from '../../apis/simulation';
import ProgressBar from '../../components/ProgressBar';
import SimOptionCard from '../../components/SimOptionCard';
import NotFound from '../NotFound';
import { useRehearsalProgress, useSimulations, useStoredRehearsalId } from '../../hooks/useSimulations';
import { Navigate } from 'react-router-dom';
import { REHEARSAL_ANSWER_STATUS_STORAGE_KEY } from '../../utils/rehearsalStorage';

export default function Simulation() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { step } = useParams<{ step: string }>();
  const rehearsalId = useStoredRehearsalId();

  const stepNum = parseInt(step || '1', 10);
  const { data: allSimulations, isLoading } = useSimulations();
  const { data: rehearsalProgress, isLoading: isProgressLoading } = useRehearsalProgress();
  const total = allSimulations?.length ?? 0;
  const simulation = allSimulations?.find((item) => item.id === stepNum);
  const savedAnswer = rehearsalProgress?.answers.find(
    (answer) => answer.scenarioCode === simulation?.scenarioCode,
  );

  const [selected, setSelected] = useState<string>('');
  const [isSavingAnswer, setIsSavingAnswer] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const isSavingAnswerRef = useRef(false);

  useEffect(() => {
    setSelected(savedAnswer?.optionCode ?? '');
    setErrorMessage('');
  }, [savedAnswer?.optionCode, stepNum]);

  if (!rehearsalId) {
    return <Navigate to="/result-preview" replace />;
  }

  // step 값이 숫자가 아니거나 문항 범위를 벗어나면 첫 번째 시뮬레이션으로 이동
  if (step && (Number.isNaN(stepNum) || stepNum < 1 || (total > 0 && stepNum > total))) {
    return <Navigate to="/simulation/1" replace />;
  }

  if (isLoading || isProgressLoading) {
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
  const previousPath = `/simulation/${stepNum - 1}`;
  const canGoPrevious = stepNum > 1 && !isSavingAnswer;

  const handleNext = async () => {
    if (!selected || !simulation.scenarioCode || isSavingAnswer || isSavingAnswerRef.current) {
      return;
    }

    const isValidOption = simulation.options.some((option) => option.value === selected);

    if (!isValidOption) {
      setErrorMessage('선택할 수 없는 답변이에요. 다시 선택해주세요.');
      return;
    }

    setErrorMessage('');

    if (savedAnswer?.optionCode === selected) {
      if (!isLast) {
        navigate(nextPath);
        return;
      }

      isSavingAnswerRef.current = true;
      setIsSavingAnswer(true);

      try {
        const completeResult = await completeRehearsal(rehearsalId);
        sessionStorage.setItem(REHEARSAL_ANSWER_STATUS_STORAGE_KEY, JSON.stringify(completeResult));
        navigate(nextPath);
      } catch (error) {
        if (isAxiosError(error)) {
          console.error('리허설 완료 제출 실패 응답', error.response?.data);
        }
        console.error('리허설 완료 제출에 실패했어요.', error);
        setErrorMessage('리허설 제출에 실패했어요. 다시 시도해주세요.');
      } finally {
        isSavingAnswerRef.current = false;
        setIsSavingAnswer(false);
      }

      return;
    }

    isSavingAnswerRef.current = true;
    setIsSavingAnswer(true);

    try {
      const answerResult = await saveRehearsalAnswer(
        rehearsalId,
        simulation.scenarioCode,
        selected,
      );

      sessionStorage.setItem(REHEARSAL_ANSWER_STATUS_STORAGE_KEY, JSON.stringify(answerResult));
      queryClient.invalidateQueries({ queryKey: ['simulations', rehearsalId, 'progress'] });

      if (isLast) {
        const completeResult = await completeRehearsal(rehearsalId);
        sessionStorage.setItem(REHEARSAL_ANSWER_STATUS_STORAGE_KEY, JSON.stringify(completeResult));
      }

      navigate(nextPath);
    } catch (error) {
      if (isAxiosError(error)) {
        console.error('리허설 답변 처리 실패 응답', error.response?.data);
      }
      console.error('리허설 답변 처리에 실패했어요.', error);
      setErrorMessage('답변을 저장하지 못했어요. 다시 시도해주세요.');
    } finally {
      isSavingAnswerRef.current = false;
      setIsSavingAnswer(false);
    }
  };

  return (
    <>
        <ProgressBar current={stepNum} total={total} />

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
                letter={opt.letter ?? opt.value.toUpperCase()}
                label={opt.label}
                subtitle={opt.subtitle}
                selected={selected === opt.value}
                onClick={() => {
                  setSelected(opt.value);
                  if (errorMessage) {
                    setErrorMessage('');
                  }
                }}
              />
            ))}
          </div>
        </div>

        {/* 이동 버튼 */}
        <div className="px-6 py-5 shrink-0 bg-background-50 border-t border-background-100">
          {errorMessage && (
            <p className="mb-3 text-center text-sm font-medium text-accent-600">
              {errorMessage}
            </p>
          )}
          <div className="grid grid-cols-[0.75fr_1.25fr] gap-3">
            {stepNum > 1 && (
              <button
                type="button"
                onClick={() => navigate(previousPath)}
                disabled={!canGoPrevious}
                className="rounded-lg border border-background-300 py-4 text-sm font-semibold text-foreground-700 transition-colors hover:bg-background-100 disabled:cursor-not-allowed disabled:opacity-50 whitespace-nowrap"
              >
                이전
              </button>
            )}
            <button
              type="button"
              onClick={handleNext}
              disabled={!selected || isSavingAnswer}
              className={`
                font-semibold py-4 rounded-lg transition-colors whitespace-nowrap
                ${stepNum === 1 ? 'col-span-2 w-full' : 'w-full'}
                ${selected && !isSavingAnswer
                  ? 'bg-primary-500 hover:bg-primary-600 text-background-50'
                  : 'bg-background-200 text-foreground-400 cursor-not-allowed'
                }
              `}
            >
              {isSavingAnswer ? (isLast ? '분석 요청 중' : '저장 중') : isLast ? '분석 시작하기' : '다음 단계'}
            </button>
          </div>
        </div>
    </>
  );
}
