import { UserRole } from '@prisma/client';
import * as z from 'zod';


export const SettingsSchema = z.object({
  name: z.optional(z.string()),
  isTwoFactorEnabled: z.optional(z.boolean()),
  role: z.enum([UserRole.ADMIN,UserRole.USER]),
  email: z.optional(z.string().email()),
  password: z.optional(z.string().min(6)),
  newPassword: z.optional(z.string().min(6))
}).refine((data) => {

  if (data.newPassword && !data.password){
    return false;
  }
  return true;
},{
  message: 'Les deux mots de passe doivent être identiques',
  path: ['password'],
})

export const ResetSchema = z.object({
  email: z.string().email({
    message: 'Le mail est réquis',
  }),
});

export const NewPasswordSchema = z.object({
  password: z.string().min(6,{
    message: 'Minimun 6 caractères réquis',
  }),
});



export const loginSchema = z.object({
  email: z.string().email({
    message: 'Le mail est réquis',
  }),
  password: z.string().min(1,{
    message: 'Le mot de passe est réquis',
  }),
  code: z.optional(z.string()),
});




export const RegisterSchema = z.object({
  email: z.string().email({
    message: 'Le mail est réquis',
  }),
  password: z.string().min(6,{
    message: 'Minimun six caractères requis',
  }),
  name : z.string().min(1,{
    message: 'Le nom est réquis',
  }),
});