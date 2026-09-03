import { useState } from 'react';
import { isAxiosError } from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { retryRehearsalAnalysis } from '../../apis/simulation';
import StatusScreen from '../../components/StatusScreen';
import { getStoredRehearsalId } from '../../utils/rehearsalStorage';

const DEFAULT_DESCRIPTION = '네트워크 문제일 수 있어요. 다시 시도해주세요.';

interface ErrorLocationState {
  code?: string;
  message?: string;
}

export default function StatusError() {
  const navigate = useNavigate();
  const location = useLocation();
  const errorState = location.state as ErrorLocationState | null;
  const initialDescription = errorState?.message
    ? `${errorState.message}${errorState.code ? ` (${errorState.code})` : ''}`
    : DEFAULT_DESCRIPTION;
  const [isRetrying, setIsRetrying] = useState(false);
  const [description, setDescription] = useState(initialDescription);

  const handleRetry = async () => {
    const rehearsalId = getStoredRehearsalId();

    if (!rehearsalId || isRetrying) {
      navigate('/result-preview', { replace: true });
      return;
    }

    setIsRetrying(true);
    setDescription(DEFAULT_DESCRIPTION);

    try {
      await retryRehearsalAnalysis(rehearsalId);
      navigate('/loading', { replace: true });
    } catch (error) {
      if (isAxiosError(error)) {
        console.error('리허설 AI 분석 재시도 실패 응답', error.response?.data);
      }
      console.error('리허설 AI 분석 재시도에 실패했어요.', error);
      setDescription('다시 시도하지 못했어요. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsRetrying(false);
    }
  };

  return (
    <StatusScreen
      icon="ri-error-warning-line"
      iconBgClass="bg-accent-100"
      iconColorClass="text-accent-500"
      title="분석에 실패했어요"
      description={description}
      primaryAction={{
        label: isRetrying ? '다시 시도 중' : '다시 시도하기',
        onClick: handleRetry,
        disabled: isRetrying,
      }}
      secondaryAction={{
        label: '이전 단계로',
        path: '/simulation/6',
        variant: 'secondary',
      }}
    />
  );
}
