import { CalendarClock, CheckCircle2, ChevronDown, GitCompareArrows, Lock, Play, RotateCcw } from "lucide-react";
import { useRef, useState, type ReactNode } from "react";
import { AgentActivity, type AgentStep } from "@/components/ui/agent-activity";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AuditTimeline, type AuditEvent, type AuditFilter } from "@/components/ui/audit-timeline";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Citation, SourceList, useCitationLocator, type SourceListItem } from "@/components/ui/citation";
import { CodeBlock } from "@/components/ui/code-block";
import { ConfirmPanel } from "@/components/ui/confirm-panel";
import { DataQualityNotice, hasBlockingIssues, type QualityIssue } from "@/components/ui/data-quality-notice";
import { DatePicker } from "@/components/ui/date-picker";
import { Descriptions, DescriptionsItem } from "@/components/ui/descriptions";
import { Label } from "@/components/ui/label";
import { PermissionMatrix, PermissionScope, hasPermission, permissionMeta, type PermissionLevel } from "@/components/ui/permission-scope";
import { Progress } from "@/components/ui/progress";
import { ProjectSelector, type ProjectOption } from "@/components/ui/project-selector";
import { RunStatus, type RunStatusValue } from "@/components/ui/run-status";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SourceCard, type SourceInfo } from "@/components/ui/source-card";
import { Steps } from "@/components/ui/steps";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SegmentedList, SegmentedTrigger, Tabs } from "@/components/ui/tabs";
import { ToolRunCard } from "@/components/ui/tool-run-card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Upload, UploadFileList, type UploadFileItem } from "@/components/ui/upload";
import { toast } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import type { PreviewFn } from "./types";

/** 演示区底部说明文字。 */
function Note({ children }: { children: ReactNode }) {
  return <p className="m-0 text-sm text-muted-foreground">{children}</p>;
}

/** 演示控制条：主动作 + 重置。 */
function DemoBar({ children, onReset }: { children?: ReactNode; onReset: () => void }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {children}
      <Button variant="ghost" onClick={onReset}>
        <RotateCcw aria-hidden />
        重置演示
      </Button>
    </div>
  );
}

/** 流程步骤条：sm 以上横向 Steps；窄屏改为“第 n / N 步”+ 进度条，避免四列标题被挤成竖排。 */
function FlowSteps({ titles, current, done, onStepClick }: { titles: string[]; current: number; done?: boolean; onStepClick?: (index: number) => void }) {
  return (
    <>
      <Steps
        size="sm"
        className="max-sm:hidden"
        current={current}
        status={done ? "finish" : "process"}
        onStepClick={onStepClick}
        items={titles.map((title) => ({ title }))}
      />
      <div className="grid gap-1.5 sm:hidden">
        <span className="text-sm">
          <span className="text-muted-foreground">
            第 {current + 1} / {titles.length} 步 ·{" "}
          </span>
          <span className="font-semibold">{titles[current]}</span>
          {done && <span className="text-success"> · 已完成</span>}
        </span>
        <Progress value={((current + (done ? 1 : 0.5)) / titles.length) * 100} tone={done ? "success" : "primary"} />
      </div>
    </>
  );
}

/* ---------------- Agent 推荐 → 用户确认 → 执行 ---------------- */

const agentSteps: AgentStep[] = [
  { id: "read", title: "读取示例数据集 ds-118", status: "done", detail: "126 个样品 · 第 3 轮推荐配方" },
  { id: "plan", title: "生成重算计划", status: "done", detail: "电导率重算 · 1 个 CPU 任务 · 预计 300 秒" },
  { id: "confirm", title: "等待用户确认执行范围", status: "waiting" },
];

