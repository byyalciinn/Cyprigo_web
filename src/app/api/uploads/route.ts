import { NextResponse } from "next/server"
import { readdir, stat } from "fs/promises"
import path from "path"
import { existsSync } from "fs"

export const runtime = "nodejs"

interface UploadedImage {
  url: string
  filename: string
  size: number
  uploadedAt: string
}

export async function GET() {
  try {
    const uploadsDir = path.join(process.cwd(), "public", "uploads", "blog")

    if (!existsSync(uploadsDir)) {
      return NextResponse.json({ images: [] })
    }

    const files = await readdir(uploadsDir)
    const imageExtensions = [".jpg", ".jpeg", ".png", ".webp", ".gif"]

    const images: UploadedImage[] = []

    for (const filename of files) {
      const ext = path.extname(filename).toLowerCase()
      if (!imageExtensions.includes(ext)) continue

      const filepath = path.join(uploadsDir, filename)
      const fileStat = await stat(filepath)

      images.push({
        url: `/uploads/blog/${filename}`,
        filename,
        size: fileStat.size,
        uploadedAt: fileStat.mtime.toISOString(),
      })
    }

    // Sort by upload date (newest first)
    images.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())

    return NextResponse.json({ images })
  } catch (error) {
    console.error("Error listing uploads:", error)
    return NextResponse.json(
      { error: "Dosyalar listelenemedi." },
      { status: 500 }
    )
  }
}
