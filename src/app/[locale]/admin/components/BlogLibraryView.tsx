"use client"

import { useEffect, useMemo, useState } from "react"
import { MoreHorizontal, Search } from "lucide-react"

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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { formatBlogDate } from "@/lib/blog"
import { EditorPost, StatusFilter, statusConfig } from "./types"

interface BlogLibraryViewProps {
  posts: EditorPost[]
  query: string
  statusFilter: StatusFilter
  onQueryChange: (query: string) => void
  onStatusFilterChange: (filter: StatusFilter) => void
  onEditPost: (post: EditorPost) => void
  onDuplicatePost: (post: EditorPost) => void
  onDeletePost: (postId: string) => void
}

export function BlogLibraryView({
  posts,
  query,
  statusFilter,
  onQueryChange,
  onStatusFilterChange,
  onEditPost,
  onDuplicatePost,
  onDeletePost,
}: BlogLibraryViewProps) {
  const [page, setPage] = useState(1)
  const pageSize = 8
  const pageCount = Math.max(1, Math.ceil(posts.length / pageSize))
  const currentPage = Math.min(page, pageCount)

  const pagedPosts = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return posts.slice(start, start + pageSize)
  }, [posts, currentPage, pageSize])

  const pageNumbers = useMemo(() => {
    const maxVisible = 5
    if (pageCount <= maxVisible) {
      return Array.from({ length: pageCount }, (_, i) => i + 1)
    }
    const start = Math.max(1, Math.min(currentPage - 2, pageCount - maxVisible + 1))
    const end = Math.min(pageCount, start + maxVisible - 1)
    return Array.from({ length: end - start + 1 }, (_, i) => start + i)
  }, [pageCount, currentPage])

  useEffect(() => {
    setPage(1)
  }, [query, statusFilter])

  useEffect(() => {
    if (page > pageCount) setPage(pageCount)
  }, [page, pageCount])

  const showLeadingEllipsis = pageNumbers[0] > 2
  const showTrailingEllipsis = pageNumbers[pageNumbers.length - 1] < pageCount - 1

  return (
    <div className="content-wrapper">
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Tüm Yazılar</CardTitle>
              <CardDescription>Blog içeriklerinizi yönetin</CardDescription>
            </div>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={query}
                onChange={(e) => onQueryChange(e.target.value)}
                placeholder="Yazılarda ara..."
                className="pl-9"
              />
            </div>
            <Tabs value={statusFilter} onValueChange={(v) => onStatusFilterChange(v as StatusFilter)}>
              <TabsList>
                <TabsTrigger value="all">Tümü</TabsTrigger>
                <TabsTrigger value="published">Yayında</TabsTrigger>
                <TabsTrigger value="scheduled">Planlandı</TabsTrigger>
                <TabsTrigger value="draft">Taslak</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Başlık</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead>Durum</TableHead>
                <TableHead>Yazar</TableHead>
                <TableHead>Tarih</TableHead>
                <TableHead className="text-right">İşlemler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
            {pagedPosts.map((post) => (
              <TableRow key={post.id}>
                  <TableCell>
                    <button
                      type="button"
                      onClick={() => onEditPost(post)}
                      className="flex items-center gap-3 text-left"
                    >
                      <img
                        src={post.cover}
                        alt={post.title}
                        className="h-10 w-10 rounded-lg object-cover"
                      />
                      <div>
                        <p className="font-medium text-slate-900">{post.title || "Başlıksız"}</p>
                        <p className="text-xs text-slate-500">{post.slug || "slug-yok"}</p>
                      </div>
                    </button>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{post.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={statusConfig[post.status].className}>
                      {statusConfig[post.status].label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">
                          {post.author.split(" ").map((w) => w[0]).slice(0, 2).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-slate-600">{post.author}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-slate-600">{formatBlogDate(post.date, "tr-TR")}</TableCell>
                  <TableCell className="text-right">
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
                        <DropdownMenuItem onClick={() => onEditPost(post)}>Düzenle</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onDuplicatePost(post)}>Kopyala</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onDeletePost(post.id)} className="text-red-600">Sil</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
            ))}
          </TableBody>
        </Table>
        {posts.length > pageSize && (
          <div className="border-t px-4 py-3">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : undefined}
                    onClick={(event) => {
                      event.preventDefault()
                      setPage((value) => Math.max(1, value - 1))
                    }}
                  />
                </PaginationItem>
                {pageNumbers[0] > 1 && (
                  <PaginationItem>
                    <PaginationLink
                      href="#"
                      onClick={(event) => {
                        event.preventDefault()
                        setPage(1)
                      }}
                    >
                      1
                    </PaginationLink>
                  </PaginationItem>
                )}
                {showLeadingEllipsis && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}
                {pageNumbers.map((pageNumber) => (
                  <PaginationItem key={pageNumber}>
                    <PaginationLink
                      href="#"
                      isActive={pageNumber === currentPage}
                      onClick={(event) => {
                        event.preventDefault()
                        setPage(pageNumber)
                      }}
                    >
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                {showTrailingEllipsis && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}
                {pageNumbers[pageNumbers.length - 1] < pageCount && (
                  <PaginationItem>
                    <PaginationLink
                      href="#"
                      onClick={(event) => {
                        event.preventDefault()
                        setPage(pageCount)
                      }}
                    >
                      {pageCount}
                    </PaginationLink>
                  </PaginationItem>
                )}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    className={currentPage === pageCount ? "pointer-events-none opacity-50" : undefined}
                    onClick={(event) => {
                      event.preventDefault()
                      setPage((value) => Math.min(pageCount, value + 1))
                    }}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
        {posts.length === 0 && (
          <div className="p-8 text-center text-slate-500">Aramanızla eşleşen yazı bulunamadı.</div>
        )}
        </CardContent>
      </Card>
    </div>
  )
}
