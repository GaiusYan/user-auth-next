"use server";

import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import * as z from "zod";
import { RegisterSchema } from "@/schemas";
import { getUserByEmail } from "@/data/user";
import { generateVerificationToken } from "@/lib/token";
import { sendVerificationEmail } from "@/lib/mail";


export const register =  async (values: z.infer<typeof RegisterSchema>) => {
    const validatedFields = RegisterSchema.safeParse(values);

    if (!validatedFields.success) {
        return {error: "Validation failed"};
    }

    const { email,password,name } = validatedFields.data;
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
        return { error: "Email already exists" };
    }


    await db.user.create({
        data: {
            email,
            password: hashedPassword,
            name,
        }
    });

    const verificationToken = await generateVerificationToken(email);


    await sendVerificationEmail(
        verificationToken.email, 
        verificationToken.token);
    return { success: "Confirmation email sent" };
}