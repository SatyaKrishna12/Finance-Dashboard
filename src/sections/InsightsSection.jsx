function InsightsSection({ insights, id = 'insights' }) {
  return (
    <section className="grid gap-4 rounded-2xl border border-(--color-border) bg-(--color-surface-raised) p-4 scroll-mt-4" id={id}>
      <header className="flex items-baseline justify-between gap-3">
        <div>
          <h3 className="m-0 text-base">Insights</h3>
          <p className="m-0 text-sm text-(--color-text-soft)">Quick observations from the current data set</p>
        </div>
      </header>

      <div className="grid gap-4 grid-cols-3 max-[1120px]:grid-cols-2 max-[720px]:grid-cols-1">
        {insights.map((insight) => (
          <article
            key={insight.title}
            className="grid gap-1 rounded-2xl border border-(--color-border) bg-[linear-gradient(180deg,var(--color-surface-raised),var(--color-surface))] p-4"
          >
            <p className="m-0 text-xs uppercase tracking-[0.08em] text-(--color-text-soft)">{insight.title}</p>
            <strong className="text-lg leading-tight">{insight.value}</strong>
            <span className="text-sm text-(--color-text-soft)">{insight.detail}</span>
          </article>
        ))}
      </div>
    </section>
  )
}

export default InsightsSection
