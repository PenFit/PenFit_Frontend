import { useNavigate } from 'react-router-dom';

interface StatusAction {
  label: string;
  path?: string;
  variant?: 'primary' | 'secondary';
}

interface StatusScreenProps {
  icon: string;
  iconBgClass: string;
  iconColorClass: string;
  title: string;
  description: string;
  primaryAction: StatusAction;
  secondaryAction?: StatusAction;
}

export default function StatusScreen({
  icon,
  iconBgClass,
  iconColorClass,
  title,
  description,
  primaryAction,
  secondaryAction,
}: StatusScreenProps) {
  const navigate = useNavigate();

  const handleClick = (action: StatusAction) => {
    if (action.path) {
      navigate(action.path);
    }
  };

  return (
    <main className="flex h-full min-h-0 flex-col bg-background-50 px-6">
      <div className="flex min-h-0 flex-1 flex-col items-center justify-center pb-8 pt-6">
          {/* 아이콘 */}
          <div className={`
            w-20 h-20 rounded-full flex items-center justify-center mb-6
            animate-status-bounce
            ${iconBgClass}
          `}>
            <i className={`
              ${icon} text-3xl w-10 h-10 flex items-center justify-center
              ${iconColorClass}
            `} />
          </div>

          {/* 타이틀 */}
          <h1 className="text-2xl font-bold text-foreground-950 font-heading mb-3 text-center animate-fade-in">
            {title}
          </h1>

          {/* 설명 */}
          <p className="text-sm text-foreground-600 text-center leading-relaxed mb-10 max-w-70 animate-fade-in">
            {description}
          </p>

          <div className="w-full">
          {/* 주요 버튼 */}
          <button
            type="button"
            onClick={() => handleClick(primaryAction)}
            className={`
              w-full py-3.5 rounded-xl text-sm font-semibold transition-colors whitespace-nowrap cursor-pointer animate-fade-in
              ${primaryAction.variant === 'secondary'
                ? 'bg-background-100 hover:bg-background-200 text-foreground-700 border border-background-200'
                : 'bg-primary-500 hover:bg-primary-600 text-background-50'
              }
            `}
          >
            {primaryAction.label}
          </button>

          {/* 서브 버튼 */}
          {secondaryAction && (
            <button
              type="button"
              onClick={() => handleClick(secondaryAction)}
              className={`
                mt-3 w-full py-3 rounded-xl text-sm transition-colors whitespace-nowrap cursor-pointer animate-fade-in
                ${secondaryAction.variant === 'secondary'
                  ? 'bg-background-100 hover:bg-background-200 text-foreground-700 border border-background-200'
                  : 'text-foreground-400 hover:text-foreground-600'
                }
              `}
            >
              {secondaryAction.label}
            </button>
          )}
          </div>
      </div>
    </main>
  );
}
