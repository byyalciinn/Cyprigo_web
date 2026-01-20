"use client"

import { Globe, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

export function SettingsView() {
  return (
    <div className="content-wrapper">
      <div className="settings-grid">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="settings-icon-wrapper">
                <User className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-base">Profil Ayarları</CardTitle>
                <CardDescription>Hesabınızı yönetin</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Görünen Ad</label>
              <Input defaultValue="Admin Masası" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">E-posta</label>
              <Input defaultValue="editor@cyprigo.com" />
            </div>
            <div className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2">
              <div>
                <p className="text-sm font-medium text-slate-700">Bildirimler</p>
                <p className="text-xs text-slate-500">Yeni yorumlar için e-posta</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Button size="sm">Değişiklikleri Kaydet</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="settings-icon-wrapper">
                <Globe className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-base">Site Ayarları</CardTitle>
                <CardDescription>Web sitesi seçeneklerini yapılandırın</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Site Adı</label>
              <Input defaultValue="Cyprigo" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Varsayılan Dil</label>
              <Select defaultValue="tr">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="tr">Türkçe</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2">
                <div>
                  <p className="text-sm font-medium text-slate-700">Bakım Modu</p>
                  <p className="text-xs text-slate-500">Bakımdayken ziyaretçiyi bilgilendir</p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2">
                <div>
                  <p className="text-sm font-medium text-slate-700">Analitik</p>
                  <p className="text-xs text-slate-500">Trafik raporlarını otomatik topla</p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
            <Button size="sm">Değişiklikleri Kaydet</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
