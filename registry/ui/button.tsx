import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-md font-medium transition-colors duration-fast ease-standard disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-xs hover:bg-primary-hover",
        secondary: "border border-input bg-background text-foreground shadow-xs hover:bg-accent",
        ghost: "text-foreground hover:bg-accent",
        soft: "bg-primary-soft text-primary hover:bg-primary-soft/70",
        danger: "bg-danger text-danger-foreground shadow-xs hover:bg-danger/90",
        link: "h-auto px-0 text-primary underline-offset-4 hover:underline",
      },
      size: { sm: "h-7 px-2.5 text-sm", default: "h-8 px-3 text-base", lg: "h-10 px-4 text-md", icon: "size-8" },
    },
    // link 在任何尺寸下都不要高度和左右内边距（compound 排在 size 之后，合并时胜出）
    compoundVariants: [{ variant: "link", className: "h-auto px-0" }],
    defaultVariants: { variant: "default", size: "default" },
  },
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, asChild, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";
  return <Comp ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />;
});
Button.displayName = "Button";
