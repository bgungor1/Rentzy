'use client';

import Link from 'next/link';
import { CarModelData } from '@/types/car';

interface CarCardProps {
  car: CarModelData;
}

export default function CarCard({ car }: CarCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-neutral-900/60 backdrop-blur-xl p-6 transition-all duration-500 hover:-translate-y-2 hover:border-emerald-500/50 hover:shadow-2xl hover:shadow-emerald-500/10 flex flex-col justify-between">
      {/* Subtle Glow Header */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-all duration-500" />

      <div>
        {/* Category & Year Badges */}
        <div className="flex items-center justify-between mb-4 relative z-10">
          <span className="text-xs font-mono font-semibold tracking-wider text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 uppercase">
            {car.brand}
          </span>
          <span className="text-xs font-mono text-neutral-400 bg-white/5 px-3 py-1 rounded-full border border-white/10">
            {car.year}
          </span>
        </div>

        {/* Car Name & Category */}
        <h3 className="text-2xl font-black text-white group-hover:text-emerald-300 transition-colors tracking-tight mb-1">
          {car.name}
        </h3>
        <p className="text-xs text-neutral-400 uppercase tracking-widest font-mono mb-6">
          {car.category}
        </p>

        {/* Specs Grid */}
        <div className="grid grid-cols-3 gap-2 py-4 border-y border-white/10 mb-6 bg-white/[0.02] rounded-xl px-3 text-center">
          <div>
            <span className="block text-[10px] uppercase font-mono tracking-wider text-neutral-500">
              Güç
            </span>
            <span className="text-sm font-bold text-white">{car.specs.hp} HP</span>
          </div>
          <div>
            <span className="block text-[10px] uppercase font-mono tracking-wider text-neutral-500">
              0-100 km/h
            </span>
            <span className="text-sm font-bold text-emerald-400">{car.specs.zeroToHundred}</span>
          </div>
          <div>
            <span className="block text-[10px] uppercase font-mono tracking-wider text-neutral-500">
              Maks Hız
            </span>
            <span className="text-sm font-bold text-white">{car.specs.topSpeed}</span>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-between pt-2">
        <div>
          <span className="block text-[10px] uppercase font-mono tracking-wider text-neutral-500">
            Motor
          </span>
          <span className="text-xs font-medium text-neutral-300 line-clamp-1">
            {car.specs.engine}
          </span>
        </div>

        <Link
          href={`/cars/${car.id}`}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs uppercase tracking-wider bg-gradient-to-r from-emerald-500 to-teal-500 text-black shadow-lg shadow-emerald-500/25 hover:brightness-110 active:scale-95 transition-all"
        >
          <span>3D İncele & Kirala</span>
          <svg
            className="w-4 h-4 transition-transform group-hover:translate-x-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            />
          </svg>
        </Link>
      </div>
    </div>
  );
}
