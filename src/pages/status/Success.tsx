import StatusScreen from '../../components/StatusScreen';

export default function StatusSuccess() {
  return (
    <StatusScreen
      icon="ri-passport-line"
      iconBgClass="bg-primary-100"
      iconColorClass="text-primary-500"
      title="패스포트가 준비됐어요"
      description="내 연금 성향과 유지 가능 납입액을 패스포트에서 확인해보세요."
      primaryAction={{
        label: '패스포트 열기',
        path: '/passport',
      }}
      secondaryAction={{
        label: '홈 화면 가기',
        path: '/home',
        variant: 'secondary',
      }}
    />
  );
}