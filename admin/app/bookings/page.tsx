'use client';

import React, { useEffect, useState } from 'react';
import { CalendarCheck, Search, Filter, ShieldCheck } from 'lucide-react';
import AdminHeader from '../../components/AdminHeader';
import { fetchAdminApi, adminLogin } from '../../lib/api';

export default function BookingsAdminPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  const loadBookings = async () => {
    await adminLogin();
    const res = await fetchAdminApi('/admin/bookings');
    if (res.success) {
      setBookings(res.bookings);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const filtered = bookings.filter((b) => {
    const matchesFilter = filter === 'ALL' || b.status === filter;
    const matchesSearch =
      search === '' ||
      b.bookingNumber?.toLowerCase().includes(search.toLowerCase()) ||
      b.customer?.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      b.vehicle?.model?.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="flex-1 flex flex-col">
      <AdminHeader
        title="Marketplace Bookings Master"
        subtitle="Oversight of all rental transactions, payments, and schedules"
      />

      <main className="p-8 flex-1 overflow-y-auto space-y-6">
        {/* Controls Bar */}
        <div className="flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Booking #, Customer, or Vehicle model..."
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 shadow-sm"
            />
          </div>

          <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 text-xs shadow-sm">
            {(['ALL', 'CONFIRMED', 'ACTIVE', 'COMPLETED', 'DISPUTED', 'CANCELLED'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  filter === tab ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Bookings Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Booking Reference</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Vehicle & Provider</th>
                <th className="px-6 py-4">Rental Window</th>
                <th className="px-6 py-4">Price Breakdown</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-mono font-bold text-slate-900 text-xs">{b.bookingNumber}</p>
                    <span className="text-[11px] text-slate-400">Created {new Date(b.createdAt).toLocaleDateString()}</span>
                  </td>

                  <td className="px-6 py-4">
                    <p className="font-semibold text-slate-900">{b.customer?.fullName}</p>
                    <p className="text-xs text-slate-400">{b.customer?.phone}</p>
                  </td>

                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-800">{b.vehicle?.brand} {b.vehicle?.model}</p>
                    <p className="text-xs text-slate-500 font-medium">{b.provider?.businessName}</p>
                  </td>

                  <td className="px-6 py-4 text-xs text-slate-600">
                    <p className="font-medium">{new Date(b.startDate).toLocaleDateString()} → {new Date(b.endDate).toLocaleDateString()}</p>
                    <span className="text-[11px] text-slate-400">{b.totalDays} Days ({b.totalHours} hrs)</span>
                  </td>

                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-900">Total: ₹{b.totalAmount}</p>
                    <p className="text-[11px] text-slate-400">Rental: ₹{b.rentalAmount} | Deposit: ₹{b.securityDeposit} | Fee: ₹{b.platformFee}</p>
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold ${
                        b.status === 'COMPLETED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : b.status === 'ACTIVE'
                          ? 'bg-blue-100 text-blue-800'
                          : b.status === 'DISPUTED'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
