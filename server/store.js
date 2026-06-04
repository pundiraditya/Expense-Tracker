const { v4: uuidv4 } = require('uuid');

const CATEGORIES = ['Food', 'Transport', 'Bills', 'Entertainment', 'Other'];

// Seed data so the app looks populated on first load
const expenses = [
  { id: uuidv4(), title: 'Groceries',        amount: 2450.75, category: 'Food',          date: '2025-06-02', note: 'Weekly groceries', createdAt: new Date().toISOString() },
  { id: uuidv4(), title: 'Metro Pass',        amount: 800.00,  category: 'Transport',     date: '2025-06-01', note: 'Monthly metro card', createdAt: new Date().toISOString() },
  { id: uuidv4(), title: 'Electricity Bill',  amount: 1800.00, category: 'Bills',         date: '2025-06-03', note: '', createdAt: new Date().toISOString() },
  { id: uuidv4(), title: 'Movie Night',       amount: 600.00,  category: 'Entertainment', date: '2025-06-01', note: 'PVR IMAX tickets', createdAt: new Date().toISOString() },
  { id: uuidv4(), title: 'Miscellaneous',     amount: 350.50,  category: 'Other',         date: '2025-06-02', note: '', createdAt: new Date().toISOString() },
];

module.exports = { expenses, CATEGORIES };
