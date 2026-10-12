import React from 'react'
import { Icon } from './Icons'
import { formatCurrency } from '../utils/financialCalculations'

export const Sidebar = ({
  activeTab,
  setActiveTab,
  isMobileOpen,
  setIsMobileOpen,
  totalBudget,
  totalExpense
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { id: 'transactions', label: 'Transactions', icon: 'receipt' },
    { id: 'budgets', label: 'Budget Planner', icon: 'target' },
    { id: 'analytics', label: 'Analytics', icon: 'pie-chart' }
  ]

  const budgetUsagePercent = totalBudget > 0 ? Math.min(100, Math.round((totalExpense / totalBudget) * 100)) : 0

  const handleNavClick = (tabId) => {
    setActiveTab(tabId)
    if (isMobileOpen) {
      setIsMobileOpen(false)
    }
  }

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="sidebar-mobile-overlay"
          onClick={() => setIsMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside className={`app-sidebar ${isMobileOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <div className="brand-logo">
            <div className="brand-icon-wrapper">
              <Icon name="wallet" size={22} color="#ffffff" />
            </div>
            <div className="brand-text">
              <span className="brand-name">Expense<span className="gradient-text">Flow</span></span>
              <span className="brand-tagline">Finance Dashboard</span>
            </div>
          </div>
          <button
            className="mobile-close-btn"
            onClick={() => setIsMobileOpen(false)}
            aria-label="Close Navigation"
          >
            <Icon name="x" size={20} />
          </button>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-group-title">MAIN MENU</div>
          <ul className="nav-list">
            {navItems.map((item) => {
              const isActive = activeTab === item.id
              return (
                <li key={item.id}>
                  <button
                    className={`nav-link ${isActive ? 'active' : ''}`}
                    onClick={() => handleNavClick(item.id)}
                  >
                    <span className="nav-icon">
                      <Icon name={item.icon} size={19} />
                    </span>
                    <span className="nav-label">{item.label}</span>
                    {isActive && <span className="active-pill" />}
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="sidebar-footer">
          <div className="budget-snapshot-card">
            <div className="snapshot-top">
              <span className="snapshot-title">Monthly Limit</span>
              <span className="snapshot-value">{budgetUsagePercent}%</span>
            </div>
            <div className="progress-bar-track">
              <div
                className={`progress-bar-fill ${
                  budgetUsagePercent >= 100
                    ? 'danger'
                    : budgetUsagePercent > 80
                    ? 'warning'
                    : 'safe'
                }`}
                style={{ width: `${budgetUsagePercent}%` }}
              />
            </div>
            <div className="snapshot-sub">
              <span>Spent {formatCurrency(totalExpense)}</span>
              <span>of {formatCurrency(totalBudget)}</span>
            </div>
          </div>

          <div className="user-profile-badge">
            <div className="avatar">
              <span>JD</span>
            </div>
            <div className="user-info">
              <span className="user-name">Personal Account</span>
              <span className="user-status">Free Plan • Synced</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
