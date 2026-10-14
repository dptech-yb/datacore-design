import { Sparkles, UserCheck } from "lucide-react";
import { useState } from "react";
import { toast } from "@/components/ui/sonner";
import { AgentActivity, type AgentStep } from "@/components/ui/agent-activity";
import { AuditTimeline, type AuditEvent, type AuditFilter } from "@/components/ui/audit-timeline";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Citation, SourceList, useCitationLocator, type SourceListItem } from "@/components/ui/citation";
import { ConfirmPanel } from "@/components/ui/confirm-panel";
import { DataQualityNotice, hasBlockingIssues, type QualityIssue } from "@/components/ui/data-quality-notice";
import { DatasetPicker, type DatasetOption } from "@/components/ui/dataset-picker";
import { ExperimentStep, type ExperimentNode } from "@/components/ui/experiment-step";
import { Label } from "@/components/ui/label";
import { PermissionMatrix, PermissionScope, hasPermission, type PermissionLevel } from "@/components/ui/permission-scope";
import { ProjectSelector, type ProjectOption } from "@/components/ui/project-selector";
import { RunStatus, type RunStatusValue } from "@/components/ui/run-status";
import { SourceCard, type SourceInfo } from "@/components/ui/source-card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ToolRunCard } from "@/components/ui/tool-run-card";
import type { PreviewFn } from "./types";

const note = (text: string) => <p className="demo-note">{text}</p>;

/* ---------------- Citation 引用角标 ---------------- */

const citeSources: SourceListItem[] = [
  { id: "src-041", index: 1, title: "ds-118 · 第 3 轮实验结果" },
  { id: "src-043", index: 2, title: "run-28003 · 优化策略摘要" },
];

function CitationBasic() {
  return (
    <div className="grid max-w-xl gap-3 text-base leading-7">
      <p className="m-0">
        第 3 轮优化后，示例配方 C-09 的电导率达到 8.7 mS/cm，较基线提升 23%
        <Citation citationId="src-041" index={1} title={citeSources[0].title} />。Agent 建议沿当前方向继续 2 轮探索
        <Citation citationId="src-043" index={2} title={citeSources[1].title} />。
      </p>
      <SourceList sources={citeSources} />
    </div>
  );
}

function CitationLocate() {
  const { locatedId, locate } = useCitationLocator();
  return (
    <div className="grid max-w-xl gap-3 text-base leading-7">
      <p className="m-0">
        基于第 3 轮实验结果
        <Citation citationId="src-041" index={1} title={citeSources[0].title} onLocate={locate} />
        ，建议将 LiFSI 浓度提高至 1.6 mol/kg
        <Citation citationId="src-043" index={2} title={citeSources[1].title} onLocate={locate} />。
      </p>
      <SourceList sources={citeSources} highlightId={locatedId} onLocateCitation={locate} />
      {note("点击角标或来源序号，对应来源项定位并高亮约 2 秒；Esc 取消高亮。")}
    </div>
  );
}

function CitationUnavailable() {
  return (
    <div className="grid max-w-xl gap-3 text-base leading-7">
      <p className="m-0">
        早期结论引用的外部文献已下线
        <Citation citationId="src-055" index={3} title="外部文献（example.com）" status="unavailable" />
        ，该结论待人工复核。
      </p>
      <SourceList
        sources={[
          { id: "src-055", index: 3, title: "外部文献（example.com）", status: "unavailable", reason: "已下线" },
          { id: "src-056", index: 4, title: "共享溶剂参数库", status: "restricted", reason: "需申请权限" },
        ]}
      />
    </div>
  );
}

function CitationBusiness() {
  const { locatedId, locate } = useCitationLocator();
  return (
    <Card className="grid max-w-xl gap-3 p-4 text-base leading-7">
      <div className="flex items-center gap-2">
        <Sparkles className="size-4 text-agent" aria-hidden />
        <strong className="text-base">Agent 答复</strong>
        <Badge tone="agent" dot>
          已生成
        </Badge>
      </div>
      <p className="m-0">
        基于 ds-118 第 3 轮结果
        <Citation citationId="src-041" index={1} title={citeSources[0].title} onLocate={locate} />
        ，建议将 LiFSI 浓度提高至 1.6 mol/kg，预计电导率可达 9.0 mS/cm
        <Citation citationId="src-043" index={2} title={citeSources[1].title} onLocate={locate} />。
      </p>
      <SourceList
        sources={citeSources}
        highlightId={locatedId}
        onLocateCitation={locate}
        onOpenSource={(source) => toast(`打开来源：${source.title}`)}
      />
    </Card>
  );
}

/* ---------------- SourceCard 来源卡片 ---------------- */

const baseSource: SourceInfo = {
  id: "src-041",
  title: "电导率优化第 3 轮实验结果",
  publisher: "DataCore 实验平台",
  updatedAt: "2026-09-18 14:32",
  accessibility: "available",
};

