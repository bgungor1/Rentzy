'use server';

import { cookies } from 'next/headers';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export interface RentCarPayload {
    variantId: string;
    startDate?: string;
    endDate?: string;
}

export async function rentCarAction(payload: RentCarPayload | string) {
    const cookieStore = await cookies();
    const token = cookieStore.get('access_token')?.value;

    if (!token) {
        return {
            success: false,
            message: 'Kiralama yapmak için lütfen önce giriş yapın.',
        };
    }

    const variantId = typeof payload === 'string' ? payload : payload.variantId;

    const defaultStart = new Date();
    defaultStart.setDate(defaultStart.getDate() + 1);

    const defaultEnd = new Date();
    defaultEnd.setDate(defaultEnd.getDate() + 4);

    const startIso =
        typeof payload === 'object' && payload.startDate
            ? new Date(payload.startDate).toISOString()
            : defaultStart.toISOString();

    const endIso =
        typeof payload === 'object' && payload.endDate
            ? new Date(payload.endDate).toISOString()
            : defaultEnd.toISOString();

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