import { useMemo, useState, type MouseEvent, type ReactNode } from "react";
import { format as formatDate } from "date-fns";
import { Download, FilePlus2, Play, Plus, RotateCcw, Sparkles, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/sonner";
import { AgentActivity, type AgentStep } from "@/components/ui/agent-activity";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Citation, useCitationLocator } from "@/components/ui/citation";
import { CodeBlock } from "@/components/ui/code-block";
import { ConfirmPanel } from "@/components/ui/confirm-panel";
import { DataQualityNotice, hasBlockingIssues, type QualityIssue } from "@/components/ui/data-quality-notice";
import { DatePicker } from "@/components/ui/date-picker";
import { Descriptions, DescriptionsItem } from "@/components/ui/descriptions";
import { Empty } from "@/components/ui/empty";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NumberInput } from "@/components/ui/number-input";
import { PageHeader } from "@/components/ui/page-header";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Result } from "@/components/ui/result";
import { RunStatus, type RunStatusValue } from "@/components/ui/run-status";
import { SearchField } from "@/components/ui/search-field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SourceCard, type SourceInfo } from "@/components/ui/source-card";
import { Steps, type StepsProps } from "@/components/ui/steps";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SegmentedList, SegmentedTrigger, Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Timeline, TimelineItem } from "@/components/ui/timeline";
import { Upload, UploadFileList, type UploadFileItem } from "@/components/ui/upload";
import type { PreviewFn } from "./types";

/* ---------------- 共用外壳 ---------------- */

/** 模板缩略外壳：模拟页面内容区（不含全局导航），保证在文档栏与 390px 下都不撑破页面。 */
function PageFrame({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("grid min-w-0 grid-cols-[minmax(0,1fr)] gap-4 rounded-xl border bg-background p-4 text-foreground sm:p-5", className)}>{children}</div>;
}

function Note({ children }: { children: ReactNode }) {
  return <p className="m-0 mt-3 text-sm text-muted-foreground">{children}</p>;
}

/** 文档站是 hash 路由，示例内的 href="#" 必须拦截，避免跳走。 */
const stay = (event: MouseEvent) => event.preventDefault();

