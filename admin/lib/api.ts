const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export async function fetchAdminApi(endpoint: string, options: RequestInit = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('renting_admin_token') : null;
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
      cache: 'no-store',
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.error(`API Fetch Error [${endpoint}]:`, err);
    return { success: false, message: 'Failed to connect to backend server' };
  }
}

export async function adminLogin(phone: string = '+919876500000', otp: string = '123456') {
  const res = await fetch(`${API_BASE}/auth/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone, otp, role: 'ADMIN' }),
  });
  const data = await res.json();
  if (data.accessToken && typeof window !== 'undefined') {
    localStorage.setItem('renting_admin_token', data.accessToken);
    localStorage.setItem('renting_admin_user', JSON.stringify(data.user));
  }
  return data;
}
