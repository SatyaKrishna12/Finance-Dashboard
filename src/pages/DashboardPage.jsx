import { useEffect, useMemo, useState } from 'react'
import Sidebar from '../components/Sidebar'
import TopBar from '../components/TopBar'
import OverviewSection from '../sections/OverviewSection'
import InsightsSection from '../sections/InsightsSection'
import TransactionsSection from '../sections/TransactionsSection'
import {
  balanceTrend as baseBalanceTrend,
  startingBalance,
  transactions as initialTransactions,
} from '../data/mockData'

const currencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 2,
})

const percentFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 1,
})

const createEmptyDraft = () => ({
  merchant: '',
  category: '',
  amount: '',
  type: 'debit',
  date: '2026-04-03',
  status: 'Completed',
})

const formatDateLabel = (value) =>
  new Date(`${value}T12:00:00.000Z`).toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  })

const toMonthKey = (dateValue) => new Date(dateValue).toISOString().slice(0, 7)

const shiftMonthKey = (monthKey, monthOffset) => {
  const [year, month] = monthKey.split('-').map(Number)
  return new Date(Date.UTC(year, month - 1 + monthOffset, 1)).toISOString().slice(0, 7)
}

const getLatestMonthKey = (transactions) => toMonthKey(transactions[0]?.timestamp ?? new Date().toISOString())

const computeMonthTotals = (transactions, monthKey) =>
  transactions.filter((transaction) => toMonthKey(transaction.timestamp) === monthKey)

const formatMonthLabel = (monthKey) => {
  const [year, month] = monthKey.split('-').map(Number)
  return new Date(Date.UTC(year, month - 1, 1)).toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  })
}

const buildCsv = (transactions) => {
  const header = ['Date', 'Merchant', 'Category', 'Type', 'Status', 'Amount']
  const rows = transactions.map((transaction) => [
    transaction.date,
    transaction.merchant,
    transaction.category,
    transaction.type === 'credit' ? 'Income' : 'Expense',
    transaction.status,
    transaction.amount.toFixed(2),
  ])

  return [header, ...rows]
    .map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(','))
    .join('\n')
}

const storageKeys = {
  transactions: 'finance-dashboard-transactions',
  role: 'finance-dashboard-role',
  search: 'finance-dashboard-search',
  typeFilter: 'finance-dashboard-type-filter',
  categoryFilter: 'finance-dashboard-category-filter',
  dateFilter: 'finance-dashboard-date-filter',
  sortBy: 'finance-dashboard-sort-by',
  theme: 'finance-dashboard-theme',
}

const readStoredValue = (key, fallbackValue) => {
  if (typeof window === 'undefined') {
    return fallbackValue
  }

  try {
    const storedValue = window.localStorage.getItem(key)
    return storedValue ? JSON.parse(storedValue) : fallbackValue
  } catch {
    return fallbackValue
  }
}

const computePercentageChange = (current, previous) => {
  if (!previous) {
    return 0
  }

  return ((current - previous) / previous) * 100
}

const buildSummaryCards = (transactions) => {
  const incomeTotal = transactions
    .filter((transaction) => transaction.type === 'credit')
    .reduce((total, transaction) => total + transaction.amount, 0)
  const expenseTotal = transactions
    .filter((transaction) => transaction.type === 'debit')
    .reduce((total, transaction) => total + transaction.amount, 0)
  const currentBalance = startingBalance + incomeTotal - expenseTotal
  const previousBalance = baseBalanceTrend.at(-2)?.balance ?? currentBalance

  const currentMonthKey = getLatestMonthKey(transactions)
  const previousMonthKey = shiftMonthKey(currentMonthKey, -1)
  const currentMonthTransactions = computeMonthTotals(transactions, currentMonthKey)
  const previousMonthTransactions = computeMonthTotals(transactions, previousMonthKey)

  const currentMonthIncome = currentMonthTransactions
    .filter((transaction) => transaction.type === 'credit')
    .reduce((total, transaction) => total + transaction.amount, 0)
  const previousMonthIncome = previousMonthTransactions
    .filter((transaction) => transaction.type === 'credit')
    .reduce((total, transaction) => total + transaction.amount, 0)

  const currentMonthExpenses = currentMonthTransactions
    .filter((transaction) => transaction.type === 'debit')
    .reduce((total, transaction) => total + transaction.amount, 0)
  const previousMonthExpenses = previousMonthTransactions
    .filter((transaction) => transaction.type === 'debit')
    .reduce((total, transaction) => total + transaction.amount, 0)

  return [
    {
      title: 'Total Balance',
      value: currencyFormatter.format(currentBalance),
      change: `${computePercentageChange(currentBalance, previousBalance) >= 0 ? '+' : ''}${percentFormatter.format(
        computePercentageChange(currentBalance, previousBalance),
      )}%`,
      trend: currentBalance >= previousBalance ? 'up' : 'down',
      note: 'updated from current activity',
    },
    {
      title: 'Income',
      value: currencyFormatter.format(incomeTotal),
      change: `${computePercentageChange(currentMonthIncome, previousMonthIncome) >= 0 ? '+' : ''}${percentFormatter.format(
        computePercentageChange(currentMonthIncome, previousMonthIncome),
      )}%`,
      trend: currentMonthIncome >= previousMonthIncome ? 'up' : 'down',
      note: 'month over month',
    },
    {
      title: 'Expenses',
      value: currencyFormatter.format(expenseTotal),
      change: `${computePercentageChange(currentMonthExpenses, previousMonthExpenses) >= 0 ? '+' : ''}${percentFormatter.format(
        computePercentageChange(currentMonthExpenses, previousMonthExpenses),
      )}%`,
      trend: currentMonthExpenses <= previousMonthExpenses ? 'up' : 'down',
      note: 'month over month',
    },
  ]
}

