'use client';

import Link from 'next/link';
import { logoutAction } from '@/actions/auth';
import { useRouter, usePathname } from 'next/navigation';

interface AuthNavButtonsProps {
  isLoggedIn: boolean;
}

export default function AuthNavButtons({ isLoggedIn }: AuthNavButtonsProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    await logoutAction();
    router.push('/login');
    router.refresh();
  };

  const loginHref =
    pathname && pathname !== '/login'
      ? `/login?redirect=${encodeURIComponent(pathname)}`
      : '/login';

  if (isLoggedIn) {
    return (
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
    );
  }

  return (
    <div className="flex items-center gap-3">
      <Link
        href={loginHref}
        className="px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-white/10 hover:bg-white/20 border border-white/10 text-white backdrop-blur-md transition-all hover:scale-105 active:scale-95"
      >
        Giriş Yap
      </Link>
      <Link
        href="/register"
        className="px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-emerald-500 hover:bg-emerald-400 text-black shadow-lg shadow-emerald-500/20 transition-all hover:scale-105 active:scale-95"
      >
        Kayıt Ol
      </Link>
    </div>
  );
}
