import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyFinancialProfile, type FinancialProfile } from '../../../apis/financial';
import BottomNav from '../../../components/BottomNav';

interface UserProfileField {
  label: string;
  value: string;
  icon: string;
}

interface UserProfileSection {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  fields: UserProfileField[];
}

function formatMoney(value: number) {
  return `${value.toLocaleString('ko-KR')}만원`;
}

function createUserProfileSections(profile: FinancialProfile): UserProfileSection[] {
  return [
    {
      id: 'basic',
      title: '기본 정보',
      subtitle: 'STEP 1',
      icon: 'ri-user-line',
      fields: [
        { label: '나이', value: profile.ageBand.displayName, icon: 'ri-user-line' },
        { label: '직업 · 고용형태', value: profile.occupationType.displayName, icon: 'ri-briefcase-line' },
        { label: '월급', value: formatMoney(profile.monthlySalary), icon: 'ri-money-cny-circle-line' },
      ],
    },
    {
      id: 'finance',
      title: '생활비와 자산 상황',
      subtitle: 'STEP 2',
      icon: 'ri-wallet-3-line',
      fields: [
        { label: '월 생활비', value: profile.livingExpenseBand.displayName, icon: 'ri-restaurant-line' },
        { label: '현재 자산', value: profile.assetBand.displayName, icon: 'ri-wallet-3-line' },
        { label: '부채', value: profile.debtBand.displayName, icon: 'ri-shield-check-line' },
      ],
    },
    {
      id: 'risk',
      title: '비상 자금과 투자 현황',
      subtitle: 'STEP 3',
      icon: 'ri-first-aid-kit-line',
      fields: [
        { label: '비상금', value: profile.emergencyFundBand.displayName, icon: 'ri-first-aid-kit-line' },
        { label: '저축 금액 (월)', value: formatMoney(profile.monthlySavings), icon: 'ri-safe-line' },
        { label: '현재 투자 금액', value: formatMoney(profile.currentInvestment), icon: 'ri-line-chart-line' },
      ],
    },
  ];
}

export default function MyInfo() {
  const navigate = useNavigate();
  const [profileSections, setProfileSections] = useState<UserProfileSection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchFinancialProfile = async () => {
      try {
        const financialProfile = await getMyFinancialProfile();
        setProfileSections(createUserProfileSections(financialProfile));
      } catch (error) {
        console.error('내 금융정보 조회에 실패했어요.', error);
        setErrorMessage('입력한 금융정보를 불러오지 못했어요.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFinancialProfile();
  }, []);

  return (
    <div className="flex h-full min-h-0 flex-col">
        {/* 헤더 */}
        <div className="px-6 pt-6 pb-4 shrink-0 flex items-center gap-4">
          <button
            type="button"
            onClick={() => navigate('/mypage')}
            className="w-9 h-9 rounded-full bg-background-100 flex items-center justify-center shrink-0 cursor-pointer hover:bg-background-200 transition-colors"
          >
            <i className="ri-arrow-left-s-line text-foreground-600 text-xl w-6 h-6 flex items-center justify-center" />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-foreground-950 font-heading">
              내 정보 보기
            </h1>
            <p className="text-sm text-foreground-500">
              STEP 1~3에서 입력한 정보예요
            </p>
          </div>
        </div>

        {/* 정보 섹션 */}
        <div className="flex-1 overflow-y-auto px-6 pb-28 space-y-6">
          {isLoading && (
            <div className="flex h-full items-center justify-center">
              <p className="text-sm font-semibold text-foreground-500">
                금융정보를 불러오는 중이에요
              </p>
            </div>
          )}

          {!isLoading && errorMessage && (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent-100">
                <i className="ri-error-warning-line flex h-6 w-6 items-center justify-center text-xl text-accent-600" />
              </div>
              <p className="mb-5 text-sm font-semibold text-foreground-700">
                {errorMessage}
              </p>
              <button
                type="button"
                onClick={() => navigate('/step1')}
                className="rounded-xl bg-primary-500 px-5 py-3 text-sm font-semibold text-background-50 transition-colors hover:bg-primary-600"
              >
                정보 입력하러 가기
              </button>
            </div>
          )}

          {!isLoading && !errorMessage && profileSections.map((section) => (
            <div key={section.id} className="bg-background-100 rounded-2xl p-5">
              {/* 각 섹션 헤더 */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center shrink-0">
                  <i className={`${section.icon} text-primary-600 text-lg w-5 h-5 flex items-center justify-center`} />
                </div>
                <div className="flex-1">
                  <h2 className="text-sm font-bold text-foreground-950">
                    {section.title}
                  </h2>
                  <p className="text-xs text-primary-500 font-semibold">
                    {section.subtitle}
                  </p>
                </div>
              </div>

              {/* 내용 필드 */}
              <div className="space-y-3">
                {section.fields.map((field) => (
                  <div
                    key={field.label}
                    className="flex items-center gap-3 bg-background-50 rounded-xl px-4 py-3"
                  >
                    <div className="w-8 h-8 rounded-lg bg-background-100 flex items-center justify-center shrink-0">
                      <i className={`${field.icon} text-foreground-500 text-base w-4 h-4 flex items-center justify-center`} />
                    </div>
                    <span className="text-sm text-foreground-600 flex-1">
                      {field.label}
                    </span>
                    <span className="text-sm font-semibold text-foreground-950 text-right">
                      {field.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {!isLoading && !errorMessage && (
            /* 안내 */
            <div className="flex items-start gap-3 bg-accent-50 rounded-2xl p-4">
              <i className="ri-information-line text-accent-600 text-lg w-5 h-5 flex items-center justify-center mt-0.5 shrink-0" />
              <p className="text-xs text-accent-800 leading-relaxed">
                내 정보는 가상 체험에만 사용되며, 실제 금융상품 가입과 무관해요. 정보를 수정하려면 시뮬레이션을 다시 진행해주세요.
              </p>
            </div>
          )}
        </div>

        <BottomNav />
    </div>
  );
}
