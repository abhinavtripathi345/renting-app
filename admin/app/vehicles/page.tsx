'use client';

import React, { useEffect, useState } from 'react';
import { Bike, ShieldCheck, CheckCircle2, XCircle, Star, IndianRupee } from 'lucide-react';
import AdminHeader from '../../components/AdminHeader';
import { fetchAdminApi, adminLogin } from '../../lib/api';

export default function VehiclesAdminPage() {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadVehicles = async () => {
    await adminLogin();
    const res = await fetchAdminApi('/admin/vehicles');
    if (res.success) {
      setVehicles(res.vehicles);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadVehicles();
  }, []);

  const handleToggleApproval = async (id: string, isApproved: boolean) => {
    const res = await fetchAdminApi(`/admin/vehicles/${id}/approve`, {
      method: 'PATCH',
      body: JSON.stringify({ isApproved }),
    });
    if (res.success) {
      loadVehicles();
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <AdminHeader
        title="Vehicle Fleet & Listing Approvals"
        subtitle="Approve and moderate bike and scooter listings across Chandigarh providers"
      />

      <main className="p-8 flex-1 overflow-y-auto space-y-6">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Vehicle Model</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Provider</th>
                <th className="px-6 py-4">Daily Price & Deposit</th>
                <th className="px-6 py-4">Location Hub</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Moderation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {vehicles.map((v) => (
                <tr key={v.id} className="hover:bg-slate-50/80 transition-colors">
                  {/* Model & Image */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0 border border-slate-200">
                        {v.images?.[0] ? (
                          <img src={v.images[0].imageUrl} alt={v.model} className="w-full h-full object-cover" />
                        ) : (
                          <Bike className="w-6 h-6 m-auto text-slate-400 mt-3" />
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{v.brand} {v.model}</p>
                        <p className="text-xs text-slate-500">{v.variant} • {v.modelYear}</p>
                        <p className="text-[11px] font-mono text-slate-400">{v.registrationNumber}</p>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                      {v.category}
                    </span>
                  </td>

                  {/* Provider */}
                  <td className="px-6 py-4">
                    <p className="font-semibold text-slate-800 text-xs">{v.provider?.businessName}</p>
                    <span className="text-[11px] text-slate-400">{v.provider?.providerType}</span>
                  </td>

                  {/* Pricing */}
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-900 text-sm">₹{v.pricePerDay} <span className="text-xs font-normal text-slate-500">/day</span></p>
                    <p className="text-xs text-slate-400">Deposit: ₹{v.securityDeposit}</p>
                  </td>

                  {/* Location */}
                  <td className="px-6 py-4 text-xs text-slate-600">
                    <p className="font-medium">{v.area?.name || 'Chandigarh'}</p>
                    <p className="text-[11px] text-slate-400">{v.city?.name}</p>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${
                        v.status === 'AVAILABLE'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {v.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 text-right">
                    {v.isApproved ? (
                      <button
                        onClick={() => handleToggleApproval(v.id, false)}
                        className="px-3 py-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg text-xs font-bold border border-rose-200 transition-colors"
                      >
                        Deactivate
                      </button>
                    ) : (
                      <button
                        onClick={() => handleToggleApproval(v.id, true)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all"
                      >
                        Approve Listing
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
