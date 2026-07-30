'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginAction } from '@/actions/auth';
import { loginSchema, LoginInput } from '@/validations/auth.schema';
import { FormInput } from '@/components/ui/FormInput';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginInput) => {
    setServerError(null);
    const result = await loginAction(data);

    if (result.error) {
      setServerError(result.error);
    } else {
      router.push(redirect);
      router.refresh();
    }
  };

  return (
    <div className="w-full max-w-md border border-white/10 bg-neutral-900/80 backdrop-blur-2xl p-8 rounded-3xl shadow-2xl relative z-10">
      {/* Header Branding */}
      <div className="mb-8 text-center">
        <Link href="/" className="inline-flex items-center gap-2 mb-4 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 via-emerald-500 to-cyan-500 p-[1px]">
            <div className="w-full h-full bg-neutral-950 rounded-[7px] flex items-center justify-center font-bold text-white tracking-widest text-xs font-mono">
              RZ
            </div>
          </div>
          <span className="text-lg font-black tracking-wider text-white uppercase font-sans">
            RENTZY
          </span>
        </Link>
        <h1 className="text-2xl font-black text-white tracking-tight">Tekrar Hoş Geldiniz</h1>
        <p className="text-neutral-400 text-xs mt-1">
          Supercar garajınıza erişmek için bilgilerinizi giriniz
        </p>
      </div>

      {/* Server Error Alert Box */}
      {serverError && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium">
          {serverError}
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <FormInput
          label="E-Posta Adresi"
          type="email"
          placeholder="ornek@mail.com"
          error={errors.email?.message}
          {...register('email')}
        />

        <FormInput
          label="Şifre"
          type="password"
          placeholder="••••••••"
          error={errors.password?.message}
          {...register('password')}
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3.5 rounded-xl font-bold text-sm uppercase tracking-wider bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-black shadow-lg shadow-emerald-500/20 hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 mt-2 cursor-pointer"
        >
          {isSubmitting ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
        </button>
      </form>

      {/* Footer Link */}
      <div className="mt-8 text-center text-xs text-neutral-400 border-t border-white/10 pt-6">
        Hesabınız yok mu?{' '}
        <Link href="/register" className="text-emerald-400 font-semibold hover:underline">
          Kayıt Ol & Keşfet
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white font-sans selection:bg-emerald-500 selection:text-black flex flex-col justify-between">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="flex-1 flex items-center justify-center p-6 pt-28">
        <Suspense fallback={<div className="text-neutral-400 text-xs font-mono">Yükleniyor...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}
