import { useNavigate } from 'react-router-dom';

interface RecommendProductCardProps {
  product: {
    id: string;
    name: string;
    summary: string;
    highlight: string;
    shortName: string;
    etfCount?: number;
    fundCount?: number;
    feeMin?: number;
    feeMax?: number;
    reason?: string;
  };
  rank: number;
  compact?: boolean;
}

export default function RecommendProductCard({
  product,
  rank,
  compact = false,
}: RecommendProductCardProps) {
  const navigate = useNavigate();

  if (compact) {
    return (
      <div
        onClick={() => navigate('/recommend/detail')}
        className="bg-background-50 border border-background-200 rounded-xl p-5 animate-fade-in cursor-pointer hover:border-primary-200 hover:bg-primary-50/30 transition-colors"
        style={{ animationDelay: `${rank * 0.08}s` }}
      >
        <div className="mb-3 flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="rounded bg-foreground-950 px-2 py-0.5 text-xs font-bold text-background-50">
              {rank}위
            </span>
            <span className="text-xs font-medium text-foreground-500">
              연금저축펀드
            </span>
          </div>
          <i className="ri-arrow-right-line flex h-5 w-5 shrink-0 items-center justify-center text-foreground-400" />
        </div>

        <h3 className="text-lg font-bold leading-snug text-foreground-950">
          {product.name}
        </h3>

        <p className="mt-2 text-sm leading-relaxed text-foreground-600">
          {product.reason || product.summary}
        </p>

        <div className="mt-4 grid grid-cols-3 gap-2">
          <div className="rounded-lg bg-background-100 p-2">
            <p className="mb-0.5 text-[10px] font-medium text-foreground-500">ETF</p>
            <p className="text-xs font-bold text-foreground-950">
              {product.etfCount?.toLocaleString('ko-KR')}종
            </p>
          </div>
          <div className="rounded-lg bg-background-100 p-2">
            <p className="mb-0.5 text-[10px] font-medium text-foreground-500">펀드</p>
            <p className="text-xs font-bold text-foreground-950">
              {product.fundCount?.toLocaleString('ko-KR')}종
            </p>
          </div>
          <div className="rounded-lg bg-background-100 p-2">
            <p className="mb-0.5 text-[10px] font-medium text-foreground-500">수수료</p>
            <p className="text-xs font-bold text-primary-600">
              {product.feeMin}~{product.feeMax}%
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="bg-background-50 border border-background-200 rounded-xl p-4 animate-fade-in"
      style={{ animationDelay: `${rank * 0.08}s` }}
    >
      {/* 뱃지 + 이름 */}
      <div className="flex items-center gap-2 mb-2">
        <span className="bg-foreground-950 text-background-50 text-xs font-bold px-2 py-0.5 rounded">
          {rank}위
        </span>
        <span className="text-xs text-foreground-500">연금저축펀드</span>
      </div>

      <h3 className="text-lg font-bold text-foreground-950">
        {product.name}
      </h3>

      <p className="text-sm text-foreground-600 mt-2 leading-relaxed">
        {product.summary}
      </p>

      <div className="flex items-start gap-1.5 mt-3 bg-accent-50 rounded-lg p-3">
        <i className="ri-lightbulb-line text-accent-500 mt-0.5" />
        <p className="text-sm text-accent-900 leading-relaxed">
          {product.highlight}
        </p>
      </div>

      <button
        type="button"
        onClick={() => navigate('/recommend/detail')}
        className="mt-4 text-sm font-semibold text-primary-600 underline underline-offset-2 cursor-pointer"
      >
        상세보기
      </button>
    </div>
  );
}
