import React, { useState, useEffect } from 'react';

const today = () => new Date().toISOString().slice(0, 10);

export default function ExpenseForm({ mode, initialData, categories, onSubmit, onCancel, isLoading, serverError }) {
  const [form, setForm] = useState({ title: '', amount: '', category: categories[0] || 'Food', date: today(), note: '' });
  const [errors, setErrors] = useState({});

  // Pre-fill form when editing
  useEffect(() => {
    if (mode === 'edit' && initialData) {
      setForm({
        title:    initialData.title,
        amount:   String(initialData.amount),
        category: initialData.category,
        date:     initialData.date,
        note:     initialData.note || '',
      });
    }
  }, [mode, initialData]);

  function set(field, value) {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' })); // Clear field error on change
  }

  function validate() {
    const e = {};
    if (!form.title.trim())                        e.title    = 'Title is required';
    if (!form.amount || Number(form.amount) <= 0)  e.amount   = 'Enter a positive amount';
    if (!form.category)                            e.category = 'Select a category';
    if (!form.date)                                e.date     = 'Date is required';
    else if (form.date > today())                  e.date     = 'Date cannot be in the future';
    return e;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onSubmit({ ...form, amount: Number(form.amount) });
  }

  return (
    <div className="form-card">
      <h3>{mode === 'add' ? 'Add New Expense' : 'Edit Expense'}</h3>

      {serverError && <div className="form-error">⚠ {serverError}</div>}

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-grid">
          <div className="form-group full">
            <label>Title *</label>
            <input
              type="text"
              value={form.title}
              onChange={e => set('title', e.target.value)}
              placeholder="e.g. Grocery shopping"
              style={errors.title ? { borderColor: '#e05c5c' } : {}}
            />
            {errors.title && <span style={{ color: '#e05c5c', fontSize: 12 }}>{errors.title}</span>}
          </div>

          <div className="form-group">
            <label>Amount (₹) *</label>
            <input
              type="number"
              value={form.amount}
              onChange={e => set('amount', e.target.value)}
              placeholder="0.00"
              min="0.01"
              step="0.01"
              style={errors.amount ? { borderColor: '#e05c5c' } : {}}
            />
            {errors.amount && <span style={{ color: '#e05c5c', fontSize: 12 }}>{errors.amount}</span>}
          </div>

          <div className="form-group">
            <label>Category *</label>
            <select value={form.category} onChange={e => set('category', e.target.value)}>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label>Date *</label>
            <input
              type="date"
              value={form.date}
              max={today()}
              onChange={e => set('date', e.target.value)}
              style={errors.date ? { borderColor: '#e05c5c' } : {}}
            />
            {errors.date && <span style={{ color: '#e05c5c', fontSize: 12 }}>{errors.date}</span>}
          </div>

          <div className="form-group">
            <label>Note</label>
            <input
              type="text"
              value={form.note}
              onChange={e => set('note', e.target.value)}
              placeholder="Optional"
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn-ghost" onClick={onCancel} disabled={isLoading}>
            Cancel
          </button>
          <button type="submit" className="btn-primary" disabled={isLoading}>
            {isLoading ? 'Saving…' : mode === 'add' ? 'Add Expense' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
