function RoleSwitcher({ role, onChange }) {
  return (
    <label className="grid gap-1 text-sm text-(--color-text-soft)" htmlFor="role-switcher">
      <span className="font-semibold">Role</span>
      <select
        id="role-switcher"
        value={role}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-xl border border-(--color-border) bg-(--color-surface-raised) px-3 py-2 text-sm text-(--color-text-main) outline-none focus:border-[rgb(31_111_102/45%)] focus:shadow-[0_0_0_3px_rgb(31_111_102/12%)]"
      >
        <option value="viewer">Viewer</option>
        <option value="admin">Admin</option>
      </select>
    </label>
  )
}

export default RoleSwitcher
