"use client"

import { use, useEffect, useState } from "react"
import Link from "next/link"
import { IBM_Plex_Sans, Fraunces } from "next/font/google"
import {
  Calendar as CalendarIcon,
  ChevronRight,
  Compass,
  Eye,
  FileText,
  FolderOpen,
  LayoutDashboard,
  LogOut,
  Mail,
  Plus,
  Settings,
} from "lucide-react"

import "./admin.css"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Calendar } from "@/components/ui/calendar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { blogCategories } from "@/lib/blog"
import { defaultLocale } from "@/lib/i18n"

import {
  EditorPost,
  EditorStatus,
  NavItem,
  StatusFilter,
  OverviewView,
  BlogLibraryView,
  NewsletterView,
  MediaVaultView,
  ExperiencesView,
  SettingsView,
  EditorSheet,
} from "./components"

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
})

const ibmPlex = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
})

const createId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `draft-${Date.now()}-${Math.random().toString(16).slice(2)}`

const normalizeReadTime = (readTime: string) => {
  const match = readTime.match(/\d+/)
  if (!match) return readTime
  return `${match[0]} dk okuma`
}

const normalizePost = (post: EditorPost): EditorPost => ({
  ...post,
  readTime: normalizeReadTime(post.readTime ?? ""),
  contentHtml: post.contentHtml ?? "",
  status: (post.status ?? "Draft") as EditorStatus,
  tags: Array.isArray(post.tags) ? post.tags : [],
})

const getLocalDateISO = (date = new Date()) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

const parseLocalDate = (value: string) => {
  const parts = value.split("-").map(Number)
  if (parts.length !== 3 || parts.some((part) => Number.isNaN(part))) {
    return undefined
  }
  const [year, month, day] = parts
  return new Date(year, month - 1, day)
}

const addDays = (date: Date, days: number) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate() + days)

const createEmptyDraft = (): EditorPost => ({
  id: createId(),
  slug: "",
  title: "",
  excerpt: "",
  date: getLocalDateISO(addDays(new Date(), 1)),
  readTime: "4 dk okuma",
  category: blogCategories[0] ?? "Rotalar",
  author: "Cyprigo Editoryal",
  cover: "/home/hero-luxury.jpg",
  tags: [],
  contentHtml: "",
  status: "Scheduled",
})

const sortPosts = (items: EditorPost[]) =>
  [...items].sort((a, b) => b.date.localeCompare(a.date))

const navItems: { id: NavItem; label: string; icon: React.ElementType }[] = [
  { id: "overview", label: "Genel Bakış", icon: LayoutDashboard },
  { id: "blog", label: "Blog Kütüphanesi", icon: FileText },
  { id: "newsletter", label: "Bülten", icon: Mail },
  { id: "media", label: "Medya Arşivi", icon: FolderOpen },
  { id: "experience", label: "Deneyimler", icon: Compass },
  { id: "settings", label: "Ayarlar", icon: Settings },
]

const navLabelMap = navItems.reduce((acc, item) => {
  acc[item.id] = item.label
  return acc
}, {} as Record<NavItem, string>)

const navTitleMap: Record<NavItem, string> = {
  overview: "Kontrol Paneli",
  blog: "Blog Kütüphanesi",
  newsletter: "Bülten Aboneleri",
  media: "Medya Arşivi",
  experience: "Deneyimler",
  settings: "Ayarlar",
}