function SourceCardBasic() {
  return (
    <div className="max-w-md">
      <SourceCard source={baseSource} onOpen={(id) => toast(`打开来源 ${id}`)} />
    </div>
  );
}

function SourceCardAccess() {
  return (
    <div className="grid max-w-md gap-2.5">
      <SourceCard source={baseSource} onOpen={(id) => toast(`打开来源 ${id}`)} />
      <SourceCard
        source={{ id: "src-052", title: "共享溶剂参数库", publisher: "示例材料数据联盟", updatedAt: "2026-08-30 09:15", accessibility: "restricted", reason: "需项目管理员审批" }}
        onRequestAccess={(id) => toast(`已发起 ${id} 的权限申请`)}
      />
      <SourceCard
        source={{ id: "src-055", title: "早期外部文献", publisher: "example.com", updatedAt: "2026-03-02 10:20", accessibility: "unavailable", reason: "已下线" }}
        onViewReason={() => toast("该来源已于 2026-06 下线，相关结论待人工复核")}
      />
    </div>
  );
}

function SourceCardBusiness() {
  const sources: SourceInfo[] = [
    baseSource,
    { id: "src-043", title: "优化策略摘要 · run-28003", publisher: "DataCore 实验平台", updatedAt: "2026-09-19 11:07", accessibility: "available" },
  ];
  return (
    <div className="demo-stack">
      <div className="grid gap-3 sm:grid-cols-2">
        {sources.map((source) => (
          <SourceCard key={source.id} source={source} onOpen={(id) => toast(`打开来源 ${id}`)} />
        ))}
      </div>
      {note(`本答复共引用 ${sources.length} 条来源，与正文角标共用同一组 citationId。`)}
    </div>
  );
}

/* ---------------- AgentActivity Agent 活动 ---------------- */

function AgentActivityBasic() {
  return (
    <AgentActivity
      className="max-w-xl"
      steps={[
        { id: "s1", title: "读取输入数据", status: "done", detail: "ds-118 · v3 · 128 条记录" },
        { id: "s2", title: "调用优化工具", status: "active" },
        { id: "s3", title: "生成推荐配方", status: "pending", detail: "等待上一步完成" },
      ]}
      currentTool={{ name: "conductivity-optimize", summary: "round=3 · budget=300s" }}
    />
  );
}

function AgentActivityWaiting() {
  const [state, setState] = useState<"waiting" | "confirmed">("waiting");
  const steps: AgentStep[] = [
    { id: "s1", title: "生成执行计划", status: "done", detail: "目标：重新计算电导率 · ds-118 · v3" },
    state === "waiting"
      ? { id: "s2", title: "提交计算任务 run-28003", status: "waiting", detail: "已等待 42 秒" }
      : { id: "s2", title: "提交计算任务 run-28003", status: "active", detail: "已确认，正在提交" },
  ];
  return (
    <div className="demo-stack max-w-xl">
      <AgentActivity
        title="电导率优化 Agent"
        steps={steps}
        waitingFor={state === "waiting" ? "user-confirmation" : null}
        waitingMessage="项目：示例项目（project-042）· 预计最长 300 秒。确认前流程不会推进。"
        onConfirm={() => setState("confirmed")}
        onEdit={() => toast("打开参数编辑")}
      />
      {state === "confirmed" && (
        <Button variant="ghost" size="sm" className="justify-self-start" onClick={() => setState("waiting")}>
          重置演示
        </Button>
      )}
    </div>
  );
}

function AgentActivityFailed() {
  const [state, setState] = useState<"failed" | "active" | "done">("failed");
  const detail = { failed: "连接超时（10s）", active: "正在重试…", done: "重试成功 · 214 条参考数据" }[state];
  return (
    <div className="demo-stack max-w-xl">
      <AgentActivity
        steps={[
          { id: "s1", title: "读取输入数据", status: "done", detail: "ds-118 · v3 · 128 条记录" },
          { id: "s2", title: "调用外部数据库", status: state, detail },
          { id: "s3", title: "生成推荐配方", status: "pending", detail: "等待上一步完成" },
        ]}
        onRetry={() => {
          setState("active");
          window.setTimeout(() => setState("done"), 1200);
        }}
      />
      {note("失败步骤标红并停在原地，可单步重试，重试不影响已完成步骤。")}
    </div>
  );
}

function AgentActivityBusiness() {
  return (
    <AgentActivity
      className="max-w-xl"
      title="电导率优化 Agent"
      steps={[
        { id: "s1", title: "读取输入数据", status: "done", detail: "ds-118 · v3 · 128 条 · 耗时 3s" },
        { id: "s2", title: "基线模型评估", status: "done", detail: "RMSE 0.31 · 耗时 42s" },
        { id: "s3", title: "调用优化工具", status: "active", detail: "已运行 36s" },
        { id: "s4", title: "生成推荐配方", status: "pending" },
        { id: "s5", title: "写入实验记录", status: "pending" },
      ]}
      currentTool={{ name: "conductivity-optimize", summary: "round=3 · target=9.0 mS/cm" }}
    />
  );
}

