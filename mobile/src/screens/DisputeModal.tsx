import React, { useState } from 'react';
import { X, AlertTriangle, ShieldAlert } from 'lucide-react';
import { Booking } from '../types';
import { api } from '../api';

interface DisputeModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking | null;
  onDisputeCreated: () => void;
}

export default function DisputeModal({
  isOpen,
  onClose,
  booking,
  onDisputeCreated,
}: DisputeModalProps) {
  const [title, setTitle] = useState('Security Deposit Refund Discrepancy');
  const [description, setDescription] = useState(
    'Returned vehicle in clean undamaged state on time, but provider has not released security deposit.',
  );
  const [claimAmount, setClaimAmount] = useState(booking?.securityDeposit ? String(booking.securityDeposit) : '1500');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !booking) return null;

  const handleSubmit = async () => {
    setSubmitting(true);
    setError('');
    const res = await api.createDispute({
      bookingId: booking.id,
      title,
      description,
      claimAmount: parseFloat(claimAmount) || 0,
      evidencePhotosJson: JSON.stringify([
        'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=500&q=80',
      ]),
    });
    setSubmitting(false);

    if (res.success) {
      onDisputeCreated();
      onClose();
    } else {
      setError(res.message || 'Failed to submit dispute');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-rose-500 text-white flex items-center justify-center font-bold">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">File a Rental Dispute</h3>
              <p className="text-xs text-slate-500">Booking #{booking.bookingNumber}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:bg-slate-100 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
            {error}
          </div>
        )}

        <div className="space-y-3 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Dispute Subject</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus:outline-none focus:border-rose-500"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Claimed Refund Amount (₹)</label>
            <input
              type="number"
              value={claimAmount}
              onChange={(e) => setClaimAmount(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900 focus:outline-none focus:border-rose-500"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Detailed Explanation & Evidence Summary</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:border-rose-500 text-xs"
            />
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2 text-slate-600 text-[11px]">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Admin team reviews condition reports, rental agreement, and evidence to resolve disputes.</span>
          </div>
        </div>

        <button
          disabled={submitting || !title.trim() || !description.trim()}
          onClick={handleSubmit}
          className="w-full py-3 bg-rose-600 hover:bg-rose-700 disabled:bg-slate-300 text-white rounded-2xl text-xs font-bold shadow-md shadow-rose-900/20"
        >
          {submitting ? 'Submitting Dispute...' : 'Submit Dispute to Admin'}
        </button>
      </div>
    </div>
  );
}
