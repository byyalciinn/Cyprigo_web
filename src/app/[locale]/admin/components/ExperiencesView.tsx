"use client"

import { Compass, MoreHorizontal, Plus } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

const tours = [
  { name: "Girne Liman Yürüyüşü", location: "Girne", type: "Yürüyüş Turu", status: "Aktif" },
  { name: "Gazimağusa Tarihi", location: "Gazimağusa", type: "Kültür", status: "Aktif" },
  { name: "Karpaz Yarımadası", location: "Karpaz", type: "Doğa", status: "Taslak" },
  { name: "Lefkoşa Eski Şehir", location: "Lefkoşa", type: "Yürüyüş Turu", status: "Aktif" },
]

export function ExperiencesView() {
  return (
    <div className="content-wrapper">
      <div className="stats-grid">
        <Card className="stat-card">
          <CardContent className="stat-content">
            <div className="stat-data">
              <p className="stat-value">12</p>
              <p className="stat-label">Toplam Tur</p>
            </div>
          </CardContent>
        </Card>
        <Card className="stat-card">
          <CardContent className="stat-content">
            <div className="stat-data">
              <p className="stat-value">8</p>
              <p className="stat-label">Destinasyonlar</p>
            </div>
          </CardContent>
        </Card>
        <Card className="stat-card">
          <CardContent className="stat-content">
            <div className="stat-data">
              <p className="stat-value">4</p>
              <p className="stat-label">Öne Çıkan</p>
            </div>
          </CardContent>
        </Card>
        <Card className="stat-card">
          <CardContent className="stat-content">
            <div className="stat-data">
              <p className="stat-value">5</p>
              <p className="stat-label">Kategoriler</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="card-header-flex">
          <div>
            <CardTitle>Turlar ve Deneyimler</CardTitle>
            <CardDescription>Seyahat deneyimlerinizi yönetin</CardDescription>
          </div>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Tur Ekle
          </Button>
        </CardHeader>
        <CardContent>
          <div className="tours-list">
            {tours.map((tour, i) => (
              <div key={i} className="tour-item">
                <div className="tour-icon-wrapper">
                  <Compass className="tour-icon" />
                </div>
                <div className="tour-info">
                  <p className="tour-name">{tour.name}</p>
                  <p className="tour-meta">{tour.location} • {tour.type}</p>
                </div>
                <Badge variant="outline" className={tour.status === "Aktif" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-slate-100 text-slate-600 border-slate-200"}>
                  {tour.status}
                </Badge>
                <DropdownMenu>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                    </TooltipTrigger>
                    <TooltipContent>İşlemler</TooltipContent>
                  </Tooltip>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Düzenle</DropdownMenuItem>
                    <DropdownMenuItem>Kopyala</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600">Sil</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