/* ---------------- RunStatus 运行状态 ---------------- */

function RunStatusBasic() {
  const all: RunStatusValue[] = ["queued", "running", "succeeded", "failed", "partial", "retry-needed"];
  return (
    <div className="demo-stack">
      <div className="demo-row">
        {all.map((status) => (
          <RunStatus key={status} status={status} />
        ))}
      </div>
      {note("六态为封闭集合：图标 + 文字表达，不单独依赖颜色。")}
    </div>
  );
}

function RunStatusDetail() {
  return (
    <div className="grid max-w-xl gap-3">
      {[
        { name: "run-28003 · 电导率计算", el: <RunStatus status="failed" detail="计算资源超时（exit 124）" onRetry={() => toast("已重新排队")} /> },
        { name: "batch-07 · 批量校验", el: <RunStatus status="partial" detail="12/15 完成，3 条待人工确认" onViewDetail={() => toast("打开明细")} /> },
        { name: "run-28004 · 结构优化", el: <RunStatus status="queued" detail="队列第 2 位，预计 5 分钟" /> },
      ].map((row) => (
        <div key={row.name} className="grid gap-1 rounded-lg border bg-card px-3 py-2.5">
          <span className="text-base font-medium">{row.name}</span>
          {row.el}
        </div>
      ))}
    </div>
  );
}

function RunStatusFlow() {
  const stages: { status: RunStatusValue; detail: string }[] = [
    { status: "queued", detail: "队列第 1 位" },
    { status: "running", detail: "已运行 36s" },
    { status: "failed", detail: "计算资源超时（exit 124）" },
    { status: "retry-needed", detail: "重试后回到排队中" },
    { status: "queued", detail: "已重新排队 · 队列第 1 位" },
    { status: "running", detail: "已运行 12s" },
    { status: "succeeded", detail: "耗时 214s" },
  ];
  const [index, setIndex] = useState(0);
  const stage = stages[index];
  return (
    <div className="demo-stack max-w-xl">
      <div className="grid gap-1 rounded-lg border bg-card px-3 py-2.5">
        <span className="text-base font-medium">run-28003 · 电导率计算</span>
        <RunStatus status={stage.status} detail={stage.detail} />
      </div>
      <div className="demo-row">
        <Button variant="secondary" size="sm" disabled={index === stages.length - 1} onClick={() => setIndex((i) => Math.min(i + 1, stages.length - 1))}>
          模拟推进
        </Button>
        <Button variant="ghost" size="sm" onClick={() => setIndex(0)}>
          重置
        </Button>
      </div>
      {note("流转由后端事件驱动：排队中 → 运行中 → 成功 / 失败 / 部分完成；失败后进入需重试，重试回到排队中。")}
    </div>
  );
}

