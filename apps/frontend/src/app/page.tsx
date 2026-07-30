'use client';

import { useState } from 'react';
import BrandScrollSection from '@/components/BrandScrollSection';
import CarCard from '@/components/CarCard';
import { DEFAULT_CAR_MODELS } from '@/constants/showcase';
import Link from 'next/link';

export default function HomePage() {
  const [selectedBrand, setSelectedBrand] = useState<string>('ALL');

  const filteredCars =
    selectedBrand === 'ALL'
      ? DEFAULT_CAR_MODELS
      : DEFAULT_CAR_MODELS.filter((car) =>
          car.brand.toLowerCase().includes(selectedBrand.toLowerCase())
        );

  return (
    <main className="min-h-screen bg-neutral-950 text-white font-sans selection:bg-emerald-500 selection:text-black overflow-x-hidden">
      {/* 1. CINEMATIC HERO SECTION */}
      <section className="relative pt-36 pb-20 px-6 max-w-7xl mx-auto flex flex-col items-center text-center">
        {/* Ambient Glow Effects */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-r from-amber-500/10 via-emerald-500/15 to-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

        {/* Status Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-xs font-mono tracking-widest text-emerald-400 uppercase">
            3D Etkileşimli Garaj & Kiralama
          </span>
        </div>

        {/* Hero Title */}
        <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-neutral-200 to-neutral-500 max-w-5xl">
          Hayalinizdeki Supercar’ı 3D İnceleyin & Kiralayın
        </h1>

        <p className="text-neutral-400 text-base sm:text-lg max-w-2xl mt-6 font-normal">
          Ferrari, BMW M ve Mercedes-AMG efsanelerini 3 boyutlu etkileşimli vitrinde kişiselleştirin,
          sesini ve rengini hissedin, dakikalar içinde kiralayın.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-10">
          <Link
            href="/showroom"
            className="px-8 py-4 rounded-2xl font-bold text-sm uppercase tracking-wider bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-black shadow-xl shadow-emerald-500/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
          >
            <span>3D Showroom’a Gir</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </Link>

          <a
            href="#garage"
            className="px-8 py-4 rounded-2xl font-bold text-sm uppercase tracking-wider bg-white/10 hover:bg-white/15 border border-white/10 text-white backdrop-blur-xl hover:scale-105 active:scale-95 transition-all"
          >
            Filoyu Keşfet
          </a>
        </div>

        {/* Key Performance Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-4xl mt-16 pt-12 border-t border-white/10">
          <div>
            <span className="text-3xl font-black text-white">6+</span>
            <span className="block text-xs font-mono text-neutral-400 uppercase mt-1">
              Efsanevi 3D Model
            </span>
          </div>
          <div>
            <span className="text-3xl font-black text-emerald-400">660 HP</span>
            <span className="block text-xs font-mono text-neutral-400 uppercase mt-1">
              Maksimum Güç
            </span>
          </div>
          <div>
            <span className="text-3xl font-black text-white">100%</span>
            <span className="block text-xs font-mono text-neutral-400 uppercase mt-1">
              VIP Teslimat
            </span>
          </div>
          <div>
            <span className="text-3xl font-black text-white">60 FPS</span>
            <span className="block text-xs font-mono text-neutral-400 uppercase mt-1">
              WebGL Akıcılığı
            </span>
          </div>
        </div>
      </section>

      {/* 2. GSAP SCROLL BRAND SECTION */}
      <BrandScrollSection selectedBrand={selectedBrand} onSelectBrand={setSelectedBrand} />

      {/* 3. FLEET GARAGE SECTION */}
      <section id="garage" className="py-16 max-w-7xl mx-auto px-6 space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-400">
              Koleksiyonumuz
            </span>
            <h2 className="text-3xl font-black text-white tracking-tight mt-1">
              {selectedBrand === 'ALL' ? 'Tüm Supercar Filomuz' : `${selectedBrand} Modelleri`}
            </h2>
          </div>
          <span className="text-xs font-mono text-neutral-400 bg-white/5 px-4 py-2 rounded-full border border-white/10">
            {filteredCars.length} Araç Mevcut
          </span>
        </div>

        {/* Car Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCars.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      </section>

      {/* 4. FOOTER SECTION */}
      <footer className="border-t border-white/10 bg-neutral-950 py-12 px-6 mt-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-neutral-500 text-xs font-mono">
          <div className="flex items-center gap-3">
            <span className="font-bold text-white tracking-wider">RENTZY</span>
            <span>© 2026 Premium 3D Rental Platform</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/" className="hover:text-white transition-colors">
              Gizlilik Politikası
            </Link>
            <Link href="/" className="hover:text-white transition-colors">
              Kiralama Koşulları
            </Link>
            <Link href="/showroom" className="hover:text-white transition-colors">
              3D Vitrin
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
