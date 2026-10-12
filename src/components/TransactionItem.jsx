import React from 'react'
import { Icon } from './Icons'
import { formatCurrency, formatDate, getCategoryMeta } from '../utils/financialCalculations'

export const TransactionItem = ({
  transaction,
  currency = '$',
  onEdit,
  onDelete
}) => {
  const isIncome = transaction.type === 'income'
  const categoryMeta = getCategoryMeta(transaction.category, transaction.type)

  return (
    <div className={`transaction-row ${isIncome ? 'is-income' : 'is-expense'}`}>
      <div className="transaction-left">
        <div
          className="transaction-category-icon"
          style={{ backgroundColor: `${categoryMeta.color}25` }}
        >
          <span>{categoryMeta.icon}</span>
        </div>
        <div className="transaction-details">
          <div className="transaction-title-row">
            <h4 className="transaction-title">{transaction.title}</h4>
            <span
              className="transaction-category-badge"
              style={{
                color: categoryMeta.color,
                backgroundColor: `${categoryMeta.color}18`,
                borderColor: `${categoryMeta.color}35`
              }}
            >
              {categoryMeta.label}
            </span>
          </div>
          <div className="transaction-sub-row">
            <span className="transaction-date">
              <Icon name="calendar" size={12} />
              {formatDate(transaction.date)}
            </span>
            {transaction.paymentMethod && (
              <span className="transaction-method">
                • {transaction.paymentMethod}
              </span>
            )}
            {transaction.notes && (
              <span className="transaction-notes" title={transaction.notes}>
                • {transaction.notes}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="transaction-right">
        <div className="transaction-amount-wrapper">
          <span className={`transaction-amount ${isIncome ? 'income' : 'expense'}`}>
            {isIncome ? '+' : '-'}{formatCurrency(transaction.amount, currency)}
          </span>
          <span className="transaction-type-indicator">
            {isIncome ? 'Inflow' : 'Outflow'}
          </span>
        </div>

        <div className="transaction-actions">
          <button
            className="action-btn edit"
            onClick={() => onEdit(transaction)}
            title="Edit Transaction"
            aria-label={`Edit ${transaction.title}`}
          >
            <Icon name="edit" size={15} />
          </button>
          <button
            className="action-btn delete"
            onClick={() => onDelete(transaction.id)}
            title="Delete Transaction"
            aria-label={`Delete ${transaction.title}`}
          >
            <Icon name="trash" size={15} />
          </button>
        </div>
      </div>
    </div>
  )
}
