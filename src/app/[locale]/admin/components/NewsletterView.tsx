"use client"

import { useCallback, useEffect, useState } from "react"
import { RefreshCw } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { NewsletterSubscriber } from "@/lib/newsletter"

const formatDateTime = (value: string) =>
  new Intl.DateTimeFormat("tr-TR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value))

export function NewsletterView() {
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSubscribers = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/newsletter")
      const payload = await response.json()
      if (!response.ok) {
        throw new Error(payload?.error || "Liste alınamadı.")
      }
      setSubscribers(payload?.subscribers ?? [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Liste alınamadı.")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSubscribers()
  }, [fetchSubscribers])

  return (
    <div className="content-wrapper">
      <Card>
        <CardHeader className="card-header-flex">
          <div>
            <CardTitle>Bülten Aboneleri</CardTitle>
            <CardDescription>
              Toplam {subscribers.length} kayıtlı e-posta
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={fetchSubscribers}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Yenile
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          {error && (
            <div className="p-4">
              <Alert variant="destructive">
                <AlertTitle>Hata</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </div>
          )}
          {isLoading ? (
            <div className="space-y-3 p-6">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>E-posta</TableHead>
                    <TableHead>Kayıt Tarihi</TableHead>
                    <TableHead>Kaynak</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subscribers.map((subscriber) => (
                    <TableRow key={subscriber.id}>
                      <TableCell className="font-medium">{subscriber.email}</TableCell>
                      <TableCell className="text-slate-600">
                        {formatDateTime(subscriber.createdAt)}
                      </TableCell>
                      <TableCell className="text-slate-500">
                        {subscriber.source ?? "-"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {subscribers.length === 0 && (
                <div className="p-8 text-center text-slate-500">
                  Henüz bülten abonesi bulunmuyor.
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
