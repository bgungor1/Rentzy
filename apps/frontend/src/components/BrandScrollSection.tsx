'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

export interface Brand {
  id: string;
  name: string;
  logo: string;
  description: string;
}

const BRANDS: Brand[] = [
  {
    id: 'ALL',
    name: 'Tüm Filo',
    logo: '',
    description: 'Tüm lüks ve spor araç koleksiyonumuz',
  },
  {
    id: 'BMW',
    name: 'BMW',
    logo: '/logos/bmw.svg',
    description: 'M Serisi mühendislik harikası spor modeller',
  },
  {
    id: 'Ferrari',
    name: 'Ferrari',
    logo: '/logos/ferrari.svg',
    description: 'Şahlanan atın saf V12 ve hiper otomobil tutkusu',
  },
  {
    id: 'Mercedes-Benz',
    name: 'Mercedes-Benz / AMG',
    logo: '/logos/mercedes-benz.svg',
    description: 'Alman lüksü, Gullwing klasiği ve GT3 Evo yarışı',
  },
];

interface BrandScrollSectionProps {
  selectedBrand: string;
  onSelectBrand: (brandId: string) => void;
}

export default function BrandScrollSection({
  selectedBrand,
  onSelectBrand,
}: BrandScrollSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(
    () => {
      if (!containerRef.current) return;

      // Animate brand cards entry with GSAP
      gsap.fromTo(
        cardsRef.current,
        {
          y: 40,
          opacity: 0,
          scale: 0.95,
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
        }
      );
    },
    { scope: containerRef }
  );

  return (
    <section ref={containerRef} className="py-16 relative">
      <div className="text-center mb-10">
        <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-4 py-1.5 rounded-full border border-emerald-500/20">
          Prestijli Üreticiler
        </span>
        <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mt-4">
          Dünyanın En Seçkin Markaları
        </h2>
        <p className="text-neutral-400 text-sm md:text-base mt-2 max-w-xl mx-auto">
          İstediğiniz markanın amblemine tıklayarak garajımızı filtreleyin.
        </p>
      </div>

      {/* Interactive Brand Logo Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto px-6">
        {BRANDS.map((brand, index) => {
          const isSelected = selectedBrand === brand.id;

          return (
            <div
              key={brand.id}
              ref={(el) => {
                cardsRef.current[index] = el;
              }}
              onClick={() => onSelectBrand(brand.id)}
              className={`group cursor-pointer relative overflow-hidden rounded-2xl p-6 transition-all duration-500 border backdrop-blur-xl flex flex-col justify-between items-center text-center ${
                isSelected
                  ? 'bg-gradient-to-b from-emerald-500/20 via-neutral-900/90 to-neutral-950 border-emerald-500/60 shadow-xl shadow-emerald-500/10 scale-105'
                  : 'bg-white/5 hover:bg-white/10 border-white/10 hover:border-white/20 hover:scale-[1.02]'
              }`}
            >
              {/* Glowing Background Effect */}
              <div
                className={`absolute inset-0 bg-gradient-to-tr from-emerald-500/10 via-transparent to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
              />

              {/* Logo / Badge */}
              <div className="w-20 h-20 mb-4 relative flex items-center justify-center">
                {brand.logo ? (
                  <div className="w-16 h-16 relative transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                    <Image
                      src={brand.logo}
                      alt={brand.name}
                      fill
                      className="object-contain filter invert brightness-200 contrast-200 group-hover:drop-shadow-[0_0_12px_rgba(16,185,129,0.5)] transition-all"
                    />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center font-bold text-emerald-400 text-lg">
                    ALL
                  </div>
                )}
              </div>

              {/* Brand Details */}
              <div className="relative z-10">
                <h3
                  className={`text-xl font-bold transition-colors ${
                    isSelected ? 'text-emerald-400' : 'text-white group-hover:text-emerald-300'
                  }`}
                >
                  {brand.name}
                </h3>
                <p className="text-xs text-neutral-400 mt-2 line-clamp-2">{brand.description}</p>
              </div>

              {/* Selection Badge */}
              <div
                className={`mt-4 px-4 py-1 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${
                  isSelected
                    ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/30'
                    : 'bg-white/10 text-neutral-300 group-hover:bg-white/20'
                }`}
              >
                {isSelected ? 'Seçili Marka' : 'İncele'}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
