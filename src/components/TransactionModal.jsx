import React, { useState, useEffect } from 'react'
import { Icon } from './Icons'
import { CATEGORIES, PAYMENT_METHODS } from '../data/initialData'

export const TransactionModal = ({
  isOpen,
  onClose,
  onSave,
  initialData = null,
  currency = '$'
}) => {
  const isEditing = Boolean(initialData && initialData.id)

  const [type, setType] = useState('expense')
  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('')
  const [date, setDate] = useState('')
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS[0])
  const [notes, setNotes] = useState('')
  const [error, setError] = useState('')

  // Sync state when opening or when initialData changes
  useEffect(() => {
    if (initialData) {
      setType(initialData.type || 'expense')
      setTitle(initialData.title || '')
      setAmount(initialData.amount !== undefined ? String(initialData.amount) : '')
      setCategory(initialData.category || '')
      setDate(initialData.date || new Date().toISOString().slice(0, 10))
      setPaymentMethod(initialData.paymentMethod || PAYMENT_METHODS[0])
      setNotes(initialData.notes || '')
    } else {
      // Default new entry
      setType('expense')
      setTitle('')
      setAmount('')
      setCategory(CATEGORIES.expense[0]?.id || '')
      setDate(new Date().toISOString().slice(0, 10))
      setPaymentMethod(PAYMENT_METHODS[0])
      setNotes('')
    }
    setError('')
  }, [initialData, isOpen])

  // Adjust default category if type changes and current category is not in list
  const handleTypeChange = (newType) => {
    setType(newType)
    const validCategories = CATEGORIES[newType] || []
    if (!validCategories.some((c) => c.id === category)) {
      setCategory(validCategories[0]?.id || '')
    }
  }

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!title.trim()) {
      setError('Please provide a title or description for the transaction.')
      return
    }
    const numAmount = parseFloat(amount)
    if (isNaN(numAmount) || numAmount <= 0) {
      setError('Please enter a valid amount greater than 0.')
      return
    }
    if (!category) {
      setError('Please select a category.')
      return
    }
    if (!date) {
      setError('Please select a valid date.')
      return
    }

    const payload = {
      id: isEditing ? initialData.id : `tx-${Date.now()}`,
      title: title.trim(),
      amount: numAmount,
      type,
      category,
      date,
      paymentMethod,
      notes: notes.trim()
    }

    onSave(payload)
    onClose()
  }

  const currentCategoryList = CATEGORIES[type] || []

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-container"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-heading"
      >
        <div className="modal-header">
          <div className="modal-header-info">
            <h2 id="modal-heading" className="modal-title">
              {isEditing ? 'Edit Transaction' : 'Add New Transaction'}
            </h2>
            <p className="modal-subtitle">
              {isEditing
                ? 'Update the transaction details below'
                : 'Enter your income or expense record to keep your budget in sync'}
            </p>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            <Icon name="x" size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {error && (
            <div className="modal-alert-error">
              <Icon name="alert" size={16} />
              <span>{error}</span>
            </div>
          )}

          {/* Type Selector Tabs */}
          <div className="form-group">
            <label className="form-label">Transaction Type</label>
            <div className="type-toggle-group">
              <button
                type="button"
                className={`type-toggle-btn expense ${type === 'expense' ? 'active' : ''}`}
                onClick={() => handleTypeChange('expense')}
              >
                <Icon name="arrow-down-left" size={16} />
                <span>Expense (Money Out)</span>
              </button>
              <button
                type="button"
                className={`type-toggle-btn income ${type === 'income' ? 'active' : ''}`}
                onClick={() => handleTypeChange('income')}
              >
                <Icon name="arrow-up-right" size={16} />
                <span>Income (Money In)</span>
              </button>
            </div>
          </div>

          <div className="form-row">
            {/* Title */}
            <div className="form-group flex-2">
              <label htmlFor="tx-title" className="form-label">
                Title / Merchant <span className="required">*</span>
              </label>
              <input
                id="tx-title"
                type="text"
                className="form-input"
                placeholder={type === 'expense' ? 'e.g., Grocery Shopping, Uber' : 'e.g., Monthly Salary, Freelance'}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                autoFocus
              />
            </div>

            {/* Amount */}
            <div className="form-group flex-1">
              <label htmlFor="tx-amount" className="form-label">
                Amount ({currency}) <span className="required">*</span>
              </label>
              <div className="input-with-prefix">
                <span className="input-prefix">{currency}</span>
                <input
                  id="tx-amount"
                  type="number"
                  step="0.01"
                  min="0.01"
                  className="form-input has-prefix"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="form-row">
            {/* Category */}
            <div className="form-group flex-1">
              <label htmlFor="tx-category" className="form-label">
                Category <span className="required">*</span>
              </label>
              <select
                id="tx-category"
                className="form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {currentCategoryList.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.icon} {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div className="form-group flex-1">
              <label htmlFor="tx-date" className="form-label">
                Date <span className="required">*</span>
              </label>
              <input
                id="tx-date"
                type="date"
                className="form-input"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="tx-payment" className="form-label">
              Payment Method
            </label>
            <select
              id="tx-payment"
              className="form-select"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              {PAYMENT_METHODS.map((pm) => (
                <option key={pm} value={pm}>
                  {pm}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="tx-notes" className="form-label">
              Notes / Receipt Reference (Optional)
            </label>
            <textarea
              id="tx-notes"
              rows="2"
              className="form-textarea"
              placeholder="Add any extra detail or tag..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
            >
              <Icon name="check" size={16} />
              <span>{isEditing ? 'Save Changes' : 'Add Transaction'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
