import StatusScreen from '../../components/StatusScreen';

export default function StatusError() {
  return (
    <StatusScreen
      icon="ri-error-warning-line"
      iconBgClass="bg-accent-100"
      iconColorClass="text-accent-500"
      title="분석에 실패했어요"
      description="네트워크 문제일 수 있어요. 다시 시도해주세요."
      primaryAction={{
        label: '다시 시도하기',
        path: '/loading',
      }}
      secondaryAction={{
        label: '이전 단계로',
        path: '/simulation/6',
        variant: 'secondary',
      }}
    />
  );
}