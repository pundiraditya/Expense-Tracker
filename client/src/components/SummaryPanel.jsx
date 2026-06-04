import React from 'react';

const CATEGORY_ORDER = ['Food', 'Transport', 'Bills', 'Entertainment', 'Other'];

export default function SummaryPanel({ summary, month, onMonthChange, formatCurrency, CATEGORY_COLORS }) {
  const byCategory = summary?.totalByCategory || {};
  const max = Math.max(...Object.values(byCategory), 1);

  const chartBars = CATEGORY_ORDER.map(cat => ({
    name: cat,
    value: byCategory[cat] || 0,
    color: CATEGORY_COLORS[cat],
    pct: Math.round(((byCategory[cat] || 0) / max) * 100),
  })).filter(b => b.value > 0);

  return (
    <section className="summary-panel">
      <div className="summary-header">
        <h2>Summary</h2>
        <input
          type="month"
          className="month-picker"
          value={month}
          max={new Date().toISOString().slice(0, 7)}
          onChange={e => onMonthChange(e.target.value)}
          aria-label="Select month"
        />
      </div>

      <div className="summary-grid">
        {/* Total this month */}
        <div className="stat-card">
          <span className="stat-label">Total This Month</span>
          <span className="stat-value">
            {summary ? formatCurrency(summary.totalThisMonth) : '—'}
          </span>
        </div>

        {/* Highest expense */}
        <div className="stat-card">
          <span className="stat-label">Highest Expense</span>
          {summary?.highestExpense ? (
            <>
              <span className="stat-value" style={{ fontSize: 20 }}>
                {formatCurrency(summary.highestExpense.amount)}
              </span>
              <span className="stat-sub">{summary.highestExpense.title}</span>
            </>
          ) : (
            <span className="stat-value">—</span>
          )}
        </div>

        {/* Bar chart */}
        <div className="chart-card">
          <span className="stat-label">Spending by Category</span>
          {chartBars.length === 0 ? (
            <p className="chart-empty">No data for this month</p>
          ) : (
            <div className="chart-bars">
              {chartBars.map(bar => (
                <div key={bar.name} className="chart-bar-wrap" title={`${bar.name}: ${formatCurrency(bar.value)}`}>
                  <div
                    className="chart-bar"
                    style={{ height: `${bar.pct}%`, background: bar.color }}
                  />
                  <span className="chart-bar-label">{bar.name.slice(0, 4)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
