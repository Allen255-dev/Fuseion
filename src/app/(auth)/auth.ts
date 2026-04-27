import { env } from "~/env";
import { authConfig } from "./auth.config";
import { UserInterface } from "~/types/user";
import { convexServer, api } from "~/lib/convex-server";
import type { DefaultJWT } from "next-auth/jwt";
import NextAuth, { type DefaultSession } from "next-auth";
import Google, { GoogleProfile } from "next-auth/providers/google";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: UserInterface & DefaultSession["user"];
  }
  interface AdapterUser extends UserInterface {
    emailVerified: Date | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    user: UserInterface;
  }
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  ...authConfig,
  providers: [
    Google({
      profile(profile: GoogleProfile) {
        return {
          name: profile.name,
          email: profile.email,
          picture: profile.picture,
          userId: "google:" + profile.sub,
          preferences: { name: profile.name },
        } as UserInterface;
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        const typedUser = user as unknown as UserInterface;

        try {
          const userData = {
            userId: typedUser.userId,
            name: typedUser.name || "",
            email: typedUser.email || "",
            picture: typedUser.picture,
            preferences: typedUser.preferences,
          };

          // Use Convex upsert mutation
          await convexServer.mutation(api.users.upSertUser, userData);

        } catch (error) {
          console.error(
            "Convex user sync failed (continuing session anyway):",
            error,
          );
          return true;
        }
      }

      return !!user;
    },
    async jwt({ token, user }) {
      if (user) {
        token.user = user as UserInterface;
      }

      return token;
    },
    async session({ session, token }) {
      if (token.user) {
        session.user = token.user as UserInterface & {
          id: string;
          emailVerified: Date | null;
        };
      }

      return session;
    },
  },
  trustHost: true,
});
