"use client"

import { ChevronRight, Clock, Eye, FileText } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { formatBlogDate } from "@/lib/blog"
import { EditorPost, StatusFilter, statusConfig } from "./types"

interface OverviewViewProps {
  posts: EditorPost[]
  draftCount: number
  upcomingScheduled: EditorPost[]
  nextScheduledDate: string | undefined
  onNavigate: (nav: "blog") => void
  onSetStatusFilter: (filter: StatusFilter) => void
  onOpenSchedule: () => void
  onEditPost: (post: EditorPost) => void
}

export function OverviewView({
  posts,
  draftCount,
  upcomingScheduled,
  nextScheduledDate,
  onNavigate,
  onSetStatusFilter,
  onOpenSchedule,
  onEditPost,
}: OverviewViewProps) {
  const publishedCount = posts.filter((post) => post.status === "Published").length
  const scheduledCount = posts.filter((post) => post.status === "Scheduled").length
  const totalPosts = posts.length
  const publishedRate = totalPosts ? Math.round((publishedCount / totalPosts) * 100) : 0
  const scheduledRate = totalPosts ? Math.round((scheduledCount / totalPosts) * 100) : 0
  const draftRate = totalPosts ? Math.round((draftCount / totalPosts) * 100) : 0

  return (
    <div className="content-wrapper">
      <div className="stats-grid cols-3">
        <Card className="stat-card">
          <CardContent className="stat-content">
            <div className="stat-icon-wrapper published">
              <Eye className="stat-icon" />
            </div>
            <div className="stat-data">
              <p className="stat-value">{publishedCount}</p>
              <p className="stat-label">Yayında</p>
              <Progress value={publishedRate} className="mt-3" />
            </div>
          </CardContent>
        </Card>
        <Card className="stat-card">
          <CardContent className="stat-content">
            <div className="stat-icon-wrapper scheduled">
              <Clock className="stat-icon" />
            </div>
            <div className="stat-data">
              <p className="stat-value">{scheduledCount}</p>
              <p className="stat-label">Planlı</p>
              <Progress value={scheduledRate} className="mt-3" />
            </div>
          </CardContent>
        </Card>
        <Card className="stat-card">
          <CardContent className="stat-content">
            <div className="stat-icon-wrapper draft">
              <FileText className="stat-icon" />
            </div>
            <div className="stat-data">
              <p className="stat-value">{draftCount}</p>
              <p className="stat-label">Taslak</p>
              <Progress value={draftRate} className="mt-3" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions-grid">
        <Card className="action-card" onClick={() => { onNavigate("blog"); onSetStatusFilter("draft"); }}>
          <CardContent className="action-content">
            <div className="action-info">
              <h3 className="action-title">Taslakları İncele</h3>
              <p className="action-desc">{draftCount} taslak inceleme bekliyor</p>
            </div>
            <ChevronRight className="action-arrow" />
          </CardContent>
        </Card>

        <Card className="action-card" onClick={() => { onNavigate("blog"); onSetStatusFilter("scheduled"); onOpenSchedule(); }}>
          <CardContent className="action-content">
            <div className="action-info">
              <h3 className="action-title">Yazı Planla</h3>
              <p className="action-desc">
                {upcomingScheduled.length} yaklaşan • {nextScheduledDate ? formatBlogDate(nextScheduledDate, "tr-TR") : "Plan yok"}
              </p>
            </div>
            <ChevronRight className="action-arrow" />
          </CardContent>
        </Card>
      </div>

      {/* Recent Posts */}
      <Card className="recent-posts-card">
        <CardHeader className="card-header-flex">
          <div>
            <CardTitle>Son Yazılar</CardTitle>
            <CardDescription>Son içerik güncellemeleriniz</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={() => onNavigate("blog")}>
            Tümünü Gör
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="recent-posts-list">
            {posts.slice(0, 5).map((post) => (
              <div
                key={post.id}
                className="recent-post-item"
                onClick={() => onEditPost(post)}
              >
                <img
                  src={post.cover}
                  alt={post.title}
                  className="post-thumbnail"
                />
                <div className="post-info">
                  <p className="post-title">{post.title}</p>
                  <p className="post-meta">{post.category} • {post.readTime}</p>
                </div>
                <Badge variant="outline" className={statusConfig[post.status].className}>
                  {statusConfig[post.status].label}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
