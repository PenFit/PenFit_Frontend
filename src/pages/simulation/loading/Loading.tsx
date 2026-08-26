import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface CheckItem {
  label: string;
  status: 'pending' | 'loading' | 'done';
}

const initialItems: CheckItem[] = [
  { label: '납입 행동 분석 중', status: 'loading' },
  { label: '시장 대응 성향 분석 중', status: 'pending' },
  { label: '유지 가능한 연금계획 생성 중', status: 'pending' },
];

export default function Loading() {
  const navigate = useNavigate();

  const [items, setItems] = useState<CheckItem[]>(initialItems);

  useEffect(() => {
    const timers: number[] = [];

    timers.push(window.setTimeout(() => {
      setItems((prev) => [
        { ...prev[0], status: 'done' },
        { ...prev[1], status: 'loading' },
        prev[2],
      ]);
    }, 1800));

    timers.push(window.setTimeout(() => {
      setItems((prev) => [
        prev[0],
        { ...prev[1], status: 'done' },
        { ...prev[2], status: 'loading' },
      ]);
    }, 4200));

    timers.push(window.setTimeout(() => {
      setItems((prev) => [
        prev[0],
        prev[1],
        { ...prev[2], status: 'done' },
      ]);
    }, 7000));

    const navTimer = window.setTimeout(() => {
      navigate('/home');
    }, 9500);

    return () => {
      timers.forEach((id) => window.clearTimeout(id));
      window.clearTimeout(navTimer);
    };
  }, [navigate]);

  return (
    <>
        <div className="flex-1 flex flex-col items-center justify-center px-6">
          {/* 제목 */}
          <div className="text-center mb-10">
            <h1 className="text-xl font-bold text-foreground-950 font-heading mb-2 animate-fade-in">
              AI가 분석 중이에요
            </h1>
            <p className="text-sm text-foreground-500 leading-relaxed animate-fade-in">
              방금 선택한 행동을 바탕으로
              <br />
              당신의 연금 성향을 분석하고 있어요
            </p>
          </div>

          {/* 스피너 */}
          <div className="relative w-24 h-24 mb-12">
            <div className="absolute inset-0 spinner-arc-1" />
            <div className="absolute inset-0 spinner-arc-2" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-primary-50 flex items-center justify-center">
                <i className="ri-shield-check-line text-primary-500 text-xl w-6 h-6 flex items-center justify-center" />
              </div>
            </div>
          </div>

          {/* 체크리스트 */}
          <div className="w-full space-y-4 mb-10">
            {items.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 transition-all duration-500"
              >
                {item.status === 'done' && (
                  <div className="w-5 h-5 rounded-full bg-primary-500 flex items-center justify-center shrink-0">
                    <i className="ri-check-line text-background-50 text-xs w-3 h-3 flex items-center justify-center" />
                  </div>
                )}
                {item.status === 'loading' && (
                  <div className="w-5 h-5 rounded-full border-2 border-primary-500 border-t-transparent animate-spin shrink-0" />
                )}
                {item.status === 'pending' && (
                  <div className="w-5 h-5 rounded-full border-2 border-background-300 shrink-0" />
                )}
                <span className={`
                  text-sm font-medium transition-colors duration-500
                  ${item.status === 'done' ? 'text-foreground-700' : ''}
                  ${item.status === 'loading' ? 'text-foreground-950' : ''}
                  ${item.status === 'pending' ? 'text-foreground-400' : ''}
                `}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>

          {/* 푸터 힌트 */}
          <p className="text-xs text-foreground-400 text-center leading-relaxed animate-fade-in">
            보통 10초 이내에 완료돼요.
            <br />
            완료되면 자동으로 리포트 페이지로 넘어갑니다.
          </p>
        </div>
    </>
  );
}