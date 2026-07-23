import { z } from 'zod';

export const createReservationSchema = z
  .object({
    variantId: z.string().uuid({ message: 'Geçersiz araç seçimi.' }),
    startDate: z.coerce.date().refine((date) => date >= new Date(), {
      message: 'Kiralama başlangıç tarihi geçmiş bir tarih olamaz.',
    }),
    endDate: z.coerce.date(),
  })
  .refine((data) => data.endDate > data.startDate, {
    message: 'Bitiş tarihi, başlangıç tarihinden en az 1 gün sonra olmalıdır.',
    path: ['endDate'],
  });

export type CreateReservationDto = z.infer<typeof createReservationSchema>;
