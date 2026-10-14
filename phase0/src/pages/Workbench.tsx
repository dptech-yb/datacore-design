import { ArrowRight, ArrowUpRight, CalendarClock, CircleAlert, Clock, FlaskConical, Plus, Send, Sparkles } from "lucide-react";
import { TopBar } from "@/components/shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/misc";
import { Sparkline } from "@/components/charts";

const STATS = [
  { label: "待处理实验", value: 6, delta: "+2 本周", spark: [3, 4, 3, 5, 4, 6, 6] },
  { label: "待配制", value: 14, unit: "瓶", delta: "今日 5", spark: [8, 10, 9, 12, 11, 13, 14] },
  { label: "待组装", value: 32, unit: "颗", delta: "今日 12", spark: [20, 18, 22, 26, 24, 30, 32] },
  { label: "进行中项目", value: 3, delta: "持平", spark: [3, 3, 3, 3, 3, 3, 3] },
];

const TODO = [
  { name: "电导率配方探索 · 第 3 轮", project: "低温电解液 / 配方空间探索", bottles: 4, cells: 0, due: "今天", state: "配制中", tone: "primary" as const, progress: 50 },
  { name: "LiFSI 浓度梯度 · 循环对比", project: "低温电解液 / 循环改善", bottles: 0, cells: 8, due: "明天", state: "待组装", tone: "warning" as const, progress: 20 },
  { name: "高压 NCM 界面膜 · 第 1 批", project: "高压正极界面 / CEI 方案 A", bottles: 3, cells: 6, due: "10-17", state: "待配制", tone: "neutral" as const, progress: 0 },
  { name: "硫化物电解质 · 空气稳定性", project: "固态电解质筛选 / 方案 B", bottles: 0, cells: 0, due: "10-18", state: "待测试", tone: "agent" as const, progress: 80 },
];

const ATTENTION = [
  { icon: CircleAlert, tone: "text-danger", text: "通道 4-9-2 第 40 圈后容量骤降", meta: "LiFSI 浓度梯度 · 10 分钟前" },
  { icon: Clock, tone: "text-warning", text: "LiPF6（批号 L2409）库存低于阈值", meta: "试剂管理 · 1 小时前" },
  { icon: Sparkles, tone: "text-agent", text: "Agent 已生成第 2 轮推荐对比页", meta: "配方空间探索 · 昨天" },
];

export default function Workbench() {
  return (
    <>
      <TopBar crumbs={["工作台"]} actions={<Button size="sm" variant="secondary"><Plus />新建实验</Button>} />
      <main className="mx-auto max-w-[1200px] space-y-5 px-4 py-6 md:px-6">
        <section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm text-muted-foreground">10 月 14 日 · 周二</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight">早上好，林示例</h1>
          </div>
          <label className="flex h-10 w-full items-center gap-2 rounded-lg border bg-background pl-3 pr-1 shadow-xs focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/20 lg:w-[460px]">
            <Sparkles className="size-4 shrink-0 text-agent" />
            <input className="h-full flex-1 bg-transparent text-base outline-none placeholder:text-subtle" placeholder="让 Agent 帮你：对比最近一周的新威测试数据…" />
            <Button size="sm" aria-label="发送"><Send /></Button>
          </label>
        </section>

        <section className="grid grid-cols-2 overflow-hidden rounded-lg border bg-card lg:grid-cols-4">
          {STATS.map((s, i) => (
            <div key={s.label} className={`flex items-end justify-between gap-2 p-4 ${i > 0 ? "border-l" : ""} ${i === 2 ? "max-lg:border-l-0 max-lg:border-t" : ""} ${i === 3 ? "max-lg:border-t" : ""}`}>
              <div>
                <div className="text-sm text-muted-foreground">{s.label}</div>
                <div className="mt-1 flex items-baseline gap-1">
                  <span className="text-2xl font-semibold tabular">{s.value}</span>
                  {s.unit && <span className="text-sm text-muted-foreground">{s.unit}</span>}
                </div>
                <div className="mt-0.5 text-xs text-subtle">{s.delta}</div>
              </div>
              <Sparkline points={s.spark} />
            </div>
          ))}
        </section>

        <div className="grid items-start gap-5 [&>*]:min-w-0 lg:grid-cols-[1fr_340px]">
          <Card>
            <CardHeader>
              <div>
                <CardTitle>待处理实验</CardTitle>
                <CardDescription>你负责的优先，其次是所在项目中未完成的实验</CardDescription>
              </div>
              <Button size="sm" variant="ghost">全部<ArrowRight /></Button>
            </CardHeader>
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="pl-4">实验</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead className="hidden text-right sm:table-cell">待配 / 待装</TableHead>
                  <TableHead className="hidden w-28 sm:table-cell">进度</TableHead>
                  <TableHead className="pr-4 text-right">截止</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {TODO.map((t) => (
                  <TableRow key={t.name} className="cursor-pointer">
                    <TableCell className="pl-4">
                      <div className="flex items-center gap-2.5">
                        <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-secondary text-muted-foreground"><FlaskConical className="size-4" /></div>
                        <div className="min-w-0">
                          <div className="truncate font-medium">{t.name}</div>
                          <div className="truncate text-xs text-muted-foreground">{t.project}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell><Badge tone={t.tone} dot>{t.state}</Badge></TableCell>
                    <TableCell className="hidden text-right tabular text-muted-foreground sm:table-cell">{t.bottles || "—"} / {t.cells || "—"}</TableCell>
                    <TableCell className="hidden sm:table-cell"><Progress value={t.progress} /></TableCell>
                    <TableCell className={`whitespace-nowrap pr-4 text-right tabular ${t.due === "今天" ? "font-medium text-danger" : "text-muted-foreground"}`}>{t.due}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>

          <div className="space-y-5">
            <Card>
              <CardHeader className="pb-1"><CardTitle>需要关注</CardTitle><Badge tone="danger">3</Badge></CardHeader>
              <CardContent className="space-y-0.5 px-2 pb-2">
                {ATTENTION.map((a) => (
                  <a key={a.text} className="flex gap-2.5 rounded-md p-2 hover:bg-accent">
                    <a.icon className={`mt-0.5 size-4 shrink-0 ${a.tone}`} />
                    <div className="min-w-0">
                      <div className="text-base leading-5">{a.text}</div>
                      <div className="mt-0.5 text-xs text-muted-foreground">{a.meta}</div>
                    </div>
                  </a>
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-1"><CardTitle>今日工站</CardTitle><Button size="sm" variant="link">预约<ArrowUpRight /></Button></CardHeader>
              <CardContent className="space-y-2">
                {[["09:30–11:00", "手套箱 B · 扣电组装", "已确认"], ["14:00–16:30", "新威 4 号柜 · 循环测试上架", "待签到"]].map(([time, what, st]) => (
                  <div key={time} className="flex items-center gap-3 rounded-md border p-2.5">
                    <CalendarClock className="size-4 text-muted-foreground" />
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium tabular">{time}</div>
                      <div className="truncate text-xs text-muted-foreground">{what}</div>
                    </div>
                    <Badge tone={st === "已确认" ? "success" : "warning"}>{st}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </>
  );
}
