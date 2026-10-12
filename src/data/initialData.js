export const CATEGORIES = {
  expense: [
    { id: 'housing', label: 'Housing & Rent', color: '#6366f1', icon: '🏠' },
    { id: 'groceries', label: 'Groceries & Food', color: '#10b981', icon: '🛒' },
    { id: 'dining', label: 'Dining Out', color: '#f59e0b', icon: '🍽️' },
    { id: 'transport', label: 'Transportation', color: '#06b6d4', icon: '🚗' },
    { id: 'utilities', label: 'Bills & Utilities', color: '#8b5cf6', icon: '⚡' },
    { id: 'entertainment', label: 'Entertainment', color: '#ec4899', icon: '🎬' },
    { id: 'health', label: 'Health & Fitness', color: '#14b8a6', icon: '💊' },
    { id: 'shopping', label: 'Shopping', color: '#f43f5e', icon: '🛍️' },
    { id: 'travel', label: 'Travel', color: '#3b82f6', icon: '✈️' },
    { id: 'other_expense', label: 'Other Expense', color: '#64748b', icon: '📦' }
  ],
  income: [
    { id: 'salary', label: 'Primary Salary', color: '#10b981', icon: '💼' },
    { id: 'freelance', label: 'Freelance & Contract', color: '#3b82f6', icon: '💻' },
    { id: 'investments', label: 'Investment Dividends', color: '#8b5cf6', icon: '📈' },
    { id: 'bonus', label: 'Bonus & Incentives', color: '#f59e0b', icon: '🎁' },
    { id: 'other_income', label: 'Other Income', color: '#06b6d4', icon: '💵' }
  ]
}

export const PAYMENT_METHODS = [
  'Credit Card',
  'Debit Card',
  'Bank Transfer',
  'Cash',
  'UPI / Digital Wallet'
]

export const INITIAL_BUDGET = {
  totalMonthlyBudget: 4200,
  categoryBudgets: {
    housing: 1400,
    groceries: 600,
    dining: 350,
    transport: 300,
    utilities: 250,
    entertainment: 200,
    shopping: 300,
    health: 200,
    travel: 400,
    other_expense: 200
  }
}

export const INITIAL_TRANSACTIONS = [
  {
    id: 'tx-1',
    title: 'Monthly Salary',
    amount: 4500.00,
    type: 'income',
    category: 'salary',
    date: '2026-10-01',
    paymentMethod: 'Bank Transfer',
    notes: 'Primary employment income'
  },
  {
    id: 'tx-2',
    title: 'Apartment Rent',
    amount: 1200.00,
    type: 'expense',
    category: 'housing',
    date: '2026-10-02',
    paymentMethod: 'Bank Transfer',
    notes: 'Monthly apartment lease'
  },
  {
    id: 'tx-3',
    title: 'Grocery Store',
    amount: 145.50,
    type: 'expense',
    category: 'groceries',
    date: '2026-10-05',
    paymentMethod: 'Credit Card',
    notes: 'Weekly groceries and essentials'
  }
]
