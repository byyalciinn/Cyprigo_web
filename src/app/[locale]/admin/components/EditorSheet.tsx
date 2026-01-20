"use client"

import { useEffect, useState } from "react"
import { EditorContent, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import LinkExtension from "@tiptap/extension-link"
import Placeholder from "@tiptap/extension-placeholder"
import Underline from "@tiptap/extension-underline"
import {
  Bold,
  Calendar as CalendarIcon,
  Heading2,
  Heading3,
  Italic,
  Link2,
  List,
  ListOrdered,
  Quote,
  Save,
  Underline as UnderlineIcon,
  X,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { blogCategories } from "@/lib/blog"
import { EditorPost, EditorStatus, statusConfig } from "./types"
import { ImageUploader } from "./ImageUploader"

interface EditorSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  post: EditorPost
  isNewDraft: boolean
  onSave: (post: EditorPost) => void
  onPublish: (post: EditorPost) => void
  existingSlugs: string[]
}

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

const getWordCount = (html: string) => {
  const text = html.replace(/<[^>]*>/g, " ").trim()
  if (!text) return 0
  return text.split(/\s+/).filter(Boolean).length
}

export function EditorSheet({
  open,
  onOpenChange,
  post,
  isNewDraft,
  onSave,
  onPublish,
  existingSlugs,
}: EditorSheetProps) {
  const [draft, setDraft] = useState<EditorPost>(post)
  const [editorContent, setEditorContent] = useState(post.contentHtml)
  const [editorNotice, setEditorNotice] = useState<string | null>(null)
  const [editorError, setEditorError] = useState<string | null>(null)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] } }),
      Underline,
      LinkExtension.configure({ openOnClick: false, autolink: true }),
      Placeholder.configure({
        placeholder: "Blog yazınızı buraya yazın...",
      }),
    ],
    immediatelyRender: false,
    content: editorContent,
    editorProps: {
      attributes: {
        class: "prose prose-slate max-w-none min-h-[360px] p-6 outline-none focus:outline-none",
      },
    },
    onUpdate: ({ editor }) => {
      setEditorContent(editor.getHTML())
    },
  })

  // Reset state when post changes
  useEffect(() => {
    if (open) {
      setDraft(post)
      setEditorContent(post.contentHtml)
      setEditorError(null)
      setEditorNotice(null)
      if (editor) {
        editor.commands.setContent(post.contentHtml || "<p></p>", { emitUpdate: false })
      }
    }
  }, [post.id, open, editor])

  const wordCount = getWordCount(editorContent)
  const estimatedReadTime = wordCount
    ? `${Math.max(1, Math.ceil(wordCount / 220))} dk okuma`
    : "0 dk okuma"
  const draftDateValue = draft.date ? parseLocalDate(draft.date) : undefined

  const handleSave = () => {
    setEditorError(null)
    const html = editor?.getHTML() ?? editorContent
    const updatedDraft = {
      ...draft,
      contentHtml: html,
      readTime: draft.readTime || estimatedReadTime,
    }
    onSave(updatedDraft)
    setEditorNotice("Kaydedildi")
    setTimeout(() => setEditorNotice(null), 1800)
  }

  const handlePublish = () => {
    setEditorNotice(null)

    const title = draft.title.trim()
    const slug = draft.slug.trim()

    if (!title) {
      setEditorError("Yayınlamadan önce başlık gereklidir.")
      return
    }

    if (!slug) {
      setEditorError("Yayınlamadan önce slug gereklidir.")
      return
    }

    const slugTaken = existingSlugs.some((s) => s === slug && s !== post.slug)
    if (slugTaken) {
      setEditorError("Bu slug başka bir yazı tarafından kullanılıyor.")
      return
    }

    const html = editor?.getHTML() ?? editorContent
    const todayDate = getLocalDateISO()
    const updatedDraft = {
      ...draft,
      contentHtml: html,
      status: "Published" as EditorStatus,
      date: todayDate,
      slug,
      title,
      readTime: draft.readTime || estimatedReadTime,
    }
    onPublish(updatedDraft)
    onOpenChange(false)
  }

  const toolbarButtonClass = (isActive?: boolean) =>
    cn(
      "h-8 w-8 border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900",
      isActive && "bg-slate-900 text-white border-slate-900 hover:bg-slate-800 hover:text-white"
    )

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-full p-0 border-0 [&>button]:hidden"
      >
        <SheetTitle className="sr-only">
          {isNewDraft ? "Yeni Yazı" : "Yazıyı Düzenle"}
        </SheetTitle>
        <div className="flex flex-col h-full bg-slate-50">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onOpenChange(false)}
                className="h-9 w-9"
              >
                <X className="h-5 w-5" />
              </Button>
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  {isNewDraft ? "Yeni Yazı" : "Yazıyı Düzenle"}
                </h2>
                {editorError && (
                  <p className="text-sm text-red-600">{editorError}</p>
                )}
                {editorNotice && !editorError && (
                  <p className="text-sm text-slate-500">{editorNotice}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className={statusConfig[draft.status].className}>
                {statusConfig[draft.status].label}
              </Badge>
              <Button variant="outline" size="sm" onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Kaydet
              </Button>
              <Button size="sm" onClick={handlePublish}>
                Yayınla
              </Button>
            </div>
          </div>

          {/* Toolbar */}
          <div className="flex items-center gap-1 px-6 py-3 bg-white border-b border-slate-200">
            <Button
              type="button"
              size="icon"
              variant="outline"
              className={toolbarButtonClass(editor?.isActive("bold"))}
              onClick={() => editor?.chain().focus().toggleBold().run()}
            >
              <Bold className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              size="icon"
              variant="outline"
              className={toolbarButtonClass(editor?.isActive("italic"))}
              onClick={() => editor?.chain().focus().toggleItalic().run()}
            >
              <Italic className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              size="icon"
              variant="outline"
              className={toolbarButtonClass(editor?.isActive("underline"))}
              onClick={() => editor?.chain().focus().toggleUnderline().run()}
            >
              <UnderlineIcon className="h-4 w-4" />
            </Button>
            <Separator orientation="vertical" className="h-6 mx-2" />
            <Button
              type="button"
              size="icon"
              variant="outline"
              className={toolbarButtonClass(editor?.isActive("heading", { level: 2 }))}
              onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
            >
              <Heading2 className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              size="icon"
              variant="outline"
              className={toolbarButtonClass(editor?.isActive("heading", { level: 3 }))}
              onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
            >
              <Heading3 className="h-4 w-4" />
            </Button>
            <Separator orientation="vertical" className="h-6 mx-2" />
            <Button
              type="button"
              size="icon"
              variant="outline"
              className={toolbarButtonClass(editor?.isActive("bulletList"))}
              onClick={() => editor?.chain().focus().toggleBulletList().run()}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              size="icon"
              variant="outline"
              className={toolbarButtonClass(editor?.isActive("orderedList"))}
              onClick={() => editor?.chain().focus().toggleOrderedList().run()}
            >
              <ListOrdered className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              size="icon"
              variant="outline"
              className={toolbarButtonClass(editor?.isActive("blockquote"))}
              onClick={() => editor?.chain().focus().toggleBlockquote().run()}
            >
              <Quote className="h-4 w-4" />
            </Button>
            <Separator orientation="vertical" className="h-6 mx-2" />
            <Button
              type="button"
              size="icon"
              variant="outline"
              onClick={() => {
                const url = window.prompt("URL girin")
                if (url) editor?.chain().focus().extendMarkRange("link").setLink({ href: url }).run()
              }}
            >
              <Link2 className="h-4 w-4" />
            </Button>
          </div>

          {/* Body */}
          <ScrollArea className="flex-1">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 p-6 max-w-7xl mx-auto">
              {/* Main Content */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Başlık</label>
                  <Input
                    value={draft.title}
                    onChange={(e) => {
                      setEditorError(null)
                      setEditorNotice(null)
                      setDraft((d) => ({ ...d, title: e.target.value }))
                    }}
                    placeholder="Yazı başlığını girin"
                    className="text-lg h-12"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Özet</label>
                  <Textarea
                    value={draft.excerpt}
                    onChange={(e) => setDraft((d) => ({ ...d, excerpt: e.target.value }))}
                    placeholder="Kısa açıklama"
                    rows={2}
                  />
                </div>
                <div className="rounded-lg border border-slate-200 bg-white min-h-[400px]">
                  {editor ? (
                    <EditorContent editor={editor} />
                  ) : (
                    <div className="p-6 text-slate-500">Yükleniyor...</div>
                  )}
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Yazı Ayarları</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-slate-600">Slug</label>
                      <Input
                        value={draft.slug}
                        onChange={(e) => {
                          setEditorError(null)
                          setDraft((d) => ({ ...d, slug: e.target.value }))
                        }}
                        placeholder="yazi-slug"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-slate-600">Kapak Resmi</label>
                      <ImageUploader
                        value={draft.cover}
                        onChange={(url) => setDraft((d) => ({ ...d, cover: url }))}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-slate-600">Kategori</label>
                        <Select
                          value={draft.category}
                          onValueChange={(v) => setDraft((d) => ({ ...d, category: v }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {blogCategories.map((c) => (
                              <SelectItem key={c} value={c}>
                                {c}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-slate-600">Durum</label>
                        <Select
                          value={draft.status}
                          onValueChange={(v) => {
                            setEditorError(null)
                            setDraft((d) => {
                              if (v === "Published")
                                return { ...d, status: v as EditorStatus, date: getLocalDateISO() }
                              if (v === "Scheduled") {
                                const nextDate =
                                  !d.date || d.date <= getLocalDateISO()
                                    ? getLocalDateISO(addDays(new Date(), 1))
                                    : d.date
                                return { ...d, status: v as EditorStatus, date: nextDate }
                              }
                              return { ...d, status: v as EditorStatus }
                            })
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Published">Yayında</SelectItem>
                            <SelectItem value="Scheduled">Planlandı</SelectItem>
                            <SelectItem value="Draft">Taslak</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-slate-600">Yazar</label>
                        <Input
                          value={draft.author}
                          onChange={(e) => setDraft((d) => ({ ...d, author: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-slate-600">Tarih</label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-between">
                              <span>{draft.date || "Tarih seçin"}</span>
                              <CalendarIcon className="h-4 w-4 text-slate-500" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={draftDateValue}
                              onSelect={(date) => {
                                if (!date) return
                                setDraft((d) => ({ ...d, date: getLocalDateISO(date) }))
                              }}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-slate-600">Etiketler</label>
                      <Input
                        value={draft.tags.join(", ")}
                        onChange={(e) =>
                          setDraft((d) => ({
                            ...d,
                            tags: e.target.value
                              .split(",")
                              .map((t) => t.trim())
                              .filter(Boolean),
                          }))
                        }
                        placeholder="etiket1, etiket2"
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">İçerik İstatistikleri</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Kelimeler</span>
                      <span className="font-medium">{wordCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Okuma süresi</span>
                      <span className="font-medium">{estimatedReadTime}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  )
}
