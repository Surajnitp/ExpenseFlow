import React from 'react'
import {
  calculateCategorySpending,
  calculateTotalExpenses,
  formatCurrency
} from '../utils/financialCalculations'

export const CategoryBreakdown = ({ transactions, currency = '$' }) => {
  const breakdown = calculateCategorySpending(transactions)
  const totalExpense = calculateTotalExpenses(transactions)

  if (breakdown.length === 0) {
    return (
      <div className="card category-breakdown-card empty">
        <div className="card-header">
          <h3 className="card-title">Category Spending</h3>
        </div>
        <div className="empty-state-mini">
          <span className="empty-icon">📊</span>
          <p>No expense data recorded yet.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="card category-breakdown-card">
      <div className="card-header flex-between">
        <div>
          <h3 className="card-title">Category Breakdown</h3>
          <p className="card-subtitle">Spending distribution across categories</p>
        </div>
        <span className="badge-pill">
          {breakdown.length} {breakdown.length === 1 ? 'Category' : 'Categories'}
        </span>
      </div>

      {/* Multi-segmented distribution progress bar */}
      <div className="distribution-bar-track">
        {breakdown.map((item) => (
          <div
            key={item.categoryId}
            className="distribution-bar-segment"
            style={{
              width: `${item.percentage}%`,
              backgroundColor: item.color
            }}
            title={`${item.categoryName}: ${item.percentage}% (${formatCurrency(item.totalSpent, currency)})`}
          />
        ))}
      </div>

      <div className="category-items-list">
        {breakdown.map((item) => (
          <div key={item.categoryId} className="category-item-row">
            <div className="category-item-info">
              <span className="category-emoji" style={{ backgroundColor: `${item.color}20` }}>
                {item.icon}
              </span>
              <div className="category-labels">
                <span className="category-name">{item.categoryName}</span>
                <span className="category-meta">{item.count} {item.count === 1 ? 'transaction' : 'transactions'}</span>
              </div>
            </div>

            <div className="category-item-values">
              <div className="category-progress-container">
                <div className="category-progress-track">
                  <div
                    className="category-progress-bar"
                    style={{
                      width: `${item.percentage}%`,
                      backgroundColor: item.color
                    }}
                  />
                </div>
                <span className="category-percentage-text">{item.percentage}%</span>
              </div>
              <span className="category-total-amount">
                {formatCurrency(item.totalSpent, currency)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
