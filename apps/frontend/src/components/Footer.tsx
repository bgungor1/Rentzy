import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-neutral-950 py-12 px-6 mt-auto relative z-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-neutral-400 text-xs font-mono">
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
  );
}
