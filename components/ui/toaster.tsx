"use client"

import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(({ id, title, description, action, ...props }) => (
        <Toast 
          key={id} 
          {...props}
          className={cn(
            "z-[9999] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg",
            props.className
          )}
          style={{
            position: 'relative',
            zIndex: 9999,
            marginBottom: '0.5rem',
          }}
        >
          <div className="grid gap-1">
            {title && (
              <ToastTitle className="text-gray-900 dark:text-white font-medium">
                {title}
              </ToastTitle>
            )}
            {description && (
              <ToastDescription className="text-gray-700 dark:text-gray-300 text-sm">
                {description}
              </ToastDescription>
            )}
          </div>
          {action}
          <ToastClose className="absolute right-2 top-2 rounded-md p-1 text-gray-400 opacity-70 transition-opacity hover:text-gray-900 hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2 group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600" />
        </Toast>
      ))}
      <ToastViewport className="fixed top-0 right-0 z-[9999] w-full max-w-xs p-4 sm:bottom-0 sm:top-auto" />
    </ToastProvider>
  )
}
