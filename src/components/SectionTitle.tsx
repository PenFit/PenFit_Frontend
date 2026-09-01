interface SectionTitleProps {
  title: string;
  subtitle?: string;
}

export default function SectionTitle({ title, subtitle }: SectionTitleProps) {
  return (
    <div className="mb-1">
      <h2 className="text-base font-bold text-foreground-950 font-heading">{title}</h2>
      {subtitle && (
        <p className="text-xs text-foreground-500 mt-0.5">{subtitle}</p>
      )}
    </div>
  );
}