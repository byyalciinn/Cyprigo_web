"use client"

import { useCallback, useState } from "react"
import { ImagePlus, Loader2, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface ImageUploaderProps {
  value: string
  onChange: (url: string) => void
  className?: string
}

export function ImageUploader({ value, onChange, className }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFile = useCallback(async (file: File) => {
    setError(null)
    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Yükleme başarısız.")
      }

      onChange(result.url)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Yükleme başarısız.")
    } finally {
      setIsUploading(false)
    }
  }, [onChange])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files.length > 0) {
      const file = files[0]
      if (file.type.startsWith("image/")) {
        handleFile(file)
      } else {
        setError("Sadece resim dosyaları kabul edilir.")
      }
    }
  }, [handleFile])

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFile(files[0])
    }
  }, [handleFile])

  const handleRemove = useCallback(() => {
    onChange("")
    setError(null)
  }, [onChange])

  return (
    <div className={cn("space-y-2", className)}>
      {value ? (
        <div className="relative rounded-lg overflow-hidden border border-slate-200 bg-slate-50">
          <img
            src={value}
            alt="Kapak resmi"
            className="w-full h-40 object-cover"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 text-slate-600 hover:bg-white hover:text-slate-900 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <label
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "flex flex-col items-center justify-center gap-3 p-6 rounded-lg border-2 border-dashed cursor-pointer transition-colors",
            isDragging
              ? "border-slate-400 bg-slate-100"
              : "border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-slate-100",
            isUploading && "pointer-events-none opacity-60"
          )}
        >
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleInputChange}
            className="hidden"
            disabled={isUploading}
          />
          {isUploading ? (
            <>
              <Loader2 className="h-8 w-8 text-slate-400 animate-spin" />
              <span className="text-sm text-slate-500">Yükleniyor...</span>
            </>
          ) : (
            <>
              <ImagePlus className="h-8 w-8 text-slate-400" />
              <div className="text-center">
                <p className="text-sm font-medium text-slate-600">
                  Sürükle bırak veya tıkla
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  PNG, JPG, WebP veya GIF (maks. 5MB)
                </p>
              </div>
            </>
          )}
        </label>
      )}
      {error && (
        <p className="text-xs text-red-600">{error}</p>
      )}
    </div>
  )
}
