import React, { useState, useEffect } from 'react';
import {
  Building2,
  Bike,
  Calendar,
  Star,
  Plus,
  CheckCircle2,
  ShieldCheck,
  Fuel,
  Gauge,
  MapPin,
  RefreshCw,
  X,
  Sparkles,
  UserCheck,
} from 'lucide-react';
import { User, Vehicle, Booking } from '../types';
import { api } from '../api';

interface ProviderDashboardScreenProps {
  user: User | null;
  onOpenAuth: () => void;
  onViewBookingAgreement: (booking: Booking) => void;
  onViewBookingConditionReport: (booking: Booking) => void;
}

export default function ProviderDashboardScreen({
  user,
  onOpenAuth,
  onViewBookingAgreement,
  onViewBookingConditionReport,
}: ProviderDashboardScreenProps) {
  const [stats, setStats] = useState<any>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'VEHICLES' | 'BOOKINGS'>('OVERVIEW');

  // Add vehicle modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [brand, setBrand] = useState('Royal Enfield');
  const [model, setModel] = useState('Classic 350 Reborn');
  const [category, setCategory] = useState<'BIKE' | 'SCOOTER'>('BIKE');
  const [pricePerDay, setPricePerDay] = useState('800');
  const [securityDeposit, setSecurityDeposit] = useState('1500');
  const [registrationNumber, setRegistrationNumber] = useState('CH-01-AB-4455');
  const [pickupAddress, setPickupAddress] = useState('Sector 35-C, Chandigarh');
  const [savingVehicle, setSavingVehicle] = useState(false);

  useEffect(() => {
    if (user) {
      loadProviderData();
    }
  }, [user]);

  const loadProviderData = async () => {
    setLoading(true);
    const statsRes = await api.getProviderStats();
    if (statsRes.success) setStats(statsRes.stats);

    const vRes = await api.searchVehicles({ limit: 50 });
    if (vRes.success) {
      // Filter vehicles belonging to this provider or all if demo
      setVehicles(vRes.vehicles || []);
    }

    const bRes = await api.getBookings();
    if (bRes.success) {
      setBookings(bRes.bookings || []);
    }

    setLoading(false);
  };

  const handleCreateVehicle = async () => {
    setSavingVehicle(true);
    const res = await api.createVehicle({
      brand,
      model,
      category,
      modelYear: 2024,
      pricePerDay: parseFloat(pricePerDay) || 800,
      pricePerHour: 50,
      securityDeposit: parseFloat(securityDeposit) || 1500,
      registrationNumber,
      pickupAddress,
      city: 'Chandigarh',
      description: 'Well-maintained vehicle with full service history and valid insurance.',
      images: [
        {
          imageUrl:
            category === 'BIKE'
              ? 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=600&q=80'
              : 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=600&q=80',
          isPrimary: true,
        },
      ],
    });
    setSavingVehicle(false);

    if (res.success) {
      setShowAddModal(false);
      loadProviderData();
    }
  };

  const handleUpdateBookingStatus = async (bookingId: string, status: string) => {
    await api.updateBookingStatus(bookingId, status);
    loadProviderData();
  };

  if (!user) {
    return (
      <div className="bg-white rounded-3xl p-8 border border-slate-200 text-center space-y-4 shadow-sm my-4">
        <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
          <Building2 className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-slate-900">Partner & Agency Portal</h3>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            Sign in as an Agency Partner or Bike Owner to manage fleet inventory, accept booking requests, and record handover evidence.
          </p>
        </div>
        <button
          onClick={onOpenAuth}
          className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold text-xs shadow-md"
        >
          Sign In as Provider
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5 pb-28">
      {/* Provider Header Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 p-6 rounded-3xl text-white shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full text-blue-300 text-xs font-semibold">
            <Building2 className="w-3.5 h-3.5" />
            <span>Rental Provider Partner Dashboard</span>
          </div>
          <button
            onClick={loadProviderData}
            className="p-1.5 rounded-full text-slate-400 hover:text-white bg-white/10"
            title="Refresh data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        <div>
          <h2 className="text-xl font-extrabold tracking-tight">
            {stats?.provider?.businessName || user.fullName}
          </h2>
          <p className="text-xs text-slate-300">
            {stats?.provider?.providerType === 'AGENCY' ? 'Licensed Rental Agency' : 'Individual Vehicle Owner'} • Chandigarh Hub
          </p>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-4 gap-2 pt-2 text-center text-xs">
          <div className="bg-white/10 p-2.5 rounded-2xl">
            <span className="text-[10px] text-slate-400 block uppercase font-bold">Vehicles</span>
            <span className="text-lg font-black text-white">{stats?.totalVehicles || vehicles.length}</span>
          </div>
          <div className="bg-white/10 p-2.5 rounded-2xl">
            <span className="text-[10px] text-slate-400 block uppercase font-bold">Active</span>
            <span className="text-lg font-black text-emerald-400">{stats?.activeRentals || 2}</span>
          </div>
          <div className="bg-white/10 p-2.5 rounded-2xl">
            <span className="text-[10px] text-slate-400 block uppercase font-bold">Total Bookings</span>
            <span className="text-lg font-black text-blue-400">{stats?.totalBookings || bookings.length}</span>
          </div>
          <div className="bg-white/10 p-2.5 rounded-2xl">
            <span className="text-[10px] text-slate-400 block uppercase font-bold">Rating</span>
            <span className="text-lg font-black text-amber-400 flex items-center justify-center gap-0.5">
              <Star className="w-3 h-3 fill-amber-400" />
              {stats?.provider?.rating?.toFixed(1) || '4.8'}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-2 text-xs font-bold">
        <button
          onClick={() => setActiveTab('OVERVIEW')}
          className={`pb-1 px-3 border-b-2 transition-all ${
            activeTab === 'OVERVIEW'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Fleet & Quick Actions
        </button>
        <button
          onClick={() => setActiveTab('BOOKINGS')}
          className={`pb-1 px-3 border-b-2 transition-all ${
            activeTab === 'BOOKINGS'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Rental Bookings ({bookings.length})
        </button>
      </div>

      {/* Tab 1: Overview & Vehicle Management */}
      {activeTab === 'OVERVIEW' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-extrabold text-slate-900 text-sm">Listed Vehicles</h3>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Vehicle</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {vehicles.map((v) => (
              <div
                key={v.id}
                className="bg-white rounded-2xl border border-slate-200 p-3.5 shadow-sm space-y-2.5 text-xs"
              >
                <div className="flex gap-3">
                  <div className="w-20 h-16 bg-slate-100 rounded-xl overflow-hidden shrink-0">
                    <img
                      src={v.images?.[0]?.imageUrl || 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=500&q=80'}
                      alt={v.model}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-slate-900 text-sm truncate">{v.brand} {v.model}</div>
                    <div className="text-[11px] text-slate-500 font-mono">{v.registrationNumber}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-black text-emerald-600">₹{v.pricePerDay}/day</span>
                      <span className="text-slate-400">• ₹{v.securityDeposit} dep</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px]">
                  <span className={`px-2 py-0.5 rounded-md font-bold ${
                    v.status === 'AVAILABLE' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                  }`}>
                    {v.status}
                  </span>
                  <span className="text-slate-500">{v.area?.name || 'Sector 17'}, Chandigarh</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Bookings Management */}
      {activeTab === 'BOOKINGS' && (
        <div className="space-y-3">
          <h3 className="font-extrabold text-slate-900 text-sm px-1">Active & Incoming Rentals</h3>
          {bookings.length === 0 ? (
            <p className="text-xs text-slate-400 italic text-center py-6">No booking records found.</p>
          ) : (
            bookings.map((b) => (
              <div
                key={b.id}
                className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-3 text-xs"
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="font-mono font-bold text-slate-800">#{b.bookingNumber}</span>
                  <span className="px-2 py-0.5 rounded-full font-extrabold bg-blue-50 text-blue-700 text-[10px]">
                    {b.status}
                  </span>
                </div>

                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{b.vehicle?.brand} {b.vehicle?.model}</h4>
                    <p className="text-slate-600">Customer: <strong>{b.customer?.fullName || 'Verified Rider'}</strong></p>
                    <p className="text-[11px] text-slate-400">
                      {new Date(b.startDate).toLocaleDateString()} to {new Date(b.endDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-base font-black text-emerald-600">₹{b.totalAmount}</span>
                    <span className="text-[10px] text-slate-400 block">Deposit: ₹{b.securityDeposit}</span>
                  </div>
                </div>

                {/* Handover / Return Controls */}
                <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => onViewBookingConditionReport(b)}
                    className="py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold"
                  >
                    Condition Proofs
                  </button>

                  <button
                    onClick={() => onViewBookingAgreement(b)}
                    className="py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold"
                  >
                    Rental Agreement
                  </button>

                  {b.status === 'CONFIRMED' && (
                    <button
                      onClick={() => handleUpdateBookingStatus(b.id, 'ACTIVE')}
                      className="py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold"
                    >
                      Start Handover
                    </button>
                  )}

                  {b.status === 'ACTIVE' && (
                    <button
                      onClick={() => handleUpdateBookingStatus(b.id, 'COMPLETED')}
                      className="py-1.5 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold"
                    >
                      Complete Return
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Add Vehicle Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-6">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-slate-900 text-base">Add Vehicle to Fleet</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 text-slate-400 hover:bg-slate-100 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Brand</label>
                  <input
                    type="text"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Model</label>
                  <input
                    type="text"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800"
                  >
                    <option value="BIKE">Bike</option>
                    <option value="SCOOTER">Scooter</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Reg Number</label>
                  <input
                    type="text"
                    value={registrationNumber}
                    onChange={(e) => setRegistrationNumber(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Daily Rent (₹)</label>
                  <input
                    type="number"
                    value={pricePerDay}
                    onChange={(e) => setPricePerDay(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-800"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Security Deposit (₹)</label>
                  <input
                    type="number"
                    value={securityDeposit}
                    onChange={(e) => setSecurityDeposit(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Pickup Address (Chandigarh)</label>
                <input
                  type="text"
                  value={pickupAddress}
                  onChange={(e) => setPickupAddress(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800"
                />
              </div>
            </div>

            <button
              disabled={savingVehicle}
              onClick={handleCreateVehicle}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white rounded-2xl text-xs font-bold shadow-md"
            >
              {savingVehicle ? 'Adding Vehicle...' : 'Publish Vehicle Listing'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
