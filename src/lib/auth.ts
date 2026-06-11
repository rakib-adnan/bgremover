import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  providers: [
    // Google OAuth (only enabled if credentials are set)
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),

    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        try {
          const res = await fetch(`${process.env.WORDPRESS_API_URL}/jwt-auth/v1/token`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: credentials.email, password: credentials.password }),
          });
          const data = await res.json();
          if (!res.ok || !data.token) return null;

          const creditsRes = await fetch(`${process.env.WORDPRESS_API_URL}/bgremover/v1/credits`, {
            headers: { Authorization: `Bearer ${data.token}` },
          });
          const creditsData = creditsRes.ok ? await creditsRes.json() : { credits: 0 };

          return {
            id: String(data.user_id ?? data.id ?? "1"),
            name: data.user_display_name,
            email: data.user_email,
            token: data.token,
            credits: creditsData.credits ?? 0,
          };
        } catch {
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      // Handle Google sign-in: create WP account if first time
      if (account?.provider === "google") {
        try {
          await fetch(`${process.env.WORDPRESS_API_URL}/bgremover/v1/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: user.name,
              email: user.email,
              password: `Google_${user.id}_${Date.now()}`,
              social: true,
            }),
          });
          // Always allow sign-in — user may already exist or WP endpoint may differ
        } catch {
          // Continue even if WP registration fails
        }
        return true;
      }
      return true;
    },

    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.wpToken = (user as any).token ?? "";
        token.credits = (user as any).credits ?? 0;
      }
      // For Google sign-in, get WP JWT token
      if (account?.provider === "google" && user?.email) {
        try {
          const res = await fetch(`${process.env.WORDPRESS_API_URL}/bgremover/v1/social-token`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: user.email, secret: process.env.WORDPRESS_JWT_SECRET }),
          });
          if (res.ok) {
            const d = await res.json();
            token.wpToken = d.token ?? "";
            token.credits = d.credits ?? 0;
            token.id = String(d.user_id ?? "");
          }
        } catch {}
      }
      return token;
    },

    async session({ session, token }) {
      session.user.id = token.id as string;
      session.user.wpToken = token.wpToken as string;
      session.user.credits = token.credits as number;
      return session;
    },
  },

  pages: { signIn: "/auth/signin", error: "/auth/signin" },
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
};
