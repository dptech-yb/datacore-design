// 源自 shadcn/ui（MIT，shadcn@2.3.0 new-york），已套 DataCore 令牌。改动：占位色用 accent 灰（原版 bg-primary/10 在我们主题里会带蓝色）。
import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-accent", className)}
      {...props}
    />
  )
}

export { Skeleton }
