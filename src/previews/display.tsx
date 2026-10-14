import {
  AlertTriangle,
  Check,
  CheckCircle2,
  Database,
  Download,
  FileText,
  FolderOpen,
  Info,
  Loader2,
  Lock,
  Sparkles,
  Trash2,
  X,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CodeBlock } from "@/components/ui/code-block";
import { Descriptions, DescriptionsItem } from "@/components/ui/descriptions";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FileList, FileListItem } from "@/components/ui/file-list";
import { Input } from "@/components/ui/input";
import { JsonViewer } from "@/components/ui/json-viewer";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Progress } from "@/components/ui/progress";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/sonner";
import { LoadingOverlay, Spinner } from "@/components/ui/spinner";
import { Statistic } from "@/components/ui/statistic";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Timeline, TimelineItem } from "@/components/ui/timeline";
import { Tree, type TreeNode } from "@/components/ui/tree";
import { cn } from "@/lib/utils";
import type { PreviewFn } from "./types";

/* ---------- Table ---------- */

/** 数字列：右对齐 + 等宽数字。 */
const num = "text-right tabular-nums";

function RunName({ name, id }: { name: string; id: string }) {
  return (
    <div className="flex flex-col">
      <span className="font-medium">{name}</span>
      <span className="font-mono text-xs text-muted-foreground">{id}</span>
    </div>
  );
}

