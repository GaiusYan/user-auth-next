import * as z from 'zod';

export const loginSchema = z.object({
  email: z.string().email({
    message: 'Le mail est réquis',
  }),
  password: z.string().min(1,{
    message: 'Le mot de passe est réquis',
  }),
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