export default function AdminPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = use(params)
  const [posts, setPosts] = useState<EditorPost[]>([])
  const [postError, setPostError] = useState<string | null>(null)
  const [isLoadingPosts, setIsLoadingPosts] = useState(true)
  const [selectedPost, setSelectedPost] = useState<EditorPost | null>(null)
  const [isNewDraft, setIsNewDraft] = useState(false)
  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all")
  const [activeNav, setActiveNav] = useState<NavItem>("overview")
  const [isScheduleOpen, setIsScheduleOpen] = useState(false)
  const [scheduleDate, setScheduleDate] = useState(getLocalDateISO(addDays(new Date(), 1)))

  useEffect(() => {
    const loadPosts = async () => {
      setIsLoadingPosts(true)
      setPostError(null)
      try {
        const response = await fetch("/api/blog")
        const payload = await response.json()
        if (!response.ok) {
          throw new Error(payload?.error || "Liste alinamadi.")
        }
        const normalized = (payload?.posts ?? []).map(normalizePost)
        setPosts(sortPosts(normalized))
      } catch (err) {
        setPostError(err instanceof Error ? err.message : "Liste alinamadi.")
      } finally {
        setIsLoadingPosts(false)
      }
    }

    loadPosts()
  }, [])

  useEffect(() => {
    const tick = () => {
      const today = getLocalDateISO()
      setPosts((prev) => {
        let changed = false
        const next = prev.map((post) => {
          if (
            post.status === "Scheduled" &&
            post.date &&
            post.date <= today
          ) {
            changed = true
            return { ...post, status: "Published" as const }
          }
          return post
        })
        return changed ? next : prev
      })
    }

    tick()
    const interval = window.setInterval(tick, 60_000)
    return () => window.clearInterval(interval)
  }, [])

  const basePath = `/${locale ?? defaultLocale}`
  const activeTitle = navTitleMap[activeNav]
  const activeLabel = navLabelMap[activeNav]
  const scheduleDateValue = scheduleDate ? parseLocalDate(scheduleDate) : undefined

  const filteredPosts = posts.filter((post) => {
    const search = query.trim().toLowerCase()
    const matchesSearch =
      !search ||
      post.title.toLowerCase().includes(search) ||
      post.category.toLowerCase().includes(search) ||
      post.slug.toLowerCase().includes(search) ||
      post.author.toLowerCase().includes(search) ||
      post.tags.join(" ").toLowerCase().includes(search)

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "published" && post.status === "Published") ||
      (statusFilter === "scheduled" && post.status === "Scheduled") ||
      (statusFilter === "draft" && post.status === "Draft")

    return matchesSearch && matchesStatus
  })

  const scheduledPosts = posts.filter((post) => post.status === "Scheduled")
  const draftPosts = posts.filter((post) => post.status === "Draft")

  const today = getLocalDateISO()
  const upcomingScheduled = scheduledPosts
    .filter((post) => post.date > today)
    .sort((a, b) => a.date.localeCompare(b.date))
  const nextScheduledDate = upcomingScheduled[0]?.date

  const upsertPost = (post: EditorPost) => {
    setPosts((prev) =>
      sortPosts([post, ...prev.filter((item) => item.id !== post.id)])
    )
  }

  const removePost = (postId: string) => {
    setPosts((prev) => prev.filter((post) => post.id !== postId))
  }

  const persistPost = async (updatedPost: EditorPost, action: "create" | "update") => {
    const endpoint = action === "create" ? "/api/blog" : `/api/blog/${updatedPost.id}`
    const method = action === "create" ? "POST" : "PATCH"
    const { createdAt, updatedAt, ...payload } = updatedPost
    if (!payload.title?.trim()) {
      payload.title = "Basliksiz Taslak"
    }
    if (!payload.slug?.trim()) {
      payload.slug = `draft-${updatedPost.id}`
    }
    const response = await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
    const result = await response.json()
    if (!response.ok) {
      throw new Error(result?.error || "Kaydetme islemi basarisiz.")
    }
    const saved = normalizePost(result.post)
    upsertPost(saved)
    setSelectedPost(saved)
    setIsNewDraft(false)
    return saved
  }

  const handleNewPost = () => {
    const newDraft = createEmptyDraft()
    setSelectedPost(newDraft)
    setIsNewDraft(true)
    setIsEditorOpen(true)
  }

  const handleCreateScheduledPost = () => {
    const scheduledDraft = { ...createEmptyDraft(), date: scheduleDate }
    setIsScheduleOpen(false)
    setSelectedPost(scheduledDraft)
    setIsNewDraft(true)
    setIsEditorOpen(true)
  }

  const handleEdit = (post: EditorPost) => {
    setSelectedPost(post)
    setIsNewDraft(false)
    setIsEditorOpen(true)
  }

  const handleDuplicate = async (post: EditorPost) => {
    const duplicated = {
      ...post,
      id: createId(),
      slug: `${post.slug}-copy`,
      title: `${post.title} (Kopya)`,
      status: "Draft" as const,
      isFeatured: false,
    }

    try {
      await persistPost(duplicated, "create")
    } catch (err) {
      window.alert(
        err instanceof Error ? err.message : "Kopyalama islemi basarisiz oldu."
      )
    }
  }

  const handleDelete = async (postId: string) => {
    const target = posts.find((post) => post.id === postId)
    if (!target) return
    const confirmed = window.confirm(
      `"${target.title || "Basliksiz"}" silinsin mi? Bu islem geri alinamaz.`
    )
    if (!confirmed) return

    try {
      const response = await fetch(`/api/blog/${postId}`, { method: "DELETE" })
      const result = await response.json()
      if (!response.ok) {
        throw new Error(result?.error || "Silme islemi basarisiz oldu.")
      }
      removePost(postId)
    } catch (err) {
      window.alert(err instanceof Error ? err.message : "Silme islemi basarisiz oldu.")
    }
  }

  const handleSavePost = async (updatedPost: EditorPost) => {
    try {
      await persistPost(updatedPost, isNewDraft ? "create" : "update")
    } catch (err) {
      window.alert(err instanceof Error ? err.message : "Kaydetme basarisiz oldu.")
    }
  }

  const handlePublishPost = async (updatedPost: EditorPost) => {
    try {
      await persistPost(updatedPost, isNewDraft ? "create" : "update")
    } catch (err) {
      window.alert(err instanceof Error ? err.message : "Yayinlama basarisiz oldu.")
    }
  }

  return (
    <main className={`${fraunces.variable} ${ibmPlex.variable} admin-shell`}>
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <Link href={`${basePath}/home`} className="sidebar-logo">
            <span className="logo-text">Cyprigo</span>
          </Link>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section">
            <span className="nav-section-label">Menü</span>
            {navItems.slice(0, 5).map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveNav(item.id)}
                className={cn("nav-item", activeNav === item.id && "active")}
              >
                <item.icon className="nav-icon" />
                <span className="nav-label">{item.label}</span>
                {activeNav === item.id && <ChevronRight className="nav-indicator" />}
              </button>
            ))}
          </div>

          <Separator className="my-4" />

          <div className="nav-section">
            <span className="nav-section-label">Sistem</span>
            {navItems.slice(5).map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveNav(item.id)}
                className={cn("nav-item", activeNav === item.id && "active")}
              >
                <item.icon className="nav-icon" />
                <span className="nav-label">{item.label}</span>
              </button>
            ))}
          </div>
        </nav>

        <div className="sidebar-footer">
          <div className="user-card">
            <Avatar className="h-9 w-9">
              <AvatarFallback className="bg-slate-100 text-slate-600 text-sm">AD</AvatarFallback>
            </Avatar>
            <div className="user-info">
              <p className="user-name">Admin Masası</p>
              <p className="user-email">editor@cyprigo.com</p>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="ml-auto h-8 w-8 text-slate-400 hover:text-slate-600">
                  <LogOut className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Çıkış yap</TooltipContent>
            </Tooltip>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="admin-main">
        {/* Top Bar */}
        <header className="admin-topbar">
          <div className="topbar-left">
            <div className="flex flex-col gap-1">
              <Breadcrumb className="hidden md:flex">
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link href={`${basePath}/home`}>Cyprigo</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Admin</BreadcrumbPage>
                  </BreadcrumbItem>
                  {activeLabel && (
                    <>
                      <BreadcrumbSeparator />
                      <BreadcrumbItem>
                        <BreadcrumbPage>{activeLabel}</BreadcrumbPage>
                      </BreadcrumbItem>
                    </>
                  )}
                </BreadcrumbList>
              </Breadcrumb>
              <h1 className="topbar-title">{activeTitle}</h1>
            </div>
          </div>
          <div className="topbar-right">
            <Button variant="outline" size="sm" asChild>
              <Link href={`${basePath}/blog`}>
                <Eye className="h-4 w-4 mr-2" />
                Siteyi Görüntüle
              </Link>
            </Button>
            <Button size="sm" onClick={handleNewPost}>
              <Plus className="h-4 w-4 mr-2" />
              Yeni Yazı
            </Button>
          </div>
        </header>

        {/* Content Area */}
        <div className="admin-content">
          {postError && (
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>Hata</AlertTitle>
              <AlertDescription>{postError}</AlertDescription>
            </Alert>
          )}
          {isLoadingPosts && (
            <div className="mb-4 space-y-2">
              <Skeleton className="h-4 w-52" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          )}
          {activeNav === "overview" && (
            <OverviewView
              posts={posts}
              draftCount={draftPosts.length}
              upcomingScheduled={upcomingScheduled}
              nextScheduledDate={nextScheduledDate}
              onNavigate={setActiveNav}
              onSetStatusFilter={setStatusFilter}
              onOpenSchedule={() => setIsScheduleOpen(true)}
              onEditPost={handleEdit}
            />
          )}

          {activeNav === "blog" && (
            <BlogLibraryView
              posts={filteredPosts}
              query={query}
              statusFilter={statusFilter}
              onQueryChange={setQuery}
              onStatusFilterChange={setStatusFilter}
              onEditPost={handleEdit}
              onDuplicatePost={handleDuplicate}
              onDeletePost={handleDelete}
            />
          )}

          {activeNav === "newsletter" && <NewsletterView />}
          {activeNav === "media" && <MediaVaultView />}

          {activeNav === "experience" && <ExperiencesView />}

          {activeNav === "settings" && <SettingsView />}
        </div>
      </div>

      {/* Schedule Dialog */}
      <Dialog open={isScheduleOpen} onOpenChange={setIsScheduleOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Yazı Planla</DialogTitle>
            <DialogDescription>İçeriğiniz için yayın tarihi seçin.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Yayın Tarihi</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    <span>{scheduleDate || "Tarih seçin"}</span>
                    <CalendarIcon className="h-4 w-4 text-slate-500" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={scheduleDateValue}
                    onSelect={(date) => {
                      if (date) setScheduleDate(getLocalDateISO(date))
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleCreateScheduledPost}>
                <Plus className="h-4 w-4 mr-2" />
                Yazı Oluştur
              </Button>
              <Button variant="outline" onClick={() => setIsScheduleOpen(false)}>İptal</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Editor Sheet */}
      {selectedPost && (
        <EditorSheet
          open={isEditorOpen}
          onOpenChange={setIsEditorOpen}
          post={selectedPost}
          isNewDraft={isNewDraft}
          onSave={handleSavePost}
          onPublish={handlePublishPost}
          existingSlugs={posts.map((p) => p.slug)}
        />
      )}
    </main>
  )
}
