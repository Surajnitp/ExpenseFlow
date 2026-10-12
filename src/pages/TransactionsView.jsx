import React from 'react'
import { TransactionList } from '../components/TransactionList'

export const TransactionsView = ({
  transactions,
  currency,
  onEditTransaction,
  onDeleteTransaction,
  onAddNewTransaction
}) => {
  return (
    <div className="page-view transactions-view">
      <TransactionList
        transactions={transactions}
        currency={currency}
        onEdit={onEditTransaction}
        onDelete={onDeleteTransaction}
        onAddNew={onAddNewTransaction}
        isCompact={false}
      />
    </div>
  )
}
