interface MoneyInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  icon?: string;
  suffix?: string;
}

export default function MoneyInput({
  value,
  onChange,
  placeholder = '금액을 입력하세요',
  icon,
  suffix = '만원',
}: MoneyInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/[^\d]/g, '');
    onChange(digits);
  };

  const hasValue = value.length > 0;

  return (
    <div
      className={`
        w-full rounded-xl border transition-all duration-200
        flex items-center gap-3 px-4 py-3.5 cursor-text
        ${hasValue
          ? 'border-primary-500 bg-primary-50'
          : 'border-background-200 bg-background-50 hover:border-background-300 hover:bg-background-100'
        }
      `}
    >
      {icon && (
        <div className={`
          w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors
          ${hasValue ? 'bg-primary-500 text-background-50' : 'bg-background-200 text-foreground-500'}
        `}>
          <i className={`${icon} w-4 h-4 flex items-center justify-center`} />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <input
          type="text"
          inputMode="numeric"
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          className="w-full bg-transparent text-sm font-medium text-foreground-950 outline-none placeholder:text-foreground-400"
        />
      </div>
      {hasValue && (
        <span className="text-sm text-foreground-600 shrink-0 whitespace-nowrap">{suffix}</span>
      )}
      {hasValue && (
        <div className="w-5 h-5 rounded-full bg-primary-500 flex items-center justify-center shrink-0">
          <i className="ri-check-line text-background-50 text-xs w-3 h-3 flex items-center justify-center" />
        </div>
      )}
    </div>
  );
}