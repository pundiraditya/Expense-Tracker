const BASE = '/api/expenses';

async function request(url, options = {}) {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
  return data;
}

export const api = {
  getExpenses:  (params = {}) => {
    const q = new URLSearchParams(Object.entries(params).filter(([, v]) => v)).toString();
    return request(`${BASE}${q ? `?${q}` : ''}`);
  },
  getCategories: () => request(`${BASE}/categories`),
  getSummary:    (month) => request(`${BASE}/summary?month=${month}`),
  create:        (body) => request(BASE, { method: 'POST', body }),
  update:        (id, body) => request(`${BASE}/${id}`, { method: 'PUT', body }),
  remove:        (id) => request(`${BASE}/${id}`, { method: 'DELETE' }),
};
