"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils"

const Slider = React.forwardRef<
    React.ElementRef<typeof SliderPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
    <SliderPrimitive.Root
        ref={ref}
        className={cn(
            "relative flex w-full touch-none select-none items-center",
            className
        )}
        {...props}
    >
      <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-background border border-border/40">
        <SliderPrimitive.Range className="absolute h-full bg-primary/80 hover:bg-primary transition-colors" />
      </SliderPrimitive.Track>
      {props.value?.map((_, i) => (
          <SliderPrimitive.Thumb
              key={i}
              className="block h-5 w-5 rounded-full border border-border bg-background shadow-sm
                  ring-offset-background transition-all
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
                  focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50
                  hover:border-primary hover:scale-105 active:scale-95"
          />
      ))}
    </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }