import React, { useState, useEffect } from 'react';
import {
  Compass,
  Search,
  Calendar,
  ShieldCheck,
  Building2,
  Layers,
  Sparkles,
  Phone,
  UserCheck,
} from 'lucide-react';
import { User, Vehicle, Booking } from './types';
import { api } from './api';

// Screens & Modals
import Header from './screens/Header';
import HomeScreen from './screens/HomeScreen';
import SearchResultsScreen from './screens/SearchResultsScreen';
import ComparisonModal from './screens/ComparisonModal';
import VehicleDetailsModal from './screens/VehicleDetailsModal';
import BookingModal from './screens/BookingModal';
import MyBookingsScreen from './screens/MyBookingsScreen';
import AgreementModal from './screens/AgreementModal';
import ConditionReportModal from './screens/ConditionReportModal';
import DisputeModal from './screens/DisputeModal';
import ReviewModal from './screens/ReviewModal';
import VerificationScreen from './screens/VerificationScreen';
import ProviderDashboardScreen from './screens/ProviderDashboardScreen';
import AuthModal from './screens/AuthModal';

export default function App() {
  // Navigation
  const [activeTab, setActiveTab] = useState<'HOME' | 'SEARCH' | 'BOOKINGS' | 'KYC' | 'PROVIDER'>('HOME');
  const [activeCity, setActiveCity] = useState<string>('Chandigarh');

  // Auth User
  const [user, setUser] = useState<User | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Search & Filtering State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [sortBy, setSortBy] = useState('BEST_VALUE');
  const [providerTypeFilter, setProviderTypeFilter] = useState('ALL');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [maxPrice, setMaxPrice] = useState(2500);
  const [maxDeposit, setMaxDeposit] = useState(5000);
  const [minRating, setMinRating] = useState(0);

  // Dates
  const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
  const dayAfterTomorrow = new Date(Date.now() + 259200000).toISOString().slice(0, 10);
  const [startDate, setStartDate] = useState(tomorrow);
  const [endDate, setEndDate] = useState(dayAfterTomorrow);

  // Data
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [featuredVehicles, setFeaturedVehicles] = useState<Vehicle[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loadingVehicles, setLoadingVehicles] = useState(false);
  const [loadingBookings, setLoadingBookings] = useState(false);

  // Comparison Tray
  const [selectedForComparison, setSelectedForComparison] = useState<string[]>([]);
  const [showComparisonModal, setShowComparisonModal] = useState(false);

  // Modals
  const [selectedVehicleForDetails, setSelectedVehicleForDetails] = useState<Vehicle | null>(null);
  const [selectedVehicleForBooking, setSelectedVehicleForBooking] = useState<Vehicle | null>(null);
  const [selectedBookingForAgreement, setSelectedBookingForAgreement] = useState<Booking | null>(null);
  const [selectedBookingForCondition, setSelectedBookingForCondition] = useState<Booking | null>(null);
  const [selectedBookingForDispute, setSelectedBookingForDispute] = useState<Booking | null>(null);
  const [selectedBookingForReview, setSelectedBookingForReview] = useState<Booking | null>(null);

  // Load initial data
  useEffect(() => {
    // Check saved user session
    const savedUser = localStorage.getItem('renting_mobile_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error(e);
      }
    }

    fetchVehicles();
  }, []);

  // Fetch when search / filters change
  useEffect(() => {
    fetchVehicles();
  }, [searchQuery, selectedCategory, sortBy, providerTypeFilter, verifiedOnly, maxPrice, maxDeposit, minRating]);

  useEffect(() => {
    if (user && activeTab === 'BOOKINGS') {
      fetchBookings();
    }
  }, [user, activeTab]);

  const fetchVehicles = async () => {
    setLoadingVehicles(true);
    const res = await api.searchVehicles({
      city: activeCity,
      category: selectedCategory,
      query: searchQuery,
      sortBy,
      providerType: providerTypeFilter,
      verifiedOnly: verifiedOnly ? 'true' : 'false',
      maxPrice,
      maxDeposit,
      minRating,
    });
    setLoadingVehicles(false);

    if (res.success && res.vehicles) {
      setVehicles(res.vehicles);
      if (featuredVehicles.length === 0) {
        setFeaturedVehicles(res.vehicles);
      }
    }
  };

  const fetchBookings = async () => {
    setLoadingBookings(true);
    const res = await api.getBookings();
    setLoadingBookings(false);
    if (res.success && res.bookings) {
      setBookings(res.bookings);
    }
  };

  const refreshUser = async () => {
    const res = await api.getMe();
    if (res.success && res.user) {
      setUser(res.user);
      localStorage.setItem('renting_mobile_user', JSON.stringify(res.user));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('renting_mobile_token');
    localStorage.removeItem('renting_mobile_user');
    setUser(null);
    setBookings([]);
  };

  const toggleComparison = (vehicleId: string) => {
    if (!vehicleId) {
      setSelectedForComparison([]);
      return;
    }
    if (selectedForComparison.includes(vehicleId)) {
      setSelectedForComparison(selectedForComparison.filter((id) => id !== vehicleId));
    } else {
      if (selectedForComparison.length >= 4) {
        alert('You can compare up to 4 vehicles at a time.');
        return;
      }
      setSelectedForComparison([...selectedForComparison, vehicleId]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans flex flex-col justify-between">
      <div className="w-full max-w-md md:max-w-2xl lg:max-w-4xl mx-auto bg-white min-h-screen shadow-2xl flex flex-col relative">
        {/* Header */}
        <Header
          user={user}
          activeCity={activeCity}
          onCityChange={(city) => {
            setActiveCity(city);
            fetchVehicles();
          }}
          onOpenAuth={() => setShowAuthModal(true)}
          onLogout={handleLogout}
          onOpenVerification={() => setActiveTab('KYC')}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
          {activeTab === 'HOME' && (
            <HomeScreen
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              startDate={startDate}
              setStartDate={setStartDate}
              endDate={endDate}
              setEndDate={setEndDate}
              onSearch={() => setActiveTab('SEARCH')}
              onSelectVehicle={(v) => setSelectedVehicleForDetails(v)}
              featuredVehicles={featuredVehicles}
            />
          )}

          {activeTab === 'SEARCH' && (
            <SearchResultsScreen
              vehicles={vehicles}
              loading={loadingVehicles}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              sortBy={sortBy}
              setSortBy={setSortBy}
              providerTypeFilter={providerTypeFilter}
              setProviderTypeFilter={setProviderTypeFilter}
              verifiedOnly={verifiedOnly}
              setVerifiedOnly={setVerifiedOnly}
              maxPrice={maxPrice}
              setMaxPrice={setMaxPrice}
              maxDeposit={maxDeposit}
              setMaxDeposit={setMaxDeposit}
              minRating={minRating}
              setMinRating={setMinRating}
              selectedForComparison={selectedForComparison}
              toggleComparison={toggleComparison}
              onOpenComparison={() => setShowComparisonModal(true)}
              onSelectVehicle={(v) => setSelectedVehicleForDetails(v)}
              onBookVehicle={(v) => setSelectedVehicleForBooking(v)}
              startDate={startDate}
              endDate={endDate}
            />
          )}

          {activeTab === 'BOOKINGS' && (
            <MyBookingsScreen
              bookings={bookings}
              loading={loadingBookings}
              onRefresh={fetchBookings}
              user={user}
              onOpenAuth={() => setShowAuthModal(true)}
              onViewAgreement={(b) => setSelectedBookingForAgreement(b)}
              onViewConditionReport={(b) => setSelectedBookingForCondition(b)}
              onOpenDispute={(b) => setSelectedBookingForDispute(b)}
              onOpenReview={(b) => setSelectedBookingForReview(b)}
            />
          )}

          {activeTab === 'KYC' && (
            <VerificationScreen
              user={user}
              onOpenAuth={() => setShowAuthModal(true)}
              onRefreshUser={refreshUser}
            />
          )}

          {activeTab === 'PROVIDER' && (
            <ProviderDashboardScreen
              user={user}
              onOpenAuth={() => setShowAuthModal(true)}
              onViewBookingAgreement={(b) => setSelectedBookingForAgreement(b)}
              onViewBookingConditionReport={(b) => setSelectedBookingForCondition(b)}
            />
          )}
        </main>

        {/* Bottom Tab Navigation */}
        <nav className="fixed bottom-0 inset-x-0 max-w-md md:max-w-2xl lg:max-w-4xl mx-auto bg-white/95 backdrop-blur-md border-t border-slate-200 px-3 py-2 z-40 flex items-center justify-around shadow-lg">
          <button
            onClick={() => setActiveTab('HOME')}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all ${
              activeTab === 'HOME' ? 'text-emerald-600 font-extrabold' : 'text-slate-500 hover:text-slate-800 font-medium'
            }`}
          >
            <Compass className={`w-5 h-5 ${activeTab === 'HOME' ? 'stroke-[2.5]' : ''}`} />
            <span className="text-[10px]">Discover</span>
          </button>

          <button
            onClick={() => setActiveTab('SEARCH')}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all ${
              activeTab === 'SEARCH' ? 'text-emerald-600 font-extrabold' : 'text-slate-500 hover:text-slate-800 font-medium'
            }`}
          >
            <Search className={`w-5 h-5 ${activeTab === 'SEARCH' ? 'stroke-[2.5]' : ''}`} />
            <span className="text-[10px]">Compare</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('BOOKINGS');
              if (user) fetchBookings();
            }}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all ${
              activeTab === 'BOOKINGS' ? 'text-emerald-600 font-extrabold' : 'text-slate-500 hover:text-slate-800 font-medium'
            }`}
          >
            <Calendar className={`w-5 h-5 ${activeTab === 'BOOKINGS' ? 'stroke-[2.5]' : ''}`} />
            <span className="text-[10px]">Bookings</span>
          </button>

          <button
            onClick={() => setActiveTab('KYC')}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all ${
              activeTab === 'KYC' ? 'text-emerald-600 font-extrabold' : 'text-slate-500 hover:text-slate-800 font-medium'
            }`}
          >
            <ShieldCheck className={`w-5 h-5 ${activeTab === 'KYC' ? 'stroke-[2.5]' : ''}`} />
            <span className="text-[10px]">1-Time KYC</span>
          </button>

          <button
            onClick={() => setActiveTab('PROVIDER')}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all ${
              activeTab === 'PROVIDER' ? 'text-emerald-600 font-extrabold' : 'text-slate-500 hover:text-slate-800 font-medium'
            }`}
          >
            <Building2 className={`w-5 h-5 ${activeTab === 'PROVIDER' ? 'stroke-[2.5]' : ''}`} />
            <span className="text-[10px]">Partner</span>
          </button>
        </nav>

        {/* Global Modals */}
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onLoginSuccess={(u) => {
            setUser(u);
            fetchBookings();
          }}
        />

        <ComparisonModal
          isOpen={showComparisonModal}
          onClose={() => setShowComparisonModal(false)}
          vehicles={vehicles.filter((v) => selectedForComparison.includes(v.id))}
          onBookVehicle={(v) => {
            setShowComparisonModal(false);
            setSelectedVehicleForBooking(v);
          }}
          onRemoveVehicle={(id) => toggleComparison(id)}
        />

        <VehicleDetailsModal
          isOpen={Boolean(selectedVehicleForDetails)}
          onClose={() => setSelectedVehicleForDetails(null)}
          vehicle={selectedVehicleForDetails}
          onBookNow={(v) => {
            setSelectedVehicleForDetails(null);
            setSelectedVehicleForBooking(v);
          }}
          onToggleCompare={(id) => toggleComparison(id)}
          isCompared={Boolean(selectedVehicleForDetails && selectedForComparison.includes(selectedVehicleForDetails.id))}
        />

        <BookingModal
          isOpen={Boolean(selectedVehicleForBooking)}
          onClose={() => setSelectedVehicleForBooking(null)}
          vehicle={selectedVehicleForBooking}
          user={user}
          onOpenAuth={() => setShowAuthModal(true)}
          onOpenVerification={() => {
            setSelectedVehicleForBooking(null);
            setActiveTab('KYC');
          }}
          initialStartDate={startDate}
          initialEndDate={endDate}
          onBookingConfirmed={() => {
            fetchBookings();
          }}
        />

        <AgreementModal
          isOpen={Boolean(selectedBookingForAgreement)}
          onClose={() => setSelectedBookingForAgreement(null)}
          booking={selectedBookingForAgreement}
        />

        <ConditionReportModal
          isOpen={Boolean(selectedBookingForCondition)}
          onClose={() => setSelectedBookingForCondition(null)}
          booking={selectedBookingForCondition}
        />

        <DisputeModal
          isOpen={Boolean(selectedBookingForDispute)}
          onClose={() => setSelectedBookingForDispute(null)}
          booking={selectedBookingForDispute}
          onDisputeCreated={() => {
            fetchBookings();
          }}
        />

        <ReviewModal
          isOpen={Boolean(selectedBookingForReview)}
          onClose={() => setSelectedBookingForReview(null)}
          booking={selectedBookingForReview}
          onReviewSubmitted={() => {
            fetchBookings();
            fetchVehicles();
          }}
        />
      </div>
    </div>
  );
}
