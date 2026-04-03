import { LayoutDashboard, ArrowRightLeft, ChartNoAxesColumn, Sparkles, ExternalLink } from 'lucide-react'

const navItems = [
  { label: 'Overview', icon: LayoutDashboard, target: 'overview', active: true },
  { label: 'Insights', icon: ChartNoAxesColumn, target: 'insights' },
  { label: 'Transactions', icon: ArrowRightLeft, target: 'transactions' },
]

function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-20 flex h-screen w-[260px] flex-col gap-7 overflow-y-auto border-r border-(--color-border) bg-[linear-gradient(180deg,var(--color-surface-raised),var(--color-surface))] px-4 py-6 shadow-[var(--shadow-soft)] max-[1120px]:w-[220px] max-[720px]:static max-[720px]:h-auto max-[720px]:w-full max-[720px]:overflow-visible max-[720px]:border-r-0 max-[720px]:border-b max-[720px]:gap-4 max-[720px]:px-4 max-[720px]:py-3">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[linear-gradient(135deg,var(--color-primary),var(--color-chart-segment-2))] font-bold text-(--color-surface-raised)">
          FD
        </span>
        <div>
          <h1 className="m-0 text-base tracking-[0.01em]">FinanceDesk</h1>
          <p className="mt-1 text-xs text-(--color-text-soft)">Personal Workspace</p>
        </div>
      </div>

      <nav>
        <p className="m-0 text-xs uppercase tracking-[0.08em] text-(--color-text-soft)">Menu</p>
        <ul className="mt-4 grid list-none gap-2 p-0">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <li key={item.label}>
                <a
                  className={`flex w-full items-center gap-2.5 rounded-xl border border-transparent px-3 py-3 text-sm no-underline transition-all duration-200 hover:translate-x-0.5 hover:border-(--color-border) hover:bg-(--color-surface-raised) ${
                    item.active
                      ? 'border-[rgb(31_111_102/25%)] bg-(--color-primary-soft) font-semibold text-(--color-primary)'
                      : 'text-(--color-text-main)'
                  }`}
                  href={`#${item.target}`}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </a>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="flex justify-start max-[720px]:justify-center">
        <div className="animate-[float-badge_3.8s_ease-in-out_infinite] inline-flex items-center gap-2 rounded-full border border-[rgb(31_111_102/24%)] bg-[color-mix(in_srgb,var(--color-primary-soft)_80%,var(--color-surface-raised))] px-3 py-1.5 text-xs font-semibold text-(--color-primary) shadow-[0_8px_18px_rgb(31_111_102/14%)]">
          <Sparkles size={13} />
          Goal progress 62%
        </div>
      </div>

      <a
        href="https://satya-portfolio-ashen.vercel.app/"
        target="_blank"
        rel="noreferrer noopener"
        className="inline-flex items-center justify-center gap-2 rounded-xl border border-(--color-border) bg-(--color-surface-raised) px-3 py-2 text-sm font-semibold text-(--color-primary) no-underline transition-all duration-200 hover:-translate-y-0.5 hover:border-[rgb(31_111_102/28%)]"
      >
        View My Portfolio
        <ExternalLink size={14} />
      </a>

      <div className="mt-auto rounded-2xl border border-(--color-border) bg-(--color-surface-raised) p-4 max-[720px]:hidden">
        <p className="m-0 text-sm text-(--color-text-soft)">Monthly Goal</p>
        <strong className="mt-1 block text-xl">Save ₹3,000</strong>
        <div className="mt-3 h-2 w-full rounded-full bg-(--color-bg)" role="presentation">
          <span className="block h-full w-[62%] rounded-full bg-[linear-gradient(90deg,var(--color-primary),var(--color-chart-segment-3))]" />
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
