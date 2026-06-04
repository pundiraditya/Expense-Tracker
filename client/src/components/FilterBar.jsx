import React from 'react';

export default function FilterBar({ filters, categories, onChange, onClear }) {
  const hasFilters = filters.category || filters.startDate || filters.endDate;

  return (
    <div className="filter-bar">
      <div className="filter-group">
        <span className="filter-label">Category</span>
        <select value={filters.category} onChange={e => onChange({ category: e.target.value })}>
          <option value="">All</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div className="filter-group">
        <span className="filter-label">From</span>
        <input type="date" value={filters.startDate} onChange={e => onChange({ startDate: e.target.value })} />
      </div>

      <div className="filter-group">
        <span className="filter-label">To</span>
        <input type="date" value={filters.endDate} onChange={e => onChange({ endDate: e.target.value })} />
      </div>

      <div className="filter-group">
        <span className="filter-label">Sort</span>
        <select value={filters.sort} onChange={e => onChange({ sort: e.target.value })}>
          <option value="date">Date</option>
          <option value="amount">Amount</option>
          <option value="category">Category</option>
        </select>
        <select value={filters.order} onChange={e => onChange({ order: e.target.value })}>
          <option value="desc">↓ Desc</option>
          <option value="asc">↑ Asc</option>
        </select>
      </div>

      {hasFilters && (
        <button className="btn-link" onClick={onClear}>✕ Clear</button>
      )}
    </div>
  );
}
