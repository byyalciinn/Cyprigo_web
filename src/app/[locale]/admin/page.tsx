"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Manrope, Playfair_Display } from "next/font/google"
import { EditorContent, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import LinkExtension from "@tiptap/extension-link"
import Placeholder from "@tiptap/extension-placeholder"
import Underline from "@tiptap/extension-underline"
import {
  BarChart3,
  Bell,
  Bold,
  CalendarDays,
  ChevronDown,
  Eye,
  FileText,
  FolderOpen,
  Globe,
  Heading2,
  Heading3,
  Image,
  ImagePlus,
  Italic,
  Link2,
  List,
  ListOrdered,
  Lock,
  Map,
  MoreHorizontal,
  Palette,
  Plus,
  Quote,
  Save,
  Search,
  Settings,
  Sparkles,
  Trash2,
  Underline as UnderlineIcon,
  Upload,
  User,
  Video,
} from "lucide-react"

import "./admin.css"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import {
  allPosts,
  blogCategories,
  type BlogPost,
  type BlogSection,
  formatBlogDate,
} from "@/lib/blog"
import { defaultLocale } from "@/lib/i18n"

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
})

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
})

type EditorStatus = "Published" | "Scheduled" | "Draft"

type EditorPost = {
  id: string
  slug: string
  title: string
  excerpt: string
  date: string
  readTime: string
  category: string
  author: string
  cover: string
  tags: string[]
  contentHtml: string
  status: EditorStatus
}

type StatusFilter = "all" | "published" | "scheduled" | "draft"

const createId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `draft-${Date.now()}-${Math.random().toString(16).slice(2)}`

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")

