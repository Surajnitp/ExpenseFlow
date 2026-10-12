import { CATEGORIES } from '../data/initialData'

/**
 * Dynamic financial calculations using Array.prototype.filter() and Array.prototype.reduce()
 * as specified in the ExpenseFlow requirements.
 */

// Calculate Total Income using filter() and reduce()
export const calculateTotalIncome = (transactions) => {
  return transactions
    .filter((tx) => tx.type === 'income')
    .reduce((sum, tx) => sum + Number(tx.amount || 0), 0)
}

// Calculate Total Expenses using filter() and reduce()
export const calculateTotalExpenses = (transactions) => {
  return transactions
    .filter((tx) => tx.type === 'expense')
    .reduce((sum, tx) => sum + Number(tx.amount || 0), 0)
}

// Calculate Net Balance: Total Income - Total Expenses
export const calculateNetBalance = (transactions) => {
  const totalIncome = calculateTotalIncome(transactions)
  const totalExpense = calculateTotalExpenses(transactions)
  return totalIncome - totalExpense
}

// Calculate Remaining Budget: Total Monthly Budget - Total Expenses
export const calculateRemainingBudget = (totalMonthlyBudget, transactions) => {
  const totalExpenses = calculateTotalExpenses(transactions)
  return totalMonthlyBudget - totalExpenses
}

// Calculate Savings Rate Percentage
export const calculateSavingsRate = (transactions) => {
  const totalIncome = calculateTotalIncome(transactions)
  if (totalIncome <= 0) return 0
  const balance = calculateNetBalance(transactions)
  return Math.max(0, Math.round((balance / totalIncome) * 100))
}

// Category-wise spending breakdown using filter() and reduce()
export const calculateCategorySpending = (transactions) => {
  const expenseTransactions = transactions.filter((tx) => tx.type === 'expense')
  const totalExpense = expenseTransactions.reduce((acc, tx) => acc + Number(tx.amount || 0), 0)

  // Map through each known expense category
  const breakdown = CATEGORIES.expense.map((category) => {
    // Filter transactions matching this category
    const categoryTxList = expenseTransactions.filter((tx) => tx.category === category.id)
    // Reduce matching transactions to obtain total category expenditure
    const totalSpent = categoryTxList.reduce((acc, tx) => acc + Number(tx.amount || 0), 0)
    const count = categoryTxList.length
    const percentage = totalExpense > 0 ? ((totalSpent / totalExpense) * 100).toFixed(1) : '0'

    return {
      categoryId: category.id,
      categoryName: category.label,
      color: category.color,
      icon: category.icon,
      totalSpent,
      count,
      percentage: Number(percentage)
    }
  })

  // Filter out categories with zero spend and sort by largest spending first
  return breakdown
    .filter((item) => item.totalSpent > 0)
    .sort((a, b) => b.totalSpent - a.totalSpent)
}

// Format Currency
export const formatCurrency = (amount, currency = '$') => {
  const num = Number(amount) || 0
  const formatted = Math.abs(num).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
  if (num < 0) return `-${currency}${formatted}`
  return `${currency}${formatted}`
}

// Format Date string to readable label
export const formatDate = (dateStr) => {
  if (!dateStr) return ''
  try {
    const [year, month, day] = dateStr.split('-').map(Number)
    const date = new Date(year, month - 1, day)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  } catch {
    return dateStr
  }
}

// Helper to find category metadata
export const getCategoryMeta = (categoryId, type = 'expense') => {
  const list = CATEGORIES[type] || CATEGORIES.expense
  const match = list.find((c) => c.id === categoryId)
  if (match) return match
  
  // Cross search in other type
  const crossMatch = Object.values(CATEGORIES).flat().find((c) => c.id === categoryId)
  if (crossMatch) return crossMatch

  return { id: categoryId, label: categoryId, color: '#94a3b8', icon: '💳' }
}
