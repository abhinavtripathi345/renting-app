'use client';

import React from 'react';
import { Bell, MapPin, Search } from 'lucide-react';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export default function AdminHeader({ title, subtitle }: HeaderProps) {
  return (
    <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between shadow-sm">
      <div>
        <h2 className="text-xl font-bold text-slate-800">{title}</h2>
        {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-4">
        {/* City Scope Selector */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-lg text-xs text-slate-700 font-medium border border-slate-200">
          <MapPin className="w-3.5 h-3.5 text-emerald-600" />
          <span>Active City: <strong className="text-slate-900">Chandigarh (Demo)</strong></span>
        </div>

        {/* Live Indicator */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-semibold border border-emerald-200">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
          <span>Live API Connected</span>
        </div>
      </div>
    </header>
  );
}
