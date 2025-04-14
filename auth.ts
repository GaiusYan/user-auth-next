import NextAuth from "next-auth";
import {PrismaAdapter } from "@auth/prisma-adapter";
import {db} from "@/lib/db";
import authConfig from "@/auth.config";
import { getUserById } from "@/data/user";
import { UserRole } from "@prisma/client";




export const { handlers, auth,signIn,signOut
 } = NextAuth({
  events : {
    async linkAccount({ user}) {
      await db.user.update({
        where : { id: user.id },
        data : { emailVerified: new Date() }
      })
    }
  },
  callbacks: {

    /* async signIn({user}){

      const existingUser = await getUserByEmail(user.id as string);

      if (!existingUser || !existingUser.emailVerified) {
        return false;
      }

      return true;
    }, */
    async session({token, session}){

      if (token.sub && session.user) {
        session.user.id = token.sub;
      }


      if (token.role && session.user) {
        session.user.role = token.role as UserRole;
      } 
      console.log(session);
      
      return session;

    },
    async jwt({token}){


      console.log("it's token",token);
      
      if (!token.sub) return token;
      const existingUser = await getUserById(token.sub);
      
      token.role = existingUser?.role;
      if (!existingUser) return token;
      return token;
    }
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig, 
});