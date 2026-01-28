"use client"

import { useCallback, useEffect, useState } from "react"
import { Image as ImageIcon, ImagePlus, Loader2, Trash2, Upload, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

interface UploadedImage {
  url: string
  filename: string
  size: number
  uploadedAt: string
}

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

export function MediaVaultView() {
  const [images, setImages] = useState<UploadedImage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [selectedImage, setSelectedImage] = useState<UploadedImage | null>(null)

  const fetchImages = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await fetch("/api/uploads")
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || "Dosyalar yüklenemedi.")
      }
      setImages(data.images || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Dosyalar yüklenemedi.")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchImages()
  }, [fetchImages])

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

      // Add the new image to the list
      const newImage: UploadedImage = {
        url: result.url,
        filename: result.filename,
        size: result.size,
        uploadedAt: new Date().toISOString(),
      }
      setImages((prev) => [newImage, ...prev])
      setIsUploadDialogOpen(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Yükleme başarısız.")
    } finally {
      setIsUploading(false)
    }
  }, [])

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

  const totalSize = images.reduce((acc, img) => acc + img.size, 0)
  const lastUpload = images.length > 0 ? images[0].uploadedAt : null

  return (
    <div className="content-wrapper">
      <div className="stats-grid cols-3">
        <Card className="stat-card">
          <CardContent className="stat-content">
            <div className="stat-data">
              <p className="stat-value">{images.length}</p>
              <p className="stat-label">Toplam Dosya</p>
              <Progress value={Math.min((images.length / 100) * 100, 100)} className="mt-3" />
              <p className="mt-2 text-xs text-slate-500">100 dosya limiti</p>
            </div>
          </CardContent>
        </Card>
        <Card className="stat-card">
          <CardContent className="stat-content">
            <div className="stat-data">
              <p className="stat-value">{formatFileSize(totalSize)}</p>
              <p className="stat-label">Kullanılan Depolama</p>
              <Progress value={Math.min((totalSize / (512 * 1024 * 1024)) * 100, 100)} className="mt-3" />
              <p className="mt-2 text-xs text-slate-500">512 MB plan</p>
            </div>
          </CardContent>
        </Card>
        <Card className="stat-card">
          <CardContent className="stat-content">
            <div className="stat-data">
              <p className="stat-value">{lastUpload ? formatDate(lastUpload) : "-"}</p>
              <p className="stat-label">Son Yükleme</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="card-header-flex">
          <div>
            <CardTitle>Medya Dosyaları</CardTitle>
            <CardDescription>Yüklenen resim ve görselleriniz</CardDescription>
          </div>
          <Button size="sm" onClick={() => setIsUploadDialogOpen(true)}>
            <Upload className="h-4 w-4 mr-2" />
            Yükle
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 text-slate-400 animate-spin" />
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-sm text-red-600">{error}</p>
              <Button variant="outline" size="sm" className="mt-4" onClick={fetchImages}>
                Tekrar Dene
              </Button>
            </div>
          ) : images.length === 0 ? (
            <div className="text-center py-12">
              <ImageIcon className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <p className="text-sm text-slate-500 mb-4">Henüz yüklenmiş dosya yok</p>
              <Button size="sm" onClick={() => setIsUploadDialogOpen(true)}>
                <ImagePlus className="h-4 w-4 mr-2" />
                İlk Resmi Yükle
              </Button>
            </div>
          ) : (
            <div className="media-grid">
              {images.map((image) => (
                <div
                  key={image.filename}
                  className="media-item-image"
                  onClick={() => setSelectedImage(image)}
                >
                  <img
                    src={image.url}
                    alt={image.filename}
                    className="media-thumbnail"
                  />
                  <div className="media-overlay">
                    <span className="media-filename">{image.filename}</span>
                    <span className="media-size">{formatFileSize(image.size)}</span>
                  </div>
                </div>
              ))}
              <div
                className="media-item add-new"
                onClick={() => setIsUploadDialogOpen(true)}
              >
                <ImagePlus className="media-icon" />
                <span className="media-name">Yeni Ekle</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upload Dialog */}
      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent className="sm:max-w-md [&>button]:hidden" style={{ animation: "none" }}>
          <DialogHeader>
            <DialogTitle>Resim Yükle</DialogTitle>
            <DialogDescription>
              Blog yazılarınızda kullanmak için resim yükleyin.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <label
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={cn(
                "flex flex-col items-center justify-center gap-3 p-8 rounded-lg border-2 border-dashed cursor-pointer transition-colors",
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
                  <Loader2 className="h-10 w-10 text-slate-400 animate-spin" />
                  <span className="text-sm text-slate-500">Yükleniyor...</span>
                </>
              ) : (
                <>
                  <ImagePlus className="h-10 w-10 text-slate-400" />
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
            {error && (
              <p className="text-xs text-red-600 text-center">{error}</p>
            )}
            <div className="flex justify-end">
              <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)}>
                İptal
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Image Preview Dialog */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="sm:max-w-2xl [&>button]:hidden" style={{ animation: "none" }}>
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span className="truncate pr-4">{selectedImage?.filename}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0"
                onClick={() => setSelectedImage(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          {selectedImage && (
            <div className="space-y-4">
              <div className="rounded-lg overflow-hidden border border-slate-200 bg-slate-50">
                <img
                  src={selectedImage.url}
                  alt={selectedImage.filename}
                  className="w-full max-h-[400px] object-contain"
                />
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-slate-500">Dosya Adı</p>
                  <p className="font-medium">{selectedImage.filename}</p>
                </div>
                <div>
                  <p className="text-slate-500">Boyut</p>
                  <p className="font-medium">{formatFileSize(selectedImage.size)}</p>
                </div>
                <div>
                  <p className="text-slate-500">Yükleme Tarihi</p>
                  <p className="font-medium">{formatDate(selectedImage.uploadedAt)}</p>
                </div>
                <div>
                  <p className="text-slate-500">URL</p>
                  <p className="font-medium text-xs break-all">{selectedImage.url}</p>
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    navigator.clipboard.writeText(selectedImage.url)
                  }}
                >
                  URL Kopyala
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setSelectedImage(null)}
                >
                  Kapat
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
