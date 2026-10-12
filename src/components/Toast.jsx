import React from 'react'
import { Icon } from './Icons'

export const Toast = ({ toast, onClose }) => {
  if (!toast) return null

  return (
    <div className={`toast-notification ${toast.type || 'info'}`}>
      <div className="toast-icon">
        <Icon
          name={toast.type === 'error' ? 'alert' : 'check'}
          size={18}
        />
      </div>
      <div className="toast-content">
        <span className="toast-message">{toast.message}</span>
      </div>
      <button
        className="toast-close-btn"
        onClick={onClose}
        aria-label="Dismiss toast"
      >
        <Icon name="x" size={14} />
      </button>
    </div>
  )
}
