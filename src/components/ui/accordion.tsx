"use client"

import * as React from "react"
import { ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"

type AccordionContextValue = {
  openValue: string | null
  setOpenValue: (value: string | null) => void
  collapsible: boolean
}

const AccordionContext = React.createContext<AccordionContextValue | null>(null)

type AccordionProps = React.HTMLAttributes<HTMLDivElement> & {
  type?: "single"
  collapsible?: boolean
  defaultValue?: string
}

const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(
  ({ className, children, collapsible = false, defaultValue, ...props }, ref) => {
    const [openValue, setOpenValue] = React.useState<string | null>(
      defaultValue ?? null
    )

    const contextValue = React.useMemo(
      () => ({ openValue, setOpenValue, collapsible }),
      [openValue, collapsible]
    )

    return (
      <AccordionContext.Provider value={contextValue}>
        <div ref={ref} className={cn("w-full", className)} {...props}>
          {children}
        </div>
      </AccordionContext.Provider>
    )
  }
)
Accordion.displayName = "Accordion"

type AccordionItemContextValue = {
  value: string
  isOpen: boolean
  toggle: () => void
  triggerId: string
  contentId: string
}

const AccordionItemContext =
  React.createContext<AccordionItemContextValue | null>(null)

type AccordionItemProps = React.HTMLAttributes<HTMLDivElement> & {
  value: string
}

const AccordionItem = React.forwardRef<HTMLDivElement, AccordionItemProps>(
  ({ className, value, children, ...props }, ref) => {
    const context = React.useContext(AccordionContext)

    if (!context) {
      return null
    }

    const { openValue, setOpenValue, collapsible } = context
    const isOpen = openValue === value
    const triggerId = React.useId()
    const contentId = React.useId()

    const toggle = () => {
      if (isOpen) {
        if (collapsible) {
          setOpenValue(null)
        }
        return
      }

      setOpenValue(value)
    }

    return (
      <AccordionItemContext.Provider
        value={{ value, isOpen, toggle, triggerId, contentId }}
      >
        <div
          ref={ref}
          className={className}
          data-state={isOpen ? "open" : "closed"}
          {...props}
        >
          {children}
        </div>
      </AccordionItemContext.Provider>
    )
  }
)
AccordionItem.displayName = "AccordionItem"

type AccordionTriggerProps =
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    asChild?: boolean
  }

const AccordionTrigger = React.forwardRef<
  HTMLButtonElement,
  AccordionTriggerProps
>(({ className, children, onClick, ...props }, ref) => {
  const context = React.useContext(AccordionItemContext)

  if (!context) {
    return null
  }

  const { isOpen, toggle, triggerId, contentId } = context

  return (
    <div className="flex">
      <button
        ref={ref}
        type="button"
        id={triggerId}
        aria-controls={contentId}
        aria-expanded={isOpen}
        data-state={isOpen ? "open" : "closed"}
        className={cn(
          "flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline",
          className
        )}
        onClick={(event) => {
          onClick?.(event)
          if (!event.defaultPrevented) {
            toggle()
          }
        }}
        {...props}
      >
        {children}
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </button>
    </div>
  )
})
AccordionTrigger.displayName = "AccordionTrigger"

type AccordionContentProps = React.HTMLAttributes<HTMLDivElement>

const AccordionContent = React.forwardRef<HTMLDivElement, AccordionContentProps>(
  ({ className, children, ...props }, ref) => {
    const context = React.useContext(AccordionItemContext)

    if (!context) {
      return null
    }

    const { isOpen, triggerId, contentId } = context

    return (
      <div
        ref={ref}
        id={contentId}
        role="region"
        aria-labelledby={triggerId}
        data-state={isOpen ? "open" : "closed"}
        className={cn(
          "grid overflow-hidden text-sm transition-all duration-300 ease-out",
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        )}
        {...props}
      >
        <div className="overflow-hidden">
          <div className={cn("pb-4 pt-0", className)}>{children}</div>
        </div>
      </div>
    )
  }
)
AccordionContent.displayName = "AccordionContent"

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
