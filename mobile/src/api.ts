const API_BASE = 'http://localhost:4000/api';

export async function request(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('renting_mobile_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.error(`Mobile API error [${endpoint}]:`, err);
    return { success: false, message: 'Could not connect to Renting App server' };
  }
}

export const api = {
  // Auth
  sendOtp: (phone: string) => request('/auth/send-otp', { method: 'POST', body: JSON.stringify({ phone }) }),
  verifyOtp: (phone: string, otp: string, role?: string, fullName?: string) =>
    request('/auth/verify-otp', { method: 'POST', body: JSON.stringify({ phone, otp, role, fullName }) }),
  quickLogin: (role: string) => request('/auth/dev-quick-login', { method: 'POST', body: JSON.stringify({ role }) }),
  getMe: () => request('/auth/me'),

  // Locations & Vehicles
  getCities: () => request('/locations/cities'),
  searchVehicles: (params: Record<string, string | number>) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== '' && v !== 'ALL') query.append(k, String(v));
    });
    return request(`/vehicles?${query.toString()}`);
  },
  compareVehicles: (ids: string[]) => request(`/vehicles/compare?ids=${ids.join(',')}`),
  getVehicleById: (id: string) => request(`/vehicles/${id}`),
  createVehicle: (data: any) => request('/vehicles', { method: 'POST', body: JSON.stringify(data) }),

  // Bookings & Price Calculation
  calculatePrice: (vehicleId: string, startDate: string, endDate: string) =>
    request('/bookings/calculate-price', { method: 'POST', body: JSON.stringify({ vehicleId, startDate, endDate }) }),
  createBooking: (data: any) => request('/bookings', { method: 'POST', body: JSON.stringify(data) }),
  getBookings: (status?: string) => request(`/bookings${status ? `?status=${status}` : ''}`),
  getBookingById: (id: string) => request(`/bookings/${id}`),
  updateBookingStatus: (id: string, status: string, notes?: string) =>
    request(`/bookings/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status, notes }) }),

  // Verification & Profile
  getVerificationStatus: () => request('/users/verification-status'),
  submitVerificationDocs: (docs: any) => request('/users/documents', { method: 'POST', body: JSON.stringify(docs) }),
  updateProfile: (profile: any) => request('/users/me', { method: 'PATCH', body: JSON.stringify(profile) }),

  // Handover Condition & Agreements
  createConditionReport: (data: any) => request('/condition-reports', { method: 'POST', body: JSON.stringify(data) }),
  getConditionReports: (bookingId: string) => request(`/condition-reports/booking/${bookingId}`),
  getRentalAgreement: (bookingId: string) => request(`/agreements/booking/${bookingId}`),
  signAgreement: (bookingId: string, signatureNotes: string) =>
    request(`/agreements/sign/${bookingId}`, { method: 'POST', body: JSON.stringify({ signatureNotes }) }),

  // Reviews & Disputes
  createReview: (data: any) => request('/reviews', { method: 'POST', body: JSON.stringify(data) }),
  getVehicleReviews: (vehicleId: string) => request(`/reviews/vehicle/${vehicleId}`),
  createDispute: (data: any) => request('/disputes', { method: 'POST', body: JSON.stringify(data) }),
  getDisputes: () => request('/disputes'),

  // Provider
  getProviderStats: () => request('/providers/dashboard-stats'),
  registerProvider: (data: any) => request('/providers/register', { method: 'POST', body: JSON.stringify(data) }),
};
