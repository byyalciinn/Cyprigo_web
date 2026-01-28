"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
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
  const { data: session } = useSession()
  const [displayName, setDisplayName] = useState("")
  const [email, setEmail] = useState("")

  useEffect(() => {
    setDisplayName(session?.user?.name ?? "")
    setEmail(session?.user?.email ?? "")
  }, [session?.user?.name, session?.user?.email])

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
                <CardTitle className="text-base">Profil AyarlarÄ±</CardTitle>
                <CardDescription>HesabÄ±nÄ±zÄ± yÃ¶netin</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">GÃ¶rÃ¼nen Ad</label>
              <Input
                value={displayName}
                onChange={(event) => setDisplayName(event.target.value)}
                placeholder="Adınızı girin"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">E-posta</label>
              <Input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="ornek@email.com"
              />
            </div>
            <div className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2">
              <div>
                <p className="text-sm font-medium text-slate-700">Bildirimler</p>
                <p className="text-xs text-slate-500">Yeni yorumlar iÃ§in e-posta</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Button size="sm">DeÄŸiÅŸiklikleri Kaydet</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="settings-icon-wrapper">
                <Globe className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-base">Site AyarlarÄ±</CardTitle>
                <CardDescription>Web sitesi seÃ§eneklerini yapÄ±landÄ±rÄ±n</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Site AdÄ±</label>
              <Input defaultValue="Cyprigo" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">VarsayÄ±lan Dil</label>
              <Select defaultValue="tr">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="tr">TÃ¼rkÃ§e</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2">
                <div>
                  <p className="text-sm font-medium text-slate-700">BakÄ±m Modu</p>
                  <p className="text-xs text-slate-500">BakÄ±mdayken ziyaretÃ§iyi bilgilendir</p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2">
                <div>
                  <p className="text-sm font-medium text-slate-700">Analitik</p>
                  <p className="text-xs text-slate-500">Trafik raporlarÄ±nÄ± otomatik topla</p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
            <Button size="sm">DeÄŸiÅŸiklikleri Kaydet</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


