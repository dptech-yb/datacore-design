import * as React from "react";
import { cn } from "@/lib/utils";

export function Table({ className, ...p }: React.TableHTMLAttributes<HTMLTableElement>) {
  return (
    <div className="relative w-full overflow-x-auto">
      <table className={cn("w-full caption-bottom border-collapse text-base", className)} {...p} />
    </div>
  );
}
export const TableHeader = (p: React.HTMLAttributes<HTMLTableSectionElement>) => <thead {...p} className={cn("[&_tr]:border-b", p.className)} />;
export const TableBody = (p: React.HTMLAttributes<HTMLTableSectionElement>) => <tbody {...p} className={cn("[&_tr:last-child]:border-0", p.className)} />;
export const TableRow = (p: React.HTMLAttributes<HTMLTableRowElement>) => <tr {...p} className={cn("border-b transition-colors hover:bg-muted/60 data-[state=selected]:bg-primary-soft", p.className)} />;
export const TableHead = (p: React.ThHTMLAttributes<HTMLTableCellElement>) => <th {...p} className={cn("h-9 px-3 text-left align-middle text-xs font-medium text-muted-foreground whitespace-nowrap bg-muted/50", p.className)} />;
export const TableCell = (p: React.TdHTMLAttributes<HTMLTableCellElement>) => <td {...p} className={cn("h-11 px-3 align-middle", p.className)} />;
