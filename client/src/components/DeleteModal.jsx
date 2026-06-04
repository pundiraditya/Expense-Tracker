import React, { useEffect } from 'react';

export default function DeleteModal({ expense, formatCurrency, onConfirm, onCancel }) {
  // Close on Escape key
  useEffect(() => {
    const handler = e => { if (e.key === 'Escape') onCancel(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onCancel]);

  return (
    <div className="modal-backdrop" onClick={e => { if (e.target === e.currentTarget) onCancel(); }}>
      <div className="modal" role="dialog" aria-modal="true">
        <h3>Delete Expense?</h3>
        <p>
          "<strong>{expense.title}</strong>" ({formatCurrency(expense.amount)}) will be permanently removed.
        </p>
        <div className="modal-actions">
          <button className="btn-ghost" onClick={onCancel}>Keep it</button>
          <button className="btn-danger" onClick={onConfirm}>Yes, delete</button>
        </div>
      </div>
    </div>
  );
}
