import { AlertTriangle, Check, CheckCircle2, FileArchive, FileSpreadsheet, Info, UploadCloud, X } from "lucide-react";
import { TopBar } from "@/components/shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/misc";
import { cn } from "@/lib/utils";

const STEPS = ["上传数据", "核对通道", "设置分组", "导出"];

const ROWS = [
  { ch: "4-10-1", cond: "0.5C 循环", ele: "E-01", mass: "12.42", ok: true },
  { ch: "4-10-2", cond: "0.5C 循环", ele: "E-01", mass: "12.40", ok: true },
  { ch: "4-9-1", cond: "0.5C 循环", ele: "E-02", mass: "12.11", ok: true },
  { ch: "4-9-2", cond: "0.5C 循环", ele: "E-02", mass: "", ok: false, msg: "缺少活性物质质量" },
  { ch: "4-8-1", cond: "0.5C 循环", ele: "E-03", mass: "12.57", ok: true },
  { ch: "4-8-3", cond: "0.5C 循环", ele: "", mass: "12.60", ok: false, msg: "数据中没有该通道" },
];

function Stepper({ current }: { current: number }) {
  return (
    <ol className="flex items-center gap-2" aria-label="步骤">
      {STEPS.map((s, i) => (
        <li key={s} className="flex items-center gap-2">
          <span className={cn("flex size-6 items-center justify-center rounded-full text-xs font-semibold", i < current ? "bg-primary text-primary-foreground" : i === current ? "border-2 border-primary text-primary" : "border border-input text-muted-foreground")}>
            {i < current ? <Check className="size-3.5" /> : i + 1}
          </span>
          <span className={cn("text-sm", i === current ? "font-medium text-foreground" : "text-muted-foreground")}>{s}</span>
          {i < STEPS.length - 1 && <span className={cn("mx-1 h-px w-8", i < current ? "bg-primary" : "bg-border")} />}
        </li>
      ))}
    </ol>
  );
}

export default function DataTool() {
  return (
    <>
      <TopBar crumbs={["数据工具", "充放电曲线绘制"]} actions={<Badge tone="outline">会话保留 7 天</Badge>} />
      <main className="mx-auto max-w-[1200px] px-4 pb-24 pt-5 md:px-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">充放电曲线绘制</h1>
            <p className="mt-1 max-w-2xl text-base text-muted-foreground">上传新威导出数据，按电解液自动分组，导出带克容量—电压对比图的汇总表。</p>
          </div>
          <Stepper current={1} />
        </div>

        <div className="mt-5 grid gap-5 [&>*]:min-w-0 lg:grid-cols-[1fr_300px]">
          <div className="space-y-5">
            <Card>
              <CardHeader className="pb-2"><div><CardTitle>已上传</CardTitle><CardDescription>可继续拖入文件追加</CardDescription></div></CardHeader>
              <CardContent className="space-y-2">
                {[[FileArchive, "示例批次_A.zip", "12 个通道 · 38.2 MB", 100], [FileSpreadsheet, "测试通道_示例.xlsx", "6 行", 100]].map(([I, n, m, p]) => {
                  const Icon = I as typeof FileArchive;
                  return (
                    <div key={n as string} className="flex items-center gap-3 rounded-md border p-2.5">
                      <div className="flex size-8 items-center justify-center rounded-md bg-primary-soft text-primary"><Icon className="size-4" /></div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 text-base font-medium">{n as string}<CheckCircle2 className="size-3.5 text-success" /></div>
                        <div className="text-xs text-muted-foreground">{m as string}</div>
                      </div>
                      <Progress value={p as number} tone="success" className="hidden w-24 sm:block" />
                      <Button variant="ghost" size="icon" aria-label="移除"><X /></Button>
                    </div>
                  );
                })}
                <div className="flex items-center justify-center gap-2 rounded-md border border-dashed py-4 text-sm text-muted-foreground">
                  <UploadCloud className="size-4" />拖入 xlsx / zip，或 <button className="font-medium text-primary hover:underline">选择文件</button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div><CardTitle>核对通道</CardTitle><CardDescription>测试通道表与数据文件按通道号对齐；有问题的行需处理后才能继续</CardDescription></div>
                <Badge tone="warning">2 项待处理</Badge>
              </CardHeader>
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="w-10 pl-4" /><TableHead>通道</TableHead><TableHead>测试条件</TableHead><TableHead>电解液</TableHead>
                    <TableHead className="w-36">活性物质 mg</TableHead><TableHead className="pr-4">说明</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ROWS.map((r) => (
                    <TableRow key={r.ch} className={r.ok ? "" : "bg-warning-soft/40 hover:bg-warning-soft/60"}>
                      <TableCell className="pl-4">{r.ok ? <CheckCircle2 className="size-4 text-success" /> : <AlertTriangle className="size-4 text-warning" />}</TableCell>
                      <TableCell className="font-mono text-sm">{r.ch}</TableCell>
                      <TableCell className="text-muted-foreground">{r.cond}</TableCell>
                      <TableCell>{r.ele || <span className="text-subtle">—</span>}</TableCell>
                      <TableCell>
                        <Input defaultValue={r.mass} placeholder="必填" aria-invalid={!r.mass} className={cn("h-7 tabular", !r.mass && "border-warning focus-visible:border-warning focus-visible:ring-warning/20")} />
                      </TableCell>
                      <TableCell className={cn("pr-4 text-sm", r.ok ? "text-subtle" : "text-warning")}>{r.msg ?? "已对齐"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </div>

          <aside className="space-y-5">
            <Card>
              <CardHeader className="pb-2"><CardTitle>导出设置</CardTitle></CardHeader>
              <CardContent className="space-y-3.5">
                <div className="space-y-1.5">
                  <Label htmlFor="g">分组依据</Label>
                  <Select defaultValue="ele">
                    <SelectTrigger id="g"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ele">电解液</SelectItem>
                      <SelectItem value="cond">测试条件</SelectItem>
                      <SelectItem value="none">不分组</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="c">对比圈数</Label>
                  <Input id="c" defaultValue="1, 10, 50" className="tabular" />
                </div>
                <div className="flex gap-2 rounded-md bg-muted p-2.5 text-xs leading-5 text-muted-foreground">
                  <Info className="mt-0.5 size-3.5 shrink-0" />质量为空的通道不会计算克容量；也可以在下一步统一填写。
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-1"><CardTitle>本次汇总</CardTitle></CardHeader>
              <CardContent>
                <dl className="space-y-2 text-sm">
                  {[["数据通道", "12"], ["已对齐", "4 / 6"], ["电解液分组", "3"], ["预计输出", "1 个 xlsx · 4 个 sheet"]].map(([k, v]) => (
                    <div key={k} className="flex justify-between"><dt className="text-muted-foreground">{k}</dt><dd className="font-medium tabular">{v}</dd></div>
                  ))}
                </dl>
              </CardContent>
            </Card>
          </aside>
        </div>
      </main>
      <footer className="fixed bottom-0 left-0 right-0 z-10 border-t bg-background/90 backdrop-blur md:left-[232px]">
        <div className="mx-auto flex h-14 max-w-[1200px] items-center gap-3 px-6">
          <span className="flex items-center gap-1.5 text-sm text-warning"><AlertTriangle className="size-4" />还有 2 个通道需要处理</span>
          <div className="ml-auto flex gap-2">
            <Button variant="secondary">上一步</Button>
            <Button disabled>下一步：设置分组</Button>
          </div>
        </div>
      </footer>
    </>
  );
}
