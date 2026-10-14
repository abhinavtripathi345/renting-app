'use client';

import React, { useEffect, useState } from 'react';
import {
  Building2,
  UserCheck,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldCheck,
  MapPin,
  Star,
  Bike,
  Sparkles,
} from 'lucide-react';
import AdminHeader from '../../components/AdminHeader';
import { fetchAdminApi, adminLogin } from '../../lib/api';

export default function ProvidersPage() {
  const [providers, setProviders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadProviders = async () => {
    await adminLogin();
    const res = await fetchAdminApi('/admin/providers');
    if (res.success) {
      setProviders(res.providers);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadProviders();
  }, []);

  const handleVerify = async (id: string, status: 'VERIFIED' | 'REJECTED') => {
    const res = await fetchAdminApi(`/admin/providers/${id}/verify`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
    if (res.success) {
      loadProviders();
    }
  };

  const handleToggleAssisted = async (id: string) => {
    const res = await fetchAdminApi(`/admin/providers/${id}/assisted-onboarding`, {
      method: 'PATCH',
      body: JSON.stringify({ representativeId: 'ADMIN_CHANDIGARH_01' }),
    });
    if (res.success) {
      loadProviders();
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <AdminHeader
        title="Rental Providers Management"
        subtitle="Manage professional rental agencies and individual vehicle owners"
      />

      <main className="p-8 flex-1 overflow-y-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Providers in Chandigarh:
            </span>
            <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">
              {providers.length} Partners
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 text-blue-700 font-medium bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
              <Building2 className="w-3.5 h-3.5" />
              <span>Agencies: {providers.filter((p) => p.providerType === 'AGENCY').length}</span>
            </span>
            <span className="flex items-center gap-1.5 text-purple-700 font-medium bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200">
              <UserCheck className="w-3.5 h-3.5" />
              <span>Individual Owners: {providers.filter((p) => p.providerType === 'INDIVIDUAL').length}</span>
            </span>
          </div>
        </div>

        {/* Providers Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Provider / Business</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Location / Address</th>
                <th className="px-6 py-4">Fleet & Rating</th>
                <th className="px-6 py-4">Onboarding Mode</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {providers.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                  {/* Name & Contact */}
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-900">{p.businessName}</p>
                    <p className="text-xs text-slate-500">{p.user?.fullName} ({p.user?.phone})</p>
                    {p.gstNumber && <p className="text-[11px] font-mono text-slate-400">GST: {p.gstNumber}</p>}
                  </td>

                  {/* Type */}
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                        p.providerType === 'AGENCY'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-purple-100 text-purple-800'
                      }`}
                    >
                      {p.providerType === 'AGENCY' ? <Building2 className="w-3 h-3" /> : <UserCheck className="w-3 h-3" />}
                      <span>{p.providerType}</span>
                    </span>
                  </td>

                  {/* Address */}
                  <td className="px-6 py-4">
                    <div className="flex items-start gap-1.5 text-xs text-slate-600 max-w-xs">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
                      <span>{p.businessAddress || 'Chandigarh Hub'}</span>
                    </div>
                  </td>

                  {/* Fleet & Rating */}
                  <td className="px-6 py-4">
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center gap-1 font-semibold text-slate-800">
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        <span>{p.rating}</span>
                        <span className="text-slate-400 font-normal">({p.totalRentals} rentals)</span>
                      </div>
                      <div className="flex items-center gap-1 text-slate-500">
                        <Bike className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{p._count?.vehicles || 0} Listed Vehicles</span>
                      </div>
                    </div>
                  </td>

                  {/* Onboarding Mode */}
                  <td className="px-6 py-4">
                    {p.onboardingType === 'ASSISTED' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-full text-xs font-semibold">
                        <Sparkles className="w-3 h-3 text-amber-600" />
                        <span>Assisted Onboarding</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => handleToggleAssisted(p.id)}
                        className="text-xs text-slate-500 hover:text-emerald-700 underline font-medium"
                      >
                        Self-Service (Mark Assisted)
                      </button>
                    )}
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                        p.status === 'VERIFIED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : p.status === 'PENDING'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {p.status === 'VERIFIED' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                      <span>{p.status}</span>
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 text-right space-x-2">
                    {p.status !== 'VERIFIED' ? (
                      <button
                        onClick={() => handleVerify(p.id, 'VERIFIED')}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all"
                      >
                        Approve
                      </button>
                    ) : (
                      <button
                        onClick={() => handleVerify(p.id, 'REJECTED')}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-600 rounded-lg text-xs font-semibold transition-all"
                      >
                        Suspend
                      </button>
                    )}
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
