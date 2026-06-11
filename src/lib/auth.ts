import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        try {
          const res = await fetch(
            `${process.env.WORDPRESS_API_URL}/jwt-auth/v1/token`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                username: credentials.email,
                password: credentials.password,
              }),
            }
          );
          const data = await res.json();
          if (!res.ok || !data.token) return null;

          const userRes = await fetch(
            `${process.env.WORDPRESS_API_URL}/wp/v2/users/me?context=edit`,
            { headers: { Authorization: `Bearer ${data.token}` } }
          );
          const user = await userRes.json();

          // Get credits from custom endpoint
          const creditsRes = await fetch(
            `${process.env.WORDPRESS_API_URL}/bgremover/v1/credits`,
            { headers: { Authorization: `Bearer ${data.token}` } }
          );
          const creditsData = creditsRes.ok ? await creditsRes.json() : { credits: 0 };

          return {
            id: String(user.id),
            name: user.name ?? user.display_name,
            email: user.email,
            token: data.token,
            credits: creditsData.credits ?? 0,
            avatar: user.avatar_urls?.["96"] ?? "",
          };
        } catch {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.wpToken = (user as any).token;
        token.credits = (user as any).credits;
        token.avatar = (user as any).avatar;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id as string;
      session.user.wpToken = token.wpToken as string;
      session.user.credits = token.credits as number;
      session.user.avatar = token.avatar as string;
      return session;
    },
  },
  pages: { signIn: "/auth/signin", signOut: "/" },
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
};
