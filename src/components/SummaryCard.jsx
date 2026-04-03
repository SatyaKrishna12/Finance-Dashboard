import { ArrowDownRight, ArrowUpRight } from 'lucide-react'

function SummaryCard({ title, value, change, trend, note, delay = 0 }) {
  const TrendIcon = trend === 'up' ? ArrowUpRight : ArrowDownRight

  return (
    <article
      className="animate-[slide-reveal_420ms_ease_forwards] rounded-2xl border border-(--color-border) bg-(--color-surface-raised) p-4 opacity-0"
      style={{ '--delay': `${delay}s`, animationDelay: `var(--delay)` }}
    >
      <p className="m-0 text-sm text-(--color-text-soft)">{title}</p>
      <p className="my-3 text-3xl font-bold leading-tight">{value}</p>
      <div className="flex items-center gap-2 text-sm text-(--color-text-soft)">
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${
            trend === 'up'
              ? 'bg-[color-mix(in_srgb,var(--color-success)_17%,white)] text-(--color-success)'
              : 'bg-[color-mix(in_srgb,var(--color-primary)_17%,white)] text-(--color-primary)'
          }`}
        >
          <TrendIcon size={14} />
          {change}
        </span>
        <span>{note}</span>
      </div>
    </article>
  )
}

export default SummaryCard
