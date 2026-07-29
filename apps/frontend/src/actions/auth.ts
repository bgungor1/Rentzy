'use server';

import { cookies } from 'next/headers';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  fullName: string;
}

export async function loginAction(payload: LoginPayload) {
  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      const errorMessage = Array.isArray(data.message)
        ? data.message.join(', ')
        : data.message || 'Giriş işlemi başarısız oldu.';

      return { error: errorMessage };
    }

    const cookieStore = await cookies();
    cookieStore.set('access_token', data.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24,
      path: '/',
    });

    return { success: true, user: data.user };
  } catch (error) {
    return { error: 'Sunucuya bağlanılamadı. Lütfen backend servisinin açık olduğundan emin olun.' };
  }
}

export async function registerAction(payload: RegisterPayload) {
  try {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      const errorMessage = Array.isArray(data.message)
        ? data.message.join(', ')
        : data.message || 'Kayıt işlemi başarısız oldu.';

      return { error: errorMessage };
    }

    return { success: true };
  } catch (error) {
    return { error: 'Sunucuya bağlanılamadı. Lütfen backend servisinin açık olduğundan emin olun.' };
  }
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete('access_token');
  return { success: true };
}
