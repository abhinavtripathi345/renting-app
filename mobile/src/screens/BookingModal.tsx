import React, { useState, useEffect } from 'react';
import {
  X,
  Calendar,
  Clock,
  ShieldCheck,
  CreditCard,
  AlertCircle,
  Sparkles,
  CheckCircle2,
  Lock,
  ArrowRight,
} from 'lucide-react';
import { Vehicle, User, Booking } from '../types';
import { api } from '../api';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: Vehicle | null;
  user: User | null;
  onOpenAuth: () => void;
  onOpenVerification: () => void;
  initialStartDate?: string;
  initialEndDate?: string;
  onBookingConfirmed: (booking: Booking) => void;
}

export default function BookingModal({
  isOpen,
  onClose,
  vehicle,
  user,
  onOpenAuth,
  onOpenVerification,
  initialStartDate,
  initialEndDate,
  onBookingConfirmed,
}: BookingModalProps) {
  const [startDate, setStartDate] = useState(
    initialStartDate || new Date(Date.now() + 86400000).toISOString().slice(0, 10),
  );
  const [endDate, setEndDate] = useState(
    initialEndDate || new Date(Date.now() + 259200000).toISOString().slice(0, 10),
  );
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('10:00');
  const [bookingSource, setBookingSource] = useState<'ONLINE' | 'ONSITE'>('ONLINE');

  const [calculating, setCalculating] = useState(false);
  const [priceBreakdown, setPriceBreakdown] = useState<any>(null);
  const [availabilityError, setAvailabilityError] = useState<string>('');

  const [bookingStep, setBookingStep] = useState<'DETAILS' | 'PAYMENT' | 'SUCCESS'>('DETAILS');
  const [processingPayment, setProcessingPayment] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  useEffect(() => {
    if (isOpen && vehicle) {
      calculatePrice();
      setBookingStep('DETAILS');
      setConfirmedBooking(null);
    }
  }, [isOpen, vehicle?.id, startDate, endDate, startTime, endTime]);

  const calculatePrice = async () => {
    if (!vehicle) return;
    setCalculating(true);
    setAvailabilityError('');

    const startIso = `${startDate}T${startTime}:00.000Z`;
    const endIso = `${endDate}T${endTime}:00.000Z`;

    const res = await api.calculatePrice(vehicle.id, startIso, endIso);
    setCalculating(false);

    if (res.success) {
      setPriceBreakdown(res.breakdown);
      if (!res.isAvailable) {
        setAvailabilityError(res.message || 'Vehicle is already booked for these dates.');
      }
    } else {
      setAvailabilityError(res.message || 'Could not calculate price.');
      setPriceBreakdown(null);
    }
  };

  const handleProceedToPayment = () => {
    if (!user) {
      onOpenAuth();
      return;
    }
    if (user.verificationStatus !== 'VERIFIED') {
      onOpenVerification();
      return;
    }
    setBookingStep('PAYMENT');
  };

  const handleSimulatePayment = async () => {
    if (!vehicle || !user || !priceBreakdown) return;
    setProcessingPayment(true);
    setAvailabilityError('');

    const startIso = `${startDate}T${startTime}:00.000Z`;
    const endIso = `${endDate}T${endTime}:00.000Z`;

    const res = await api.createBooking({
      vehicleId: vehicle.id,
      startDate: startIso,
      endDate: endIso,
      bookingSource,
    });

    setProcessingPayment(false);

    if (res.success && res.booking) {
      setConfirmedBooking(res.booking);
      setBookingStep('SUCCESS');
      onBookingConfirmed(res.booking);
    } else {
      setAvailabilityError(res.message || 'Booking creation failed. Please try again.');
      setBookingStep('DETAILS');
    }
  };

  if (!isOpen || !vehicle) return null;

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="font-extrabold text-slate-900 text-base">
              {bookingStep === 'SUCCESS' ? 'Booking Confirmed!' : 'Vehicle Booking Checkout'}
            </h3>
            <p className="text-xs text-slate-500">{vehicle.brand} {vehicle.model} • {vehicle.city?.name || 'Chandigarh'}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {bookingStep === 'DETAILS' && (
            <>
              {/* Vehicle Summary Banner */}
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="w-16 h-14 bg-slate-100 rounded-xl overflow-hidden shrink-0">
                  <img
                    src={vehicle.images?.[0]?.imageUrl || 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=500&q=80'}
                    alt={vehicle.model}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-slate-900 text-sm">{vehicle.brand} {vehicle.model}</div>
                  <div className="text-xs text-slate-500">
                    Provider: <strong className="text-slate-700">{vehicle.provider?.businessName}</strong>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-black text-emerald-600">₹{vehicle.pricePerDay}/day</div>
                  <div className="text-[10px] text-slate-400">₹{vehicle.securityDeposit} deposit</div>
                </div>
              </div>

              {/* Experience Mode: Online vs On-Site */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Booking Experience Mode</label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    onClick={() => setBookingSource('ONLINE')}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      bookingSource === 'ONLINE'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span className="block font-bold">🚀 Online Instant</span>
                    <span className="text-[10px] text-slate-500 font-normal">Reserve & pay directly online</span>
                  </button>

                  <button
                    onClick={() => setBookingSource('ONSITE')}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      bookingSource === 'ONSITE'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span className="block font-bold">🏬 On-Site Inspection</span>
                    <span className="text-[10px] text-slate-500 font-normal">Inspect vehicle at hub before paying</span>
                  </button>
                </div>
              </div>

              {/* Rental Dates & Times */}
              <div className="space-y-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Select Rental Schedule</span>
                </h4>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  {/* Start */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Pickup</label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full p-2 bg-white border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none"
                    />
                    <input
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="w-full p-1.5 bg-white border border-slate-200 rounded-xl font-medium text-slate-700 text-center"
                    />
                  </div>

                  {/* End */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Dropoff</label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full p-2 bg-white border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none"
                    />
                    <input
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="w-full p-1.5 bg-white border border-slate-200 rounded-xl font-medium text-slate-700 text-center"
                    />
                  </div>
                </div>
              </div>

              {/* Server Availability Error */}
              {availabilityError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-2 text-rose-800 text-xs">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block">Vehicle Unavailable:</span>
                    <span>{availabilityError}</span>
                  </div>
                </div>
              )}

              {/* Transparent Price Breakdown */}
              {priceBreakdown && (
                <div className="space-y-2.5 p-4 bg-emerald-50/50 rounded-2xl border border-emerald-200">
                  <div className="flex items-center justify-between text-xs font-bold text-emerald-950 pb-2 border-b border-emerald-200/60">
                    <span>Transparent Price Breakdown</span>
                    <span className="text-[11px] font-semibold text-emerald-700">
                      {priceBreakdown.totalDays} Day{priceBreakdown.totalDays > 1 ? 's' : ''} ({priceBreakdown.totalHours} hrs)
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-700">
                    <div className="flex justify-between">
                      <span>Vehicle Rental Cost (₹{vehicle.pricePerDay} × {priceBreakdown.totalDays}d)</span>
                      <span className="font-bold text-slate-900">₹{priceBreakdown.rentalAmount}</span>
                    </div>

                    <div className="flex justify-between text-emerald-900 font-medium">
                      <span className="flex items-center gap-1">
                        <span>Refundable Security Deposit</span>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1 rounded">100% Refundable</span>
                      </span>
                      <span className="font-bold">₹{priceBreakdown.securityDeposit}</span>
                    </div>

                    <div className="flex justify-between text-slate-600">
                      <span>Platform Convenience Fee</span>
                      <span className="font-bold">₹{priceBreakdown.platformFee}</span>
                    </div>

                    <div className="flex justify-between text-slate-500 text-[11px]">
                      <span>Other Applicable Charges</span>
                      <span>₹0</span>
                    </div>

                    <div className="pt-2 border-t border-emerald-200 flex justify-between items-baseline text-slate-950 font-black">
                      <span className="text-sm">Total Payable Now</span>
                      <span className="text-lg text-emerald-700">₹{priceBreakdown.totalAmount}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* User Verification / Auth Status */}
              {!user ? (
                <div className="p-3 bg-slate-100 rounded-2xl flex items-center justify-between text-xs">
                  <span className="text-slate-600 font-medium">Sign in to complete your booking</span>
                  <button
                    onClick={onOpenAuth}
                    className="px-3 py-1.5 bg-emerald-600 text-white font-bold rounded-xl"
                  >
                    Sign In
                  </button>
                </div>
              ) : user.verificationStatus !== 'VERIFIED' ? (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between text-xs">
                  <div className="space-y-0.5">
                    <span className="font-bold text-amber-900 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                      <span>One-Time KYC Required</span>
                    </span>
                    <span className="text-[11px] text-amber-700 block">Upload Driving License once to rent</span>
                  </div>
                  <button
                    onClick={onOpenVerification}
                    className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs shrink-0"
                  >
                    Complete KYC
                  </button>
                </div>
              ) : (
                <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center gap-2 text-xs text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span><strong>{user.fullName}</strong> — Reusable Driving License KYC is Active & Verified!</span>
                </div>
              )}
            </>
          )}

          {/* Step 2: Payment Sandbox Checkout */}
          {bookingStep === 'PAYMENT' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase">Razorpay Sandbox Checkout</span>
                  <span className="text-xs px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded font-mono font-bold">
                    TEST MODE
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="text-xs text-slate-400">Total Booking Amount:</div>
                  <div className="text-2xl font-black text-emerald-400">₹{priceBreakdown?.totalAmount}</div>
                  <div className="text-[11px] text-slate-400">
                    Includes ₹{priceBreakdown?.rentalAmount} Rent + ₹{priceBreakdown?.securityDeposit} Refundable Deposit
                  </div>
                </div>
              </div>

              {/* Payment Mock Card Details */}
              <div className="space-y-2 text-xs p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="flex items-center gap-2 font-bold text-slate-800 mb-2">
                  <CreditCard className="w-4 h-4 text-emerald-600" />
                  <span>Mock UPI / Card Sandbox</span>
                </div>
                <div className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 font-mono text-[11px]">
                  UPI ID: <span className="font-bold text-slate-900">sandbox@razorpay</span> (Pre-approved test gateway)
                </div>
                <p className="text-[11px] text-slate-500">
                  This simulates instant webhook verification and creates your confirmed booking record in the database.
                </p>
              </div>

              <div className="p-3 bg-blue-50 text-blue-800 rounded-xl text-xs flex items-center gap-2">
                <Lock className="w-4 h-4 text-blue-600 shrink-0" />
                <span>256-bit SSL encrypted test payment transaction</span>
              </div>
            </div>
          )}

          {/* Step 3: Success Confirmation */}
          {bookingStep === 'SUCCESS' && confirmedBooking && (
            <div className="text-center space-y-4 py-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-extrabold text-slate-900">Booking Confirmed!</h3>
                <p className="text-xs text-slate-500">Your vehicle has been successfully reserved in Chandigarh.</p>
                <div className="inline-block mt-2 px-3 py-1 bg-slate-100 text-slate-800 font-mono font-bold text-xs rounded-full border border-slate-200">
                  Booking #{confirmedBooking.bookingNumber}
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-left text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Vehicle:</span>
                  <span className="font-bold text-slate-900">{vehicle.brand} {vehicle.model}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Pickup Location:</span>
                  <span className="font-bold text-slate-900">{vehicle.pickupAddress}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Total Paid:</span>
                  <span className="font-bold text-emerald-700">₹{confirmedBooking.totalAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Status:</span>
                  <span className="font-bold text-emerald-600 uppercase">{confirmedBooking.status}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3">
          {bookingStep === 'DETAILS' && (
            <button
              disabled={calculating || Boolean(availabilityError) || !priceBreakdown}
              onClick={handleProceedToPayment}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-extrabold text-sm rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/20 active:scale-98 transition-all"
            >
              <span>{calculating ? 'Checking Availability...' : `Continue to Pay (₹${priceBreakdown?.totalAmount || '...'})`}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          {bookingStep === 'PAYMENT' && (
            <div className="flex gap-2 w-full">
              <button
                disabled={processingPayment}
                onClick={() => setBookingStep('DETAILS')}
                className="py-3 px-4 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-2xl"
              >
                Back
              </button>
              <button
                disabled={processingPayment}
                onClick={handleSimulatePayment}
                className="flex-1 py-3.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-400 text-white font-black text-sm rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/20 active:scale-98 transition-all"
              >
                <span>{processingPayment ? 'Processing Payment...' : `Pay ₹${priceBreakdown?.totalAmount} (Sandbox)`}</span>
                <Lock className="w-4 h-4" />
              </button>
            </div>
          )}

          {bookingStep === 'SUCCESS' && (
            <button
              onClick={onClose}
              className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-2xl"
            >
              View in My Bookings
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
