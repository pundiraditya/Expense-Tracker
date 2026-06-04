import React from 'react';

const BADGE_CLASS = {
  Food: 'badge badge-food', Transport: 'badge badge-transport',
  Bills: 'badge badge-bills', Entertainment: 'badge badge-entertainment', Other: 'badge badge-other',
};

function SkeletonRow() {
  return (
    <tr className="skeleton-row">
      {[140, 80, 90, 80, 100, 80].map((w, i) => (
        <td key={i}><div className="skeleton" style={{ height: 14, width: w }} /></td>
      ))}
    </tr>
  );
}

export default function ExpenseTable({ expenses, total, loading, formatCurrency, formatDate, onEdit, onDelete }) {
  return (
    <div className="table-card">
      <div className="table-header">
        <h3>Expenses</h3>
        <span className="table-count">{total} record{total !== 1 ? 's' : ''}</span>
      </div>

      {loading ? (
        <table>
          <thead>
            <tr>
              <th>Title</th><th>Amount</th><th>Category</th><th>Date</th><th>Note</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>{[...Array(3)].map((_, i) => <SkeletonRow key={i} />)}</tbody>
        </table>
      ) : expenses.length === 0 ? (
        <div className="empty-state">
          <p>💸</p>
          <p>No expenses found</p>
        </div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Title</th><th>Amount</th><th>Category</th><th>Date</th><th>Note</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map(exp => (
              <tr key={exp.id}>
                <td style={{ fontWeight: 500 }}>{exp.title}</td>
                <td className="amount">{formatCurrency(exp.amount)}</td>
                <td><span className={BADGE_CLASS[exp.category] || 'badge'}>{exp.category}</span></td>
                <td>{formatDate(exp.date)}</td>
                <td className="note-text">{exp.note || '—'}</td>
                <td>
                  <div className="actions">
                    <button className="btn-ghost btn-sm" onClick={() => onEdit(exp)}>Edit</button>
                    <button className="btn-danger btn-sm" onClick={() => onDelete(exp)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
