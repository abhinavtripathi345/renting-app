import React from 'react';
import { Search, Calendar, Shield, Sparkles, ArrowRight, Star, Bike, CheckCircle2, SlidersHorizontal } from 'lucide-react';
import { Vehicle } from '../types';

interface HomeScreenProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  startDate: string;
  setStartDate: (d: string) => void;
  endDate: string;
  setEndDate: (d: string) => void;
  onSearch: () => void;
  onSelectVehicle: (vehicle: Vehicle) => void;
  featuredVehicles: Vehicle[];
}

export default function HomeScreen({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  onSearch,
  onSelectVehicle,
  featuredVehicles,
}: HomeScreenProps) {
  const quickSearches = [
    { label: 'Royal Enfield Bullet 350', query: 'Bullet', cat: 'BIKE' },
    { label: 'Royal Enfield Himalayan', query: 'Himalayan', cat: 'BIKE' },
    { label: 'Honda Activa 6G', query: 'Activa', cat: 'SCOOTER' },
    { label: 'KTM Duke 250', query: 'Duke', cat: 'BIKE' },
  ];

  return (
    <div className="space-y-6 pb-24">
      {/* Hero Banner with Search Box */}
      <div className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 p-6 sm:p-8 text-white shadow-xl overflow-hidden">
        <div className="absolute -right-12 -top-12 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-full text-emerald-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Multi-Provider Vehicle Rental Marketplace</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">
            Compare & Rent Bikes & Scooters in <span className="text-emerald-400">Chandigarh</span>
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm max-w-lg">
            Compare rental agencies and verified owners in one place. Transparent deposits, zero hidden charges, and instant verification.
          </p>

          {/* Core Search Form */}
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 space-y-3 mt-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-300 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Bike, Scooter or Model (e.g. Bullet 350)..."
                className="w-full pl-10 pr-4 py-2.5 bg-white text-slate-900 rounded-xl text-sm font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 shadow-inner"
              />
            </div>

            {/* Category Selectors */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'ALL', label: 'All Vehicles' },
                { id: 'BIKE', label: 'Bikes' },
                { id: 'SCOOTER', label: 'Scooters' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`py-2 px-2 text-xs font-bold rounded-xl transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30'
                      : 'bg-white/10 text-slate-200 hover:bg-white/20'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Rental Dates */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="bg-white/90 text-slate-900 p-2 rounded-xl flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-600 shrink-0" />
                <div className="flex-1">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase">Pickup Date</span>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-transparent font-semibold text-xs text-slate-800 focus:outline-none"
                  />
                </div>
              </div>

              <div className="bg-white/90 text-slate-900 p-2 rounded-xl flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-600 shrink-0" />
                <div className="flex-1">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase">Dropoff Date</span>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full bg-transparent font-semibold text-xs text-slate-800 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Submit CTA */}
            <button
              onClick={onSearch}
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/40 transition-all active:scale-[0.99]"
            >
              <span>Search & Compare Multi-Provider Rates</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Demo Search Chips */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
          Popular Rental Searches in Chandigarh
        </h3>
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {quickSearches.map((qs, i) => (
            <button
              key={i}
              onClick={() => {
                setSearchQuery(qs.query);
                setSelectedCategory(qs.cat);
                onSearch();
              }}
              className="shrink-0 px-3 py-1.5 bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-full text-xs font-semibold text-slate-700 hover:text-emerald-700 transition-all flex items-center gap-1.5 shadow-sm"
            >
              <Bike className="w-3.5 h-3.5 text-emerald-600" />
              <span>{qs.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Value Pillars */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-sm text-center space-y-1">
          <div className="w-8 h-8 mx-auto rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm">
            ₹
          </div>
          <h4 className="font-bold text-slate-800 text-xs">Compare Rates</h4>
          <p className="text-[10px] text-slate-500 leading-tight">Agencies & owners side-by-side</p>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-sm text-center space-y-1">
          <div className="w-8 h-8 mx-auto rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <h4 className="font-bold text-slate-800 text-xs">1-Time KYC</h4>
          <p className="text-[10px] text-slate-500 leading-tight">Reusable verified license</p>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-sm text-center space-y-1">
          <div className="w-8 h-8 mx-auto rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-sm">
            <Shield className="w-4 h-4" />
          </div>
          <h4 className="font-bold text-slate-800 text-xs">Clear Deposits</h4>
          <p className="text-[10px] text-slate-500 leading-tight">Transparent refundable deposit</p>
        </div>
      </div>

      {/* Featured Vehicles Preview */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-base font-bold text-slate-900">Featured Vehicles Available Now</h2>
          <button
            onClick={onSearch}
            className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-0.5"
          >
            <span>View all</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {featuredVehicles.slice(0, 4).map((vehicle) => (
            <div
              key={vehicle.id}
              onClick={() => onSelectVehicle(vehicle)}
              className="bg-white rounded-2xl border border-slate-200 hover:border-emerald-400 p-3.5 shadow-sm hover:shadow-md transition-all cursor-pointer space-y-3 group"
            >
              <div className="flex gap-3">
                <div className="w-24 h-20 bg-slate-100 rounded-xl overflow-hidden shrink-0 relative">
                  <img
                    src={vehicle.images?.[0]?.imageUrl || 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=500&q=80'}
                    alt={vehicle.model}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {vehicle.bestValueScore && vehicle.bestValueScore > 80 && (
                    <div className="absolute top-1 left-1 px-1.5 py-0.5 bg-amber-500 text-slate-950 font-black text-[9px] rounded uppercase tracking-wider">
                      Best Value
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm truncate">{vehicle.brand} {vehicle.model}</h3>
                      <p className="text-xs text-slate-500">{vehicle.variant || vehicle.category}</p>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-md">
                      <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                      <span>{vehicle.rating.toFixed(1)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-slate-600">
                    <span className="font-semibold text-slate-700 truncate">{vehicle.provider?.businessName}</span>
                    <span className="text-[10px] px-1.5 py-0.2 bg-slate-100 text-slate-600 rounded">
                      {vehicle.provider?.providerType === 'AGENCY' ? 'Agency' : 'Owner'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                <div>
                  <span className="text-xs text-slate-400">Rent: </span>
                  <span className="text-base font-extrabold text-emerald-600">₹{vehicle.pricePerDay}</span>
                  <span className="text-slate-400 text-[11px]">/day</span>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-slate-500">Deposit: <strong>₹{vehicle.securityDeposit}</strong></span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
