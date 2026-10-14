import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  FileCheck,
  Upload,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  Lock,
} from 'lucide-react';
import { User } from '../types';
import { api } from '../api';

interface VerificationScreenProps {
  user: User | null;
  onOpenAuth: () => void;
  onRefreshUser: () => void;
}

export default function VerificationScreen({
  user,
  onOpenAuth,
  onRefreshUser,
}: VerificationScreenProps) {
  const [dlNo, setDlNo] = useState(user?.drivingLicenseNo || 'CH-01-2022-8765432');
  const [dlExpiry, setDlExpiry] = useState(user?.dlExpiryDate || '2034-12-31');
  const [aadhaarNo, setAadhaarNo] = useState(user?.aadhaarNo || '4567-8901-2345');
  const [address, setAddress] = useState(user?.address || 'House #142, Sector 22-B, Chandigarh');
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (user) {
      if (user.drivingLicenseNo) setDlNo(user.drivingLicenseNo);
      if (user.dlExpiryDate) setDlExpiry(user.dlExpiryDate);
      if (user.aadhaarNo) setAadhaarNo(user.aadhaarNo);
      if (user.address) setAddress(user.address);
    }
  }, [user]);

  if (!user) {
    return (
      <div className="bg-white rounded-3xl p-8 border border-slate-200 text-center space-y-4 shadow-sm my-4">
        <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-slate-900">One-Time Reusable KYC</h3>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            Sign in to upload your Driving License once and rent vehicles across Chandigarh without repeated checks.
          </p>
        </div>
        <button
          onClick={onOpenAuth}
          className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-xs shadow-md shadow-emerald-900/20"
        >
          Sign In to Verify KYC
        </button>
      </div>
    );
  }

  const handleSubmitDocs = async () => {
    setSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');

    const res = await api.submitVerificationDocs({
      drivingLicenseNo: dlNo,
      dlExpiryDate: dlExpiry,
      dlFrontUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&q=80',
      dlBackUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&q=80',
      aadhaarNo,
      address,
    });

    setSubmitting(false);

    if (res.success) {
      setSuccessMsg('KYC documents submitted successfully! Admin team has been notified for review.');
      onRefreshUser();
    } else {
      setErrorMsg(res.message || 'Failed to submit verification documents.');
    }
  };

  return (
    <div className="space-y-5 pb-28">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 p-6 rounded-3xl text-white shadow-xl space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-full text-emerald-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Renting App Reusable Verification</span>
        </div>

        <h2 className="text-xl font-extrabold tracking-tight">One-Time Customer Verification</h2>
        <p className="text-xs text-slate-300 leading-relaxed max-w-md">
          Verify your driving license and identity credentials once. Once approved by our team, you can book bikes & scooters from any rental agency or private owner instantly.
        </p>
      </div>

      {/* Verification Status Card */}
      <div className={`p-4 rounded-2xl border shadow-sm flex items-center justify-between ${
        user.verificationStatus === 'VERIFIED'
          ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
          : user.verificationStatus === 'PENDING'
          ? 'bg-amber-50/80 border-amber-200 text-amber-950'
          : 'bg-rose-50/80 border-rose-200 text-rose-950'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
            user.verificationStatus === 'VERIFIED'
              ? 'bg-emerald-500 text-white'
              : user.verificationStatus === 'PENDING'
              ? 'bg-amber-500 text-white'
              : 'bg-rose-500 text-white'
          }`}>
            {user.verificationStatus === 'VERIFIED' ? (
              <ShieldCheck className="w-5 h-5" />
            ) : user.verificationStatus === 'PENDING' ? (
              <Clock className="w-5 h-5" />
            ) : (
              <ShieldAlert className="w-5 h-5" />
            )}
          </div>
          <div>
            <div className="font-extrabold text-sm">
              Status: {user.verificationStatus === 'VERIFIED' ? 'Verified Rider' : user.verificationStatus === 'PENDING' ? 'Under Admin Review' : 'Documents Required'}
            </div>
            <p className="text-[11px] opacity-80">
              {user.verificationStatus === 'VERIFIED'
                ? 'Your Indian Driving License is active & approved for all rentals.'
                : user.verificationStatus === 'PENDING'
                ? 'Admin verification in progress. Approvals take under 10 minutes.'
                : 'Upload your Driving License details below to activate instant booking.'}
            </p>
          </div>
        </div>
      </div>

      {successMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-2xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* KYC Form */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4 text-xs">
        <h3 className="font-extrabold text-slate-900 text-sm">Identity & Driving License Information</h3>

        <div className="space-y-3">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Full Legal Name</label>
            <input
              type="text"
              disabled
              value={user.fullName}
              className="w-full p-2.5 bg-slate-100 border border-slate-200 rounded-xl font-semibold text-slate-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Indian Driving License (DL) No.</label>
              <input
                type="text"
                value={dlNo}
                onChange={(e) => setDlNo(e.target.value)}
                placeholder="CH-01-2022-XXXXXXX"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">DL Expiry Date</label>
              <input
                type="date"
                value={dlExpiry}
                onChange={(e) => setDlExpiry(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Aadhaar Card No. (Optional)</label>
            <input
              type="text"
              value={aadhaarNo}
              onChange={(e) => setAadhaarNo(e.target.value)}
              placeholder="XXXX-XXXX-XXXX"
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Permanent Residential Address (Chandigarh / Tricity)</label>
            <textarea
              rows={2}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Document Uploads Preview */}
          <div className="space-y-2 pt-1">
            <label className="font-bold text-slate-700 block">Uploaded License Documents</label>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-slate-50 rounded-2xl border border-dashed border-slate-300 text-center space-y-1.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                  <FileCheck className="w-4 h-4" />
                </div>
                <div className="font-bold text-slate-800 text-[11px]">DL Front Side</div>
                <span className="text-[10px] text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded font-semibold inline-block">
                  Document Attached
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-dashed border-slate-300 text-center space-y-1.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                  <FileCheck className="w-4 h-4" />
                </div>
                <div className="font-bold text-slate-800 text-[11px]">DL Back Side</div>
                <span className="text-[10px] text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded font-semibold inline-block">
                  Document Attached
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center gap-2 text-slate-500 text-[11px]">
          <Lock className="w-4 h-4 text-slate-400 shrink-0" />
          <span>Documents are encrypted and strictly protected. Sensitive files are never publicly exposed.</span>
        </div>

        <button
          disabled={submitting || !dlNo.trim()}
          onClick={handleSubmitDocs}
          className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white rounded-2xl text-xs font-bold shadow-md shadow-emerald-900/20 active:scale-98 transition-all"
        >
          {submitting ? 'Submitting Documents...' : user.verificationStatus === 'VERIFIED' ? 'Update & Re-verify KYC' : 'Submit for Admin Verification'}
        </button>
      </div>
    </div>
  );
}
