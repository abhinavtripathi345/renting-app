import React, { useState, useEffect } from 'react';
import { X, FileText, CheckCircle2, ShieldCheck, PenTool, Lock } from 'lucide-react';
import { Booking } from '../types';
import { api } from '../api';

interface AgreementModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking | null;
}

export default function AgreementModal({ isOpen, onClose, booking }: AgreementModalProps) {
  const [agreement, setAgreement] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [signing, setSigning] = useState(false);
  const [signatureName, setSignatureName] = useState('');

  useEffect(() => {
    if (isOpen && booking?.id) {
      setLoading(true);
      api.getRentalAgreement(booking.id).then((res) => {
        setLoading(false);
        if (res.success && res.agreement) {
          setAgreement(res.agreement);
        }
      });
    }
  }, [isOpen, booking?.id]);

  if (!isOpen || !booking) return null;

  const handleSignAgreement = async () => {
    if (!signatureName.trim()) return;
    setSigning(true);
    const res = await api.signAgreement(booking.id, `Digitally signed by ${signatureName}`);
    setSigning(false);
    if (res.success && res.agreement) {
      setAgreement(res.agreement);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white rounded-3xl max-w-xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">Digital Rental Agreement</h3>
              <p className="text-xs text-slate-500">Booking #{booking.bookingNumber}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {loading ? (
            <div className="h-60 bg-slate-100 rounded-2xl animate-pulse" />
          ) : (
            <>
              {/* Status Header */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-400 block font-mono text-[10px]">AGREEMENT NUMBER</span>
                  <span className="font-black text-slate-800">{agreement?.agreementNumber || `AGR-${booking.bookingNumber}`}</span>
                </div>
                {agreement?.signedAtCustomer ? (
                  <div className="flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 font-bold">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Digitally Signed</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200 font-bold">
                    <span>Signature Pending</span>
                  </div>
                )}
              </div>

              {/* Agreement Text terms */}
              <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200 text-xs text-slate-700 font-mono leading-relaxed max-h-72 overflow-y-auto whitespace-pre-wrap">
                {agreement?.termsText || `DIGITAL VEHICLE RENTAL AGREEMENT
Platform: Renting App Chandigarh
Booking ID: ${booking.bookingNumber}

1. PARTIES
Customer: ${booking.customer?.fullName || 'Verified Customer'}
Rental Provider: ${booking.provider?.businessName} (${booking.provider?.providerType})
Vehicle: ${booking.vehicle?.brand} ${booking.vehicle?.model} (Reg: ${booking.vehicle?.registrationNumber || 'CH01-BK-9921'})

2. RENTAL PERIOD & FINANCIALS
Start: ${new Date(booking.startDate).toLocaleString()}
End: ${new Date(booking.endDate).toLocaleString()}
Rental Fee: ₹${booking.rentalAmount}
Refundable Security Deposit: ₹${booking.securityDeposit}
Convenience Fee: ₹${booking.platformFee}

3. TERMS & CONDITIONS
- Fuel Policy: ${booking.vehicle?.fuelPolicy || 'SAME_TO_SAME'}. The vehicle must be returned with identical fuel levels.
- Mileage Policy: ${booking.vehicle?.mileageLimitKmPerDay || 150} km/day allowance. Extra distance is billed at ₹${booking.vehicle?.excessKmCharge || 5}/km.
- Security Deposit: Refundable upon safe return subject to vehicle condition inspection and zero unpaid traffic violations.
- Damages: Any new damages incurred during rental period will be assessed in the Condition Report.
- Valid License: Customer confirms possession of an active and valid Indian Driving License.`}
              </div>

              {/* Signature Section */}
              {agreement?.signedAtCustomer ? (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-1 text-xs text-emerald-900">
                  <div className="flex items-center gap-1.5 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Verified Customer Signature Recorded</span>
                  </div>
                  <p className="text-[11px] text-emerald-700 font-mono">
                    Hash: {agreement.digitalSignatureHash || 'SHA256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069'}
                  </p>
                  <p className="text-[11px] text-emerald-600">
                    Signed at: {new Date(agreement.signedAtCustomer).toLocaleString()}
                  </p>
                </div>
              ) : (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-slate-800">
                    <PenTool className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Sign Digital Agreement</span>
                  </div>
                  <input
                    type="text"
                    value={signatureName}
                    onChange={(e) => setSignatureName(e.target.value)}
                    placeholder="Type your full legal name to sign..."
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    disabled={signing || !signatureName.trim()}
                    onClick={handleSignAgreement}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-900/20"
                  >
                    {signing ? 'Signing Agreement...' : 'Confirm & Digitally Sign Agreement'}
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-100 bg-slate-50 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold"
          >
            Close Agreement
          </button>
        </div>
      </div>
    </div>
  );
}
