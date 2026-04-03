import { ArrowDownLeft, ArrowUpRight } from 'lucide-react'

const amountFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
})

function TransactionTable({
  transactions,
  role,
  onEdit,
  editingTransactionId,
  draftTransaction,
  onDraftChange,
  onSaveEdit,
  onCancelEdit,
  onDelete,
  emptyMessage = 'No transactions available.',
}) {
  const isAdmin = role === 'admin'
  const inputBaseClass =
    'w-full rounded-lg border border-(--color-border) bg-(--color-surface-raised) px-2 py-1.5 text-sm text-(--color-text-main) outline-none focus:border-[rgb(31_111_102/45%)] focus:shadow-[0_0_0_3px_rgb(31_111_102/12%)]'

  return (
    <article className="rounded-2xl border border-(--color-border) bg-(--color-surface-raised) p-4">
      <header className="flex items-baseline justify-between gap-3">
        <h3 className="m-0 text-base">Recent Transactions</h3>
        <p className="m-0 text-sm text-(--color-text-soft)">Track incoming and outgoing activity</p>
      </header>

      <div className="mt-3 overflow-x-auto max-[720px]:hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border-b border-(--color-border) px-2 py-3 text-left text-sm font-medium text-(--color-text-soft)">Merchant</th>
              <th className="border-b border-(--color-border) px-2 py-3 text-left text-sm font-medium text-(--color-text-soft)">Category</th>
              <th className="border-b border-(--color-border) px-2 py-3 text-left text-sm font-medium text-(--color-text-soft)">Type</th>
              <th className="border-b border-(--color-border) px-2 py-3 text-left text-sm font-medium text-(--color-text-soft)">Date</th>
              <th className="border-b border-(--color-border) px-2 py-3 text-left text-sm font-medium text-(--color-text-soft)">Status</th>
              <th className="border-b border-(--color-border) px-2 py-3 text-right text-sm font-medium text-(--color-text-soft)">Amount</th>
              {isAdmin ? <th className="border-b border-(--color-border) px-2 py-3 text-right text-sm font-medium text-(--color-text-soft)">Actions</th> : null}
            </tr>
          </thead>
          <tbody>
            {transactions.length ? (
              transactions.map((item) => (
                <tr key={item.id}>
                  {isAdmin && editingTransactionId === item.id ? (
                    <>
                      <td className="border-b border-(--color-border) px-2 py-2 text-sm">
                        <input
                          type="text"
                          value={draftTransaction.merchant}
                          onChange={(event) => onDraftChange('merchant', event.target.value)}
                          className={inputBaseClass}
                        />
                      </td>
                      <td className="border-b border-(--color-border) px-2 py-2 text-sm">
                        <input
                          type="text"
                          value={draftTransaction.category}
                          onChange={(event) => onDraftChange('category', event.target.value)}
                          className={inputBaseClass}
                        />
                      </td>
                      <td className="border-b border-(--color-border) px-2 py-2 text-sm">
                        <select
                          value={draftTransaction.type}
                          onChange={(event) => onDraftChange('type', event.target.value)}
                          className={inputBaseClass}
                        >
                          <option value="debit">Expense</option>
                          <option value="credit">Income</option>
                        </select>
                      </td>
                      <td className="border-b border-(--color-border) px-2 py-2 text-sm">
                        <input
                          type="date"
                          value={draftTransaction.date}
                          onChange={(event) => onDraftChange('date', event.target.value)}
                          className={inputBaseClass}
                        />
                      </td>
                      <td className="border-b border-(--color-border) px-2 py-2 text-sm">
                        <select
                          value={draftTransaction.status}
                          onChange={(event) => onDraftChange('status', event.target.value)}
                          className={inputBaseClass}
                        >
                          <option value="Completed">Completed</option>
                          <option value="Pending">Pending</option>
                        </select>
                      </td>
                      <td className="border-b border-(--color-border) px-2 py-2 text-sm">
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={draftTransaction.amount}
                          onChange={(event) => onDraftChange('amount', event.target.value)}
                          className={inputBaseClass}
                        />
                      </td>
                      <td className="border-b border-(--color-border) px-2 py-2 text-right text-sm">
                        <div className="flex items-center justify-end gap-2">
                          <button type="button" className="font-semibold text-(--color-primary)" onClick={() => onSaveEdit()}>
                            Save
                          </button>
                          <button type="button" className="font-semibold text-(--color-text-soft)" onClick={onCancelEdit}>
                            Cancel
                          </button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="border-b border-(--color-border) px-2 py-3 text-sm">
                        <div className="flex items-center gap-2">
                          <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full ${item.type === 'credit' ? 'bg-[color-mix(in_srgb,var(--color-success)_14%,white)] text-(--color-success)' : 'bg-[color-mix(in_srgb,var(--color-danger)_13%,white)] text-(--color-danger)'}`}>
                            {item.type === 'credit' ? <ArrowDownLeft size={14} /> : <ArrowUpRight size={14} />}
                          </span>
                          <span>{item.merchant}</span>
                        </div>
                      </td>
                      <td className="border-b border-(--color-border) px-2 py-3 text-sm">{item.category}</td>
                      <td className="border-b border-(--color-border) px-2 py-3 text-sm">
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${item.type === 'credit' ? 'bg-[color-mix(in_srgb,var(--color-success)_14%,white)] text-(--color-success)' : 'bg-[color-mix(in_srgb,var(--color-danger)_13%,white)] text-(--color-danger)'}`}>
                          {item.type === 'credit' ? 'Income' : 'Expense'}
                        </span>
                      </td>
                      <td className="border-b border-(--color-border) px-2 py-3 text-sm">{item.date}</td>
                      <td className="border-b border-(--color-border) px-2 py-3 text-sm">
                        <span className={`inline-flex rounded-full px-2 py-0.5 text-xs ${item.status.toLowerCase() === 'completed' ? 'bg-[color-mix(in_srgb,var(--color-success)_14%,white)] text-(--color-success)' : 'bg-[color-mix(in_srgb,var(--color-warning)_14%,white)] text-(--color-warning)'}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className={`border-b border-(--color-border) px-2 py-3 text-right text-sm ${item.type === 'credit' ? 'text-(--color-success)' : 'text-(--color-danger)'}`}>
                        {item.type === 'credit' ? '+' : '-'}
                        {amountFormatter.format(item.amount)}
                      </td>
                      {isAdmin ? (
                        <td className="border-b border-(--color-border) px-2 py-3 text-right text-sm">
                          <div className="flex items-center justify-end gap-3">
                            <button type="button" className="text-sm font-semibold text-(--color-primary)" onClick={() => onEdit(item)}>
                              Edit
                            </button>
                            <button
                              type="button"
                              className="text-sm font-semibold text-(--color-danger)"
                              onClick={() => {
                                if (window.confirm('Delete this transaction?')) {
                                  onDelete(item.id)
                                }
                              }}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      ) : null}
                    </>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td className="px-2 py-5 text-center text-sm text-(--color-text-soft)" colSpan={isAdmin ? 7 : 6}>
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-3 grid gap-3 max-[720px]:grid">
        {transactions.length ? (
          transactions.map((item) => (
            <article key={item.id} className="hidden rounded-2xl border border-(--color-border) bg-(--color-surface) p-4 max-[720px]:grid max-[720px]:gap-3">
              {isAdmin && editingTransactionId === item.id ? (
                <div className="grid gap-2">
                  <input
                    type="text"
                    value={draftTransaction.merchant}
                    onChange={(event) => onDraftChange('merchant', event.target.value)}
                    className={inputBaseClass}
                    placeholder="Merchant"
                  />
                  <input
                    type="text"
                    value={draftTransaction.category}
                    onChange={(event) => onDraftChange('category', event.target.value)}
                    className={inputBaseClass}
                    placeholder="Category"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <select value={draftTransaction.type} onChange={(event) => onDraftChange('type', event.target.value)} className={inputBaseClass}>
                      <option value="debit">Expense</option>
                      <option value="credit">Income</option>
                    </select>
                    <select value={draftTransaction.status} onChange={(event) => onDraftChange('status', event.target.value)} className={inputBaseClass}>
                      <option value="Completed">Completed</option>
                      <option value="Pending">Pending</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="date"
                      value={draftTransaction.date}
                      onChange={(event) => onDraftChange('date', event.target.value)}
                      className={inputBaseClass}
                    />
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={draftTransaction.amount}
                      onChange={(event) => onDraftChange('amount', event.target.value)}
                      className={inputBaseClass}
                      placeholder="Amount"
                    />
                  </div>
                  <div className="flex items-center gap-3 pt-1">
                    <button type="button" className="text-sm font-semibold text-(--color-primary)" onClick={() => onSaveEdit()}>
                      Save
                    </button>
                    <button type="button" className="text-sm font-semibold text-(--color-text-soft)" onClick={onCancelEdit}>
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex items-center gap-2">
                      <span
                        className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${item.type === 'credit' ? 'bg-[color-mix(in_srgb,var(--color-success)_14%,white)] text-(--color-success)' : 'bg-[color-mix(in_srgb,var(--color-danger)_13%,white)] text-(--color-danger)'}`}
                      >
                        {item.type === 'credit' ? <ArrowDownLeft size={14} /> : <ArrowUpRight size={14} />}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-(--color-text-main)">{item.merchant}</p>
                        <p className="truncate text-xs text-(--color-text-soft)">{item.category}</p>
                      </div>
                    </div>
                    <div className={`text-right text-sm font-semibold ${item.type === 'credit' ? 'text-(--color-success)' : 'text-(--color-danger)'}`}>
                      {item.type === 'credit' ? '+' : '-'}
                      {amountFormatter.format(item.amount)}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 text-xs text-(--color-text-soft)">
                    <span className="rounded-full bg-(--color-surface-raised) px-2 py-1">{item.date}</span>
                    <span className="rounded-full bg-(--color-surface-raised) px-2 py-1">{item.type === 'credit' ? 'Income' : 'Expense'}</span>
                    <span className="rounded-full bg-(--color-surface-raised) px-2 py-1">{item.status}</span>
                  </div>

                  {isAdmin ? (
                    <div className="flex items-center gap-3">
                      <button type="button" className="inline-flex w-fit items-center text-sm font-semibold text-(--color-primary)" onClick={() => onEdit(item)}>
                        Edit transaction
                      </button>
                      <button
                        type="button"
                        className="inline-flex w-fit items-center text-sm font-semibold text-(--color-danger)"
                        onClick={() => {
                          if (window.confirm('Delete this transaction?')) {
                            onDelete(item.id)
                          }
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  ) : null}
                </>
              )}
            </article>
          ))
        ) : (
          <div className="hidden rounded-2xl border border-(--color-border) bg-(--color-surface) px-4 py-5 text-center text-sm text-(--color-text-soft) max-[720px]:block">
            {emptyMessage}
          </div>
        )}
      </div>
    </article>
  )
}

export default TransactionTable
