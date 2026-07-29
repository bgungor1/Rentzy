import Link from "next/link";

export default function LoginPage() {
    return (
        <main className="min-h-screen bg-neutral-950 flex items-center justify-center p-6 font-sans text-white">
            <div className="w-full max-w-md border border-white/10 bg-white/5 backdrop-blur-md p-8 rounded-2xl shadow-2xl">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-white to-neutral-500">
                        Rentzy
                    </h1>
                    <p className="text-neutral-400 text-sm">Devam etmek için giriş yapın</p>
                </div>
                <form className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-neutral-400 mb-2">
                            E-Posta Adresi
                        </label>
                        <input
                            type="email"
                            name="email"
                            placeholder="ornek@mail.com"
                            className="w-full bg-neutral-900/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white/30 transition-colors"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-neutral-400 mb-2">
                            Şifre
                        </label>
                        <input
                            type="password"
                            name="password"
                            placeholder="••••••••"
                            className="w-full bg-neutral-900/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white/30 transition-colors"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-white text-black font-bold rounded-lg px-4 py-3 mt-4 hover:bg-neutral-300 transition-colors shadow-lg"
                    >
                        Giriş Yap
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-neutral-500">
                    Hesabınız yok mu?{" "}
                    <Link href="/register" className="text-white hover:underline">
                        Kayıt Ol
                    </Link>
                </div>
            </div>
        </main>
    );
}