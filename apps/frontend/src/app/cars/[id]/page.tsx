'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import CarShowcase from '@/components/CarShowcase';
import { DEFAULT_CAR_MODELS } from '@/constants/showcase';
import { rentCarAction } from '@/actions/rent';

interface CarDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function CarDetailPage({ params }: CarDetailPageProps) {
  const { id } = use(params);
  const car = DEFAULT_CAR_MODELS.find((c) => c.id === id) || DEFAULT_CAR_MODELS[0];

  const [loading, setLoading] = useState(false);
  const [rentResult, setRentResult] = useState<{ success?: boolean; message?: string } | null>(
    null
  );

  const handleRentNow = async () => {
    setLoading(true);
    setRentResult(null);

    const result = await rentCarAction(car.id);
    setRentResult(result);
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-neutral-950 text-white font-sans selection:bg-emerald-500 selection:text-black">
      <div className="pt-28 pb-20 max-w-7xl mx-auto px-6 space-y-8">
        {/* Breadcrumb & Navigation Back */}
        <div className="flex items-center justify-between">
          <Link
            href="/#garage"
            className="inline-flex items-center gap-2 text-xs font-mono text-neutral-400 hover:text-emerald-400 transition-colors uppercase tracking-wider"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            <span>Garaja Geri Dön</span>
          </Link>

          <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 uppercase">
            {car.brand} • {car.category}
          </span>
        </div>

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-6">
          <div>
            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight">
              {car.name}
            </h1>
            <p className="text-neutral-400 text-sm md:text-base mt-2">
              {car.year} Model • {car.specs.engine}
            </p>
          </div>

          {/* Quick Stats Badges */}
          <div className="flex items-center gap-4">
            <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-center">
              <span className="block text-[10px] font-mono text-neutral-400 uppercase">Güç</span>
              <span className="text-lg font-bold text-emerald-400">{car.specs.hp} HP</span>
            </div>
            <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-center">
              <span className="block text-[10px] font-mono text-neutral-400 uppercase">0-100</span>
              <span className="text-lg font-bold text-white">{car.specs.zeroToHundred}</span>
            </div>
            <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-center">
              <span className="block text-[10px] font-mono text-neutral-400 uppercase">Hız</span>
              <span className="text-lg font-bold text-white">{car.specs.topSpeed}</span>
            </div>
          </div>
        </div>

        {/* Main 3D Showcase & Rental Action Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* 3D WebGL Interactive Showcase (3 Columns) */}
          <div className="lg:col-span-3">
            <CarShowcase initialCarId={car.id} className="h-[75vh] min-h-[550px]" />
          </div>

          {/* Rental Action Sidebar Card (1 Column) */}
          <div className="lg:col-span-1 bg-neutral-900/80 border border-white/10 backdrop-blur-xl p-6 rounded-3xl space-y-6 shadow-2xl sticky top-28">
            <div>
              <span className="text-xs font-mono text-neutral-400 uppercase">Günlük Kiralama</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-black text-white">$450</span>
                <span className="text-xs text-neutral-400 font-mono">/ gün</span>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-white/10 text-xs text-neutral-300">
              <div className="flex justify-between py-1">
                <span className="text-neutral-400">Sigorta</span>
                <span className="font-semibold text-emerald-400">Tam Kasko Dahil</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-neutral-400">Teslimat</span>
                <span className="font-semibold text-white">VIP Adrese Teslim</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-neutral-400">Km Sınırı</span>
                <span className="font-semibold text-white">Sınırsız</span>
              </div>
            </div>

            {/* Notification Result Box */}
            {rentResult && (
              <div
                className={`p-4 rounded-xl text-xs font-medium border ${
                  rentResult.success
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                    : 'bg-red-500/10 border-red-500/30 text-red-400'
                }`}
              >
                {rentResult.message}
              </div>
            )}

            {/* Rent CTA Button */}
            <button
              onClick={handleRentNow}
              disabled={loading}
              className="w-full py-4 rounded-xl font-bold text-sm uppercase tracking-wider bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-black shadow-lg shadow-emerald-500/25 hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>İşleniyor...</span>
              ) : (
                <>
                  <span>Hemen Kirala</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
