export const spendingPattern = {
  total: '외식·배달',
  totalAmount: '18만원',
  topPercentage: '55%',
  categories: [
    { name: '외식·배달', amount: 180000, percentage: 55, color: 'bg-accent-500' },
    { name: '쇼핑', amount: 95000, percentage: 29, color: 'bg-accent-400' },
    { name: '교통', amount: 35000, percentage: 11, color: 'bg-accent-300' },
    { name: '구독', amount: 12000, percentage: 4, color: 'bg-secondary-300' },
    { name: '기타', amount: 3000, percentage: 1, color: 'bg-secondary-200' },
  ],
  keySpending: [
    '커피숍 방문 주 5회 + 배달음식 주 3회',
    '월간 구독 서비스 4개 (OTT + 음악 + 운동 + 도서)',
    '주말 외식 평균 6.5만원 지출',
  ],
};

export const weeklyMissions = [
  {
    id: 1,
    title: '커피값 아껴서 연금 넣어보기',
    subtitle: '이번 주 핵심 미션',
    description: '외식·배달비 전체 지출의 32%를 차지하고 있어요',
    goal: '이번 주 3만원 아껴서 연금계좌 추가 납입',
    deadline: '6월 8일 (일) 자정까지',
    reward: '연금 저축 +3만원',
    progress: 0,
    status: 'pending',
    metrics: [
      { label: '외식·배달비', value: '32%', desc: '전체 지출 중' },
      { label: '목표', value: '3만원', desc: '연금 추가 납입' },
      { label: '마감', value: 'D-5', desc: '6월 8일까지' },
    ],
  },
  {
    id: 2,
    title: '구독 서비스 점검하기',
    subtitle: '구독 절약 미션',
    description: '4개 구독 서비스 중 사용하지 않는 서비스를 정리해보세요',
    goal: '불필요한 구독 해지하고 월 1만원 연금에 추가',
    deadline: '6월 10일 (화) 자정까지',
    reward: '연금 저축 +1만원',
    progress: 0,
    status: 'pending',
    metrics: [
      { label: '구독', value: '4개', desc: '현재 가입 중' },
      { label: '목표', value: '1만원', desc: '연금 추가 납입' },
      { label: '마감', value: 'D-7', desc: '6월 10일까지' },
    ],
  },
  {
    id: 3,
    title: '주말 외식 예산 줄이기',
    subtitle: '생활비 절약 미션',
    description: '주말 외식 평균 6.5만원 중 2만원 줄여 연금에 넣어보세요',
    goal: '주말 외식비 2만원 절약 → 연금 추가 납입',
    deadline: '6월 12일 (목) 자정까지',
    reward: '연금 저축 +2만원',
    progress: 0,
    status: 'pending',
    metrics: [
      { label: '주말 외식', value: '6.5만원', desc: '평균 지출' },
      { label: '목표', value: '2만원', desc: '연금 추가 납입' },
      { label: '마감', value: 'D-9', desc: '6월 12일까지' },
    ],
  },
];

export const emailReportItems = [
  {
    icon: 'ri-mail-send-line',
    title: '이번 주 행동 미션 결과와 목표 금액',
  },
  {
    icon: 'ri-bar-chart-2-line',
    title: '지난주 미션 달성 결과와 소비 분석',
  },
];