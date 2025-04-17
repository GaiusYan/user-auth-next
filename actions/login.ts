"use server";

import { signIn } from "@/auth";
import * as z from "zod";
import { loginSchema } from "@/schemas";
import { DEFAULT_LOGIN_REDIRECT } from "@/route";
import { AuthError } from "next-auth";
import { generateVerificationToken } from "@/lib/token";
import { getUserByEmail } from "@/data/user";
import { sendTwoFactorTokenEmail, sendVerificationEmail } from "@/lib/mail";
import { generateTwoFactorToken} from "@/lib/token";
import { getTwoFactorToken, getTwoFactorTokenByEmail } from "@/data/two-factor-token";
import { db } from "@/lib/db";
import { getTwoFactorConfirmationByUserId } from "@/data/two-factor-confirmation";
export const login =  async (values: z.infer<typeof loginSchema>) => {
    const validatedFields = loginSchema.safeParse(values);

    if (!validatedFields.success) {
        return {error: "Validation failed"};
    } 


    const { email, password, code } = validatedFields.data;

    const existingUser = await getUserByEmail(email);

    if (!existingUser || !existingUser.email || !existingUser.password){
        return {error : "Email don't exists"};
    }

    if (!existingUser.emailVerified){

        if (code){
            // TODO : Verify the code
            const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);

            if (!twoFactorToken){
                return {error : "Invalid code"};
            }

            if (twoFactorToken.token !== code){
                return {error : "Invalid code"};
            }

            const hashExpires = new Date(twoFactorToken.expires) < new Date();
            if (hashExpires){
                return {error : "Code expired"};
            }

            await db.twoFactorToken.delete({
                where: {
                    id: twoFactorToken.id
                }
            });

            const existingConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id);
            
            if (existingConfirmation){
                await db.twoFactorConfirmation.delete({
                    where: {
                        id: existingConfirmation.id
                    }
                })
            }

            await db.twoFactorConfirmation.create({
                data: {
                    userId: existingUser.id
                }
            })
        } else {
            const verificationToken = await generateVerificationToken(existingUser.email);

            await sendVerificationEmail(
                verificationToken.email,
                verificationToken.token
            );
            return { success : "Confirmation email sent!"}
        }
    }


    
    if (existingUser.isTwoFactorEnabled && existingUser.email) {
        const twoFactorToken = await generateTwoFactorToken(existingUser.email);    
          await sendTwoFactorTokenEmail(
            twoFactorToken.email,
            twoFactorToken.token
        );
        return {twoFactorToken: true};
    }


    try {
        await signIn("credentials", {
            email,
            password,
            redirectTo: DEFAULT_LOGIN_REDIRECT
        });
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return {error: "Invalid credentials"};
                default:
                    return {error: "Something went wrong"};
            }
        }
        throw error;
    }
}