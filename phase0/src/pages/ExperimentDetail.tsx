import { Copy, Download, FileSpreadsheet, MoreHorizontal, Pencil, Play, Sparkles, Upload } from "lucide-react";
import { TopBar } from "@/components/shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/misc";
import { LineChartMini } from "@/components/charts";

const GROUPS = [
  { name: "E-01 · 1.0 M LiPF6 EC/EMC", color: "hsl(var(--chart-1))", pts: [100, 99.6, 99.2, 98.9, 98.5, 98.2, 97.8, 97.5, 97.1, 96.8, 96.5] },
  { name: "E-02 · 1.2 M LiFSI EC/DMC", color: "hsl(var(--chart-2))", pts: [100, 99.4, 98.6, 97.9, 97.0, 96.1, 95.0, 94.2, 93.1, 92.0, 91.2] },
  { name: "E-03 · E-01 + 2% FEC", color: "hsl(var(--chart-3))", pts: [100, 99.8, 99.6, 99.4, 99.2, 99.0, 98.8, 98.7, 98.5, 98.3, 98.2] },
];

const CELLS = [
  ["4-10-1", "E-01", "12.42", "183.6", "97.1", "完成", "success"],
  ["4-10-2", "E-01", "12.40", "182.9", "96.8", "完成", "success"],
  ["4-9-1", "E-02", "12.11", "185.0", "92.0", "完成", "success"],
  ["4-9-2", "E-02", "12.13", "181.4", "84.6", "异常", "danger"],
  ["4-8-1", "E-03", "12.57", "184.1", "98.3", "测试中", "primary"],
  ["4-8-2", "E-03", "12.55", "—", "—", "待上架", "neutral"],
] as const;

