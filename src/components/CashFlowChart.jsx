import React from 'react'
import {
  calculateTotalIncome,
  calculateTotalExpenses,
  calculateNetBalance,
  calculateSavingsRate,
  formatCurrency
} from '../utils/financialCalculations'

export const CashFlowChart = ({ transactions, currency = '$' }) => {
  const totalIncome = calculateTotalIncome(transactions)
  const totalExpense = calculateTotalExpenses(transactions)
  const netSavings = calculateNetBalance(transactions)
  const savingsRate = calculateSavingsRate(transactions)

  const maxVal = Math.max(totalIncome, totalExpense, 1)
  const incomeHeightPct = Math.round((totalIncome / maxVal) * 100)
  const expenseHeightPct = Math.round((totalExpense / maxVal) * 100)

  return (
    <div className="card cash-flow-card">
      <div className="card-header flex-between">
        <div>
          <h3 className="card-title">Cash Flow & Savings</h3>
          <p className="card-subtitle">Income vs Outflow efficiency</p>
        </div>
        <div className="savings-badge-pill">
          <span>Savings Rate:</span>
          <strong>{savingsRate}%</strong>
        </div>
      </div>

      <div className="cash-flow-visual">
        <div className="bars-container">
          {/* Income Bar */}
          <div className="flow-bar-group">
            <div className="flow-bar-wrapper">
              <div
                className="flow-bar income-bar"
                style={{ height: `${Math.max(12, incomeHeightPct)}%` }}
              >
                <span className="flow-bar-tooltip">
                  {formatCurrency(totalIncome, currency)}
                </span>
              </div>
            </div>
            <span className="flow-bar-label">Income Inflow</span>
          </div>

          {/* Expense Bar */}
          <div className="flow-bar-group">
            <div className="flow-bar-wrapper">
              <div
                className="flow-bar expense-bar"
                style={{ height: `${Math.max(12, expenseHeightPct)}%` }}
              >
                <span className="flow-bar-tooltip">
                  {formatCurrency(totalExpense, currency)}
                </span>
              </div>
            </div>
            <span className="flow-bar-label">Expenses Outflow</span>
          </div>
        </div>

        <div className="flow-stats-summary">
          <div className="stat-summary-box">
            <span className="stat-label">Net Saved</span>
            <span className={`stat-value ${netSavings >= 0 ? 'positive-text' : 'negative-text'}`}>
              {formatCurrency(netSavings, currency)}
            </span>
          </div>
          <div className="stat-summary-box">
            <span className="stat-label">Expense Ratio</span>
            <span className="stat-value">
              {totalIncome > 0 ? `${Math.round((totalExpense / totalIncome) * 100)}%` : '0%'}
            </span>
          </div>
          <div className="stat-summary-box">
            <span className="stat-label">Financial Status</span>
            <span className="stat-value status-pill">
              {netSavings >= 0 ? '🟢 Surplus' : '🔴 Overspending'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
