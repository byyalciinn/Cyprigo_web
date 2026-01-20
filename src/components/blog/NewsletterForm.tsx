"use client"

import { useState } from "react"

import { cn } from "@/lib/utils"

type NewsletterFormProps = {
  variant?: "stacked" | "inline"
  submitLabel?: string
  placeholder?: string
  source?: string
  className?: string
}

type FormState = "idle" | "loading" | "success" | "error"

const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/

export function NewsletterForm({
  variant = "stacked",
  submitLabel = "Abone Ol",
  placeholder = "E-posta adresiniz",
  source,
  className,
}: NewsletterFormProps) {
  const [email, setEmail] = useState("")
  const [state, setState] = useState<FormState>("idle")
  const [message, setMessage] = useState<string | null>(null)

  const inputClassName =
    variant === "inline"
      ? "blog-footer-input flex-1 min-w-[220px]"
      : "blog-input"
  const buttonClassName =
    variant === "inline"
      ? "blog-footer-button"
      : "w-full rounded-xl bg-foreground px-4 py-3 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
  const formClassName =
    variant === "inline"
      ? "flex flex-wrap items-center gap-3"
      : "space-y-3"

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmed = email.trim()
    if (!trimmed) {
      setState("error")
      setMessage("LÃ¼tfen e-posta adresinizi girin.")
      return
    }
    if (!emailRegex.test(trimmed)) {
      setState("error")
      setMessage("GeÃ§erli bir e-posta adresi girin.")
      return
    }

    setState("loading")
    setMessage(null)

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed, source }),
      })

      const payload = await response.json()

      if (!response.ok) {
        setState("error")
        setMessage(payload?.error ?? "KayÄ±t sÄ±rasÄ±nda bir hata oluÅŸtu.")
        return
      }

      if (payload?.created) {
        setState("success")
        setMessage("TeÅŸekkÃ¼rler! KaydÄ±nÄ±z alÄ±ndÄ±.")
      } else {
        setState("success")
        setMessage("Bu e-posta zaten kayÄ±tlÄ±.")
      }
      setEmail("")
    } catch (error) {
      setState("error")
      setMessage("KayÄ±t sÄ±rasÄ±nda bir hata oluÅŸtu.")
    }
  }

  return (
    <form onSubmit={handleSubmit} className={cn(formClassName, className)}>
      <input
        className={inputClassName}
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        disabled={state === "loading"}
      />
      <button
        type="submit"
        className={buttonClassName}
        disabled={state === "loading"}
      >
        {state === "loading" ? "GÃ¶nderiliyor..." : submitLabel}
      </button>
      {message && (
        <p
          className={cn(
            "text-xs",
            state === "error" ? "text-red-500" : "text-muted-foreground"
          )}
          role="status"
          aria-live="polite"
        >
          {message}
        </p>
      )}
    </form>
  )
}
