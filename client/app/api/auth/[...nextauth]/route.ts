import { env } from "@/lib/env";
import NextAuth from "next-auth";
import KeyCloakProvider from "next-auth/providers/keycloak";

const handler = NextAuth({
  // Configure one or more authentication providers
  providers: [
    KeyCloakProvider({
      clientId: env.KEYCLOAK_CLIENT_ID,
      clientSecret: env.KEYCLOAK_CLIENT_SECRET,
      issuer: env.KEYCLOAK_ISSUER,
    }),
    // ...add more providers here
  ],
  callbacks: {},
});

export { handler as GET, handler as POST };
