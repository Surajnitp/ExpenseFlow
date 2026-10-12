import React from 'react'
import { Icon } from '../components/Icons'
import { PAYMENT_METHODS } from '../data/initialData'
import {
  calculateTotalIncome,
  calculateTotalExpenses,
  calculateNetBalance,
  calculateSavingsRate,
  calculateCategorySpending,
  formatCurrency
} from '../utils/financialCalculations'

export const AnalyticsView = ({ transactions, currency = '$' }) => {
  const totalIncome = calculateTotalIncome(transactions)
  const totalExpense = calculateTotalExpenses(transactions)
  const netBalance = calculateNetBalance(transactions)
  const savingsRate = calculateSavingsRate(transactions)
  const categoryBreakdown = calculateCategorySpending(transactions)

  const expenseTxList = transactions.filter((tx) => tx.type === 'expense')
  const incomeTxList = transactions.filter((tx) => tx.type === 'income')

  // Top spending category
  const topCategory = categoryBreakdown.length > 0 ? categoryBreakdown[0] : null

  // Average expense amount
  const avgExpense = expenseTxList.length > 0
    ? (totalExpense / expenseTxList.length).toFixed(2)
    : 0

  // Payment method breakdown using filter and reduce
  const paymentBreakdown = PAYMENT_METHODS.map((pm) => {
    const list = expenseTxList.filter((tx) => tx.paymentMethod === pm)
    const total = list.reduce((sum, tx) => sum + Number(tx.amount || 0), 0)
    const pct = totalExpense > 0 ? Math.round((total / totalExpense) * 100) : 0
    return { name: pm, total, count: list.length, pct }
  }).filter((pm) => pm.total > 0).sort((a, b) => b.total - a.total)

  return (
    <div className="page-view analytics-view">
      {/* KPI Insight Strip */}
      <div className="analytics-insight-grid">
        <div className="card insight-card">
          <div className="insight-icon top-cat">
            <span>{topCategory ? topCategory.icon : '🏷️'}</span>
          </div>
          <div className="insight-body">
            <span className="insight-label">Top Expense Category</span>
            <h3 className="insight-value">
              {topCategory ? topCategory.categoryName : 'None'}
            </h3>
            <span className="insight-sub">
              {topCategory ? `${formatCurrency(topCategory.totalSpent, currency)} (${topCategory.percentage}%)` : 'No expenses recorded'}
            </span>
          </div>
        </div>

        <div className="card insight-card">
          <div className="insight-icon avg-exp">
            <Icon name="receipt" size={24} color="#f59e0b" />
          </div>
          <div className="insight-body">
            <span className="insight-label">Average Expense</span>
            <h3 className="insight-value">
              {formatCurrency(avgExpense, currency)}
            </h3>
            <span className="insight-sub">Across {expenseTxList.length} transactions</span>
          </div>
        </div>

        <div className="card insight-card">
          <div className="insight-icon savings-rate">
            <Icon name="trending-up" size={24} color="#10b981" />
          </div>
          <div className="insight-body">
            <span className="insight-label">Savings Rate</span>
            <h3 className="insight-value">{savingsRate}%</h3>
            <span className="insight-sub">
              {formatCurrency(netBalance, currency)} net surplus
            </span>
          </div>
        </div>

        <div className="card insight-card">
          <div className="insight-icon cashflow">
            <Icon name="wallet" size={24} color="#6366f1" />
          </div>
          <div className="insight-body">
            <span className="insight-label">Inflow vs Outflow</span>
            <h3 className="insight-value">
              {incomeTxList.length} In / {expenseTxList.length} Out
            </h3>
            <span className="insight-sub">
              {totalIncome > 0 ? `${Math.round((totalExpense / totalIncome) * 100)}% burn rate` : 'N/A'}
            </span>
          </div>
        </div>
      </div>

      {/* Analytics Main Columns */}
      <div className="analytics-layout-grid">
        {/* Category Breakdown Deep-Dive */}
        <div className="card analytics-table-card">
          <div className="card-header flex-between">
            <div>
              <h3 className="card-title">Category Spending Analysis</h3>
              <p className="card-subtitle">Detailed itemization & volume per category</p>
            </div>
          </div>

          <div className="table-responsive">
            <table className="analytics-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Share of Total</th>
                  <th>Transactions</th>
                  <th>Average Spend</th>
                  <th className="text-right">Total Spent</th>
                </tr>
              </thead>
              <tbody>
                {categoryBreakdown.map((item) => (
                  <tr key={item.categoryId}>
                    <td>
                      <div className="table-category-cell">
                        <span className="table-emoji" style={{ backgroundColor: `${item.color}25` }}>
                          {item.icon}
                        </span>
                        <span className="table-cat-name">{item.categoryName}</span>
                      </div>
                    </td>
                    <td>
                      <div className="table-progress-cell">
                        <div className="table-progress-track">
                          <div
                            className="table-progress-fill"
                            style={{
                              width: `${item.percentage}%`,
                              backgroundColor: item.color
                            }}
                          />
                        </div>
                        <span className="table-pct-text">{item.percentage}%</span>
                      </div>
                    </td>
                    <td>{item.count}</td>
                    <td>{formatCurrency(item.totalSpent / item.count, currency)}</td>
                    <td className="text-right font-semibold">
                      {formatCurrency(item.totalSpent, currency)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Payment Methods Breakdown */}
        <div className="card payment-methods-card">
          <div className="card-header">
            <h3 className="card-title">Spending by Payment Channel</h3>
            <p className="card-subtitle">Where your outflows are routed</p>
          </div>

          <div className="payment-methods-list">
            {paymentBreakdown.map((pm) => (
              <div key={pm.name} className="payment-method-row">
                <div className="payment-method-header flex-between">
                  <span className="pm-name">{pm.name}</span>
                  <span className="pm-amount">
                    {formatCurrency(pm.total, currency)}{' '}
                    <span className="pm-pct">({pm.pct}%)</span>
                  </span>
                </div>
                <div className="pm-progress-track">
                  <div
                    className="pm-progress-bar"
                    style={{ width: `${pm.pct}%` }}
                  />
                </div>
                <div className="pm-sub">
                  <span>{pm.count} {pm.count === 1 ? 'transaction' : 'transactions'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
