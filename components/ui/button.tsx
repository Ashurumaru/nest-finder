import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            variant: {
                default:
                    "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 focus:ring-blue-500",
                destructive:
                    "bg-red-600 text-white hover:bg-red-700 active:bg-red-800 focus:ring-red-500",
                outline:
                    "bg-white text-gray-900 border border-gray-300 hover:bg-gray-50 active:bg-gray-100 focus:ring-gray-300",
                secondary:
                    "bg-blue-100 text-blue-700 hover:bg-blue-200 active:bg-blue-300 focus:ring-blue-300",
                primary:
                    "bg-blue-700 text-white hover:bg-blue-800 active:bg-blue-900 focus:ring-blue-600",
                success:
                    "bg-green-600 text-white hover:bg-green-700 active:bg-green-800 focus:ring-green-500",
                warning:
                    "bg-yellow-500 text-white hover:bg-yellow-600 active:bg-yellow-700 focus:ring-yellow-400",
                info:
                    "bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700 focus:ring-blue-400",
                ghost:
                    "hover:bg-accent hover:text-accent-foreground",
            },
            size: {
                default: "h-9 px-4 py-2",
                sm: "h-8 px-3 text-xs",
                lg: "h-10 px-8",
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
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, "aria-label": ariaLabel, ...props }, ref) => {
        const Comp = asChild ? Slot : "button";
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                aria-label={ariaLabel}
                {...props}
            />
        );
    }
);
Button.displayName = "Button";

export { Button, buttonVariants };
