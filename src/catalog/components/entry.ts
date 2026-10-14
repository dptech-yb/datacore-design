import type { ComponentDoc } from "../types";

/**
 * 数据录入组件。Form / Upload / FilterBar 是本类的重点：
 * 错误就近、原始文件保留、常用筛选外露是平台级约定。
 */
export const entryComponents: ComponentDoc[] = [
  {
    id: "input",
    name: "Input",
    chineseName: "输入框",
    category: "entry",
    status: "stable",
    version: "0.1.0",
    purpose: "收集单行短文本，是表单里最基础的信息录入单元。",
    usage:
      "用于名称、编号、简短标识等单行文本。多行内容用 Textarea；纯数值用 NumberInput；从有限选项中选值用 Select；即时过滤查找用 SearchField。",
    keywords: ["input", "text", "输入框", "单行文本", "录入"],
    examples: [
      {
        id: "basic",
        title: "基础示例",
        kind: "basic",
        description: "标签常驻在控件上方；固定前缀用 prefix，不让用户手输。",
        code: `import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

<div className="grid gap-1.5">
  <Label htmlFor="project-name">项目名称</Label>
  <Input id="project-name" placeholder="例如：高导电解液筛选" />
</div>
<div className="grid gap-1.5">
  <Label htmlFor="sample-no">样本编号</Label>
  {/* 固定前缀不参与输入值：绝对定位在框内，Input 左侧留出空间 */}
  <div className="relative">
    <span aria-hidden="true" className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground">
      SMP-
    </span>
    <Input id="sample-no" className="pl-12" placeholder="00042" />
  </div>
</div>`,
        preview: "input/basic",
      },
      {
        id: "sizes",
        title: "尺寸示例",
        kind: "size",
        description: "sm 用于筛选栏和表格行内，md 是默认尺寸，lg 仅用于独立录入页。",
        code: `import { Input } from "@/components/ui/input";

{/* 默认 h-8；sm / lg 用 className 覆盖高度与字号 */}
<Input className="h-7 text-sm" placeholder="sm · 筛选栏与行内" />
<Input placeholder="md · 默认尺寸" />
<Input className="h-10 text-md" placeholder="lg · 页面级录入" />`,
        preview: "input/sizes",
      },
      {
        id: "states",
        title: "状态示例",
        kind: "state",
        description: "disabled 必须在上下文中给出原因；error 就近显示在字段下方。",
        code: `import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

<div className="grid gap-1.5">
  <Label htmlFor="owner-project">所属项目</Label>
  <Input id="owner-project" value="示例项目（project-042）" disabled readOnly aria-describedby="owner-project-help" />
  <p id="owner-project-help" className="text-xs text-muted-foreground">项目归档后不可修改归属。</p>
</div>
<div className="grid gap-1.5">
  <Label htmlFor="task-name">任务名称</Label>
  <Input
    id="task-name"
    defaultValue="第 3 轮/优化"
    aria-invalid="true"
    aria-describedby="task-name-error"
    className="border-danger focus-visible:border-danger focus-visible:ring-danger/20"
  />
  <p id="task-name-error" role="alert" className="text-xs text-danger">
    名称不能包含 / \\ : 字符。
  </p>
</div>`,
        preview: "input/states",
      },
      {
        id: "business",
        title: "真实业务示例",
        kind: "business",
        description: "项目重命名：辅助文本写清约束与用途，字数接近上限时给出计数。",
        code: `import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const [name, setName] = useState("示例项目（project-042）");

<div className="grid gap-1.5">
  <Label htmlFor="project-name">项目名称</Label>
  <Input
    id="project-name"
    value={name}
    maxLength={40}
    onChange={(event) => setName(event.target.value)}
    aria-describedby="project-name-help"
  />
  <p id="project-name-help" className="text-xs text-muted-foreground">
    名称用于列表展示与导出文件命名，2–40 个字符，项目内唯一。当前 {name.length}/40。
  </p>
</div>`,
        preview: "input/business",
      },
    ],
    props: [
      { name: "value / defaultValue", type: "string", description: "受控 / 非受控值；受控时必须配合 onChange，禁止半受控。" },
      { name: "onChange", type: "React.ChangeEventHandler<HTMLInputElement>", description: "原生变化事件，取值用 event.target.value。" },
      { name: "id", type: "string", description: "与 <Label htmlFor> 一致，关联可见标签。" },
      { name: "placeholder", type: "string", description: "只写格式示例，不替代标签。" },
      { name: "maxLength", type: "number", description: "原生最大字符数；接近上限时在辅助文本给出计数。" },
      { name: "disabled / readOnly", type: "boolean", default: "false", description: "禁用或只读；原因写在 aria-describedby 关联的辅助文本里。" },
      { name: "aria-invalid / aria-describedby", type: "boolean | string", description: "出错时 aria-invalid，并指向错误文本 id；错误红边用 className=\"border-danger focus-visible:border-danger focus-visible:ring-danger/20\"。" },
      { name: "className", type: "string", description: "默认 h-8；sm 用 \"h-7 text-sm\"，lg 用 \"h-10 text-md\"。其余原生 input 属性与 ref 透传。" },
      { name: "前缀", type: "组合", description: "无 prefix：relative 容器 + 绝对定位 <span aria-hidden> 前缀，Input 加 pl-12 留位，前缀不参与输入值。" },
      { name: "清除按钮", type: "组合", description: "无 allowClear：有值时在右侧放 ghost 图标按钮，点击清空并通过 ref 把焦点还给输入框。" },
    ],
    states: [
      { name: "default", note: "显示当前值或占位文本；占位文本只用浅灰示意格式。" },
      { name: "hover", note: "边框颜色加深或变为品牌色，不改变高度与宽度。" },
      { name: "focus-visible", note: "品牌色边框 + 3px 外发光，Tab 可达，不得用 outline: none 移除。" },
      { name: "pressed", note: "不适用：文本输入没有按下态。", applicable: false },
      { name: "disabled", note: "灰底 + not-allowed 光标；禁用原因就近写在辅助文本里。" },
      { name: "loading", note: "不适用：输入框无加载态；提交等待由 Form 的提交按钮承担。", applicable: false },
      { name: "empty", note: "未填写时显示 placeholder；必填空值在失焦或提交时校验。" },
      { name: "error", note: "红色边框 + aria-invalid=\"true\"，错误文案紧随控件并以 role=\"alert\" 播报。" },
      { name: "permission-limited", note: "无编辑权限时渲染为 disabled 并注明所需角色，而不是隐藏字段。" },
      { name: "mobile", note: "触控高度 ≥40px；按内容类型唤起对应键盘（text / email / number）。" },
      { name: "dark-mode", note: "使用语义令牌自动适配，不单独覆盖颜色。" },
    ],
    interaction: [
      "失焦校验格式类规则（长度、字符集），提交时校验业务规则（重名、权限）。",
      "清除按钮只在有值时出现，点击后焦点回到输入框。",
      "粘贴内容同样触发校验，不允许绕过 maxLength。",
      "受控使用时 onChange 必须同步更新 value，禁止半受控。",
    ],
    keyboard: [
      "Tab 进入 / 离开，焦点顺序与视觉顺序一致。",
      "方向键移动光标；Enter 在单行输入框内默认触发所在 Form 的提交。",
    ],
    accessibility: [
      "必须用 <label htmlFor> 或 aria-label 关联标签，禁止只用 placeholder 当标签。",
      "错误状态设置 aria-invalid=\"true\"，错误文案 id 通过 aria-describedby 关联。",
      "maxLength 的计数提示通过 aria-describedby 关联。",
      "纯装饰的前缀图标设 aria-hidden=\"true\"。",
    ],
    responsive: [
      "移动端最小高度 40px，整行可点。",
      "窄屏下输入框占满容器宽度，前后缀不折行。",
    ],
    content: [
      "placeholder 写格式示例（例如：run-28003），不写指令（请输入名称）。",
      "标签用名词短语：项目名称、样本编号。",
      "错误文案说清怎么改：名称不能包含 / \\ : 字符，而不是“输入非法”。",
    ],
    dos: [
      "始终配可见标签，辅助说明放控件下方。",
      "校验反馈就近展示在出错字段下方。",
      "固定前缀（如 SMP-）用 prefix，不让用户手输。",
    ],
    donts: [
      "不要用 placeholder 代替标签。",
      "不要静默截断超长输入而不给计数提示。",
      "不要用输入框收集多行文本（用 Textarea）。",
      "不要只变灰禁用而不解释原因。",
    ],
    related: ["textarea", "input-number", "search-field", "form"],
  },
  {
    id: "input-number",
    name: "NumberInput",
    chineseName: "数字输入框",
    category: "entry",
    status: "stable",
    version: "0.1.0",
    purpose: "录入带范围、步长和精度约束的数值，把非法数字拦在输入阶段。",
    usage:
      "用于质量、浓度、温度、循环次数等数值字段。展示用数字不要用它（用 Statistic）；编号即使全是数字也用 Input，避免丢失前导零。",
    keywords: ["input-number", "number-input", "NumberInput", "number", "数字输入", "数值", "步进", "精度"],
    examples: [
      {
        id: "basic",
        title: "基础示例",
        kind: "basic",
        description: "min / max / step 约束输入，步进按钮与方向键等价。",
        code: `import { Label } from "@/components/ui/label";
import { NumberInput } from "@/components/ui/number-input";

const [value, setValue] = useState<number | null>(1.5);

<div className="grid gap-1.5">
  <Label htmlFor="additive-conc">添加剂浓度（%）</Label>
  <NumberInput
    id="additive-conc"
    value={value}
    onValueChange={setValue}
    min={0}
    max={100}
    step={0.1}
    precision={1}
  />
</div>`,
        preview: "input-number/basic",
      },
      {
        id: "precision-unit",
        title: "精度与单位",
        kind: "variant",
        description: "precision 控制小数位，unit 展示在控件内右侧，不参与提交值。",
        code: `import { NumberInput } from "@/components/ui/number-input";

<NumberInput aria-label="称量质量" defaultValue={12.4} precision={2} unit="mg" min={0} max={500} step={0.1} />
<NumberInput aria-label="循环次数" defaultValue={200} precision={0} unit="次" min={1} max={2000} step={10} />`,
        preview: "input-number/precision-unit",
      },
      {
        id: "business",
        title: "真实业务示例",
        kind: "business",
        description: "称量质量录入：精度与天平一致，范围与量程一致；必填未填时 invalid 标红并就近报错。",
        code: `import { Label } from "@/components/ui/label";
import { NumberInput } from "@/components/ui/number-input";

const [mass, setMass] = useState<number | null>(12.4);
const missing = mass === null;

<div className="grid gap-1.5">
  <Label htmlFor="sample-mass">称量质量</Label>
  <NumberInput
    id="sample-mass"
    value={mass}
    onValueChange={setMass}
    min={0}
    max={500}
    step={0.01}
    precision={2}
    unit="mg"
    invalid={missing}
    aria-describedby="sample-mass-help"
  />
  {missing ? (
    <p id="sample-mass-help" role="alert" className="text-xs text-danger">请填写称量质量，允许 0–500 mg。</p>
  ) : (
    <p id="sample-mass-help" className="text-xs text-muted-foreground">
      精度与天平一致（0.01 mg），量程 0–500 mg；留空表示未称量，不等于 0。
    </p>
  )}
</div>`,
        preview: "input-number/business",
      },
    ],
    props: [
      { name: "value", type: "number | null", description: "受控值；null 表示未填写，不强制为 0。" },
      { name: "defaultValue", type: "number | null", default: "null", description: "非受控初始值。" },
      { name: "onValueChange", type: "(value: number | null) => void", description: "提交后的值变化：失焦、Enter、步进时触发；清空回传 null。" },
      { name: "min / max", type: "number", description: "上下限；越界输入实时标红，失焦时收敛到边界；到达边界时对应步进按钮禁用。" },
      { name: "step", type: "number", default: "1", description: "步进按钮与 ↑ / ↓ 方向键的步长。" },
      { name: "precision", type: "number", description: "小数位数，展示与提交都按此四舍五入；0 时唤起纯数字键盘。" },
      { name: "unit", type: "ReactNode", description: "单位后缀，展示在控件内右侧，不参与值。" },
      { name: "invalid", type: "boolean", default: "false", description: "外部校验失败（如必填未填）时标红；越界会自动标红，无需传入。" },
      { name: "hideSteppers", type: "boolean", default: "false", description: "隐藏 − / + 按钮，只保留方向键步进（表格行内等紧凑场景）。" },
      { name: "disabled / readOnly", type: "boolean", default: "false", description: "禁用整体变灰；只读时隐藏步进按钮。" },
      { name: "wrapperClassName", type: "string", description: "外层容器样式（宽度等）；className 作用于内部 input。" },
    ],
    states: [
      { name: "default", note: "显示格式化后的值与单位；null 时显示占位。" },
      { name: "hover", note: "步进按钮悬停时背景变为 accent。" },
      { name: "focus-visible", note: "整个控件（含单位与步进按钮）显示 ring 边框与外发光；Tab 只停在输入框，步进按钮不进 Tab 序列（方向键等价）。" },
      { name: "pressed", note: "步进按钮按下即增减一步；到达 min / max 时对应按钮禁用。" },
      { name: "disabled", note: "整体半透明 + not-allowed，步进按钮同步禁用；只读（readOnly）时隐藏步进按钮。原因就近说明。" },
      { name: "loading", note: "不适用：数字输入无加载态；提交等待由 Form 承担。", applicable: false },
      { name: "empty", note: "null 显示占位文本；空值不自动补 0，由校验决定是否必填。" },
      { name: "error", note: "输入越界时自动红色边框并设 aria-invalid；必填未填等外部校验用 invalid 属性 + 就近文案。" },
      { name: "permission-limited", note: "无权限时只读展示值与单位，不渲染为可编辑控件。" },
      { name: "mobile", note: "唤起数字键盘（inputMode=\"decimal\"，precision=0 时为 numeric）；触控场景用 wrapperClassName=\"h-10\" 加大控件与步进按钮。" },
      { name: "dark-mode", note: "使用语义令牌自动适配，不单独覆盖颜色。" },
    ],
    interaction: [
      "非法字符直接忽略；越界时实时标红，失焦或 Enter 时按 min / max / precision 收敛。",
      "上下方向键与步进按钮完全等价。",
      "单位只展示不进值，提交始终是纯数字。",
      "清空后为 null，不自动补 0；“未填”与“填 0”语义不同。",
    ],
    keyboard: [
      "Tab 聚焦；↑ / ↓ 按 step 增减（不超出 min / max）；Enter 立即提交。",
      "输入非法字符被忽略；Esc 放弃本次编辑并还原为进入前的值。",
    ],
    accessibility: [
      "使用 role=\"spinbutton\" 语义，同步 aria-valuemin / aria-valuemax / aria-valuenow。",
      "步进按钮提供 aria-label（增加 / 减少）；unit 为字符串时写入 aria-valuetext（如“12.40 mg”）。",
      "错误时 aria-invalid=\"true\"，错误文案 role=\"alert\" 并经 aria-describedby 关联。",
    ],
    responsive: [
      "移动端唤起数字键盘，输入框全宽。",
      "窄屏下单位内联显示，不与输入值折行分离。",
    ],
    content: [
      "单位写在 unit 里，不写进占位；标签可补充单位便于读屏。",
      "错误文案给出允许范围：允许 0–500 mg。",
      "辅助文本写明精度依据：与天平精度一致（0.01 mg）。",
    ],
    dos: [
      "数值字段用 NumberInput 而不是 Input。",
      "标明范围与单位，精度与仪器一致。",
      "用 null 表达“未填”，不用 0 占位。",
    ],
    donts: [
      "不要把编号当数字录入（前导零会丢失）。",
      "不要只靠失焦收敛而不说明范围——辅助文本写明允许范围。",
      "不要把单位拼进提交值。",
      "不要默认填 0 代替“未填写”。",
    ],
    related: ["input", "form", "statistic"],
  },
  {
    id: "textarea",
    name: "Textarea",
    chineseName: "多行文本框",
    category: "entry",
    status: "stable",
    version: "0.1.0",
    purpose: "收集多行、较长的自由文本，如实验备注、失败原因、方法描述。",
    usage:
      "用于超过一行的描述性内容。单行文本用 Input；结构化字段（日期、数值）用对应控件；代码 / JSON 片段的展示用 CodeBlock。",
    keywords: ["textarea", "多行文本", "备注", "描述", "长文本"],
    examples: [
      {
        id: "basic",
        title: "基础示例",
        kind: "basic",
        description: "默认三行可视高度，可拖拽调整；placeholder 引导写什么。",
        code: `import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

<div className="grid gap-1.5">
  <Label htmlFor="exp-note">实验备注</Label>
  <Textarea id="exp-note" rows={3} placeholder="记录实验现象、异常与处理" />
</div>`,
        preview: "textarea/basic",
      },
      {
        id: "count-autosize",
        title: "字数限制与自动高度",
        kind: "variant",
        description: "maxLength 加计数文字给出实时字数；高度随内容自动伸缩、超出封顶（field-sizing 或 min/max 高度）。",
        code: `import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const [reason, setReason] = useState("");
const nearLimit = reason.length > 450;

<div className="grid gap-1.5">
  <Label htmlFor="fail-reason">失败原因说明</Label>
  <div className="relative">
    {/* field-sizing: content 随内容伸缩，min/max 高度约等于 3–8 行 */}
    <Textarea
      id="fail-reason"
      maxLength={500}
      value={reason}
      onChange={(event) => setReason(event.target.value)}
      aria-describedby="fail-reason-count"
      className="max-h-[192px] min-h-[92px] resize-none pb-6 [field-sizing:content]"
    />
    <span
      id="fail-reason-count"
      className={cn("absolute bottom-1.5 right-2.5 text-xs", nearLimit ? "text-warning" : "text-muted-foreground")}
    >
      {reason.length}/500
    </span>
  </div>
</div>`,
        preview: "textarea/count-autosize",
      },
      {
        id: "business",
        title: "真实业务示例",
        kind: "business",
        description: "任务备注会进入审计记录并随报告导出，辅助文本必须说明这一后果。",
        code: `import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const [note, setNote] = useState("第 3 轮配方 D，充电末期温升偏高，已降倍率复测。");

<div className="grid gap-1.5">
  <Label htmlFor="run-note">实验备注（run-28003）</Label>
  <div className="relative">
    <Textarea
      id="run-note"
      rows={3}
      maxLength={500}
      value={note}
      onChange={(event) => setNote(event.target.value)}
      aria-describedby="run-note-count run-note-help"
      className="pb-6"
    />
    <span id="run-note-count" className="absolute bottom-1.5 right-2.5 text-xs text-muted-foreground">
      {note.length}/500
    </span>
  </div>
  <p id="run-note-help" className="text-xs text-muted-foreground">
    备注将进入审计记录，导出报告时一并携带，请客观描述事实。
  </p>
</div>`,
        preview: "textarea/business",
      },
    ],
    props: [
      { name: "value / defaultValue", type: "string", description: "受控 / 非受控值；受控时配合 onChange。" },
      { name: "onChange", type: "React.ChangeEventHandler<HTMLTextAreaElement>", description: "原生变化事件，取值用 event.target.value。" },
      { name: "rows", type: "number", description: "原生可视行数；未设置时最小高度 60px，推荐 rows={3}。" },
      { name: "maxLength", type: "number", description: "原生最大字符数，粘贴同样受限。" },
      { name: "placeholder", type: "string", description: "引导内容结构，不替代标签。" },
      { name: "id / aria-describedby / aria-invalid", type: "string | boolean", description: "id 关联 Label；aria-describedby 指向计数与辅助文本（可空格分隔多个）；出错时 aria-invalid。" },
      { name: "className", type: "string", description: "追加样式；其余原生 textarea 属性与 ref 透传。" },
      { name: "字数计数", type: "组合", description: "无 showCount：relative 容器 + 右下角绝对定位 <span id>{value.length}/上限</span>，Textarea 加 pb-6，接近上限切 text-warning。" },
      { name: "自动高度", type: "组合", description: "无 autoSize：className=\"[field-sizing:content] min-h-[92px] max-h-[192px] resize-none\"，在约 3–8 行之间伸缩并封顶。" },
    ],
    states: [
      { name: "default", note: "显示当前内容或占位文本，默认可视三行。" },
      { name: "hover", note: "边框颜色加深或变为品牌色。" },
      { name: "focus-visible", note: "品牌色边框 + 3px 外发光，Tab 可达。" },
      { name: "pressed", note: "不适用：多行文本框没有按下态。", applicable: false },
      { name: "disabled", note: "灰底 + not-allowed；只读审阅场景保持全文可滚动阅读。" },
      { name: "loading", note: "不适用：多行文本框无加载态；提交等待由 Form 承担。", applicable: false },
      { name: "empty", note: "未填写时显示 placeholder，引导内容结构（现象、异常、处理）。" },
      { name: "error", note: "超限或必填未填时红色边框 + 就近文案，aria-invalid=\"true\"。" },
      { name: "permission-limited", note: "无权限时只读展示全文，保留滚动，不渲染为可编辑控件。" },
      { name: "mobile", note: "最小三行可视高度；使用系统默认换行键盘。" },
      { name: "dark-mode", note: "使用语义令牌自动适配，不单独覆盖颜色。" },
    ],
    interaction: [
      "自动高度在最小 / 最大高度之间伸缩，超出出现内部滚动条。",
      "计数接近上限时变为警示色，超限禁止继续输入并红字提示。",
      "粘贴内容同样受 maxLength 约束，不静默丢弃。",
    ],
    keyboard: [
      "Enter 换行；Tab 离开控件（不插入制表符）。",
      "在 Form 中可配置 Cmd / Ctrl + Enter 提交。",
    ],
    accessibility: [
      "必须用 <label htmlFor> 或 aria-label 关联标签。",
      "计数通过 aria-describedby 关联，变化不频繁打断读屏。",
      "错误时 aria-invalid=\"true\"，错误文案 role=\"alert\" 就近播报。",
    ],
    responsive: [
      "宽度跟随容器，不固定像素宽。",
      "移动端保持三行可视高度，允许纵向扩高。",
    ],
    content: [
      "placeholder 引导写什么：记录实验现象、异常与处理。",
      "需要留痕的备注注明后果：将进入审计记录并随报告导出。",
      "错误文案给出剩余可输入字符数，而不是只说“超出限制”。",
    ],
    dos: [
      "超过一行的内容用 Textarea。",
      "需要留痕的备注在辅助文本里说明会进入审计。",
      "接近字数上限时给出计数反馈。",
    ],
    donts: [
      "不要用单行 Input 收集段落文本。",
      "不要自动高度无限增高不封顶。",
      "不要静默丢弃超限的粘贴内容。",
    ],
    related: ["input", "form", "code-block"],
  },
  {
    id: "select",
    name: "Select",
    chineseName: "选择器",
    category: "entry",
    status: "stable",
    version: "0.1.0",
    purpose: "从一组确定选项中选择单个或多个值，把自由录入变成受控选择。",
    usage:
      "选项已知且有限时使用（状态、类型、所属项目）。选项量大或允许创建新值用 Combobox；选项 ≤5 且需要一眼看全用 Radio；布尔设置用 Switch。",
    keywords: ["select", "dropdown", "选择器", "下拉选择", "单选", "多选"],
    examples: [
      {
        id: "basic",
        title: "基础示例",
        kind: "basic",
        description: "单选：点选即确认并关闭面板，已选值回显在触发器内。",
        code: `import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

<div className="grid gap-1.5">
  <Label htmlFor="task-status">任务状态</Label>
  <Select defaultValue="running">
    <SelectTrigger id="task-status">
      <SelectValue placeholder="选择状态" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="running">运行中</SelectItem>
      <SelectItem value="queued">排队中</SelectItem>
      <SelectItem value="finished">已完成</SelectItem>
    </SelectContent>
  </Select>
</div>`,
        preview: "select/basic",
      },
      {
        id: "multiple",
        title: "多选与可清空",
        kind: "variant",
        description: "多选已选值以 Badge 回显，提供“清空”按钮一键清空全部选择。",
        code: `import { useState } from "react";
import { ChevronDown, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

// Select 只支持单选；多选 = Popover + Checkbox 列表，已选值用 Badge 回显。
const tagOptions = [
  { value: "high-conductivity", label: "高导配方" },
  { value: "round-3", label: "第 3 轮" },
  { value: "to-review", label: "待复核" },
];
const [tags, setTags] = useState(["high-conductivity", "round-3"]);
const toggle = (v: string) => setTags((list) => (list.includes(v) ? list.filter((t) => t !== v) : [...list, v]));

<Label htmlFor="exp-tags">实验标签</Label>
<Popover>
  <PopoverTrigger asChild>
    <Button id="exp-tags" variant="secondary" className="w-full justify-between px-3 text-sm font-normal">
      {tags.length ? \`已选 \${tags.length} 项\` : "选择标签"}
      <ChevronDown className="opacity-50" />
    </Button>
  </PopoverTrigger>
  <PopoverContent align="start" className="w-[var(--radix-popover-trigger-width)] p-1">
    {tagOptions.map((option) => (
      <div key={option.value} className="flex items-center gap-2 rounded-sm px-2 py-1.5 hover:bg-accent">
        <Checkbox id={\`tag-\${option.value}\`} checked={tags.includes(option.value)} onCheckedChange={() => toggle(option.value)} />
        <Label htmlFor={\`tag-\${option.value}\`} className="flex-1 font-normal">{option.label}</Label>
      </div>
    ))}
  </PopoverContent>
</Popover>
<div className="flex flex-wrap items-center gap-1.5">
  {tags.map((v) => (
    <Badge key={v} tone="primary" className="pr-0.5">
      {tagOptions.find((o) => o.value === v)?.label}
      <Button variant="ghost" size="icon" aria-label="移除标签" onClick={() => toggle(v)} className="size-4 text-primary [&_svg]:size-3">
        <X />
      </Button>
    </Badge>
  ))}
  {tags.length > 0 && <Button variant="ghost" size="sm" onClick={() => setTags([])}>清空</Button>}
</div>`,
        preview: "select/multiple",
      },
      {
        id: "business",
        title: "真实业务示例",
        kind: "business",
        description: "选择数据集：选项超过 8 个时开启搜索，无匹配时给出空态。",
        code: `import { useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

// Select 不带搜索；可搜索的单选 = Popover + Input + 选项列表，无匹配给出空态。
const datasets = [
  { value: "ds-118", label: "电导率筛选第 3 轮" },
  { value: "ds-120", label: "热稳定性复测" },
  { value: "ds-121", label: "空白对照组" },
];
const [open, setOpen] = useState(false);
const [value, setValue] = useState("ds-118");
const [keyword, setKeyword] = useState("");
const matched = datasets.filter((d) => d.label.includes(keyword) || d.value.includes(keyword));
const selected = datasets.find((d) => d.value === value);

<Label htmlFor="dataset">输入数据集</Label>
<Popover open={open} onOpenChange={setOpen}>
  <PopoverTrigger asChild>
    <Button id="dataset" variant="secondary" role="combobox" aria-expanded={open} className="w-full justify-between px-3 text-sm font-normal">
      {selected ? \`\${selected.label}（\${selected.value}）\` : "选择数据集"}
      <ChevronDown className="opacity-50" />
    </Button>
  </PopoverTrigger>
  <PopoverContent align="start" className="w-[var(--radix-popover-trigger-width)] p-1">
    <Input aria-label="搜索数据集" placeholder="搜索数据集名称或编号" value={keyword} onChange={(e) => setKeyword(e.target.value)} className="mb-1" />
    <div role="listbox" aria-label="数据集">
      {matched.length > 0 ? (
        matched.map((d) => (
          <Button
            key={d.value}
            role="option"
            aria-selected={d.value === value}
            variant="ghost"
            size="sm"
            className="w-full justify-between px-2 font-normal"
            onClick={() => { setValue(d.value); setOpen(false); setKeyword(""); }}
          >
            <span className="flex items-center gap-2">
              <Check className={cn(d.value === value ? "opacity-100" : "opacity-0")} />
              {d.label}
            </span>
            <span className="font-mono text-xs text-muted-foreground">{d.value}</span>
          </Button>
        ))
      ) : (
        <p className="py-5 text-center text-sm text-muted-foreground">没有匹配的数据集</p>
      )}
    </div>
  </PopoverContent>
</Popover>`,
        preview: "select/business",
      },
    ],
    props: [
      { name: "Select.value / defaultValue", type: "string", description: "受控 / 非受控选中值，只支持单个 string；受控置为 \"\" 时回到 placeholder（SelectItem 的 value 不能为空串）。" },
      { name: "Select.onValueChange", type: "(value: string) => void", description: "选中变化回调，选中即关闭面板。" },
      { name: "Select.open / onOpenChange", type: "boolean / (open: boolean) => void", description: "可选的受控展开状态。" },
      { name: "Select.disabled / required / name", type: "boolean / boolean / string", description: "禁用整个选择器；required、name 用于原生表单提交。" },
      { name: "SelectTrigger", type: "id, className, aria-invalid", description: "触发器（h-8 w-full）；id 供 Label htmlFor 关联，出错时加 aria-invalid 与 border-danger。" },
      { name: "SelectValue.placeholder", type: "ReactNode", description: "未选时的占位，写选择对象（选择状态），不写“请选择”。" },
      { name: "SelectContent.position", type: '"popper" | "item-aligned"', default: '"popper"', description: "本库默认 popper：贴在触发器下方，宽度不小于触发器；接受 side、align、className。" },
      { name: "SelectItem", type: "value: string; disabled?: boolean", required: true, description: "选项；value 必填且唯一，选中项右侧显示对勾；禁用原因写进选项文字。" },
      { name: "SelectGroup / SelectLabel / SelectSeparator", type: "部件", description: "选项分组、组标题与组间分隔线。" },
      { name: "多选", type: "组合", description: "Select 只支持单选：Popover + Checkbox 列表，已选值用 Badge 回显并可单个移除（见“多选与可清空”示例）。" },
      { name: "搜索", type: "组合", description: "Select 不带搜索：Popover + Input + role=\"listbox\" 选项列表，无匹配给出空态（见真实业务示例）；选项可创建时用 Combobox。" },
    ],
    states: [
      { name: "default", note: "显示已选值 label 或占位文本。" },
      { name: "hover", note: "触发器边框变为品牌色。" },
      { name: "focus-visible", note: "触发器 3px 外发光；面板打开时焦点落在搜索框或当前选项。" },
      { name: "pressed", note: "点选瞬间选项背景高亮，时长 < 120ms。" },
      { name: "disabled", note: "灰底 + not-allowed，不展开面板；原因就近说明。" },
      { name: "loading", note: "选项异步加载时，面板内显示“正在加载”占位。" },
      { name: "empty", note: "选项为空或搜索无匹配时显示空态文案与下一步引导。" },
      { name: "error", note: "必选未选在提交时报错，红色边框 + 就近文案，aria-invalid=\"true\"。" },
      { name: "permission-limited", note: "无权限的选项显示但禁用并注明；整个控件无权限时只读。" },
      { name: "mobile", note: "面板高度 ≤60vh，选项触控高度 ≥40px。" },
      { name: "dark-mode", note: "使用语义令牌自动适配，不单独覆盖颜色。" },
    ],
    interaction: [
      "单选点选即确认并关闭面板；多选保持面板打开，已选以 Tag 回显。",
      "搜索输入即时过滤，大小写不敏感。",
      "失焦或 Esc 关闭面板，不改变已选值。",
      "禁用选项不可点，原因前置写在选项上，而不是选中后才报错。",
    ],
    keyboard: [
      "↓ 打开面板，↑ / ↓ 移动高亮，Enter 选中。",
      "Esc 关闭面板并保留已选；多选时 Space 切换勾选。",
    ],
    accessibility: [
      "触发器使用 role=\"combobox\" 并同步 aria-expanded。",
      "选项列表 role=\"listbox\"，选项 role=\"option\" 并同步 aria-selected。",
      "多选已选 Tag 的移除按钮提供 aria-label（移除：运行中）。",
      "空态文案对读屏可读，不只依赖视觉。",
    ],
    responsive: [
      "面板宽度跟随触发器，长 label 省略号截断。",
      "移动端选项触控高度 ≥40px，面板不超过 60vh。",
    ],
    content: [
      "占位写“选择状态”，不写“请选择”。",
      "选项用名词短语，不带句号，不超过一行。",
      "空态区分“暂无数据”与“无匹配结果”。",
    ],
    dos: [
      "选项有限且确定时用 Select。",
      "选项超过 8 个时开启搜索。",
      "多选用 Tag 回显已选，可单个移除。",
    ],
    donts: [
      "不要用下拉藏 2–3 个选项（用 Radio 或 Segmented）。",
      "不要在选项里放长句或说明段落。",
      "不要等用户选中后才告知选项不可用——禁用时前置说明。",
    ],
    related: ["combobox", "radio", "dropdown", "form", "tag"],
  },
  {
    id: "combobox",
    name: "Combobox",
    chineseName: "组合框",
    category: "entry",
    status: "experimental",
    version: "0.1.0",
    purpose: "在可搜索的选项列表中既可选择已有值，也允许输入并创建新值。",
    usage:
      "选项量大或允许用户扩展时使用：试剂名称、仪器编号、标签。选项固定且少时用 Select；纯自由文本用 Input。",
    keywords: ["combobox", "autocomplete", "自动完成", "可创建", "搜索选择"],
    examples: [
      {
        id: "basic",
        title: "基础示例",
        kind: "basic",
        description: "输入即时过滤选项，名称与副信息（缩写）都参与匹配。",
        code: `import { Combobox } from "@/components/ui/combobox";
import { Label } from "@/components/ui/label";

const [value, setValue] = useState<string | null>(null);

<div className="grid gap-1.5">
  <Label htmlFor="solvent">溶剂</Label>
  <Combobox
    id="solvent"
    value={value}
    onValueChange={setValue}
    placeholder="选择溶剂"
    searchPlaceholder="搜索试剂名称或缩写"
    emptyText="没有匹配的试剂"
    options={[
      { value: "ec", label: "碳酸乙烯酯", description: "EC" },
      { value: "dmc", label: "碳酸二甲酯", description: "DMC" },
      { value: "emc", label: "碳酸甲乙酯", description: "EMC" },
      { value: "pc", label: "碳酸丙烯酯", description: "PC" },
    ]}
  />
</div>`,
        preview: "combobox/basic",
      },
      {
        id: "allow-create",
        title: "多选与创建新值",
        kind: "variant",
        description: "multiple 多选以 Badge 回显；传 onCreate 后，无完全匹配时首项为“创建：输入值”，创建即选中。",
        code: `import { Combobox, type ComboboxOption } from "@/components/ui/combobox";

const [options, setOptions] = useState<ComboboxOption[]>(tagOptions);
const [value, setValue] = useState<string[]>(["round-3"]);

<Combobox
  multiple
  aria-label="实验标签"
  options={options}
  value={value}
  onValueChange={setValue}
  placeholder="选择或创建标签"
  searchPlaceholder="搜索或输入新标签"
  onCreate={(name) => {
    const tag = { value: \`tag-\${options.length + 1}\`, label: name };
    setOptions((list) => [...list, tag]);
    setValue((list) => [...list, tag.value]);
  }}
/>`,
        preview: "combobox/allow-create",
      },
      {
        id: "business",
        title: "真实业务示例",
        kind: "business",
        description: "选择仪器：选项带可用状态，维护中的仪器禁用并注明原因。",
        code: `import { Combobox } from "@/components/ui/combobox";

<Combobox
  aria-label="预约仪器"
  defaultValue="ins-07"
  placeholder="选择仪器"
  searchPlaceholder="搜索仪器名称或编号"
  emptyText="没有匹配的仪器"
  options={[
    { value: "ins-07", label: "恒温箱 07", description: "可用" },
    { value: "ins-08", label: "恒温箱 08", description: "可用" },
    { value: "ins-09", label: "恒温箱 09", description: "维护中", disabled: true },
    { value: "ins-12", label: "手套箱 12", description: "可用" },
  ]}
/>`,
        preview: "combobox/business",
      },
    ],
    props: [
      { name: "options", type: "{ value: string; label: string; description?: string; disabled?: boolean }[]", required: true, description: "候选列表；description 放编号、状态等副信息，弱化显示且参与搜索。" },
      { name: "multiple", type: "boolean", default: "false", description: "多选：值为 string[]，面板保持打开，触发器以 Badge 回显。" },
      { name: "value / defaultValue", type: "string | null（多选为 string[]）", description: "受控 / 非受控值；单选再次点选已选项会取消选择。" },
      { name: "onValueChange", type: "(value: string | null) => void（多选为 string[]）", description: "选中变化回调。" },
      { name: "placeholder / searchPlaceholder", type: "string", default: '"请选择" / "搜索…"', description: "触发器占位与面板内搜索框占位。" },
      { name: "emptyText", type: "ReactNode", default: '"无匹配结果"', description: "无匹配时的空态文案。" },
      { name: "onCreate", type: "(keyword: string) => void", description: "传入即开启创建：无完全匹配时首项为“创建：输入值”；由调用方加入 options 并选中。" },
      { name: "onSearchChange / shouldFilter", type: "(keyword: string) => void / boolean", default: "— / true", description: "远程搜索：关掉本地过滤，在回调里自行防抖（≥300ms）并更新 options。" },
      { name: "loading", type: "boolean", default: "false", description: "远程搜索中，列表显示“正在搜索…”。" },
      { name: "maxBadges", type: "number", default: "3", description: "多选时触发器最多显示的 Badge 数，其余折叠为 +N。" },
      { name: "disabled / invalid", type: "boolean", default: "false", description: "禁用触发器 / 校验失败时红色边框并设 aria-invalid。" },
    ],
    states: [
      { name: "default", note: "未选中时显示占位；单选回显选项 label，多选回显 Badge（超出 maxBadges 折叠为 +N）。" },
      { name: "hover", note: "触发器背景变为 accent；选项悬停时 accent 背景。" },
      { name: "focus-visible", note: "打开面板后焦点进入搜索框，当前高亮项以 accent 背景标出。" },
      { name: "pressed", note: "点选瞬间选项背景高亮，时长 < 120ms。" },
      { name: "disabled", note: "灰底 + not-allowed，不展开面板。" },
      { name: "loading", note: "远程搜索时面板内显示 spinner 与“正在搜索”占位，输入不锁定。" },
      { name: "empty", note: "无匹配时展示 emptyText；传了 onCreate 时改为“创建：输入值”入口。" },
      { name: "error", note: "invalid 时触发器红色边框；远程搜索失败时把错误与重试作为 emptyText 传入，保留关键词。" },
      { name: "permission-limited", note: "无创建权限时不传 onCreate，只能选已有值；无权限选项用 disabled + description 注明。" },
      { name: "mobile", note: "面板宽度跟随触发器（最小 220px），触发器全宽。" },
      { name: "dark-mode", note: "使用语义令牌自动适配，不单独覆盖颜色。" },
    ],
    interaction: [
      "输入即时过滤（label、value、description 都参与匹配）；远程搜索用 shouldFilter={false} + onSearchChange，防抖 ≥300ms。",
      "传了 onCreate 且无完全同名项时，首项固定为“创建：输入值”。",
      "完全同名时不显示创建入口；相似项提示由调用方在 onCreate 中处理，创建后由调用方加入 options 并选中。",
      "单选点选即关闭面板，再次点选已选项可取消；多选保持面板打开。关闭面板时清空搜索词。",
    ],
    keyboard: [
      "Enter / Space / ↓ 打开面板，焦点进入搜索框；输入字符即过滤，↑ / ↓ 移动高亮（跳过禁用项）。",
      "Enter 选中高亮项或触发创建；Esc 关闭面板，焦点回到触发器。",
    ],
    accessibility: [
      "触发器使用 role=\"combobox\"，同步 aria-expanded 与 aria-controls；必须关联 Label 或 aria-label。",
      "搜索框由 cmdk 维护 aria-activedescendant 指向当前高亮项；已选项附读屏文本“（已选）”。",
      "远程搜索时 loading 区域为 role=\"status\"（正在搜索…）。",
      "创建入口语义清晰：文案为“创建：输入值”，不只依赖加号图标。",
    ],
    responsive: [
      "面板宽度跟随输入框，长文本省略号截断。",
      "移动端面板全宽，选项触控高度 ≥40px。",
    ],
    content: [
      "创建项文案固定为“创建：{输入值}”。",
      "选项副信息（编号、状态）用弱化样式，不与主文案混排。",
      "空态区分“无匹配结果”与“搜索失败，请重试”。",
    ],
    dos: [
      "大列表必须支持搜索过滤。",
      "允许创建时给出去重与相似项提示。",
      "远程搜索防抖 ≥300ms 并显示加载占位。",
    ],
    donts: [
      "不要把 Combobox 当普通 Select 用（选项固定且少时是多此一举）。",
      "不要创建前不提示重名，制造重复数据。",
      "不要输入即触发写操作；创建必须经用户明确选择。",
    ],
    related: ["select", "input", "tag", "form"],
  },
  {
    id: "date-picker",
    name: "DatePicker",
    chineseName: "日期选择器",
    category: "entry",
    status: "stable",
    version: "0.1.0",
    purpose: "选择单个日期或日期时间，保证格式合法、范围受控。",
    usage:
      "用于实验日期、截止日、计划开始时间。选择时间段用 DateRangePicker；只按相对时间筛选（最近 7 天）可直接用 FilterBar 的快捷项。",
    keywords: ["date-picker", "date", "日期", "时间选择", "日历"],
    examples: [
      {
        id: "basic",
        title: "基础示例",
        kind: "basic",
        description: "点选日期即确认并关闭面板；有值时右侧可清除。",
        code: `import { DatePicker } from "@/components/ui/date-picker";
import { Label } from "@/components/ui/label";

const [date, setDate] = useState<Date | null>(new Date(2026, 8, 22));

<div className="grid gap-1.5">
  <Label htmlFor="exp-date">实验日期</Label>
  <DatePicker id="exp-date" value={date} onValueChange={setDate} />
</div>`,
        preview: "date-picker/basic",
      },
      {
        id: "disabled-date",
        title: "禁用日期",
        kind: "variant",
        description: "disabledDates 命中的日期在面板内直接禁用并弱化显示，而不是选中后再报错。",
        code: `import { DatePicker } from "@/components/ui/date-picker";

<DatePicker
  aria-label="实验日期"
  placeholder="选择实验日期"
  disabledDates={{ after: new Date() }}
/>`,
        preview: "date-picker/disabled-date",
      },
      {
        id: "business",
        title: "真实业务示例",
        kind: "business",
        description: "预约设备日期：可约范围用 disabledDates 限定，规则前置写在辅助文本里。",
        code: `import { DatePicker } from "@/components/ui/date-picker";
import { Label } from "@/components/ui/label";

<div className="grid gap-1.5">
  <Label htmlFor="reserve-date">预约日期</Label>
  <DatePicker
    id="reserve-date"
    defaultValue={new Date(2026, 8, 24)}
    disabledDates={[{ before: new Date(2026, 8, 22) }, { after: new Date(2026, 9, 6) }]}
    aria-describedby="reserve-date-help"
  />
  <p id="reserve-date-help" className="text-xs text-muted-foreground">
    可预约 2026-09-22 至 2026-10-06，需提前 2 小时；预约计入 示例项目（project-042）额度。
  </p>
</div>`,
        preview: "date-picker/business",
      },
    ],
    props: [
      { name: "value", type: "Date | null", description: "受控值；null 表示未选择。" },
      { name: "defaultValue", type: "Date | null", default: "null", description: "非受控初始值。" },
      { name: "onValueChange", type: "(value: Date | null) => void", description: "点选日期或清除时触发。" },
      { name: "placeholder", type: "string", default: '"选择日期"', description: "未选择时的占位文本。" },
      { name: "format", type: "string", default: '"yyyy-MM-dd"', description: "展示格式（date-fns 语法），全站统一，不逐页自定义。" },
      { name: "disabledDates", type: "Matcher | Matcher[]", description: "react-day-picker 匹配器：函数、{ before }、{ after }、日期数组等；命中日期不可点且弱化。" },
      { name: "clearable", type: "boolean", default: "true", description: "有值时右侧显示清除按钮（aria-label=\"清除日期\"）。" },
      { name: "disabled / invalid", type: "boolean", default: "false", description: "禁用触发器 / 校验失败时红色边框并设 aria-invalid。" },
      { name: "id / aria-describedby / className", type: "string", description: "关联 Label 与辅助文本；className 作用于外层（控制宽度）。" },
    ],
    states: [
      { name: "default", note: "显示格式化日期或占位文本，前置日历图标。" },
      { name: "hover", note: "触发器背景变为 accent。" },
      { name: "focus-visible", note: "触发器 3px 外发光；面板打开后焦点在面板内可循环。" },
      { name: "pressed", note: "面板中日期按下时背景加深一档，时长 < 120ms。" },
      { name: "disabled", note: "灰底 + not-allowed，不展开面板；原因就近说明。" },
      { name: "loading", note: "不适用：日期数据本地生成，无加载态。", applicable: false },
      { name: "empty", note: "未选择时显示占位文本；清除后恢复占位。" },
      { name: "error", note: "必选未选时传 invalid：红色边框 + aria-invalid，并在下方就近给出文案。" },
      { name: "permission-limited", note: "无修改权限时只读展示日期文本，不渲染触发器。" },
      { name: "mobile", note: "日期单元触控区域 ≥40px，面板高度适配屏幕。" },
      { name: "dark-mode", note: "使用语义令牌自动适配，不单独覆盖颜色。" },
    ],
    interaction: [
      "点击触发器打开面板，点选日期即确认并关闭；再次点选已选日期会清空。",
      "disabledDates 命中的日期不可点且弱化显示，规则前置写在辅助文本。",
      "有值时右侧显示清除按钮（clearable），清除后恢复占位。",
      "不支持手动键入和时间选择；需要时间部分时与 Input type=\"time\" 组合。",
    ],
    keyboard: [
      "Tab 聚焦触发器，Enter / ↓ 打开面板。",
      "方向键移动日期，PageUp / PageDown 切换月份，Enter 选中，Esc 关闭。",
    ],
    accessibility: [
      "触发器使用 aria-haspopup=\"dialog\" 并同步 aria-expanded。",
      "日期网格 role=\"grid\"，日期单元同步 aria-selected，禁用日期 aria-disabled=\"true\"。",
      "触发器必须关联 Label（预约日期），不能只靠日历图标；清除按钮 aria-label=\"清除日期\"。",
    ],
    responsive: [
      "小屏下面板占可用宽度，日期单元 ≥40px。",
      "触发器全宽显示，已选日期不被截断。",
    ],
    content: [
      "日期格式全局统一为 YYYY-MM-DD，展示可本地化，提交格式不变。",
      "占位写格式示例：例如：2026-09-22。",
      "禁用规则前置写在辅助文本：可预约未来 14 天，需提前 2 小时。",
    ],
    dos: [
      "禁选规则前置说明，并在面板内直接禁用。",
      "可约范围用 disabledDates 表达，不在提交时才校验。",
      "时区与格式全局统一。",
    ],
    donts: [
      "不要把禁选规则只写在报错里而不前置说明。",
      "不要等用户选中未来日期后提交时才报错（应在面板内禁选）。",
      "不要在单个页面自定义一套日期格式。",
    ],
    related: ["date-range-picker", "form", "filter-bar"],
  },
  {
    id: "date-range-picker",
    name: "DateRangePicker",
    chineseName: "日期范围选择器",
    category: "entry",
    status: "stable",
    version: "0.1.0",
    purpose: "选择一个起止时间段，常用于列表筛选与统计区间。",
    usage:
      "用于按创建时间筛选任务、导出某区间数据。单日选择用 DatePicker；高频相对区间（最近 7 天）必须提供快捷项，不让用户逐日点选。",
    keywords: ["date-range-picker", "range", "日期范围", "时间段", "筛选"],
    examples: [
      {
        id: "basic",
        title: "基础示例",
        kind: "basic",
        description: "第一次点击选开始，第二次点击选结束，点“确定”生效；面板底部实时显示已选天数。",
        code: `import { Badge } from "@/components/ui/badge";
import { DateRangePicker, countRangeDays, type DateRange } from "@/components/ui/date-picker";

const [range, setRange] = useState<DateRange | null>({
  from: new Date(2026, 8, 1),
  to: new Date(2026, 8, 22),
});

<DateRangePicker aria-label="创建时间" value={range} onValueChange={setRange} presets={[]} />
<Badge tone="primary">已选 {countRangeDays(range)} 天</Badge>`,
        preview: "date-range-picker/basic",
      },
      {
        id: "presets",
        title: "快捷选项",
        kind: "variant",
        description: "默认快捷项“近 7 天 / 近 30 天”（含今天）一键填充；可追加业务区间。",
        code: `import { DateRangePicker, defaultDateRangePresets } from "@/components/ui/date-picker";

<DateRangePicker
  aria-label="统计区间"
  presets={[
    ...defaultDateRangePresets,
    { label: "本轮次", range: { from: new Date(2026, 8, 1), to: new Date(2026, 8, 22) } },
  ]}
/>`,
        preview: "date-range-picker/presets",
      },
      {
        id: "business",
        title: "真实业务示例",
        kind: "business",
        description: "任务列表时间筛选：已选区间、命中数量与清除动作一并展示。",
        code: `import { Button } from "@/components/ui/button";
import { DateRangePicker, countRangeDays, type DateRange } from "@/components/ui/date-picker";

const [range, setRange] = useState<DateRange | null>({
  from: new Date(2026, 8, 1),
  to: new Date(2026, 8, 22),
});

<div className="flex flex-wrap items-center gap-2">
  <DateRangePicker
    aria-label="创建时间"
    className="w-[300px]"
    value={range}
    onValueChange={(next) => {
      setRange(next);
      applyFilter({ projectId: "project-042", createdAt: next });
    }}
  />
  {range && <Button variant="ghost" size="sm" onClick={() => setRange(null)}>清除筛选</Button>}
</div>
<p aria-live="polite">已选 {countRangeDays(range)} 天 · 命中 18 个任务 · 区间含开始与结束当日</p>`,
        preview: "date-range-picker/business",
      },
    ],
    props: [
      { name: "value", type: "DateRange | null", description: "受控区间 { from, to }（DateRange 来自 react-day-picker，组件文件重新导出）；null 表示未选择。" },
      { name: "defaultValue", type: "DateRange | null", default: "null", description: "非受控初始区间。" },
      { name: "onValueChange", type: "(value: DateRange | null) => void", description: "点“确定”、快捷项或清除时触发；面板内中途点选不触发。" },
      { name: "presets", type: "{ label: string; range: DateRange | (() => DateRange) }[]", default: "近 7 天 / 近 30 天", description: "快捷区间，函数形式在点击时相对今天计算；传 [] 隐藏。" },
      { name: "numberOfMonths", type: "number", default: "2", description: "面板同时显示的月份数；窄容器可设为 1。" },
      { name: "disabledDates", type: "Matcher | Matcher[]", description: "禁用日期，对开始与结束同时生效。" },
      { name: "placeholder", type: "string", default: '"开始日期 ~ 结束日期"', description: "未选择时的占位文本。" },
      { name: "format", type: "string", default: '"yyyy-MM-dd"', description: "回显格式：2026-09-01 ~ 2026-09-22。" },
      { name: "clearable", type: "boolean", default: "true", description: "有完整区间时右侧显示清除按钮。" },
      { name: "disabled / invalid", type: "boolean", default: "false", description: "禁用触发器 / 校验失败时红色边框并设 aria-invalid。" },
      { name: "countRangeDays(range)", type: "工具函数", description: "返回区间含首尾的天数，用于“已选 22 天”回显。" },
    ],
    states: [
      { name: "default", note: "显示已选区间（开始 ~ 结束）或占位“开始日期 ~ 结束日期”。" },
      { name: "hover", note: "触发器背景变为 accent；面板内日期悬停高亮。" },
      { name: "focus-visible", note: "触发器 3px 外发光；面板打开后焦点在面板内可循环。" },
      { name: "pressed", note: "面板中日期按下时背景加深一档，时长 < 120ms。" },
      { name: "disabled", note: "灰底 + not-allowed，不展开面板；原因就近说明。" },
      { name: "loading", note: "不适用：日期数据本地生成，无加载态。", applicable: false },
      { name: "empty", note: "未选择时显示占位；面板底部提示“请选择开始日期”。清除后恢复。" },
      { name: "error", note: "必选未选时传 invalid：红色边框 + aria-invalid，并就近给出文案。" },
      { name: "permission-limited", note: "无权限时只读展示区间文本，不渲染触发器。" },
      { name: "mobile", note: "窄屏传 numberOfMonths={1}；快捷项移到日历上方横排。" },
      { name: "dark-mode", note: "使用语义令牌自动适配，不单独覆盖颜色。" },
    ],
    interaction: [
      "第一次点击选开始，第二次点击选结束，点“确定”生效；底部实时显示“已选 N 天（含首尾）”。",
      "快捷项一键填充并关闭面板。",
      "跨月导航不清空已选的开始日期。",
      "点击早于开始的日期会成为新的开始日期；点面板外关闭会放弃未确定的修改。",
    ],
    keyboard: [
      "Tab 聚焦触发器，Enter / Space 打开面板；Tab 在快捷项、日历与“清除 / 确定”按钮间移动。",
      "日历内方向键移动日期，Enter 选中；Esc 关闭面板并保留已确认的区间。",
    ],
    accessibility: [
      "触发器关联 Label 或 aria-label（创建时间）；清除按钮 aria-label=\"清除日期范围\"。",
      "区间高亮同时用颜色与文字（已选 22 天，aria-live 播报）表达，不只依赖颜色。",
      "快捷项为真实按钮，可 Tab 到达。",
    ],
    responsive: [
      "窄屏传 numberOfMonths={1}，面板最大宽度为视口宽减 2rem。",
      "已选区间文本允许换行，不截断开始日期。",
    ],
    content: [
      "快捷项命名具体：最近 7 天（含今天）、本轮次。",
      "已选回显统一格式：2026-09-01 ~ 2026-09-22。",
      "说明区间是否含端点：含开始与结束当日。",
    ],
    dos: [
      "提供常用快捷项，不让用户逐日点选。",
      "标明区间是否含端点。",
      "与 FilterBar 组合时作为外露条件之一。",
    ],
    donts: [
      "不要让用户心算天数（给出“已选 22 天”）。",
      "不要选中非法区间后默默互换而不提示。",
      "不要用范围选择器做单日选择（用 DatePicker）。",
    ],
    related: ["date-picker", "filter-bar", "form"],
  },
  {
    id: "checkbox",
    name: "Checkbox",
    chineseName: "复选框",
    category: "entry",
    status: "stable",
    version: "0.1.0",
    purpose: "在一组互不排斥的选项中做多项选择，或确认一个需要显式同意的条款。",
    usage:
      "用于多选属性、批量选择行、勾选“我已阅读”。勾选只改变待提交状态，随表单或批量动作一起生效；需要即时生效的布尔设置用 Switch，二者不可混用。",
    keywords: ["checkbox", "复选框", "多选", "批量选择", "全选"],
    examples: [
      {
        id: "basic",
        title: "基础示例",
        kind: "basic",
        description: "点击方框或文案都切换；文案写清勾选的后果。",
        code: `import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

<div className="flex items-center gap-2">
  <Checkbox id="export-raw" defaultChecked />
  <Label htmlFor="export-raw" className="font-normal">同时导出原始数据</Label>
</div>
<div className="flex items-center gap-2">
  <Checkbox id="include-failed" />
  <Label htmlFor="include-failed" className="font-normal">包含失败步骤</Label>
</div>
<div className="flex items-center gap-2">
  <Checkbox id="current-project" />
  <Label htmlFor="current-project" className="font-normal">仅当前项目（project-042）</Label>
</div>`,
        preview: "checkbox/basic",
      },
      {
        id: "indeterminate",
        title: "全选与半选",
        kind: "variant",
        description: "部分子项选中时父级呈半选态，点击父级在全选 / 全不选间切换。",
        code: `import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

// checked 传 "indeterminate" 表示半选；registry Checkbox 默认只画对勾，半选态用 className 画横线。
const indeterminateCls =
  "relative data-[state=indeterminate]:bg-primary data-[state=indeterminate]:[&_svg]:hidden " +
  "data-[state=indeterminate]:after:absolute data-[state=indeterminate]:after:inset-x-[3px] data-[state=indeterminate]:after:top-1/2 " +
  "data-[state=indeterminate]:after:h-0.5 data-[state=indeterminate]:after:-translate-y-1/2 data-[state=indeterminate]:after:rounded-full " +
  "data-[state=indeterminate]:after:bg-primary-foreground data-[state=indeterminate]:after:content-['']";
const parentChecked = selected.length === 0 ? false : selected.length === total ? true : "indeterminate";

<div className="flex items-center gap-2">
  <Checkbox
    id="select-all"
    checked={parentChecked}
    onCheckedChange={() => setSelected(selected.length === total ? [] : allIds)}
    className={indeterminateCls}
  />
  <Label htmlFor="select-all">全选（已选 {selected.length} / {total}）</Label>
</div>
<div className="grid gap-2.5 pl-6">
  {allIds.map((id) => (
    <div key={id} className="flex items-center gap-2">
      <Checkbox id={id} checked={selected.includes(id)} onCheckedChange={() => toggle(id)} />
      <Label htmlFor={id} className="font-mono font-normal">{id}</Label>
    </div>
  ))}
</div>`,
        preview: "checkbox/indeterminate",
      },
      {
        id: "business",
        title: "真实业务示例",
        kind: "business",
        description: "批量选择数据集：已选计数与批量动作随勾选即时更新，动作本身需二次确认。",
        code: `import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

{datasets.map((dataset) => (
  <Label
    key={dataset.id}
    htmlFor={dataset.id}
    className="flex items-center gap-2.5 rounded-lg border px-3 py-2.5 font-normal has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary-soft"
  >
    <Checkbox id={dataset.id} checked={selected.includes(dataset.id)} onCheckedChange={() => toggle(dataset.id)} />
    <span className="grid">
      <span className="font-semibold">{dataset.name}</span>
      <span className="font-mono text-xs text-muted-foreground">{dataset.id}</span>
    </span>
  </Label>
))}
<div className="flex items-center gap-2">
  <span className="text-sm text-muted-foreground">已选 {selected.length} / 3 项</span>
  <Button variant="secondary" size="sm" disabled={selected.length === 0}>批量导出</Button>
  <Button variant="ghost" size="sm" disabled={selected.length === 0} onClick={() => setSelected([])}>清空选择</Button>
</div>`,
        preview: "checkbox/business",
      },
    ],
    props: [
      { name: "checked / defaultChecked", type: 'boolean | "indeterminate"', description: "受控 / 非受控选中态；\"indeterminate\" 为半选，仅用于全选父级。" },
      { name: "onCheckedChange", type: '(checked: boolean | "indeterminate") => void', description: "切换回调；只更新待提交状态，不产生副作用。" },
      { name: "id", type: "string", description: "与 <Label htmlFor> 一致，点击文案同样切换。" },
      { name: "disabled", type: "boolean", default: "false", description: "禁用；原因写在文案或辅助文本里。" },
      { name: "required / name / value", type: "boolean / string / string", description: "参与原生表单提交时使用。" },
      { name: "className", type: "string", description: "追加样式；可用 data-[state=checked] / data-[state=indeterminate] 选择器定制。" },
      { name: "半选样式", type: "组合", description: "registry Checkbox 只画对勾：checked=\"indeterminate\" 时用 className 隐藏对勾并画横线（见“全选与半选”示例）。" },
      { name: "复选组", type: "组合", description: "无 Checkbox.Group：string[] 状态 + 逐项 Checkbox/Label；分组用 fieldset/legend 或 role=\"group\" + aria-label。" },
      { name: "卡片样式", type: "组合", description: "Label 包住 Checkbox，className=\"has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary-soft\"。" },
    ],
    states: [
      { name: "default", note: "未选 / 已选 / 半选三种视觉明确区分，不依赖颜色单一通道。" },
      { name: "hover", note: "方框边框变为品牌色。" },
      { name: "focus-visible", note: "方框 3px 外发光，Tab 可达。" },
      { name: "pressed", note: "点击瞬间方框轻微缩放，时长 < 120ms。" },
      { name: "disabled", note: "灰化 + not-allowed；已勾选状态保持可见可读。" },
      { name: "loading", note: "不适用：勾选是同步的本地状态；批量动作的等待由对应按钮承担。", applicable: false },
      { name: "empty", note: "不适用：复选框无空态；Group 无选项时不渲染并给出空态说明。", applicable: false },
      { name: "error", note: "必勾选未勾选（如同意条款）提交时报错，文案就近显示在选项下方。" },
      { name: "permission-limited", note: "无权限选项禁用并注明所需权限，不做隐藏。" },
      { name: "mobile", note: "整行可点，触控高度 ≥40px，命中区域包含文案。" },
      { name: "dark-mode", note: "使用语义令牌自动适配，不单独覆盖颜色。" },
    ],
    interaction: [
      "点击方框或文案都切换选中。",
      "全选父级随子项状态在半选 / 全选间切换；点击父级统一选中或清空。",
      "勾选只改变待提交状态，不直接产生写操作；批量动作需显式触发。",
      "批量选择时同步展示已选计数与可用动作。",
    ],
    keyboard: [
      "Tab 聚焦，焦点顺序与视觉顺序一致。",
      "Space 切换选中。",
    ],
    accessibility: [
      "Radix 渲染 role=\"checkbox\" 的按钮，半选时自动同步 aria-checked=\"mixed\"。",
      "一组复选框使用 fieldset / legend 或 role=\"group\" + aria-label 表达分组含义。",
      "必勾选错误时 aria-invalid=\"true\"，错误文案 role=\"alert\" 就近播报。",
    ],
    responsive: [
      "移动端整行可点，触控高度 ≥40px。",
      "窄屏下 Group 选项纵向堆叠，不横向挤压。",
    ],
    content: [
      "文案用肯定句：同时导出原始数据；避免双重否定。",
      "条款类勾选给出链接：我已阅读《数据使用规范》。",
      "说明勾选后果：将为 3 个数据集创建导出任务。",
    ],
    dos: [
      "多选与批量操作用 Checkbox。",
      "区分生效时机：随表单提交生效用 Checkbox，即时生效用 Switch。",
      "全选场景给出已选计数与半选态。",
    ],
    donts: [
      "不要用 Checkbox 做即时开关（那是 Switch 的职责）。",
      "不要用一组复选框做互斥单选（用 Radio）。",
      "不要勾选即悄悄执行写操作；动作必须显式触发。",
    ],
    related: ["switch", "radio", "form", "table"],
  },
  {
    id: "radio",
    name: "Radio",
    chineseName: "单选框",
    category: "entry",
    status: "stable",
    version: "0.1.0",
    purpose: "在少量互斥选项中选择唯一值，所有选项平铺可见。",
    usage:
      "用于 2–5 个互斥选项且需要一眼看全的场景：计算模式、精度档位。选项多或需节省空间用 Select；布尔设置用 Switch 或 Checkbox。",
    keywords: ["radio", "单选框", "单选", "互斥", "档位"],
    examples: [
      {
        id: "basic",
        title: "基础示例",
        kind: "basic",
        description: "选项平铺，选中即替换；方向键在同组内移动。",
        code: `import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

<RadioGroup defaultValue="all" aria-label="任务状态" className="flex gap-4">
  <div className="flex items-center gap-2">
    <RadioGroupItem id="status-all" value="all" />
    <Label htmlFor="status-all" className="font-normal">全部</Label>
  </div>
  <div className="flex items-center gap-2">
    <RadioGroupItem id="status-running" value="running" />
    <Label htmlFor="status-running" className="font-normal">运行中</Label>
  </div>
  <div className="flex items-center gap-2">
    <RadioGroupItem id="status-finished" value="finished" />
    <Label htmlFor="status-finished" className="font-normal">已完成</Label>
  </div>
</RadioGroup>`,
        preview: "radio/basic",
      },
      {
        id: "card-options",
        title: "带描述的卡片样式",
        kind: "variant",
        description: "选项有附加说明时用卡片样式，描述文本跟随选项一并展示。",
        code: `import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// 卡片样式：Label 包住 RadioGroupItem，选中样式用 :has() 跟随子项状态。
const modes = [
  { value: "fast", label: "快速筛选", description: "CPU · 约 30 秒" },
  { value: "precise", label: "高精度计算", description: "GPU · 约 300 秒 · 消耗额度" },
];

<RadioGroup defaultValue="fast" aria-label="计算模式" className="grid gap-3 sm:grid-cols-2">
  {modes.map((mode) => (
    <Label
      key={mode.value}
      htmlFor={\`mode-\${mode.value}\`}
      className="flex items-start gap-2.5 rounded-lg border p-3 font-normal has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary-soft"
    >
      <RadioGroupItem id={\`mode-\${mode.value}\`} value={mode.value} className="mt-0.5" />
      <span className="grid gap-0.5">
        <span className="font-semibold">{mode.label}</span>
        <span className="text-xs text-muted-foreground">{mode.description}</span>
      </span>
    </Label>
  ))}
</RadioGroup>`,
        preview: "radio/card-options",
      },
      {
        id: "business",
        title: "真实业务示例",
        kind: "business",
        description: "选择计算模式：有代价的档位标明代价，无权限的档位禁用并注明。",
        code: `import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const modes = [
  { value: "fast", label: "快速筛选", description: "CPU · 约 30 秒 · 不计额度" },
  { value: "precise", label: "高精度计算", description: "GPU · 约 300 秒 · 计入 project-042 额度" },
  { value: "ultra", label: "超高精度", description: "需申请权限", disabled: true },
];

<RadioGroup value={mode} onValueChange={setMode} aria-label="计算模式" className="grid gap-3 sm:grid-cols-2">
  {modes.map((m) => (
    <Label
      key={m.value}
      htmlFor={\`mode-\${m.value}\`}
      className="flex items-start gap-2.5 rounded-lg border p-3 font-normal has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary-soft has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-60"
    >
      <RadioGroupItem id={\`mode-\${m.value}\`} value={m.value} disabled={m.disabled} className="mt-0.5" />
      <span className="grid gap-0.5">
        <span className="font-semibold">{m.label}</span>
        <span className="text-xs text-muted-foreground">{m.description}</span>
      </span>
    </Label>
  ))}
</RadioGroup>`,
        preview: "radio/business",
      },
    ],
    props: [
      { name: "RadioGroup.value / defaultValue", type: "string", description: "受控 / 非受控选中值；仅在有安全默认时给 defaultValue。" },
      { name: "RadioGroup.onValueChange", type: "(value: string) => void", description: "选中变化回调。" },
      { name: "RadioGroup.aria-label", type: "string", description: "组名称；也可用 aria-labelledby 指向可见标题。" },
      { name: "RadioGroup.disabled / required / name", type: "boolean / boolean / string", description: "禁用整组；required、name 用于原生表单提交。" },
      { name: "RadioGroup.className", type: "string", description: "默认 grid gap-2 纵向排列；横排用 \"flex gap-4\"，卡片两列用 \"grid gap-3 sm:grid-cols-2\"。" },
      { name: "RadioGroupItem.value", type: "string", required: true, description: "选项值，组内唯一。" },
      { name: "RadioGroupItem.id / disabled", type: "string / boolean", description: "id 与 <Label htmlFor> 关联；禁用选项在描述里写明原因。" },
      { name: "卡片样式", type: "组合", description: "无 optionType：Label 包住 RadioGroupItem 与名称/描述，className=\"has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary-soft\"。" },
    ],
    states: [
      { name: "default", note: "当前选中项清晰；无安全默认时不替用户预选。" },
      { name: "hover", note: "圆圈边框变为品牌色；卡片样式整卡边框高亮。" },
      { name: "focus-visible", note: "选中项 3px 外发光；Tab 进入组一次，方向键在组内移动。" },
      { name: "pressed", note: "点击瞬间圆圈轻微缩放，时长 < 120ms。" },
      { name: "disabled", note: "单个选项可禁用并注明原因；整组禁用时灰化。" },
      { name: "loading", note: "不适用：单选是同步的本地状态。", applicable: false },
      { name: "empty", note: "无默认选中时全部未选；提交校验提示必选。" },
      { name: "error", note: "必选未选在提交时报错，错误文案就近显示在组下方。" },
      { name: "permission-limited", note: "无权限的档位禁用并注明所需权限或额度，不隐藏。" },
      { name: "mobile", note: "整行可点，触控高度 ≥40px；卡片样式窄屏单列。" },
      { name: "dark-mode", note: "使用语义令牌自动适配，不单独覆盖颜色。" },
    ],
    interaction: [
      "选中即替换，不能再次点击取消到“无”（除非明确提供清除）。",
      "切换有副作用的档位前给出影响提示（额度、时长），但不打断选择本身。",
      "禁用选项不可点，原因前置写在选项描述里。",
    ],
    keyboard: [
      "Tab 进入组一次，落在当前选中项。",
      "↑ / ↓ / ← / → 在同组内移动并同时选中。",
    ],
    accessibility: [
      "使用 role=\"radiogroup\" 表达分组，选项 role=\"radio\" 并同步 aria-checked。",
      "卡片样式的描述文本通过 aria-describedby 关联到对应选项。",
      "禁用原因对读屏可读，不只依赖灰化样式。",
    ],
    responsive: [
      "窄屏下选项纵向堆叠。",
      "卡片样式在窄屏切换为单列，整卡可点。",
    ],
    content: [
      "选项用名词短语：快速筛选、高精度计算。",
      "有代价的档位写明代价：GPU · 约 300 秒 · 计入额度。",
      "不用“是 / 否”做两个档位（用 Switch）。",
    ],
    dos: [
      "选项少且互斥时用 Radio，让选项一眼看全。",
      "档位有代价时在描述里写明。",
      "存在安全默认时给出默认选中。",
    ],
    donts: [
      "不要 10 个以上选项还用 Radio（用 Select）。",
      "不要切换选项即执行不可逆动作。",
      "不要无说明禁用某个档位。",
    ],
    related: ["select", "checkbox", "switch", "segmented", "form"],
  },
  {
    id: "switch",
    name: "Switch",
    chineseName: "开关",
    category: "entry",
    status: "stable",
    version: "0.1.0",
    purpose: "切换一个即时生效的二元设置，开 / 关语义一目了然。",
    usage:
      "用于通知开关、自动刷新、对团队可见等即时生效的设置。需要随表单提交才生效的选择用 Checkbox：这是两者唯一的分工标准。两个非布尔互斥项用 Radio 或 Segmented。",
    keywords: ["switch", "开关", "即时生效", "toggle", "布尔"],
    examples: [
      {
        id: "basic",
        title: "基础示例",
        kind: "basic",
        description: "点击即生效，无需保存按钮；标签写清控制对象。",
        code: `import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

<div className="flex items-center gap-2.5">
  <Switch id="mail-notify" defaultChecked />
  <Label htmlFor="mail-notify" className="font-normal">邮件通知</Label>
</div>
<div className="flex items-center gap-2.5">
  <Switch id="auto-save" />
  <Label htmlFor="auto-save" className="font-normal">自动保存</Label>
</div>`,
        preview: "switch/basic",
      },
      {
        id: "states",
        title: "异步切换与回滚",
        kind: "state",
        description: "异步写入期间显示 loading 并锁定，成功才切换位置，失败回滚并提示。",
        code: `import { AlertCircle, Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

// registry Switch 没有 loading：写入期间 disabled + 旁边的 spinner；成功后才更新 checked，失败保持原值并提示。
<div className="flex items-center gap-2.5">
  <Switch
    id="remote-sync"
    checked={enabled}
    disabled={pending}
    aria-busy={pending}
    onCheckedChange={async (next) => {
      setPending(true);
      try {
        await updateSetting({ remoteSync: next });
        setEnabled(next);
      } catch {
        setFailed(true); // 未改变 checked，即回滚
      } finally {
        setPending(false);
      }
    }}
  />
  <Label htmlFor="remote-sync" className="font-normal">远程同步</Label>
  {pending && <Loader2 className="size-3 animate-spin text-muted-foreground" aria-label="写入中" />}
  {failed && (
    <span role="alert" className="inline-flex items-center gap-1 text-xs text-danger">
      <AlertCircle className="size-3" aria-hidden="true" />
      保存失败，已回滚
    </span>
  )}
</div>
<div className="flex items-center gap-2.5">
  <Switch id="analytics" checked={false} disabled />
  <Label htmlFor="analytics" className="font-normal text-muted-foreground">数据分析（需管理员开启）</Label>
</div>`,
        preview: "switch/states",
      },
      {
        id: "business",
        title: "真实业务示例",
        kind: "business",
        description: "任务自动刷新：开启后立即按 30 秒间隔轮询，关闭即停，无需任何提交动作。",
        code: `import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

<div className="flex items-start gap-3 rounded-lg border bg-card p-4">
  <Switch
    id="auto-refresh"
    checked={autoRefresh}
    onCheckedChange={setAutoRefresh}
    aria-describedby="auto-refresh-desc"
    className="mt-0.5"
  />
  <div className="grid gap-1">
    <Label htmlFor="auto-refresh" className="text-base font-semibold">任务自动刷新</Label>
    <p id="auto-refresh-desc" className="text-sm text-muted-foreground">
      开启后每 30 秒刷新 run-28003 的状态，关闭即停止。
    </p>
  </div>
</div>`,
        preview: "switch/business",
      },
    ],
    props: [
      { name: "checked / defaultChecked", type: "boolean", description: "受控 / 非受控开关状态。" },
      { name: "onCheckedChange", type: "(checked: boolean) => void", description: "切换回调；异步写入成功后再更新 checked，失败保持原值即回滚。" },
      { name: "id / aria-label", type: "string", description: "id 与 <Label htmlFor> 关联；旁边无可见文案时必须给 aria-label。" },
      { name: "aria-describedby", type: "string", description: "指向“开启后的行为”说明文本。" },
      { name: "disabled", type: "boolean", default: "false", description: "禁用；无权限时在标签里注明原因。" },
      { name: "name / value / required", type: "string / string / boolean", description: "参与原生表单提交时使用（即时生效场景通常不需要）。" },
      { name: "className", type: "string", description: "追加样式；可用 data-[state=checked] 选择器定制。" },
      { name: "写入中", type: "组合", description: "无 loading：disabled={pending} + aria-busy + 旁边 <Loader2 className=\"size-3 animate-spin\" />，失败时 role=\"alert\" 文案提示已回滚。" },
    ],
    states: [
      { name: "default", note: "开为品牌色、关为中性灰，位置与颜色双重编码。" },
      { name: "hover", note: "颜色加深一档，不改变尺寸。" },
      { name: "focus-visible", note: "3px 品牌色外发光，Tab 可达。" },
      { name: "pressed", note: "按下时拇指轻微加宽，时长 < 120ms。" },
      { name: "disabled", note: "灰化 + not-allowed，不响应点击；原因就近说明。" },
      { name: "loading", note: "异步写入期间显示 spinner 并锁定，成功才切换位置。" },
      { name: "empty", note: "不适用：开关是确定的二元状态，无空态。", applicable: false },
      { name: "error", note: "写入失败回滚到原位置，并用 Message 提示失败原因，不留假态。" },
      { name: "permission-limited", note: "无权限修改时禁用并注明所需权限，不隐藏。" },
      { name: "mobile", note: "触控区域 ≥40px，标签与开关整行可点。" },
      { name: "dark-mode", note: "使用语义令牌自动适配，不单独覆盖颜色。" },
    ],
    interaction: [
      "点击即生效，无需保存按钮；设置立即应用到当前上下文。",
      "异步设置先进入 loading，写入成功才切换位置，失败回滚并提示。",
      "开关旁写清控制对象与开启后的行为（每 30 秒自动刷新）。",
      "高成本动作（开始轮询、开启同步）在辅助文案里前置说明。",
    ],
    keyboard: [
      "Tab 聚焦。",
      "Space / Enter 切换。",
    ],
    accessibility: [
      "使用 role=\"switch\" 并同步 aria-checked。",
      "必须有可关联标签或 aria-label，说明控制对象。",
      "状态不只靠颜色：位置与文案双重表达。",
    ],
    responsive: [
      "移动端放大触控区域至 ≥40px。",
      "标签与开关整行可点，窄屏允许文案折行。",
    ],
    content: [
      "标签写控制对象：邮件通知、任务自动刷新；不写“开关”。",
      "需要时补充开启后果：开启后每 30 秒自动刷新。",
      "不用疑问句做标签（要开启通知吗？）。",
    ],
    dos: [
      "即时生效的设置用 Switch。",
      "异步切换失败必须回滚并提示。",
      "与 Checkbox 分工：即时生效用 Switch，随提交生效用 Checkbox。",
    ],
    donts: [
      "不要用 Switch 收集需随表单提交的值（用 Checkbox）。",
      "不要开启瞬间悄悄触发高成本动作而不前置说明。",
      "不要 loading 期间允许反复点击。",
    ],
    related: ["checkbox", "radio", "form", "message"],
  },
  {
    id: "form",
    name: "Form",
    chineseName: "表单",
    category: "entry",
    status: "stable",
    version: "0.1.0",
    purpose: "组织一组字段的标签、辅助说明、校验与提交，把录入错误拦在提交之前。",
    usage:
      "任何需要用户录入并提交的场景：新建项目、提交计算任务、修改配置。只读展示用 Descriptions；单字段即时设置（如开关）不需要包一层 Form。",
    keywords: ["form", "表单", "校验", "提交", "字段", "错误提示"],
    examples: [
      {
        id: "basic",
        title: "基础示例",
        kind: "basic",
        description: "垂直布局是默认：标签在上、控件居中、辅助文本常驻在控件下方。",
        code: `import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

<form className="grid gap-4" onSubmit={handleSubmit}>
  <div className="grid gap-1.5">
    <Label htmlFor="task-name">
      任务名称<span aria-hidden="true" className="ml-0.5 text-danger">*</span>
    </Label>
    <Input id="task-name" required aria-describedby="task-name-help" placeholder="例如：第 3 轮电导率优化" />
    <p id="task-name-help" className="text-xs text-muted-foreground">用于列表与导出命名，2–40 个字符。</p>
  </div>
  <div className="grid gap-1.5">
    <Label htmlFor="project">
      所属项目<span aria-hidden="true" className="ml-0.5 text-danger">*</span>
    </Label>
    <Select required>
      <SelectTrigger id="project" aria-required="true" className="data-[placeholder]:text-muted-foreground">
        <SelectValue placeholder="选择项目" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="project-042">示例项目（project-042）</SelectItem>
        <SelectItem value="project-043">示例项目二（project-043）</SelectItem>
      </SelectContent>
    </Select>
  </div>
</form>`,
        preview: "form/basic",
      },
      {
        id: "validation",
        title: "校验与错误就近",
        kind: "state",
        description: "错误显示在出错字段正下方：控件红边 + aria-invalid，错误文案 role=\"alert\" 即时播报。",
        code: `import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

<div className="grid gap-1.5">
  <Label htmlFor="sample-mass">
    样本质量<span aria-hidden="true" className="ml-0.5 text-danger">*</span>
  </Label>
  <div className="relative">
    <Input
      id="sample-mass"
      required
      inputMode="decimal"
      defaultValue="620"
      aria-invalid="true"
      aria-describedby="sample-mass-error"
      className="pr-10 border-danger focus-visible:border-danger focus-visible:ring-danger/20"
    />
    <span aria-hidden="true" className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
      mg
    </span>
  </div>
  <p id="sample-mass-error" role="alert" className="text-xs text-danger">
    质量需在 0–500 mg 之间，当前为 620 mg。
  </p>
</div>`,
        preview: "form/validation",
      },
      {
        id: "business",
        title: "真实业务示例",
        kind: "business",
        description: "提交计算任务：影响范围写在按钮旁，提交中按钮 loading，失败保留全部已填内容。",
        code: `import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

<form className="grid gap-4" onSubmit={submitRun}>
  <div className="grid gap-1.5">
    <Label htmlFor="task-name">
      任务名称<span aria-hidden="true" className="ml-0.5 text-danger">*</span>
    </Label>
    <Input id="task-name" required defaultValue="第 3 轮电导率优化" aria-describedby="task-name-help" />
    <p id="task-name-help" className="text-xs text-muted-foreground">用于列表与导出命名，2–40 个字符。</p>
  </div>
  <div className="grid gap-1.5">
    <Label htmlFor="dataset">
      数据集<span aria-hidden="true" className="ml-0.5 text-danger">*</span>
    </Label>
    <Select required defaultValue="ds-118">
      <SelectTrigger id="dataset" aria-required="true">
        <SelectValue placeholder="选择数据集" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="ds-118">电导率筛选第 3 轮（ds-118）</SelectItem>
        <SelectItem value="ds-120">热稳定性复测（ds-120）</SelectItem>
        <SelectItem value="ds-121">空白对照组（ds-121）</SelectItem>
      </SelectContent>
    </Select>
  </div>
  <div className="flex flex-wrap items-center gap-3">
    <Button type="submit" disabled={submitting}>
      {submitting && <Loader2 className="animate-spin" aria-hidden="true" />}
      {submitting ? "正在创建" : "创建计算任务"}
    </Button>
    <span className="text-sm text-muted-foreground">将使用 示例项目（project-042）· 预计最长 300 秒</span>
  </div>
</form>`,
        preview: "form/business",
      },
    ],
    props: [
      { name: "<form>.onSubmit", type: "React.FormEventHandler<HTMLFormElement>", required: true, description: "原生 form：preventDefault 后校验业务规则；无 Form 组件，字段由下列结构组合。" },
      { name: "字段结构", type: "组合", description: "<div className=\"grid gap-1.5\">：Label → 控件 → 辅助/错误文本；表单 className=\"grid gap-4\" 垂直排列。" },
      { name: "Label.htmlFor", type: "string", required: true, description: "与控件 id 一致；Select 指向 SelectTrigger 的 id。" },
      { name: "必填", type: "组合", description: "Label 内 <span aria-hidden=\"true\" className=\"ml-0.5 text-danger\">*</span> + 控件 required（SelectTrigger 加 aria-required=\"true\"）。" },
      { name: "控件.aria-describedby", type: "string", description: "指向辅助文本与错误文本的 id，可空格分隔多个。" },
      { name: "控件.aria-invalid", type: "boolean", description: "出错时设置，并加 className=\"border-danger focus-visible:border-danger focus-visible:ring-danger/20\"。" },
      { name: "辅助文本", type: "组合", description: "<p id className=\"text-xs text-muted-foreground\">，常驻控件下方，写约束与影响。" },
      { name: "错误文本", type: "组合", description: "<p id role=\"alert\" className=\"text-xs text-danger\">，就近显示在出错字段下方，写清怎么改。" },
      { name: "提交按钮", type: "组合", description: "<Button type=\"submit\" disabled={submitting}> + Loader2 + 进行中文案；按钮旁写影响范围。" },
      { name: "校验时机", type: "组合", description: "无 validateTrigger：格式类规则在控件 onBlur 中校验，业务规则在 onSubmit 中校验；失败后把焦点移到首个错误字段。" },
    ],
    states: [
      { name: "default", note: "标签在上、控件居中、辅助文本常驻；必填星号与校验规则配套。" },
      { name: "hover", note: "不适用：表单容器无悬停态，各控件自行处理。", applicable: false },
      { name: "focus-visible", note: "首个控件可 Tab 到达，焦点顺序与视觉顺序一致；控件各自显示外发光。" },
      { name: "pressed", note: "不适用：表单容器无按下态，按钮与控件自行处理。", applicable: false },
      { name: "disabled", note: "整体禁用仅用于只读审阅；与逐字段禁用区分，禁用原因就近说明。" },
      { name: "loading", note: "提交中提交按钮 loading、字段锁定，防止重复提交。" },
      { name: "empty", note: "初始表单给出合理默认值或占位，不预填猜测值。" },
      { name: "error", note: "错误就近显示在出错字段正下方（role=\"alert\"），提交后自动聚焦首个错误字段；错误随修正即时消除。" },
      { name: "permission-limited", note: "无权限字段禁用并注明所需角色，或整表只读并给出申请入口。" },
      { name: "mobile", note: "单列布局，控件全宽且高度 ≥40px，提交按钮保持在可视区域。" },
      { name: "dark-mode", note: "使用语义令牌自动适配，不单独覆盖颜色。" },
    ],
    interaction: [
      "失焦校验格式类规则，提交校验业务规则；错误随输入修正即时消除。",
      "提交失败保留全部已填内容，不清空表单。",
      "提交中禁止重复提交；成功后给出结果反馈与下一步入口。",
      "必填星号、aria-required 与校验规则必须配套，不标假星号。",
    ],
    keyboard: [
      "Tab 按视觉顺序走字段，不错位不跳过。",
      "Enter 在单行控件内提交表单（多行 Textarea 除外）。",
      "校验失败后焦点移到首个错误字段。",
    ],
    accessibility: [
      "每个控件用 <label htmlFor> 或 aria-labelledby 关联标签。",
      "出错时控件 aria-invalid=\"true\"，错误文案 role=\"alert\" 并经 aria-describedby 关联。",
      "必填同时提供视觉星号与 aria-required=\"true\"。",
      "辅助文本常驻并经 aria-describedby 关联，不塞进 placeholder。",
    ],
    responsive: [
      "桌面默认垂直布局；inline 仅用于筛选区。",
      "移动端单列，控件全宽且高度 ≥40px。",
    ],
    content: [
      "标签用名词短语，句尾不加冒号。",
      "辅助文本写约束与影响：用于列表与导出命名，2–40 个字符。",
      "错误文案三段式：哪里错、为什么、怎么改。",
      "提交按钮写清提交什么：创建计算任务，而不是“提交”。",
    ],
    dos: [
      "错误就近展示在出错字段下方并即时播报。",
      "提交失败保留已填内容。",
      "必填与可选混排时只标必填（或只标“可选”），全表统一。",
      "有副作用的提交在按钮旁说明范围（项目、预算、数量）。",
    ],
    donts: [
      "不要把错误集中到页面顶部而字段旁毫无提示。",
      "不要用 placeholder 代替标签与辅助文本。",
      "不要提交成功后停留在无反馈状态。",
      "不要只禁用提交按钮却不说明原因，让用户猜哪里没填对。",
    ],
    related: ["input", "select", "checkbox", "button", "alert"],
  },
  {
    id: "upload",
    name: "Upload",
    chineseName: "上传",
    category: "entry",
    status: "stable",
    version: "0.1.0",
    purpose: "把本地文件送入平台，是数据导入流程的入口；原始文件必须完整保留、可追溯。",
    usage:
      "用于导入仪器原始数据（.csv / .txt / .xlsx）与上传附件。粘贴小段文本用 Textarea；选择平台已有数据用 DatasetPicker。",
    keywords: ["upload", "上传", "导入", "文件", "拖拽", "原始文件"],
    examples: [
      {
        id: "basic",
        title: "基础示例",
        kind: "basic",
        description: "点击或拖拽均可；接受的格式与大小上限自动写在区域内，不符在选择时即拒绝。",
        code: `import { Upload, UploadFileList, type UploadFileItem } from "@/components/ui/upload";

const [files, setFiles] = useState<UploadFileItem[]>([]);

<Upload
  accept=".csv,.xlsx"
  maxSize={50 * 1024 * 1024}
  multiple
  onFilesSelected={(picked) => startUpload(picked)} // 父组件发请求并回写 progress / status
  onFilesRejected={(rejections) =>
    setFiles((list) => [
      ...list,
      ...rejections.map((r) => ({ id: r.file.name, name: r.file.name, size: r.file.size, status: "error" as const, error: r.reason })),
    ])
  }
/>
<UploadFileList files={files} onRetry={retryUpload} onRemove={removeFile} />`,
        preview: "upload/basic",
      },
      {
        id: "progress",
        title: "进度与失败重试",
        kind: "state",
        description: "逐文件展示进度与百分比；失败文件给出具体原因并可单独重试，上传中可取消。",
        code: `import { UploadFileList } from "@/components/ui/upload";

<UploadFileList
  files={[
    { id: "f1", name: "cycle_data_20260901.csv", size: 19084492, status: "uploading", progress: 72 },
    { id: "f2", name: "notes_final(2).xlsx", size: 63963136, status: "error", error: "超过 50.0 MB 上限（61.0 MB），未开始上传" },
    { id: "f3", name: "impedance_run-28003.csv", size: 2411724, status: "success" },
  ]}
  onRetry={(file) => retryUpload(file)}
  onRemove={(file) => removeFile(file)}
/>`,
        preview: "upload/progress",
      },
      {
        id: "business",
        title: "真实业务示例",
        kind: "business",
        description: "数据导入语义：原始文件不可变保留，解析产物单独存储，解析失败可重新解析。",
        code: `import { FileText } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Upload, UploadFileList } from "@/components/ui/upload";

<Upload
  layout="inline"
  accept=".csv,.xlsx"
  maxSize={50 * 1024 * 1024}
  title="导入仪器原始数据"
  description=".csv / .xlsx · 单个 ≤ 50 MB"
  onFilesSelected={(picked) => importRawFiles({ projectId: "project-042", files: picked })}
  onFilesRejected={showRejections}
/>
<UploadFileList files={files} onRetry={retryUpload} onRemove={removeFile} />
<Alert variant="success">
  <FileText className="size-4" />
  <AlertTitle>原始文件将不可变保留</AlertTitle>
  <AlertDescription>
    原始文件与解析产物分开存储；解析失败可重新解析，不覆盖原始文件。
  </AlertDescription>
</Alert>`,
        preview: "upload/business",
      },
    ],
    props: [
      { name: "accept", type: "string", description: "Upload：允许的类型，扩展名（.csv）、MIME（text/csv）或通配（image/*），逗号分隔；不符在选择时即拒绝。" },
      { name: "maxSize", type: "number", description: "Upload：单文件字节上限；超限拒绝，原因里写明上限与实际大小。" },
      { name: "multiple", type: "boolean", default: "false", description: "Upload：允许一次选择 / 拖入多个文件；false 时只取第一个。" },
      { name: "onFilesSelected", type: "(files: File[]) => void", description: "Upload：通过校验的文件。组件不发网络请求，由父组件上传并维护 UploadFileItem 状态。" },
      { name: "onFilesRejected", type: "(rejections: { file: File; reason: string }[]) => void", description: "Upload：未通过校验的文件与可直接展示的中文原因。" },
      { name: "title / description", type: "ReactNode", description: "Upload：主文案（默认“拖拽文件到此处，或点击选择”）与说明（默认按 accept、maxSize 生成）；说明经 aria-describedby 关联到上传区。" },
      { name: "layout", type: '"default" | "inline"', default: '"default"', description: "Upload：default 为居中大区域；inline 为单行紧凑区，用于表单或侧栏。" },
      { name: "disabled", type: "boolean", default: "false", description: "Upload：禁止选择与拖入（上传中、达数量上限或无写入权限时），原因写在 description。" },
      { name: "files", type: "UploadFileItem[]", required: true, description: "UploadFileList：{ id, name, size?, status: \"uploading\" | \"success\" | \"error\", progress?, error? }；uploading 显示 Progress 与百分比，error 显示原因。" },
      { name: "onRetry / onRemove", type: "(file: UploadFileItem) => void", description: "UploadFileList：失败重试；移除（上传中时为“取消上传”）。" },
    ],
    states: [
      { name: "default", note: "拖拽区 + 格式与上限说明常驻；点击区域任意位置打开文件选择。" },
      { name: "hover", note: "拖拽文件悬停到区域上方时，边框与底色变为品牌色高亮。" },
      { name: "focus-visible", note: "点击选择区域可 Tab 到达，显示 3px 外发光。" },
      { name: "pressed", note: "不适用：上传区无按下沉，反馈体现在拖拽悬停高亮。", applicable: false },
      { name: "disabled", note: "上传中或达数量上限时禁用，原因写在区域内（正在上传 2 个文件）。" },
      { name: "loading", note: "上传中逐文件显示进度条与百分比，提供取消。" },
      { name: "empty", note: "未选择文件时展示引导与格式示例，可提供示例文件下载（example.com）。" },
      { name: "error", note: "类型 / 大小 / 解析失败逐文件给出具体原因与重试入口，不静默丢弃。" },
      { name: "permission-limited", note: "无项目写入权限时禁用并注明所需权限，不让用户选了才失败。" },
      { name: "mobile", note: "移动端拖拽降级为按钮，点击调起系统文件选择器。" },
      { name: "dark-mode", note: "使用语义令牌自动适配，不单独覆盖颜色。" },
    ],
    interaction: [
      "类型或大小不符在选择时即拒绝，不上传一半再失败。",
      "上传进度逐文件展示，支持取消与失败单独重试。",
      "上传完成后进入解析 / 预览步骤；原始文件单独保留、不可变。",
      "同名文件由父组件决定覆盖、保留两者或自动重命名，并在文件项上说明。",
    ],
    keyboard: [
      "Tab 聚焦上传区，Enter / Space 打开文件选择。",
      "文件项的操作（重试、删除、取消）均可 Tab 到达并触发。",
    ],
    accessibility: [
      "上传区为 role=\"button\"（tabIndex 0），经 aria-describedby 指向格式与上限说明；隐藏的 file input 不进 Tab 序列。",
      "进度条为 Radix Progress（role=\"progressbar\"，同步 aria-valuenow），旁边同时显示百分比文字。",
      "失败原因 role=\"alert\" 就近播报；重试 / 移除按钮的 aria-label 带文件名（重试上传 xxx.csv）。",
    ],
    responsive: [
      "移动端拖拽降级为按钮，区域全宽。",
      "文件项操作收入行内，进度条全宽显示。",
    ],
    content: [
      "写明接受的格式与上限：支持 .csv / .xlsx，单个 ≤ 50 MB。",
      "提供示例文件链接（example.com 域名）帮助用户准备格式。",
      "说明保留策略：原始文件不可变保存，重新解析不覆盖原始文件。",
      "错误文案给具体原因：第 3 列缺少表头，而不是“解析失败”。",
    ],
    dos: [
      "accept 与 maxSize 前置说明，并在选择时即校验。",
      "原始文件与解析产物分开存储，原始文件不可变保留。",
      "大文件上传给出进度、取消与超时重试。",
      "失败文件可单独重试，不影响已成功文件。",
    ],
    donts: [
      "不要接受“所有文件”再事后报错。",
      "不要上传成功即丢弃原始文件——数据导入必须可回溯。",
      "不要进度卡住无超时、无重试。",
      "不要用 Upload 让用户粘贴短文本（用 Textarea）。",
    ],
    related: ["file-list", "progress", "dataset-picker", "form", "alert"],
  },
  {
    id: "search-field",
    name: "SearchField",
    chineseName: "搜索框",
    category: "entry",
    status: "stable",
    version: "0.1.0",
    purpose: "输入关键词即时定位对象，是列表与全局导航的查找入口。",
    usage:
      "用于按名称 / 编号搜索数据集、任务、项目。枚举条件组合筛选用 FilterBar；精确单字段录入用 Input。",
    keywords: ["search", "搜索", "搜索框", "查找", "关键词"],
    examples: [
      {
        id: "basic",
        title: "基础示例",
        kind: "basic",
        description: "占位文本写明可搜索的字段范围；页面级搜索用 shortcut=\"/\" 支持 / 键聚焦。",
        code: `import { SearchField } from "@/components/ui/search-field";

<SearchField placeholder="搜索数据集名称或编号" shortcut="/" onSearch={handleSearch} />`,
        preview: "search-field/basic",
      },
      {
        id: "loading-clear",
        title: "搜索中与可清空",
        kind: "variant",
        description: "loading 时右侧显示 spinner，输入不锁定；有值时提供一键清除。",
        code: `import { SearchField } from "@/components/ui/search-field";

<SearchField aria-label="搜索数据集" defaultValue="ds-118" loading clearable={false} />
<SearchField aria-label="搜索任务" value={keyword} onValueChange={setKeyword} />`,
        preview: "search-field/loading-clear",
      },
      {
        id: "business",
        title: "真实业务示例",
        kind: "business",
        description: "任务列表搜索：debounce 300ms 后过滤，Enter 立即搜索，空结果给出清除动作。",
        code: `import { SearchField } from "@/components/ui/search-field";

<SearchField
  placeholder="搜索任务名称或编号"
  value={input}
  onValueChange={setInput}
  debounce={300}
  loading={searching}
  onSearch={(kw) => filterRuns({ projectId: "project-042", keyword: kw })}
/>
{runs.length === 0 && <p>没有匹配「{input}」的任务</p>}`,
        preview: "search-field/business",
      },
    ],
    props: [
      { name: "value / defaultValue", type: "string", default: '— / ""', description: "受控 / 非受控关键词。" },
      { name: "onValueChange", type: "(value: string) => void", description: "每次输入变化（含清除）。" },
      { name: "onSearch", type: "(value: string) => void", description: "Enter 时立即触发；设置 debounce 后停止输入也会触发。" },
      { name: "debounce", type: "number", description: "防抖毫秒数，建议 300；不传则只在 Enter 时触发 onSearch，不逐击键请求。" },
      { name: "loading", type: "boolean", default: "false", description: "搜索中右侧显示 spinner（含“正在搜索”读屏文本），输入保持可编辑。" },
      { name: "clearable", type: "boolean", default: "true", description: "有值时显示清除按钮（aria-label=\"清除搜索\"）；Esc 同样清空。" },
      { name: "onClear", type: "() => void", description: "清除后的额外处理。" },
      { name: "shortcut", type: '"/" | "mod+k"', description: "聚焦快捷键并在右侧显示 Kbd 提示：页面级搜索用 /，全局入口用 ⌘K / Ctrl+K。" },
      { name: "size", type: '"sm" | "default" | "lg"', default: '"default"', description: "高度 28 / 32 / 40px，与 Input、Button 尺寸对齐。" },
      { name: "placeholder", type: "string", default: '"搜索"', description: "占位提示，写明可搜范围；未传 aria-label 时兼作可访问名称。" },
      { name: "wrapperClassName", type: "string", description: "外层容器样式（宽度等）；className 作用于内部 input。" },
    ],
    states: [
      { name: "default", note: "放大镜图标 + 占位文本，占位写明可搜字段。" },
      { name: "hover", note: "不改变外观；清除按钮悬停时背景变为 accent。" },
      { name: "focus-visible", note: "整个容器 ring 边框与外发光；快捷键聚焦后同样显示并全选已有关键词。" },
      { name: "pressed", note: "不适用：搜索框无按下态。", applicable: false },
      { name: "disabled", note: "数据加载失败导致不可搜索时禁用并说明原因。" },
      { name: "loading", note: "搜索中右侧显示 spinner，输入不锁定，可继续修改关键词。" },
      { name: "empty", note: "无结果时给出空态（没有匹配的任务）与清除动作。" },
      { name: "error", note: "搜索服务失败用 Message / Alert 提示，保留已输入关键词。" },
      { name: "permission-limited", note: "无权限的对象不出现在结果中，也不提示其存在。" },
      { name: "mobile", note: "触控场景用 size=\"lg\"（40px）；键盘回车键显示为“搜索”（enterKeyHint=\"search\"）。" },
      { name: "dark-mode", note: "使用语义令牌自动适配，不单独覆盖颜色。" },
    ],
    interaction: [
      "设置 debounce（建议 300）后停止输入即触发 onSearch；Enter 立即搜索。",
      "清除按钮一键还原关键词与结果。",
      "结果随关键词即时更新；命中片段高亮由结果列表负责。",
      "shortcut=\"/\" 时在非输入状态按 / 聚焦；shortcut=\"mod+k\" 时 ⌘K / Ctrl+K 聚焦。",
    ],
    keyboard: [
      "/ 聚焦搜索框（页面级场景）。",
      "Enter 立即搜索；Esc 有值时清空，无值时失焦。",
      "需要建议列表时改用 Combobox 或 CommandDialog，SearchField 本身不带下拉。",
    ],
    accessibility: [
      "使用 type=\"search\"；未传 aria-label 时以 placeholder 作为可访问名称。",
      "结果数量变化由结果区域 aria-live=\"polite\" 播报；loading 时有“正在搜索”读屏文本。",
      "清除按钮提供 aria-label（清除搜索）。",
    ],
    responsive: [
      "窄屏下搜索框全宽显示。",
      "图标与清除按钮保留触控区域，不省略为纯图标。",
    ],
    content: [
      "占位写可搜范围：搜索任务名称或编号。",
      "空态区分“暂无数据”与“没有匹配的结果”。",
      "结果不高亮与关键词无关的内容。",
    ],
    dos: [
      "防抖后即时过滤，Enter 立即搜索。",
      "空结果给出清除动作。",
      "占位文本标明可搜字段。",
    ],
    donts: [
      "不要每击键就发一次请求。",
      "不要搜索失败时清空用户的关键词。",
      "不要把枚举条件塞进搜索框（交给 FilterBar）。",
    ],
    related: ["input", "filter-bar", "combobox", "empty"],
  },
  {
    id: "filter-bar",
    name: "FilterBar",
    chineseName: "筛选栏",
    category: "entry",
    status: "stable",
    version: "0.1.0",
    purpose: "组织列表的筛选条件：常用条件外露，其余收起，已选条件一目了然。",
    usage:
      "用于任务 / 数据集 / 项目列表顶部。单一关键词查找用 SearchField；筛选只改变查询，不产生任何写操作。",
    keywords: ["filter", "筛选", "筛选栏", "过滤", "列表筛选", "已选条件"],
    examples: [
      {
        id: "basic",
        title: "基础示例",
        kind: "basic",
        description: "FilterBar 是组合：SearchField + Select + DateRangePicker 横向排列，有非默认条件时出现“重置”。",
        code: `import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DateRangePicker, type DateRange } from "@/components/ui/date-picker";
import { SearchField } from "@/components/ui/search-field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const [keyword, setKeyword] = useState("");
const [status, setStatus] = useState("running");
const [createdAt, setCreatedAt] = useState<DateRange | null>(null);
const dirty = keyword !== "" || status !== "all" || createdAt !== null;

<div role="search" aria-label="筛选条件" className="flex flex-wrap items-center gap-2">
  <SearchField wrapperClassName="w-[220px]" placeholder="搜索任务名称或编号" value={keyword} onValueChange={setKeyword} />
  <Select value={status} onValueChange={setStatus}>
    <SelectTrigger aria-label="状态" className="w-[132px]">
      <SelectValue />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="all">全部状态</SelectItem>
      <SelectItem value="running">运行中</SelectItem>
      <SelectItem value="queued">排队中</SelectItem>
      <SelectItem value="finished">已完成</SelectItem>
    </SelectContent>
  </Select>
  <DateRangePicker aria-label="创建时间" className="w-[260px]" placeholder="创建时间" value={createdAt} onValueChange={setCreatedAt} />
  {dirty && (
    <Button variant="ghost" onClick={() => { setKeyword(""); setStatus("all"); setCreatedAt(null); }}>
      <RotateCcw />
      重置
    </Button>
  )}
</div>`,
        preview: "filter-bar/basic",
      },
      {
        id: "active-filters",
        title: "已选条件回显",
        kind: "variant",
        description: "已选条件以 Badge 回显，内嵌移除按钮可单个移除；“重置”一键恢复默认。",
        code: `import { RotateCcw, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

<div className="flex flex-wrap items-center gap-1.5">
  <span className="text-sm text-muted-foreground">已选条件：</span>
  {chips.map((chip) => (
    <Badge key={chip.key} tone="primary" className="pr-0.5">
      {chip.label}
      <Button
        variant="ghost"
        size="icon"
        aria-label={\`移除筛选：\${chip.label}\`}
        onClick={() => removeFilter(chip.key)}
        className="size-4 text-primary hover:bg-primary/10 [&_svg]:size-3"
      >
        <X />
      </Button>
    </Badge>
  ))}
</div>
<Button variant="ghost" size="sm" onClick={resetFilters}>
  <RotateCcw />
  重置
</Button>`,
        preview: "filter-bar/active-filters",
      },
      {
        id: "business",
        title: "真实业务示例",
        kind: "business",
        description: "任务列表筛选：条件变化即时刷新表格与计数，无需“查询”按钮；筛选无结果时说明是被筛选清空。",
        code: `import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// 上方筛选栏同“基础示例”；条件写入页面状态 / URL，变化即时应用
const rows = runs.filter((run) => matchFilters(run, { keyword, status, createdAt }));

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>任务</TableHead>
      <TableHead>状态</TableHead>
      <TableHead className="text-right">创建时间</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {rows.map((run) => (
      <TableRow key={run.id}>
        <TableCell>{run.name}</TableCell>
        <TableCell><Badge tone="success" dot>运行中</Badge></TableCell>
        <TableCell className="text-right tabular-nums">{run.createdAt}</TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
<p aria-live="polite">共 {rows.length} 个任务 · 条件变化即时应用到列表与计数</p>`,
        preview: "filter-bar/business",
      },
    ],
    props: [
      { name: "组合方式", type: "composition", description: "FilterBar 不是单独组件：用 role=\"search\" 的 flex 容器（flex-wrap gap-2）排列下列 registry 组件。" },
      { name: "SearchField", type: "@/components/ui/search-field", description: "关键词条件（名称 / 编号），宽 200–240px。" },
      { name: "Select", type: "@/components/ui/select", description: "枚举条件（状态、类型），SelectTrigger 设 aria-label 与固定宽度。" },
      { name: "DateRangePicker", type: "@/components/ui/date-picker", description: "时间条件，带“近 7 天 / 近 30 天”快捷项。" },
      { name: "Combobox", type: "@/components/ui/combobox", description: "选项多或需搜索的条件（负责人、仪器），可 multiple。" },
      { name: "Button（重置）", type: "@/components/ui/button", description: "variant=\"ghost\" + RotateCcw 图标，文案固定“重置”；仅在有非默认条件时显示。" },
      { name: "Badge（已选条件）", type: "@/components/ui/badge", description: "tone=\"primary\" 回显已选条件，内嵌 ghost icon Button 单个移除。" },
    ],
    states: [
      { name: "default", note: "常用条件外露（≤3 个），其余收进“更多筛选”Popover；有非默认条件时出现重置入口。" },
      { name: "hover", note: "各控件自行处理。" },
      { name: "focus-visible", note: "Tab 顺序走外露条件 → 更多筛选 → 重置，控件各自外发光。" },
      { name: "pressed", note: "不适用：筛选栏容器无按下态，内部控件自行处理。", applicable: false },
      { name: "disabled", note: "无权限查看列表数据时整体禁用，并注明所需权限。" },
      { name: "loading", note: "应用筛选时表格区域 Skeleton，筛选栏保持可用、不锁定。" },
      { name: "empty", note: "筛选无结果时空态区分“被筛选清空”与“本来无数据”，并给出清除动作。" },
      { name: "error", note: "条件应用失败时保留条件值并提示重试，不回退到默认条件。" },
      { name: "permission-limited", note: "无权限字段对应的筛选项隐藏，或禁用并注明所需权限。" },
      { name: "mobile", note: "外露条件减少至 1 个，其余收进抽屉；已选 Tag 横向滑动。" },
      { name: "dark-mode", note: "使用语义令牌自动适配，不单独覆盖颜色。" },
    ],
    interaction: [
      "条件变化即时应用到列表与计数，无需“查询”按钮（重型查询除外）。",
      "常用条件外露 ≤3 个，其余收进“更多筛选”（Popover + 表单控件组合）。",
      "已选条件以 Tag 回显，可单个移除；重置一键恢复默认。",
      "筛选条件写入 URL 或页面状态，刷新、返回后保留。",
    ],
    keyboard: [
      "Tab 顺序：外露条件 → 更多筛选 → 重置。",
      "“更多筛选”面板内 Esc 关闭并保留已选条件。",
    ],
    accessibility: [
      "区域使用 role=\"search\" 或 aria-label=\"筛选条件\"。",
      "已选 Tag 的移除按钮提供 aria-label（移除筛选：状态 = 运行中）。",
      "结果计数变化通过 aria-live=\"polite\" 播报。",
    ],
    responsive: [
      "窄屏外露条件减少，其余收进抽屉。",
      "已选 Tag 横向可滚动，不挤占换行成多行高墙。",
    ],
    content: [
      "条件标签用名词：状态、创建时间、负责人。",
      "重置文案固定为“重置”。",
      "空态说清是被筛选清空：没有符合当前筛选的任务。",
      "不用“高级搜索”这类含义模糊的词。",
    ],
    dos: [
      "常用条件外露，其余收起。",
      "条件变化即时反映到列表与计数。",
      "已选条件可单个移除，并可一键重置。",
      "与 SearchField 分工：关键词归搜索，枚举条件归筛选。",
    ],
    donts: [
      "不要把所有条件平铺两三行。",
      "不要刷新或返回后丢失筛选条件。",
      "不要筛选即触发写操作。",
      "不要隐藏“当前正在被筛选”的事实——计数与已选 Tag 必须可见。",
    ],
    related: ["search-field", "select", "date-range-picker", "table", "tag"],
  },
];
