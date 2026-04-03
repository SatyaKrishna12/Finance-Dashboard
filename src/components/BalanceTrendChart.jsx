import {Area,AreaChart,CartesianGrid,ResponsiveContainer,Tooltip,XAxis,YAxis,} from 'recharts'

const moneyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  notation: 'compact',
  maximumFractionDigits: 1,
})

function BalanceTrendChart({ data }) {
  if (!data.length) {
    return (
      <article className="flex h-full flex-col rounded-2xl border border-(--color-border) bg-(--color-surface-raised) p-4">
        <header className="flex items-baseline justify-between gap-3">
          <h3 className="m-0 text-base">Balance Trend</h3>
          <p className="m-0 text-sm text-(--color-text-soft)">Monthly growth over the last 8 months</p>
        </header>
        <div className="mt-3 grid flex-1 min-h-60 place-items-center rounded-2xl border border-dashed border-(--color-border) bg-(--color-surface) p-4 text-center text-sm text-(--color-text-soft)">
          No balance history is available for the current selection.
        </div>
      </article>
    )
  }

  return (
    <article className="flex h-full flex-col rounded-2xl border border-(--color-border) bg-(--color-surface-raised) p-4">
      <header className="flex items-baseline justify-between gap-3">
        <h3 className="m-0 text-base">Balance Trend</h3>
        <p className="m-0 text-sm text-(--color-text-soft)">Monthly growth over the last 8 months</p>
      </header>
      <div className="mt-3 flex flex-1 items-center">
        <div className="mx-auto h-[290px] w-full">
          <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="balanceFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-chart-balance)" stopOpacity={0.35} />
                <stop offset="95%" stopColor="var(--color-chart-balance)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="var(--color-grid)" vertical={false} />
            <XAxis dataKey="month" stroke="var(--color-text-soft)" tickLine={false} axisLine={false} />
            <YAxis
              stroke="var(--color-text-soft)"
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => moneyFormatter.format(value)}
            />
            <Tooltip
              formatter={(value) => [moneyFormatter.format(value), 'Balance']}
              contentStyle={{
                background: 'var(--color-surface-raised)',
                border: '1px solid var(--color-border)',
                borderRadius: '12px',
                color: 'var(--color-text-main)',
              }}
            />
            <Area
              type="monotone"
              dataKey="balance"
              stroke="var(--color-chart-balance)"
              strokeWidth={3}
              fill="url(#balanceFill)"
            />
          </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </article>
  )
}

export default BalanceTrendChart
