import * as yup from 'yup';

export const loginSchema = yup.object({
  email: yup
    .string()
    .email('Format email tidak valid')
    .required('Email harus diisi'),
  password: yup
    .string()
    .min(8, 'Password minimal 8 karakter')
    .required('Password harus diisi'),
});

export const registerSchema = yup.object({
  name: yup
    .string()
    .min(2, 'Nama minimal 2 karakter')
    .required('Nama harus diisi'),
  email: yup
    .string()
    .email('Format email tidak valid')
    .required('Email harus diisi'),
  password: yup
    .string()
    .min(8, 'Password minimal 8 karakter')
    .required('Password harus diisi'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Konfirmasi password tidak sama')
    .required('Konfirmasi password harus diisi'),
});

export const forgotPasswordSchema = yup.object({
  email: yup
    .string()
    .email('Format email tidak valid')
    .required('Email harus diisi'),
});

export type LoginFormData = yup.InferType<typeof loginSchema>;
export type RegisterFormData = yup.InferType<typeof registerSchema>;
export type ForgotPasswordFormData = yup.InferType<typeof forgotPasswordSchema>;
