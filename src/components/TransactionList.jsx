import React, { useState, useMemo } from 'react'
import { Icon } from './Icons'
import { TransactionItem } from './TransactionItem'
import { CATEGORIES } from '../data/initialData'

export const TransactionList = ({
  transactions,
  currency = '$',
  onEdit,
  onDelete,
  onAddNew,
  isCompact = false,
  maxCompactItems = 6
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('all') // 'all' | 'expense' | 'income'
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [sortBy, setSortBy] = useState('date-desc') // 'date-desc', 'date-asc', 'amount-desc', 'amount-asc'

  // Dynamic filtering & searching using array methods
  const filteredTransactions = useMemo(() => {
    return transactions
      .filter((tx) => {
        // Type filter
        if (typeFilter !== 'all' && tx.type !== typeFilter) {
          return false
        }
        // Category filter
        if (categoryFilter !== 'all' && tx.category !== categoryFilter) {
          return false
        }
        // Search term matching title, notes, category, or payment method
        if (searchTerm.trim()) {
          const query = searchTerm.toLowerCase().trim()
          const matchTitle = (tx.title || '').toLowerCase().includes(query)
          const matchNotes = (tx.notes || '').toLowerCase().includes(query)
          const matchCategory = (tx.category || '').toLowerCase().includes(query)
          const matchPayment = (tx.paymentMethod || '').toLowerCase().includes(query)
          if (!matchTitle && !matchNotes && !matchCategory && !matchPayment) {
            return false
          }
        }
        return true
      })
      .sort((a, b) => {
        if (sortBy === 'date-desc') {
          return new Date(b.date) - new Date(a.date)
        }
        if (sortBy === 'date-asc') {
          return new Date(a.date) - new Date(b.date)
        }
        if (sortBy === 'amount-desc') {
          return b.amount - a.amount
        }
        if (sortBy === 'amount-asc') {
          return a.amount - b.amount
        }
        return 0
      })
  }, [transactions, searchTerm, typeFilter, categoryFilter, sortBy])

  const displayedList = isCompact
    ? filteredTransactions.slice(0, maxCompactItems)
    : filteredTransactions

  // Export to CSV helper
  const handleExportCSV = () => {
    if (filteredTransactions.length === 0) return
    const headers = ['ID', 'Date', 'Title', 'Type', 'Category', 'Amount', 'PaymentMethod', 'Notes']
    const rows = filteredTransactions.map((tx) => [
      `"${tx.id}"`,
      `"${tx.date}"`,
      `"${(tx.title || '').replace(/"/g, '""')}"`,
      `"${tx.type}"`,
      `"${tx.category}"`,
      tx.amount,
      `"${tx.paymentMethod || ''}"`,
      `"${(tx.notes || '').replace(/"/g, '""')}"`
    ])
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `ExpenseFlow_Transactions_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Combined category options
  const allCategories = [...CATEGORIES.expense, ...CATEGORIES.income]

  return (
    <div className={`card transaction-list-card ${isCompact ? 'compact' : ''}`}>
      {/* List Header & Controls */}
      <div className="card-header flex-between">
        <div>
          <h3 className="card-title">
            {isCompact ? 'Recent Transactions' : 'All Transactions'}
          </h3>
          <p className="card-subtitle">
            Showing {displayedList.length} of {transactions.length} total records
          </p>
        </div>

        {!isCompact && (
          <div className="list-top-actions">
            <button
              className="icon-action-btn secondary"
              onClick={handleExportCSV}
              disabled={filteredTransactions.length === 0}
              title="Export filtered records to CSV"
            >
              <Icon name="download" size={16} />
              <span>Export CSV</span>
            </button>
            <button className="btn-primary-sm" onClick={onAddNew}>
              <Icon name="plus" size={16} />
              <span>New Entry</span>
            </button>
          </div>
        )}
      </div>

      {/* Filter and Search Bar (Always shown on full page, minimal on compact) */}
      {!isCompact && (
        <div className="transaction-filters-bar">
          {/* Search Input */}
          <div className="search-input-wrapper">
            <Icon name="search" size={17} className="search-icon" />
            <input
              type="text"
              placeholder="Search by title, notes, or merchant..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            {searchTerm && (
              <button
                className="clear-search-btn"
                onClick={() => setSearchTerm('')}
                aria-label="Clear search"
              >
                <Icon name="x" size={14} />
              </button>
            )}
          </div>

          <div className="filters-row">
            {/* Type Filter Pills */}
            <div className="filter-pill-group">
              <button
                className={`filter-pill ${typeFilter === 'all' ? 'active' : ''}`}
                onClick={() => setTypeFilter('all')}
              >
                All Types
              </button>
              <button
                className={`filter-pill ${typeFilter === 'expense' ? 'active' : ''}`}
                onClick={() => setTypeFilter('expense')}
              >
                Expenses
              </button>
              <button
                className={`filter-pill ${typeFilter === 'income' ? 'active' : ''}`}
                onClick={() => setTypeFilter('income')}
              >
                Income
              </button>
            </div>

            {/* Category Filter */}
            <div className="filter-select-wrapper">
              <select
                className="filter-select"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                aria-label="Filter by category"
              >
                <option value="all">All Categories</option>
                <optgroup label="Expense Categories">
                  {CATEGORIES.expense.map((cat) => (
                    <option key={`exp-${cat.id}`} value={cat.id}>
                      {cat.icon} {cat.label}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Income Categories">
                  {CATEGORIES.income.map((cat) => (
                    <option key={`inc-${cat.id}`} value={cat.id}>
                      {cat.icon} {cat.label}
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="filter-select-wrapper">
              <select
                className="filter-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                aria-label="Sort transactions"
              >
                <option value="date-desc">Newest First</option>
                <option value="date-asc">Oldest First</option>
                <option value="amount-desc">Highest Amount</option>
                <option value="amount-asc">Lowest Amount</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Transactions Container */}
      <div className="transactions-list-container">
        {displayedList.length === 0 ? (
          <div className="empty-transactions-state">
            <div className="empty-icon-circle">
              <Icon name="search" size={28} />
            </div>
            <h4>No matching transactions found</h4>
            <p>
              {searchTerm || typeFilter !== 'all' || categoryFilter !== 'all'
                ? 'Try clearing your search keyword or relaxing the filters.'
                : 'Start tracking your spending by adding your first transaction.'}
            </p>
            {searchTerm || typeFilter !== 'all' || categoryFilter !== 'all' ? (
              <button
                className="btn-secondary-sm"
                onClick={() => {
                  setSearchTerm('')
                  setTypeFilter('all')
                  setCategoryFilter('all')
                }}
              >
                Reset Filters
              </button>
            ) : (
              <button className="btn-primary-sm" onClick={onAddNew}>
                <Icon name="plus" size={16} />
                <span>Add Transaction</span>
              </button>
            )}
          </div>
        ) : (
          <div className="transaction-rows-stack">
            {displayedList.map((tx) => (
              <TransactionItem
                key={tx.id}
                transaction={tx}
                currency={currency}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