function TableBasic() {
  return (
    <div className="rounded-lg border bg-card">
      <Table className="border-collapse">
        <caption className="caption-top px-3 py-2 text-left text-xs text-muted-foreground">示例项目（project-042）· 最近计算任务</caption>
        <TableHeader>
          <TableRow>
            <TableHead scope="col">任务</TableHead>
            <TableHead scope="col">数据集</TableHead>
            <TableHead scope="col" className="text-right">耗时（秒）</TableHead>
            <TableHead scope="col">状态</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell><RunName name="电导率计算" id="run-28003" /></TableCell>
            <TableCell className="font-mono">ds-118</TableCell>
            <TableCell className={num}>286.4</TableCell>
            <TableCell><Badge tone="success" dot>已完成</Badge></TableCell>
          </TableRow>
          <TableRow>
            <TableCell><RunName name="结构优化" id="run-28002" /></TableCell>
            <TableCell className="font-mono">ds-121</TableCell>
            <TableCell className={num}>412.7</TableCell>
            <TableCell><Badge tone="danger" dot>失败</Badge></TableCell>
          </TableRow>
          <TableRow>
            <TableCell><RunName name="电导率计算" id="run-28001" /></TableCell>
            <TableCell className="font-mono">ds-118</TableCell>
            <TableCell className={num}>291.0</TableCell>
            <TableCell><Badge tone="success" dot>已完成</Badge></TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}

function TableScroll() {
  const sticky = "sticky left-0 z-[1] bg-card";
  return (
    <div className="demo-stack">
      <div className="rounded-lg border bg-card">
        <Table className="min-w-[880px] border-collapse">
          <caption className="caption-top px-3 py-2 text-left text-xs text-muted-foreground">
            数据集 ds-118 · 全部字段（表格最小宽度 880px，窄屏横向滚动）
          </caption>
          <TableHeader>
            <TableRow>
              <TableHead scope="col" className="sticky left-0 z-[1] bg-muted">任务</TableHead>
              <TableHead scope="col">数据集</TableHead>
              <TableHead scope="col">方法</TableHead>
              <TableHead scope="col" className="text-right">截断能（eV）</TableHead>
              <TableHead scope="col" className="text-right">耗时（秒）</TableHead>
              <TableHead scope="col" className="text-right">费用（元）</TableHead>
              <TableHead scope="col">状态</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className={sticky}><RunName name="电导率计算" id="run-28003" /></TableCell>
              <TableCell className="font-mono">ds-118</TableCell>
              <TableCell>PBE0</TableCell>
              <TableCell className={num}>520</TableCell>
              <TableCell className={num}>286.4</TableCell>
              <TableCell className={num}>12.40</TableCell>
              <TableCell><Badge tone="success" dot>已完成</Badge></TableCell>
            </TableRow>
            <TableRow>
              <TableCell className={sticky}><RunName name="结构优化" id="run-28002" /></TableCell>
              <TableCell className="font-mono">ds-121</TableCell>
              <TableCell>PBE</TableCell>
              <TableCell className={num}>450</TableCell>
              <TableCell className={num}>412.7</TableCell>
              <TableCell className={num}>17.90</TableCell>
              <TableCell><Badge tone="danger" dot>失败</Badge></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
      <p className="demo-note">横向滚动时首列冻结（sticky left-0），列宽不压缩、文字不换行。</p>
    </div>
  );
}

function StatesTable({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="rounded-lg border bg-card">
      <Table className="border-collapse">
        <caption className="caption-top px-3 py-2 text-left text-xs text-muted-foreground">{label}</caption>
        <TableHeader>
          <TableRow>
            <TableHead scope="col">任务</TableHead>
            <TableHead scope="col">数据集</TableHead>
            <TableHead scope="col" className="text-right">耗时（秒）</TableHead>
            <TableHead scope="col">状态</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>{children}</TableBody>
      </Table>
    </div>
  );
}

function TableStates() {
  return (
    <div className="demo-stack">
      <StatesTable label="loading：骨架行替换数据行，表头保留">
        {["w-32", "w-24", "w-28"].map((w) => (
          <TableRow key={w} className="hover:bg-transparent">
            <TableCell><Skeleton className={cn("h-3.5", w)} /></TableCell>
            <TableCell><Skeleton className="h-3.5 w-14" /></TableCell>
            <TableCell><Skeleton className="ml-auto h-3.5 w-12" /></TableCell>
            <TableCell><Skeleton className="h-3.5 w-14" /></TableCell>
          </TableRow>
        ))}
      </StatesTable>
      <StatesTable label="empty：说明是无数据还是被筛选清空，并给出下一步">
        <TableRow className="hover:bg-transparent">
          <TableCell colSpan={4} className="h-24 text-center">
            <div className="flex flex-col items-center gap-1">
              <span className="font-medium">当前筛选条件下没有任务</span>
              <Button variant="link" size="sm" className="h-auto px-0">清除筛选</Button>
            </div>
          </TableCell>
        </TableRow>
      </StatesTable>
      <StatesTable label="error：保留筛选上下文，提供重试">
        <TableRow className="hover:bg-transparent">
          <TableCell colSpan={4} className="h-24">
            <div className="flex items-center justify-center gap-2 text-danger">
              <XCircle className="size-4" />
              <span className="font-medium">任务列表加载失败</span>
              <Button variant="secondary" size="sm" className="ml-2">重试</Button>
            </div>
          </TableCell>
        </TableRow>
      </StatesTable>
    </div>
  );
}

const businessRuns = [
  { id: "run-28003", name: "电导率计算", dataset: "ds-118", seconds: "286.4", cost: "12.40", status: "已完成", tone: "success", action: "查看日志" },
  { id: "run-28002", name: "结构优化", dataset: "ds-121", seconds: "412.7", cost: "17.90", status: "失败", tone: "danger", action: "查看日志" },
  { id: "run-27998", name: "能带计算", dataset: "ds-118", seconds: "1,024.5", cost: "43.20", status: "排队中", tone: "neutral", action: "取消排队" },
] as const;

function TableBusiness() {
  return (
    <div className="rounded-lg border bg-card">
      <Table className="border-collapse">
        <caption className="caption-top px-3 py-2 text-left text-xs text-muted-foreground">示例项目（project-042）· 计算任务列表</caption>
        <TableHeader>
          <TableRow>
            <TableHead scope="col">任务</TableHead>
            <TableHead scope="col">数据集</TableHead>
            <TableHead scope="col" className="text-right">耗时（秒）</TableHead>
            <TableHead scope="col" className="text-right">费用（元）</TableHead>
            <TableHead scope="col">状态</TableHead>
            <TableHead scope="col">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {businessRuns.map((run) => (
            <TableRow key={run.id}>
              <TableCell><RunName name={run.name} id={run.id} /></TableCell>
              <TableCell className="font-mono">{run.dataset}</TableCell>
              <TableCell className={num}>{run.seconds}</TableCell>
              <TableCell className={num}>{run.cost}</TableCell>
              <TableCell><Badge tone={run.tone} dot>{run.status}</Badge></TableCell>
              <TableCell><Button variant="ghost" size="sm">{run.action}</Button></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

/* ---------- Descriptions ---------- */

function DescriptionsBasic() {
  return (
    <Descriptions title="任务详情" className="max-w-lg">
      <DescriptionsItem label="任务 ID" mono>run-28003</DescriptionsItem>
      <DescriptionsItem label="所属项目">示例项目（project-042）</DescriptionsItem>
      <DescriptionsItem label="状态">
        <Badge tone="success" dot>已完成</Badge>
      </DescriptionsItem>
      <DescriptionsItem label="耗时" mono>286.4 秒</DescriptionsItem>
    </Descriptions>
  );
}

function DescriptionsLayout() {
  return (
    <div className="demo-stack">
      <Descriptions title="数据集信息" columns={2} layout="vertical" bordered className="max-w-xl">
        <DescriptionsItem label="数据集 ID" mono>ds-118</DescriptionsItem>
        <DescriptionsItem label="版本">v3 · 2026-09-18 更新</DescriptionsItem>
        <DescriptionsItem label="数据量" mono>1,000 行 · 12 字段</DescriptionsItem>
        <DescriptionsItem label="创建方式">UniLab 导入</DescriptionsItem>
      </Descriptions>
      <Descriptions columns={2} bordered labelWidth={96} className="max-w-xl">
        <DescriptionsItem label="方法">PBE0</DescriptionsItem>
        <DescriptionsItem label="截断能" mono>520 eV</DescriptionsItem>
        <DescriptionsItem label="备注" span={2}>{null}</DescriptionsItem>
      </Descriptions>
      <p className="demo-note">上：layout=&quot;vertical&quot; + columns=&#123;2&#125; + bordered；下：horizontal + labelWidth=&#123;96&#125;，空值自动显示 —。</p>
    </div>
  );
}

function DescriptionsBusiness() {
  return (
    <Descriptions title="数据集 ds-118" columns={2} className="max-w-xl">
      <DescriptionsItem label="数据集 ID" mono copyable>ds-118</DescriptionsItem>
      <DescriptionsItem label="所属项目">示例项目（project-042）</DescriptionsItem>
      <DescriptionsItem label="版本">v3 · 2026-09-18 更新</DescriptionsItem>
      <DescriptionsItem label="数据量" mono>1,000 行 · 12 字段</DescriptionsItem>
      <DescriptionsItem label="质量状态" span={2}>
        <Badge tone="warning" dot>3 行缺少密度字段</Badge>
      </DescriptionsItem>
    </Descriptions>
  );
}

/* ---------- Statistic ---------- */

function StatisticBasic() {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <Statistic variant="card" label="本周计算任务" value={128} unit="个" />
      <Statistic variant="card" label="平均成功率" value={86.4} precision={1} suffix="%" />
      <Statistic variant="card" label="本周费用" value={1280.4} precision={2} prefix="¥" />
    </div>
  );
}

function StatisticTrend() {
  const [loading, setLoading] = useState(false);
  return (
    <div className="demo-stack">
      <div className="grid gap-3 sm:grid-cols-3">
        <Statistic
          variant="card"
          label="平均耗时"
          value={286.4}
          precision={1}
          unit="秒"
          goodDirection="down"
          trend={{ value: "-12.3%", direction: "down", label: "较上周" }}
          loading={loading}
        />
        <Statistic variant="card" label="失败任务" value={6} unit="个" goodDirection="down" trend={{ value: 2, label: "较上周" }} loading={loading} />
        <Statistic variant="card" label="成功率" value={86.4} precision={1} suffix="%" trend={{ value: 0, label: "较上周" }} loading={loading} />
      </div>
      <div className="demo-row">
        <Button
          variant="secondary"
          size="sm"
          disabled={loading}
          onClick={() => {
            setLoading(true);
            window.setTimeout(() => setLoading(false), 1200);
          }}
        >
          模拟刷新
        </Button>
        <span className="demo-note">耗时、失败数下降为好（goodDirection=&quot;down&quot;）；箭头 + 文字 + 对比口径，不只靠红绿。</span>
      </div>
    </div>
  );
}

function StatisticBusiness() {
  const open = (label: string) => toast(`跳转到任务列表 · 筛选：${label}`);
  const link =
    "block rounded-lg border bg-card px-4 py-3 no-underline transition-shadow duration-fast hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";
  return (
    <Card className="grid gap-3 p-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h4 className="m-0 text-base font-semibold">示例项目（project-042）· 近 7 天概览</h4>
        <span className="text-xs text-muted-foreground">统计周期 2026-09-15 – 2026-09-21</span>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <a href="#runs" className={link} onClick={(e) => { e.preventDefault(); open("全部"); }}>
          <Statistic label="计算任务" value={128} unit="个" trend={{ value: 14, label: "较前 7 天" }} />
        </a>
        <a href="#runs" className={link} onClick={(e) => { e.preventDefault(); open("已完成"); }}>
          <Statistic label="成功率" value={86.4} precision={1} suffix="%" trend={{ value: "+1.2%", direction: "up", label: "较前 7 天" }} />
        </a>
        <Statistic variant="card" label="费用" value={null} prefix="¥" />
      </div>
      <p className="demo-note">统计卡用 &lt;a&gt; 包裹即可点击跳转（携带筛选条件）；费用暂无数据显示 —，不用 0 冒充。</p>
    </Card>
  );
}

/* ---------- Timeline ---------- */

function TimelineBasic() {
  return (
    <Timeline className="max-w-md">
      <TimelineItem time="09:12" title="任务创建">run-28003 已提交到队列</TimelineItem>
      <TimelineItem time="09:14" title="开始执行">分配到计算节点 node-07</TimelineItem>
      <TimelineItem time="09:19" title="执行完成">耗时 286.4 秒</TimelineItem>
    </Timeline>
  );
}

function TimelineStatus() {
  return (
    <Timeline className="max-w-md">
      <TimelineItem time="09:12" title="任务创建" tone="success" />
      <TimelineItem time="09:13" title="参数校验失败" tone="danger" icon={<XCircle />}>
        K 点网格与截断能冲突 · <Button variant="link" size="sm">查看日志</Button>
      </TimelineItem>
      <TimelineItem time="09:14" title="Agent 建议调整 K 点网格" tone="agent" icon={<Sparkles />} />
      <TimelineItem time="09:15" title="修正参数并重新提交" tone="warning" />
      <TimelineItem time="09:16" title="重新校验中" pending />
    </Timeline>
  );
}

function TimelineBusiness() {
  return (
    <div className="demo-stack">
      <Timeline className="max-w-md">
        <TimelineItem time="09:12" dateTime="2026-09-21T09:12" title="任务创建" tone="primary">run-28003 · 示例项目（project-042）</TimelineItem>
        <TimelineItem time="09:14" dateTime="2026-09-21T09:14" title="开始执行" tone="primary">数据集 ds-118 · 方法 PBE0</TimelineItem>
        <TimelineItem time="09:19" dateTime="2026-09-21T09:19" title="计算完成" tone="success" icon={<CheckCircle2 />}>
          耗时 286.4 秒 · <Button variant="link" size="sm">查看日志</Button>
        </TimelineItem>
        <TimelineItem time="现在" title="结果回传中…" pending />
      </Timeline>
      <p className="demo-note">pending 节点表达“未完待续”（aria-live 播报），进行中的节点实时更新。</p>
    </div>
  );
}

/* ---------- Tree ---------- */

const projectTree: TreeNode[] = [
  {
    id: "project-042",
    label: "示例项目（project-042）",
    icon: <FolderOpen />,
    children: [
      {
        id: "ds-118",
        label: "数据集 ds-118",
        icon: <Database />,
        meta: "1,000 行",
        children: [
          { id: "ds-118/structure", label: "structure.cif", icon: <FileText />, meta: "48 KB" },
          { id: "ds-118/params", label: "params.json", icon: <FileText />, meta: "2 KB" },
        ],
      },
      { id: "ds-121", label: "数据集 ds-121", icon: <Database />, meta: "320 行" },
    ],
  },
];

function TreeBasic() {
  return (
    <div className="demo-stack max-w-sm">
      <Tree aria-label="项目目录" data={projectTree} defaultExpanded={["project-042"]} />
      <p className="demo-note">点击箭头展开 / 收起；聚焦后 ↑↓ 移动、→ 展开、← 收起、Enter 选中。</p>
    </div>
  );
}

function TreeSelectable() {
  const [checked, setChecked] = useState<string[]>(["ds-118/structure"]);
  return (
    <div className="demo-stack max-w-sm">
      <Tree
        aria-label="选择输入文件"
        checkable
        data={projectTree}
        defaultExpanded={["project-042", "ds-118"]}
        checked={checked}
        onCheckedChange={setChecked}
      />
      <p className="demo-note">
        已选 {checked.length} 项（{checked.join("、") || "无"}）· 部分子级选中时父级显示半选态，Space 勾选。
      </p>
    </div>
  );
}

function TreeBusiness() {
  const [selected, setSelected] = useState<string | null>("ds-118");
  const data: TreeNode[] = [
    {
      id: "project-042",
      label: "示例项目（project-042）",
      icon: <FolderOpen />,
      children: [
        { id: "ds-118", label: "数据集 ds-118", icon: <Database />, meta: "1,000 行" },
        { id: "ds-121", label: "数据集 ds-121", icon: <Database />, meta: "320 行" },
        { id: "ds-130", label: "数据集 ds-130", icon: <Lock />, meta: "无权限", disabled: true },
      ],
    },
  ];
  return (
    <div className="demo-stack max-w-sm">
      <Tree aria-label="项目目录" data={data} defaultExpanded={["project-042"]} selected={selected} onSelectedChange={(id) => setSelected(id)} />
      <p className="demo-note">当前选中：{selected} · 无权限节点显示锁图标与“无权限”，可聚焦但不可选中。</p>
    </div>
  );
}

/* ---------- Collapse ---------- */

function CollapseBasic() {
  return (
    <Accordion type="single" collapsible defaultValue="params" className="max-w-lg rounded-lg border bg-card px-4">
      <AccordionItem value="params" className="last:border-b-0">
        <AccordionTrigger className="py-3 text-base hover:no-underline">计算参数</AccordionTrigger>
        <AccordionContent className="text-muted-foreground">交换关联泛函 PBE0 · 截断能 520 eV · K 点 4×4×4</AccordionContent>
      </AccordionItem>
      <AccordionItem value="advanced" className="last:border-b-0">
        <AccordionTrigger className="py-3 text-base hover:no-underline">高级设置</AccordionTrigger>
        <AccordionContent className="text-muted-foreground">最大迭代步数 200 · 收敛阈值 1e-6</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

function CollapseBusiness() {
  return (
    <div className="demo-stack">
      <Accordion type="multiple" defaultValue={["input"]} className="max-w-lg rounded-lg border bg-card px-4">
        <AccordionItem value="input" className="last:border-b-0">
          <AccordionTrigger className="gap-3 py-3 text-base hover:no-underline">
            <span className="flex flex-1 items-center gap-2">
              输入文件（3）
              <Badge tone="success" className="ml-auto">已校验</Badge>
            </span>
          </AccordionTrigger>
          <AccordionContent className="font-mono text-muted-foreground">structure.cif · params.json · kpoints.conf</AccordionContent>
        </AccordionItem>
        <AccordionItem value="result" className="last:border-b-0">
          <AccordionTrigger className="gap-3 py-3 text-base hover:no-underline">
            <span className="flex flex-1 items-center gap-2">
              结果文件（2）
              <Badge tone="neutral" className="ml-auto">待生成</Badge>
            </span>
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground">任务 run-28003 完成后生成 output.json 与 report.pdf</AccordionContent>
        </AccordionItem>
      </Accordion>
      <p className="demo-note">type=&quot;multiple&quot; 可同时展开；状态 Badge 放在触发行内、箭头左侧，只做展示不放按钮。</p>
    </div>
  );
}

/* ---------- CodeBlock ---------- */

function CodeBlockBasic() {
  return (
    <CodeBlock
      className="max-w-2xl"
      language="bash"
      code="$ datacore runs submit --project project-042 --dataset ds-118"
      onCopy={() => toast.success("已复制命令")}
    />
  );
}

function CodeBlockHighlight() {
  const code = `{
  "projectId": "project-042",
  "datasetId": "ds-118",
  "method": "PBE0",
  "maxSeconds": 300
}`;
  return (
    <div className="demo-stack">
      <CodeBlock className="max-w-2xl" language="json" title="params.json · 第 4 行需复核" code={code} showLineNumbers highlightLines={[4]} />
      <p className="demo-note">超过 3 行显示行号；高亮行配合标题里的行号说明（“第 4 行”），不只靠颜色。</p>
    </div>
  );
}

function CodeBlockBusiness() {
  const code = `$ curl https://api.example.com/v1/runs/run-28003 \\
    -H "Authorization: Bearer ***" \\
    -H "Accept: application/json"
$ curl https://api.example.com/v1/runs/run-28003/logs?tail=200 \\
    -H "Authorization: Bearer ***"`;
  return (
    <div className="demo-stack">
      <CodeBlock
        className="max-w-md"
        language="bash"
        title="查询任务状态与日志"
        code={code}
        maxHeight={120}
        onCopy={() => toast.success("已复制命令（不含 $ 提示符）")}
      />
      <p className="demo-note">示例域名一律 example.com，凭证用 *** 占位；maxHeight 内部滚动，可切换自动换行。</p>
    </div>
  );
}

/* ---------- JsonViewer ---------- */

function JsonViewerBasic() {
  return (
    <JsonViewer
      className="max-w-xl"
      data={{ runId: "run-28003", status: "finished", seconds: 286.4, cached: false, note: null, params: { method: "PBE0", cutoff: 520 } }}
      defaultExpandDepth={1}
    />
  );
}

function JsonViewerBusiness() {
  return (
    <div className="demo-stack">
      <JsonViewer
        className="max-w-xl"
        data={{
          runId: "run-28003",
          project: { id: "project-042", name: "示例项目" },
          params: { method: "PBE0", cutoff: 520, kpoints: [4, 4, 4] },
          dataset: { id: "ds-118", version: 3 },
          credential: "demo-token-0000",
        }}
        defaultExpandDepth={2}
        copyPath
        copyValue
        maskKeys={["credential"]}
        maxHeight={320}
        onCopy={(text, kind) => toast.success(kind === "path" ? `已复制路径 ${text}` : "已复制值")}
      />
      <p className="demo-note">hover / 聚焦行显示“复制路径”“复制值”；maskKeys 中的字段值一律显示 ***，键名保留便于理解结构。</p>
    </div>
  );
}

/* ---------- FileList ---------- */

function FileActions({ name }: { name: string }) {
  return (
    <>
      <Button variant="ghost" size="icon" className="size-7 text-muted-foreground" aria-label={`下载 ${name}`}>
        <Download />
      </Button>
      <Button variant="ghost" size="icon" className="size-7 text-muted-foreground" aria-label={`删除 ${name}`}>
        <Trash2 />
      </Button>
    </>
  );
}

function FileListBasic() {
  return (
    <FileList className="max-w-lg">
      <FileListItem name="structure.cif" size="48 KB" actions={<FileActions name="structure.cif" />} />
      <FileListItem name="params.json" size="2 KB" actions={<FileActions name="params.json" />} />
    </FileList>
  );
}

function FileListStates() {
  const [percent, setPercent] = useState(12);
  const [failed, setFailed] = useState(true);
  useEffect(() => {
    const timer = window.setInterval(() => setPercent((v) => (v >= 92 ? 12 : v + 4)), 300);
    return () => window.clearInterval(timer);
  }, []);
  return (
    <FileList className="max-w-lg">
      <FileListItem name="raw-data.csv" size="1.2 MB" status="uploading" progress={percent} onCancel={() => toast("已取消上传 raw-data.csv")} />
      <FileListItem name="kpoints.conf" size="1 KB" status="success" actions={<FileActions name="kpoints.conf" />} />
      {failed ? (
        <FileListItem
          name="notes.pdf"
          size="860 KB"
          status="error"
          error="格式不支持（仅支持 .cif / .json / .csv）"
          onRetry={() => setFailed(false)}
          actions={
            <Button variant="ghost" size="icon" className="size-7 text-muted-foreground" aria-label="移除 notes.pdf">
              <X />
            </Button>
          }
        />
      ) : (
        <FileListItem name="notes.pdf" size="860 KB" status="uploading" progress={30} />
      )}
    </FileList>
  );
}

function FileListBusiness() {
  const [expanded, setExpanded] = useState(false);
  const files = [
    { name: "structure.cif", size: "48 KB" },
    { name: "params.json", size: "2 KB" },
    { name: "raw-data.csv", size: "1.2 MB" },
    { name: "band-structure.png", size: "320 KB" },
    { name: "outputs.zip", size: "12.4 MB" },
  ];
  const visible = expanded ? files : files.slice(0, 3);
  return (
    <div className="demo-stack max-w-lg">
      <p className="demo-note">数据集 ds-118 · 附件（共 {files.length} 个）</p>
      <FileList>
        {visible.map((file) => (
          <FileListItem key={file.name} name={file.name} size={file.size} actions={<FileActions name={file.name} />} />
        ))}
      </FileList>
      <div>
        <Button variant="link" size="sm" onClick={() => setExpanded((v) => !v)}>
          {expanded ? "收起" : `查看全部（${files.length}）`}
        </Button>
      </div>
    </div>
  );
}

/* ---------- Alert ---------- */

function AlertBasic() {
  return (
    <div className="demo-stack">
      <Alert variant="info" role="status">
        <Info className="size-4" />
        <AlertTitle>计算任务将于今晚 22:00 排队执行</AlertTitle>
        <AlertDescription className="text-muted-foreground">示例项目（project-042）· 队列预计等待 20 分钟</AlertDescription>
      </Alert>
      <Alert variant="success" role="status">
        <CheckCircle2 className="size-4" />
        <AlertTitle>数据集 ds-118 校验通过</AlertTitle>
        <AlertDescription className="text-muted-foreground">1,000 行全部通过字段校验</AlertDescription>
      </Alert>
      <Alert variant="warning" role="status">
        <AlertTriangle className="size-4" />
        <AlertTitle>3 行缺少密度字段</AlertTitle>
        <AlertDescription className="text-muted-foreground">缺失行将以项目默认值填充，可在导入预览中逐行修改</AlertDescription>
      </Alert>
      <Alert variant="danger">
        <XCircle className="size-4" />
        <AlertTitle>任务 run-28002 执行失败</AlertTitle>
        <AlertDescription className="text-muted-foreground">K 点网格与截断能设置冲突，请检查参数后重试</AlertDescription>
      </Alert>
    </div>
  );
}

function AlertClosable() {
  const [visible, setVisible] = useState(true);
  if (!visible) {
    return (
      <Button variant="link" size="sm" onClick={() => setVisible(true)}>
        重新显示提示
      </Button>
    );
  }
  return (
    <Alert variant="warning" role="status" className="pr-12">
      <AlertTriangle className="size-4" />
      <AlertTitle>项目额度剩余 12%</AlertTitle>
      <AlertDescription className="flex flex-wrap items-center gap-x-3 gap-y-1 text-muted-foreground">
        示例项目（project-042）本周期额度即将用完
        <Button variant="link" size="sm">查看用量</Button>
      </AlertDescription>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-2 size-7 text-muted-foreground"
        aria-label="关闭提示"
        onClick={() => setVisible(false)}
      >
        <X />
      </Button>
    </Alert>
  );
}

function AlertBusiness() {
  return (
    <div className="demo-stack">
      <Alert variant="warning">
        <AlertTriangle className="size-4" />
        <AlertTitle>3 行缺少密度字段，无法直接提交</AlertTitle>
        <AlertDescription className="text-muted-foreground">
          第 128、512、907 行缺失。可逐行补全，或以项目默认值 2.50 g/cm³ 填充后继续。
          <div className="mt-2 flex flex-wrap gap-2">
            <Button variant="secondary" size="sm">查看缺失行</Button>
            <Button size="sm">以默认值填充</Button>
          </div>
        </AlertDescription>
      </Alert>
      <p className="demo-note">Alert 常驻页面直到问题解决；轻反馈用 Message，异步事件用 Notification。</p>
    </div>
  );
}

/* ---------- Message ---------- */

function MessageBasic() {
  return (
    <div className="demo-stack">
      <div className="demo-row">
        <Button onClick={() => toast.success("已保存到示例项目（project-042）")}>保存</Button>
        <Button variant="secondary" onClick={() => toast.error("保存失败：网络异常，请重试")}>
          演示失败
        </Button>
      </div>
      <p className="demo-note">顶部居中浮出，默认 3 秒自动消失；hover 暂停计时。</p>
    </div>
  );
}

function MessageTypes() {
  const showLoading = () => {
    const id = toast.loading("正在提交…");
    window.setTimeout(() => toast.success("提交成功", { id }), 1500);
  };
  return (
    <div className="demo-stack">
      <div className="demo-row">
        <Button variant="secondary" onClick={() => toast.success("已复制任务 ID run-28003")}>
          <CheckCircle2 className="text-success" />
          success
        </Button>
        <Button variant="secondary" onClick={() => toast.warning("项目额度剩余不足 20%")}>
          <AlertTriangle className="text-warning" />
          warning
        </Button>
        <Button variant="secondary" onClick={() => toast.error("提交失败：参数校验未通过")}>
          <XCircle className="text-danger" />
          error
        </Button>
        <Button variant="secondary" onClick={showLoading}>
          <Loader2 className="text-primary" />
          loading
        </Button>
      </div>
      <p className="demo-note">图标 + 文字同时表达；loading 用同一 id 更新为结果，不堆叠。</p>
    </div>
  );
}

function MessageBusiness() {
  const [saving, setSaving] = useState(false);
  const save = () => {
    setSaving(true);
    const id = toast.loading("正在保存到示例项目（project-042）…");
    window.setTimeout(() => {
      setSaving(false);
      toast.success("已保存 · 版本 v3", { id });
    }, 1200);
  };
  return (
    <div className="demo-stack">
      <div className="demo-row">
        <Button disabled={saving} onClick={save}>
          {saving && <Loader2 className="animate-spin" />}
          {saving ? "正在保存" : "保存数据集"}
        </Button>
      </div>
      <p className="demo-note">同一 id 从 loading 更新为成功，不堆叠两条 Message。</p>
    </div>
  );
}

/* ---------- Notification ---------- */

function NotificationBasic() {
  return (
    <div className="demo-row">
      <Button
        variant="secondary"
        onClick={() =>
          toast.success("计算任务已完成", {
            description: "run-28003 电导率计算已完成，耗时 286.4 秒。",
            position: "top-right",
            duration: 4500,
            action: { label: "查看结果", onClick: () => {} },
          })
        }
      >
        演示通知
      </Button>
      <span className="demo-note">右上角滑入，默认 4.5 秒消失</span>
    </div>
  );
}

function NoticeCard({
  tone,
  title,
  description,
  actions,
  onClose,
}: {
  tone: "success" | "danger";
  title: ReactNode;
  description: string;
  actions: string[];
  onClose?: () => void;
}) {
  const Icon = tone === "success" ? CheckCircle2 : XCircle;
  return (
    <Card role={tone === "danger" ? "alert" : "status"} className="flex w-80 max-w-full items-start gap-2.5 p-3.5 shadow-md">
      <Icon className={cn("mt-0.5 size-4 shrink-0", tone === "success" ? "text-success" : "text-danger")} />
      <div className="grid min-w-0 gap-1 text-base">
        <div className="flex items-center gap-1.5 font-semibold">{title}</div>
        <p className="m-0 text-muted-foreground">{description}</p>
        <div className="flex gap-3">
          {actions.map((label) => (
            <Button key={label} variant="link" size="sm" className="h-auto px-0">{label}</Button>
          ))}
        </div>
      </div>
      {onClose && (
        <Button variant="ghost" size="icon" className="-mr-1.5 -mt-1.5 ml-auto size-7 shrink-0 text-muted-foreground" aria-label="关闭通知" onClick={onClose}>
          <X />
        </Button>
      )}
    </Card>
  );
}

function NotificationBusiness() {
  const [failedVisible, setFailedVisible] = useState(true);
  return (
    <div className="demo-stack">
      <NoticeCard tone="success" title="计算任务已完成" description="run-28003 电导率计算已完成，耗时 286.4 秒。" actions={["查看结果"]} />
      {failedVisible ? (
        <NoticeCard
          tone="danger"
          title={
            <>
              计算任务执行失败 <Badge tone="danger">常驻</Badge>
            </>
          }
          description="run-28002 结构优化失败：K 点网格与截断能设置冲突。"
          actions={["查看日志", "重新提交"]}
          onClose={() => setFailedVisible(false)}
        />
      ) : (
        <div>
          <Button variant="link" size="sm" className="h-auto px-0" onClick={() => setFailedVisible(true)}>重新显示失败通知</Button>
        </div>
      )}
      <div className="demo-row">
        <Button
          variant="secondary"
          size="sm"
          onClick={() =>
            toast.error("计算任务执行失败", {
              description: "run-28002 结构优化失败：K 点网格与截断能设置冲突。",
              position: "top-right",
              duration: Infinity,
              closeButton: true,
              action: { label: "查看日志", onClick: () => {} },
            })
          }
        >
          弹出常驻失败通知
        </Button>
        <span className="demo-note">error 类型常驻直到用户处理；描述带稳定 ID，操作直达目标页面。</span>
      </div>
    </div>
  );
}

/* ---------- Progress ---------- */

function ProgressRow({ children }: { children: ReactNode }) {
  return <div className="flex items-center gap-2.5">{children}</div>;
}

function ProgressValue({ value }: { value: number }) {
  return <span className="w-10 shrink-0 text-right font-mono text-sm tabular-nums text-muted-foreground">{value}%</span>;
}

function ProgressBasic() {
  const [percent, setPercent] = useState(0);
  useEffect(() => {
    const timer = window.setInterval(() => {
      setPercent((value) => (value >= 62 ? 62 : value + 2));
    }, 60);
    return () => window.clearInterval(timer);
  }, []);
  return (
    <div className="demo-stack" style={{ maxWidth: 480 }}>
      <ProgressRow>
        <Progress value={percent} />
        <ProgressValue value={percent} />
      </ProgressRow>
      <ProgressRow>
        <Progress value={100} tone="success" />
        <span className="inline-flex shrink-0 items-center gap-1 text-sm text-success">
          <Check className="size-3.5" />
          已完成
        </span>
      </ProgressRow>
    </div>
  );
}

function ProgressStatus() {
  return (
    <div className="demo-stack" style={{ maxWidth: 480 }}>
      <ProgressRow>
        <Progress value={80} />
        <ProgressValue value={80} />
      </ProgressRow>
      <ProgressRow>
        {/* 失败态：Progress 无 danger tone，用语义令牌覆盖指示条颜色 */}
        <Progress value={45} className="[&>div]:bg-danger" />
        <span className="shrink-0 text-sm text-danger">导入中断</span>
      </ProgressRow>
      <p className="demo-note">error 停在失败点，邻近文案给出原因：第 450 行密度字段格式错误。</p>
    </div>
  );
}

function ProgressBusiness() {
  return (
    <div className="demo-stack" style={{ maxWidth: 520 }}>
      <ProgressRow>
        <Progress value={62} />
        <ProgressValue value={62} />
      </ProgressRow>
      <div className="flex flex-wrap items-center gap-2.5">
        <span className="demo-note">正在导入 ds-118 · 第 620/1,000 行 · 预计剩余 40 秒</span>
        <Button variant="ghost" size="sm" className="ml-auto">取消</Button>
      </div>
    </div>
  );
}

/* ---------- Spin ---------- */

function SpinBasic() {
  return (
    <div className="demo-row" style={{ gap: 20 }}>
      <Spinner size="sm" label="正在加载任务列表" />
      <Spinner label="正在加载任务列表" />
      <Spinner size="lg" label="正在加载任务详情…" showLabel />
      <Button disabled>
        <Loader2 className="animate-spin" />
        正在提交
      </Button>
    </div>
  );
}

function SpinContainer() {
  const [loading, setLoading] = useState(false);
  return (
    <div className="demo-stack">
      <LoadingOverlay loading={loading} label="正在重新计算…" className="max-w-md rounded-lg">
        <Card className="grid gap-1 p-4">
          <h4 className="m-0 text-base font-semibold">电导率结果</h4>
          <p className="m-0 text-sm text-muted-foreground">run-28003 · 4.21 S/cm · 数据集 ds-118</p>
          <div>
            <Button variant="link" size="sm">查看结果详情</Button>
          </div>
        </Card>
      </LoadingOverlay>
      <div className="demo-row">
        <Button
          variant="secondary"
          size="sm"
          disabled={loading}
          onClick={() => {
            setLoading(true);
            window.setTimeout(() => setLoading(false), 1500);
          }}
        >
          模拟容器加载
        </Button>
        <span className="demo-note">遮罩期间内部 inert（不可点击、不可聚焦），容器 aria-busy=true。</span>
      </div>
    </div>
  );
}

function SpinBusiness() {
  const [loading, setLoading] = useState(true);
  return (
    <div className="demo-stack" style={{ maxWidth: 560 }}>
      <div className="demo-row">
        <Button variant="secondary" size="sm">状态：全部</Button>
        <Button variant="secondary" size="sm">数据集：ds-118</Button>
        <Button variant="ghost" size="sm" onClick={() => setLoading((v) => !v)}>
          {loading ? "加载完成" : "重新加载"}
        </Button>
      </div>
      <LoadingOverlay loading={loading} delay={200} label="正在加载任务列表…" className="rounded-lg border bg-card">
        <Table className="border-collapse">
          <TableHeader>
            <TableRow>
              <TableHead scope="col">任务</TableHead>
              <TableHead scope="col">数据集</TableHead>
              <TableHead scope="col" className="text-right">耗时（秒）</TableHead>
              <TableHead scope="col">状态</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {businessRuns.map((run) => (
              <TableRow key={run.id}>
                <TableCell><RunName name={run.name} id={run.id} /></TableCell>
                <TableCell className="font-mono">{run.dataset}</TableCell>
                <TableCell className={num}>{run.seconds}</TableCell>
                <TableCell><Badge tone={run.tone} dot>{run.status}</Badge></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </LoadingOverlay>
      <p className="demo-note">遮罩只覆盖表格区域，筛选栏保持可用（delay 200ms 防闪烁）。</p>
    </div>
  );
}

/* ---------- Modal ---------- */

function ModalBasic() {
  const [open, setOpen] = useState(false);

  return (
    <div className="demo-row">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>打开对话框</Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>重命名数据集</DialogTitle>
            <DialogDescription>修改数据集 ds-118 的显示名称，数据集 ID 保持不变。</DialogDescription>
          </DialogHeader>
          <Input defaultValue="ds-118 电导率实验数据" aria-label="数据集名称" />
          <DialogFooter className="gap-2 sm:space-x-0">
            <DialogClose asChild>
              <Button variant="secondary">取消</Button>
            </DialogClose>
            <Button onClick={() => setOpen(false)}>保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <span className="demo-note">Esc 关闭 · 打开后焦点进入对话框 · 关闭后焦点还原</span>
    </div>
  );
}

function ModalBusiness() {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = () => {
    setSubmitting(true);
    window.setTimeout(() => {
      setSubmitting(false);
      setOpen(false);
    }, 1200);
  };

  return (
    <div className="demo-row">
      <Dialog open={open} onOpenChange={(next) => !submitting && setOpen(next)}>
        <DialogTrigger asChild>
          <Button>创建计算任务</Button>
        </DialogTrigger>
        <DialogContent
          className="max-w-md"
          onEscapeKeyDown={(event) => submitting && event.preventDefault()}
          onInteractOutside={(event) => submitting && event.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>创建计算任务</DialogTitle>
            <DialogDescription>
              将在 示例项目（project-042）下创建电导率计算任务：输入数据集 ds-118 · 方法 PBE0 · 预计最长 300 秒。
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-md bg-muted px-3 py-2 text-sm text-muted-foreground">
            确认后创建可追踪任务并记录审计日志；危险或不可逆动作请使用 ConfirmPanel。
          </div>
          <DialogFooter className="gap-2 sm:space-x-0">
            <DialogClose asChild>
              <Button variant="secondary" disabled={submitting}>取消</Button>
            </DialogClose>
            <Button disabled={submitting} onClick={handleSubmit}>
              {submitting && <Loader2 className="animate-spin" />}
              {submitting ? "正在创建" : "确认创建"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <span className="demo-note">提交中禁用 Esc、遮罩关闭与重复提交</span>
    </div>
  );
}

/* ---------- Drawer ---------- */

function DrawerBasic() {
  return (
    <div className="demo-row">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="secondary">查看任务详情</Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle className="text-md">任务详情 · run-28003</SheetTitle>
            <SheetDescription>示例项目（project-042）中的电导率计算任务</SheetDescription>
          </SheetHeader>
          <Descriptions className="mt-4">
            <DescriptionsItem label="任务 ID" mono copyable>run-28003</DescriptionsItem>
            <DescriptionsItem label="所属项目">示例项目（project-042）</DescriptionsItem>
            <DescriptionsItem label="状态">
              <Badge tone="success" dot>已完成</Badge>
            </DescriptionsItem>
            <DescriptionsItem label="耗时" mono>286.4 秒</DescriptionsItem>
          </Descriptions>
        </SheetContent>
      </Sheet>
      <span className="demo-note">Esc 与遮罩点击关闭 · 标题带对象 ID · 关闭后焦点回到触发按钮</span>
    </div>
  );
}

function DrawerBusiness() {
  const [open, setOpen] = useState(false);
  const [side, setSide] = useState<"right" | "bottom">("right");
  const show = (next: "right" | "bottom") => {
    setSide(next);
    setOpen(true);
  };
  return (
    <div className="demo-stack">
      <div className="demo-row">
        <Button onClick={() => show("right")}>从列表行打开详情抽屉</Button>
        <Button variant="secondary" onClick={() => show("bottom")}>底部抽屉（移动端）</Button>
        <span className="demo-note">关闭后列表滚动位置与选中行保持</span>
      </div>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side={side}
          className={cn("flex flex-col gap-0 p-0", side === "right" ? "w-full sm:max-w-lg" : "max-h-[85vh]")}
        >
          <SheetHeader className="border-b px-6 py-4 pr-12">
            <SheetTitle className="text-md">任务详情 · run-28003</SheetTitle>
            <SheetDescription>数据集 ds-118 · 方法 PBE0</SheetDescription>
          </SheetHeader>
          <div className="grid flex-1 content-start gap-4 overflow-y-auto px-6 py-4">
            <Descriptions columns={side === "bottom" ? 2 : 1}>
              <DescriptionsItem label="数据集" mono>ds-118</DescriptionsItem>
              <DescriptionsItem label="方法" mono>PBE0 · 截断能 520 eV</DescriptionsItem>
              <DescriptionsItem label="耗时" mono>286.4 秒</DescriptionsItem>
              <DescriptionsItem label="费用" mono>¥12.40</DescriptionsItem>
            </Descriptions>
            <CodeBlock
              language="log"
              title="日志摘要"
              showWrapToggle={false}
              code={"[09:14:02] 分配到计算节点 node-07\n[09:18:45] SCF 收敛，迭代 58 步\n[09:18:46] 结果写回 run-28003"}
            />
          </div>
          <SheetFooter className="gap-2 border-t px-6 py-3 sm:space-x-0">
            <SheetClose asChild>
              <Button variant="secondary">关闭</Button>
            </SheetClose>
            <Button>查看完整日志</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}

/* ---------- Popconfirm ---------- */

function ConfirmBubble({
  description,
  busy,
  danger,
  onCancel,
  onConfirm,
}: {
  description: string;
  busy: boolean;
  danger?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <>
      <div className="flex gap-2">
        <AlertTriangle className="mt-0.5 size-4 shrink-0 text-warning" />
        <div className="grid gap-1">
          <p className="m-0 text-base font-semibold">删除该文件？</p>
          <p className="m-0 text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      <div className="mt-3 flex justify-end gap-1.5">
        <Button variant="secondary" size="sm" onClick={onCancel}>取消</Button>
        <Button variant={danger ? "danger" : "default"} size="sm" disabled={busy} onClick={onConfirm}>
          {busy && <Loader2 className="animate-spin" />}
          {busy ? "删除中…" : "删除"}
        </Button>
      </div>
    </>
  );
}

function PopconfirmBasic() {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const confirm = () => {
    setBusy(true);
    window.setTimeout(() => {
      setBusy(false);
      setOpen(false);
      setDone(true);
      toast.success("已删除 structure.cif");
    }, 900);
  };
  return (
    <div className="demo-row" style={{ alignItems: "center" }}>
      <Popover
        open={open}
        onOpenChange={(next) => {
          if (busy) return;
          setOpen(next);
          if (next) setDone(false);
        }}
      >
        <PopoverTrigger asChild>
          <Button variant="danger" size="sm">删除</Button>
        </PopoverTrigger>
        <PopoverContent side="top" align="start" className="w-[268px] p-3" role="alertdialog" aria-label="删除确认">
          <ConfirmBubble
            description="structure.cif 将从数据集 ds-118 移除，任务产物不受影响。"
            busy={busy}
            onCancel={() => setOpen(false)}
            onConfirm={confirm}
          />
        </PopoverContent>
      </Popover>
      {done ? (
        <span className="demo-note">已删除 structure.cif（Message 反馈）</span>
      ) : (
        <span className="demo-note">点击外部或 Esc 取消，不产生副作用</span>
      )}
    </div>
  );
}

function PopconfirmBusiness() {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [removed, setRemoved] = useState(false);
  const confirm = () => {
    setBusy(true);
    window.setTimeout(() => {
      setBusy(false);
      setOpen(false);
      setRemoved(true);
      toast.success("已删除 raw-data.csv");
    }, 900);
  };
  return (
    <div className="demo-stack" style={{ maxWidth: 520 }}>
      <Card className="flex items-center gap-2.5 px-3 py-2 text-base">
        <FileText className={cn("size-4 shrink-0", removed ? "text-subtle" : "text-primary")} />
        <span className={cn("font-semibold", removed && "text-subtle line-through")}>raw-data.csv</span>
        <span className="font-mono text-sm text-subtle">1.2 MB</span>
        <span className="ml-auto">
          {removed ? (
            <span className="demo-note">已删除</span>
          ) : (
            <Popover open={open} onOpenChange={(next) => !busy && setOpen(next)}>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="text-danger">删除</Button>
              </PopoverTrigger>
              <PopoverContent side="top" align="end" className="w-[268px] p-3" role="alertdialog" aria-label="删除确认">
                <ConfirmBubble
                  danger
                  description="raw-data.csv 将从数据集 ds-118 移除，已完成的 2 个任务产物保留。"
                  busy={busy}
                  onCancel={() => setOpen(false)}
                  onConfirm={confirm}
                />
              </PopoverContent>
            </Popover>
          )}
        </span>
      </Card>
      <p className="demo-note">危险动作用 danger 主按钮；确认中主按钮 loading，禁止重复点击。</p>
    </div>
  );
}

export const displayPreviews: Record<string, PreviewFn> = {
  "table/basic": TableBasic,
  "table/scroll": TableScroll,
  "table/states": TableStates,
  "table/business": TableBusiness,
  "descriptions/basic": DescriptionsBasic,
  "descriptions/layout": DescriptionsLayout,
  "descriptions/business": DescriptionsBusiness,
  "statistic/basic": StatisticBasic,
  "statistic/trend": StatisticTrend,
  "statistic/business": StatisticBusiness,
  "timeline/basic": TimelineBasic,
  "timeline/status": TimelineStatus,
  "timeline/business": TimelineBusiness,
  "tree/basic": TreeBasic,
  "tree/selectable": TreeSelectable,
  "tree/business": TreeBusiness,
  "collapse/basic": CollapseBasic,
  "collapse/business": CollapseBusiness,
  "code-block/basic": CodeBlockBasic,
  "code-block/highlight": CodeBlockHighlight,
  "code-block/business": CodeBlockBusiness,
  "json-viewer/basic": JsonViewerBasic,
  "json-viewer/business": JsonViewerBusiness,
  "file-list/basic": FileListBasic,
  "file-list/states": FileListStates,
  "file-list/business": FileListBusiness,
  "alert/basic": AlertBasic,
  "alert/closable": AlertClosable,
  "alert/business": AlertBusiness,
  "message/basic": MessageBasic,
  "message/types": MessageTypes,
  "message/business": MessageBusiness,
  "notification/basic": NotificationBasic,
  "notification/business": NotificationBusiness,
  "progress/basic": ProgressBasic,
  "progress/status": ProgressStatus,
  "progress/business": ProgressBusiness,
  "spin/basic": SpinBasic,
  "spin/container": SpinContainer,
  "spin/business": SpinBusiness,
  "modal/basic": ModalBasic,
  "modal/business": ModalBusiness,
  "drawer/basic": DrawerBasic,
  "drawer/business": DrawerBusiness,
  "popconfirm/basic": PopconfirmBasic,
  "popconfirm/business": PopconfirmBusiness,
};
