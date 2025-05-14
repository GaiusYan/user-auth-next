"use server";

import * as z from "zod";
import { SettingsSchema } from "@/schemas";
import { getUserById } from "@/data/user";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";


export const settings = async (
    values: z.infer<typeof SettingsSchema>
) => {

    const user = await currentUser();

    
    if (!user) {
        return {error: "Unauthorized"}
    }
    
    const dbUser = await getUserById(user?.id as string);

    await db.user.update(
        {
            where: {
                id: dbUser?.id
            },
            data: {
                ...values,
            }
        }
    )

    return {success : "Settings updated"};

}