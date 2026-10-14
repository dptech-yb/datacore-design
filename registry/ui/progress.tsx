import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cn } from "@/lib/utils";

export function Progress({ value, className, tone = "primary" }: { value: number; className?: string; tone?: "primary" | "success" | "warning" }) {
  const bar = tone === "success" ? "bg-success" : tone === "warning" ? "bg-warning" : "bg-primary";
  return (
    <ProgressPrimitive.Root value={value} className={cn("relative h-1.5 w-full overflow-hidden rounded-full bg-secondary", className)}>
      <ProgressPrimitive.Indicator className={cn("h-full transition-all duration-base ease-standard", bar)} style={{ width: `${value}%` }} />
    </ProgressPrimitive.Root>
  );
}
