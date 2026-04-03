import { Download, Plus, RotateCcw, ShieldCheck } from 'lucide-react'
import TransactionTable from '../components/TransactionTable'

const typeOptions = [
  { label: 'All types', value: 'all' },
  { label: 'Income', value: 'credit' },
  { label: 'Expense', value: 'debit' },
]

const sortOptions = [
  { label: 'Newest first', value: 'newest' },
  { label: 'Oldest first', value: 'oldest' },
  { label: 'Amount high to low', value: 'amount-desc' },
  { label: 'Amount low to high', value: 'amount-asc' },
]

function TransactionsSection({
  role,
  transactions,
  totalTransactions,
  search,
  typeFilter,
  categoryFilter,
  dateFilter,
  sortBy,
  onSearchChange,
  onTypeFilterChange,
  onCategoryFilterChange,
  onDateFilterChange,
  onSortByChange,
  onResetFilters,
  onExportCsv,
  categoryOptions,
  dateOptions,
  draftTransaction,
  onDraftChange,
  onSubmitTransaction,
  onCancelEdit,
  editingTransactionId,
  onStartAdd,
  onStartEdit,
  onDeleteTransaction,
  id = 'transactions',
}) {
  const isAdmin = role === 'admin'
  const hasTransactions = transactions.length > 0

  const inputBaseClass =
    'rounded-xl border border-(--color-border) bg-(--color-surface-raised) px-3 py-2 text-sm text-(--color-text-main) outline-none focus:border-[rgb(31_111_102/45%)] focus:shadow-[0_0_0_3px_rgb(31_111_102/12%)]'

  return (
    <section className="grid gap-4 rounded-2xl border border-(--color-border) bg-(--color-surface-raised) p-4 scroll-mt-4" id={id}>
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="m-0 text-base">Transactions</h3>
          <p className="m-0 text-sm text-(--color-text-soft)">
            {hasTransactions
              ? `${transactions.length} visible of ${totalTransactions} total transactions`
              : 'No transactions match the current filters'}
          </p>
        </div>

        <div className="ml-auto flex flex-wrap items-center gap-3 max-[720px]:w-full">
          <span className="inline-flex items-center gap-1 rounded-full bg-(--color-primary-soft) px-3 py-1 text-xs font-semibold text-(--color-primary)">
            <ShieldCheck size={14} />
            {isAdmin ? 'Admin access' : 'Viewer access'}
          </span>
          <button type="button" className="inline-flex items-center gap-1 text-sm font-semibold text-(--color-primary)" onClick={onResetFilters}>
            <RotateCcw size={14} />
            Reset filters
          </button>
        </div>
      </header>

      <div className="flex flex-col gap-3 max-[720px]:gap-3">
        <div className="flex flex-wrap items-end gap-3 max-[720px]:flex-col max-[720px]:items-stretch">
          <label className="grid gap-1 text-sm text-(--color-text-soft) min-w-[200px] max-[720px]:min-w-full" htmlFor="transactions-search">
            <span className="font-semibold">Search</span>
            <input
              id="transactions-search"
              type="search"
              placeholder="Merchant, category, or date"
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
              className={inputBaseClass}
            />
          </label>

          <label className="grid gap-1 text-sm text-(--color-text-soft) min-w-[160px] max-[720px]:min-w-full" htmlFor="type-filter">
            <span className="font-semibold">Type</span>
            <select id="type-filter" value={typeFilter} onChange={(event) => onTypeFilterChange(event.target.value)} className={inputBaseClass}>
              {typeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-1 text-sm text-(--color-text-soft) min-w-[160px] max-[720px]:min-w-full" htmlFor="sort-by">
            <span className="font-semibold">Sort</span>
            <select id="sort-by" value={sortBy} onChange={(event) => onSortByChange(event.target.value)} className={inputBaseClass}>
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-(--color-border) bg-(--color-surface-raised) px-4 py-3 text-sm font-semibold text-(--color-text-main) transition hover:-translate-y-0.5 max-[720px]:w-full"
            onClick={onExportCsv}
          >
            <Download size={16} />
            <span className="max-[720px]:hidden">Export CSV</span>
          </button>

          {isAdmin ? (
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[linear-gradient(135deg,var(--color-primary),var(--color-chart-segment-2))] px-4 py-3 text-sm font-semibold text-(--color-surface-raised) shadow-[0_12px_24px_rgb(31_111_102/18%)] transition hover:-translate-y-0.5 max-[720px]:w-full"
              onClick={onStartAdd}
            >
              <Plus size={16} />
              <span className="max-[720px]:hidden">Add transaction</span>
            </button>
          ) : (
            <div className="rounded-xl border border-dashed border-(--color-border) bg-(--color-surface-raised) px-4 py-3 text-sm text-(--color-text-soft) max-[720px]:w-full">
              Viewer mode: transactions are read only
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-4 grid-cols-2 max-[720px]:grid-cols-1">
        <div className="grid gap-2 rounded-2xl border border-(--color-border) bg-(--color-surface) p-3">
          <span className="text-xs font-bold uppercase tracking-[0.08em] text-(--color-text-soft)">Category</span>
          <div className="flex flex-wrap gap-2" role="list" aria-label="Category filters">
            {categoryOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                className={`rounded-full border px-3 py-1.5 text-xs transition ${
                  categoryFilter === option.value
                    ? 'border-(--color-primary) bg-(--color-primary) text-(--color-surface-raised)'
                    : 'border-(--color-border) bg-(--color-surface-raised) text-(--color-text-soft) hover:-translate-y-0.5 hover:border-[rgb(31_111_102/28%)]'
                }`}
                onClick={() => onCategoryFilterChange(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-2 rounded-2xl border border-(--color-border) bg-(--color-surface) p-3">
          <span className="text-xs font-bold uppercase tracking-[0.08em] text-(--color-text-soft)">Date</span>
          <div className="flex flex-wrap gap-2" role="list" aria-label="Date filters">
            {dateOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                className={`rounded-full border px-3 py-1.5 text-xs transition ${
                  dateFilter === option.value
                    ? 'border-(--color-primary) bg-(--color-primary) text-(--color-surface-raised)'
                    : 'border-(--color-border) bg-(--color-surface-raised) text-(--color-text-soft) hover:-translate-y-0.5 hover:border-[rgb(31_111_102/28%)]'
                }`}
                onClick={() => onDateFilterChange(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {isAdmin && !editingTransactionId ? (
        <form className="grid gap-4 rounded-2xl border border-(--color-border) bg-(--color-surface) p-4" onSubmit={onSubmitTransaction}>
          <div className="grid gap-3 grid-cols-3 max-[1120px]:grid-cols-2 max-[720px]:grid-cols-1">
            <label className="grid gap-1 text-sm text-(--color-text-soft)">
              <span className="font-semibold">Merchant</span>
              <input
                type="text"
                value={draftTransaction.merchant}
                onChange={(event) => onDraftChange('merchant', event.target.value)}
                placeholder="Merchant name"
                required
                className={inputBaseClass}
              />
            </label>
            <label className="grid gap-1 text-sm text-(--color-text-soft)">
              <span className="font-semibold">Category</span>
              <input
                type="text"
                value={draftTransaction.category}
                onChange={(event) => onDraftChange('category', event.target.value)}
                placeholder="Expense or income category"
                required
                className={inputBaseClass}
              />
            </label>
            <label className="grid gap-1 text-sm text-(--color-text-soft)">
              <span className="font-semibold">Amount</span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={draftTransaction.amount}
                onChange={(event) => onDraftChange('amount', event.target.value)}
                placeholder="0.00"
                required
                className={inputBaseClass}
              />
            </label>
            <label className="grid gap-1 text-sm text-(--color-text-soft)">
              <span className="font-semibold">Date</span>
              <input
                type="date"
                value={draftTransaction.date}
                onChange={(event) => onDraftChange('date', event.target.value)}
                required
                className={inputBaseClass}
              />
            </label>
            <label className="grid gap-1 text-sm text-(--color-text-soft)">
              <span className="font-semibold">Type</span>
              <select value={draftTransaction.type} onChange={(event) => onDraftChange('type', event.target.value)} className={inputBaseClass}>
                <option value="debit">Expense</option>
                <option value="credit">Income</option>
              </select>
            </label>
            <label className="grid gap-1 text-sm text-(--color-text-soft)">
              <span className="font-semibold">Status</span>
              <select value={draftTransaction.status} onChange={(event) => onDraftChange('status', event.target.value)} className={inputBaseClass}>
                <option value="Completed">Completed</option>
                <option value="Pending">Pending</option>
              </select>
            </label>
          </div>

          <div className="flex flex-wrap justify-end gap-3 max-[720px]:items-stretch">
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-[linear-gradient(135deg,var(--color-primary),var(--color-chart-segment-2))] px-4 py-3 text-sm font-semibold text-(--color-surface-raised) shadow-[0_12px_24px_rgb(31_111_102/18%)] transition hover:-translate-y-0.5"
            >
              <Plus size={16} />
              {editingTransactionId ? 'Save changes' : 'Create transaction'}
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-xl border border-(--color-border) bg-(--color-surface-raised) px-4 py-3 text-sm font-semibold text-(--color-text-main) transition hover:-translate-y-0.5"
              onClick={onCancelEdit}
            >
              Clear
            </button>
          </div>
        </form>
      ) : null}

      {isAdmin && editingTransactionId ? (
        <p className="m-0 rounded-xl border border-[rgb(31_111_102/20%)] bg-(--color-primary-soft) px-3 py-2 text-sm text-(--color-primary)">
          You are editing a transaction inline. Save or cancel directly in the table row.
        </p>
      ) : null}

      <TransactionTable
        transactions={transactions}
        role={role}
        onEdit={onStartEdit}
        editingTransactionId={editingTransactionId}
        draftTransaction={draftTransaction}
        onDraftChange={onDraftChange}
        onSaveEdit={onSubmitTransaction}
        onCancelEdit={onCancelEdit}
        onDelete={onDeleteTransaction}
        emptyMessage={hasTransactions ? undefined : 'No transactions match your current search or filters.'}
      />
      {!isAdmin ? null : <p className="m-0 pt-1 text-sm text-(--color-text-soft)">Edit buttons appear in the table for admin users.</p>}
    </section>
  )
}

export default TransactionsSection
