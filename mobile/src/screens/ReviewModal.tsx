import React, { useState } from 'react';
import { X, Star, MessageSquare, CheckCircle2 } from 'lucide-react';
import { Booking } from '../types';
import { api } from '../api';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking | null;
  onReviewSubmitted: () => void;
}

export default function ReviewModal({
  isOpen,
  onClose,
  booking,
  onReviewSubmitted,
}: ReviewModalProps) {
  const [vehicleRating, setVehicleRating] = useState(5);
  const [providerRating, setProviderRating] = useState(5);
  const [comment, setComment] = useState('Smooth pickup and the Bullet was in pristine running condition. Great experience in Chandigarh!');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !booking) return null;

  const handleSubmit = async () => {
    setSubmitting(true);
    setError('');
    const res = await api.createReview({
      bookingId: booking.id,
      vehicleRating,
      providerRating,
      comment,
    });
    setSubmitting(false);

    if (res.success) {
      onReviewSubmitted();
      onClose();
    } else {
      setError(res.message || 'Failed to submit review');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold">
              <Star className="w-4 h-4 fill-white" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Rate Your Rental Experience</h3>
              <p className="text-xs text-slate-500">{booking.vehicle?.brand} {booking.vehicle?.model}</p>
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

        {/* 1. Vehicle Rating */}
        <div className="space-y-1.5 p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
          <label className="text-xs font-bold text-slate-800 block">
            1. Vehicle Condition & Performance Rating
          </label>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setVehicleRating(star)}
                className="p-1 hover:scale-110 transition-transform"
              >
                <Star
                  className={`w-6 h-6 ${
                    star <= vehicleRating
                      ? 'fill-amber-500 text-amber-500'
                      : 'text-slate-300'
                  }`}
                />
              </button>
            ))}
            <span className="text-xs font-bold text-amber-700 ml-2">{vehicleRating}.0 / 5.0</span>
          </div>
        </div>

        {/* 2. Provider Rating */}
        <div className="space-y-1.5 p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
          <label className="text-xs font-bold text-slate-800 block">
            2. Provider Service & Handover Rating ({booking.provider?.businessName})
          </label>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setProviderRating(star)}
                className="p-1 hover:scale-110 transition-transform"
              >
                <Star
                  className={`w-6 h-6 ${
                    star <= providerRating
                      ? 'fill-amber-500 text-amber-500'
                      : 'text-slate-300'
                  }`}
                />
              </button>
            ))}
            <span className="text-xs font-bold text-amber-700 ml-2">{providerRating}.0 / 5.0</span>
          </div>
        </div>

        {/* Written Review */}
        <div className="space-y-1 text-xs">
          <label className="font-bold text-slate-700">Write Your Feedback</label>
          <textarea
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share details of your rental experience to help future riders..."
            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:outline-none focus:border-emerald-500 text-xs"
          />
        </div>

        <button
          disabled={submitting || !comment.trim()}
          onClick={handleSubmit}
          className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white rounded-2xl text-xs font-bold shadow-md shadow-emerald-900/20"
        >
          {submitting ? 'Submitting Review...' : 'Submit Verified Review'}
        </button>
      </div>
    </div>
  );
}
