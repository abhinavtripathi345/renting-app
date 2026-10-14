'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FileCheck,
  Building2,
  Bike,
  CalendarCheck,
  AlertTriangle,
  Star,
  Settings,
  ShieldCheck,
} from 'lucide-react';

const navItems = [
  { name: 'Overview', href: '/', icon: LayoutDashboard },
  { name: 'User Verifications', href: '/verifications', icon: FileCheck },
  { name: 'Rental Providers', href: '/providers', icon: Building2 },
  { name: 'Vehicle Fleet', href: '/vehicles', icon: Bike },
  { name: 'All Bookings', href: '/bookings', icon: CalendarCheck },
  { name: 'Disputes Center', href: '/disputes', icon: AlertTriangle },
  { name: 'Reviews Moderation', href: '/reviews', icon: Star },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-slate-900 text-slate-200 min-h-screen flex flex-col border-r border-slate-800 shadow-xl">
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-800 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/30">
          <Bike className="w-6 h-6" />
        </div>
        <div>
          <h1 className="font-bold text-lg text-white tracking-tight">Renting App</h1>
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Admin Control</span>
          </div>
        </div>
      </div>

      {/* City Indicator */}
      <div className="mx-4 my-3 px-3 py-2 bg-slate-800/80 rounded-lg border border-slate-700/60 flex items-center justify-between text-xs">
        <span className="text-slate-400">Marketplace City:</span>
        <span className="font-semibold text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded">Chandigarh</span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/40'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Admin User Footer */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/40 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm">
            SA
          </div>
          <div>
            <p className="text-xs font-semibold text-white">System Admin</p>
            <p className="text-[11px] text-slate-400">+91 98765 00000</p>
          </div>
        </div>
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
      </div>
    </aside>
  );
}
