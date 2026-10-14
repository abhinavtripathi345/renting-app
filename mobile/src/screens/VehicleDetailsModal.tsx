import React, { useState, useEffect } from 'react';
import {
  X,
  Star,
  ShieldCheck,
  MapPin,
  Calendar,
  Fuel,
  Gauge,
  Clock,
  Layers,
  Sparkles,
  Building2,
  UserCheck,
  CheckCircle,
  MessageSquare,
} from 'lucide-react';
import { Vehicle } from '../types';
import { api } from '../api';

interface VehicleDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: Vehicle | null;
  onBookNow: (vehicle: Vehicle) => void;
  onToggleCompare: (vehicleId: string) => void;
  isCompared: boolean;
}

export default function VehicleDetailsModal({
  isOpen,
  onClose,
  vehicle,
  onBookNow,
  onToggleCompare,
  isCompared,
}: VehicleDetailsModalProps) {
  const [reviews, setReviews] = useState<any[]>([]);
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  useEffect(() => {
    if (vehicle?.id) {
      api.getVehicleReviews(vehicle.id).then((res) => {
        if (res.success) setReviews(res.reviews || []);
      });
    }
  }, [vehicle?.id]);

  if (!isOpen || !vehicle) return null;

  const images = vehicle.images && vehicle.images.length > 0
    ? vehicle.images.map(i => i.imageUrl)
    : ['https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800&q=80'];

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header Bar */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
              {vehicle.category}
            </span>
            <h3 className="font-black text-slate-900 text-lg leading-tight mt-0.5">
              {vehicle.brand} {vehicle.model}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Image Gallery Carousel */}
          <div className="space-y-2">
            <div className="h-64 sm:h-72 bg-slate-100 rounded-2xl overflow-hidden relative shadow-inner">
              <img
                src={images[activeImageIdx]}
                alt={vehicle.model}
                className="w-full h-full object-cover"
              />
              {vehicle.bestValueScore && vehicle.bestValueScore >= 75 && (
                <div className="absolute top-3 left-3 px-2.5 py-1 bg-amber-400 text-slate-950 font-black text-xs rounded-lg uppercase tracking-wider shadow-md flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
                  <span>Best Value Offer</span>
                </div>
              )}
            </div>

            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIdx(idx)}
                    className={`w-16 h-14 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                      activeImageIdx === idx ? 'border-emerald-600 ring-2 ring-emerald-500/30' : 'border-transparent opacity-70'
                    }`}
                  >
                    <img src={img} alt="thumb" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick Stats Banner */}
          <div className="grid grid-cols-3 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center">
            <div>
              <span className="block text-[10px] font-bold text-slate-400 uppercase">Daily Rent</span>
              <span className="text-xl font-black text-emerald-600">₹{vehicle.pricePerDay}</span>
              <span className="text-[10px] text-slate-500 block">per 24 hrs</span>
            </div>
            <div className="border-x border-slate-200">
              <span className="block text-[10px] font-bold text-slate-400 uppercase">Deposit</span>
              <span className="text-xl font-extrabold text-slate-800">₹{vehicle.securityDeposit}</span>
              <span className="text-[10px] text-emerald-600 font-semibold block">100% Refundable</span>
            </div>
            <div>
              <span className="block text-[10px] font-bold text-slate-400 uppercase">Rating</span>
              <div className="flex items-center justify-center gap-1 text-base font-black text-amber-600">
                <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                <span>{vehicle.rating.toFixed(1)}</span>
              </div>
              <span className="text-[10px] text-slate-500 block">({vehicle.totalReviews} reviews)</span>
            </div>
          </div>

          {/* Rental Terms & Conditions */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 text-sm">Rental & Mileage Terms</h4>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl flex items-center gap-2.5">
                <Gauge className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <div className="font-bold text-slate-800">{vehicle.mileageLimitKmPerDay || 150} km / day limit</div>
                  <div className="text-[10px] text-slate-500">₹{vehicle.excessKmCharge || 5}/km extra</div>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl flex items-center gap-2.5">
                <Fuel className="w-4 h-4 text-amber-600 shrink-0" />
                <div>
                  <div className="font-bold text-slate-800">{vehicle.fuelPolicy || 'Same to Same'}</div>
                  <div className="text-[10px] text-slate-500">Return with same fuel level</div>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-blue-600 shrink-0" />
                <div>
                  <div className="font-bold text-slate-800">{vehicle.minRentalHours || 4} Hours minimum</div>
                  <div className="text-[10px] text-slate-500">Hourly rate: ₹{vehicle.pricePerHour || 50}/hr</div>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-rose-600 shrink-0" />
                <div>
                  <div className="font-bold text-slate-800">{vehicle.area?.name || 'Sector 17'}</div>
                  <div className="text-[10px] text-slate-500">Chandigarh Hub</div>
                </div>
              </div>
            </div>
          </div>

          {/* Provider Card */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-slate-800 text-white flex items-center justify-center font-bold">
                  {vehicle.provider?.providerType === 'AGENCY' ? (
                    <Building2 className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <UserCheck className="w-5 h-5 text-teal-400" />
                  )}
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                    <span>{vehicle.provider?.businessName}</span>
                    {vehicle.provider?.status === 'VERIFIED' && (
                      <span className="inline-flex items-center text-[10px] text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded font-bold">
                        <ShieldCheck className="w-3 h-3 text-emerald-600 mr-0.5" />
                        Verified
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-500">
                    {vehicle.provider?.providerType === 'AGENCY' ? 'Licensed Rental Agency' : 'Verified Individual Owner'} • {vehicle.provider?.totalRentals || 24} rentals completed
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="flex items-center gap-1 text-xs font-bold text-slate-800">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  <span>{vehicle.provider?.rating?.toFixed(1) || '4.8'}</span>
                </div>
                <span className="text-[10px] text-slate-400">Provider score</span>
              </div>
            </div>

            <div className="text-xs text-slate-600 flex items-center gap-1.5 pt-1 border-t border-slate-200">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>Pickup: <strong>{vehicle.pickupAddress || 'Sector 17 Near Bus Stand, Chandigarh'}</strong></span>
            </div>
          </div>

          {/* Description */}
          {vehicle.description && (
            <div className="space-y-1.5">
              <h4 className="font-bold text-slate-900 text-sm">Vehicle Highlights</h4>
              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl">
                {vehicle.description}
              </p>
            </div>
          )}

          {/* Verified Customer Reviews Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                <span>Verified Customer Reviews</span>
              </h4>
              <span className="text-xs text-slate-500">{reviews.length} reviews</span>
            </div>

            {reviews.length === 0 ? (
              <p className="text-xs text-slate-400 italic bg-slate-50 p-3 rounded-xl text-center">
                No reviews yet. Book this vehicle to be the first verified reviewer!
              </p>
            ) : (
              <div className="space-y-2">
                {reviews.map((r) => (
                  <div key={r.id} className="p-3 bg-slate-50 rounded-xl space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800">{r.customer?.fullName || 'Verified Rider'}</span>
                      <div className="flex items-center gap-2 text-[11px]">
                        <span className="text-slate-600">Vehicle: <strong className="text-amber-600">{r.vehicleRating}⭐</strong></span>
                        <span className="text-slate-600">Provider: <strong className="text-amber-600">{r.providerRating}⭐</strong></span>
                      </div>
                    </div>
                    <p className="text-slate-600 italic text-[11px]">"{r.comment}"</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-200 bg-white flex items-center justify-between gap-3">
          <button
            onClick={() => onToggleCompare(vehicle.id)}
            className={`px-4 py-3 rounded-2xl text-xs font-bold flex items-center gap-1.5 border transition-all ${
              isCompared
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>{isCompared ? 'Remove Compare' : 'Add to Compare'}</span>
          </button>

          <button
            onClick={() => {
              onClose();
              onBookNow(vehicle);
            }}
            className="flex-1 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/20 active:scale-98 transition-all"
          >
            <span>Proceed to Book (₹{vehicle.pricePerDay}/day)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
