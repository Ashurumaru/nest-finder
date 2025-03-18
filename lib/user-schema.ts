import { z } from 'zod';

export const loginUserSchema = z.object({
  email: z.string().min(1, 'Email обязателен').email('Неверный формат email'),
  password: z.string().min(1, 'Пароль обязателен'),
});

export const createUserSchema = z.object({
  name: z.string().min(1, 'Имя обязательно'),
  email: z.string().min(1, 'Email обязателен').email('Неверный формат email'),
  password: z
      .string()
      .min(1, 'Пароль обязателен')
      .min(8, 'Пароль должен содержать минимум 8 символов'),
  passwordConfirm: z.string().min(1, 'Подтверждение пароля обязательно'),
  acceptTerms: z.literal(true, {
    errorMap: () => ({ message: 'Вы должны принять Условия использования и Политику конфиденциальности' }),
  }),
}).refine((data) => data.password === data.passwordConfirm, {
  message: 'Пароли не совпадают',
  path: ['passwordConfirm'],
});

export type LoginUserInput = z.infer<typeof loginUserSchema>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
