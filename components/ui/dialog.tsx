"use client"

import * as React from "react"
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog"

import { cn } from "@/lib/utils"

function Dialog(props: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />
}

function DialogPortal(props: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />
}

function DialogClose(props: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />
}

function DialogBackdrop({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Backdrop>) {
  return (
    <DialogPrimitive.Backdrop
      data-slot="dialog-backdrop"
      className={cn(
        "fixed inset-0 z-[100] bg-black/90 transition-opacity duration-300",
        "data-[starting-style]:opacity-0 data-[ending-style]:opacity-0",
        "motion-reduce:transition-none",
        className
      )}
      {...props}
    />
  )
}

function DialogPopup({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Popup>) {
  return (
    <DialogPrimitive.Popup
      data-slot="dialog-popup"
      className={cn(
        "fixed inset-0 z-[100] flex flex-col outline-none transition-opacity duration-300",
        "data-[starting-style]:opacity-0 data-[ending-style]:opacity-0",
        "motion-reduce:transition-none",
        className
      )}
      {...props}
    />
  )
}

function DialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn(className)}
      {...props}
    />
  )
}

export {
  Dialog,
  DialogPortal,
  DialogClose,
  DialogBackdrop,
  DialogPopup,
  DialogTitle,
}
