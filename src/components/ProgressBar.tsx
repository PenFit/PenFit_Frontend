interface ProgressBarProps {
  current: number;
  total: number;
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const progress = (current / total) * 100;

  return (
    <div className="px-6 pt-2 pb-1 shrink-0">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-medium text-foreground-500">
          {current} / {total}
        </span>
        <span className="text-xs font-medium text-foreground-500">
          {progress === 100 ? '100%' : `${Math.round(progress)}%`}
        </span>
      </div>
      <div className="w-full h-1 bg-background-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-primary-500 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
