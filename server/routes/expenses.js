const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { expenses, CATEGORIES } = require('../store');

const router = express.Router();

function err(msg, code) {
  const e = new Error(msg);
  e.statusCode = code;
  return e;
}

function validate(body) {
  const errors = [];
  if (!body.title || !body.title.trim())                  errors.push('Title is required');
  if (!body.amount || isNaN(body.amount) || Number(body.amount) <= 0) errors.push('Amount must be a positive number');
  if (!body.category || !CATEGORIES.includes(body.category))          errors.push(`Category must be one of: ${CATEGORIES.join(', ')}`);
  if (!body.date)                                          errors.push('Date is required');
  else {
    const d = new Date(body.date);
    if (isNaN(d.getTime()))                               errors.push('Invalid date');
    else if (d > new Date())                              errors.push('Date cannot be in the future');
  }
  return errors;
}

// GET /categories — must be before /:id
router.get('/categories', (_req, res) => {
  res.json({ categories: CATEGORIES });
});

// GET /summary?month=YYYY-MM
router.get('/summary', (req, res) => {
  const month = req.query.month || new Date().toISOString().slice(0, 7);
  const monthly = expenses.filter(e => e.date.startsWith(month));

  const totalThisMonth = monthly.reduce((sum, e) => sum + e.amount, 0);

  const totalByCategory = CATEGORIES.reduce((acc, cat) => {
    acc[cat] = monthly.filter(e => e.category === cat).reduce((s, e) => s + e.amount, 0);
    return acc;
  }, {});

  const highestExpense = expenses.length
    ? expenses.reduce((max, e) => e.amount > max.amount ? e : max, expenses[0])
    : null;

  res.json({ totalThisMonth, totalByCategory, highestExpense, month });
});

// GET / — list with filters & sorting
router.get('/', (req, res) => {
  const { category, startDate, endDate, sort = 'date', order = 'desc' } = req.query;
  let result = [...expenses];

  if (category && CATEGORIES.includes(category)) result = result.filter(e => e.category === category);
  if (startDate) result = result.filter(e => e.date >= startDate);
  if (endDate)   result = result.filter(e => e.date <= endDate);

  const dir = order === 'asc' ? 1 : -1;
  result.sort((a, b) => {
    if (sort === 'amount')   return dir * (a.amount - b.amount);
    if (sort === 'category') return dir * a.category.localeCompare(b.category);
    return dir * a.date.localeCompare(b.date);
  });

  res.json({ expenses: result, total: result.length });
});

// GET /:id
router.get('/:id', (req, res, next) => {
  const expense = expenses.find(e => e.id === req.params.id);
  if (!expense) return next(err('Expense not found', 404));
  res.json(expense);
});

// POST /
router.post('/', (req, res, next) => {
  const errors = validate(req.body);
  if (errors.length) return next(err(errors.join('; '), 422));

  const newExpense = {
    id:        uuidv4(),
    title:     req.body.title.trim(),
    amount:    Number(req.body.amount),
    category:  req.body.category,
    date:      req.body.date,
    note:      (req.body.note || '').trim(),
    createdAt: new Date().toISOString(),
  };
  expenses.push(newExpense);
  res.status(201).json(newExpense);
});

// PUT /:id
router.put('/:id', (req, res, next) => {
  const idx = expenses.findIndex(e => e.id === req.params.id);
  if (idx === -1) return next(err('Expense not found', 404));

  const errors = validate(req.body);
  if (errors.length) return next(err(errors.join('; '), 422));

  expenses[idx] = {
    ...expenses[idx],
    title:     req.body.title.trim(),
    amount:    Number(req.body.amount),
    category:  req.body.category,
    date:      req.body.date,
    note:      (req.body.note || '').trim(),
    updatedAt: new Date().toISOString(),
  };
  res.json(expenses[idx]);
});

// DELETE /:id
router.delete('/:id', (req, res, next) => {
  const idx = expenses.findIndex(e => e.id === req.params.id);
  if (idx === -1) return next(err('Expense not found', 404));
  const [deleted] = expenses.splice(idx, 1);
  res.json({ message: 'Deleted successfully', id: deleted.id });
});

module.exports = router;
