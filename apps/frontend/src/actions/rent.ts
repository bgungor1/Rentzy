'use server';

import { cookies } from 'next/headers';
import { rentCarSchema, RentCarInput } from '@/validations/rent.schema';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export async function rentCarAction(payload: RentCarInput | string) {
    const cookieStore = await cookies();
    const token = cookieStore.get('access_token')?.value;

    if (!token) {
        return {
            success: false,
            message: 'Kiralama yapmak için lütfen önce giriş yapın.',
        };
    }

    const defaultStart = new Date();
    defaultStart.setDate(defaultStart.getDate() + 1);

    const defaultEnd = new Date();
    defaultEnd.setDate(defaultEnd.getDate() + 4);

    let variantId: string;
    let startIso: string;
    let endIso: string;

    if (typeof payload === 'string') {
        variantId = payload;
        startIso = defaultStart.toISOString();
        endIso = defaultEnd.toISOString();
    } else {
        const parsed = rentCarSchema.safeParse(payload);
        if (!parsed.success) {
            return {
                success: false,
                message: parsed.error.issues[0]?.message || 'Geçersiz kiralama bilgileri.',
            };
        }
        variantId = parsed.data.variantId;
        startIso = new Date(parsed.data.startDate).toISOString();
        endIso = new Date(parsed.data.endDate).toISOString();
    }

    try {
        const res = await fetch(`${API_URL}/reservations`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                variantId,
                startDate: startIso,
                endDate: endIso,
            }),
        });

        const data = await res.json();

        if (!res.ok) {
            const errorMessage = Array.isArray(data.message)
                ? data.message.join(', ')
                : data.message || 'Kiralama işlemi başarısız oldu.';

            return { success: false, message: errorMessage };
        }

        return {
            success: true,
            message: 'Harika! Araç başarıyla kiralandı.',
            data,
        };
    } catch (error) {
        return {
            success: false,
            message: 'Sunucuya bağlanılamadı. Lütfen backend servisinin açık olduğundan emin olun.',
        };
    }
}