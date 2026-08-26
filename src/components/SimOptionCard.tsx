interface SimOptionCardProps {
  letter: string;
  label: string;
  subtitle?: string;
  selected: boolean;
  onClick: () => void;
}

export default function SimOptionCard({ letter, label, subtitle, selected, onClick }: SimOptionCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        w-full text-left rounded-xl border transition-all duration-200 flex items-center gap-3 px-4 py-3.5 cursor-pointer
        ${selected
          ? 'border-primary-500 bg-primary-50'
          : 'border-background-200 bg-background-50 hover:border-background-300 hover:bg-background-100'
        }
      `}
    >
      <div className={`
        w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold transition-colors
        ${selected ? 'bg-primary-500 text-background-50' : 'bg-foreground-950 text-background-50'}
      `}>
        {letter}
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-semibold ${selected ? 'text-primary-900' : 'text-foreground-950'}`}>
          {label}
        </p>
        {subtitle && (
          <p className="text-xs text-foreground-500 mt-0.5">{subtitle}</p>
        )}
      </div>
      {selected && (
        <div className="w-5 h-5 rounded-full bg-primary-500 flex items-center justify-center shrink-0">
          <i className="ri-check-line text-background-50 text-xs w-3 h-3 flex items-center justify-center" />
        </div>
      )}
    </button>
  );
}