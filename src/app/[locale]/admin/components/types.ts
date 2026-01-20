import type { BlogPost, BlogStatus } from "@/lib/blog"

export type EditorStatus = BlogStatus

export type EditorPost = BlogPost

export type StatusFilter = "all" | "published" | "scheduled" | "draft"
export type NavItem =
  | "overview"
  | "blog"
  | "newsletter"
  | "media"
  | "experience"
  | "settings"

export const statusConfig: Record<EditorStatus, { label: string; className: string }> = {
  Published: { label: "Yayında", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  Scheduled: { label: "Planlandı", className: "bg-blue-50 text-blue-700 border-blue-200" },
  Draft: { label: "Taslak", className: "bg-slate-100 text-slate-600 border-slate-200" },
}
