"use server";
import { getPasswordResetTokenByToken } from "@/data/password-reset-token";
import { getUserByEmail } from "@/data/user";
import { NewPasswordSchema } from "@/schemas";
import * as z from "zod";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
export const newPassword = async (
    values : z.infer<typeof NewPasswordSchema>,
    token?: string | null
) =>{

    if (!token){
        return  {error : "Invalid token"}
    }

    const validitedFields = NewPasswordSchema.safeParse(values);

    if (!validitedFields.success) {
        return {error: "Invalid fields"};
    }

    const {password} = validitedFields.data;

    const existingToken = await getPasswordResetTokenByToken(token);

    if (!existingToken) {
        return {error: "Invalid token"};
    }

    const hasExpired = new Date(existingToken.expires) < new Date();

    if (hasExpired) {
        return {error: "Token expired"};
    }

    const existingUser = await getUserByEmail(existingToken.email);

    if (!existingUser) {
        return {error: "Email doesn't exist"};
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.user.update({
        where: {
            id: existingUser.id
        },
        data: {
            password: hashedPassword
        }
    })

    await db.passwordResetToken.delete({
        where: {
            id: existingToken.id
        }
    })

    return {success: "Password updated successfully"};
}