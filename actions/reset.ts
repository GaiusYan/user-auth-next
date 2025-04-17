"use server"

import * as z from "zod";
import { ResetSchema } from "@/schemas";
import { getUserByEmail } from "@/data/user";
import { sendPasswordResetEmail } from "@/lib/mail";
import { generatePasswordResetToken } from "@/lib/token";

export const reset = async (values: z.infer<typeof ResetSchema>) => {

    const validatedFields = ResetSchema.safeParse(values);

    if (!validatedFields.success) {
        return {error: "Validation failed"};
    }

    const { email } = validatedFields.data;
    const existingUser = await getUserByEmail(email);

    if (!existingUser){
        return {error : "Email don't exists"};
    }

    // todo : Generate token and reset
    const passwordResetToken = await generatePasswordResetToken(email);
    console.log(passwordResetToken);
    
    if (existingUser.email)
    await sendPasswordResetEmail(
        passwordResetToken.email,
        passwordResetToken.token);
    return { success : "Confirmation email sent!"}
}