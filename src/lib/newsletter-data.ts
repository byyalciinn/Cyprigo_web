import { promises as fs } from "fs"
import path from "path"
import { randomUUID } from "crypto"

import type { NewsletterSubscriber } from "./newsletter"

type NewsletterData = {
  subscribers: NewsletterSubscriber[]
}

const dataDir = path.join(process.cwd(), "data")
const dataFile = path.join(dataDir, "newsletter.json")

const ensureDataFile = async () => {
  await fs.mkdir(dataDir, { recursive: true })
  try {
    await fs.access(dataFile)
  } catch {
    const empty: NewsletterData = { subscribers: [] }
    await fs.writeFile(dataFile, JSON.stringify(empty, null, 2))
  }
}

const readNewsletterData = async (): Promise<NewsletterData> => {
  await ensureDataFile()
  const raw = await fs.readFile(dataFile, "utf8")
  const parsed = JSON.parse(raw) as NewsletterData
  return {
    subscribers: Array.isArray(parsed.subscribers) ? parsed.subscribers : [],
  }
}

const writeNewsletterData = async (data: NewsletterData) => {
  await fs.mkdir(dataDir, { recursive: true })
  await fs.writeFile(dataFile, JSON.stringify(data, null, 2))
}

const normalizeEmail = (email: string) => email.trim().toLowerCase()

export const getSubscribers = async () => {
  const data = await readNewsletterData()
  return [...data.subscribers].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

export const addSubscriber = async (email: string, source?: string) => {
  const data = await readNewsletterData()
  const normalizedEmail = normalizeEmail(email)
  const existing = data.subscribers.find(
    (subscriber) => subscriber.email.toLowerCase() === normalizedEmail
  )

  if (existing) {
    return { subscriber: existing, created: false }
  }

  const now = new Date().toISOString()
  const subscriber: NewsletterSubscriber = {
    id: `subscriber-${randomUUID()}`,
    email: normalizedEmail,
    createdAt: now,
    source,
  }

  const next = { subscribers: [subscriber, ...data.subscribers] }
  await writeNewsletterData(next)
  return { subscriber, created: true }
}

export const removeSubscriber = async (id: string) => {
  const data = await readNewsletterData()
  const next = data.subscribers.filter((subscriber) => subscriber.id !== id)
  if (next.length === data.subscribers.length) return false
  await writeNewsletterData({ subscribers: next })
  return true
}