const buildBalanceTrend = (transactions) => {
  const incomeTotal = transactions
    .filter((transaction) => transaction.type === 'credit')
    .reduce((total, transaction) => total + transaction.amount, 0)
  const expenseTotal = transactions
    .filter((transaction) => transaction.type === 'debit')
    .reduce((total, transaction) => total + transaction.amount, 0)
  const currentBalance = startingBalance + incomeTotal - expenseTotal

  return baseBalanceTrend.map((point, index) =>
    index === baseBalanceTrend.length - 1 ? { ...point, balance: currentBalance } : point,
  )
}

const buildSpendingBreakdown = (transactions) => {
  const expenses = transactions.filter((transaction) => transaction.type === 'debit')
  const totalExpenses = expenses.reduce((total, transaction) => total + transaction.amount, 0)

  if (!totalExpenses) {
    return []
  }

  const totalsByCategory = expenses.reduce((accumulator, transaction) => {
    accumulator[transaction.category] = (accumulator[transaction.category] || 0) + transaction.amount
    return accumulator
  }, {})

  return Object.entries(totalsByCategory)
    .map(([category, amount]) => ({
      category,
      value: Math.round((amount / totalExpenses) * 100),
    }))
    .sort((left, right) => right.value - left.value)
    .slice(0, 6)
}

const buildInsights = (transactions) => {
  const expenses = transactions.filter((transaction) => transaction.type === 'debit')
  const income = transactions.filter((transaction) => transaction.type === 'credit')
  const expenseTotal = expenses.reduce((total, transaction) => total + transaction.amount, 0)
  const incomeTotal = income.reduce((total, transaction) => total + transaction.amount, 0)
  const categoryTotals = expenses.reduce((accumulator, transaction) => {
    accumulator[transaction.category] = (accumulator[transaction.category] || 0) + transaction.amount
    return accumulator
  }, {})
  const highestCategory = Object.entries(categoryTotals).sort((left, right) => right[1] - left[1])[0]

  const currentMonthKey = getLatestMonthKey(transactions)
  const previousMonthKey = shiftMonthKey(currentMonthKey, -1)
  const currentMonthExpenses = computeMonthTotals(transactions, currentMonthKey)
    .filter((transaction) => transaction.type === 'debit')
    .reduce((total, transaction) => total + transaction.amount, 0)
  const previousMonthExpenses = computeMonthTotals(transactions, previousMonthKey)
    .filter((transaction) => transaction.type === 'debit')
    .reduce((total, transaction) => total + transaction.amount, 0)
  const delta = currentMonthExpenses - previousMonthExpenses

  return [
    {
      title: 'Highest spending category',
      value: highestCategory ? highestCategory[0] : 'No spend data',
      detail: highestCategory
        ? `${currencyFormatter.format(highestCategory[1])} in recorded expenses`
        : 'Add expense transactions to populate this insight',
    },
    {
      title: 'Monthly comparison',
      value:
        delta >= 0
          ? `${currencyFormatter.format(delta)} more than March`
          : `${currencyFormatter.format(Math.abs(delta))} less than March`,
      detail: `April expenses ${delta >= 0 ? 'increased' : 'decreased'} compared with the previous month`,
    },
    {
      title: 'Cash flow',
      value: incomeTotal > expenseTotal ? 'Positive' : 'Negative',
      detail: `${currencyFormatter.format(Math.abs(incomeTotal - expenseTotal))} net ${incomeTotal > expenseTotal ? 'surplus' : 'outflow'}`,
    },
  ]
}

