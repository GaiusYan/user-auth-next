import NextAuth from "next-auth";
import {PrismaAdapter } from "@auth/prisma-adapter";
import {db} from "@/lib/db";
import authConfig from "@/auth.config";
import { getUserByEmail, getUserById } from "@/data/user";



export const { handlers, auth,signIn,signOut
 } = NextAuth({
  callbacks: {
    async session({token, session}){

      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token.role && session.user) {
        session.user.role = token.role;
      } 
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