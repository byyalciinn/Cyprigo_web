"use client"

import { useCallback, useEffect, useState } from "react"
import { FolderOpen, ImagePlus, Loader2, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface UploadedImage {
  url: string
  filename: string
  size: number
  uploadedAt: string
}

interface ImageUploaderProps {
  value: string
  onChange: (url: string) => void
  className?: string
}

export function ImageUploader({ value, onChange, className }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLibraryOpen, setIsLibraryOpen] = useState(false)
  const [libraryImages, setLibraryImages] = useState<UploadedImage[]>([])
  const [isLoadingLibrary, setIsLoadingLibrary] = useState(false)

  const fetchLibraryImages = useCallback(async () => {
    try {
      setIsLoadingLibrary(true)
      const response = await fetch("/api/uploads")
      const data = await response.json()
      if (response.ok) {
        setLibraryImages(data.images || [])
      }
    } catch {
      // Silently fail
    } finally {
      setIsLoadingLibrary(false)
    }
  }, [])

  useEffect(() => {
    if (isLibraryOpen) {
      fetchLibraryImages()
    }
  }, [isLibraryOpen, fetchLibraryImages])

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

  const handleSelectFromLibrary = useCallback((url: string) => {
    onChange(url)
    setIsLibraryOpen(false)
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
        <div className="space-y-2">
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
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => setIsLibraryOpen(true)}
          >
            <FolderOpen className="h-4 w-4 mr-2" />
            Depodan Seç
          </Button>
        </div>
      )}
      {error && (
        <p className="text-xs text-red-600">{error}</p>
      )}

      {/* Library Selection Dialog */}
      <Dialog open={isLibraryOpen} onOpenChange={setIsLibraryOpen}>
        <DialogContent className="sm:max-w-2xl [&>button]:hidden" style={{ animation: "none" }}>
          <DialogHeader>
            <DialogTitle>Medya Arşivinden Seç</DialogTitle>
            <DialogDescription>
              Daha önce yüklediğiniz resimlerden birini seçin.
            </DialogDescription>
          </DialogHeader>
          <div className="pt-4">
            {isLoadingLibrary ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 text-slate-400 animate-spin" />
              </div>
            ) : libraryImages.length === 0 ? (
              <div className="text-center py-12">
                <ImagePlus className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <p className="text-sm text-slate-500">Henüz yüklenmiş resim yok</p>
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-3 max-h-[400px] overflow-y-auto">
                {libraryImages.map((image) => (
                  <button
                    key={image.filename}
                    type="button"
                    onClick={() => handleSelectFromLibrary(image.url)}
                    className="aspect-square rounded-lg overflow-hidden border-2 border-transparent hover:border-slate-400 focus:border-slate-900 transition-colors"
                  >
                    <img
                      src={image.url}
                      alt={image.filename}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
            <div className="flex justify-end pt-4 mt-4 border-t">
              <Button variant="outline" onClick={() => setIsLibraryOpen(false)}>
                İptal
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