export default function ExperimentDetail() {
  return (
    <>
      <TopBar crumbs={["研发项目", "低温电解液", "循环改善 · 方案 A", "LiFSI 浓度梯度 · 循环对比"]} />
      <main className="mx-auto max-w-[1200px] px-4 py-5 md:px-6">
        <header className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-semibold tracking-tight">LiFSI 浓度梯度 · 循环对比</h1>
              <Badge tone="primary" dot>测试中</Badge>
              <span className="font-mono text-xs text-subtle">EXP-2026-0142</span>
            </div>
            <dl className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm">
              {[["负责人", "林示例"], ["工站", "新威 4 号柜"], ["电池体系", "NCM811 / 石墨 · 扣电"], ["开始", "10-08"], ["更新", "12 分钟前"]].map(([k, v]) => (
                <div key={k} className="flex gap-1.5"><dt className="text-muted-foreground">{k}</dt><dd className="font-medium">{v}</dd></div>
              ))}
            </dl>
          </div>
          <div className="flex flex-wrap items-center gap-2 lg:shrink-0">
            <Button variant="secondary" size="sm"><Upload />导入新威数据</Button>
            <Button variant="secondary" size="sm"><Sparkles className="text-agent" />让 Agent 分析</Button>
            <Button size="sm"><Play />生成汇总</Button>
            <Button variant="ghost" size="icon" aria-label="更多"><MoreHorizontal /></Button>
          </div>
        </header>

        <Tabs defaultValue="overview" className="mt-4">
          <TabsList>
            <TabsTrigger value="overview">概览</TabsTrigger>
            <TabsTrigger value="recipe">配方 <span className="text-xs text-subtle">3</span></TabsTrigger>
            <TabsTrigger value="cells">电池 <span className="text-xs text-subtle">6</span></TabsTrigger>
            <TabsTrigger value="data">测试数据</TabsTrigger>
            <TabsTrigger value="files">文件</TabsTrigger>
            <TabsTrigger value="log">记录</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="mt-5 grid gap-5 [&>*]:min-w-0 lg:grid-cols-[1fr_300px]">
            <div className="space-y-5">
              <Card>
                <CardHeader>
                  <div><CardTitle>容量保持率</CardTitle><CardDescription>按电解液分组 · 每组 2 颗取平均 · 0.5C / 25 ℃</CardDescription></div>
                  <Button variant="ghost" size="sm"><Download />导出</Button>
                </CardHeader>
                <CardContent>
                  <LineChartMini series={GROUPS.map((g) => ({ name: g.name, color: g.color, points: g.pts }))} height={200} yLabel="容量保持率 %" xLabel="循环圈数" />
                  <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1">
                    <span className="text-sm text-subtle">横轴：循环圈数</span>
                    {GROUPS.map((g) => (
                      <span key={g.name} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground"><span className="h-0.5 w-3 rounded-full" style={{ background: g.color }} />{g.name}</span>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2"><div><CardTitle>电池</CardTitle><CardDescription>6 颗 · 1 颗异常</CardDescription></div></CardHeader>
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="pl-4">通道</TableHead><TableHead>电解液</TableHead>
                      <TableHead className="text-right">活性物质 mg</TableHead><TableHead className="text-right">首圈放电 mAh/g</TableHead>
                      <TableHead className="text-right">50 圈保持 %</TableHead><TableHead className="pr-4">状态</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {CELLS.map(([ch, e, m, c, r, st, tone]) => (
                      <TableRow key={ch} className={tone === "danger" ? "bg-danger-soft/50 hover:bg-danger-soft" : ""}>
                        <TableCell className="pl-4 font-mono text-sm">{ch}</TableCell>
                        <TableCell>{e}</TableCell>
                        <TableCell className="text-right tabular">{m}</TableCell>
                        <TableCell className="text-right tabular">{c}</TableCell>
                        <TableCell className={`text-right tabular ${tone === "danger" ? "font-semibold text-danger" : ""}`}>{r}</TableCell>
                        <TableCell className="pr-4"><Badge tone={tone} dot>{st}</Badge></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </div>
            <aside className="space-y-5">
              <Card>
                <CardHeader className="pb-2"><CardTitle>配方</CardTitle><Button variant="ghost" size="icon" aria-label="编辑配方"><Pencil /></Button></CardHeader>
                <CardContent className="space-y-3">
                  {[["E-01", "1.0 M LiPF6", "EC : EMC = 3 : 7", [30, 70]], ["E-02", "1.2 M LiFSI", "EC : DMC = 1 : 1", [50, 50]], ["E-03", "E-01 + FEC 2 wt%", "EC : EMC = 3 : 7", [29, 69]]].map(([id, salt, sol, parts]) => (
                    <div key={id as string}>
                      <div className="flex items-baseline justify-between"><span className="text-sm font-medium">{id as string} · {salt as string}</span></div>
                      <div className="text-xs text-muted-foreground">{sol as string}{id === "E-03" ? " · 灰色为添加剂" : ""}</div>
                      <div className="mt-1.5 flex h-1.5 overflow-hidden rounded-full bg-secondary">
                        {(parts as number[]).map((p, i) => <span key={i} style={{ width: `${p}%`, background: `hsl(var(--blue-${i === 0 ? 600 : 300}))` }} />)}
                        {id === "E-03" && <span style={{ width: "2%", background: "hsl(var(--gray-500))" }} />}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2"><CardTitle>关联</CardTitle></CardHeader>
                <CardContent className="space-y-1 px-2">
                  {[[FileSpreadsheet, "新威导出 · 批次 A.zip", "12 通道 · 10-12"], [Sparkles, "Agent · 衰减异常分析", "已生成交互页"], [Copy, "来源：配方空间探索 第 2 轮", "3 个推荐配方"]].map(([I, t, m]) => {
                    const Icon = I as typeof FileSpreadsheet;
                    return (
                      <a key={t as string} className="flex items-center gap-2.5 rounded-md p-2 hover:bg-accent">
                        <Icon className="size-4 text-muted-foreground" />
                        <div className="min-w-0"><div className="truncate text-sm">{t as string}</div><div className="text-xs text-muted-foreground">{m as string}</div></div>
                      </a>
                    );
                  })}
                </CardContent>
              </Card>
              <Separator />
              <p className="px-1 text-xs leading-5 text-muted-foreground">所有数值为合成示例数据。</p>
            </aside>
          </TabsContent>
        </Tabs>
      </main>
    </>
  );
}
