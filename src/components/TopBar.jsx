import { Bell, MoonStar, SunMedium } from 'lucide-react'
import RoleSwitcher from './RoleSwitcher'

function TopBar({ role, onRoleChange, theme, onThemeToggle }) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4 max-[720px]:flex-col max-[720px]:items-stretch">
      <div className="max-[720px]:order-last">
        <p className="m-0 text-xs uppercase tracking-[0.09em] text-(--color-text-soft)">Financial Overview</p>
        <h2 className="mt-1 text-[clamp(1.45rem,2.2vw,1.95rem)]">
          {role === 'admin' ? 'Dashboard Admin View' : 'Dashboard Viewer View'}
        </h2>
      </div>

      <div className="flex flex-wrap items-center gap-2 max-[720px]:w-full max-[720px]:order-first">
        <RoleSwitcher role={role} onChange={onRoleChange} />
        <button
          type="button"
          className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-(--color-border) bg-(--color-surface-raised) text-(--color-text-main) transition hover:-translate-y-0.5 hover:border-[rgb(31_111_102/35%)]"
          onClick={onThemeToggle}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <SunMedium size={16} /> : <MoonStar size={16} />}
        </button>
        <button
          type="button"
          className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-(--color-border) bg-(--color-surface-raised) text-(--color-text-main) transition hover:-translate-y-0.5 hover:border-[rgb(31_111_102/35%)]"
          aria-label="Notifications"
        >
          <Bell size={16} />
        </button>
      </div>
    </header>
  )
}

export default TopBar
