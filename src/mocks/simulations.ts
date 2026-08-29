export interface SimOption {
  value: string;
  letter?: string;
  label: string;
  subtitle?: string;
}

export interface SimStat {
  label: string;
  value: string;
}

export interface Simulation {
  id: number;
  scenarioCode?: string;
  badge: string;
  title: string;
  description: string;
  stats: SimStat[];
  question: string;
  options: SimOption[];
}

export const simulations: Simulation[] = [
  {
    id: 1,
    badge: '현재 29세 · 퇴사 후 1개월차',
    title: '이직',
    description: '새로운 직장을 찾기 위해 퇴사했습니다. 앞으로 4개월 동안 소득이 없고, 현재 비상금으로 약 6개월의 생활비를 감당할 수 있습니다. 현재 연금에는 매월 10만 원을 납입하고 있습니다.',
    stats: [
      { label: '현재 월 납입액', value: '10만원' },
      { label: '비상금 현황', value: '6개월 생활비' },
    ],
    question: '소득이 없는 동안 연금계획을 어떻게 하시겠습니까?',
    options: [
      { value: 'a', label: '비상금을 사용해 월 10만 원을 그대로 납입한다', subtitle: '복리 효과를 유지하되 비상금이 2개월 줄어듦' },
      { value: 'b', label: '월 납입액을 10만 원에서 5만 원으로 줄인다', subtitle: '부담을 절반으로 줄이고 비상금을 아낌' },
      { value: 'c', label: '취업할 때까지 납입을 잠시 중단한다', subtitle: '약 4개월간 중단 후 취업 시 재개' },
      { value: 'd', label: '이번 달부터 납입을 중단하고 취업 후 다시 계획한다', subtitle: '단기 부담 제거, 재취업 후 신규 계획' },
      { value: 'e', label: '연금계좌를 해지하고 쌓인 돈을 생활비로 사용한다', subtitle: '세액공제 혜택 상실 및 장기 손실 우려' },
    ],
  },
  {
    id: 2,
    badge: '현재 30세 · 자취 시작',
    title: '독립 (자취)',
    description: '부모님과 함께 살다가 독립하게 되었습니다. 보증금 1,000만 원이 필요하고 월 생활비가 50만 원 증가합니다. 현재 연금에는 매월 10만 원을 납입하고 있습니다.',
    stats: [
      { label: '현재 월 납입액', value: '10만원' },
      { label: '추가 지출', value: '+50만원/월' },
    ],
    question: '독립 후 연금 납입을 어떻게 조정하시겠습니까?',
    options: [
      { value: 'a', label: '생활비를 줄이고 기존 월 10만 원 납입을 유지한다', subtitle: '입력 예정' },
      { value: 'b', label: '월 납입액을 10만 원에서 5만 원으로 줄인다', subtitle: '입력 예정' },
      { value: 'c', label: '이사 비용을 마련할 때까지만 납입을 중단한다', subtitle: '입력 예정' },
      { value: 'd', label: '독립 시기를 늦추고 연금 납입을 유지한다', subtitle: '입력 예정' },
      { value: 'e', label: '연금계좌를 해지하고 보증금에 사용한다', subtitle: '입력 예정' },
    ],
  },
  {
    id: 3,
    badge: '현재 31세 · 결혼 준비 중',
    title: '결혼',
    description: '2년 뒤 결혼을 계획하고 있습니다. 예상 결혼 비용 중 본인이 준비해야 하는 금액은 3,000만 원입니다. 현재 저축만으로는 약 1,000만 원이 부족합니다.',
    stats: [
      { label: '현재 월 납입액', value: '10만원' },
      { label: '예상 결혼 비용', value: '약 3,000만원' },
    ],
    question: '부족한 결혼자금을 마련하기 위해 연금계획을 어떻게 변경하시겠습니까?',
    options: [
      { value: 'a', label: '연금 납입은 유지하고 결혼 규모나 비용을 줄인다', subtitle: '입력 예정' },
      { value: 'b', label: '월 연금 납입액을 줄이고 차액을 결혼자금으로 모은다', subtitle: '입력 예정' },
      { value: 'c', label: '결혼할 때까지 연금 납입을 잠시 중단한다', subtitle: '입력 예정' },
      { value: 'd', label: '결혼 시기를 늦추고 현재 연금계획을 유지한다', subtitle: '입력 예정' },
      { value: 'e', label: '연금계좌를 해지해 부족한 결혼자금을 마련한다', subtitle: '입력 예정' },
    ],
  },
  {
    id: 4,
    badge: '현재 33세 · 첫 내 집 마련',
    title: '주택 구매',
    description: '원하는 주택을 구입하려면 본인 자금 8,000만 원이 필요합니다. 현재 준비한 금액은 6,000만 원으로 2,000만 원이 부족합니다. 현재 계획대로라면 약 3년 뒤 부족한 금액을 모을 수 있습니다.',
    stats: [
      { label: '현재 월 납입액', value: '10만원' },
      { label: '대출 상환', value: '+n만원/월' },
    ],
    question: '주택 구매와 연금계획을 어떻게 조정하시겠습니까?',
    options: [
      { value: 'a', label: '주택 구매를 3년 미루고 연금 납입을 유지한다', subtitle: '입력 예정' },
      { value: 'b', label: '월 연금 납입액을 줄이고 주택자금을 더 많이 모은다', subtitle: '입력 예정' },
      { value: 'c', label: '주택자금이 마련될 때까지 연금 납입을 중단한다', subtitle: '입력 예정' },
      { value: 'd', label: '더 저렴한 주택을 선택하고 연금 납입을 유지한다', subtitle: '입력 예정' },
      { value: 'e', label: '연금계좌를 해지해 주택 구매자금으로 사용한다', subtitle: '입력 예정' },
    ],
  },
  {
    id: 5,
    badge: '현재 34세 · 첫 아이 출산',
    title: '출산',
    description: '자녀가 태어나면서 매월 생활비가 60만 원 증가했습니다. 육아휴직으로 앞으로 6개월 동안 소득도 줄어듭니다. 현재 연금에는 매월 15만 원을 납입하고 있습니다.',
    stats: [
      { label: '소득 변화', value: '-40%' },
      { label: '현재 월 납입액', value: '15만원' },
    ],
    question: '육아휴직 기간 동안 연금 납입을 어떻게 하시겠습니까?',
    options: [
      { value: 'a', label: '기존 월 15만 원 납입을 그대로 유지한다', subtitle: '입력 예정' },
      { value: 'b', label: '육아휴직 기간에는 월 5만 원만 납입한다', subtitle: '입력 예정' },
      { value: 'c', label: '6개월 동안 납입을 중단하고 복직 후 다시 시작한다', subtitle: '입력 예정' },
      { value: 'd', label: '다른 생활비를 줄여 연금 납입을 유지한다', subtitle: '입력 예정' },
      { value: 'e', label: '연금계좌를 해지해 출산·육아비에 사용한다', subtitle: '입력 예정' },
    ],
  },
  {
    id: 6,
    badge: '현재 36세 · 은퇴까지 24년',
    title: '시장 하락',
    description: '금융시장 하락으로 연금계좌의 평가금액이 20% 감소했습니다. 지금까지 납입한 원금은 1,500만 원이지만 현재 평가금액은 1,200만 원입니다.',
    stats: [
      { label: '하락률', value: '-20%' },
      { label: '은퇴까지', value: '24년' },
    ],
    question: '연금계좌를 어떻게 운용하시겠습니까?',
    options: [
      { value: 'a', label: '장기투자 계획을 유지하고 기존 금액을 계속 납입한다', subtitle: '입력 예정' },
      { value: 'b', label: '현재 자산 비중을 확인하고 원래 계획에 맞게 조정한다', subtitle: '입력 예정' },
      { value: 'c', label: '투자상품 비중을 줄이고 안전자산 비중을 높인다', subtitle: '입력 예정' },
      { value: 'd', label: '추가 하락이 걱정되어 연금 납입을 중단한다', subtitle: '입력 예정' },
      { value: 'e', label: '투자상품을 정리하거나 연금계좌를 해지한다', subtitle: '입력 예정' },
      { value: 'f', label: '가격이 하락한 시점이라고 판단해 납입액을 늘린다', subtitle: '입력 예정' },
    ],
  },
];
