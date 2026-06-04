import React, { useState, useEffect, useCallback } from 'react';
import { api } from './api';
import SummaryPanel from './components/SummaryPanel';
import FilterBar    from './components/FilterBar';
import ExpenseForm  from './components/ExpenseForm';
import ExpenseTable from './components/ExpenseTable';
import DeleteModal  from './components/DeleteModal';

// ── Helpers ──────────────────────────────────────────────────────────────────

function currentMonth() {
  return new Date().toISOString().slice(0, 7);
}

function formatCurrency(n) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2 }).format(n);
}

function formatDate(str) {
  if (!str) return '';
  const [y, m, d] = str.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

const CATEGORY_COLORS = {
  Food: '#f4a261', Transport: '#5b9cf6', Bills: '#e85d5d', Entertainment: '#a78bfa', Other: '#71717a',
};

export { formatCurrency, formatDate, CATEGORY_COLORS, currentMonth };

// ── App ───────────────────────────────────────────────────────────────────────

export default function App() {
  // Data state
  const [expenses,    setExpenses]    = useState([]);
  const [total,       setTotal]       = useState(0);
  const [summary,     setSummary]     = useState(null);
  const [categories,  setCategories]  = useState(['Food', 'Transport', 'Bills', 'Entertainment', 'Other']);
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState(null);

  // Filter state
  const [filters, setFilters] = useState({ category: '', startDate: '', endDate: '', sort: 'date', order: 'desc' });
  const [summaryMonth, setSummaryMonth] = useState(currentMonth);

  // UI state
  const [formMode,       setFormMode]       = useState(null); // 'add' | 'edit' | null
  const [editingExpense, setEditingExpense]  = useState(null);
  const [deleteTarget,   setDeleteTarget]   = useState(null);
  const [formError,      setFormError]      = useState(null);
  const [formLoading,    setFormLoading]    = useState(false);

  // ── Fetch expenses ──────────────────────────────────────────────────────────
  const loadExpenses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getExpenses(filters);
      setExpenses(data.expenses);
      setTotal(data.total);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const loadSummary = useCallback(async () => {
    try {
      const data = await api.getSummary(summaryMonth);
      setSummary(data);
    } catch (e) { /* non-critical */ }
  }, [summaryMonth]);

  // Load categories once
  useEffect(() => {
    api.getCategories().then(d => setCategories(d.categories)).catch(() => {});
  }, []);

  useEffect(() => { loadExpenses(); }, [loadExpenses]);
  useEffect(() => { loadSummary();  }, [loadSummary]);

  // ── CRUD handlers ───────────────────────────────────────────────────────────
  async function handleFormSubmit(payload) {
    setFormLoading(true);
    setFormError(null);
    try {
      if (formMode === 'add')  await api.create(payload);
      else                     await api.update(editingExpense.id, payload);
      setFormMode(null);
      setEditingExpense(null);
      await Promise.all([loadExpenses(), loadSummary()]);
    } catch (e) {
      setFormError(e.message);
    } finally {
      setFormLoading(false);
    }
  }

  async function handleDeleteConfirm() {
    try {
      await api.remove(deleteTarget.id);
      setDeleteTarget(null);
      await Promise.all([loadExpenses(), loadSummary()]);
    } catch (e) {
      setError(e.message);
      setDeleteTarget(null);
    }
  }

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <h1>Expense <span>Tracker</span></h1>
        <button className="btn-primary" onClick={() => { setEditingExpense(null); setFormError(null); setFormMode('add'); }}>
          + Add Expense
        </button>
      </header>

      {/* Summary */}
      <SummaryPanel
        summary={summary}
        month={summaryMonth}
        onMonthChange={setSummaryMonth}
        formatCurrency={formatCurrency}
        CATEGORY_COLORS={CATEGORY_COLORS}
      />

      {/* Filters */}
      <FilterBar
        filters={filters}
        categories={categories}
        onChange={updated => setFilters(prev => ({ ...prev, ...updated }))}
        onClear={() => setFilters({ category: '', startDate: '', endDate: '', sort: 'date', order: 'desc' })}
      />

      {/* Expense Form */}
      {formMode && (
        <ExpenseForm
          mode={formMode}
          initialData={editingExpense}
          categories={categories}
          onSubmit={handleFormSubmit}
          onCancel={() => { setFormMode(null); setEditingExpense(null); setFormError(null); }}
          isLoading={formLoading}
          serverError={formError}
        />
      )}

      {/* Error banner */}
      {error && <div className="error-banner">⚠ {error}</div>}

      {/* Table */}
      <ExpenseTable
        expenses={expenses}
        total={total}
        loading={loading}
        formatCurrency={formatCurrency}
        formatDate={formatDate}
        onEdit={exp => { setEditingExpense(exp); setFormError(null); setFormMode('edit'); }}
        onDelete={exp => setDeleteTarget(exp)}
      />

      {/* Delete modal */}
      {deleteTarget && (
        <DeleteModal
          expense={deleteTarget}
          formatCurrency={formatCurrency}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