function AgentConfirmationFlow() {
  // 0 Agent 推荐 · 1 用户确认 · 2 执行中 · 3 已回传
  const [step, setStep] = useState(0);
  const reset = () => setStep(0);
  return (
    <div className="grid gap-4">
      <FlowSteps titles={["Agent 推荐", "用户确认", "执行", "回传"]} current={step} done={step === 3} />

      {step === 0 && (
        <AgentActivity
          title="配方优化助手"
          steps={agentSteps}
          waitingFor="user-confirmation"
          waitingMessage="建议对示例数据集 ds-118 重新计算电导率。确认前不会创建任何任务。"
          confirmText="查看确认面板"
          onConfirm={() => setStep(1)}
          onEdit={() => toast("已打开参数编辑（演示）")}
        />
      )}

      {step >= 1 && (
        <ConfirmPanel
          title="重新计算电导率"
          target={<span className="font-mono">ds-118 · v3</span>}
          scope="126 个样品 · 1 个 CPU 任务"
          project={{ id: "project-042", name: "示例项目" }}
          budget="约 300 秒 · 0.4 核时"
          sideEffects={["创建计算任务并占用 1 个 CPU 配额", "写入新结果版本 ds-118 · v4，不覆盖 v3", "记录审计日志"]}
          onConfirm={() => new Promise<void>((resolve) => setTimeout(() => { setStep(2); resolve(); }, 900))}
          onCancel={() => {
            toast("已取消，未产生任何副作用");
            reset();
          }}
          result={
            step >= 2 ? (
              <>
                <span>
                  任务 <span className="font-mono">run-28003</span> 已创建
                </span>
                <RunStatus
                  status={step === 3 ? "succeeded" : "running"}
                  detail={step === 3 ? "结果已回传 · ds-118 · v4" : "状态回传中，失败会回到可重试状态"}
                />
              </>
            ) : undefined
          }
        />
      )}

      <DemoBar onReset={reset}>
        {step === 2 && (
          <Button variant="secondary" onClick={() => setStep(3)}>
            模拟结果回传
          </Button>
        )}
      </DemoBar>
      <Note>推荐与执行分离：Agent 只准备参数，确认面板回显目标、范围、项目、预算与副作用后才创建任务。</Note>
    </div>
  );
}

/* ---------------- 数据导入 → 预览 → 校验 → 写入 ---------------- */

const importIssues: QualityIssue[] = [
  {
    id: "q-missing",
    type: "missing",
    level: "blocking",
    description: "3 行缺失 sample_id，补全或跳过后才能写入",
    affected: "第 12、57、89 行",
    actions: [{ label: "跳过这 3 行", action: "skip" }],
  },
  {
    id: "q-conflict",
    type: "conflict",
    level: "warning",
    description: "2 行与 ds-118 现有数据冲突，默认跳过，可逐条切换为覆盖",
    affected: "第 8、64 行",
    actions: [{ label: "确认跳过", action: "skip" }],
  },
];

const mappingRows = [
  { source: "样品编号", target: "sample_id", type: "文本", state: "ok" },
  { source: "配方", target: "formula", type: "文本", state: "ok" },
  { source: "电导率", target: "conductivity", type: "数值 · mS/cm", state: "unit" },
  { source: "备注", target: "—", type: "—", state: "ignored" },
] as const;

