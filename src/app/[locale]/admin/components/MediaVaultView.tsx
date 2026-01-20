"use client"

import { Image, ImagePlus, Upload, Video } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export function MediaVaultView() {
  return (
    <div className="content-wrapper">
      <div className="stats-grid cols-3">
        <Card className="stat-card">
          <CardContent className="stat-content">
            <div className="stat-data">
              <p className="stat-value">24</p>
              <p className="stat-label">Toplam Dosya</p>
              <Progress value={60} className="mt-3" />
              <p className="mt-2 text-xs text-slate-500">40 dosya limiti</p>
            </div>
          </CardContent>
        </Card>
        <Card className="stat-card">
          <CardContent className="stat-content">
            <div className="stat-data">
              <p className="stat-value">128 MB</p>
              <p className="stat-label">Kullanılan Depolama</p>
              <Progress value={25} className="mt-3" />
              <p className="mt-2 text-xs text-slate-500">512 MB plan</p>
            </div>
          </CardContent>
        </Card>
        <Card className="stat-card">
          <CardContent className="stat-content">
            <div className="stat-data">
              <p className="stat-value">Bugün</p>
              <p className="stat-label">Son Yükleme</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="card-header-flex">
          <div>
            <CardTitle>Medya Dosyaları</CardTitle>
            <CardDescription>Yüklenen resim ve videolarınız</CardDescription>
          </div>
          <Button size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Yükle
          </Button>
        </CardHeader>
        <CardContent>
          <div className="media-grid">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="media-item">
                {i % 3 === 0 ? (
                  <Video className="media-icon" />
                ) : (
                  <Image className="media-icon" />
                )}
                <span className="media-name">medya_{i}.{i % 3 === 0 ? 'mp4' : 'jpg'}</span>
              </div>
            ))}
            <div className="media-item add-new">
              <ImagePlus className="media-icon" />
              <span className="media-name">Yeni Ekle</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
