import { z } from 'zod';

export const rentCarSchema = z
  .object({
    variantId: z.string().min(1, { message: 'Lütfen bir araç varyantı seçiniz' }),
    startDate: z.string().min(1, { message: 'Başlangıç tarihi zorunludur' }),
    endDate: z.string().min(1, { message: 'Bitiş tarihi zorunludur' }),
  })
  .refine(
    (data) => {
      const start = new Date(data.startDate);
      const end = new Date(data.endDate);
      return end > start;
    },
    {
      message: 'Bitiş tarihi başlangıç tarihinden sonra olmalıdır',
      path: ['endDate'],
    }
  );

export type RentCarInput = z.infer<typeof rentCarSchema>;
