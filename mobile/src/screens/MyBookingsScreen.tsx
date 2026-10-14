import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  Shield,
  FileText,
  Camera,
  Star,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Sparkles,
  MapPin,
  ChevronRight,
  RefreshCw,
} from 'lucide-react';
import { Booking, User } from '../types';
import { api } from '../api';

interface MyBookingsScreenProps {
  bookings: Booking[];
  loading: boolean;
  onRefresh: () => void;
  user: User | null;
  onOpenAuth: () => void;
  onViewAgreement: (booking: Booking) => void;
  onViewConditionReport: (booking: Booking) => void;
  onOpenDispute: (booking: Booking) => void;
  onOpenReview: (booking: Booking) => void;
}

export default function MyBookingsScreen({
  bookings,
  loading,
  onRefresh,
  user,
  onOpenAuth,
  onViewAgreement,
  onViewConditionReport,
  onOpenDispute,
  onOpenReview,
}: MyBookingsScreenProps) {
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  if (!user) {
    return (
      <div className="bg-white rounded-3xl p-8 border border-slate-200 text-center space-y-4 shadow-sm my-4">
        <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
          <Calendar className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-slate-900">Manage Your Vehicle Rentals</h3>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            Sign in to view your active bookings, inspect digital rental agreements, and check vehicle handover condition reports.
          </p>
        </div>
        <button
          onClick={onOpenAuth}
          className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-xs shadow-md shadow-emerald-900/20"
        >
          Sign In / View Bookings
        </button>
      </div>
    );
  }

  const filteredBookings = bookings.filter((b) => {
    if (filterStatus === 'ALL') return true;
    return b.status === filterStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-50 text-blue-700 border border-blue-200">CONFIRMED</span>;
      case 'ACTIVE':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-300 animate-pulse">ACTIVE RENTAL</span>;
      case 'COMPLETED':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-slate-100 text-slate-700 border border-slate-200">COMPLETED</span>;
      case 'CANCELLED':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-50 text-rose-700 border border-rose-200">CANCELLED</span>;
      case 'DISPUTED':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-50 text-amber-800 border border-amber-300">DISPUTED</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-slate-100 text-slate-700">{status}</span>;
    }
  };

  return (
    <div className="space-y-4 pb-28">
      {/* Header with Refresh */}
      <div className="flex items-center justify-between px-1">
        <div>
          <h2 className="text-lg font-black text-slate-900">My Bookings & Rentals</h2>
          <p className="text-xs text-slate-500">Track and manage your vehicle rental history</p>
        </div>
        <button
          onClick={onRefresh}
          className="p-2 rounded-full text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
          title="Refresh bookings"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs">
        {['ALL', 'CONFIRMED', 'ACTIVE', 'COMPLETED', 'CANCELLED'].map((st) => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            className={`px-3 py-1.5 rounded-full font-bold transition-all shrink-0 ${
              filterStatus === st
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {st === 'ALL' ? 'All Bookings' : st.charAt(0) + st.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {/* Bookings List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2].map((n) => (
            <div key={n} className="h-44 bg-slate-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="bg-white rounded-3xl p-8 border border-slate-200 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Calendar className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-800 text-sm">No bookings in this category</h3>
          <p className="text-xs text-slate-500">Explore bikes and scooters in Chandigarh to make a booking.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((b) => {
            const startDateFormatted = new Date(b.startDate).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            });
            const endDateFormatted = new Date(b.endDate).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            });

            return (
              <div
                key={b.id}
                className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition-all space-y-3"
              >
                {/* Booking Number & Status Badge */}
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-xs text-slate-900">
                      #{b.bookingNumber}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded">
                      {b.bookingSource === 'ONSITE' ? '🏬 On-Site' : '🚀 Online'}
                    </span>
                  </div>
                  {getStatusBadge(b.status)}
                </div>

                {/* Vehicle & Provider Row */}
                <div className="flex gap-3">
                  <div className="w-20 h-16 bg-slate-100 rounded-xl overflow-hidden shrink-0">
                    <img
                      src={b.vehicle?.images?.[0]?.imageUrl || 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=500&q=80'}
                      alt={b.vehicle?.model || 'Vehicle'}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0 space-y-0.5">
                    <h3 className="font-bold text-slate-900 text-sm truncate">
                      {b.vehicle?.brand} {b.vehicle?.model}
                    </h3>
                    <p className="text-xs text-slate-600">
                      Provider: <strong>{b.provider?.businessName}</strong>
                    </p>
                    <p className="text-[11px] text-slate-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>{b.vehicle?.pickupAddress || 'Chandigarh Hub'}</span>
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs text-slate-400 block">Total Paid</span>
                    <span className="text-base font-black text-emerald-600">₹{b.totalAmount}</span>
                    <span className="text-[10px] text-slate-500 block">₹{b.securityDeposit} deposit</span>
                  </div>
                </div>

                {/* Dates & Schedule */}
                <div className="bg-slate-50 p-2.5 rounded-xl text-xs flex items-center justify-between text-slate-700">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span><strong>{startDateFormatted}</strong> to <strong>{endDateFormatted}</strong></span>
                  </div>
                  <span className="font-bold text-slate-500 text-[11px]">{b.totalDays} Day{b.totalDays > 1 ? 's' : ''}</span>
                </div>

                {/* Action Buttons Matrix */}
                <div className="pt-1 flex flex-wrap gap-2 text-xs">
                  {/* Digital Agreement */}
                  <button
                    onClick={() => onViewAgreement(b)}
                    className="flex-1 min-w-[120px] py-2 px-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5 text-blue-600" />
                    <span>Rental Agreement</span>
                  </button>

                  {/* Condition Report */}
                  <button
                    onClick={() => onViewConditionReport(b)}
                    className="flex-1 min-w-[120px] py-2 px-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Camera className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Condition Proofs</span>
                  </button>

                  {/* Review Button (if completed and not reviewed) */}
                  {b.status === 'COMPLETED' && !b.review && (
                    <button
                      onClick={() => onOpenReview(b)}
                      className="py-2 px-3 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 rounded-xl font-bold flex items-center gap-1 transition-colors"
                    >
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      <span>Write Review</span>
                    </button>
                  )}

                  {/* Review Badge (if already reviewed) */}
                  {b.review && (
                    <div className="py-1.5 px-2 bg-emerald-50 text-emerald-700 rounded-xl text-[11px] font-bold flex items-center gap-1 border border-emerald-200">
                      <Star className="w-3 h-3 fill-emerald-600 text-emerald-600" />
                      <span>Reviewed ({b.review.vehicleRating}⭐)</span>
                    </div>
                  )}

                  {/* Dispute Action */}
                  {b.status !== 'CANCELLED' && (
                    <button
                      onClick={() => onOpenDispute(b)}
                      className="py-2 px-2.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl font-bold flex items-center gap-1 transition-colors text-[11px]"
                      title="Report issue / Raise dispute"
                    >
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                      <span>Dispute</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
