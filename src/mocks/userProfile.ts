export interface UserProfileField {
  label: string;
  value: string;
  icon: string;
}

export interface UserProfileSection {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  fields: UserProfileField[];
}

export const userProfileSections: UserProfileSection[] = [
  {
    id: 'basic',
    title: '기본 정보',
    subtitle: 'STEP 1',
    icon: 'ri-user-line',
    fields: [
      { label: '나이', value: '20대 중반 (26~28세)', icon: 'ri-user-line' },
      { label: '직업 · 고용형태', value: '정규직', icon: 'ri-briefcase-line' },
      { label: '월급', value: '280만원', icon: 'ri-money-cny-circle-line' },
    ],
  },
  {
    id: 'finance',
    title: '생활비와 자산 상황',
    subtitle: 'STEP 2',
    icon: 'ri-wallet-3-line',
    fields: [
      { label: '월 생활비', value: '100 ~ 150만원', icon: 'ri-restaurant-line' },
      { label: '현재 자산', value: '1,000 ~ 3,000만원', icon: 'ri-wallet-3-line' },
      { label: '부채', value: '없음', icon: 'ri-shield-check-line' },
    ],
  },
  {
    id: 'risk',
    title: '비상 자금과 투자 현황',
    subtitle: 'STEP 3',
    icon: 'ri-first-aid-kit-line',
    fields: [
      { label: '비상금', value: '100 ~ 300만원', icon: 'ri-first-aid-kit-line' },
      { label: '저축 금액 (월)', value: '12만원', icon: 'ri-safe-line' },
      { label: '현재 투자 금액', value: '30만원', icon: 'ri-line-chart-line' },
    ],
  },
];