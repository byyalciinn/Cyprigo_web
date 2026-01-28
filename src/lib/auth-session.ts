import type { Session } from "next-auth"

export const isSessionValid = (session: Session | null | undefined) => {
  if (!session?.user) return false
  if (session.user.role && session.user.role !== "admin") return false
  if (!session.expires) return false
  return new Date(session.expires).getTime() > Date.now()
}
