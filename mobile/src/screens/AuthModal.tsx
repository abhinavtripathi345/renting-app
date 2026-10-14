import React, { useState } from 'react';
import { Phone, ShieldCheck, X, Sparkles, UserCheck, Building2, ShieldAlert } from 'lucide-react';
import { api } from '../api';
import { User } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
}

export default function AuthModal({ isOpen, onClose, onLoginSuccess }: AuthModalProps) {
  const [phone, setPhone] = useState('+919876543210');
  const [otp, setOtp] = useState('123456');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSendOtp = async () => {
    setLoading(true);
    setError('');
    const res = await api.sendOtp(phone);
    setLoading(false);
    if (res.success) {
      setOtpSent(true);
    } else {
      setError(res.message || 'Failed to send OTP');
    }
  };

  const handleVerifyOtp = async () => {
    setLoading(true);
    setError('');
    const res = await api.verifyOtp(phone, otp);
    setLoading(false);
    if (res.success && res.user) {
      localStorage.setItem('renting_mobile_token', res.accessToken);
      localStorage.setItem('renting_mobile_user', JSON.stringify(res.user));
      onLoginSuccess(res.user);
      onClose();
    } else {
      setError(res.message || 'Invalid OTP');
    }
  };

  const handleQuickLogin = async (role: string) => {
    setLoading(true);
    setError('');
    const res = await api.quickLogin(role);
    setLoading(false);
    if (res.success && res.user) {
      localStorage.setItem('renting_mobile_token', res.accessToken);
      localStorage.setItem('renting_mobile_user', JSON.stringify(res.user));
      onLoginSuccess(res.user);
      onClose();
    } else {
      setError(res.message || 'Quick login failed');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold">
              R
            </div>
            <h3 className="font-bold text-slate-900 text-base">Account Sign In</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-2.5 bg-rose-50 text-rose-700 text-xs rounded-xl border border-rose-200">
            {error}
          </div>
        )}

        {/* Phone OTP Form */}
        <div className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-slate-600 block mb-1">Phone Number</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {otpSent ? (
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">Enter 6-Digit OTP</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="123456"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono tracking-widest text-center font-bold focus:outline-none focus:border-emerald-500"
              />
              <p className="text-[11px] text-slate-400 mt-1 text-center">Dev mock OTP: <strong>123456</strong></p>
              <button
                disabled={loading}
                onClick={handleVerifyOtp}
                className="w-full mt-3 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold shadow-md shadow-emerald-900/20"
              >
                {loading ? 'Verifying...' : 'Verify & Continue'}
              </button>
            </div>
          ) : (
            <button
              disabled={loading}
              onClick={handleSendOtp}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold shadow-md shadow-emerald-900/20"
            >
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          )}
        </div>

        {/* Quick Demo Role Switcher */}
        <div className="pt-3 border-t border-slate-100">
          <div className="flex items-center gap-1 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>1-Click Demo Accounts</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => handleQuickLogin('CUSTOMER_VERIFIED')}
              className="p-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl border border-emerald-200 text-left font-medium transition-all"
            >
              <p className="font-bold flex items-center gap-1">
                <UserCheck className="w-3 h-3 text-emerald-600" />
                <span>Aarav (Verified)</span>
              </p>
              <p className="text-[10px] text-emerald-600">Customer with approved DL</p>
            </button>

            <button
              onClick={() => handleQuickLogin('CUSTOMER_PENDING')}
              className="p-2.5 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-xl border border-amber-200 text-left font-medium transition-all"
            >
              <p className="font-bold flex items-center gap-1">
                <Phone className="w-3 h-3 text-amber-600" />
                <span>Pooja (Pending)</span>
              </p>
              <p className="text-[10px] text-amber-600">KYC verification pending</p>
            </button>

            <button
              onClick={() => handleQuickLogin('AGENCY')}
              className="p-2.5 bg-blue-50 hover:bg-blue-100 text-blue-800 rounded-xl border border-blue-200 text-left font-medium transition-all"
            >
              <p className="font-bold flex items-center gap-1">
                <Building2 className="w-3 h-3 text-blue-600" />
                <span>Chandigarh Rentals</span>
              </p>
              <p className="text-[10px] text-blue-600">Rental Agency Partner</p>
            </button>

            <button
              onClick={() => handleQuickLogin('OWNER')}
              className="p-2.5 bg-purple-50 hover:bg-purple-100 text-purple-800 rounded-xl border border-purple-200 text-left font-medium transition-all"
            >
              <p className="font-bold flex items-center gap-1">
                <UserCheck className="w-3 h-3 text-purple-600" />
                <span>Rajesh Sharma</span>
              </p>
              <p className="text-[10px] text-purple-600">Individual Bike Owner</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
