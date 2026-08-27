import StatusScreen from '../../components/StatusScreen';

export default function StatusEmpty() {
  return (
    <StatusScreen
      icon="ri-file-search-line"
      iconBgClass="bg-secondary-100"
      iconColorClass="text-secondary-500"
      title="저장된 결과가 아직 없어요"
      description="상품 추천은 시뮬레이션 결과가 필요해요. 6단계 가상 체험을 먼저 해볼까요?"
      primaryAction={{
        label: '시뮬레이션 시작하기',
        path: '/simulation/1',
      }}
      secondaryAction={{
        label: '홈으로 돌아가기',
        path: '/home',
        variant: 'secondary',
      }}
    />
  );
}