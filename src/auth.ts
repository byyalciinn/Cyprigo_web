import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

import { getUserByEmail, verifyPassword } from "@/lib/auth-users"

const REMEMBER_ME_MAX_AGE = 60 * 60 * 12
const DEFAULT_MAX_AGE = 60 * 60 * 2

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: REMEMBER_ME_MAX_AGE,
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        rememberMe: { label: "Remember me", type: "checkbox" },
      },
      async authorize(credentials) {
        const email =
          typeof credentials?.email === "string" ? credentials.email : ""
        const password =
          typeof credentials?.password === "string" ? credentials.password : ""
        const rememberMe =
          credentials?.rememberMe === "true" || credentials?.rememberMe === "on"

        if (!email || !password) {
          return null
        }

        const user = await getUserByEmail(email)
        if (!user) {
          return null
        }

        const isValid = await verifyPassword(password, user.passwordHash)
        if (!isValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          rememberMe,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.email = user.email
        token.name = user.name
        token.role = (user as { role?: string }).role

        const rememberMe = Boolean(
          (user as { rememberMe?: boolean }).rememberMe
        )
        token.rememberMe = rememberMe
        token.sessionExpiresAt =
          Date.now() + (rememberMe ? REMEMBER_ME_MAX_AGE : DEFAULT_MAX_AGE) * 1000
      }

      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string | undefined
      }

      if (token.sessionExpiresAt) {
        session.expires = new Date(token.sessionExpiresAt).toISOString()
      }

      return session
    },
  },
}
