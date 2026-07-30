import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'E-posta adresi zorunludur' })
    .email({ message: 'Geçerli bir e-posta adresi giriniz' }),
  password: z
    .string()
    .min(1, { message: 'Şifre zorunludur' })
    .min(6, { message: 'Şifre en az 6 karakter olmalıdır' }),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  fullName: z
    .string()
    .min(1, { message: 'Ad Soyad alanı zorunludur' })
    .min(2, { message: 'Ad Soyad en az 2 karakter olmalıdır' }),
  email: z
    .string()
    .min(1, { message: 'E-posta adresi zorunludur' })
    .email({ message: 'Geçerli bir e-posta adresi giriniz' }),
  password: z
    .string()
    .min(1, { message: 'Şifre zorunludur' })
    .min(6, { message: 'Şifre en az 6 karakter olmalıdır' }),
});

export type RegisterInput = z.infer<typeof registerSchema>;