function ProjectBreadcrumb({ current }: { current: string }) {
  return (
    <Breadcrumb>
      <BreadcrumbList className="m-0 list-none p-0">
        <BreadcrumbItem>
          <BreadcrumbLink className="no-underline" href="#" onClick={stay}>项目</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink className="no-underline" href="#" onClick={stay}>示例项目</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>{current}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}

const runStatusLabel: Record<RunStatusValue, string> = {
  queued: "排队中",
  running: "运行中",
  succeeded: "已成功",
  failed: "已失败",
  partial: "部分完成",
  "retry-needed": "需重试",
};

/** 步骤条在窄屏改为纵向，避免横向挤压到逐字换行。 */
function ResponsiveSteps(props: StepsProps) {
  return (
    <>
      <Steps {...props} className={cn("hidden sm:flex", props.className)} />
      <Steps {...props} orientation="vertical" size="sm" className={cn("sm:hidden", props.className)} />
    </>
  );
}

/* ---------------- 列表页 ---------------- */

interface RunRow {
  id: string;
  name: string;
  project: string;
  status: RunStatusValue;
  duration: number | null;
  updated: string;
}

const listRows: RunRow[] = [
  { id: "run-28005", name: "第 5 轮电导率复测", project: "project-042", status: "queued", duration: null, updated: "2026-09-20 10:02" },
  { id: "run-28003", name: "第 4 轮配方筛选", project: "project-042", status: "succeeded", duration: 147, updated: "2026-09-20 09:44" },
  { id: "run-28002", name: "溶剂比例扫描", project: "project-042", status: "running", duration: null, updated: "2026-09-20 09:42" },
  { id: "run-28001", name: "粘度批量预测", project: "project-043", status: "partial", duration: 212, updated: "2026-09-20 09:10" },
  { id: "run-27998", name: "第 3 轮电导率计算", project: "project-041", status: "failed", duration: 96, updated: "2026-09-20 08:17" },
  { id: "run-27995", name: "添加剂浓度扫描", project: "project-042", status: "succeeded", duration: 188, updated: "2026-09-19 18:40" },
  { id: "run-27990", name: "熔点回归校准", project: "project-043", status: "succeeded", duration: 75, updated: "2026-09-19 16:05" },
  { id: "run-27986", name: "第 2 轮配方筛选", project: "project-041", status: "failed", duration: 54, updated: "2026-09-19 11:22" },
];

const statusTone: Record<RunStatusValue, "neutral" | "primary" | "success" | "warning" | "danger"> = {
  queued: "neutral",
  running: "primary",
  succeeded: "success",
  failed: "danger",
  partial: "warning",
  "retry-needed": "warning",
};

const PAGE_SIZE = 4;

function ListPageStructure() {
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState("all");
  const [project, setProject] = useState("all");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = keyword.trim().toLowerCase();
    return listRows.filter(
      (row) =>
        (status === "all" || row.status === status) &&
        (project === "all" || row.project === project) &&
        (!q || row.id.includes(q) || row.name.toLowerCase().includes(q)),
    );
  }, [keyword, status, project]);
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pageCount);
  const visible = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);
  const filtering = keyword !== "" || status !== "all" || project !== "all";
  const resetFilters = () => {
    setKeyword("");
    setStatus("all");
    setProject("all");
    setPage(1);
  };

  return (
    <div>
      <PageFrame>
        <PageHeader
          breadcrumb={<ProjectBreadcrumb current="计算任务" />}
          title="计算任务"
          description="查看示例项目下的全部计算任务，失败任务可在详情页保留参数重试。"
          actions={
            <Button onClick={() => toast("已打开新建计算任务向导")}>
              <Plus aria-hidden />
              新建计算任务
            </Button>
          }
        />

        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
          <SearchField
            value={keyword}
            onValueChange={(value) => {
              setKeyword(value);
              setPage(1);
            }}
            placeholder="搜索任务 ID 或名称"
            wrapperClassName="sm:w-60"
          />
          <div className="grid grid-cols-2 gap-2 sm:flex">
            <Select
              value={status}
              onValueChange={(value) => {
                setStatus(value);
                setPage(1);
              }}
            >
              <SelectTrigger className="sm:w-32" aria-label="状态">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                {(["queued", "running", "succeeded", "partial", "failed"] as RunStatusValue[]).map((value) => (
                  <SelectItem key={value} value={value}>
                    {runStatusLabel[value]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={project}
              onValueChange={(value) => {
                setProject(value);
                setPage(1);
              }}
            >
              <SelectTrigger className="sm:w-36" aria-label="项目">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部项目</SelectItem>
                <SelectItem value="project-041">project-041</SelectItem>
                <SelectItem value="project-042">project-042</SelectItem>
                <SelectItem value="project-043">project-043</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {filtering && (
            <Button variant="ghost" size="sm" onClick={resetFilters} className="self-start sm:self-auto">
              <X aria-hidden />
              清除筛选
            </Button>
          )}
        </div>

        <div className="min-w-0 overflow-hidden rounded-lg border">
          {visible.length === 0 ? (
            <Empty
              size="compact"
              title="没有符合筛选条件的任务"
              description="当前项目下有任务，只是被筛选条件排除了。"
              actions={
                <Button variant="secondary" size="sm" onClick={resetFilters}>
                  清除筛选
                </Button>
              }
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>任务 ID</TableHead>
                  <TableHead>名称</TableHead>
                  <TableHead>项目</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead className="text-right">用时（秒）</TableHead>
                  <TableHead>更新时间</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visible.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="whitespace-nowrap font-mono text-sm">{row.id}</TableCell>
                    <TableCell className="whitespace-nowrap">{row.name}</TableCell>
                    <TableCell className="whitespace-nowrap font-mono text-sm text-muted-foreground">{row.project}</TableCell>
                    <TableCell>
                      <Badge tone={statusTone[row.status]} dot>
                        {runStatusLabel[row.status]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-mono tabular-nums">{row.duration ?? "—"}</TableCell>
                    <TableCell className="whitespace-nowrap font-mono text-sm text-muted-foreground">{row.updated}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        <div className="flex flex-col items-center gap-2 sm:flex-row sm:justify-between">
          <span className="text-sm text-muted-foreground">
            共 {filtered.length} 条 · 第 {current} / {pageCount} 页
          </span>
          <Pagination className="mx-0 w-auto">
            <PaginationContent className="m-0 list-none p-0">
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  aria-disabled={current === 1}
                  className={cn("no-underline", current === 1 && "pointer-events-none opacity-50")}
                  onClick={(event) => {
                    stay(event);
                    setPage(Math.max(1, current - 1));
                  }}
                />
              </PaginationItem>
              {Array.from({ length: pageCount }, (_, index) => index + 1).map((n) => (
                <PaginationItem key={n}>
                  <PaginationLink
                    href="#"
                    className="no-underline"
                    isActive={n === current}
                    onClick={(event) => {
                      stay(event);
                      setPage(n);
                    }}
                  >
                    {n}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  aria-disabled={current === pageCount}
                  className={cn("no-underline", current === pageCount && "pointer-events-none opacity-50")}
                  onClick={(event) => {
                    stay(event);
                    setPage(Math.min(pageCount, current + 1));
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </PageFrame>
      <Note>试一试：输入“run-279”或切换状态筛选，空结果会说明“被筛选排除”并给出清除入口；翻页保留筛选条件。</Note>
    </div>
  );
}

/* ---------------- 详情页 ---------------- */

const detailRuns: { id: string; round: string; status: RunStatusValue; detail?: string; updated: string }[] = [
  { id: "run-28005", round: "第 5 轮", status: "queued", detail: "队列位置 2/5", updated: "10:02" },
  { id: "run-28003", round: "第 4 轮", status: "succeeded", updated: "09:44" },
  { id: "run-27998", round: "第 3 轮", status: "failed", detail: "输入缺字段 conductivity", updated: "08:17" },
];

function DetailPageStructure() {
  const [archived, setArchived] = useState(false);
  const [launched, setLaunched] = useState(false);

  return (
    <div>
      <PageFrame>
        <PageHeader
          onBack={() => toast("返回项目列表")}
          backLabel="项目列表"
          title="示例项目 · 电解液电导率优化"
          status={
            archived ? (
              <Badge tone="neutral">已归档</Badge>
            ) : (
              <Badge tone="success" dot>
                进行中
              </Badge>
            )
          }
          description={<span className="font-mono text-sm">project-042 · 创建于 2026-08-30</span>}
          actions={
            archived ? (
              <Button variant="secondary" onClick={() => setArchived(false)}>
                <RotateCcw aria-hidden />
                撤销归档
              </Button>
            ) : (
              <>
                <Button
                  disabled={launched}
                  onClick={() => {
                    setLaunched(true);
                    toast.success("已创建任务 run-28006 · 排队中");
                  }}
                >
                  <Play aria-hidden />
                  {launched ? "第 5 轮已提交" : "启动第 5 轮计算"}
                </Button>
                <Button variant="secondary" onClick={() => toast("报告生成中，完成后通知你")}>
                  <Download aria-hidden />
                  导出报告
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="danger">归档</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>归档“示例项目 · 电解液电导率优化”？</AlertDialogTitle>
                      <AlertDialogDescription>
                        归档后项目整体只读：不能再启动计算或写入数据集，已排队的 run-28005 将被取消。可由项目管理员撤销归档。
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>取消</AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-danger text-danger-foreground hover:bg-danger/90"
                        onClick={() => setArchived(true)}
                      >
                        确认归档
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </>
            )
          }
        />

        {archived && (
          <Alert variant="warning">
            <AlertTitle>项目已归档，当前为只读</AlertTitle>
            <AlertDescription>计算与写入入口已关闭；属性与历史记录仍可查看和导出。</AlertDescription>
          </Alert>
        )}

        <Descriptions bordered columns={2} labelWidth={88}>
          <DescriptionsItem label="负责人">示例账号 zhangming</DescriptionsItem>
          <DescriptionsItem label="数据集" mono copyable="ds-118">
            ds-118 · v3
          </DescriptionsItem>
          <DescriptionsItem label="优化目标">电导率 ≥ 12 mS/cm</DescriptionsItem>
          <DescriptionsItem label="最近更新" mono>
            2026-09-20 14:02
          </DescriptionsItem>
          <DescriptionsItem label="预算上限">{""}</DescriptionsItem>
          <DescriptionsItem label="计算资源">CPU · 标准队列</DescriptionsItem>
        </Descriptions>

        <Tabs defaultValue="runs">
          <TabsList>
            <TabsTrigger value="runs">
              关联任务 <Badge tone="neutral">3</Badge>
            </TabsTrigger>
            <TabsTrigger value="activity">活动记录</TabsTrigger>
          </TabsList>
          <TabsContent value="runs" className="pt-3">
            <div className="min-w-0 overflow-hidden rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>任务</TableHead>
                    <TableHead>轮次</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead className="text-right">更新</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {detailRuns.map((run) => (
                    <TableRow key={run.id}>
                      <TableCell className="whitespace-nowrap font-mono text-sm">{run.id}</TableCell>
                      <TableCell className="whitespace-nowrap">{run.round}</TableCell>
                      <TableCell className="min-w-48">
                        <RunStatus
                          status={run.status}
                          detail={run.detail}
                          onRetry={archived ? undefined : () => toast.success(`已按原参数重试 ${run.id}`)}
                        />
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm text-muted-foreground">{run.updated}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          <TabsContent value="activity" className="pt-4">
            <Timeline>
              {archived && (
                <TimelineItem tone="warning" title="示例账号 zhangming 归档了项目" time="刚刚" />
              )}
              <TimelineItem tone="agent" title="Agent 生成第 5 轮推荐配方" time="2026-09-20 10:01">
                2 条建议待确认 · 引用 4 条来源
              </TimelineItem>
              <TimelineItem tone="success" title="run-28003 计算完成" time="2026-09-20 09:44">
                126/126 个样品 · 结果写入 ds-118 v3
              </TimelineItem>
              <TimelineItem tone="danger" title="run-27998 计算失败" time="2026-09-20 08:17">
                输入缺字段 conductivity，参数已保留
              </TimelineItem>
              <TimelineItem title="示例账号 zhangming 创建项目" time="2026-08-30 16:20" />
            </Timeline>
          </TabsContent>
        </Tabs>
      </PageFrame>
      <Note>首屏回答：这是什么、现在什么状态、能对它做什么。空属性显示“—”而不是留白；“归档”先二次确认，归档后整页只读。</Note>
    </div>
  );
}

/* ---------------- 表单向导 ---------------- */

const wizardSteps = [
  { title: "基本信息", description: "名称与项目" },
  { title: "参数配置", description: "时长与资源" },
  { title: "确认提交", description: "回显全部输入" },
];

const projectNames: Record<string, string> = {
  "project-042": "示例项目（project-042）",
  "project-043": "粘度预测（project-043）",
};

function FormWizardStructure() {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("第 5 轮电导率复测");
  const [project, setProject] = useState("project-042");
  const [startDate, setStartDate] = useState<Date | null>(new Date(2026, 8, 22));
  const [duration, setDuration] = useState<number | null>(300);
  const [samples, setSamples] = useState<number | null>(24);
  const [resource, setResource] = useState("cpu");
  const [touched, setTouched] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const nameError = name.trim() === "" ? "任务名称不能为空" : null;
  const durationError = duration === null ? "请填写预计时长" : null;
  const samplesError = samples === null ? "请填写样品数" : null;
  const stepValid = step === 0 ? !nameError : step === 1 ? !durationError && !samplesError : true;

  const goNext = () => {
    if (!stepValid) {
      setTouched(true);
      return;
    }
    setTouched(false);
    setStep((value) => Math.min(value + 1, 2));
  };
  const reset = () => {
    setStep(0);
    setName("第 5 轮电导率复测");
    setProject("project-042");
    setStartDate(new Date(2026, 8, 22));
    setDuration(300);
    setSamples(24);
    setResource("cpu");
    setTouched(false);
    setSubmitted(false);
  };

  const fieldError = (message: string | null, id: string) =>
    touched && message ? (
      <p id={id} className="m-0 text-xs text-danger">
        {message}
      </p>
    ) : null;

  return (
    <div>
      <PageFrame>
        <PageHeader title="新建计算任务" description="分三步完成；每步通过校验才能继续，最后一步只回显不编辑。" />
        <ResponsiveSteps
          items={wizardSteps}
          current={submitted ? 3 : step}
          onStepClick={submitted ? undefined : (index) => setStep(index)}
        />

        {submitted ? (
          <Result
            className="[&_h2]:!m-0 [&_h2]:!text-lg"
            status="success"
            title="任务 run-28006 已创建 · 排队中"
            description="可在任务详情追踪状态与日志，不需要停留在向导里猜结果。"
            actions={
              <>
                <Button onClick={() => toast("打开 run-28006 详情")}>查看任务详情</Button>
                <Button variant="secondary" onClick={reset}>
                  再建一个
                </Button>
              </>
            }
          />
        ) : (
          <div className="grid max-w-xl gap-4">
            {step === 0 && (
              <>
                <div className="grid gap-1.5">
                  <Label htmlFor="wiz-name">
                    任务名称 <span className="text-danger">*</span>
                  </Label>
                  <Input
                    id="wiz-name"
                    value={name}
                    aria-invalid={touched && !!nameError}
                    aria-describedby="wiz-name-msg"
                    className={cn(touched && nameError && "border-danger")}
                    onChange={(event) => setName(event.target.value)}
                  />
                  {fieldError(nameError, "wiz-name-msg") ?? (
                    <p id="wiz-name-msg" className="m-0 text-xs text-muted-foreground">
                      名称将展示在任务列表与审计记录中
                    </p>
                  )}
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="grid gap-1.5">
                    <Label htmlFor="wiz-project">关联项目</Label>
                    <Select value={project} onValueChange={setProject}>
                      <SelectTrigger id="wiz-project">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(projectNames).map(([id, label]) => (
                          <SelectItem key={id} value={id}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-1.5">
                    <Label htmlFor="wiz-date">计划开始日期</Label>
                    <DatePicker id="wiz-date" value={startDate} onValueChange={setStartDate} placeholder="不填则立即排队" />
                  </div>
                </div>
              </>
            )}
            {step === 1 && (
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-1.5">
                  <Label htmlFor="wiz-duration">
                    预计时长 <span className="text-danger">*</span>
                  </Label>
                  <NumberInput
                    id="wiz-duration"
                    value={duration}
                    onValueChange={setDuration}
                    min={10}
                    max={3600}
                    step={10}
                    precision={0}
                    unit="秒"
                    invalid={touched && !!durationError}
                    aria-describedby="wiz-duration-msg"
                  />
                  {fieldError(durationError, "wiz-duration-msg") ?? (
                    <p id="wiz-duration-msg" className="m-0 text-xs text-muted-foreground">
                      10–3600 秒，超出会自动收敛
                    </p>
                  )}
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="wiz-samples">
                    样品数 <span className="text-danger">*</span>
                  </Label>
                  <NumberInput
                    id="wiz-samples"
                    value={samples}
                    onValueChange={setSamples}
                    min={1}
                    max={500}
                    precision={0}
                    unit="个"
                    invalid={touched && !!samplesError}
                    aria-describedby="wiz-samples-msg"
                  />
                  {fieldError(samplesError, "wiz-samples-msg") ?? (
                    <p id="wiz-samples-msg" className="m-0 text-xs text-muted-foreground">
                      来自 ds-118 v3 的待测样品
                    </p>
                  )}
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="wiz-resource">计算资源</Label>
                  <Select value={resource} onValueChange={setResource}>
                    <SelectTrigger id="wiz-resource">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cpu">CPU · 标准队列</SelectItem>
                      <SelectItem value="gpu">GPU · 加速队列</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
            {step === 2 && (
              <>
                <Descriptions bordered columns={2} labelWidth={88}>
                  <DescriptionsItem label="任务名称" span={2}>
                    {name}
                  </DescriptionsItem>
                  <DescriptionsItem label="关联项目">{projectNames[project]}</DescriptionsItem>
                  <DescriptionsItem label="开始日期" mono>
                    {startDate ? formatDate(startDate, "yyyy-MM-dd") : ""}
                  </DescriptionsItem>
                  <DescriptionsItem label="预计时长" mono>
                    {duration} 秒
                  </DescriptionsItem>
                  <DescriptionsItem label="样品数" mono>
                    {samples} 个
                  </DescriptionsItem>
                  <DescriptionsItem label="计算资源">{resource === "cpu" ? "CPU · 标准队列" : "GPU · 加速队列"}</DescriptionsItem>
                </Descriptions>
                <Alert variant="info">
                  <AlertDescription>提交后立即创建 1 个计算任务并记录审计日志；如需修改，点击步骤条中已完成的步骤返回。</AlertDescription>
                </Alert>
              </>
            )}
          </div>
        )}

        {!submitted && (
          <div className="flex flex-wrap items-center gap-2 border-t pt-4">
            <Button variant="ghost" onClick={reset}>
              重置演示
            </Button>
            <div className="ml-auto flex gap-2">
              {step > 0 && (
                <Button
                  variant="secondary"
                  onClick={() => {
                    setStep((value) => Math.max(value - 1, 0));
                    setTouched(false);
                  }}
                >
                  上一步
                </Button>
              )}
              {step < 2 ? (
                <Button onClick={goNext}>下一步</Button>
              ) : (
                <Button
                  onClick={() => {
                    setSubmitted(true);
                    toast.success("任务 run-28006 已创建");
                  }}
                >
                  确认提交
                </Button>
              )}
            </div>
          </div>
        )}
      </PageFrame>
      <Note>试一试：清空任务名称再点“下一步”会就地报错；已完成的步骤可以点击返回，已填内容不丢。</Note>
    </div>
  );
}

/* ---------------- 任务工作台 ---------------- */

interface WorkbenchTask {
  id: string;
  name: string;
  status: RunStatusValue;
  project: string;
  updated: string;
  detail?: string;
  log: string;
}

const workbenchTasks: WorkbenchTask[] = [
  {
    id: "run-28003",
    name: "第 4 轮配方筛选",
    status: "succeeded",
    project: "project-042",
    updated: "09:44",
    log: "09:41:52 载入 ds-118 v3（126 行）\n09:42:10 第 1/4 批计算完成\n09:44:19 126/126 个样品计算完成\n09:44:21 结果已写入 ds-118 v3",
  },
  {
    id: "run-28002",
    name: "溶剂比例扫描",
    status: "running",
    project: "project-042",
    updated: "09:42",
    detail: "第 2/4 批",
    log: "09:40:03 载入 ds-118 v3（126 行）\n09:41:30 第 1/4 批计算完成\n09:42:05 第 2/4 批计算中…",
  },
  {
    id: "run-27998",
    name: "第 3 轮电导率计算",
    status: "failed",
    project: "project-041",
    updated: "08:17",
    detail: "输入缺字段 conductivity",
    log: "08:16:40 载入 ds-112 v2（96 行）\n08:17:02 校验输入字段\n08:17:03 错误：缺少必填字段 conductivity（行 12、31）\n08:17:03 任务终止，参数已保留",
  },
  {
    id: "run-27995",
    name: "添加剂浓度扫描",
    status: "queued",
    project: "project-042",
    updated: "08:02",
    detail: "队列位置 2/5",
    log: "08:02:11 已提交，等待 CPU 资源\n08:02:11 队列位置 2/5，预计等待 6 分钟",
  },
  {
    id: "run-27986",
    name: "第 2 轮配方筛选",
    status: "failed",
    project: "project-041",
    updated: "昨天",
    detail: "计算节点超时",
    log: "11:20:15 载入 ds-112 v1（64 行）\n11:22:40 错误：计算节点 120 秒无响应\n11:22:40 任务终止，参数已保留",
  },
];

const workbenchFilters: { value: string; label: string; match: (s: RunStatusValue) => boolean }[] = [
  { value: "all", label: "全部", match: () => true },
  { value: "running", label: "运行中", match: (s) => s === "running" },
  { value: "failed", label: "失败", match: (s) => s === "failed" },
  { value: "queued", label: "排队中", match: (s) => s === "queued" },
];

function TaskWorkbenchStructure() {
  const [filter, setFilter] = useState("all");
  const [selectedId, setSelectedId] = useState<string | null>("run-27998");
  const [checked, setChecked] = useState<string[]>([]);
  const [retried, setRetried] = useState<string[]>([]);

  const statusOf = (task: WorkbenchTask): RunStatusValue => (retried.includes(task.id) ? "queued" : task.status);
  const matcher = workbenchFilters.find((item) => item.value === filter) ?? workbenchFilters[0];
  const visible = workbenchTasks.filter((task) => matcher.match(statusOf(task)));
  const selected = workbenchTasks.find((task) => task.id === selectedId) ?? null;
  const allChecked = visible.length > 0 && visible.every((task) => checked.includes(task.id));

  const toggle = (id: string) => setChecked((list) => (list.includes(id) ? list.filter((item) => item !== id) : [...list, id]));
  const changeFilter = (value: string) => {
    setFilter(value);
    setChecked([]); // 批量操作只作用于当前可见任务
  };
  const retry = (ids: string[]) => setRetried((list) => [...new Set([...list, ...ids])]);
  const batchRetry = () => {
    const targets = workbenchTasks.filter((task) => checked.includes(task.id));
    const ok = targets.filter((task) => statusOf(task) === "failed").map((task) => task.id);
    const skipped = targets.length - ok.length;
    retry(ok);
    setChecked([]);
    toast(`批量重试：成功 ${ok.length} 项${skipped ? `，跳过 ${skipped} 项（非失败状态）` : ""}`);
  };

  return (
    <div>
      <PageFrame>
        <PageHeader title="任务工作台" description="按状态定位任务，单条追踪与批量处理在同一视图完成。" />

        <Tabs value={filter} onValueChange={changeFilter}>
          <div className="overflow-x-auto">
            <SegmentedList>
              {workbenchFilters.map((item) => (
                <SegmentedTrigger key={item.value} value={item.value} className="gap-1.5">
                  {item.label}
                  <span className="font-mono text-xs text-muted-foreground">
                    {workbenchTasks.filter((task) => item.match(statusOf(task))).length}
                  </span>
                </SegmentedTrigger>
              ))}
            </SegmentedList>
          </div>
        </Tabs>

        {checked.length > 0 && (
          <div
            role="region"
            aria-label="批量操作"
            className="flex flex-wrap items-center gap-2 rounded-lg border border-primary/25 bg-primary-soft px-3 py-2"
          >
            <span className="text-base font-medium">已选 {checked.length} 项</span>
            <span className="text-sm text-muted-foreground">逐条返回结果，失败项可单独重试</span>
            <div className="flex gap-2 sm:ml-auto">
              <Button size="sm" onClick={batchRetry}>
                <RotateCcw aria-hidden />
                批量重试
              </Button>
              <Button size="sm" variant="secondary" onClick={() => setChecked([])}>
                取消选择
              </Button>
            </div>
          </div>
        )}

        <div className="grid min-w-0 gap-3 md:grid-cols-[minmax(0,17rem)_minmax(0,1fr)] md:items-start">
          <div className="grid min-w-0 gap-1.5">
            <label className="flex items-center gap-2 px-2.5 text-xs text-muted-foreground">
              <Checkbox
                checked={allChecked}
                disabled={visible.length === 0}
                onCheckedChange={(value) => setChecked(value ? visible.map((task) => task.id) : [])}
                aria-label="全选当前可见任务"
              />
              全选当前 {visible.length} 项
            </label>
            {visible.length === 0 ? (
              <Empty size="compact" title="该状态下没有任务" description="切换到“全部”查看其他任务。" />
            ) : (
              <ul className="m-0 grid list-none gap-1.5 p-0" aria-label="任务列表">
                {visible.map((task) => {
                  const active = task.id === selectedId;
                  const status = statusOf(task);
                  return (
                    <li
                      key={task.id}
                      className={cn(
                        "flex min-w-0 items-center gap-2 rounded-lg border bg-card px-2.5 py-2 transition-colors",
                        active ? "border-primary bg-primary-soft" : "hover:bg-accent",
                      )}
                    >
                      <Checkbox
                        checked={checked.includes(task.id)}
                        onCheckedChange={() => toggle(task.id)}
                        aria-label={`选择 ${task.id}`}
                      />
                      <button
                        type="button"
                        aria-current={active || undefined}
                        onClick={() => setSelectedId(task.id)}
                        className="grid min-w-0 flex-1 cursor-pointer gap-0.5 rounded-sm border-0 bg-transparent p-0 text-left font-[inherit] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <span className="flex items-center justify-between gap-2">
                          <span className="font-mono text-sm font-medium text-foreground">{task.id}</span>
                          <Badge tone={statusTone[status]} dot>
                            {runStatusLabel[status]}
                          </Badge>
                        </span>
                        <span className="truncate text-xs text-muted-foreground">
                          {task.name} · {task.updated}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <section aria-label="任务详情" className="grid min-w-0 gap-3 rounded-lg border bg-card p-4">
            {selected ? (
              <>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="grid gap-0.5">
                    <span className="font-mono text-md font-semibold">{selected.id}</span>
                    <span className="text-sm text-muted-foreground">{selected.name}</span>
                  </div>
                  <RunStatus
                    status={statusOf(selected)}
                    detail={retried.includes(selected.id) ? "已按原参数重新排队" : selected.detail}
                    onRetry={() => {
                      retry([selected.id]);
                      toast.success(`已按原参数重试 ${selected.id}`);
                    }}
                  />
                </div>
                <Descriptions columns={2} labelWidth={64} className="text-sm">
                  <DescriptionsItem label="项目" mono>
                    {selected.project}
                  </DescriptionsItem>
                  <DescriptionsItem label="更新" mono>
                    {selected.updated}
                  </DescriptionsItem>
                </Descriptions>
                <CodeBlock title="运行日志（最近 4 行）" code={selected.log} maxHeight={140} copyable={false} />
                <div className="flex flex-wrap gap-2">
                  <Button variant="secondary" size="sm" onClick={() => toast(`打开 ${selected.id} 完整日志`)}>
                    查看完整日志
                  </Button>
                </div>
              </>
            ) : (
              <Empty size="compact" title="从左侧选择一个任务查看详情" />
            )}
          </section>
        </div>
      </PageFrame>
      <Note>试一试：勾选两个“失败”任务后点“批量重试”，结果逐条计数；切换状态筛选会清空勾选，批量操作只作用于可见任务。</Note>
    </div>
  );
}

/* ---------------- 数据导入页 ---------------- */

const SAMPLE_FILE: UploadFileItem = { id: "f-042", name: "electrolyte_batch_042.csv", size: 18_432, status: "success" };

const importIssues: QualityIssue[] = [
  {
    id: "q-missing",
    type: "missing",
    level: "blocking",
    affected: "行 12",
    description: "sample_id 为空，无法与现有样品对齐",
    actions: [
      { label: "跳过该行", action: "skip" },
      { label: "去补充", action: "supplement" },
    ],
  },
  {
    id: "q-conflict",
    type: "conflict",
    level: "warning",
    affected: "行 8、行 57",
    description: "与 ds-118 v3 现有值不一致，写入后将覆盖",
    actions: [{ label: "保留新值", action: "keep" }],
  },
];

const previewRows = [
  { row: 8, id: "S-1008", formula: "EC/DMC 1:1", value: "11.2", check: { tone: "warning" as const, text: "与现有冲突" } },
  { row: 12, id: null, formula: "EC/EMC 3:7", value: "9.6", check: { tone: "danger" as const, text: "缺失主键" } },
  { row: 57, id: "S-1057", formula: "EC/DEC 1:1", value: "10.8", check: { tone: "warning" as const, text: "与现有冲突" } },
  { row: 58, id: "S-1058", formula: "PC/DMC 2:8", value: "8.9", check: { tone: "success" as const, text: "通过" } },
];

function DataImportPageStructure() {
  const [files, setFiles] = useState<UploadFileItem[]>([SAMPLE_FILE]);
  const [issues, setIssues] = useState<QualityIssue[]>(importIssues);
  const [written, setWritten] = useState(false);

  const uploaded = files.some((file) => file.status === "success");
  const blocking = hasBlockingIssues(issues);
  const skipped = issues.some((issue) => issue.id === "q-missing" && issue.resolution?.startsWith("已跳过"));
  const writeRows = skipped ? 127 : 128;
  const current = written ? 3 : !uploaded ? 0 : blocking ? 1 : 2;

  const resolve = (id: string, action: string) => {
    const resolution =
      action === "skip" ? "已跳过行 12，不写入" : action === "keep" ? "保留新值，写入时覆盖 2 行" : "已补充 sample_id = S-1012";
    setIssues((list) => list.map((issue) => (issue.id === id ? { ...issue, resolved: true, resolution } : issue)));
  };
  const reset = () => {
    setFiles([SAMPLE_FILE]);
    setIssues(importIssues);
    setWritten(false);
  };

  return (
    <div>
      <PageFrame>
        <PageHeader
         
          title="导入数据到 ds-118"
          description="文件先进入临时区，校验通过并确认后才写入新版本；正式数据集在此之前不会变更。"
          actions={
            <Button variant="ghost" onClick={reset}>
              重置演示
            </Button>
          }
        />
        <ResponsiveSteps
          size="sm"
          current={current}
          items={[{ title: "上传到临时区" }, { title: "预览与校验" }, { title: "确认写入" }]}
        />

        {!uploaded ? (
          <div className="grid gap-2">
            <Upload
              accept=".csv,.xlsx"
              maxSize={20 * 1024 * 1024}
              onFilesSelected={(selected) =>
                setFiles(selected.map((file, index) => ({ id: `u-${index}`, name: file.name, size: file.size, status: "success" })))
              }
              onFilesRejected={(rejections) => toast.error(rejections[0].reason)}
            />
            <Button variant="link" size="sm" className="justify-self-start" onClick={() => setFiles([SAMPLE_FILE])}>
              <FilePlus2 aria-hidden />
              使用示例文件 electrolyte_batch_042.csv
            </Button>
          </div>
        ) : (
          <>
            <UploadFileList
              files={files}
              onRemove={
                written
                  ? undefined
                  : () => {
                      setFiles([]);
                      setIssues(importIssues);
                    }
              }
            />

            <div className="grid gap-2">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="text-base font-semibold">预览</span>
                <span className="text-sm text-muted-foreground">共 128 行 · 仅显示有问题的行与 1 行样例</span>
              </div>
              <div className="min-w-0 overflow-hidden rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">行</TableHead>
                      <TableHead>sample_id</TableHead>
                      <TableHead>formula</TableHead>
                      <TableHead className="text-right">conductivity</TableHead>
                      <TableHead>校验结果</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {previewRows.map((row) => {
                      const fixed =
                        row.check.tone === "danger"
                          ? issues.find((issue) => issue.id === "q-missing")?.resolved
                          : row.check.tone === "warning" && issues.find((issue) => issue.id === "q-conflict")?.resolved;
                      return (
                        <TableRow key={row.row}>
                          <TableCell className="text-right font-mono text-sm text-muted-foreground">{row.row}</TableCell>
                          <TableCell className={cn("whitespace-nowrap font-mono text-sm", !row.id && "text-danger")}>
                            {row.id ?? (fixed && !skipped ? "S-1012" : "缺失")}
                          </TableCell>
                          <TableCell className="whitespace-nowrap">{row.formula}</TableCell>
                          <TableCell className="text-right font-mono tabular-nums">{row.value}</TableCell>
                          <TableCell>
                            {fixed ? (
                              <Badge tone="neutral">{row.check.tone === "danger" ? (skipped ? "已跳过" : "已补充") : "将覆盖"}</Badge>
                            ) : (
                              <Badge tone={row.check.tone} dot>
                                {row.check.text}
                              </Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </div>

            <DataQualityNotice
              title="electrolyte_batch_042.csv 导入检查"
              issues={issues}
              onResolve={written ? undefined : resolve}
            />

            {written ? (
              <Alert variant="success">
                <AlertTitle>写入完成 · ds-118 已升级到 v4</AlertTitle>
                <AlertDescription>写入 {writeRows} 行，覆盖 2 行；原始文件随 v4 归档，可立即查看版本差异摘要。</AlertDescription>
              </Alert>
            ) : (
              <div className="flex flex-col gap-3 rounded-lg border bg-muted/50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="grid gap-0.5">
                  <span className="text-base font-medium">
                    写入 {writeRows} 行到 ds-118 · 新版本 v4
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {blocking ? "还有 1 条阻断问题，处理后才能写入" : "覆盖 2 行 · 写入为事务，失败整体回滚"}
                  </span>
                </div>
                <Button
                  disabled={blocking}
                  onClick={() => {
                    setWritten(true);
                    toast.success("ds-118 已升级到 v4");
                  }}
                >
                  确认写入
                </Button>
              </div>
            )}
          </>
        )}
      </PageFrame>
      <Note>试一试：先在质量检查里处理阻断问题（跳过或补充行 12），“确认写入”才会可用；移除文件回到上传区。</Note>
    </div>
  );
}

/* ---------------- Agent 工作区 ---------------- */

const workspaceSources: SourceInfo[] = [
  { id: "src-118", title: "示例数据集 ds-118 · v3 测试结果", publisher: "示例项目数据组", updatedAt: "2026-09-20 09:44", accessibility: "available" },
  { id: "src-203", title: "电解液配方实验记录 · 第 3 轮", publisher: "示例实验室", updatedAt: "2026-09-18 14:32", accessibility: "available" },
  {
    id: "src-311",
    title: "锂盐浓度与电导率关系综述（示例文献）",
    publisher: "示例期刊",
    updatedAt: "2026-06-02 10:15",
    accessibility: "restricted",
    reason: "需项目管理员审批",
  },
];

type WorkspacePhase = "proposed" | "running" | "done" | "ignored";

function AgentWorkspaceStructure() {
  const [phase, setPhase] = useState<WorkspacePhase>("proposed");
  const { locatedId, locate } = useCitationLocator();

  const steps: AgentStep[] = [
    { id: "s1", title: "读取 ds-118 v3", status: "done", detail: "126 行 · 6 个字段" },
    { id: "s2", title: "比对第 3 轮实验记录", status: "done", detail: "发现 2 个样品偏差超过 8%" },
    {
      id: "s3",
      title: "重新计算 S-1008、S-1057 电导率",
      status: phase === "proposed" ? "waiting" : phase === "running" ? "active" : phase === "done" ? "done" : "pending",
      detail:
        phase === "done" ? "run-28007 已成功 · 用时 112 秒" : phase === "ignored" ? "已忽略，不会执行" : "预计 120 秒 · 1 个 CPU 任务",
    },
  ];

  const confirm = () =>
    new Promise<void>((resolve) => {
      setPhase("running");
      window.setTimeout(() => {
        setPhase("done");
        resolve();
      }, 1200);
    });

  return (
    <div>
      <PageFrame>
        <PageHeader
         
          title="Agent 工作区"
          status={<Badge tone="agent">示例项目 · project-042</Badge>}
          actions={
            <Button variant="ghost" onClick={() => setPhase("proposed")}>
              重置演示
            </Button>
          }
        />

        <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_16rem]">
          <div className="grid min-w-0 content-start gap-4">
            <div className="ml-auto max-w-[85%] rounded-lg rounded-br-sm bg-primary-soft px-3 py-2 text-base">
              帮我检查 ds-118 里哪些样品需要复测电导率。
            </div>

            <AgentActivity title="数据分析 Agent" steps={steps} />

            {phase === "ignored" ? (
              <Alert>
                <AlertTitle>已忽略这条建议</AlertTitle>
                <AlertDescription className="flex flex-wrap items-center gap-2">
                  没有创建任何任务，也没有修改数据集。
                  <Button variant="link" size="sm" onClick={() => setPhase("proposed")}>
                    恢复建议
                  </Button>
                </AlertDescription>
              </Alert>
            ) : phase === "done" ? (
              <section aria-label="执行结果" className="grid gap-2 rounded-lg border bg-card p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Sparkles className="size-4 text-agent" aria-hidden />
                  <span className="text-base font-semibold">结果</span>
                  <RunStatus status="succeeded" detail="run-28007 · 结果写入 ds-118 v4" />
                </div>
                <p className="m-0 text-base leading-7">
                  S-1008 电导率由 11.2 修正为 11.6 mS/cm
                  <Citation citationId="src-118" index={1} title={workspaceSources[0].title} onLocate={locate} />
                  ，偏差来自第 3 轮记录中的温度未校正
                  <Citation citationId="src-203" index={2} title={workspaceSources[1].title} onLocate={locate} />
                  ；S-1057 复测值 10.9 mS/cm，与文献趋势一致
                  <Citation
                    citationId="src-311"
                    index={3}
                    title={workspaceSources[2].title}
                    status="restricted"
                    onLocate={locate}
                  />
                  。
                </p>
              </section>
            ) : (
              <ConfirmPanel
                title="重新计算电导率"
                target={<span className="font-mono">S-1008、S-1057</span>}
                scope="2 个样品 · ds-118 v3"
                project={{ id: "project-042", name: "示例项目" }}
                budget="约 120 CPU 秒"
                sideEffects={["创建 1 个计算任务", "结果写入 ds-118 新版本 v4", "记录审计日志"]}
                onConfirm={confirm}
                onCancel={() => setPhase("ignored")}
                cancelText="忽略建议"
              />
            )}
          </div>

          <aside aria-label="来源" className="grid min-w-0 content-start gap-2">
            <span className="text-xs font-medium text-muted-foreground">来源 · {workspaceSources.length}</span>
            {workspaceSources.map((source, index) => (
              <SourceCard
                key={source.id}
                id={`dc-source-${source.id}`}
                compact
                source={{ ...source, title: `[${index + 1}] ${source.title}` }}
                highlighted={locatedId === source.id}
                onOpen={() => toast(`打开来源：${source.title}`)}
                onRequestAccess={() => toast("已提交权限申请，等待项目管理员审批")}
              />
            ))}
          </aside>
        </div>
      </PageFrame>
      <Note>试一试：在确认面板点“确认执行”，动态流推进到完成，结果区带引用编号；点击角标会高亮右侧对应来源。</Note>
    </div>
  );
}

export const templatePreviews: Record<string, PreviewFn> = {
  "list-page/structure": ListPageStructure,
  "detail-page/structure": DetailPageStructure,
  "form-wizard/structure": FormWizardStructure,
  "task-workbench/structure": TaskWorkbenchStructure,
  "data-import-page/structure": DataImportPageStructure,
  "agent-workspace/structure": AgentWorkspaceStructure,
};
