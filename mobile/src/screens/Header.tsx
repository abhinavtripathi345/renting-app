import React from 'react';
import { MapPin, User as UserIcon, ShieldCheck, ShieldAlert, LogOut, ChevronDown, Sparkles } from 'lucide-react';
import { User } from '../types';

interface HeaderProps {
  user: User | null;
  activeCity: string;
  onCityChange: (city: string) => void;
  onOpenAuth: () => void;
  onLogout: () => void;
  onOpenVerification: () => void;
}

export default function Header({
  user,
  activeCity,
  onCityChange,
  onOpenAuth,
  onLogout,
  onOpenVerification,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 py-3">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        {/* Brand Logo & Tagline */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white font-black text-xl shadow-md shadow-emerald-600/20">
            R
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-slate-900 tracking-tight text-lg">Renting<span className="text-emerald-600">App</span></span>
              <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 rounded-md">MVP</span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium hidden sm:block">City Vehicle Rental Marketplace</p>
          </div>
        </div>

        {/* City Picker & User Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* City Selection */}
          <div className="relative flex items-center bg-slate-100 hover:bg-slate-200 rounded-full px-3 py-1.5 transition-colors">
            <MapPin className="w-3.5 h-3.5 text-emerald-600 mr-1.5" />
            <select
              value={activeCity}
              onChange={(e) => onCityChange(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer pr-4 appearance-none"
            >
              <option value="Chandigarh">Chandigarh</option>
              <option value="Mohali" disabled>Mohali (Coming soon)</option>
              <option value="Panchkula" disabled>Panchkula (Coming soon)</option>
            </select>
            <ChevronDown className="w-3 h-3 text-slate-500 absolute right-2.5 pointer-events-none" />
          </div>

          {/* User Auth / Profile Badge */}
          {user ? (
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenVerification}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-bold border transition-all ${
                  user.verificationStatus === 'VERIFIED'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
                    : user.verificationStatus === 'PENDING'
                    ? 'bg-amber-50 text-amber-700 border-amber-300 hover:bg-amber-100'
                    : 'bg-rose-50 text-rose-700 border-rose-300 hover:bg-rose-100'
                }`}
                title="Click to view KYC / One-Time Verification"
              >
                {user.verificationStatus === 'VERIFIED' ? (
                  <>
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="hidden md:inline">KYC Verified</span>
                  </>
                ) : user.verificationStatus === 'PENDING' ? (
                  <>
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                    <span className="hidden md:inline">KYC Pending</span>
                  </>
                ) : (
                  <>
                    <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                    <span className="hidden md:inline">Verify KYC</span>
                  </>
                )}
              </button>

              <div className="flex items-center gap-1.5 bg-slate-100 rounded-full pl-2 pr-1.5 py-1">
                <span className="text-xs font-semibold text-slate-700 max-w-[100px] truncate">
                  {user.fullName.split(' ')[0]}
                </span>
                <button
                  onClick={onLogout}
                  className="p-1 text-slate-400 hover:text-rose-600 rounded-full hover:bg-white transition-colors"
                  title="Sign out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-1.5 rounded-full text-xs font-bold shadow-sm shadow-emerald-900/20 transition-all active:scale-95"
            >
              <UserIcon className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
