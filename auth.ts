import NextAuth from "next-auth";
import {PrismaAdapter } from "@auth/prisma-adapter";
import {db} from "@/lib/db";
import authConfig from "@/auth.config";
import { getUserById } from "@/data/user";
import { UserRole } from "@prisma/client";
import { getTwoFactorConfirmationByUserId } from "@/data/two-factor-confirmation";
import { getAccountByUserId } from "./data/account";



export const { handlers, auth,signIn,signOut
 } = NextAuth({
  pages: {
    signIn: "/auth/login",
    error: "auth/error"
  },
  events : {
    async linkAccount({ user}) {
      await db.user.update({
        where : { id: user.id },
        data : { emailVerified: new Date() }
      })
    }
  },
  callbacks: {

    async signIn({user, account}){
      
      // allow OAuth without email verification
      if (account?.provider !== "credentials") return true;

      if (!user.id) {
        throw new Error("User ID is missing");
      }
      const existingUser = await getUserById(user.id);

      // prevent sign in without email verification
      if (!existingUser?.emailVerified) return false;

      //TODO : add 2FA check

      if (existingUser.isTwoFactorEnabled) {
        const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id);

        if (!twoFactorConfirmation) {
          return false;
        }
        
        //console.log("twoFactorConfirmation", twoFactorConfirmation);
        
        await db.twoFactorConfirmation.delete({
          where : {
            id : twoFactorConfirmation.id
          }
        });
      }
      
      return true;
    },
    async session({token, session}){

      if (token.sub && session.user) {
        session.user.id = token.sub;
      }


      if (token.role && session.user) {
        session.user.role = token.role as UserRole;
      } 

      
      if (session.user) {
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;
      } 

      if  (session.user){
        session.user.name = token.name;
        session.user.email = token.email as string;
        session.user.isOAuth = token.isOAuth as boolean;
      }
      
      return session;

    },
    async jwt({token}){    
      if (!token.sub) return token;
      const existingUser = await getUserById(token.sub);
      

      const existingAccount = await getAccountByUserId(existingUser.id);

      token.isOAuth = !!existingAccount;
      token.name = existingUser.name;
      token.role = existingUser?.role;
      token.email = existingUser.email;
      token.isTwoFactorEnabled = existingUser?.isTwoFactorEnabled;
      if (!existingUser) return token;
      return token;
    }
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig, 
});