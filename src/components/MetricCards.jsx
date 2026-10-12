import React from 'react'
import { Icon } from './Icons'
import {
  calculateTotalIncome,
  calculateTotalExpenses,
  calculateNetBalance,
  calculateRemainingBudget,
  formatCurrency
} from '../utils/financialCalculations'

export const MetricCards = ({ transactions, totalMonthlyBudget, currency }) => {
  const totalIncome = calculateTotalIncome(transactions)
  const totalExpense = calculateTotalExpenses(transactions)
  const netBalance = calculateNetBalance(transactions)
  const remainingBudget = calculateRemainingBudget(totalMonthlyBudget, transactions)

  const budgetUsedPct = totalMonthlyBudget > 0
    ? Math.round((totalExpense / totalMonthlyBudget) * 100)
    : 0

  const incomeTxCount = transactions.filter((t) => t.type === 'income').length
  const expenseTxCount = transactions.filter((t) => t.type === 'expense').length

  return (
    <div className="metric-cards-grid">
      {/* 1. Total Balance */}
      <div className="metric-card balance-card">
        <div className="metric-card-top">
          <div className="metric-info">
            <span className="metric-label">Total Balance</span>
            <h2 className="metric-value">{formatCurrency(netBalance, currency)}</h2>
          </div>
          <div className="metric-icon-box balance">
            <Icon name="wallet" size={24} color="#6366f1" />
          </div>
        </div>
        <div className="metric-card-bottom">
          <span className={`metric-pill ${netBalance >= 0 ? 'positive' : 'negative'}`}>
            <Icon name={netBalance >= 0 ? 'arrow-up-right' : 'arrow-down-left'} size={14} />
            {netBalance >= 0 ? 'Net Positive' : 'Deficit'}
          </span>
          <span className="metric-subtext">Income minus expenses</span>
        </div>
      </div>

      {/* 2. Total Income */}
      <div className="metric-card income-card">
        <div className="metric-card-top">
          <div className="metric-info">
            <span className="metric-label">Total Income</span>
            <h2 className="metric-value positive-text">
              {formatCurrency(totalIncome, currency)}
            </h2>
          </div>
          <div className="metric-icon-box income">
            <Icon name="arrow-up-right" size={24} color="#10b981" />
          </div>
        </div>
        <div className="metric-card-bottom">
          <span className="metric-pill positive">
            <Icon name="trending-up" size={14} />
            {incomeTxCount} Inflows
          </span>
          <span className="metric-subtext">All revenue sources</span>
        </div>
      </div>

      {/* 3. Total Expenses */}
      <div className="metric-card expense-card">
        <div className="metric-card-top">
          <div className="metric-info">
            <span className="metric-label">Total Expenses</span>
            <h2 className="metric-value negative-text">
              {formatCurrency(totalExpense, currency)}
            </h2>
          </div>
          <div className="metric-icon-box expense">
            <Icon name="arrow-down-left" size={24} color="#f43f5e" />
          </div>
        </div>
        <div className="metric-card-bottom">
          <span className="metric-pill negative">
            <Icon name="receipt" size={14} />
            {expenseTxCount} Outflows
          </span>
          <span className="metric-subtext">Current period spending</span>
        </div>
      </div>

      {/* 4. Remaining Budget */}
      <div className="metric-card budget-card">
        <div className="metric-card-top">
          <div className="metric-info">
            <span className="metric-label">Remaining Budget</span>
            <h2 className={`metric-value ${remainingBudget < 0 ? 'negative-text' : ''}`}>
              {formatCurrency(remainingBudget, currency)}
            </h2>
          </div>
          <div className="metric-icon-box budget">
            <Icon name="target" size={24} color="#06b6d4" />
          </div>
        </div>
        <div className="metric-card-bottom">
          <div className="budget-bar-inline">
            <div className="budget-bar-track">
              <div
                className={`budget-bar-fill ${
                  budgetUsedPct >= 100 ? 'danger' : budgetUsedPct > 80 ? 'warning' : 'safe'
                }`}
                style={{ width: `${Math.min(100, budgetUsedPct)}%` }}
              />
            </div>
            <span className="budget-bar-caption">
              {budgetUsedPct}% of {formatCurrency(totalMonthlyBudget, currency)} limit
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
