import { Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'

const chartSegments = [
  'var(--color-chart-segment-1)',
  'var(--color-chart-segment-2)',
  'var(--color-chart-segment-3)',
  'var(--color-chart-segment-4)',
  'var(--color-chart-segment-5)',
  'var(--color-chart-segment-6)',
]

function SpendingDonut({ data }) {
  if (!data.length) {
    return (
      <article className="rounded-2xl border border-(--color-border) bg-(--color-surface-raised) p-4">
        <header className="flex items-baseline justify-between gap-3">
          <h3 className="m-0 text-base">Spending Breakdown</h3>
          <p className="m-0 text-sm text-(--color-text-soft)">Category distribution this month</p>
        </header>
        <div className="mt-3 grid min-h-60 place-items-center rounded-2xl border border-dashed border-(--color-border) bg-(--color-surface) p-4 text-center text-sm text-(--color-text-soft)">
          No expense data is available for the current selection.
        </div>
      </article>
    )
  }

  const chartData = data.map((item, index) => ({
    ...item,
    fill: chartSegments[index % chartSegments.length],
  }))

  return (
    <article className="rounded-2xl border border-(--color-border) bg-(--color-surface-raised) p-4">
      <header className="flex items-baseline justify-between gap-3">
        <h3 className="m-0 text-base">Spending Breakdown</h3>
        <p className="m-0 text-sm text-(--color-text-soft)">Category distribution this month</p>
      </header>

      <div className="mt-2 grid gap-3">
        <div className="mt-1">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Tooltip
                formatter={(value, name) => [`${value}%`, name]}
                contentStyle={{
                  background: 'var(--color-surface-raised)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '12px',
                  color: 'var(--color-text-main)',
                }}
              />
              <Pie
                data={chartData}
                innerRadius={70}
                outerRadius={98}
                paddingAngle={2}
                dataKey="value"
                nameKey="category"
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <ul className="grid list-none gap-2 p-0">
          {chartData.map((item) => (
            <li key={item.category} className="grid grid-cols-[0.7rem_1fr_auto] items-center gap-2 text-sm">
              <span
                className="h-3 w-3 rounded-full"
                style={{ background: item.fill }}
              />
              <span>{item.category}</span>
              <strong>{item.value}%</strong>
            </li>
          ))}
        </ul>
      </div>
    </article>
  )
}

export default SpendingDonut
