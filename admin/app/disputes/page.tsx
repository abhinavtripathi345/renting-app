'use client';

import React, { useEffect, useState } from 'react';
import { ShieldAlert, CheckCircle2, Clock, Image as ImageIcon, MessageSquare, AlertCircle } from 'lucide-react';
import AdminHeader from '../../components/AdminHeader';
import { fetchAdminApi, adminLogin } from '../../lib/api';

export default function DisputesAdminPage() {
  const [disputes, setDisputes] = useState<any[]>([]);
  const [selectedDispute, setSelectedDispute] = useState<any | null>(null);
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [loading, setLoading] = useState(true);

  const loadDisputes = async () => {
    await adminLogin();
    const res = await fetchAdminApi('/disputes');
    if (res.success) {
      setDisputes(res.disputes);
      if (res.disputes.length > 0 && !selectedDispute) {
        setSelectedDispute(res.disputes[0]);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    loadDisputes();
  }, []);

  const handleResolve = async (status: 'RESOLVED' | 'REJECTED') => {
    if (!selectedDispute) return;
    const res = await fetchAdminApi(`/disputes/${selectedDispute.id}/resolve`, {
      method: 'PATCH',
      body: JSON.stringify({
        status,
        resolutionNotes: resolutionNotes || 'Condition report audited and resolved by platform admin.',
      }),
    });
    if (res.success) {
      setResolutionNotes('');
      loadDisputes();
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <AdminHeader
        title="Disputes & Claims Center"
        subtitle="Review photographic condition evidence and resolve deposit disputes fairly"
      />

      <main className="p-8 flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Dispute Tickets */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-800 text-sm">Active Dispute Claims</h3>
            <span className="text-xs bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded-full">
              {disputes.length} Tickets
            </span>
          </div>

          <div className="divide-y divide-slate-100 overflow-y-auto max-h-[600px]">
            {disputes.map((d) => {
              const isSelected = selectedDispute?.id === d.id;
              return (
                <div
                  key={d.id}
                  onClick={() => setSelectedDispute(d)}
                  className={`p-4 cursor-pointer transition-colors ${
                    isSelected ? 'bg-rose-50/60 border-l-4 border-rose-600' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                      Claim: ₹{d.claimAmount}
                    </span>
                    <span className="text-xs text-slate-400">{new Date(d.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="font-semibold text-sm text-slate-900 mt-2 line-clamp-1">{d.title}</p>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1">{d.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Inspection & Resolution Panel */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
          {selectedDispute ? (
            <>
              {/* Header */}
              <div className="border-b border-slate-100 pb-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Booking Reference: {selectedDispute.booking?.bookingNumber || 'RENT-2026-CH002'}
                  </span>
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      selectedDispute.status === 'RESOLVED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {selectedDispute.status}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mt-2">{selectedDispute.title}</h3>
                <p className="text-xs text-slate-600 mt-1">{selectedDispute.description}</p>
              </div>

              {/* Dispute Details & Provider Response */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-slate-500 font-semibold block mb-1">Customer Claim:</span>
                  <p className="text-slate-800 font-medium">Initiated by: {selectedDispute.initiatedByUser?.fullName}</p>
                  <p className="text-slate-500">Contact: {selectedDispute.initiatedByUser?.phone}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-slate-500 font-semibold block mb-1">Provider Rebuttal:</span>
                  <p className="text-slate-800 italic">
                    {selectedDispute.providerResponse || 'Pending provider comments...'}
                  </p>
                </div>
              </div>

              {/* Attached Evidence Photos */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-emerald-600" />
                  <span>Condition Evidence Photos</span>
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {selectedDispute.evidencePhotos?.length > 0 ? (
                    selectedDispute.evidencePhotos.map((url: string, idx: number) => (
                      <div key={idx} className="h-40 rounded-lg bg-slate-100 overflow-hidden border border-slate-200">
                        <img src={url} alt="Evidence" className="w-full h-full object-cover" />
                      </div>
                    ))
                  ) : (
                    <div className="col-span-2 p-6 text-center text-slate-400 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                      Handover condition logs loaded from system.
                    </div>
                  )}
                </div>
              </div>

              {/* Admin Resolution Action */}
              {selectedDispute.status !== 'RESOLVED' && (
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <label className="text-xs font-bold text-slate-700 block">Admin Resolution Decision Notes:</label>
                  <textarea
                    value={resolutionNotes}
                    onChange={(e) => setResolutionNotes(e.target.value)}
                    placeholder="Enter ruling details (e.g. Deposit refunded to customer based on pre-rental condition photo evidence)..."
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-xs h-20 focus:outline-none focus:border-emerald-600"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => handleResolve('REJECTED')}
                      className="px-4 py-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 rounded-lg text-xs font-bold"
                    >
                      Reject Claim
                    </button>
                    <button
                      onClick={() => handleResolve('RESOLVED')}
                      className="px-5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-md shadow-emerald-900/20"
                    >
                      Resolve & Refund Customer
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-400 text-sm">
              Select a dispute ticket from the list to review.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
