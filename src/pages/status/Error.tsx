import { useState } from 'react';
import { isAxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import { retryRehearsalAnalysis } from '../../apis/simulation';
import StatusScreen from '../../components/StatusScreen';

function getStoredRehearsalId() {
  const storedRehearsal = sessionStorage.getItem('rehearsalStart');

  if (!storedRehearsal) {
    return null;
  }

  try {
    const rehearsal = JSON.parse(storedRehearsal) as { rehearsalId?: number };

    return rehearsal.rehearsalId ?? null;
  } catch {
    return null;
  }
}

export default function StatusError() {
  const navigate = useNavigate();
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = async () => {
    const rehearsalId = getStoredRehearsalId();

    if (!rehearsalId || isRetrying) {
      navigate('/result-preview');
      return;
    }

    setIsRetrying(true);

    try {
      const retryResult = await retryRehearsalAnalysis(rehearsalId);

      sessionStorage.setItem('rehearsalAnswerStatus', JSON.stringify(retryResult));
      console.log('리허설 AI 분석 재시도 성공', retryResult);
      navigate('/loading');
    } catch (error) {
      if (isAxiosError(error)) {
        console.error('리허설 AI 분석 재시도 실패 응답', error.response?.data);
      }
      console.error('리허설 AI 분석 재시도에 실패했어요.', error);
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
      description="네트워크 문제일 수 있어요. 다시 시도해주세요."
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
