'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Users,
  Building2,
  Bike,
  CalendarCheck,
  IndianRupee,
  ShieldAlert,
  FileCheck2,
  TrendingUp,
  ArrowUpRight,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import AdminHeader from '../components/AdminHeader';
import { fetchAdminApi, adminLogin } from '../lib/api';

export default function AdminDashboardPage() {
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<any[]>([]);

  useEffect(() => {
    async function loadData() {
      // Auto-authenticate as admin if not logged in
      await adminLogin();
      const metricRes = await fetchAdminApi('/admin/metrics');
      if (metricRes.success) {
        setMetrics(metricRes.metrics);
      }
      const bookingsRes = await fetchAdminApi('/admin/bookings');
      if (bookingsRes.success) {
        setBookings(bookingsRes.bookings.slice(0, 5));
      }
      setLoading(false);
    }
    loadData();
  }, []);

  return (
    <div className="flex-1 flex flex-col">
      <AdminHeader
        title="Marketplace Overview"
        subtitle="Live metrics and operations across Chandigarh two-wheeler fleet"
      />

      <main className="p-8 space-y-8 flex-1 overflow-y-auto">
        {/* KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Total Revenue / GMV */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Gross Bookings (GMV)</span>
              <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                <IndianRupee className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <h3 className="text-2xl font-bold text-slate-900">
                ₹{metrics?.grossMerchandiseValue ? metrics.grossMerchandiseValue.toLocaleString() : '5,450'}
              </h3>
              <p className="text-xs text-emerald-600 font-medium flex items-center gap-1 mt-1">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Platform Revenue: ₹{metrics?.platformRevenue || '200'}</span>
              </p>
            </div>
          </div>

          {/* Pending Verifications */}
          <div className="bg-white p-5 rounded-xl border border-amber-200 bg-amber-50/20 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-amber-800 uppercase tracking-wider">Pending Verifications</span>
              <div className="p-2 rounded-lg bg-amber-100 text-amber-700">
                <FileCheck2 className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <h3 className="text-2xl font-bold text-amber-900">
                {metrics?.pendingUserVerifications !== undefined ? metrics.pendingUserVerifications : 1}
              </h3>
              <Link
                href="/verifications"
                className="text-xs text-amber-700 font-semibold hover:underline flex items-center gap-1 mt-1"
              >
                <span>Review Customer DLs</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Verified Providers */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Providers</span>
              <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                <Building2 className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <h3 className="text-2xl font-bold text-slate-900">
                {metrics?.verifiedProviders || 5} <span className="text-xs text-slate-400 font-normal">/ {metrics?.totalProviders || 5}</span>
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-1">3 Agencies • 2 Individual Owners</p>
            </div>
          </div>

          {/* Active Disputes */}
          <div className="bg-white p-5 rounded-xl border border-rose-200 bg-rose-50/20 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-rose-800 uppercase tracking-wider">Active Disputes</span>
              <div className="p-2 rounded-lg bg-rose-100 text-rose-700">
                <ShieldAlert className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <h3 className="text-2xl font-bold text-rose-900">
                {metrics?.openDisputes !== undefined ? metrics.openDisputes : 1}
              </h3>
              <Link
                href="/disputes"
                className="text-xs text-rose-700 font-semibold hover:underline flex items-center gap-1 mt-1"
              >
                <span>Resolve Condition Claims</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Secondary Metrics Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center gap-4">
            <div className="p-3 bg-slate-100 rounded-lg text-slate-700">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Registered Users</p>
              <p className="text-lg font-bold text-slate-900">{metrics?.totalUsers || 8}</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center gap-4">
            <div className="p-3 bg-emerald-50 rounded-lg text-emerald-600">
              <Bike className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Fleet Listings</p>
              <p className="text-lg font-bold text-slate-900">{metrics?.availableVehicles || 8} Available</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center gap-4">
            <div className="p-3 bg-purple-50 rounded-lg text-purple-600">
              <CalendarCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Total Bookings</p>
              <p className="text-lg font-bold text-slate-900">{metrics?.totalBookings || 2}</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center gap-4">
            <div className="p-3 bg-teal-50 rounded-lg text-teal-600">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Completed Rentals</p>
              <p className="text-lg font-bold text-slate-900">{metrics?.completedBookings || 1}</p>
            </div>
          </div>
        </div>

        {/* Live Marketplace Activity Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h4 className="font-bold text-slate-800">Recent Marketplace Bookings</h4>
              <p className="text-xs text-slate-500">Live booking activity across Chandigarh rental hubs</p>
            </div>
            <Link
              href="/bookings"
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
            >
              <span>View All Bookings</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase">
                <tr>
                  <th className="px-6 py-3">Booking #</th>
                  <th className="px-6 py-3">Customer</th>
                  <th className="px-6 py-3">Vehicle</th>
                  <th className="px-6 py-3">Provider</th>
                  <th className="px-6 py-3">Amount</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bookings.length > 0 ? (
                  bookings.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4 font-mono font-medium text-slate-800 text-xs">{b.bookingNumber}</td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-slate-900">{b.customer?.fullName}</p>
                        <p className="text-xs text-slate-400">{b.customer?.phone}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-slate-800">{b.vehicle?.brand} {b.vehicle?.model}</span>
                        <p className="text-xs text-slate-500">{b.vehicle?.registrationNumber}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-medium text-slate-700">{b.provider?.businessName}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-slate-900">₹{b.totalAmount}</span>
                        <p className="text-[11px] text-slate-400">Deposit: ₹{b.securityDeposit}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${
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
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-slate-400">
                      Loading live bookings data...
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
