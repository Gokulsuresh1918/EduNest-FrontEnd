
import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import { User, Account, Profile } from "next-auth";
import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL;

const authOptions = {

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",
    }),
  ],

  
  callbacks: {
    async signIn({    
      user,
      account,
      profile,
    }: {
      user: User;
      account: Account | null;
      profile?: Profile;
    }) {
      if (account?.provider === "google") {
        try {
          const response = await axios.post(`${BASE_URL}/auth/googlelogin`, {
            email: user.email,
            name: user.name,
            profileData: profile,
          });
          if(response){
            // console.log('user authenticated succesfully');
            
          }
         
        } catch (error: any) {
          console.error("Error sending data to backend:", error.message);
        }
      }
      return true;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
