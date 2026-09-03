import { useState, useCallback } from 'react';

interface AmountSliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  inputMax?: number;
}

export default function AmountSlider({
  value,
  onChange,
  min = 5,
  max = 100,
  step = 5,
  inputMax = max,
}: AmountSliderProps) {
  const percentage = Math.min(((value - min) / (max - min)) * 100, 100);
  const [draft, setDraft] = useState<string>('');

  const handleSliderChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(Number(e.target.value));
    },
    [onChange]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value.replace(/[^0-9]/g, '');
      setDraft(raw);
      if (raw !== '') {
        const num = Number(raw);
        if (Number.isSafeInteger(num)) {
          onChange(Math.min(Math.max(num, min), inputMax));
        }
      }
    },
    [onChange, min, inputMax]
  );

  const handleInputBlur = useCallback(() => {
    setDraft('');
  }, []);

  return (
    <div className="space-y-4">
      {/* 금액 표시 */}
      <div className="text-center">
        <div className="inline-flex items-baseline gap-1">
          <span className="text-3xl font-bold text-foreground-950 font-heading">
            {value}
          </span>
          <span className="text-base text-foreground-600">만원</span>
        </div>
        <p className="text-xs text-foreground-400 mt-1">월 납입 예상 금액</p>
      </div>

      {/* 슬라이더 */}
      <div className="relative px-1">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={Math.min(value, max)}
          onChange={handleSliderChange}
          className="w-full h-2 bg-background-200 rounded-full appearance-none cursor-pointer slider-input"
          style={{
            background: `linear-gradient(to right, oklch(var(--primary-500)) 0%, oklch(var(--primary-500)) ${percentage}%, oklch(var(--background-200)) ${percentage}%, oklch(var(--background-200)) 100%)`,
          }}
        />
        <div className="flex justify-between mt-2">
          <span className="text-[11px] text-foreground-400">{min}만원</span>
          <span className="text-[11px] text-foreground-400">{max}만원</span>
        </div>
      </div>

      {/* 버튼 */}
      <div className="grid grid-cols-4 gap-2">
        {[10, 20, 30, 50].map((amount) => (
          <button
            key={amount}
            type="button"
            onClick={() => onChange(amount)}
            className={`
              py-2.5 rounded-lg text-sm font-medium transition-colors
              ${value === amount
                ? 'bg-primary-500 text-background-50'
                : 'bg-background-100 text-foreground-600 hover:bg-background-200'
              }
            `}
          >
            {amount}만
          </button>
        ))}
      </div>

      {/* 직접 입력 */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-foreground-500 whitespace-nowrap">직접 입력</span>
        <div className="flex-1 flex items-center bg-background-100 border border-background-200 rounded-lg focus-within:border-primary-400 focus-within:ring-1 focus-within:ring-primary-400/20 transition-all overflow-hidden">
          <input
            type="text"
            inputMode="numeric"
            value={draft}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            placeholder={`${min}만원~${inputMax.toLocaleString('ko-KR')}만원`}
            className="w-full px-3 py-2.5 bg-transparent text-sm text-foreground-950 outline-none placeholder:text-foreground-400"
          />
          <span className="pr-3 text-xs text-foreground-500 whitespace-nowrap">만원</span>
        </div>
      </div>
    </div>
  );
}
