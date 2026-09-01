interface AccountCardProps {
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  selected: boolean;
  onClick: () => void;
}

export default function AccountCard({
  title,
  subtitle,
  description,
  tags,
  selected,
  onClick,
}: AccountCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        w-full text-left p-5 rounded-xl border transition-all duration-200 cursor-pointer
        ${selected
          ? 'border-primary-500 bg-primary-50 ring-1 ring-primary-500/20'
          : 'border-background-200 bg-background-50 hover:border-background-300 hover:bg-background-100'
        }
      `}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-xs text-foreground-400 font-medium mb-1">{subtitle}</p>
          <h3 className={`text-base font-bold mb-2 font-heading ${selected ? 'text-primary-900' : 'text-foreground-950'}`}>
            {title}
          </h3>
          <p className="text-sm text-foreground-600 leading-relaxed mb-3">
            {description}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <span
                key={tag}
                className={`
                  inline-block text-[11px] px-2 py-0.5 rounded-md font-medium
                  ${selected
                    ? 'bg-primary-100 text-primary-700'
                    : 'bg-background-200 text-foreground-500'
                  }
                `}
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
        <div className={`
          w-5 h-5 rounded-full border-2 shrink-0 mt-1 transition-all flex items-center justify-center
          ${selected
            ? 'border-primary-500 bg-primary-500'
            : 'border-background-300 bg-background-50'
          }
        `}>
          {selected && (
            <div className="w-2 h-2 rounded-full bg-background-50" />
          )}
        </div>
      </div>
    </button>
  );
}