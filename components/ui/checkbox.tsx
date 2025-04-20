"use client"

import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { Check } from "lucide-react"

import { cn } from "@/lib/utils"

const Checkbox = React.forwardRef<
    React.ElementRef<typeof CheckboxPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
    <CheckboxPrimitive.Root
        ref={ref}
        className={cn(
            "peer h-5 w-5 shrink-0 rounded-md border-2 border-primary/20 ring-offset-background" +
            " data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground" +
            " focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2" +
            " disabled:cursor-not-allowed disabled:opacity-50" +
            " transition-all duration-200 ease-in-out hover:border-primary/50",
            className
        )}
        {...props}
    >
      <CheckboxPrimitive.Indicator
          className={cn("flex items-center justify-center text-current")}
      >
        <Check className="h-3.5 w-3.5 scale-0 transition-transform duration-200 data-[state=checked]:scale-100" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
))
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }