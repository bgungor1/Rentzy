'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { logoutAction, checkAuthAction } from '@/actions/auth';
import { useRouter, usePathname } from 'next/navigation';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    checkAuthAction().then((isAuth) => setIsLoggedIn(isAuth));
  }, [pathname]);

  const loginHref =
    pathname && pathname !== '/login'
      ? `/login?redirect=${encodeURIComponent(pathname)}`
      : '/login';

  const handleLogout = async () => {
    await logoutAction();
    setIsLoggedIn(false);
    router.push('/login');
    router.refresh();
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-neutral-950/80 border-b border-white/10 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-emerald-500 to-cyan-500 p-[1px] shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-neutral-950 rounded-[11px] flex items-center justify-center font-bold text-white tracking-widest text-lg font-mono">
              RZ
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-extrabold tracking-wider text-white group-hover:text-emerald-400 transition-colors uppercase font-sans">
              RENTZY
            </span>
            <span className="text-[10px] tracking-widest text-neutral-400 font-mono -mt-1 uppercase">
              Luxury 3D Garage
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-300">
          <Link
            href="/"
            className="hover:text-white transition-colors relative py-1 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-emerald-500 after:scale-x-0 hover:after:scale-x-100 after:transition-transform"
          >
            Ana Sayfa
          </Link>
          <Link
            href="/#garage"
            className="hover:text-white transition-colors relative py-1 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-emerald-500 after:scale-x-0 hover:after:scale-x-100 after:transition-transform"
          >
            Filomuz
          </Link>
          <Link
            href="/showroom"
            className="hover:text-white transition-colors relative py-1 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-emerald-500 after:scale-x-0 hover:after:scale-x-100 after:transition-transform"
          >
            3D Showroom
          </Link>
        </nav>

        {/* Auth CTA */}
        {isLoggedIn ? (
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-block text-[11px] font-mono font-semibold tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full uppercase">
              Oturum Açık
            </span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              Çıkış Yap
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link
              href={loginHref}
              className="px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-emerald-500 hover:bg-emerald-400 text-black shadow-lg shadow-emerald-500/20 transition-all hover:scale-105 active:scale-95"
            >
              Giriş Yap
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
