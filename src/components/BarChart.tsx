interface BarChartProps {
  data: { label: string; value: number }[];
  highlightIndex?: number;
}

const BAR_AREA_HEIGHT = 152;
const MIN_BAR_HEIGHT = 6;

function formatValue(value: number) {
  return `${value.toLocaleString()}만`;
}

export default function BarChart({ data, highlightIndex }: BarChartProps) {
  if (data.length === 0) {
    return null;
  }

  const maxValue = Math.max(...data.map((item) => item.value), 0);

  return (
    <div
      className="relative h-48 px-2"
      role="img"
      aria-label={`기간별 예상 연금자산 그래프. 최대 금액은 ${formatValue(maxValue)}입니다.`}
    >
      <div className="pointer-events-none absolute inset-x-2 top-8 bottom-7 flex flex-col justify-between">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-px bg-background-200/70" />
        ))}
      </div>

      <div className="relative flex h-full items-end justify-between gap-3">
      {data.map((item, index) => {
        const normalizedValue = maxValue > 0 ? item.value / maxValue : 0;
        const height = Math.max(Math.round(normalizedValue * BAR_AREA_HEIGHT), MIN_BAR_HEIGHT);
        const isHighlight = index === highlightIndex;

        return (
          <div
            key={item.label}
            className="group flex h-full flex-1 flex-col items-center justify-end gap-2"
            aria-label={`${item.label} ${formatValue(item.value)}`}
          >
            <div
              className="flex w-full flex-col items-center justify-end gap-1"
              style={{ height: BAR_AREA_HEIGHT }}
            >
              <span
                className={`whitespace-nowrap text-[10px] font-bold transition-opacity ${
                  isHighlight
                    ? "text-primary-700 opacity-100"
                    : "text-foreground-500 opacity-0 group-hover:opacity-100"
                }`}
              >
                  {formatValue(item.value)}
                </span>

              <div
                className={`
                  chart-bar-grow w-full rounded-t-lg transition-colors
                  ${isHighlight ? "bg-primary-500" : "bg-primary-300 group-hover:bg-primary-400"}
                `}
                style={{
                  height: `${height}px`,
                  animationDelay: `${index * 80}ms`,
                }}
              />
            </div>

            <span
              className={`text-[11px] font-medium ${
                isHighlight ? "text-primary-700" : "text-foreground-500"
              }`}
            >
              {item.label}
            </span>
          </div>
        );
      })}
      </div>
    </div>
  );
}
