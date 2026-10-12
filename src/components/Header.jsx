import React from 'react'
import { Icon } from './Icons'

export const Header = ({
  activeTab,
  theme,
  toggleTheme,
  currency,
  setCurrency,
  onOpenAddModal,
  onResetData,
  setIsMobileOpen
}) => {
  const getTabTitles = () => {
    switch (activeTab) {
      case 'dashboard':
        return {
          title: 'Financial Overview',
          subtitle: 'Track your real-time cash flow, balances & budget allocations'
        }
      case 'transactions':
        return {
          title: 'Transaction Management',
          subtitle: 'Search, filter, edit, and organize all your income & expenses'
        }
      case 'budgets':
        return {
          title: 'Budget & Goal Planner',
          subtitle: 'Set monthly limits, monitor category pacing, and avoid overspending'
        }
      case 'analytics':
        return {
          title: 'Spending Insights & Analytics',
          subtitle: 'Deep-dive into spending distributions, savings rates, and patterns'
        }
      default:
        return {
          title: 'ExpenseFlow',
          subtitle: 'Personal Budget & Expense Dashboard'
        }
    }
  }

  const { title, subtitle } = getTabTitles()

  return (
    <header className="app-header">
      <div className="header-left">
        <button
          className="mobile-menu-trigger"
          onClick={() => setIsMobileOpen(true)}
          aria-label="Open menu"
        >
          <Icon name="menu" size={22} />
        </button>
        <div className="header-titles">
          <h1 className="header-title">{title}</h1>
          <p className="header-subtitle">{subtitle}</p>
        </div>
      </div>

      <div className="header-right">
        {/* Currency Selector */}
        <div className="currency-selector">
          <label htmlFor="currency-select" className="sr-only">Currency</label>
          <select
            id="currency-select"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="currency-dropdown"
            title="Change Currency"
          >
            <option value="$">USD ($)</option>
            <option value="€">EUR (€)</option>
            <option value="£">GBP (£)</option>
            <option value="₹">INR (₹)</option>
            <option value="¥">JPY (¥)</option>
            <option value="CA$">CAD ($)</option>
            <option value="A$">AUD ($)</option>
          </select>
        </div>

        {/* Theme Toggle Button */}
        <button
          className="theme-toggle-btn"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          <div className="theme-toggle-icon">
            {theme === 'dark' ? (
              <Icon name="sun" size={18} color="#fbbf24" />
            ) : (
              <Icon name="moon" size={18} color="#6366f1" />
            )}
          </div>
          <span className="theme-toggle-text">{theme === 'dark' ? 'Light' : 'Dark'}</span>
        </button>

        {/* Reset Demo Data Button */}
        <button
          className="icon-action-btn secondary"
          onClick={onResetData}
          title="Restore Demo Transactions"
          aria-label="Reset demo data"
        >
          <Icon name="refresh" size={16} />
          <span className="btn-text-desktop">Demo Data</span>
        </button>

        {/* Add Transaction CTA */}
        <button
          className="btn-primary"
          onClick={onOpenAddModal}
          id="btn-add-transaction"
        >
          <Icon name="plus" size={18} />
          <span>Add Transaction</span>
        </button>
      </div>
    </header>
  )
}
