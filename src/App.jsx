import React, { useState, useEffect } from 'react'
import { Sidebar } from './components/Sidebar'
import { Header } from './components/Header'
import { TransactionModal } from './components/TransactionModal'
import { Toast } from './components/Toast'
import { DashboardView } from './pages/DashboardView'
import { TransactionsView } from './pages/TransactionsView'
import { BudgetsView } from './pages/BudgetsView'
import { AnalyticsView } from './pages/AnalyticsView'
import { INITIAL_TRANSACTIONS, INITIAL_BUDGET } from './data/initialData'
import { calculateTotalExpenses } from './utils/financialCalculations'

export default function App() {
  // 1. LocalStorage Initialization - Transactions
  const [transactions, setTransactions] = useState(() => {
    try {
      const saved = localStorage.getItem('expenseflow_transactions_v2')
      if (saved) return JSON.parse(saved)
      
      // Check legacy: if more than 3 transactions exist from the previous mock dataset, refresh to 3 dummy items
      const legacySaved = localStorage.getItem('expenseflow_transactions')
      if (legacySaved) {
        const parsedLegacy = JSON.parse(legacySaved)
        if (Array.isArray(parsedLegacy) && parsedLegacy.length <= 3) {
          return parsedLegacy
        }
      }
      return INITIAL_TRANSACTIONS
    } catch {
      return INITIAL_TRANSACTIONS
    }
  })

  // 2. LocalStorage Initialization - Budget Settings
  const [budgetSettings, setBudgetSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('expenseflow_budget')
      return saved ? JSON.parse(saved) : INITIAL_BUDGET
    } catch {
      return INITIAL_BUDGET
    }
  })

  // 3. LocalStorage Initialization - Theme (Dark mode default for premium dashboard look)
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem('expenseflow_theme')
      return saved || 'dark'
    } catch {
      return 'dark'
    }
  })

  // 4. LocalStorage Initialization - Currency
  const [currency, setCurrency] = useState(() => {
    try {
      const saved = localStorage.getItem('expenseflow_currency')
      return saved || '$'
    } catch {
      return '$'
    }
  })

  // Navigation tab & UI states
  const [activeTab, setActiveTab] = useState('dashboard')
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState(null)
  const [toast, setToast] = useState(null)

  // Persist Transactions
  useEffect(() => {
    try {
      localStorage.setItem('expenseflow_transactions_v2', JSON.stringify(transactions))
      localStorage.setItem('expenseflow_transactions', JSON.stringify(transactions))
    } catch (err) {
      console.error('Failed to save transactions to localStorage', err)
    }
  }, [transactions])

  // Persist Budget
  useEffect(() => {
    try {
      localStorage.setItem('expenseflow_budget', JSON.stringify(budgetSettings))
    } catch (err) {
      console.error('Failed to save budget settings to localStorage', err)
    }
  }, [budgetSettings])

  // Persist & Apply Theme
  useEffect(() => {
    try {
      localStorage.setItem('expenseflow_theme', theme)
      document.documentElement.setAttribute('data-theme', theme)
    } catch (err) {
      console.error('Failed to apply theme', err)
    }
  }, [theme])

  // Persist Currency
  useEffect(() => {
    try {
      localStorage.setItem('expenseflow_currency', currency)
    } catch (err) {
      console.error('Failed to save currency', err)
    }
  }, [currency])

  // Auto-dismiss toast
  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => {
      setToast(null)
    }, 3200)
    return () => clearTimeout(timer)
  }, [toast])

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
  }

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }

  // Transaction Management Handlers
  const handleOpenAddModal = () => {
    setEditingTransaction(null)
    setIsModalOpen(true)
  }

  const handleOpenEditModal = (tx) => {
    setEditingTransaction(tx)
    setIsModalOpen(true)
  }

  const handleSaveTransaction = (txData) => {
    const existingIndex = transactions.findIndex((t) => t.id === txData.id)
    if (existingIndex >= 0) {
      // Edit existing transaction using map
      setTransactions((prev) =>
        prev.map((item) => (item.id === txData.id ? txData : item))
      )
      showToast(`Updated "${txData.title}" successfully!`, 'success')
    } else {
      // Add new transaction to top of list
      setTransactions((prev) => [txData, ...prev])
      showToast(`Added "${txData.title}" to ${txData.type === 'income' ? 'income' : 'expenses'}!`, 'success')
    }
  }

  const handleDeleteTransaction = (txId) => {
    const target = transactions.find((t) => t.id === txId)
    const title = target ? target.title : 'Transaction'
    setTransactions((prev) => prev.filter((t) => t.id !== txId))
    showToast(`Removed "${title}".`, 'info')
  }

  const handleResetData = () => {
    if (window.confirm('Reset all transactions and budget back to demo defaults?')) {
      setTransactions(INITIAL_TRANSACTIONS)
      setBudgetSettings(INITIAL_BUDGET)
      showToast('Restored default demo data & budgets.', 'info')
    }
  }

  const handleUpdateBudgetSettings = (updated) => {
    setBudgetSettings(updated)
    showToast('Budget settings updated successfully!', 'success')
  }

  const totalExpense = calculateTotalExpenses(transactions)
  const totalBudget = budgetSettings.totalMonthlyBudget || 4200

  return (
    <div className="app-layout">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
        totalBudget={totalBudget}
        totalExpense={totalExpense}
      />

      {/* Main Content Area */}
      <div className="app-main-wrapper">
        <Header
          activeTab={activeTab}
          theme={theme}
          toggleTheme={toggleTheme}
          currency={currency}
          setCurrency={setCurrency}
          onOpenAddModal={handleOpenAddModal}
          onResetData={handleResetData}
          setIsMobileOpen={setIsMobileOpen}
        />

        <main className="app-content-viewport">
          {activeTab === 'dashboard' && (
            <DashboardView
              transactions={transactions}
              totalMonthlyBudget={totalBudget}
              currency={currency}
              onEditTransaction={handleOpenEditModal}
              onDeleteTransaction={handleDeleteTransaction}
              onAddNewTransaction={handleOpenAddModal}
              onNavigateToTransactions={() => setActiveTab('transactions')}
            />
          )}

          {activeTab === 'transactions' && (
            <TransactionsView
              transactions={transactions}
              currency={currency}
              onEditTransaction={handleOpenEditModal}
              onDeleteTransaction={handleDeleteTransaction}
              onAddNewTransaction={handleOpenAddModal}
            />
          )}

          {activeTab === 'budgets' && (
            <BudgetsView
              transactions={transactions}
              budgetSettings={budgetSettings}
              onUpdateBudgetSettings={handleUpdateBudgetSettings}
              currency={currency}
            />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsView
              transactions={transactions}
              currency={currency}
            />
          )}
        </main>
      </div>

      {/* Add / Edit Transaction Modal */}
      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTransaction}
        initialData={editingTransaction}
        currency={currency}
      />

      {/* Toast Notifications */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  )
}