function RunStatusBusiness() {
  const runs: { id: string; name: string; project: string; projectId: string; status: RunStatusValue; detail?: string; duration: string }[] = [
    { id: "run-28003", name: "电导率计算", project: "示例项目", projectId: "project-042", status: "succeeded", duration: "214s" },
    { id: "run-28004", name: "结构优化", project: "示例项目", projectId: "project-042", status: "running", duration: "36s…" },
    { id: "run-28005", name: "批量校验 · batch-07", project: "示例项目 B", projectId: "project-107", status: "failed", detail: "计算资源超时", duration: "—" },
    { id: "run-28006", name: "批量校验 · batch-08", project: "示例项目 B", projectId: "project-107", status: "partial", detail: "12/15 完成", duration: "88s" },
  ];
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>任务</TableHead>
          <TableHead>项目</TableHead>
          <TableHead>状态</TableHead>
          <TableHead className="text-right">耗时</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {runs.map((run) => (
          <TableRow key={run.id}>
            <TableCell>
              <div className="font-mono text-sm font-medium">{run.id}</div>
              <div className="text-xs text-muted-foreground">{run.name}</div>
            </TableCell>
            <TableCell>
              <div>{run.project}</div>
              <div className="font-mono text-xs text-muted-foreground">{run.projectId}</div>
            </TableCell>
            <TableCell>
              <RunStatus
                status={run.status}
                detail={run.detail}
                onRetry={run.status === "failed" ? () => toast(`${run.id} 已重新排队`) : undefined}
                onViewDetail={run.status === "partial" ? () => toast("打开明细") : undefined}
              />
            </TableCell>
            <TableCell className="text-right font-mono text-sm tabular-nums">{run.duration}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

/* ---------------- ConfirmPanel 确认面板 ---------------- */

const demoProject = { id: "project-042", name: "示例项目" };

function ConfirmPanelBasic() {
  return (
    <ConfirmPanel
      className="max-w-lg"
      title="重新计算电导率"
      target="ds-118 · 第 3 轮推荐配方"
      scope="创建 1 个 CPU 计算任务"
      project={demoProject}
      budget="预计最长 300 秒"
      sideEffects={["占用项目算力额度", "写入一条审计日志"]}
      confirmText="确认使用 project-042 执行"
      onConfirm={() => { toast.success("已提交"); }}
      onCancel={() => toast("已取消，未产生任何副作用")}
    />
  );
}

function ConfirmPanelDanger() {
  return (
    <ConfirmPanel
      className="max-w-lg"
      danger
      title="撤销任务 run-28003"
      target="run-28003 · 电导率计算"
      scope="任务与其中间产物"
      project={demoProject}
      sideEffects={["中间结果将被删除，不可恢复", "已占用额度不返还"]}
      confirmText="确认撤销"
      onConfirm={() => { toast("已撤销 run-28003"); }}
      onCancel={() => toast("已取消")}
    />
  );
}

function ConfirmPanelBusiness() {
  const [created, setCreated] = useState<string | null>(null);
  return (
    <div className="demo-stack max-w-lg">
      <ConfirmPanel
        title="提交电导率优化计算"
        target="ds-118 · v3 · 128 条记录"
        scope="创建 1 个 GPU 计算任务"
        project={demoProject}
        budget="预计最长 300 秒"
        sideEffects={["占用项目算力额度", "写入审计日志", "结果写回 ds-118"]}
        confirmText="确认使用 project-042 执行"
        onConfirm={() =>
          new Promise<void>((resolve) =>
            window.setTimeout(() => {
              setCreated("run-28003");
              resolve();
            }, 1400),
          )
        }
        onCancel={() => toast("已取消")}
        result={
          created && (
            <>
              <span>
                任务 <span className="font-mono">{created}</span> 已创建
              </span>
              <RunStatus status="queued" />
              <Button variant="link" size="sm" onClick={() => toast("打开任务详情")}>
                查看任务
              </Button>
            </>
          )
        }
      />
      {created && (
        <Button variant="ghost" size="sm" className="justify-self-start" onClick={() => setCreated(null)}>
          重置演示
        </Button>
      )}
    </div>
  );
}

/* ---------------- ProjectSelector 项目选择器 ---------------- */

const projects: ProjectOption[] = [
  { id: "project-042", name: "示例项目 A", isDefault: true, permission: "admin" },
  { id: "project-107", name: "示例项目 B", permission: "executor" },
  { id: "project-209", name: "共享数据池", permission: "viewer" },
];

function ProjectSelectorBasic() {
  const [value, setValue] = useState("project-042");
  return (
    <div className="grid max-w-md gap-1.5">
      <Label htmlFor="ps-basic">归属项目</Label>
      <ProjectSelector id="ps-basic" projects={projects} value={value} onChange={setValue} />
      <span className="text-xs text-muted-foreground">默认项目排在最前；同名项目用 ID 区分。</span>
    </div>
  );
}

function ProjectSelectorLimited() {
  const [value, setValue] = useState("project-042");
  return (
    <div className="grid max-w-md gap-1.5">
      <Label htmlFor="ps-limited">归属项目（需要可执行权限）</Label>
      <ProjectSelector
        id="ps-limited"
        projects={projects}
        value={value}
        onChange={setValue}
        requiredPermission="executor"
        onRequestAccess={(project) => toast(`已发起 ${project.name}（${project.id}）的权限申请`)}
      />
      <span className="text-xs text-muted-foreground">展开后可见“共享数据池”禁用并标注缺口，提供申请入口，而不是隐藏。</span>
    </div>
  );
}

function ProjectSelectorBusiness() {
  const [value, setValue] = useState("project-042");
  const current = projects.find((project) => project.id === value);
  const canExecute = hasPermission(current?.permission, "executor");
  return (
    <div className="grid max-w-md gap-3">
      <div className="grid gap-1.5">
        <Label htmlFor="ps-business">归属项目</Label>
        <ProjectSelector
          id="ps-business"
          projects={projects}
          value={value}
          onChange={setValue}
          onRequestAccess={(project) => toast(`已发起 ${project.id} 的权限申请`)}
        />
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Button disabled={!canExecute} aria-describedby={!canExecute ? "ps-business-hint" : undefined}>
          提交计算任务
        </Button>
        {current && <PermissionScope id="ps-business-hint" scope={current.permission} required="executor" onRequestUpgrade={() => toast("已发起升级申请")} />}
      </div>
      {note("切换到“共享数据池”（仅可见）时，提交按钮即时禁用并给出缺口与申请入口。")}
    </div>
  );
}

/* ---------------- DatasetPicker 数据集选择器 ---------------- */

const datasets: DatasetOption[] = [
  { id: "ds-118", name: "电解液电导率数据集", batch: "batch-07", version: "v3", source: "computed", records: 128 },
  { id: "ds-092", name: "溶剂化能基准集", batch: "batch-03", version: "v5", source: "imported", records: 342 },
  { id: "ds-104", name: "黏度共享数据集", batch: "batch-02", version: "v1", source: "shared", records: 86 },
  { id: "ds-131", name: "示例对照数据集", batch: "batch-01", version: "v2", source: "imported", records: 64, disabledReason: "被 run-28004 占用中" },
];

function DatasetPickerBasic() {
  const [value, setValue] = useState<string>("ds-118");
  return (
    <div className="grid max-w-md gap-1.5">
      <Label htmlFor="dp-basic">输入数据集</Label>
      <DatasetPicker id="dp-basic" datasets={datasets} value={value} onChange={setValue} />
    </div>
  );
}

function DatasetPickerMulti() {
  const [value, setValue] = useState<string[]>(["ds-118", "ds-092"]);
  return (
    <div className="grid max-w-md gap-1.5">
      <Label htmlFor="dp-multi">合并输入（多选）</Label>
      <DatasetPicker id="dp-multi" selectionMode="multiple" datasets={datasets} value={value} onChange={setValue} />
    </div>
  );
}

function DatasetPickerEmpty() {
  return (
    <DatasetPicker
      className="max-w-md"
      datasets={[]}
      onChange={() => undefined}
      emptyDescription="当前项目（project-042）还没有数据集，导入后即可用于计算。"
      emptyAction={{ label: "去导入数据", onClick: () => toast("打开导入向导") }}
    />
  );
}

function DatasetPickerBusiness() {
  const options: DatasetOption[] = [
    { id: "ds-118@v3", datasetId: "ds-118", name: "电解液电导率数据集", batch: "batch-07", version: "v3", source: "computed", records: 128 },
    { id: "ds-118@v2", datasetId: "ds-118", name: "电解液电导率数据集", batch: "batch-06", version: "v2", source: "imported", records: 120, archived: true },
    { id: "ds-092@v5", datasetId: "ds-092", name: "溶剂化能基准集", batch: "batch-03", version: "v5", source: "shared", records: 342 },
  ];
  const [value, setValue] = useState<string>("ds-118@v3");
  return (
    <div className="grid max-w-md gap-3">
      <div className="grid gap-1.5">
        <Label htmlFor="dp-business">优化输入数据集</Label>
        <DatasetPicker id="dp-business" datasets={options} value={value} onChange={setValue} />
      </div>
      <Button className="justify-self-start" disabled={!value}>
        开始优化
      </Button>
      {note("同一数据集的多个版本并列展示，版本固定为所选、不会隐式漂移；选择已归档版本 v2 会给出提示。")}
    </div>
  );
}

/* ---------------- PermissionScope 权限范围 ---------------- */

const levels: PermissionLevel[] = ["viewer", "editor", "executor", "admin"];

function PermissionScopeBasic() {
  return (
    <div className="demo-stack">
      <div className="demo-row">
        {levels.map((level) => (
          <PermissionScope key={level} scope={level} />
        ))}
      </div>
      <div className="grid gap-1.5">
        {levels.map((level) => (
          <PermissionScope key={level} scope={level} showDescription />
        ))}
      </div>
    </div>
  );
}

function PermissionScopeMatrix() {
  return (
    <PermissionMatrix
      capabilities={[
        { action: "查看数据与结果", allow: ["viewer", "editor", "executor", "admin"] },
        { action: "编辑配置与配方", allow: ["editor", "executor", "admin"] },
        { action: "提交计算任务", allow: ["executor", "admin"] },
        { action: "管理成员与权限", allow: ["admin"] },
      ]}
    />
  );
}

function PermissionScopeBusiness() {
  const members: { name: string; role: string; scope: PermissionLevel }[] = [
    { name: "张三", role: "项目创建者", scope: "admin" },
    { name: "李四", role: "计算工程师", scope: "executor" },
    { name: "王五", role: "外部协作", scope: "viewer" },
  ];
  const me = members[2];
  return (
    <div className="grid max-w-lg gap-3">
      <ul className="m-0 grid list-none gap-2 p-0">
        {members.map((member) => (
          <li key={member.name} className="flex items-center gap-3 rounded-lg border bg-card px-3 py-2">
            <UserCheck className="size-4 text-muted-foreground" aria-hidden />
            <span className="grid flex-1 gap-0">
              <span className="text-base font-medium">{member.name}</span>
              <span className="text-xs text-muted-foreground">{member.role}</span>
            </span>
            <PermissionScope scope={member.scope} />
          </li>
        ))}
      </ul>
      <div className="flex flex-wrap items-center gap-3">
        <Button disabled aria-describedby="perm-business-gap">
          提交计算任务
        </Button>
        <span id="perm-business-gap" className="text-sm text-muted-foreground">
          当前身份：{me.name}
        </span>
        <PermissionScope scope={me.scope} required="executor" onRequestUpgrade={() => toast("已发起升级申请")} />
      </div>
    </div>
  );
}

/* ---------------- AuditTimeline 审计时间线 ---------------- */

function AuditTimelineBasic() {
  return (
    <AuditTimeline
      className="max-w-xl"
      events={[
        { id: "evt-03", actor: "李四", action: "提交了计算任务", target: "run-28003", at: "2026-09-21 10:24" },
        { id: "evt-02", actor: "张三", action: "更新了数据集", target: "ds-118 · v3", at: "2026-09-21 09:58" },
        { id: "evt-01", actor: "张三", action: "创建了项目", target: "project-042", at: "2026-09-20 16:02" },
      ]}
    />
  );
}

function AuditTimelineIncident() {
  return (
    <AuditTimeline
      className="max-w-xl"
      events={[
        { id: "evt-09", actor: "系统", actorType: "system", action: "任务执行失败", target: "run-28003", at: "2026-09-21 10:31", level: "critical", detail: "计算资源超时（exit 124）· 任务已进入需重试" },
        { id: "evt-08", actor: "张三", action: "修改了成员权限", target: "王五 → 可执行", at: "2026-09-21 09:12", level: "warning", detail: "可见 → 可执行 · 已通知本人" },
      ]}
    />
  );
}

function AuditTimelineBusiness() {
  const [filter, setFilter] = useState<AuditFilter>("all");
  const [more, setMore] = useState<"idle" | "loading" | "done">("idle");
  const events: AuditEvent[] = [
    { id: "evt-13", actor: "系统", actorType: "system", action: "任务执行失败", target: "run-28003", at: "2026-09-21 10:31", level: "critical", detail: "计算资源超时（exit 124）" },
    { id: "evt-12", actor: "李四", action: "确认执行", target: "run-28003", at: "2026-09-21 10:24", level: "warning", detail: "确认面板回显：project-042 · 预计 300 秒" },
    { id: "evt-11", actor: "系统", actorType: "system", action: "任务创建", target: "run-28003", at: "2026-09-21 10:24" },
    { id: "evt-10", actor: "电导率优化 Agent", actorType: "agent", action: "推荐执行计划", target: "重新计算电导率", at: "2026-09-21 10:23" },
  ];
  const older: AuditEvent[] = [{ id: "evt-09", actor: "张三", action: "更新了数据集", target: "ds-118 · v3", at: "2026-09-21 09:58" }];
  return (
    <div className="demo-stack max-w-xl">
      <AuditTimeline
        events={more === "done" ? [...events, ...older] : events}
        filter={filter}
        onFilterChange={setFilter}
        onTargetClick={(event) => toast(`打开 ${event.target}`)}
        loadingMore={more === "loading"}
        onLoadMore={
          more === "idle"
            ? () => {
                setMore("loading");
                window.setTimeout(() => setMore("done"), 900);
              }
            : undefined
        }
      />
      {note("Agent 与系统同样是审计主体：谁在何时对什么做了什么，全部留痕、只增不改。")}
    </div>
  );
}

/* ---------------- ExperimentStep 实验步骤 ---------------- */

const baseNodes: ExperimentNode[] = [
  { id: "config", name: "参数配置", status: "done" },
  { id: "queue", name: "排队等待", status: "done" },
  { id: "run", name: "计算运行", status: "active", detail: "已运行 36s" },
  { id: "analyze", name: "结果分析", status: "pending" },
  { id: "archive", name: "归档完成", status: "pending" },
];

function ExperimentStepBasic() {
  return <ExperimentStep current="run" steps={baseNodes} />;
}

function ExperimentStepFailed() {
  const [runStatus, setRunStatus] = useState<"failed" | "active" | "done">("failed");
  const steps: ExperimentNode[] = baseNodes.map((node) => {
    if (node.id === "run") {
      return {
        ...node,
        status: runStatus,
        detail: runStatus === "failed" ? "计算资源超时（exit 124）" : runStatus === "active" ? "重试中 · 队列第 1 位" : "214s",
      };
    }
    if (node.id === "analyze" && runStatus === "done") return { ...node, status: "active" };
    return node;
  });
  return (
    <div className="demo-stack">
      <ExperimentStep
        steps={steps}
        onRetry={() => {
          setRunStatus("active");
          window.setTimeout(() => setRunStatus("done"), 1400);
        }}
      />
      {runStatus === "done" && (
        <Button variant="ghost" size="sm" className="justify-self-start" onClick={() => setRunStatus("failed")}>
          重置演示
        </Button>
      )}
    </div>
  );
}

function ExperimentStepBusiness() {
  const nodes = [
    { id: "config", name: "配方生成", detail: "8 个候选" },
    { id: "validate", name: "数据校验", detail: "128 条通过" },
    { id: "compute", name: "电导率计算", detail: "run-28003 · 214s" },
    { id: "analyze", name: "结果分析", detail: "最优 8.7 mS/cm" },
    { id: "report", name: "报告归档", detail: "report-091" },
  ];
  const [current, setCurrent] = useState(3);
  const steps: ExperimentNode[] = nodes.map((node, index) => ({
    id: node.id,
    name: node.name,
    status: index < current ? "done" : index === current ? "active" : "pending",
    detail: index < current ? node.detail : undefined,
  }));
  return (
    <div className="demo-stack">
      <ExperimentStep title="第 3 轮优化" steps={steps} onOpenArtifact={(id) => toast(`查看 round-03 / ${id} 的产物`)} />
      <div className="demo-row">
        <Button variant="secondary" size="sm" disabled={current >= nodes.length} onClick={() => setCurrent((v) => Math.min(v + 1, nodes.length))}>
          推进演示
        </Button>
        <Button variant="ghost" size="sm" onClick={() => setCurrent(0)}>
          重置
        </Button>
      </div>
      {note("点击已完成节点查看该节点产物（日志、结果、报告）。")}
    </div>
  );
}

/* ---------------- DataQualityNotice 数据质量提示 ---------------- */

function DataQualityBasic() {
  return (
    <DataQualityNotice
      className="max-w-xl"
      issues={[
        { id: "q1", type: "missing", level: "warning", description: "12 条记录缺少温度字段", affected: "batch-07" },
        { id: "q2", type: "conflict", level: "blocking", description: "3 条记录与 v2 版本电导率冲突", affected: "batch-07" },
        { id: "q3", type: "unreliable-source", level: "warning", description: "外部来源 example.com 近 90 天未更新", affected: "src-055" },
        { id: "q4", type: "needs-review", level: "warning", description: "8 条 Agent 生成记录待人工确认", affected: "batch-07" },
      ]}
    />
  );
}

function useIssues(initial: QualityIssue[]) {
  const [issues, setIssues] = useState(initial);
  const resolve = (id: string, action: string) => {
    if (action === "view-conflict") {
      toast("打开冲突对比");
      return;
    }
    setIssues((list) =>
      list.map((issue) =>
        issue.id === id ? { ...issue, resolved: true, resolution: `${issue.description} → 已由张三处理（${action === "use-latest" ? "以 v3 为准" : action === "confirm" ? "标记已确认" : action === "supplement" ? "已补充" : "忽略本次"}）` } : issue,
      ),
    );
  };
  return { issues, resolve, reset: () => setIssues(initial) };
}

function DataQualityActionable() {
  const { issues, resolve, reset } = useIssues([
    {
      id: "q2",
      type: "conflict",
      level: "blocking",
      description: "3 条记录与 v2 版本电导率冲突",
      affected: "batch-07",
      actions: [
        { label: "查看冲突", action: "view-conflict" },
        { label: "以 v3 为准", action: "use-latest" },
      ],
    },
  ]);
  const blocked = hasBlockingIssues(issues);
  return (
    <div className="demo-stack max-w-xl">
      <DataQualityNotice issues={issues} onResolve={resolve} />
      <div className="flex flex-wrap items-center gap-3">
        <Button disabled={blocked} aria-describedby={blocked ? "dq-block-hint" : undefined}>
          提交计算
        </Button>
        {blocked ? (
          <span id="dq-block-hint" className="text-sm text-danger">
            存在 1 条阻断级问题，处理后才能提交
          </span>
        ) : (
          <Button variant="ghost" size="sm" onClick={reset}>
            重置演示
          </Button>
        )}
      </div>
    </div>
  );
}

function DataQualityBusiness() {
  const { issues, resolve } = useIssues([
    {
      id: "q1",
      type: "conflict",
      level: "blocking",
      description: "3 条记录与 v2 版本电导率冲突",
      affected: "batch-07",
      actions: [
        { label: "查看冲突", action: "view-conflict" },
        { label: "以 v3 为准", action: "use-latest" },
      ],
    },
    { id: "q2", type: "missing", level: "warning", description: "12 条记录缺少温度字段", affected: "batch-07" },
    { id: "q3", type: "needs-review", level: "warning", description: "8 条 Agent 生成记录待人工确认", affected: "batch-07" },
  ]);
  const blocking = issues.filter((i) => i.level === "blocking" && !i.resolved).length;
  const open = issues.filter((i) => !i.resolved).length;
  return (
    <Card className="grid max-w-xl gap-3 p-4">
      <DataQualityNotice
        title="ds-118 · batch-07 导入检查"
        summary={`共 128 条记录 · 待处理 ${open} 个问题${blocking ? `（${blocking} 条阻断）` : ""}`}
        issues={issues}
        onResolve={resolve}
        onDownloadReport={() => toast("已导出质量报告 CSV")}
      />
      <Button className="justify-self-end" disabled={blocking > 0}>
        {blocking ? "继续导入（存在阻断）" : "继续导入"}
      </Button>
    </Card>
  );
}

/* ---------------- ToolRunCard 工具运行卡片 ---------------- */

function ToolRunCardBasic() {
  return (
    <ToolRunCard
      className="max-w-lg"
      tool="conductivity-optimize"
      status="succeeded"
      duration={1240}
      paramsSummary="round=3 · target=9.0 mS/cm · budget=300s"
      input="ds-118 · v3 · 128 条"
      output="8 个候选配方 · 最优 8.7 mS/cm"
    />
  );
}

function ToolRunCardStates() {
  const [startedAt] = useState(() => Date.now() - 36_000);
  const [retries, setRetries] = useState(0);
  return (
    <div className="grid max-w-lg gap-3">
      <ToolRunCard tool="conductivity-optimize" status="running" startedAt={startedAt} paramsSummary="round=4 · target=9.2 mS/cm · budget=300s" />
      <ToolRunCard
        tool="fetch-external-data"
        status="failed"
        duration={10000}
        paramsSummary="source=example.com · timeout=10s"
        error="连接 example.com 超时（10s）"
        details="TimeoutError: upstream did not respond within 10000ms (attempt 1/1)"
        onRetry={() => {
          setRetries((n) => n + 1);
          toast("已发起重试，生成新的调用记录");
        }}
      />
      {retries > 0 && note(`已重试 ${retries} 次：每次重试生成新的调用卡片，不覆盖旧记录。`)}
    </div>
  );
}

function ToolRunCardBusiness() {
  return (
    <ToolRunCard
      className="max-w-lg"
      tool="conductivity-optimize"
      status="succeeded"
      duration={214000}
      paramsSummary="round=3 · target=9.0 mS/cm · budget=300s"
      input="ds-118 · v3 · 128 条"
      output="8 个候选配方 · 最优 8.7 mS/cm"
      params={{ round: 3, target_mS_cm: 9.0, budget_s: 300, dataset: "ds-118@v3", seed: 42 }}
    />
  );
}

export const datacorePreviews: Record<string, PreviewFn> = {
  "citation/basic": CitationBasic,
  "citation/locate": CitationLocate,
  "citation/unavailable": CitationUnavailable,
  "citation/business": CitationBusiness,
  "source-card/basic": SourceCardBasic,
  "source-card/access": SourceCardAccess,
  "source-card/business": SourceCardBusiness,
  "agent-activity/basic": AgentActivityBasic,
  "agent-activity/waiting": AgentActivityWaiting,
  "agent-activity/failed": AgentActivityFailed,
  "agent-activity/business": AgentActivityBusiness,
  "run-status/basic": RunStatusBasic,
  "run-status/detail": RunStatusDetail,
  "run-status/flow": RunStatusFlow,
  "run-status/business": RunStatusBusiness,
  "confirm-panel/basic": ConfirmPanelBasic,
  "confirm-panel/danger": ConfirmPanelDanger,
  "confirm-panel/business": ConfirmPanelBusiness,
  "project-selector/basic": ProjectSelectorBasic,
  "project-selector/limited": ProjectSelectorLimited,
  "project-selector/business": ProjectSelectorBusiness,
  "dataset-picker/basic": DatasetPickerBasic,
  "dataset-picker/multi": DatasetPickerMulti,
  "dataset-picker/empty": DatasetPickerEmpty,
  "dataset-picker/business": DatasetPickerBusiness,
  "permission-scope/basic": PermissionScopeBasic,
  "permission-scope/matrix": PermissionScopeMatrix,
  "permission-scope/business": PermissionScopeBusiness,
  "audit-timeline/basic": AuditTimelineBasic,
  "audit-timeline/incident": AuditTimelineIncident,
  "audit-timeline/business": AuditTimelineBusiness,
  "experiment-step/basic": ExperimentStepBasic,
  "experiment-step/failed": ExperimentStepFailed,
  "experiment-step/business": ExperimentStepBusiness,
  "data-quality-notice/basic": DataQualityBasic,
  "data-quality-notice/actionable": DataQualityActionable,
  "data-quality-notice/business": DataQualityBusiness,
  "tool-run-card/basic": ToolRunCardBasic,
  "tool-run-card/states": ToolRunCardStates,
  "tool-run-card/business": ToolRunCardBusiness,
};
