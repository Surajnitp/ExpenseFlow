import React from 'react'
import { MetricCards } from '../components/MetricCards'
import { CashFlowChart } from '../components/CashFlowChart'
import { CategoryBreakdown } from '../components/CategoryBreakdown'
import { TransactionList } from '../components/TransactionList'

export const DashboardView = ({
  transactions,
  totalMonthlyBudget,
  currency,
  onEditTransaction,
  onDeleteTransaction,
  onAddNewTransaction,
  onNavigateToTransactions
}) => {
  return (
    <div className="page-view dashboard-view">
      {/* KPI Summary Cards */}
      <section className="dashboard-section">
        <MetricCards
          transactions={transactions}
          totalMonthlyBudget={totalMonthlyBudget}
          currency={currency}
        />
      </section>

      {/* Visual Analytics Row: Cash Flow & Category Breakdown */}
      <section className="dashboard-charts-grid">
        <CashFlowChart transactions={transactions} currency={currency} />
        <CategoryBreakdown transactions={transactions} currency={currency} />
      </section>

      {/* Recent Transactions with quick navigation */}
      <section className="dashboard-recent-section">
        <div className="section-header-compact">
          <TransactionList
            transactions={transactions}
            currency={currency}
            onEdit={onEditTransaction}
            onDelete={onDeleteTransaction}
            onAddNew={onAddNewTransaction}
            isCompact={true}
            maxCompactItems={5}
          />
        </div>
      </section>
    </div>
  )
}