function DashboardPage() {
  const [transactions, setTransactions] = useState(() => readStoredValue(storageKeys.transactions, initialTransactions))
  const [role, setRole] = useState(() => readStoredValue(storageKeys.role, 'viewer'))
  const [search, setSearch] = useState(() => readStoredValue(storageKeys.search, ''))
  const [typeFilter, setTypeFilter] = useState(() => readStoredValue(storageKeys.typeFilter, 'all'))
  const [categoryFilter, setCategoryFilter] = useState(() => readStoredValue(storageKeys.categoryFilter, 'all'))
  const [dateFilter, setDateFilter] = useState(() => readStoredValue(storageKeys.dateFilter, 'all'))
  const [sortBy, setSortBy] = useState(() => readStoredValue(storageKeys.sortBy, 'newest'))
  const [theme, setTheme] = useState(() => readStoredValue(storageKeys.theme, 'light'))
  const [editingTransactionId, setEditingTransactionId] = useState(null)
  const [draftTransaction, setDraftTransaction] = useState(createEmptyDraft())

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    window.localStorage.setItem(storageKeys.theme, JSON.stringify(theme))
  }, [theme])

  useEffect(() => {
    window.localStorage.setItem(storageKeys.transactions, JSON.stringify(transactions))
  }, [transactions])

  useEffect(() => {
    window.localStorage.setItem(storageKeys.role, JSON.stringify(role))
  }, [role])

  useEffect(() => {
    window.localStorage.setItem(storageKeys.search, JSON.stringify(search))
  }, [search])

  useEffect(() => {
    window.localStorage.setItem(storageKeys.typeFilter, JSON.stringify(typeFilter))
  }, [typeFilter])

  useEffect(() => {
    window.localStorage.setItem(storageKeys.categoryFilter, JSON.stringify(categoryFilter))
  }, [categoryFilter])

  useEffect(() => {
    window.localStorage.setItem(storageKeys.dateFilter, JSON.stringify(dateFilter))
  }, [dateFilter])

  useEffect(() => {
    window.localStorage.setItem(storageKeys.sortBy, JSON.stringify(sortBy))
  }, [sortBy])

  const summaryCards = useMemo(() => buildSummaryCards(transactions), [transactions])
  const balanceTrend = useMemo(() => buildBalanceTrend(transactions), [transactions])
  const spendingBreakdown = useMemo(() => buildSpendingBreakdown(transactions), [transactions])
  const insights = useMemo(() => buildInsights(transactions), [transactions])

  const visibleTransactions = useMemo(() => {
    const query = search.trim().toLowerCase()
    const latestMonthKey = getLatestMonthKey(transactions)
    const previousMonthKey = shiftMonthKey(latestMonthKey, -1)

    return [...transactions]
      .filter((transaction) => {
        const matchesSearch =
          !query ||
          transaction.merchant.toLowerCase().includes(query) ||
          transaction.category.toLowerCase().includes(query) ||
          transaction.date.toLowerCase().includes(query) ||
          transaction.type.toLowerCase().includes(query)

        const matchesType = typeFilter === 'all' || transaction.type === typeFilter
        const matchesCategory = categoryFilter === 'all' || transaction.category === categoryFilter

        const transactionMonth = toMonthKey(transaction.timestamp)
        const matchesDate =
          dateFilter === 'all' ||
          (dateFilter === 'current' && transactionMonth === latestMonthKey) ||
          (dateFilter === 'previous' && transactionMonth === previousMonthKey) ||
          transactionMonth === dateFilter

        return matchesSearch && matchesType && matchesCategory && matchesDate
      })
      .sort((left, right) => {
        if (sortBy === 'newest') {
          return new Date(right.timestamp) - new Date(left.timestamp)
        }

        if (sortBy === 'oldest') {
          return new Date(left.timestamp) - new Date(right.timestamp)
        }

        if (sortBy === 'amount-desc') {
          return right.amount - left.amount
        }

        return left.amount - right.amount
      })
  }, [categoryFilter, dateFilter, search, sortBy, transactions, typeFilter])

  const categoryOptions = useMemo(() => {
    const categories = Array.from(new Set(transactions.map((transaction) => transaction.category))).sort()

    return [{ label: 'All categories', value: 'all' }, ...categories.map((category) => ({ label: category, value: category }))]
  }, [transactions])

  const dateOptions = useMemo(() => {
    const monthKeys = Array.from(new Set(transactions.map((transaction) => toMonthKey(transaction.timestamp)))).sort(
      (left, right) => right.localeCompare(left),
    )

    const chips = [
      { label: 'All dates', value: 'all' },
      { label: 'Current month', value: 'current' },
      { label: 'Previous month', value: 'previous' },
    ]

    return [...chips, ...monthKeys.map((monthKey) => ({ label: formatMonthLabel(monthKey), value: monthKey }))]
  }, [transactions])

  const handleDraftChange = (field, value) => {
    setDraftTransaction((currentDraft) => ({
      ...currentDraft,
      [field]: value,
    }))
  }

  const resetDraft = () => {
    setEditingTransactionId(null)
    setDraftTransaction(createEmptyDraft())
  }

  const startAddTransaction = () => {
    resetDraft()
  }

  const startEditTransaction = (transaction) => {
    setEditingTransactionId(transaction.id)
    setDraftTransaction({
      merchant: transaction.merchant,
      category: transaction.category,
      amount: transaction.amount.toString(),
      type: transaction.type,
      date: transaction.timestamp.slice(0, 10),
      status: transaction.status,
    })
  }

  const submitTransaction = (event) => {
    event?.preventDefault()

    if (role !== 'admin') {
      return
    }

    const preparedTransaction = {
      merchant: draftTransaction.merchant.trim(),
      category: draftTransaction.category.trim(),
      amount: Number(draftTransaction.amount),
      type: draftTransaction.type,
      date: formatDateLabel(draftTransaction.date),
      timestamp: new Date(`${draftTransaction.date}T12:00:00.000Z`).toISOString(),
      status: draftTransaction.status,
    }

    if (!preparedTransaction.merchant || !preparedTransaction.category || !preparedTransaction.amount) {
      return
    }

    setTransactions((currentTransactions) => {
      if (editingTransactionId) {
        return currentTransactions.map((transaction) =>
          transaction.id === editingTransactionId
            ? { ...transaction, ...preparedTransaction }
            : transaction,
        )
      }

      return [
        {
          id: Date.now(),
          ...preparedTransaction,
        },
        ...currentTransactions,
      ]
    })

    resetDraft()
  }

  const deleteTransaction = (transactionId) => {
    if (role !== 'admin') {
      return
    }

    setTransactions((currentTransactions) =>
      currentTransactions.filter((transaction) => transaction.id !== transactionId),
    )

    if (editingTransactionId === transactionId) {
      resetDraft()
    }
  }

  const clearFilters = () => {
    setSearch('')
    setTypeFilter('all')
    setCategoryFilter('all')
    setDateFilter('all')
    setSortBy('newest')
  }

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark'))
  }

  const exportVisibleTransactions = () => {
    if (!visibleTransactions.length) {
      return
    }

    const csvContent = buildCsv(visibleTransactions)
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const downloadUrl = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = downloadUrl
    anchor.download = `finance-transactions-${new Date().toISOString().slice(0, 10)}.csv`
    document.body.appendChild(anchor)
    anchor.click()
    document.body.removeChild(anchor)
    URL.revokeObjectURL(downloadUrl)
  }

  return (
    <div className="min-h-screen w-full overflow-x-hidden">
      <Sidebar />
      <main className="ml-[260px] grid min-h-screen gap-6 p-7 max-[1120px]:ml-[220px] max-[720px]:ml-0 max-[720px]:p-3 max-[480px]:p-2">
        <TopBar role={role} theme={theme} onRoleChange={setRole} onThemeToggle={toggleTheme} />
        <OverviewSection
          summaryCards={summaryCards}
          balanceTrend={balanceTrend}
          spendingBreakdown={spendingBreakdown}
        />
        <InsightsSection insights={insights} />
        <TransactionsSection
          role={role}
          transactions={visibleTransactions}
          totalTransactions={transactions.length}
          search={search}
          typeFilter={typeFilter}
          categoryFilter={categoryFilter}
          dateFilter={dateFilter}
          sortBy={sortBy}
          onSearchChange={setSearch}
          onTypeFilterChange={setTypeFilter}
          onCategoryFilterChange={setCategoryFilter}
          onDateFilterChange={setDateFilter}
          onSortByChange={setSortBy}
          onResetFilters={clearFilters}
          onExportCsv={exportVisibleTransactions}
          categoryOptions={categoryOptions}
          dateOptions={dateOptions}
          draftTransaction={draftTransaction}
          onDraftChange={handleDraftChange}
          onSubmitTransaction={submitTransaction}
          onCancelEdit={resetDraft}
          editingTransactionId={editingTransactionId}
          onStartAdd={startAddTransaction}
          onStartEdit={startEditTransaction}
          onDeleteTransaction={deleteTransaction}
        />
      </main>
    </div>
  )
}

export default DashboardPage
