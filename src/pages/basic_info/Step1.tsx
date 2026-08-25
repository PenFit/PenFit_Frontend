import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProgressBar from '../../components/ProgressBar';
import OptionCard from '../../components/OptionCard';
import SectionTitle from '../../components/SectionTitle';
import MoneyInput from '../../components/MoneyInput';

const ageOptions = [
  { value: 'early20s', label: '20대 초반 (23~25세)', icon: 'ri-user-line' },
  { value: 'mid20s', label: '20대 중반 (26~28세)', icon: 'ri-user-line' },
  { value: 'late20s', label: '20대 후반 (29~31세)', icon: 'ri-user-line' },
  { value: 'early30s', label: '30대 초반 (32~34세)', icon: 'ri-user-line' },
];

const jobOptions = [
  { value: 'regular', label: '정규직', icon: 'ri-briefcase-line' },
  { value: 'contract', label: '계약직', icon: 'ri-file-list-line' },
  { value: 'freelancer', label: '프리랜서', icon: 'ri-user-star-line' },
  { value: 'business', label: '자영업자', icon: 'ri-store-3-line' },
  { value: 'public', label: '공무원', icon: 'ri-government-line' },
  { value: 'unemployed', label: '무직', icon: 'ri-user-unfollow-line' },
  { value: 'other', label: '기타', icon: 'ri-more-line' },
];

export default function Step1() {
  const navigate = useNavigate();

  const [age, setAge] = useState<string>('');
  const [job, setJob] = useState<string>('');
  const [salary, setSalary] = useState<string>('');

  const allSelected = age && job && salary;

  return (
    <>
        <ProgressBar current={1} total={3} />

        {/* Header */}
        <div className="px-6 pt-6 pb-4 shrink-0">
          <h1 className="text-xl font-bold text-foreground-950 mb-1 font-heading">
            기본 정보를 알려주세요
          </h1>
          <p className="text-sm text-foreground-500">
            가상 체험에만 사용되며 저장되지 않아요
          </p>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 pb-4 space-y-6">
          {/* Age Section */}
          <div>
            <SectionTitle title="나이" />
            <div className="space-y-2">
              {ageOptions.map((opt) => (
                <OptionCard
                  key={opt.value}
                  label={opt.label}
                  icon={opt.icon}
                  selected={age === opt.value}
                  onClick={() => setAge(opt.value)}
                />
              ))}
            </div>
          </div>

          {/* Job Section */}
          <div>
            <SectionTitle title="직업 · 고용형태" />
            <div className="space-y-2">
              {jobOptions.map((opt) => (
                <OptionCard
                  key={opt.value}
                  label={opt.label}
                  icon={opt.icon}
                  selected={job === opt.value}
                  onClick={() => setJob(opt.value)}
                />
              ))}
            </div>
          </div>

          {/* Salary Section */}
          <div>
            <SectionTitle title="월급" />
            <MoneyInput
              value={salary}
              onChange={setSalary}
              placeholder="월급을 입력하세요"
              icon="ri-money-cny-circle-line"
              suffix="만원"
            />
          </div>
        </div>

        {/* Bottom Button */}
        <div className="px-6 py-5 shrink-0 bg-background-50 border-t border-background-100">
          <button
            type="button"
            onClick={() => navigate('/step2')}
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