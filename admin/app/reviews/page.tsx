'use client';

import React, { useEffect, useState } from 'react';
import { Star, ShieldCheck, MessageSquare, Bike, User } from 'lucide-react';
import AdminHeader from '../../components/AdminHeader';
import { fetchAdminApi, adminLogin } from '../../lib/api';

export default function ReviewsAdminPage() {
  const [vehicles, setVehicles] = useState<any[]>([]);

  useEffect(() => {
    async function loadReviews() {
      await adminLogin();
      const res = await fetchAdminApi('/vehicles');
      if (res.success) {
        setVehicles(res.vehicles);
      }
    }
    loadReviews();
  }, []);

  return (
    <div className="flex-1 flex flex-col">
      <AdminHeader
        title="Customer Reviews & Ratings Moderation"
        subtitle="Audited dual-rating system (separate Vehicle vs Provider scores)"
      />

      <main className="p-8 flex-1 overflow-y-auto space-y-6">
        <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <span>
              <strong>Verified Bookings Only:</strong> Reviews on Renting App can only be submitted after a rental booking has reached official <strong>COMPLETED</strong> status.
            </span>
          </div>
        </div>

        {/* Reviews Cards List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center text-sm">
                  AV
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Aarav Verma</h4>
                  <p className="text-xs text-slate-400">Rented Royal Enfield Bullet 350</p>
                </div>
              </div>
              <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">RENT-2026-CH001</span>
            </div>

            {/* Dual Rating Badges */}
            <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
              <div>
                <span className="text-slate-500 font-medium block">Vehicle Rating:</span>
                <div className="flex items-center gap-1 font-bold text-amber-500 mt-0.5">
                  <Star className="w-3.5 h-3.5 fill-amber-500" />
                  <span>5.0 / 5.0</span>
                </div>
              </div>
              <div>
                <span className="text-slate-500 font-medium block">Provider Rating:</span>
                <div className="flex items-center gap-1 font-bold text-amber-500 mt-0.5">
                  <Star className="w-3.5 h-3.5 fill-amber-500" />
                  <span>5.0 / 5.0 (Chandigarh Bike Rentals)</span>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed bg-white p-3 rounded border border-slate-100 italic">
              "Outstanding experience! The Bullet 350 ran like butter through Kasauli hills. Fast verification and immediate deposit refund."
            </p>

            <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100 text-slate-400">
              <span>Verified Customer Rental</span>
              <span className="text-emerald-600 font-bold">✓ Published</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
