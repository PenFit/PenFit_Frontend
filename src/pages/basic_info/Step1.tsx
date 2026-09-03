import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProgressBar from '../../components/ProgressBar';
import OptionCard from '../../components/OptionCard';
import SectionTitle from '../../components/SectionTitle';
import MoneyInput from '../../components/MoneyInput';
import { clearFinancialProfileDraft, saveFinancialProfileDraft } from './financialProfileDraft';
import {
  AGE_BAND_CODES,
  OCCUPATION_TYPE_CODES,
  isAllowedCode,
  isValidFinancialAmount,
} from './financialProfileValidation';

const ageOptions = [
  { value: 'AGE_23_25', label: '20대 초반 (23~25세)', icon: 'ri-user-line' },
  { value: 'AGE_26_28', label: '20대 중반 (26~28세)', icon: 'ri-user-line' },
  { value: 'AGE_29_31', label: '20대 후반 (29~31세)', icon: 'ri-user-line' },
  { value: 'AGE_32_34', label: '30대 초반 (32~34세)', icon: 'ri-user-line' },
];

const jobOptions = [
  { value: 'REGULAR_EMPLOYEE', label: '정규직', icon: 'ri-briefcase-line' },
  { value: 'CONTRACT_EMPLOYEE', label: '계약직', icon: 'ri-file-list-line' },
  { value: 'FREELANCER', label: '프리랜서', icon: 'ri-user-star-line' },
  { value: 'SELF_EMPLOYED', label: '자영업자', icon: 'ri-store-3-line' },
  { value: 'PUBLIC_OFFICIAL', label: '공무원', icon: 'ri-government-line' },
  { value: 'UNEMPLOYED', label: '무직', icon: 'ri-user-unfollow-line' },
  { value: 'OTHER', label: '기타', icon: 'ri-more-line' },
];

export default function Step1() {
  const navigate = useNavigate();

  const [age, setAge] = useState<string>('');
  const [job, setJob] = useState<string>('');
  const [salary, setSalary] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState('');

  const allSelected = age && job && salary;

  const handleNext = () => {
    const monthlySalary = Number(salary);

    if (!allSelected) {
      return;
    }

    if (
      !isAllowedCode(age, AGE_BAND_CODES) ||
      !isAllowedCode(job, OCCUPATION_TYPE_CODES) ||
      !isValidFinancialAmount(monthlySalary)
    ) {
      setErrorMessage('입력한 정보를 다시 확인해주세요.');
      return;
    }

    clearFinancialProfileDraft();
    saveFinancialProfileDraft({
      ageBand: age,
      occupationType: job,
      monthlySalary,
    });
    navigate('/step2');
  };

  return (
    <>
        <ProgressBar current={1} total={3} />

        {/* 헤더 */}
        <div className="px-6 pt-6 pb-4 shrink-0">
          <h1 className="text-xl font-bold text-foreground-950 mb-1 font-heading">
            기본 정보를 알려주세요
          </h1>
          <p className="text-sm text-foreground-500">
            연금 시뮬레이션과 추천에 사용돼요
          </p>
        </div>

        {/* 내용 */}
        <div className="flex-1 overflow-y-auto px-6 pb-4 space-y-6">
          {/* 나이 섹션 */}
          <div>
            <SectionTitle title="나이" />
            <div className="space-y-2">
              {ageOptions.map((opt) => (
                <OptionCard
                  key={opt.value}
                  label={opt.label}
                  icon={opt.icon}
                  selected={age === opt.value}
	                  onClick={() => {
                      setAge(opt.value);
                      setErrorMessage('');
                    }}
                />
              ))}
            </div>
          </div>

          {/* 직업 섹션 */}
          <div>
            <SectionTitle title="직업 · 고용형태" />
            <div className="space-y-2">
              {jobOptions.map((opt) => (
                <OptionCard
                  key={opt.value}
                  label={opt.label}
                  icon={opt.icon}
                  selected={job === opt.value}
	                  onClick={() => {
                      setJob(opt.value);
                      setErrorMessage('');
                    }}
                />
              ))}
            </div>
          </div>

          {/* 월급 섹션 */}
          <div>
            <SectionTitle title="월급" />
            <MoneyInput
              value={salary}
	              onChange={(value) => {
                  setSalary(value);
                  setErrorMessage('');
                }}
              placeholder="월급을 원 단위로 입력하세요"
              icon="ri-money-cny-circle-line"
              suffix="원"
            />
	          </div>
            {errorMessage && (
              <p className="text-sm font-semibold text-accent-600">
                {errorMessage}
              </p>
            )}
	        </div>

        {/* 다음 버튼 */}
        <div className="px-6 py-5 shrink-0 bg-background-50 border-t border-background-100">
          <button
            type="button"
            onClick={handleNext}
            disabled={!allSelected}
            className={`
              w-full font-semibold py-4 rounded-lg transition-colors whitespace-nowrap
              ${allSelected
                ? 'bg-primary-500 hover:bg-primary-600 text-background-50'
                : 'bg-background-200 text-foreground-400 cursor-not-allowed'
              }
            `}
          >
            다음
          </button>
        </div>
    </>
  );
}
