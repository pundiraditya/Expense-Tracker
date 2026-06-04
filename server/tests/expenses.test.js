const request = require('supertest');
const app     = require('../app');
const store   = require('../store');

// Reset expenses before each test so tests don't affect each other
const seedExpenses = () => [
  { id: 'test-1', title: 'Groceries',  amount: 500, category: 'Food',      date: '2025-06-01', note: '', createdAt: new Date().toISOString() },
  { id: 'test-2', title: 'Metro',      amount: 200, category: 'Transport', date: '2025-06-02', note: '', createdAt: new Date().toISOString() },
];

beforeEach(() => {
  store.expenses.length = 0;
  store.expenses.push(...seedExpenses());
});

describe('GET /api/health', () => {
  it('returns 200 with status ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});

describe('GET /api/expenses', () => {
  it('returns all expenses', async () => {
    const res = await request(app).get('/api/expenses');
    expect(res.status).toBe(200);
    expect(res.body.expenses).toHaveLength(2);
    expect(res.body.total).toBe(2);
  });

  it('filters by category', async () => {
    const res = await request(app).get('/api/expenses?category=Food');
    expect(res.body.expenses).toHaveLength(1);
    expect(res.body.expenses[0].category).toBe('Food');
  });

  it('sorts by amount descending by default', async () => {
    const res = await request(app).get('/api/expenses?sort=amount&order=desc');
    expect(res.body.expenses[0].amount).toBeGreaterThan(res.body.expenses[1].amount);
  });
});

describe('GET /api/expenses/categories', () => {
  it('returns the category list', async () => {
    const res = await request(app).get('/api/expenses/categories');
    expect(res.status).toBe(200);
    expect(res.body.categories).toContain('Food');
  });
});

describe('GET /api/expenses/summary', () => {
  it('returns summary for current month', async () => {
    const res = await request(app).get('/api/expenses/summary?month=2025-06');
    expect(res.status).toBe(200);
    expect(res.body.totalThisMonth).toBe(700);
    expect(res.body.totalByCategory.Food).toBe(500);
  });
});

describe('GET /api/expenses/:id', () => {
  it('returns a single expense', async () => {
    const res = await request(app).get('/api/expenses/test-1');
    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Groceries');
  });

  it('returns 404 for unknown id', async () => {
    const res = await request(app).get('/api/expenses/not-real');
    expect(res.status).toBe(404);
  });
});

describe('POST /api/expenses', () => {
  it('creates a new expense', async () => {
    const payload = { title: 'Dinner', amount: 350, category: 'Food', date: '2025-06-03' };
    const res = await request(app).post('/api/expenses').send(payload);
    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
    expect(res.body.title).toBe('Dinner');
  });

  it('rejects missing title', async () => {
    const res = await request(app).post('/api/expenses').send({ amount: 100, category: 'Food', date: '2025-06-01' });
    expect(res.status).toBe(422);
  });

  it('rejects negative amount', async () => {
    const res = await request(app).post('/api/expenses').send({ title: 'X', amount: -5, category: 'Food', date: '2025-06-01' });
    expect(res.status).toBe(422);
  });

  it('rejects future date', async () => {
    const res = await request(app).post('/api/expenses').send({ title: 'X', amount: 100, category: 'Food', date: '2099-01-01' });
    expect(res.status).toBe(422);
  });

  it('rejects invalid category', async () => {
    const res = await request(app).post('/api/expenses').send({ title: 'X', amount: 100, category: 'Luxury', date: '2025-06-01' });
    expect(res.status).toBe(422);
  });
});

describe('PUT /api/expenses/:id', () => {
  it('updates an existing expense', async () => {
    const res = await request(app).put('/api/expenses/test-1')
      .send({ title: 'Updated', amount: 999, category: 'Food', date: '2025-06-01' });
    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Updated');
    expect(res.body.amount).toBe(999);
  });

  it('returns 404 for unknown id', async () => {
    const res = await request(app).put('/api/expenses/ghost').send({ title: 'X', amount: 1, category: 'Food', date: '2025-06-01' });
    expect(res.status).toBe(404);
  });
});

describe('DELETE /api/expenses/:id', () => {
  it('deletes an expense', async () => {
    const res = await request(app).delete('/api/expenses/test-1');
    expect(res.status).toBe(200);
    expect(res.body.id).toBe('test-1');
    expect(store.expenses.find(e => e.id === 'test-1')).toBeUndefined();
  });

  it('returns 404 for unknown id', async () => {
    const res = await request(app).delete('/api/expenses/ghost');
    expect(res.status).toBe(404);
  });
});
