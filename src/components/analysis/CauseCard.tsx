export interface CauseCardProps {
  title: string;
  value: string;
  unit: string;
  description: string;
  level?: string;
  className?: string;
}

function CauseCard({
  title,
  value,
  unit,
  description,
  level = '영향 높음',
  className = '',
}: CauseCardProps) {
  return (
    <article className={`flex min-h-[146px] flex-col rounded-[10px] border border-gray-100 bg-card p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)] ${className}`}>
      <span className="text-caption-3 leading-normal text-danger">{level}</span>
      <h3 className="mt-3 text-title-3 leading-none text-text-primary">{title}</h3>
      <p className="mt-5 flex items-end gap-1">
        <strong className="text-[28px] font-bold leading-[24px] text-danger">{value}</strong>
        <span className="text-caption leading-none text-text-secondary">{unit}</span>
      </p>
      <p className="mt-2 text-caption leading-4 text-text-secondary">{description}</p>
    </article>
  );
}

export default CauseCard;