function DataImportFlow() {
  const [step, setStep] = useState(0);
  const [file, setFile] = useState<UploadFileItem>({ id: "f1", name: "electrolyte_batch_042.csv", size: 48_230, status: "success" });
  const [issues, setIssues] = useState<QualityIssue[]>(importIssues);
  const reset = () => {
    setStep(0);
    setIssues(importIssues);
    setFile({ id: "f1", name: "electrolyte_batch_042.csv", size: 48_230, status: "success" });
  };
  const blocked = hasBlockingIssues(issues);
  const labels = ["解析并预览", "开始校验", "确认写入 123 行"];
  return (
    <div className="grid gap-4">
      <FlowSteps
        titles={["上传入临时区", "预览与映射", "校验", "确认写入"]}
        current={step}
        done={step === 3}
        onStepClick={step < 3 ? setStep : undefined}
      />

      {step === 0 && (
        <div className="grid gap-2">
          <Upload
            layout="inline"
            accept=".csv,.xlsx"
            maxSize={20 * 1024 * 1024}
            title="拖拽或点击替换文件"
            onFilesSelected={([f]) => setFile({ id: `f-${Date.now()}`, name: f.name, size: f.size, status: "success" })}
            onFilesRejected={([r]) => toast.error(r.reason)}
          />
          <UploadFileList files={[file]} />
          <Note>文件已进入临时区：128 行 · 6 列，尚未触碰正式数据集 ds-118。</Note>
        </div>
      )}

      {step === 1 && (
        <div className="grid gap-2">
          <span className="text-base font-semibold">字段映射（来源列 → 目标字段）</span>
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>来源列</TableHead>
                  <TableHead>目标字段</TableHead>
                  <TableHead>类型 / 单位</TableHead>
                  <TableHead>映射结果</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mappingRows.map((row) => (
                  <TableRow key={row.source}>
                    <TableCell>{row.source}</TableCell>
                    <TableCell className="font-mono text-sm">{row.target}</TableCell>
                    <TableCell className="text-muted-foreground">{row.type}</TableCell>
                    <TableCell>
                      {row.state === "ok" && <Badge tone="success" dot>已匹配</Badge>}
                      {row.state === "unit" && <Badge tone="warning" dot>需确认单位</Badge>}
                      {row.state === "ignored" && <Badge tone="neutral">忽略此列</Badge>}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {step === 2 && (
        <DataQualityNotice
          title="electrolyte_batch_042.csv → ds-118 校验结果"
          summary="128 行 · 发现 2 类问题"
          issues={issues}
          onResolve={(id) =>
            setIssues((list) =>
              list.map((issue) => (issue.id === id ? { ...issue, resolved: true, resolution: "已选择跳过，写入时排除这些行" } : issue)),
            )
          }
        />
      )}

      {step === 3 && (
        <Alert variant="success">
          <CheckCircle2 className="size-4" />
          <AlertTitle className="text-base font-semibold">已写入 123 行 · 数据集 ds-118 升级为 v3</AlertTitle>
          <AlertDescription>跳过 3 行缺失、2 行冲突 · 原始文件已归档为版本附件，可随时回溯到来源行。</AlertDescription>
        </Alert>
      )}

      <DemoBar onReset={reset}>
        {step < 3 && (
          <Button onClick={() => setStep((value) => value + 1)} disabled={step === 2 && blocked}>
            {labels[step]}
          </Button>
        )}
        {step === 2 && blocked && (
          <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
            <Lock className="size-3.5" aria-hidden />
            先处理阻断项
          </span>
        )}
      </DemoBar>
      <Note>任何一步失败都不会污染正式数据集；写入是事务性的，原始文件随版本保留。</Note>
    </div>
  );
}

/* ---------------- 正文引用 → 来源定位 ---------------- */

const citeList: SourceListItem[] = [
  { id: "src-301", index: 1, title: "第 3 轮电导率优化报告" },
  { id: "src-302", index: 2, title: "示例数据集 ds-118 字段说明" },
  { id: "src-303", index: 3, title: "外部文献：示例电解液配方综述", status: "restricted", reason: "需项目管理员审批" },
];

const citeCards: SourceInfo[] = [
  { id: "src-301", title: "第 3 轮电导率优化报告", publisher: "示例项目 project-042", updatedAt: "2026-09-18 14:32", accessibility: "available" },
  { id: "src-302", title: "示例数据集 ds-118 字段说明", publisher: "数据集 ds-118", updatedAt: "2026-09-15 09:10", accessibility: "available" },
  { id: "src-303", title: "外部文献：示例电解液配方综述", publisher: "示例期刊", updatedAt: "2026-08-30 16:05", accessibility: "restricted", reason: "需项目管理员审批" },
];

function CitationStableId() {
  const { locatedId, locate } = useCitationLocator();
  const cite = (index: number) => {
    const source = citeList[index - 1];
    return <Citation citationId={source.id} index={index} title={source.title} status={source.status} onLocate={locate} />;
  };
  return (
    <div className="grid gap-4">
      <p className="m-0 text-base leading-relaxed text-foreground">
        第 3 轮优化后，示例配方 C-09 的电导率提升至 12.4 mS/cm{cite(1)}；该结果已写入示例数据集 ds-118 的 v3 版本{cite(2)}
        ，与公开综述中的同类配方处于同一量级{cite(3)}，可在项目内直接复用。
      </p>
      <SourceList
        sources={citeList}
        highlightId={locatedId}
        onOpenSource={(source) => toast(source.status === "restricted" ? `已发起访问申请：${source.title}` : `打开来源：${source.title}`)}
      />
      <div className="grid gap-2 sm:grid-cols-3">
        {citeCards.map((source) => (
          <SourceCard
            key={source.id}
            source={source}
            compact={false}
            highlighted={locatedId === source.id}
            onOpen={(id) => toast(`打开来源 ${id}`)}
            onRequestAccess={(id) => toast(`已发起访问申请 ${id}`)}
          />
        ))}
      </div>
      <Note>点击角标定位来源：编号在会话内稳定，清单条目与侧栏来源卡片同时高亮；受限来源保留编号并给出申请入口。</Note>
    </div>
  );
}

/* ---------------- 项目与权限边界 ---------------- */

const permissionActions: { label: string; required: PermissionLevel }[] = [
  { label: "查看结果", required: "viewer" },
  { label: "修改配方", required: "editor" },
  { label: "运行计算", required: "executor" },
  { label: "管理成员", required: "admin" },
];

const permissionProjects: ProjectOption[] = [
  { id: "project-042", name: "示例项目", isDefault: true, permission: "executor" },
  { id: "project-051", name: "电解液筛选（共享）", permission: "editor" },
  { id: "project-063", name: "外部合作项目", permission: "viewer" },
];

function ProjectPermissionModel() {
  const [level, setLevel] = useState<PermissionLevel>("editor");
  const [projectId, setProjectId] = useState<string | null>("project-042");
  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <span className="text-sm text-muted-foreground">切换当前用户在 project-042 的权限：</span>
        <Tabs value={level} onValueChange={(value) => setLevel(value as PermissionLevel)}>
          <SegmentedList aria-label="当前权限级别">
            {(["viewer", "editor", "executor", "admin"] as PermissionLevel[]).map((item) => (
              <SegmentedTrigger key={item} value={item}>
                {permissionMeta[item].label}
              </SegmentedTrigger>
            ))}
          </SegmentedList>
        </Tabs>
      </div>
      <PermissionScope scope={level} showDescription />

      <ul className="m-0 grid list-none gap-2 p-0">
        {permissionActions.map((action) => {
          const allowed = hasPermission(level, action.required);
          return (
            <li key={action.label} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border bg-card px-3 py-2.5">
              <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1">
                <Button variant="secondary" size="sm" disabled={!allowed} onClick={() => toast(`${action.label}（演示）`)}>
                  {action.label}
                </Button>
                {!allowed && (
                  <span className="inline-flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
                    <Lock className="size-3.5" aria-hidden />
                    需要{permissionMeta[action.required].label}权限
                    <span aria-hidden>·</span>
                    <Button variant="link" size="sm" onClick={() => toast("已向项目管理员发起升级申请")}>
                      申请升级
                    </Button>
                  </span>
                )}
              </div>
              <Badge tone={allowed ? "success" : "neutral"}>{allowed ? "允许" : "禁用"}</Badge>
            </li>
          );
        })}
      </ul>

      <div className="grid max-w-md gap-1.5">
        <Label htmlFor="perm-project">提交计算到项目（需要可执行权限）</Label>
        <ProjectSelector
          id="perm-project"
          projects={permissionProjects}
          value={projectId}
          onChange={(id) => setProjectId(id)}
          requiredPermission="executor"
          onRequestAccess={(project) => toast(`已申请 ${project.id} 的可执行权限`)}
        />
      </div>

      <Collapsible>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="group -ml-2">
            <ChevronDown className="transition-transform group-data-[state=open]:rotate-180" aria-hidden />
            查看完整权限矩阵
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2">
          <div className="rounded-lg border">
            <PermissionMatrix
              capabilities={permissionActions.map((action) => ({
                action: action.label,
                allow: (["viewer", "editor", "executor", "admin"] as PermissionLevel[]).filter((item) => hasPermission(item, action.required)),
              }))}
            />
          </div>
        </CollapsibleContent>
      </Collapsible>
      <Note>前端禁用只是提示：后端对每个请求二次鉴权，伪造可用按钮或直接调用接口都会被拒绝。</Note>
    </div>
  );
}

/* ---------------- 预约与排程 ---------------- */

const devices = [
  { id: "device-07", name: "电导率测试台", status: "available" as const },
  { id: "device-09", name: "恒温反应釜", status: "maintenance" as const },
];

const slots = [
  { time: "09:00 – 10:00" },
  { time: "10:00 – 11:00", owner: "run-28002" },
  { time: "13:00 – 14:00" },
  { time: "14:00 – 15:00", owner: "示例账号 lihua" },
  { time: "15:00 – 16:00" },
];

function ReservationSchedulingFlow() {
  const [device, setDevice] = useState<string | undefined>("device-07");
  const [date, setDate] = useState<Date | null>(new Date(2026, 8, 23));
  const [selected, setSelected] = useState<number | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const reset = () => {
    setDevice("device-07");
    setDate(new Date(2026, 8, 23));
    setSelected(null);
    setConfirmed(false);
  };
  const ready = Boolean(device && date);
  const dateText = date ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}` : "—";
  const deviceInfo = devices.find((item) => item.id === device);
  return (
    <div className="grid gap-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="grid gap-1.5">
          <Label htmlFor="rsv-device">设备</Label>
          <Select
            value={device}
            onValueChange={(value) => {
              setDevice(value);
              setSelected(null);
              setConfirmed(false);
            }}
          >
            <SelectTrigger id="rsv-device">
              <SelectValue placeholder="选择设备" />
            </SelectTrigger>
            <SelectContent>
              {devices.map((item) => (
                <SelectItem key={item.id} value={item.id} disabled={item.status === "maintenance"}>
                  {item.name} · {item.id}
                  {item.status === "maintenance" ? "（维护中）" : ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="rsv-date">日期</Label>
          <DatePicker
            id="rsv-date"
            value={date}
            disabled={!device}
            clearable={false}
            disabledDates={[{ before: new Date(2026, 8, 21) }, { dayOfWeek: [0, 6] }]}
            onValueChange={(value) => {
              setDate(value);
              setSelected(null);
              setConfirmed(false);
            }}
          />
        </div>
      </div>

      <div className="grid gap-2">
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <CalendarClock className="size-4" aria-hidden />
          时段粒度 1 小时
          {deviceInfo && <Badge tone="success" dot>设备可用</Badge>}
        </div>
        <div className="flex flex-wrap gap-2" role="group" aria-label="可预约时段">
          {slots.map((slot, index) => {
            const busy = Boolean(slot.owner);
            const button = (
              <Button
                variant={index === selected ? "default" : "secondary"}
                size="sm"
                disabled={!ready || busy || confirmed}
                aria-pressed={index === selected}
                onClick={() => setSelected(index)}
              >
                {slot.time}
                {busy && <span className="text-xs">· 已占用 {slot.owner}</span>}
              </Button>
            );
            return busy ? (
              <Tooltip key={slot.time}>
                <TooltipTrigger asChild>
                  <span tabIndex={0} className="inline-flex rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                    {button}
                  </span>
                </TooltipTrigger>
                <TooltipContent>该时段已被 {slot.owner} 占用，建议选择相邻空闲时段</TooltipContent>
              </Tooltip>
            ) : (
              <span key={slot.time} className="inline-flex">
                {button}
              </span>
            );
          })}
        </div>
      </div>

      {selected !== null && (
        <Card className={cn("grid gap-3 p-4", confirmed && "border-success/40")}>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-base font-semibold">{confirmed ? "预约成功" : "预约草稿"}</span>
            {confirmed ? <Badge tone="success">rsv-3102</Badge> : <Badge tone="neutral">待确认</Badge>}
          </div>
          <Descriptions columns={2} labelWidth={72}>
            <DescriptionsItem label="设备">{deviceInfo ? `${deviceInfo.name} · ${deviceInfo.id}` : "—"}</DescriptionsItem>
            <DescriptionsItem label="时段" mono>
              {dateText} {slots[selected].time}
            </DescriptionsItem>
            <DescriptionsItem label="项目">示例项目（project-042）</DescriptionsItem>
            <DescriptionsItem label="用途">第 4 轮配方复测</DescriptionsItem>
          </Descriptions>
          {confirmed && (
            <span className="text-sm text-muted-foreground">
              已写入审计 ·{" "}
              <Button variant="link" size="sm" onClick={() => { setConfirmed(false); setSelected(null); toast("已取消预约 rsv-3102"); }}>
                取消预约
              </Button>
            </span>
          )}
        </Card>
      )}

      <DemoBar onReset={reset}>
        <Button disabled={selected === null || confirmed} onClick={() => setConfirmed(true)}>
          确认预约
        </Button>
      </DemoBar>
      <Note>先选设备再选日期与时段；被占用时段置灰并标注占用方，确认前回显完整草稿，确认后回显预约编号与取消入口。</Note>
    </div>
  );
}

/* ---------------- 运行状态与日志 ---------------- */

type Phase = "queued" | "running" | "succeeded" | "failed" | "partial";

const baseLogs = ["09:41:02 [info] 任务已进入队列，当前位置 1/3"];
const logsByPhase: Record<Phase, string[]> = {
  queued: baseLogs,
  running: [...baseLogs, "09:42:10 [info] 资源已分配，开始电导率计算（第 1/4 批）", "09:43:01 [info] 第 2/4 批完成，已处理 63/126 个样品"],
  succeeded: [...baseLogs, "09:42:10 [info] 资源已分配，开始电导率计算（第 1/4 批）", "09:44:37 [info] 计算完成，126/126 个样品全部成功"],
  failed: [...baseLogs, "09:42:10 [info] 资源已分配，开始电导率计算（第 1/4 批）", "09:43:55 [error] E_INPUT_FIELD：第 3 批输入缺字段 conductivity，任务终止"],
  partial: [
    ...baseLogs,
    "09:42:10 [info] 资源已分配，开始电导率计算（第 1/4 批）",
    "09:44:02 [warning] 第 4 批 12 个样品结构不收敛，已跳过",
    "09:44:37 [info] 计算结束，114/126 个样品完成",
  ],
};

const runDetail: Record<Phase, string> = {
  queued: "队列位置 1/3 · 预计等待 1 分钟",
  running: "已运行 1 分 45 秒 · 日志跟随中",
  succeeded: "126/126 完成 · 结果已写入 ds-118 · v4",
  failed: "E_INPUT_FIELD · 已写入数据安全，可保留参数重试",
  partial: "114/126 完成 · 12 个样品不收敛",
};

function RunStatusLogsMachine() {
  const [phase, setPhase] = useState<Phase>("queued");
  const [attempt, setAttempt] = useState(0);
  const startedAt = useRef(Date.now());
  const runId = `run-${28003 + attempt}`;
  const start = () => {
    startedAt.current = Date.now() - 105_000;
    setPhase("running");
  };
  const retry = () => {
    setAttempt((value) => value + 1);
    start();
    toast(`已保留原参数创建新运行实例 run-${28004 + attempt}，原失败记录保留在审计中`);
  };
  const reset = () => {
    setAttempt(0);
    setPhase("queued");
  };
  const lines = logsByPhase[phase].map((line) => line.replace("任务已进入队列", `任务 ${runId} 已进入队列`));
  const errorLines = lines.flatMap((line, index) => (line.includes("[error]") || line.includes("[warning]") ? [index + 1] : []));
  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <span className="font-mono text-sm text-muted-foreground">{runId}</span>
        <RunStatus status={phase as RunStatusValue} detail={runDetail[phase]} onRetry={retry} onViewDetail={() => toast("12 个未完成样品：S-1115 – S-1126（演示）")} />
      </div>
      {phase === "running" && <Progress value={50} className="max-w-sm" />}

      {phase !== "queued" && (
        <ToolRunCard
          tool="conductivity.compute"
          status={phase === "running" ? "running" : phase === "failed" ? "failed" : phase === "partial" ? "partial" : "succeeded"}
          startedAt={phase === "running" ? startedAt.current : undefined}
          duration={phase === "running" ? undefined : phase === "failed" ? 173_000 : 215_000}
          paramsSummary="dataset=ds-118@v3 · batches=4 · temperature=298K"
          input="ds-118 · v3 · 126 个样品"
          output={phase === "succeeded" ? "ds-118 · v4 · 126 行结果" : phase === "partial" ? "ds-118 · v4 · 114 行结果（12 行未完成）" : phase === "running" ? "计算中…" : undefined}
          error={phase === "failed" ? "第 3 批输入缺字段 conductivity（E_INPUT_FIELD）" : undefined}
          params={{ dataset: "ds-118", version: "v3", batches: 4, temperature: 298, project: "project-042" }}
          onRetry={retry}
        />
      )}

      <CodeBlock title={`${runId} 实时日志`} language="log" code={lines.join("\n")} showLineNumbers highlightLines={errorLines} maxHeight={180} defaultWrap showWrapToggle copyable />

      <DemoBar onReset={reset}>
        {phase === "queued" && (
          <Button onClick={start}>
            <Play aria-hidden />
            开始运行
          </Button>
        )}
        {phase === "running" && (
          <>
            <Button onClick={() => setPhase("succeeded")}>模拟成功</Button>
            <Button variant="secondary" onClick={() => setPhase("partial")}>
              模拟部分完成
            </Button>
            <Button variant="danger" onClick={() => setPhase("failed")}>
              模拟失败
            </Button>
          </>
        )}
        {phase === "partial" && (
          <Button variant="secondary" onClick={retry}>
            <RotateCcw aria-hidden />
            仅重试未完成部分
          </Button>
        )}
      </DemoBar>
      <Note>状态机是唯一的真实来源；重试会保留原参数并生成新的运行实例，失败记录留在审计中。</Note>
    </div>
  );
}

/* ---------------- 审计与版本 ---------------- */

const auditEvents: AuditEvent[] = [
  {
    id: "evt-9031",
    actor: "示例账号 zhangming",
    actorType: "user",
    action: "修改字段映射",
    target: "ds-118 · conductivity",
    at: "2026-09-20 14:02",
    level: "warning",
    detail: "单位 mS/cm → S/m，影响 126 行",
  },
  {
    id: "evt-9024",
    actor: "系统自动",
    actorType: "system",
    action: "导入并创建版本",
    target: "ds-118 · v3",
    at: "2026-09-19 10:31",
    detail: "写入 123 行，跳过 5 行；原始文件 electrolyte_batch_042.csv 已归档",
  },
  {
    id: "evt-9017",
    actor: "配方优化助手",
    actorType: "agent",
    action: "推荐参数被采纳",
    target: "第 3 轮推荐配方",
    at: "2026-09-18 16:20",
    detail: "由示例账号 zhangming 确认采纳，更新 4 个配方参数",
  },
];

const olderEvents: AuditEvent[] = [
  { id: "evt-8990", actor: "示例账号 lihua", actorType: "user", action: "删除草稿版本", target: "ds-118 · v2-draft", at: "2026-09-16 11:08", level: "critical", detail: "新增作废记录，草稿内容仍可在审计中查看" },
  { id: "evt-8972", actor: "系统自动", actorType: "system", action: "创建版本", target: "ds-118 · v2", at: "2026-09-12 09:45" },
];

const diffRows = [
  { field: "conductivity[57]", before: "9.8", after: "10.1", kind: "modified" },
  { field: "sample_id S-1124 – S-1126", before: "—", after: "3 行", kind: "added" },
  { field: "sample_id S-0007", before: "1 行", after: "—", kind: "removed" },
] as const;

const diffMeta = {
  modified: { label: "修改", tone: "warning" },
  added: { label: "新增", tone: "success" },
  removed: { label: "删除", tone: "danger" },
} as const;

function AuditVersioningWhoWhat() {
  const [filter, setFilter] = useState<AuditFilter>("all");
  const [events, setEvents] = useState<AuditEvent[]>(auditEvents);
  const [loadingMore, setLoadingMore] = useState(false);
  const [showDiff, setShowDiff] = useState(false);
  const loadMore = () => {
    setLoadingMore(true);
    setTimeout(() => {
      setEvents((list) => [...list, ...olderEvents]);
      setLoadingMore(false);
    }, 700);
  };
  return (
    <div className="grid gap-4">
      <span className="text-sm text-muted-foreground">审计时间线 · 数据集 ds-118 · 倒序</span>
      <AuditTimeline
        events={events}
        filter={filter}
        onFilterChange={setFilter}
        loadingMore={loadingMore}
        onLoadMore={events.length < auditEvents.length + olderEvents.length ? loadMore : undefined}
        onTargetClick={(event) => toast(`跳转到 ${event.target}（演示）`)}
      />
      <div>
        <Button variant="secondary" size="sm" aria-expanded={showDiff} onClick={() => setShowDiff((value) => !value)}>
          <GitCompareArrows aria-hidden />
          {showDiff ? "收起版本对比" : "对比 v2 → v3"}
        </Button>
      </div>
      {showDiff && (
        <Card className="grid gap-2 p-4">
          <span className="text-base font-semibold">ds-118 · v2 → v3 差异（仅展示变更字段）</span>
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>字段 / 行</TableHead>
                  <TableHead>v2</TableHead>
                  <TableHead>v3</TableHead>
                  <TableHead>变更</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {diffRows.map((row) => (
                  <TableRow key={row.field}>
                    <TableCell className="font-mono text-sm">{row.field}</TableCell>
                    <TableCell className={cn("font-mono text-sm", row.kind !== "added" && "text-danger line-through")}>{row.before}</TableCell>
                    <TableCell className={cn("font-mono text-sm", row.kind !== "removed" && "font-semibold text-success")}>{row.after}</TableCell>
                    <TableCell>
                      <Badge tone={diffMeta[row.kind].tone}>{diffMeta[row.kind].label}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="secondary" size="sm" onClick={() => toast("已基于 v2 创建新版本 v4，v3 保留可查（演示）")}>
              <RotateCcw aria-hidden />
              以 v2 恢复为新版本
            </Button>
          </div>
        </Card>
      )}
      <Note>恢复历史版本会创建一个新版本，原版本依然可查；审计记录只增不改。</Note>
    </div>
  );
}

export const patternPreviews: Record<string, PreviewFn> = {
  "agent-confirmation/flow": AgentConfirmationFlow,
  "data-import/flow": DataImportFlow,
  "citation-source/stable-id": CitationStableId,
  "project-permission/model": ProjectPermissionModel,
  "reservation-scheduling/flow": ReservationSchedulingFlow,
  "run-status-logs/state-machine": RunStatusLogsMachine,
  "audit-versioning/who-what": AuditVersioningWhoWhat,
};
