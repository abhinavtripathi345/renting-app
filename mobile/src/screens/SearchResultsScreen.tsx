import React, { useState } from 'react';
import {
  Search,
  Filter,
  SlidersHorizontal,
  Star,
  ShieldCheck,
  MapPin,
  Check,
  ArrowUpDown,
  Sparkles,
  Info,
  Calendar,
  X,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { Vehicle } from '../types';

interface SearchResultsScreenProps {
  vehicles: Vehicle[];
  loading: boolean;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: string;
  setSelectedCategory: (c: string) => void;
  sortBy: string;
  setSortBy: (s: string) => void;
  providerTypeFilter: string;
  setProviderTypeFilter: (pt: string) => void;
  verifiedOnly: boolean;
  setVerifiedOnly: (v: boolean) => void;
  maxPrice: number;
  setMaxPrice: (p: number) => void;
  maxDeposit: number;
  setMaxDeposit: (d: number) => void;
  minRating: number;
  setMinRating: (r: number) => void;
  selectedForComparison: string[];
  toggleComparison: (vehicleId: string) => void;
  onOpenComparison: () => void;
  onSelectVehicle: (vehicle: Vehicle) => void;
  onBookVehicle: (vehicle: Vehicle) => void;
  startDate: string;
  endDate: string;
}

export default function SearchResultsScreen({
  vehicles,
  loading,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  sortBy,
  setSortBy,
  providerTypeFilter,
  setProviderTypeFilter,
  verifiedOnly,
  setVerifiedOnly,
  maxPrice,
  setMaxPrice,
  maxDeposit,
  setMaxDeposit,
  minRating,
  setMinRating,
  selectedForComparison,
  toggleComparison,
  onOpenComparison,
  onSelectVehicle,
  onBookVehicle,
  startDate,
  endDate,
}: SearchResultsScreenProps) {
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);

  return (
    <div className="space-y-4 pb-28">
      {/* Top Search & Filter Bar */}
      <div className="bg-white rounded-2xl p-3 border border-slate-200 shadow-sm space-y-3">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Bullet, Activa, Himalayan..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-emerald-500"
            />
          </div>
          <button
            onClick={() => setShowFilterDrawer(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all relative"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-600" />
            <span>Filters</span>
            {(providerTypeFilter !== 'ALL' || verifiedOnly || minRating > 0 || maxPrice < 2000) && (
              <span className="w-2 h-2 rounded-full bg-emerald-500 absolute -top-0.5 -right-0.5" />
            )}
          </button>
        </div>

        {/* Quick Sort & Category Filter Pills */}
        <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 text-xs">
          <div className="flex items-center gap-1.5 shrink-0">
            {['ALL', 'BIKE', 'SCOOTER'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-full font-bold transition-all ${
                  selectedCategory === cat
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat === 'ALL' ? 'All Types' : cat === 'BIKE' ? 'Bikes' : 'Scooters'}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-slate-100 text-slate-700 font-bold px-2 py-1 rounded-lg focus:outline-none text-xs"
            >
              <option value="BEST_VALUE">Best Value Score</option>
              <option value="PRICE_LOW">Price: Low to High</option>
              <option value="PRICE_HIGH">Price: High to Low</option>
              <option value="RATING">Highest Rated</option>
              <option value="DISTANCE">Nearest Distance</option>
            </select>
          </div>
        </div>
      </div>

      {/* Floating Comparison Tray (if 1 or more vehicles selected) */}
      {selectedForComparison.length > 0 && (
        <div className="fixed bottom-16 inset-x-4 max-w-lg mx-auto z-40 bg-slate-900 text-white p-3 rounded-2xl shadow-2xl flex items-center justify-between border border-slate-700 animate-in slide-in-from-bottom-5 duration-200">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500 text-slate-950 flex items-center justify-center font-black text-xs">
              {selectedForComparison.length}
            </div>
            <div>
              <p className="text-xs font-bold">{selectedForComparison.length} Vehicle{selectedForComparison.length > 1 ? 's' : ''} Selected</p>
              <p className="text-[10px] text-slate-400">Compare rates & deposits side-by-side</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleComparison('')}
              className="text-[11px] text-slate-400 hover:text-white px-2 py-1"
            >
              Clear
            </button>
            <button
              onClick={onOpenComparison}
              className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl font-extrabold text-xs flex items-center gap-1 shadow-md shadow-emerald-500/20"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Compare Now</span>
            </button>
          </div>
        </div>
      )}

      {/* Search Header Info */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <span>
          Showing <strong>{vehicles.length}</strong> rental option{vehicles.length === 1 ? '' : 's'} in <strong>Chandigarh</strong>
        </span>
        {searchQuery && (
          <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
            Filtered by: "{searchQuery}"
          </span>
        )}
      </div>

      {/* Results List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-40 bg-slate-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : vehicles.length === 0 ? (
        <div className="bg-white rounded-3xl p-8 border border-slate-200 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-800 text-sm">No vehicles matched your search</h3>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            Try adjusting your filters, clearing search keywords, or selecting another category.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('ALL');
              setProviderTypeFilter('ALL');
              setVerifiedOnly(false);
              setMaxPrice(3000);
            }}
            className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="space-y-3.5">
          {vehicles.map((v) => {
            const isSelected = selectedForComparison.includes(v.id);
            return (
              <div
                key={v.id}
                className={`bg-white rounded-2xl border transition-all p-4 shadow-sm hover:shadow-md ${
                  isSelected ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Vehicle Header & Best Value Badge */}
                <div className="flex gap-3">
                  <div className="w-28 h-24 bg-slate-100 rounded-xl overflow-hidden shrink-0 relative">
                    <img
                      src={v.images?.[0]?.imageUrl || 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=500&q=80'}
                      alt={v.model}
                      className="w-full h-full object-cover"
                    />
                    {v.bestValueScore && v.bestValueScore >= 75 && (
                      <div className="absolute top-1 left-1 px-1.5 py-0.5 bg-amber-400 text-slate-950 font-black text-[9px] rounded uppercase tracking-wider flex items-center gap-0.5 shadow-sm">
                        <Sparkles className="w-2.5 h-2.5 fill-slate-950" />
                        <span>Best Value</span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm">{v.brand} {v.model}</h3>
                        <p className="text-[11px] text-slate-500">{v.variant || v.category} • Year {v.modelYear}</p>
                      </div>
                      <div className="flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded-md">
                        <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                        <span>{v.rating.toFixed(1)}</span>
                        <span className="text-[10px] text-slate-400 font-normal">({v.totalReviews})</span>
                      </div>
                    </div>

                    {/* Provider Info Row */}
                    <div className="flex flex-wrap items-center gap-2 text-xs pt-0.5">
                      <div className="flex items-center gap-1">
                        <span className="font-semibold text-slate-800">{v.provider?.businessName}</span>
                        {v.provider?.status === 'VERIFIED' && (
                          <span className="inline-flex items-center text-[10px] text-emerald-700 bg-emerald-50 px-1 rounded font-bold" title="Verified Provider">
                            <ShieldCheck className="w-3 h-3 text-emerald-600 mr-0.5" />
                            Verified
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-600 font-medium rounded">
                        {v.provider?.providerType === 'AGENCY' ? 'Agency' : 'Individual Owner'}
                      </span>
                    </div>

                    {/* Location & Distance */}
                    <div className="flex items-center gap-2 text-[11px] text-slate-500">
                      <span className="flex items-center gap-0.5">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>{v.area?.name || 'Sector 17'}, Chandigarh</span>
                      </span>
                      {v.distanceKm && (
                        <span className="font-bold text-slate-700">• {v.distanceKm} km away</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Price, Deposit & Comparison Checkbox Grid */}
                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                  {/* Pricing Overview */}
                  <div className="flex items-baseline gap-3">
                    <div>
                      <span className="text-lg font-black text-emerald-600">₹{v.pricePerDay}</span>
                      <span className="text-xs text-slate-500 font-medium">/day</span>
                    </div>
                    <div className="text-[11px] text-slate-500 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">
                      Deposit: <span className="font-bold text-slate-800">₹{v.securityDeposit}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {/* Compare Toggle */}
                    <button
                      onClick={() => toggleComparison(v.id)}
                      className={`px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${
                        isSelected
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                      }`}
                    >
                      <Check className={`w-3 h-3 ${isSelected ? 'opacity-100' : 'opacity-0'}`} />
                      <span>{isSelected ? 'Compared' : 'Compare'}</span>
                    </button>

                    <button
                      onClick={() => onSelectVehicle(v)}
                      className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs"
                    >
                      Details
                    </button>

                    <button
                      onClick={() => onBookVehicle(v)}
                      className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-sm shadow-emerald-900/20 active:scale-95"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Filter Drawer / Modal */}
      {showFilterDrawer && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-md w-full p-6 space-y-5 max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom-10 duration-200">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Filter className="w-4 h-4 text-emerald-600" />
                <span>Filter Vehicles</span>
              </h3>
              <button
                onClick={() => setShowFilterDrawer(false)}
                className="p-1 rounded-full text-slate-400 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Provider Type */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">Provider Type</label>
              <div className="grid grid-cols-3 gap-2 text-xs font-semibold">
                {[
                  { id: 'ALL', label: 'All Providers' },
                  { id: 'AGENCY', label: 'Rental Agency' },
                  { id: 'INDIVIDUAL', label: 'Individual Owner' },
                ].map((pt) => (
                  <button
                    key={pt.id}
                    onClick={() => setProviderTypeFilter(pt.id)}
                    className={`py-2 px-2 rounded-xl text-center transition-all ${
                      providerTypeFilter === pt.id
                        ? 'bg-emerald-600 text-white font-bold'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {pt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Verified Providers Toggle */}
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Verified Providers Only</span>
                </span>
                <span className="text-[11px] text-slate-500 block">Show only background-checked rental partners</span>
              </div>
              <input
                type="checkbox"
                checked={verifiedOnly}
                onChange={(e) => setVerifiedOnly(e.target.checked)}
                className="w-5 h-5 accent-emerald-600 rounded cursor-pointer"
              />
            </div>

            {/* Price Max Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-bold text-slate-700">Max Daily Rent</span>
                <span className="font-black text-emerald-600">₹{maxPrice}/day</span>
              </div>
              <input
                type="range"
                min="400"
                max="2500"
                step="50"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
            </div>

            {/* Deposit Max Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-bold text-slate-700">Max Security Deposit</span>
                <span className="font-black text-slate-800">₹{maxDeposit}</span>
              </div>
              <input
                type="range"
                min="500"
                max="5000"
                step="250"
                value={maxDeposit}
                onChange={(e) => setMaxDeposit(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
            </div>

            {/* Rating Filter */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">Minimum Rating</label>
              <div className="grid grid-cols-4 gap-2 text-xs">
                {[0, 4.0, 4.5, 4.8].map((r) => (
                  <button
                    key={r}
                    onClick={() => setMinRating(r)}
                    className={`py-1.5 rounded-xl font-bold flex items-center justify-center gap-1 ${
                      minRating === r
                        ? 'bg-amber-500 text-slate-950 shadow-sm'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    <Star className="w-3 h-3 fill-current" />
                    <span>{r === 0 ? 'Any' : `${r}+`}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex gap-2">
              <button
                onClick={() => {
                  setProviderTypeFilter('ALL');
                  setVerifiedOnly(false);
                  setMaxPrice(2500);
                  setMaxDeposit(5000);
                  setMinRating(0);
                }}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
              >
                Reset
              </button>
              <button
                onClick={() => setShowFilterDrawer(false)}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-900/20"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
