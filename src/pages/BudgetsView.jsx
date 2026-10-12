import React, { useState } from 'react'
import { Icon } from '../components/Icons'
import { CATEGORIES } from '../data/initialData'
import {
  calculateTotalExpenses,
  calculateRemainingBudget,
  formatCurrency
} from '../utils/financialCalculations'

export const BudgetsView = ({
  transactions,
  budgetSettings,
  onUpdateBudgetSettings,
  currency = '$'
}) => {
  const [isEditingTotal, setIsEditingTotal] = useState(false)
  const [newTotalBudget, setNewTotalBudget] = useState(
    budgetSettings.totalMonthlyBudget ? String(budgetSettings.totalMonthlyBudget) : '4000'
  )
  const [editingCategory, setEditingCategory] = useState(null)
  const [newCatAmount, setNewCatAmount] = useState('')

  const totalExpense = calculateTotalExpenses(transactions)
  const totalBudget = budgetSettings.totalMonthlyBudget || 4000
  const remainingBudget = calculateRemainingBudget(totalBudget, transactions)
  const overallUsedPct = totalBudget > 0 ? Math.round((totalExpense / totalBudget) * 100) : 0

  const handleSaveTotalBudget = (e) => {
    e.preventDefault()
    const val = parseFloat(newTotalBudget)
    if (!isNaN(val) && val > 0) {
      onUpdateBudgetSettings({
        ...budgetSettings,
        totalMonthlyBudget: val
      })
      setIsEditingTotal(false)
    }
  }

  const handleStartCategoryEdit = (catId, currentLimit) => {
    setEditingCategory(catId)
    setNewCatAmount(String(currentLimit || 0))
  }

  const handleSaveCategoryLimit = (catId) => {
    const val = parseFloat(newCatAmount)
    if (!isNaN(val) && val >= 0) {
      onUpdateBudgetSettings({
        ...budgetSettings,
        categoryBudgets: {
          ...budgetSettings.categoryBudgets,
          [catId]: val
        }
      })
      setEditingCategory(null)
    }
  }

  // Calculate category-specific budget progress using filter and reduce
  const expenseTransactions = transactions.filter((tx) => tx.type === 'expense')

  return (
    <div className="page-view budgets-view">
      {/* Overview Budget Card */}
      <div className="card budget-hero-card">
        <div className="budget-hero-main">
          <div className="budget-hero-left">
            <span className="budget-tag">Active Monthly Target</span>
            <div className="budget-target-display">
              {isEditingTotal ? (
                <form onSubmit={handleSaveTotalBudget} className="budget-edit-form">
                  <span className="currency-prefix">{currency}</span>
                  <input
                    type="number"
                    step="50"
                    min="1"
                    className="form-input budget-num-input"
                    value={newTotalBudget}
                    onChange={(e) => setNewTotalBudget(e.target.value)}
                    autoFocus
                  />
                  <button type="submit" className="btn-primary-sm">
                    Save
                  </button>
                  <button
                    type="button"
                    className="btn-secondary-sm"
                    onClick={() => setIsEditingTotal(false)}
                  >
                    Cancel
                  </button>
                </form>
              ) : (
                <div className="budget-value-row">
                  <h2 className="budget-huge-value">
                    {formatCurrency(totalBudget, currency)}
                  </h2>
                  <button
                    className="action-btn edit"
                    onClick={() => {
                      setNewTotalBudget(String(totalBudget))
                      setIsEditingTotal(true)
                    }}
                    title="Edit Monthly Budget Limit"
                  >
                    <Icon name="edit" size={17} />
                  </button>
                </div>
              )}
            </div>
            <p className="budget-explanation">
              You have spent <strong>{formatCurrency(totalExpense, currency)}</strong> of your target limit.
            </p>
          </div>

          <div className="budget-hero-metrics">
            <div className="hero-metric-box">
              <span className="hero-metric-label">Remaining Budget</span>
              <span className={`hero-metric-val ${remainingBudget < 0 ? 'negative-text' : 'positive-text'}`}>
                {formatCurrency(remainingBudget, currency)}
              </span>
            </div>
            <div className="hero-metric-box">
              <span className="hero-metric-label">Budget Utilized</span>
              <span className="hero-metric-val">{overallUsedPct}%</span>
            </div>
          </div>
        </div>

        {/* Master Progress Bar */}
        <div className="master-budget-progress">
          <div className="budget-bar-track-large">
            <div
              className={`budget-bar-fill-large ${
                overallUsedPct >= 100
                  ? 'danger'
                  : overallUsedPct > 80
                  ? 'warning'
                  : 'safe'
              }`}
              style={{ width: `${Math.min(100, overallUsedPct)}%` }}
            />
          </div>
          <div className="master-progress-labels">
            <span>0%</span>
            <span>50%</span>
            <span>80% (Warning)</span>
            <span>100% Target</span>
          </div>
        </div>
      </div>

      {/* Category Budgets Grid */}
      <div className="card category-budgets-section">
        <div className="card-header flex-between">
          <div>
            <h3 className="card-title">Category Limits & Pacing</h3>
            <p className="card-subtitle">
              Monitor individual spending caps to prevent budget blowouts
            </p>
          </div>
          <span className="badge-pill">
            {CATEGORIES.expense.length} Monitored Categories
          </span>
        </div>

        <div className="category-budget-cards-grid">
          {CATEGORIES.expense.map((category) => {
            const catTransactions = expenseTransactions.filter((tx) => tx.category === category.id)
            const spent = catTransactions.reduce((sum, tx) => sum + Number(tx.amount || 0), 0)
            const limit = budgetSettings.categoryBudgets?.[category.id] || 300
            const pct = limit > 0 ? Math.round((spent / limit) * 100) : 0
            const isOver = spent > limit
            const isNear = pct >= 80 && !isOver

            const isCurrentEditing = editingCategory === category.id

            return (
              <div
                key={category.id}
                className={`category-budget-item-card ${isOver ? 'alert-danger' : isNear ? 'alert-warning' : ''}`}
              >
                <div className="cat-budget-top">
                  <div className="cat-budget-meta">
                    <span
                      className="cat-badge-emoji"
                      style={{ backgroundColor: `${category.color}25` }}
                    >
                      {category.icon}
                    </span>
                    <div>
                      <h4 className="cat-name">{category.label}</h4>
                      <span className="cat-tx-count">
                        {catTransactions.length} {catTransactions.length === 1 ? 'transaction' : 'transactions'}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`cat-status-badge ${
                      isOver ? 'danger' : isNear ? 'warning' : 'safe'
                    }`}
                  >
                    {isOver ? 'Over Budget' : isNear ? 'Near Limit' : 'On Track'}
                  </span>
                </div>

                <div className="cat-budget-amounts">
                  <div className="spent-block">
                    <span className="amount-label">Spent</span>
                    <span className="amount-num">{formatCurrency(spent, currency)}</span>
                  </div>
                  <span className="amount-divider">/</span>
                  <div className="limit-block">
                    <span className="amount-label">Limit</span>
                    {isCurrentEditing ? (
                      <div className="cat-limit-edit-inline">
                        <input
                          type="number"
                          step="10"
                          min="0"
                          className="form-input cat-input-inline"
                          value={newCatAmount}
                          onChange={(e) => setNewCatAmount(e.target.value)}
                          autoFocus
                        />
                        <button
                          type="button"
                          className="action-btn-mini check"
                          onClick={() => handleSaveCategoryLimit(category.id)}
                          title="Save limit"
                        >
                          <Icon name="check" size={14} />
                        </button>
                        <button
                          type="button"
                          className="action-btn-mini cancel"
                          onClick={() => setEditingCategory(null)}
                          title="Cancel"
                        >
                          <Icon name="x" size={14} />
                        </button>
                      </div>
                    ) : (
                      <div
                        className="limit-display"
                        onClick={() => handleStartCategoryEdit(category.id, limit)}
                        title="Click to change category limit"
                      >
                        <span className="amount-num-limit">{formatCurrency(limit, currency)}</span>
                        <Icon name="edit" size={12} className="edit-hint" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="cat-progress-track">
                  <div
                    className={`cat-progress-fill ${isOver ? 'danger' : isNear ? 'warning' : 'safe'}`}
                    style={{
                      width: `${Math.min(100, pct)}%`,
                      backgroundColor: isOver ? '#ef4444' : isNear ? '#f59e0b' : category.color
                    }}
                  />
                </div>

                <div className="cat-budget-footer">
                  <span className="cat-pct-label">{pct}% consumed</span>
                  <span className="cat-rem-label">
                    {limit - spent >= 0
                      ? `${formatCurrency(limit - spent, currency)} left`
                      : `${formatCurrency(spent - limit, currency)} exceeded`}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