const sectionsToHtml = (sections: BlogSection[]) =>
  sections
    .map(
      (section) =>
        `<h2>${escapeHtml(section.heading)}</h2>${section.paragraphs
          .map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`)
          .join("")}`
    )
    .join("")

const normalizeReadTime = (readTime: string) => {
  const match = readTime.match(/\d+/)
  if (!match) return readTime
  return `${match[0]} min read`
}

const mapPostToEditor = (post: BlogPost): EditorPost => ({
  id: post.slug,
  slug: post.slug,
  title: post.title,
  excerpt: post.excerpt,
  date: post.date,
  readTime: normalizeReadTime(post.readTime),
  category: post.category,
  author: post.author,
  cover: post.cover,
  tags: post.tags,
  contentHtml: sectionsToHtml(post.content),
  status: "Published",
})

const getLocalDateISO = (date = new Date()) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

const addDays = (date: Date, days: number) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate() + days)

const createEmptyDraft = (): EditorPost => ({
  id: createId(),
  slug: "",
  title: "",
  excerpt: "",
  date: getLocalDateISO(addDays(new Date(), 1)),
  readTime: "4 min read",
  category: blogCategories[0] ?? "Rotalar",
  author: "Cyprigo Editorial",
  cover: "/home/hero-luxury.jpg",
  tags: [],
  contentHtml: "",
  status: "Scheduled",
})

const getWordCount = (html: string) => {
  const text = html.replace(/<[^>]*>/g, " ").trim()
  if (!text) return 0
  return text.split(/\s+/).filter(Boolean).length
}

const statusStyles: Record<EditorStatus, string> = {
  Published: "bg-emerald-100 text-emerald-700",
  Scheduled: "bg-amber-100 text-amber-700",
  Draft: "bg-zinc-100 text-zinc-700",
}

export default function AdminPage({
  params,
}: {
  params: { locale: string }
}) {
  const initialPosts = useMemo(() => allPosts.map(mapPostToEditor), [])
  const [posts, setPosts] = useState<EditorPost[]>(initialPosts)
  const [draft, setDraft] = useState<EditorPost>(
    initialPosts[0] ?? createEmptyDraft()
  )
  const [editorContent, setEditorContent] = useState(
    initialPosts[0]?.contentHtml ?? ""
  )
  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const [isNewDraft, setIsNewDraft] = useState(false)
  const [editorNotice, setEditorNotice] = useState<string | null>(null)
  const [editorError, setEditorError] = useState<string | null>(null)
  const [query, setQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all")
  const [activeNav, setActiveNav] = useState<"overview" | "blog" | "media" | "experience" | "settings">("overview")
  const [isScheduleOpen, setIsScheduleOpen] = useState(false)
  const [scheduleDate, setScheduleDate] = useState(getLocalDateISO(addDays(new Date(), 1)))

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] } }),
      Underline,
      LinkExtension.configure({ openOnClick: false, autolink: true }),
      Placeholder.configure({
        placeholder: "Write the blog story here...",
      }),
    ],
    immediatelyRender: false,
    content: editorContent,
    editorProps: {
      attributes: {
        class: "tiptap",
      },
    },
    onUpdate: ({ editor }) => {
      setEditorContent(editor.getHTML())
    },
  })

  useEffect(() => {
    if (!editor || !isEditorOpen) return
    editor.commands.setContent(draft.contentHtml || "<p></p>", {
      emitUpdate: false,
    })
    setEditorContent(draft.contentHtml || "")
  }, [draft.id, editor, isEditorOpen])

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

  const locale = params?.locale ?? defaultLocale
  const basePath = `/${locale}`

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

  const totalPosts = posts.length
  const publishedPosts = posts.filter((post) => post.status === "Published")
  const scheduledPosts = posts.filter((post) => post.status === "Scheduled")
  const draftPosts = posts.filter((post) => post.status === "Draft")
  const averageReadTime =
    totalPosts === 0
      ? 0
      : Math.round(
        posts.reduce((sum, post) => {
          const minutes = Number(post.readTime.match(/\d+/)?.[0] ?? 0)
          return sum + minutes
        }, 0) / totalPosts
      )

  const latestDate = posts
    .map((post) => post.date)
    .sort((a, b) => b.localeCompare(a))[0]

  const today = getLocalDateISO()
  const upcomingScheduled = scheduledPosts
    .filter((post) => post.date > today)
    .sort((a, b) => a.date.localeCompare(b.date))
  const nextScheduledDate = upcomingScheduled[0]?.date

  const wordCount = getWordCount(editorContent)
  const estimatedReadTime = wordCount
    ? `${Math.max(1, Math.ceil(wordCount / 220))} min read`
    : "0 min read"

  const openEditor = (post: EditorPost, isNew: boolean) => {
    setDraft({ ...post })
    setEditorContent(post.contentHtml)
    setIsNewDraft(isNew)
    setEditorError(null)
    setEditorNotice(null)
    setIsEditorOpen(true)
  }

  const handleNewPost = () => {
    openEditor(createEmptyDraft(), true)
  }

  const handleCreateScheduledPost = () => {
    const scheduledDraft = { ...createEmptyDraft(), date: scheduleDate }
    setIsScheduleOpen(false)
    window.setTimeout(() => openEditor(scheduledDraft, true), 0)
  }

  const handleEdit = (post: EditorPost) => {
    openEditor(post, false)
  }

  const handleDuplicate = (post: EditorPost) => {
    const duplicated = {
      ...post,
      id: createId(),
      slug: `${post.slug}-copy`,
      title: `${post.title} (Copy)`,
      status: "Draft" as const,
    }
    setPosts((prev) => [duplicated, ...prev])
  }

  const handleDelete = (postId: string) => {
    const target = posts.find((post) => post.id === postId)
    if (!target) return
    const confirmed = window.confirm(
      `Delete "${target.title || "Untitled"}"? This cannot be undone.`
    )
    if (!confirmed) return

    setPosts((prev) => prev.filter((post) => post.id !== postId))
  }

  const persistDraft = (overrides?: Partial<EditorPost>) => {
    const html = editor?.getHTML() ?? editorContent
    const normalized = {
      ...draft,
      ...overrides,
      tags: (overrides?.tags ?? draft.tags).filter(Boolean),
      contentHtml: html,
      readTime: draft.readTime || estimatedReadTime,
    }
    const normalizedStatus =
      normalized.status === "Scheduled" && normalized.date <= getLocalDateISO()
        ? "Published"
        : normalized.status
    const finalDraft = { ...normalized, status: normalizedStatus }

    if (isNewDraft) {
      setPosts((prev) => [finalDraft, ...prev])
      setIsNewDraft(false)
    } else {
      setPosts((prev) =>
        prev.map((post) => (post.id === finalDraft.id ? finalDraft : post))
      )
    }
    setDraft(finalDraft)
  }

  const handleSaveChanges = () => {
    setEditorError(null)
    persistDraft()
    setEditorNotice("Saved")
    window.setTimeout(() => setEditorNotice(null), 1800)
  }

  const handlePublishNow = () => {
    setEditorNotice(null)

    const title = draft.title.trim()
    const slug = draft.slug.trim()

    if (!title) {
      setEditorError("Title is required before publishing.")
      return
    }

    if (!slug) {
      setEditorError("Slug is required before publishing.")
      return
    }

    const slugTaken = posts.some(
      (post) => post.slug === slug && post.id !== draft.id
    )
    if (slugTaken) {
      setEditorError("Slug is already used by another post.")
      return
    }

    const today = getLocalDateISO()
    persistDraft({
      status: "Published",
      date: today,
      slug,
      title,
    })
    setIsEditorOpen(false)
  }

  const toolbarButtonClass = (isActive?: boolean) =>
    cn(
      "border border-border bg-background text-foreground hover:border-primary/40",
      isActive && "bg-primary/10 text-primary border-primary/30"
    )

  return (
    <main className={`${playfair.variable} ${manrope.variable} admin-shell`}>
      <div className="mx-auto w-full max-w-screen-2xl px-6 pb-16 pt-10">
        <div className="admin-layout">
          <aside className="admin-sidebar">
            <Card className="admin-card p-4">
              <CardHeader className="px-0 pb-2">
                <CardTitle className="text-base">Navigation</CardTitle>
                <CardDescription>Manage admin areas</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 px-0">
                <button
                  type="button"
                  className="admin-nav-button"
                  data-active={activeNav === "overview" ? "true" : undefined}
                  onClick={() => setActiveNav("overview")}
                >
                  <BarChart3 className="size-4" />
                  Overview
                </button>
                <button
                  type="button"
                  className="admin-nav-button"
                  data-active={activeNav === "blog" ? "true" : undefined}
                  onClick={() => setActiveNav("blog")}
                >
                  <FileText className="size-4" />
                  Blog Library
                </button>
                <button
                  type="button"
                  className="admin-nav-button"
                  data-active={activeNav === "media" ? "true" : undefined}
                  onClick={() => setActiveNav("media")}
                >
                  <FolderOpen className="size-4" />
                  Media Vault
                </button>
                <button
                  type="button"
                  className="admin-nav-button"
                  data-active={activeNav === "experience" ? "true" : undefined}
                  onClick={() => setActiveNav("experience")}
                >
                  <Sparkles className="size-4" />
                  Experience
                </button>
                <Separator className="my-2" />
                <button
                  type="button"
                  className="admin-nav-button"
                  data-active={activeNav === "settings" ? "true" : undefined}
                  onClick={() => setActiveNav("settings")}
                >
                  <Settings className="size-4" />
                  Settings
                </button>
              </CardContent>
            </Card>

            <Card className="admin-card p-4">
              <CardHeader className="px-0 pb-2">
                <CardTitle className="text-base">Quick Actions</CardTitle>
                <CardDescription>Daily editorial flow</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 px-0">
                <button
                  type="button"
                  onClick={() => {
                    setActiveNav("blog")
                    setStatusFilter("draft")
                  }}
                  className="flex w-full items-center justify-between rounded-xl border border-border/70 bg-muted/40 px-3 py-2 text-left text-sm transition-colors hover:bg-muted/55"
                >
                  <div>
                    <p className="font-medium text-foreground">Review drafts</p>
                    <p className="text-xs text-muted-foreground">
                      {draftPosts.length} drafts waiting
                    </p>
                  </div>
                  <ChevronDown className="size-4 text-muted-foreground" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveNav("blog")
                    setStatusFilter("scheduled")
                    setIsScheduleOpen(true)
                  }}
                  className="flex w-full items-center justify-between rounded-xl border border-border/70 bg-muted/40 px-3 py-2 text-left text-sm transition-colors hover:bg-muted/55"
                >
                  <div>
                    <p className="font-medium text-foreground">
                      Schedule releases
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {upcomingScheduled.length} upcoming •{" "}
                      {nextScheduledDate
                        ? formatBlogDate(nextScheduledDate, "en-US")
                        : "no schedule"}
                    </p>
                  </div>
                  <CalendarDays className="size-4 text-muted-foreground" />
                </button>
              </CardContent>
            </Card>

            <Card className="admin-card p-4">
              <CardContent className="flex items-center gap-3 px-0">
                <Avatar>
                  <AvatarFallback>AD</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-semibold">Admin Desk</p>
                  <p className="text-xs text-muted-foreground">
                    editor@cyprigo.com
                  </p>
                </div>
              </CardContent>
            </Card>
          </aside>

          <section className="flex flex-col gap-8">
            {/* Overview View */}
            {activeNav === "overview" && (
              <>
                <header className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                  <div className="space-y-3">
                    <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                      Editorial Dashboard
                    </p>
                    <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
                      Control Room
                    </h1>
                    <p className="max-w-xl text-base text-muted-foreground">
                      Keep the blog catalog aligned, publish premium travel stories,
                      and plan upcoming edits from a single workspace.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <Button variant="outline" asChild>
                      <Link href={`${basePath}/blog`}>
                        <Eye className="size-4" />
                        View blog
                      </Link>
                    </Button>
                    <Button onClick={handleNewPost}>
                      <Plus className="size-4" />
                      New blog post
                    </Button>
                  </div>
                </header>

                <div className="grid gap-4 lg:grid-cols-4">
                  <Card className="admin-card">
                    <CardHeader className="pb-2">
                      <CardDescription>Total posts</CardDescription>
                      <CardTitle className="text-3xl">{totalPosts}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-xs text-muted-foreground">
                      Editorial library
                    </CardContent>
                  </Card>
                  <Card className="admin-card">
                    <CardHeader className="pb-2">
                      <CardDescription>Published</CardDescription>
                      <CardTitle className="text-3xl">
                        {publishedPosts.length}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-xs text-muted-foreground">
                      Live on site
                    </CardContent>
                  </Card>
                  <Card className="admin-card">
                    <CardHeader className="pb-2">
                      <CardDescription>Drafts</CardDescription>
                      <CardTitle className="text-3xl">
                        {draftPosts.length}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-xs text-muted-foreground">
                      Pending review • {scheduledPosts.length} scheduled
                    </CardContent>
                  </Card>
                  <Card className="admin-card">
                    <CardHeader className="pb-2">
                      <CardDescription>Avg read time</CardDescription>
                      <CardTitle className="text-3xl">
                        {averageReadTime} min
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-xs text-muted-foreground">
                      Latest: {latestDate ? formatBlogDate(latestDate, "en-US") : "-"}
                    </CardContent>
                  </Card>
                </div>

                <Card className="admin-card">
                  <CardHeader>
                    <CardTitle>Recent Posts</CardTitle>
                    <CardDescription>
                      Latest blog posts from your library
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {posts.slice(0, 5).map((post) => (
                      <div
                        key={post.id}
                        className="flex items-center gap-4 p-3 rounded-xl border border-border/50 hover:bg-muted/30 cursor-pointer"
                        onClick={() => handleEdit(post)}
                      >
                        <img
                          src={post.cover}
                          alt={post.title}
                          className="h-14 w-14 rounded-lg object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{post.title}</p>
                          <p className="text-sm text-muted-foreground">{post.category} • {post.readTime}</p>
                        </div>
                        <Badge className={statusStyles[post.status]}>
                          {post.status}
                        </Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </>
            )}

            {/* Blog Library View */}
            {activeNav === "blog" && (
              <>
                <header className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                  <div className="space-y-3">
                    <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                      Content Management
                    </p>
                    <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
                      Blog Library
                    </h1>
                    <p className="max-w-xl text-base text-muted-foreground">
                      Manage all your blog posts, drafts, and published content in one place.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <Button variant="outline" asChild>
                      <Link href={`${basePath}/blog`}>
                        <Eye className="size-4" />
                        View blog
                      </Link>
                    </Button>
                    <Button onClick={handleNewPost}>
                      <Plus className="size-4" />
                      New blog post
                    </Button>
                  </div>
                </header>

                <Card className="admin-card">
                  <CardHeader className="space-y-4">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <CardTitle>All Posts</CardTitle>
                        <CardDescription>
                          Manage posts that appear on the public blog page.
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-4">
                      <div className="relative flex-1 min-w-[220px]">
                        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          value={query}
                          onChange={(event) => setQuery(event.target.value)}
                          placeholder="Search by title, tag, author, or slug"
                          className="pl-9"
                        />
                      </div>
                      <Tabs
                        value={statusFilter}
                        onValueChange={(value) =>
                          setStatusFilter(value as StatusFilter)
                        }
                      >
                        <TabsList>
                          <TabsTrigger value="all">All</TabsTrigger>
                          <TabsTrigger value="published">Published</TabsTrigger>
                          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
                          <TabsTrigger value="draft">Draft</TabsTrigger>
                        </TabsList>
                      </Tabs>
                    </div>
                  </CardHeader>
                  <CardContent className="px-0 overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Title</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Author</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Read time</TableHead>
                          <TableHead>Tags</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredPosts.map((post) => (
                          <TableRow key={post.id}>
                            <TableCell className="min-w-[280px]">
                              <button
                                type="button"
                                onClick={() => handleEdit(post)}
                                className="flex items-center gap-4 text-left"
                              >
                                <img
                                  src={post.cover}
                                  alt={post.title}
                                  className="h-12 w-12 rounded-xl object-cover"
                                />
                                <div>
                                  <div className="font-medium text-foreground">
                                    {post.title || "Untitled"}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {post.slug || "no-slug"}
                                  </div>
                                </div>
                              </button>
                            </TableCell>
                            <TableCell>
                              <Badge variant="secondary">{post.category}</Badge>
                            </TableCell>
                            <TableCell>
                              <Badge className={statusStyles[post.status]}>
                                {post.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2 text-sm">
                                <Avatar className="h-8 w-8">
                                  <AvatarFallback>
                                    {post.author
                                      .split(" ")
                                      .map((word) => word[0])
                                      .slice(0, 2)
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                                {post.author}
                              </div>
                            </TableCell>
                            <TableCell>{formatBlogDate(post.date, "en-US")}</TableCell>
                            <TableCell>{post.readTime}</TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1">
                                {post.tags.length === 0 && (
                                  <span className="text-xs text-muted-foreground">
                                    -
                                  </span>
                                )}
                                {post.tags.slice(0, 2).map((tag) => (
                                  <Badge key={tag} variant="outline">
                                    {tag}
                                  </Badge>
                                ))}
                                {post.tags.length > 2 && (
                                  <Badge variant="outline">
                                    +{post.tags.length - 2}
                                  </Badge>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon-sm">
                                    <MoreHorizontal className="size-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => handleEdit(post)}>
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => handleDuplicate(post)}
                                  >
                                    Duplicate
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    onClick={() => handleDelete(post.id)}
                                    className="text-destructive"
                                  >
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    {filteredPosts.length === 0 && (
                      <div className="px-6 pb-6 text-sm text-muted-foreground">
                        No posts match your search.
                      </div>
                    )}
                  </CardContent>
                </Card>
              </>
            )}

            {/* Media Vault View */}
            {activeNav === "media" && (
              <>
                <header className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                  <div className="space-y-3">
                    <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                      Asset Management
                    </p>
                    <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
                      Media Vault
                    </h1>
                    <p className="max-w-xl text-base text-muted-foreground">
                      Upload and manage images, videos, and other media files for your content.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <Button>
                      <Upload className="size-4" />
                      Upload Media
                    </Button>
                  </div>
                </header>

                <div className="grid gap-4 lg:grid-cols-3">
                  <Card className="admin-card">
                    <CardHeader className="pb-2">
                      <CardDescription>Total Files</CardDescription>
                      <CardTitle className="text-3xl">24</CardTitle>
                    </CardHeader>
                    <CardContent className="text-xs text-muted-foreground">
                      Images & Videos
                    </CardContent>
                  </Card>
                  <Card className="admin-card">
                    <CardHeader className="pb-2">
                      <CardDescription>Storage Used</CardDescription>
                      <CardTitle className="text-3xl">128 MB</CardTitle>
                    </CardHeader>
                    <CardContent className="text-xs text-muted-foreground">
                      of 5 GB available
                    </CardContent>
                  </Card>
                  <Card className="admin-card">
                    <CardHeader className="pb-2">
                      <CardDescription>Last Upload</CardDescription>
                      <CardTitle className="text-3xl">Today</CardTitle>
                    </CardHeader>
                    <CardContent className="text-xs text-muted-foreground">
                      2 hours ago
                    </CardContent>
                  </Card>
                </div>

                <Card className="admin-card">
                  <CardHeader>
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <CardTitle>Media Files</CardTitle>
                        <CardDescription>
                          Your uploaded images and videos
                        </CardDescription>
                      </div>
                      <Tabs defaultValue="all">
                        <TabsList>
                          <TabsTrigger value="all">All</TabsTrigger>
                          <TabsTrigger value="images">Images</TabsTrigger>
                          <TabsTrigger value="videos">Videos</TabsTrigger>
                        </TabsList>
                      </Tabs>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                        <div
                          key={i}
                          className="aspect-square rounded-xl border-2 border-dashed border-border/50 bg-muted/30 flex flex-col items-center justify-center gap-2 hover:border-primary/30 cursor-pointer"
                        >
                          {i % 3 === 0 ? (
                            <Video className="size-8 text-muted-foreground" />
                          ) : (
                            <Image className="size-8 text-muted-foreground" />
                          )}
                          <span className="text-xs text-muted-foreground">media_{i}.{i % 3 === 0 ? 'mp4' : 'jpg'}</span>
                        </div>
                      ))}
                      <div className="aspect-square rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 flex flex-col items-center justify-center gap-2 hover:bg-primary/10 cursor-pointer">
                        <ImagePlus className="size-8 text-primary" />
                        <span className="text-xs text-primary font-medium">Add New</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            {/* Experience View */}
            {activeNav === "experience" && (
              <>
                <header className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                  <div className="space-y-3">
                    <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                      Tour Management
                    </p>
                    <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
                      Experience
                    </h1>
                    <p className="max-w-xl text-base text-muted-foreground">
                      Manage tours, destinations, and travel experiences for your visitors.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <Button>
                      <Plus className="size-4" />
                      Add Experience
                    </Button>
                  </div>
                </header>

                <div className="grid gap-4 lg:grid-cols-4">
                  <Card className="admin-card">
                    <CardHeader className="pb-2">
                      <CardDescription>Total Tours</CardDescription>
                      <CardTitle className="text-3xl">12</CardTitle>
                    </CardHeader>
                    <CardContent className="text-xs text-muted-foreground">
                      Active experiences
                    </CardContent>
                  </Card>
                  <Card className="admin-card">
                    <CardHeader className="pb-2">
                      <CardDescription>Destinations</CardDescription>
                      <CardTitle className="text-3xl">8</CardTitle>
                    </CardHeader>
                    <CardContent className="text-xs text-muted-foreground">
                      Unique locations
                    </CardContent>
                  </Card>
                  <Card className="admin-card">
                    <CardHeader className="pb-2">
                      <CardDescription>Featured</CardDescription>
                      <CardTitle className="text-3xl">4</CardTitle>
                    </CardHeader>
                    <CardContent className="text-xs text-muted-foreground">
                      Homepage showcase
                    </CardContent>
                  </Card>
                  <Card className="admin-card">
                    <CardHeader className="pb-2">
                      <CardDescription>Categories</CardDescription>
                      <CardTitle className="text-3xl">5</CardTitle>
                    </CardHeader>
                    <CardContent className="text-xs text-muted-foreground">
                      Tour types
                    </CardContent>
                  </Card>
                </div>

                <Card className="admin-card">
                  <CardHeader>
                    <CardTitle>Tours & Experiences</CardTitle>
                    <CardDescription>
                      Manage your travel experiences
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      { name: "Kyrenia Harbor Walk", location: "Kyrenia", type: "Walking Tour", status: "Active" },
                      { name: "Famagusta History", location: "Famagusta", type: "Cultural", status: "Active" },
                      { name: "Karpaz Peninsula", location: "Karpaz", type: "Nature", status: "Draft" },
                      { name: "Nicosia Old Town", location: "Nicosia", type: "Walking Tour", status: "Active" },
                    ].map((tour, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-4 p-4 rounded-xl border border-border/50 hover:bg-muted/30 cursor-pointer"
                      >
                        <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Map className="size-6 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium">{tour.name}</p>
                          <p className="text-sm text-muted-foreground">{tour.location} • {tour.type}</p>
                        </div>
                        <Badge className={tour.status === "Active" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}>
                          {tour.status}
                        </Badge>
                        <Button variant="ghost" size="icon-sm">
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </>
            )}

            {/* Settings View */}
            {activeNav === "settings" && (
              <>
                <header className="flex flex-col gap-6">
                  <div className="space-y-3">
                    <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                      Configuration
                    </p>
                    <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
                      Settings
                    </h1>
                    <p className="max-w-xl text-base text-muted-foreground">
                      Manage your admin panel preferences and site configuration.
                    </p>
                  </div>
                </header>

                <div className="grid gap-6 lg:grid-cols-2">
                  <Card className="admin-card">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <User className="size-5 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-base">Profile Settings</CardTitle>
                          <CardDescription>Manage your account details</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="text-xs font-medium text-muted-foreground">Display Name</label>
                        <Input defaultValue="Admin Desk" />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-muted-foreground">Email</label>
                        <Input defaultValue="editor@cyprigo.com" />
                      </div>
                      <Button size="sm">Save Changes</Button>
                    </CardContent>
                  </Card>

                  <Card className="admin-card">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Globe className="size-5 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-base">Site Settings</CardTitle>
                          <CardDescription>Configure website options</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="text-xs font-medium text-muted-foreground">Site Name</label>
                        <Input defaultValue="Cyprigo" />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-muted-foreground">Default Language</label>
                        <Select defaultValue="en">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="tr">Türkçe</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button size="sm">Save Changes</Button>
                    </CardContent>
                  </Card>

                  <Card className="admin-card">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Palette className="size-5 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-base">Appearance</CardTitle>
                          <CardDescription>Customize the look and feel</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between p-3 rounded-lg border border-border/50">
                        <div>
                          <p className="font-medium text-sm">Dark Mode</p>
                          <p className="text-xs text-muted-foreground">Switch between light and dark themes</p>
                        </div>
                        <Badge variant="outline">Coming Soon</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-lg border border-border/50">
                        <div>
                          <p className="font-medium text-sm">Accent Color</p>
                          <p className="text-xs text-muted-foreground">Customize primary color</p>
                        </div>
                        <div className="h-6 w-6 rounded-full bg-primary" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="admin-card">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Lock className="size-5 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-base">Security</CardTitle>
                          <CardDescription>Manage access and permissions</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between p-3 rounded-lg border border-border/50">
                        <div>
                          <p className="font-medium text-sm">Change Password</p>
                          <p className="text-xs text-muted-foreground">Update your security credentials</p>
                        </div>
                        <Button variant="outline" size="sm">Update</Button>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-lg border border-border/50">
                        <div>
                          <p className="font-medium text-sm">Two-Factor Auth</p>
                          <p className="text-xs text-muted-foreground">Add extra security layer</p>
                        </div>
                        <Badge variant="outline">Disabled</Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}
          </section>
        </div>
      </div>

      <Dialog open={isScheduleOpen} onOpenChange={setIsScheduleOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schedule releases</DialogTitle>
            <DialogDescription>
              Choose a publish date for a new post. Scheduled posts automatically
              switch to Published on the selected day.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5">
            <div className="grid gap-2">
              <label className="text-xs font-medium text-muted-foreground">
                Publish date
              </label>
              <Input
                type="date"
                value={scheduleDate}
                onChange={(event) => setScheduleDate(event.target.value)}
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button type="button" onClick={handleCreateScheduledPost}>
                <Plus className="size-4" />
                Create scheduled post
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsScheduleOpen(false)
                  setActiveNav("blog")
                  setStatusFilter("scheduled")
                }}
              >
                View scheduled
              </Button>
            </div>

            <Separator />

            <div className="space-y-3">
              <p className="text-sm font-semibold text-foreground">
                Upcoming schedule
              </p>
              {upcomingScheduled.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No scheduled releases yet.
                </p>
              ) : (
                <div className="space-y-2">
                  {upcomingScheduled.slice(0, 6).map((post) => (
                    <button
                      key={post.id}
                      type="button"
                      onClick={() => {
                        setIsScheduleOpen(false)
                        window.setTimeout(() => handleEdit(post), 0)
                      }}
                      className="flex w-full items-center justify-between gap-3 rounded-xl border border-border/70 bg-muted/30 px-3 py-2 text-left transition-colors hover:bg-muted/45"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-foreground">
                          {post.title || "Untitled"}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {post.slug || "no-slug"} • {post.category}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        <Badge className={statusStyles[post.status]}>
                          {formatBlogDate(post.date, "en-US")}
                        </Badge>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditorOpen} onOpenChange={setIsEditorOpen}>
        <DialogContent className="admin-dialog-content !left-0 !top-0 !max-w-none !h-screen !w-screen !translate-x-0 !translate-y-0 !rounded-none !border-0 !p-0 !animate-none">
          <div className="admin-editor-shell">
            <DialogHeader className="border-b border-border/70 px-6 py-5 pr-16 text-left">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <DialogTitle className="text-2xl">
                    {isNewDraft ? "Create new blog post" : "Edit blog post"}
                  </DialogTitle>
                  <DialogDescription>
                    Build premium editorial content with a full-screen workspace.
                  </DialogDescription>
                  {editorError && (
                    <p className="mt-3 text-sm text-destructive">
                      {editorError}
                    </p>
                  )}
                  {editorNotice && !editorError && (
                    <p className="mt-3 text-sm text-muted-foreground">
                      {editorNotice}
                    </p>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge className={statusStyles[draft.status]}>
                    {draft.status}
                  </Badge>
                  <Button type="button" variant="outline" onClick={handleSaveChanges}>
                    <Save className="size-4" />
                    Save changes
                  </Button>
                  <Button type="button" onClick={handlePublishNow}>
                    Publish
                  </Button>
                </div>
              </div>
            </DialogHeader>

            <div className="admin-editor-toolbar">
              <Button
                type="button"
                size="icon-sm"
                variant="outline"
                className={toolbarButtonClass(editor?.isActive("bold"))}
                onClick={() => editor?.chain().focus().toggleBold().run()}
              >
                <Bold className="size-4" />
              </Button>
              <Button
                type="button"
                size="icon-sm"
                variant="outline"
                className={toolbarButtonClass(editor?.isActive("italic"))}
                onClick={() => editor?.chain().focus().toggleItalic().run()}
              >
                <Italic className="size-4" />
              </Button>
              <Button
                type="button"
                size="icon-sm"
                variant="outline"
                className={toolbarButtonClass(editor?.isActive("underline"))}
                onClick={() => editor?.chain().focus().toggleUnderline().run()}
              >
                <UnderlineIcon className="size-4" />
              </Button>
              <Separator orientation="vertical" className="h-8" />
              <Button
                type="button"
                size="icon-sm"
                variant="outline"
                className={toolbarButtonClass(
                  editor?.isActive("heading", { level: 2 })
                )}
                onClick={() =>
                  editor?.chain().focus().toggleHeading({ level: 2 }).run()
                }
              >
                <Heading2 className="size-4" />
              </Button>
              <Button
                type="button"
                size="icon-sm"
                variant="outline"
                className={toolbarButtonClass(
                  editor?.isActive("heading", { level: 3 })
                )}
                onClick={() =>
                  editor?.chain().focus().toggleHeading({ level: 3 }).run()
                }
              >
                <Heading3 className="size-4" />
              </Button>
              <Separator orientation="vertical" className="h-8" />
              <Button
                type="button"
                size="icon-sm"
                variant="outline"
                className={toolbarButtonClass(editor?.isActive("bulletList"))}
                onClick={() =>
                  editor?.chain().focus().toggleBulletList().run()
                }
              >
                <List className="size-4" />
              </Button>
              <Button
                type="button"
                size="icon-sm"
                variant="outline"
                className={toolbarButtonClass(editor?.isActive("orderedList"))}
                onClick={() =>
                  editor?.chain().focus().toggleOrderedList().run()
                }
              >
                <ListOrdered className="size-4" />
              </Button>
              <Button
                type="button"
                size="icon-sm"
                variant="outline"
                className={toolbarButtonClass(editor?.isActive("blockquote"))}
                onClick={() =>
                  editor?.chain().focus().toggleBlockquote().run()
                }
              >
                <Quote className="size-4" />
              </Button>
              <Separator orientation="vertical" className="h-8" />
              <Button
                type="button"
                size="icon-sm"
                variant="outline"
                onClick={() => {
                  const url = window.prompt("Paste a link URL")
                  if (url) {
                    editor?.chain().focus().extendMarkRange("link").setLink({
                      href: url,
                    }).run()
                  }
                }}
              >
                <Link2 className="size-4" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto">
              <div className="mx-auto grid w-full max-w-6xl gap-8 px-6 py-8 pb-16 lg:grid-cols-[1.6fr_0.9fr]">
                <div className="space-y-6">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">
                      Title
                    </label>
                    <Input
                      value={draft.title}
                      onChange={(event) => {
                        setEditorError(null)
                        setEditorNotice(null)
                        setDraft((prev) => ({
                          ...prev,
                          title: event.target.value,
                        }))
                      }}
                      placeholder="Enter a blog title"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">
                      Excerpt
                    </label>
                    <Textarea
                      value={draft.excerpt}
                      onChange={(event) =>
                        setDraft((prev) => ({
                          ...prev,
                          excerpt: event.target.value,
                        }))
                      }
                      placeholder="Short summary for the listing page"
                    />
                  </div>
                  <div className="admin-editor">
                    {editor ? (
                      <EditorContent editor={editor} />
                    ) : (
                      <div className="p-6 text-sm text-muted-foreground">
                        Loading editor...
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-6">
                  <Card className="admin-card p-5">
                    <CardHeader className="px-0 pb-3">
                      <CardTitle className="text-base">Post settings</CardTitle>
                      <CardDescription>
                        Configure metadata and publishing details.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4 px-0">
                      <div>
                        <label className="text-xs font-medium text-muted-foreground">
                          Slug
                        </label>
                        <Input
                          value={draft.slug}
                          onChange={(event) => {
                            setEditorError(null)
                            setEditorNotice(null)
                            setDraft((prev) => ({
                              ...prev,
                              slug: event.target.value,
                            }))
                          }}
                          placeholder="e.g. kyrenia-48-hours"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-muted-foreground">
                          Cover image
                        </label>
                        <Input
                          value={draft.cover}
                          onChange={(event) =>
                            setDraft((prev) => ({
                              ...prev,
                              cover: event.target.value,
                            }))
                          }
                        />
                      </div>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <label className="text-xs font-medium text-muted-foreground">
                            Category
                          </label>
                          <Select
                            value={draft.category}
                            onValueChange={(value) =>
                              setDraft((prev) => ({
                                ...prev,
                                category: value,
                              }))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              {blogCategories.map((category) => (
                                <SelectItem key={category} value={category}>
                                  {category}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-muted-foreground">
                            Status
                          </label>
                          <Select
                            value={draft.status}
                            onValueChange={(value) => {
                              setEditorError(null)
                              setEditorNotice(null)
                              setDraft((prev) => {
                                const nextStatus = value as EditorStatus

                                if (nextStatus === "Published") {
                                  return {
                                    ...prev,
                                    status: nextStatus,
                                    date: getLocalDateISO(),
                                  }
                                }

                                if (nextStatus === "Scheduled") {
                                  const today = getLocalDateISO()
                                  const nextDate =
                                    !prev.date || prev.date <= today
                                      ? getLocalDateISO(addDays(new Date(), 1))
                                      : prev.date

                                  return {
                                    ...prev,
                                    status: nextStatus,
                                    date: nextDate,
                                  }
                                }

                                return {
                                  ...prev,
                                  status: nextStatus,
                                }
                              })
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Published">Published</SelectItem>
                              <SelectItem value="Scheduled">Scheduled</SelectItem>
                              <SelectItem value="Draft">Draft</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <label className="text-xs font-medium text-muted-foreground">
                            Author
                          </label>
                          <Input
                            value={draft.author}
                            onChange={(event) =>
                              setDraft((prev) => ({
                                ...prev,
                                author: event.target.value,
                              }))
                            }
                            placeholder="Author name"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-muted-foreground">
                            Publish date
                          </label>
                          <Input
                            type="date"
                            value={draft.date}
                            onChange={(event) => {
                              setEditorError(null)
                              setEditorNotice(null)
                              setDraft((prev) => ({
                                ...prev,
                                date: event.target.value,
                              }))
                            }}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-muted-foreground">
                          Read time
                        </label>
                        <Input
                          value={draft.readTime}
                          onChange={(event) =>
                            setDraft((prev) => ({
                              ...prev,
                              readTime: event.target.value,
                            }))
                          }
                          placeholder="4 min read"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-muted-foreground">
                          Tags
                        </label>
                        <Input
                          value={draft.tags.join(", ")}
                          onChange={(event) =>
                            setDraft((prev) => ({
                              ...prev,
                              tags: event.target.value
                                .split(",")
                                .map((tag) => tag.trim())
                                .filter(Boolean),
                            }))
                          }
                          placeholder="Kyrenia, Marina, Boutique"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="admin-card p-5">
                    <CardHeader className="px-0 pb-3">
                      <CardTitle className="text-base">Content insights</CardTitle>
                      <CardDescription>
                        Editorial quality signals for this post.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-3 px-0 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Word count</span>
                        <span className="font-semibold text-foreground">
                          {wordCount}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Est. read time</span>
                        <span className="font-semibold text-foreground">
                          {estimatedReadTime}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Slug preview</span>
                        <span className="font-semibold text-foreground">
                          {draft.slug || "-"}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  )
}
