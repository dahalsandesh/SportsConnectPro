import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const alertVariants = cva(
  "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground dark:border-border dark:border-opacity-50",
        destructive:
          "border-destructive text-destructive dark:border-destructive dark:border-opacity-30 dark:bg-destructive dark:bg-opacity-10 dark:text-destructive-foreground [&>svg]:text-destructive",
        success:
          "border-success text-success dark:border-success dark:border-opacity-30 dark:bg-success dark:bg-opacity-10 dark:text-success-foreground [&>svg]:text-success",
        warning:
          "border-warning text-warning dark:border-warning dark:border-opacity-30 dark:bg-warning dark:bg-opacity-10 dark:text-warning-foreground [&>svg]:text-warning",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

const EnhancedAlert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div ref={ref} role="alert" className={cn(alertVariants({ variant }), className)} {...props} />
))
EnhancedAlert.displayName = "EnhancedAlert"

const EnhancedAlertTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h5 ref={ref} className={cn("mb-1 font-medium leading-none tracking-tight", className)} {...props} />
  ),
)
EnhancedAlertTitle.displayName = "EnhancedAlertTitle"

const EnhancedAlertDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("text-sm [&_p]:leading-relaxed", className)} {...props} />
  ),
)
EnhancedAlertDescription.displayName = "EnhancedAlertDescription"

export { EnhancedAlert, EnhancedAlertTitle, EnhancedAlertDescription }
