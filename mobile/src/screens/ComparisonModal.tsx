import React from 'react';
import { X, Layers, Star, ShieldCheck, Check, Sparkles, AlertCircle } from 'lucide-react';
import { Vehicle } from '../types';

interface ComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicles: Vehicle[];
  onBookVehicle: (vehicle: Vehicle) => void;
  onRemoveVehicle: (id: string) => void;
}

export default function ComparisonModal({
  isOpen,
  onClose,
  vehicles,
  onBookVehicle,
  onRemoveVehicle,
}: ComparisonModalProps) {
  if (!isOpen || vehicles.length === 0) return null;

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">Vehicle Comparison Matrix</h3>
              <p className="text-xs text-slate-500">Compare rates, security deposits, and provider trustworthiness</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Matrix Table */}
        <div className="flex-1 overflow-x-auto overflow-y-auto p-4 sm:p-6">
          <table className="w-full text-xs text-left border-collapse min-w-[500px]">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="p-3 font-bold text-slate-400 uppercase tracking-wider w-36 bg-slate-50 rounded-tl-xl">
                  Metric
                </th>
                {vehicles.map((v) => (
                  <th key={v.id} className="p-3 font-bold text-slate-900 text-center relative min-w-[180px]">
                    <button
                      onClick={() => onRemoveVehicle(v.id)}
                      className="absolute top-2 right-2 p-1 text-slate-400 hover:text-rose-600 rounded-full hover:bg-slate-100"
                      title="Remove from comparison"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                    <div className="w-20 h-16 bg-slate-100 rounded-xl overflow-hidden mx-auto mb-2 relative">
                      <img
                        src={v.images?.[0]?.imageUrl || 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=500&q=80'}
                        alt={v.model}
                        className="w-full h-full object-cover"
                      />
                      {v.bestValueScore && v.bestValueScore >= 75 && (
                        <span className="absolute bottom-0 inset-x-0 bg-amber-400 text-slate-950 font-black text-[8px] py-0.5 uppercase tracking-wider">
                          Best Value
                        </span>
                      )}
                    </div>
                    <div className="font-extrabold text-slate-900 text-sm">{v.brand} {v.model}</div>
                    <div className="text-[11px] text-slate-500 font-normal">{v.variant || v.category}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {/* Provider Name */}
              <tr>
                <td className="p-3 font-bold text-slate-600 bg-slate-50">Provider</td>
                {vehicles.map((v) => (
                  <td key={v.id} className="p-3 text-center font-bold text-slate-800">
                    <div>{v.provider?.businessName}</div>
                    <span className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full font-medium inline-block mt-0.5">
                      {v.provider?.providerType === 'AGENCY' ? 'Agency' : 'Individual Owner'}
                    </span>
                  </td>
                ))}
              </tr>

              {/* Price / Day */}
              <tr className="bg-emerald-50/40">
                <td className="p-3 font-bold text-emerald-950 bg-emerald-100/60">Price / Day</td>
                {vehicles.map((v) => (
                  <td key={v.id} className="p-3 text-center">
                    <span className="text-base font-black text-emerald-700">₹{v.pricePerDay}</span>
                    <span className="text-[10px] text-slate-400 block">per 24 hrs</span>
                  </td>
                ))}
              </tr>

              {/* Security Deposit */}
              <tr>
                <td className="p-3 font-bold text-slate-600 bg-slate-50">Security Deposit</td>
                {vehicles.map((v) => (
                  <td key={v.id} className="p-3 text-center font-extrabold text-slate-800">
                    ₹{v.securityDeposit}
                    <span className="text-[10px] text-slate-400 block font-normal">Refundable</span>
                  </td>
                ))}
              </tr>

              {/* Rating */}
              <tr>
                <td className="p-3 font-bold text-slate-600 bg-slate-50">Customer Rating</td>
                {vehicles.map((v) => (
                  <td key={v.id} className="p-3 text-center">
                    <div className="inline-flex items-center gap-1 font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-lg">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      <span>{v.rating.toFixed(1)} / 5.0</span>
                    </div>
                    <span className="text-[10px] text-slate-400 block mt-0.5">({v.totalReviews} reviews)</span>
                  </td>
                ))}
              </tr>

              {/* Provider Verification */}
              <tr>
                <td className="p-3 font-bold text-slate-600 bg-slate-50">Verified Status</td>
                {vehicles.map((v) => (
                  <td key={v.id} className="p-3 text-center">
                    {v.provider?.status === 'VERIFIED' ? (
                      <span className="inline-flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 px-2 py-1 rounded-md">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        Verified Partner
                      </span>
                    ) : (
                      <span className="text-slate-400 font-medium">Standard</span>
                    )}
                  </td>
                ))}
              </tr>

              {/* Location & Distance */}
              <tr>
                <td className="p-3 font-bold text-slate-600 bg-slate-50">Location / Distance</td>
                {vehicles.map((v) => (
                  <td key={v.id} className="p-3 text-center font-medium text-slate-700">
                    <div>{v.area?.name || 'Sector 17, Chandigarh'}</div>
                    {v.distanceKm && <div className="text-[11px] font-bold text-slate-900">{v.distanceKm} km away</div>}
                  </td>
                ))}
              </tr>

              {/* Mileage & Fuel Policy */}
              <tr>
                <td className="p-3 font-bold text-slate-600 bg-slate-50">Mileage & Fuel</td>
                {vehicles.map((v) => (
                  <td key={v.id} className="p-3 text-center text-[11px] text-slate-600">
                    <div>Limit: <strong>{v.mileageLimitKmPerDay || 150} km/day</strong></div>
                    <div>Excess: ₹{v.excessKmCharge || 5}/km</div>
                    <div className="text-slate-400 mt-0.5">{v.fuelPolicy || 'Same to Same'}</div>
                  </td>
                ))}
              </tr>

              {/* Best Value Score */}
              <tr>
                <td className="p-3 font-bold text-slate-600 bg-slate-50">Value Score</td>
                {vehicles.map((v) => (
                  <td key={v.id} className="p-3 text-center">
                    <span className="font-black text-slate-900 text-sm">
                      {v.bestValueScore ? `${v.bestValueScore}/100` : '85/100'}
                    </span>
                  </td>
                ))}
              </tr>

              {/* Action Book Now Row */}
              <tr>
                <td className="p-3 font-bold text-slate-600 bg-slate-50 rounded-bl-xl">Decision</td>
                {vehicles.map((v) => (
                  <td key={v.id} className="p-3 text-center">
                    <button
                      onClick={() => {
                        onClose();
                        onBookVehicle(v);
                      }}
                      className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-extrabold text-xs shadow-md shadow-emerald-900/20 active:scale-95 transition-all"
                    >
                      Book This Vehicle
                    </button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
