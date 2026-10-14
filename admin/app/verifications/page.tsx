'use client';

import React, { useEffect, useState } from 'react';
import {
  FileCheck2,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldCheck,
  ExternalLink,
  Eye,
  UserCheck,
  AlertCircle,
} from 'lucide-react';
import AdminHeader from '../../components/AdminHeader';
import { fetchAdminApi, adminLogin } from '../../lib/api';

export default function VerificationsPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'VERIFIED' | 'REJECTED'>('ALL');
  const [rejectionNote, setRejectionNote] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);

  const loadUsers = async () => {
    await adminLogin();
    const res = await fetchAdminApi('/admin/users');
    if (res.success) {
      setUsers(res.users);
      if (!selectedUser && res.users.length > 0) {
        setSelectedUser(res.users.find((u: any) => u.verificationStatus === 'PENDING') || res.users[0]);
      }
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleVerify = async (status: 'VERIFIED' | 'REJECTED', note?: string) => {
    if (!selectedUser) return;
    setActionLoading(true);
    const res = await fetchAdminApi(`/admin/users/${selectedUser.id}/verify`, {
      method: 'PATCH',
      body: JSON.stringify({ status, note }),
    });
    setActionLoading(false);
    setShowRejectModal(false);
    setRejectionNote('');
    if (res.success) {
      loadUsers();
      setSelectedUser(res.user);
    }
  };

  const filteredUsers = users.filter((u) => {
    if (filter === 'ALL') return true;
    return u.verificationStatus === filter;
  });

  return (
    <div className="flex-1 flex flex-col">
      <AdminHeader
        title="Reusable Customer KYC Verifications"
        subtitle="Review once to grant the rider platform-wide access to all vehicle rentals"
      />

      <main className="p-8 flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: User Queue List */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-800 text-sm">Customer Verification Queue</h3>
            {/* Filter Tabs */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs">
              {(['ALL', 'PENDING', 'VERIFIED'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFilter(tab)}
                  className={`px-2.5 py-1 rounded font-medium transition-all ${
                    filter === tab ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="divide-y divide-slate-100 overflow-y-auto max-h-[650px]">
            {filteredUsers.map((u) => {
              const isSelected = selectedUser?.id === u.id;
              return (
                <div
                  key={u.id}
                  onClick={() => setSelectedUser(u)}
                  className={`p-4 cursor-pointer transition-colors flex items-center justify-between ${
                    isSelected ? 'bg-emerald-50/70 border-l-4 border-emerald-600' : 'hover:bg-slate-50'
                  }`}
                >
                  <div>
                    <p className="font-semibold text-sm text-slate-900">{u.fullName}</p>
                    <p className="text-xs text-slate-500">{u.phone}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">DL: {u.drivingLicenseNo || 'Not uploaded'}</p>
                  </div>
                  <div>
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                        u.verificationStatus === 'VERIFIED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : u.verificationStatus === 'PENDING'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {u.verificationStatus === 'VERIFIED' && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                      {u.verificationStatus === 'PENDING' && <Clock className="w-3 h-3 text-amber-600" />}
                      <span>{u.verificationStatus}</span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Verification Inspection & Action Panel */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between">
          {selectedUser ? (
            <div className="space-y-6">
              {/* Header Info */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{selectedUser.fullName}</h3>
                  <p className="text-xs text-slate-500">User ID: {selectedUser.id}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      selectedUser.verificationStatus === 'VERIFIED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : selectedUser.verificationStatus === 'PENDING'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    Status: {selectedUser.verificationStatus}
                  </span>
                </div>
              </div>

              {/* Driving License Details */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Driving License Verification</span>
                  </h4>
                  <span className="text-xs font-mono bg-white px-2 py-0.5 border border-slate-200 rounded text-slate-700">
                    {selectedUser.drivingLicenseNo || 'CH-01-2021-0098472'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400">Expiry Date:</span>
                    <p className="font-semibold text-slate-800">{selectedUser.dlExpiryDate || '2035-10-15'}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Aadhaar (ID Proof):</span>
                    <p className="font-semibold text-slate-800">{selectedUser.aadhaarNo || 'XXXXXXXX9876'}</p>
                  </div>
                </div>

                {/* DL Image Previews */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div>
                    <p className="text-[11px] text-slate-500 mb-1 font-medium">Driving License Front:</p>
                    <div className="relative h-40 bg-slate-200 rounded-lg overflow-hidden border border-slate-300 group">
                      <img
                        src={selectedUser.dlFrontUrl || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600'}
                        alt="DL Front"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-500 mb-1 font-medium">Driving License Back:</p>
                    <div className="relative h-40 bg-slate-200 rounded-lg overflow-hidden border border-slate-300 group">
                      <img
                        src={selectedUser.dlBackUrl || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600'}
                        alt="DL Back"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Reusable Verification Banner */}
              <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-xs text-emerald-800 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <p>
                  <strong>One-Time Reusable Guarantee:</strong> Once verified, this rider can instantly book bikes & scooters from any provider across Chandigarh without submitting identity documents again.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  disabled={actionLoading}
                  onClick={() => setShowRejectModal(true)}
                  className="px-4 py-2 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg text-sm font-semibold border border-rose-200 transition-colors flex items-center gap-1.5"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Reject</span>
                </button>

                <button
                  disabled={actionLoading || selectedUser.verificationStatus === 'VERIFIED'}
                  onClick={() => handleVerify('VERIFIED')}
                  className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-lg text-sm font-bold shadow-md shadow-emerald-900/20 transition-all flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{selectedUser.verificationStatus === 'VERIFIED' ? 'Already Verified' : 'Approve Verification'}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-400 text-sm">
              Select a customer from the queue to review documents.
            </div>
          )}
        </div>
      </main>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h4 className="font-bold text-slate-900 text-base">Reject Customer Verification</h4>
            <p className="text-xs text-slate-500">Provide a specific reason so the customer can upload valid documents.</p>
            <textarea
              value={rejectionNote}
              onChange={(e) => setRejectionNote(e.target.value)}
              placeholder="e.g. Driving license photo is blurry / expired"
              className="w-full p-3 border border-slate-300 rounded-lg text-sm h-28 focus:outline-none focus:border-rose-500"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowRejectModal(false)}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => handleVerify('REJECTED', rejectionNote)}
                className="px-4 py-2 bg-rose-600 text-white rounded-lg text-sm font-bold"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
