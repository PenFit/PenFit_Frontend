interface OptionCardProps {
  label: string;
  selected: boolean;
  onClick: () => void;
  icon?: string;
}

export default function OptionCard({ label, selected, onClick, icon }: OptionCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        w-full text-left px-4 py-3.5 rounded-xl border transition-all duration-200
        flex items-center gap-3 cursor-pointer
        ${selected
          ? 'border-primary-500 bg-primary-50 text-primary-900'
          : 'border-background-200 bg-background-50 text-foreground-700 hover:border-background-300 hover:bg-background-100'
        }
      `}
    >
      {icon && (
        <div className={`
          w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors
          ${selected ? 'bg-primary-500 text-background-50' : 'bg-background-200 text-foreground-500'}
        `}>
          <i className={`${icon} w-4 h-4 flex items-center justify-center`} />
        </div>
      )}
      <span className="text-sm font-medium">{label}</span>
      {selected && (
        <div className="ml-auto w-5 h-5 rounded-full bg-primary-500 flex items-center justify-center shrink-0">
          <i className="ri-check-line text-background-50 text-xs w-3 h-3 flex items-center justify-center" />
        </div>
      )}
    </button>
  );
}