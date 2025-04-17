"use server";

import { db } from "@/lib/db";
import { getUserByEmail } from "@/data/user";
import { getVerificationTokenByToken } from "@/data/verification-token";


export const newVerification = async (token: string) : Promise<{
    error: string;
    success?: undefined;
} | {
    success: string;
    error?: undefined;
}> => {

    const existingToken = await getVerificationTokenByToken(token);
    if (!existingToken) {
        return {error : "Token not found"};
    }

    const hashExpired = new Date(existingToken.expires) < new Date();
    
    if (hashExpired) {
        return {error : "Token expired"};
    }

    const existingUser = await getUserByEmail(existingToken.email);

    if (!existingUser) {
        return {error : "Email User not found"};
    }

    await db.user.update({
        where: {
            id: existingUser.id
        },
        data: {
            emailVerified: new Date(),
            email: existingToken.email,
        }
    }); 

    await db.verficationToken.delete({
        where: {
            id: existingToken.id
        }
    });
    return {success : "Successfully verified"};
}