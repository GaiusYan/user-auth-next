"use server";

import { signIn } from "@/auth";
import * as z from "zod";
import { loginSchema } from "@/schemas";
import { DEFAULT_LOGIN_REDIRECT } from "@/route";
import { AuthError } from "next-auth";

export const login =  async (values: z.infer<typeof loginSchema>) => {
    const validatedFields = loginSchema.safeParse(values);

    if (!validatedFields.success) {
        return {error: "Validation failed"};
    } 


    const { email, password } = validatedFields.data;

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