"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            variant: {
                default: "bg-zinc-900 text-zinc-50 hover:bg-zinc-800 focus:ring-zinc-400",
                destructive: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
                outline: "border border-zinc-200 bg-white hover:bg-zinc-100 focus:ring-zinc-400",
                secondary: "bg-zinc-100 text-zinc-900 hover:bg-zinc-200 focus:ring-zinc-400",
                ghost: "hover:bg-zinc-100 focus:ring-zinc-400",
                link: "text-zinc-900 underline-offset-4 hover:underline",
                primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
                danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
                warning: "bg-yellow-500 text-black hover:bg-yellow-600 focus:ring-yellow-500",
            },
            size: {
                default: "h-9 px-4 py-2",
                sm: "h-8 px-3 text-sm",
                lg: "h-10 px-6 text-base",
                icon: "h-9 w-9",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
    asChild?: boolean;
    "aria-label"?: string;
    isLoading?: boolean;
    icon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            className,
            variant,
            size,
            asChild = false,
            "aria-label": ariaLabel,
            isLoading = false,
            icon,
            children,
            disabled,
            ...props
        },
        ref
    ) => {
        const Comp = asChild ? Slot : "button";
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                aria-label={ariaLabel}
                disabled={disabled || isLoading}
                {...props}
            >
                {isLoading ? (
                    <span className="loader" />
                ) : (
                    <>
                        {icon && <span className="mr-2">{icon}</span>}
                        {children}
                    </>
                )}
            </Comp>
        );
    }
);
Button.displayName = "Button";

export { Button, buttonVariants };
