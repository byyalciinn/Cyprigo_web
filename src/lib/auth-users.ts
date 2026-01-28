import { promises as fs } from "fs"
import path from "path"
import bcrypt from "bcryptjs"

export type StoredUser = {
  id: string
  email: string
  name: string
  passwordHash: string
  role?: string
}

type UserStore = {
  users: StoredUser[]
}

const dataFile = path.join(process.cwd(), "data", "users.json")

const ensureUserStore = async () => {
  await fs.mkdir(path.dirname(dataFile), { recursive: true })
  try {
    await fs.access(dataFile)
  } catch {
    await fs.writeFile(dataFile, JSON.stringify({ users: [] }, null, 2))
  }
}

const readUserStore = async (): Promise<UserStore> => {
  await ensureUserStore()
  const raw = await fs.readFile(dataFile, "utf8")
  const parsed = JSON.parse(raw) as UserStore
  return { users: Array.isArray(parsed?.users) ? parsed.users : [] }
}

const normalizeEmail = (value: string) => value.trim().toLowerCase()

export const getUserByEmail = async (email: string) => {
  const store = await readUserStore()
  const normalized = normalizeEmail(email)
  return store.users.find((user) => normalizeEmail(user.email) === normalized)
}

export const verifyPassword = async (plainText: string, passwordHash: string) =>
  bcrypt.compare(plainText, passwordHash)
