import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const tagVariants = cva(
  "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-secondary text-secondary-foreground",
        success: "bg-success-100 text-success-700",
        warning: "bg-warning-100 text-warning-700", 
        error: "bg-error-100 text-error-700",
        neutral: "bg-grey-100 text-grey-700",
        information: "bg-information-100 text-information-700",
        "priority-high": "bg-error-100 text-error-700",
        "priority-medium": "bg-warning-100 text-warning-700",
        "priority-low": "bg-success-100 text-success-700"
      },
      size: {
        default: "px-2 py-1 text-xs",
        sm: "px-1.5 py-0.5 text-xs",
        lg: "px-3 py-1.5 text-sm"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface TagProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof tagVariants> {
  priority?: "high" | "medium" | "low"
}

function Tag({ className, variant, size, priority, ...props }: TagProps) {
  const tagVariant = priority ? `priority-${priority}` as any : variant
  
  return (
    <span className={cn(tagVariants({ variant: tagVariant, size }), className)} {...props} />
  )
}

export { Tag, tagVariants }