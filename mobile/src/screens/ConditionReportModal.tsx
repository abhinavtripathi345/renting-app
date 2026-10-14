import React, { useState, useEffect } from 'react';
import { X, Camera, Gauge, Fuel, CheckCircle2, AlertTriangle, Plus, ShieldCheck } from 'lucide-react';
import { Booking } from '../types';
import { api } from '../api';

interface ConditionReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking | null;
}

export default function ConditionReportModal({ isOpen, onClose, booking }: ConditionReportModalProps) {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // New report form state
  const [reportType, setReportType] = useState<'BEFORE_RENTAL' | 'AFTER_RENTAL'>('BEFORE_RENTAL');
  const [odometerReading, setOdometerReading] = useState('12450');
  const [fuelLevelPercent, setFuelLevelPercent] = useState('100');
  const [damageNotes, setDamageNotes] = useState('No existing scratches on body panels. Helmet provided.');
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    if (isOpen && booking?.id) {
      loadReports();
    }
  }, [isOpen, booking?.id]);

  const loadReports = async () => {
    if (!booking) return;
    setLoading(true);
    const res = await api.getConditionReports(booking.id);
    setLoading(false);
    if (res.success && res.reports) {
      setReports(res.reports);
      if (res.reports.length === 0) {
        setShowAddForm(true);
      }
    }
  };

  const handleSaveReport = async () => {
    if (!booking) return;
    setSubmitting(true);
    const res = await api.createConditionReport({
      bookingId: booking.id,
      reportType,
      odometerReading: parseFloat(odometerReading) || 0,
      fuelLevelPercent: parseFloat(fuelLevelPercent) || 100,
      damageNotes,
      photosJson: JSON.stringify([
        'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=500&q=80',
        'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=500&q=80',
      ]),
    });
    setSubmitting(false);
    if (res.success) {
      setShowAddForm(false);
      loadReports();
    }
  };

  if (!isOpen || !booking) return null;

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white rounded-3xl max-w-xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">Vehicle Condition & Evidence</h3>
              <p className="text-xs text-slate-500">Booking #{booking.bookingNumber} • {booking.vehicle?.brand} {booking.vehicle?.model}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {/* Action to record new inspection */}
          {!showAddForm && (
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">Inspection Log ({reports.length} records)</span>
              <button
                onClick={() => setShowAddForm(true)}
                className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-1 border border-emerald-300"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Record New Inspection</span>
              </button>
            </div>
          )}

          {/* Form to Add Report */}
          {showAddForm && (
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-4 animate-in fade-in duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="text-xs font-bold text-slate-800">Record Inspection Evidence</span>
                {reports.length > 0 && (
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="text-xs text-slate-500 hover:text-slate-800"
                  >
                    Cancel
                  </button>
                )}
              </div>

              {/* Type Switcher */}
              <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                <button
                  onClick={() => setReportType('BEFORE_RENTAL')}
                  className={`py-2 rounded-xl border transition-all ${
                    reportType === 'BEFORE_RENTAL'
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200'
                  }`}
                >
                  🟢 Handover (Pickup)
                </button>
                <button
                  onClick={() => setReportType('AFTER_RENTAL')}
                  className={`py-2 rounded-xl border transition-all ${
                    reportType === 'AFTER_RENTAL'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200'
                  }`}
                >
                  🔵 Return (Dropoff)
                </button>
              </div>

              {/* Odometer & Fuel */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-slate-600 flex items-center gap-1">
                    <Gauge className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Odometer (KM)</span>
                  </label>
                  <input
                    type="number"
                    value={odometerReading}
                    onChange={(e) => setOdometerReading(e.target.value)}
                    className="w-full p-2 bg-white border border-slate-200 rounded-xl font-mono font-bold text-slate-800 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-600 flex items-center gap-1">
                    <Fuel className="w-3.5 h-3.5 text-amber-600" />
                    <span>Fuel Level (%)</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={fuelLevelPercent}
                    onChange={(e) => setFuelLevelPercent(e.target.value)}
                    className="w-full p-2 bg-white border border-slate-200 rounded-xl font-mono font-bold text-slate-800 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Damage Notes */}
              <div className="space-y-1 text-xs">
                <label className="font-bold text-slate-600">Damage / Inspection Notes</label>
                <textarea
                  rows={2}
                  value={damageNotes}
                  onChange={(e) => setDamageNotes(e.target.value)}
                  placeholder="Record any scratches, dents, tyre wear, or accessory status..."
                  className="w-full p-2 bg-white border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Photos Mock Preview */}
              <div className="space-y-1.5 text-xs">
                <label className="font-bold text-slate-600">Inspection Photographs (Attached)</label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="h-20 bg-slate-200 rounded-xl overflow-hidden relative">
                    <img
                      src="https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=400&q=80"
                      alt="Condition front"
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[9px] px-1 rounded">Front & Tank</span>
                  </div>
                  <div className="h-20 bg-slate-200 rounded-xl overflow-hidden relative">
                    <img
                      src="https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=400&q=80"
                      alt="Condition side"
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[9px] px-1 rounded">Side & Tyres</span>
                  </div>
                </div>
              </div>

              <button
                disabled={submitting}
                onClick={handleSaveReport}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-900/20"
              >
                {submitting ? 'Submitting Evidence...' : 'Save & Sign Condition Evidence'}
              </button>
            </div>
          )}

          {/* List of Existing Reports */}
          {loading ? (
            <div className="h-32 bg-slate-100 rounded-2xl animate-pulse" />
          ) : reports.length === 0 ? (
            <p className="text-xs text-slate-400 italic text-center py-4">No inspection reports recorded yet.</p>
          ) : (
            <div className="space-y-3">
              {reports.map((r) => (
                <div
                  key={r.id}
                  className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between pb-1.5 border-b border-slate-200">
                    <span className={`font-bold px-2 py-0.5 rounded-full text-[10px] ${
                      r.reportType === 'BEFORE_RENTAL'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {r.reportType === 'BEFORE_RENTAL' ? 'HANDOVER EVIDENCE (PRE-RENTAL)' : 'RETURN EVIDENCE (POST-RENTAL)'}
                    </span>
                    <span className="text-[11px] text-slate-400">{new Date(r.recordedAt).toLocaleString()}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-slate-700">
                    <div className="flex items-center gap-1.5">
                      <Gauge className="w-3.5 h-3.5 text-slate-400" />
                      <span>Odometer: <strong>{r.odometerReading} KM</strong></span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Fuel className="w-3.5 h-3.5 text-slate-400" />
                      <span>Fuel: <strong>{r.fuelLevelPercent}%</strong></span>
                    </div>
                  </div>

                  {r.damageNotes && (
                    <div className="text-[11px] text-slate-600 italic bg-white p-2 rounded-lg border border-slate-100">
                      "{r.damageNotes}"
                    </div>
                  )}

                  {/* Photographs */}
                  {r.photosJson && (
                    <div className="flex gap-2 pt-1">
                      {JSON.parse(r.photosJson || '[]').map((pUrl: string, idx: number) => (
                        <div key={idx} className="w-16 h-12 rounded-lg overflow-hidden border border-slate-200 shrink-0">
                          <img src={pUrl} alt="Inspection proof" className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-100 bg-slate-50 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
