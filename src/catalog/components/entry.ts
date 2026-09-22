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
      "用于名称、编号、简短标识等单行文本。多行内容用 Textarea；纯数值用 InputNumber；从有限选项中选值用 Select；即时过滤查找用 SearchField。",
    keywords: ["input", "text", "输入框", "单行文本", "录入"],
    examples: [
      {
        id: "basic",
        title: "基础示例",
        kind: "basic",
        description: "标签常驻在控件上方；固定前缀用 prefix，不让用户手输。",
        code: `<Input label="项目名称" placeholder="例如：高导电解液筛选" />
<Input label="样本编号" prefix="SMP-" placeholder="00042" />`,
        preview: "input/basic",
      },
      {
        id: "sizes",
        title: "尺寸示例",
        kind: "size",
        description: "sm 用于筛选栏和表格行内，md 是默认尺寸，lg 仅用于独立录入页。",
        code: `<Input size="sm" placeholder="行内筛选" />
<Input size="md" placeholder="默认尺寸" />
<Input size="lg" placeholder="页面级录入" />`,
        preview: "input/sizes",
      },
      {
        id: "states",
        title: "状态示例",
        kind: "state",
        description: "disabled 必须在上下文中给出原因；error 就近显示在字段下方。",
        code: `<Input label="所属项目" value="示例项目（project-042）" disabled />
<Input label="任务名称" error="名称不能包含 / \\ : 字符。" defaultValue="第 3 轮/优化" />`,
        preview: "input/states",
      },
      {
        id: "business",
        title: "真实业务示例",
        kind: "business",
        description: "项目重命名：辅助文本写清约束与用途，字数接近上限时给出计数。",
        code: `<div className="field">
  <label htmlFor="project-name">项目名称</label>
  <Input id="project-name" defaultValue="示例项目（project-042）" maxLength={40} allowClear />
  <small>名称用于列表展示与导出文件命名，2–40 个字符，项目内唯一。</small>
</div>`,
        preview: "input/business",
      },
    ],
    props: [
      { name: "value", type: "string", description: "受控值；必须配合 onChange 使用，禁止半受控。" },
      { name: "placeholder", type: "string", description: "占位提示，只写格式示例，不替代标签。" },
      { name: "maxLength", type: "number", description: "最大字符数；接近上限时显示计数，超限禁止继续输入。" },
      { name: "allowClear", type: "boolean", default: "false", description: "有值时显示一键清除按钮，清除后焦点回到输入框。" },
      { name: "prefix", type: "ReactNode", description: "前置内容（图标或固定前缀），不参与提交值。" },
      { name: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "sm 用于筛选栏与行内，lg 仅用于页面级录入。" },
      { name: "disabled", type: "boolean", default: "false", description: "禁止编辑；原因必须由邻近文案说明。" },
      { name: "onChange", type: "(value: string) => void", description: "值变化回调；受控使用时必须同步更新 value。" },
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
      "allowClear 只在有值时出现，点击后焦点回到输入框。",
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
    name: "InputNumber",
    chineseName: "数字输入框",
    category: "entry",
    status: "beta",
    version: "0.1.0",
    purpose: "录入带范围、步长和精度约束的数值，把非法数字拦在输入阶段。",
    usage:
      "用于质量、浓度、温度、循环次数等数值字段。展示用数字不要用它（用 Statistic）；编号即使全是数字也用 Input，避免丢失前导零。",
    keywords: ["input-number", "number", "数字输入", "数值", "步进", "精度"],
    examples: [
      {
        id: "basic",
        title: "基础示例",
        kind: "basic",
        description: "min / max / step 约束输入，步进按钮与方向键等价。",
        code: `<InputNumber min={0} max={100} step={0.1} defaultValue={1.5} />`,
        preview: "input-number/basic",
      },
      {
        id: "precision-unit",
        title: "精度与单位",
        kind: "variant",
        description: "precision 控制小数位，单位展示在控件内右侧，不参与提交值。",
        code: `<InputNumber defaultValue={12.4} precision={2} unit="mg" min={0} max={500} />
<InputNumber defaultValue={200} precision={0} unit="次" min={1} max={2000} />`,
        preview: "input-number/precision-unit",
      },
      {
        id: "business",
        title: "真实业务示例",
        kind: "business",
        description: "称量质量录入：精度与天平一致，范围与量程一致，辅助文本写明依据。",
        code: `<div className="field">
  <label htmlFor="sample-mass">称量质量</label>
  <InputNumber id="sample-mass" defaultValue={12.4} precision={2} unit="mg" min={0} max={500} />
  <small>精度与天平一致（0.01 mg），量程 0–500 mg；留空表示未称量。</small>
</div>`,
        preview: "input-number/business",
      },
    ],
    props: [
      { name: "value", type: "number | null", description: "受控值；null 表示未填写，不强制为 0。" },
      { name: "min", type: "number", description: "下限；越界输入在失焦时收敛到边界并提示。" },
      { name: "max", type: "number", description: "上限；越界输入在失焦时收敛到边界并提示。" },
      { name: "step", type: "number", default: "1", description: "步进按钮与方向键的步长。" },
      { name: "precision", type: "number", description: "小数位数，超出自动四舍五入。" },
      { name: "unit", type: "string", description: "单位文本，展示在控件内右侧，不参与值。" },
      { name: "disabled", type: "boolean", default: "false", description: "禁止编辑并隐藏步进按钮。" },
      { name: "onChange", type: "(value: number | null) => void", description: "值变化回调；清空时回传 null。" },
    ],
    states: [
      { name: "default", note: "显示格式化后的值与单位；null 时显示占位。" },
      { name: "hover", note: "边框加深或变为品牌色，步进按钮显现。" },
      { name: "focus-visible", note: "品牌色边框 + 3px 外发光，Tab 可达。" },
      { name: "pressed", note: "步进按钮按下时背景加深一档，时长 < 120ms。" },
      { name: "disabled", note: "灰底 + not-allowed，步进按钮隐藏；原因就近说明。" },
      { name: "loading", note: "不适用：数字输入无加载态；提交等待由 Form 承担。", applicable: false },
      { name: "empty", note: "null 显示占位文本；空值不自动补 0，由校验决定是否必填。" },
      { name: "error", note: "越界或格式错误时红色边框 + 就近文案，aria-invalid=\"true\"。" },
      { name: "permission-limited", note: "无权限时只读展示值与单位，不渲染为可编辑控件。" },
      { name: "mobile", note: "唤起数字键盘（inputMode=\"decimal\"）；步进按钮触控区域 ≥32×40px。" },
      { name: "dark-mode", note: "使用语义令牌自动适配，不单独覆盖颜色。" },
    ],
    interaction: [
      "非法字符实时过滤，失焦时按 min / max / precision 收敛并给出提示。",
      "上下方向键与步进按钮完全等价。",
      "单位只展示不进值，提交始终是纯数字。",
      "清空后为 null，不自动补 0；“未填”与“填 0”语义不同。",
    ],
    keyboard: [
      "Tab 聚焦；↑ / ↓ 按 step 增减。",
      "输入非法字符被忽略；Esc 放弃本次编辑并还原为进入前的值。",
    ],
    accessibility: [
      "使用 role=\"spinbutton\" 语义，同步 aria-valuemin / aria-valuemax / aria-valuenow。",
      "步进按钮提供 aria-label（增加 / 减少），单位包含在可访问名称或 aria-describedby 中。",
      "错误时 aria-invalid=\"true\"，错误文案 role=\"alert\" 就近播报。",
    ],
    responsive: [
      "移动端唤起数字键盘，输入框全宽。",
      "窄屏下单位内联显示，不与输入值折行分离。",
    ],
    content: [
      "单位写在 unit 里，不写进标签或占位。",
      "错误文案给出允许范围：允许 0–500 mg。",
      "辅助文本写明精度依据：与天平精度一致（0.01 mg）。",
    ],
    dos: [
      "数值字段用 InputNumber 而不是 Input。",
      "标明范围与单位，精度与仪器一致。",
      "用 null 表达“未填”，不用 0 占位。",
    ],
    donts: [
      "不要把编号当数字录入（前导零会丢失）。",
      "不要越界静默收敛而没有任何提示。",
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
    status: "beta",
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
        code: `<Textarea label="实验备注" placeholder="记录实验现象、异常与处理" rows={3} />`,
        preview: "textarea/basic",
      },
      {
        id: "count-autosize",
        title: "字数限制与自动高度",
        kind: "variant",
        description: "maxLength + showCount 给出实时计数；autoSize 在行间自动伸缩、超出封顶。",
        code: `<Textarea maxLength={500} showCount autoSize={{ minRows: 3, maxRows: 8 }} />`,
        preview: "textarea/count-autosize",
      },
      {
        id: "business",
        title: "真实业务示例",
        kind: "business",
        description: "任务备注会进入审计记录并随报告导出，辅助文本必须说明这一后果。",
        code: `<div className="field">
  <label htmlFor="run-note">实验备注（run-28003）</label>
  <Textarea id="run-note" maxLength={500} showCount defaultValue="第 3 轮配方 D，充电末期温升偏高，已降倍率复测。" />
  <small>备注将进入审计记录，导出报告时一并携带，请客观描述事实。</small>
</div>`,
        preview: "textarea/business",
      },
    ],
    props: [
      { name: "value", type: "string", description: "受控值；配合 onChange 使用。" },
      { name: "rows", type: "number", default: "3", description: "初始可视行数。" },
      { name: "maxLength", type: "number", description: "最大字符数；配合 showCount 给出实时计数。" },
      { name: "showCount", type: "boolean", default: "false", description: "显示 已输入/上限 计数，接近上限时变警示色。" },
      { name: "autoSize", type: "boolean | { minRows: number; maxRows: number }", default: "false", description: "随内容自动伸缩，超过 maxRows 出现滚动条。" },
      { name: "placeholder", type: "string", description: "占位提示，引导内容结构，不替代标签。" },
      { name: "disabled", type: "boolean", default: "false", description: "禁止编辑；长文只读场景用只读样式保留全文可读。" },
      { name: "onChange", type: "(value: string) => void", description: "值变化回调。" },
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
      "autoSize 在 minRows / maxRows 之间伸缩，超出出现内部滚动条。",
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
        code: `<Select
  placeholder="选择状态"
  options={[
    { value: "running", label: "运行中" },
    { value: "queued", label: "排队中" },
    { value: "finished", label: "已完成" },
  ]}
/>`,
        preview: "select/basic",
      },
      {
        id: "multiple",
        title: "多选与可清空",
        kind: "variant",
        description: "多选已选值以 Tag 回显，allowClear 一键清空全部选择。",
        code: `<Select
  mode="multiple"
  allowClear
  placeholder="选择标签"
  options={tagOptions}
  defaultValue={["high-conductivity", "round-3"]}
/>`,
        preview: "select/multiple",
      },
      {
        id: "business",
        title: "真实业务示例",
        kind: "business",
        description: "选择数据集：选项超过 8 个时开启搜索，无匹配时给出空态。",
        code: `<Select
  showSearch
  placeholder="搜索数据集名称或编号"
  options={[
    { value: "ds-118", label: "电导率筛选第 3 轮（ds-118）" },
    { value: "ds-120", label: "热稳定性复测（ds-120）" },
    { value: "ds-121", label: "空白对照组（ds-121）" },
  ]}
  emptyText="没有匹配的数据集"
/>`,
        preview: "select/business",
      },
    ],
    props: [
      { name: "value", type: "string | string[]", description: "受控值；多选时为数组。" },
      { name: "options", type: "{ value: string; label: ReactNode; disabled?: boolean }[]", required: true, description: "选项列表；disabled 选项必须在 label 旁注明原因。" },
      { name: "mode", type: '"single" | "multiple"', default: '"single"', description: "单选或多选；多选已选值以 Tag 回显。" },
      { name: "showSearch", type: "boolean", default: "false", description: "面板内搜索，大小写不敏感；选项超过 8 个时必须开启。" },
      { name: "allowClear", type: "boolean", default: "false", description: "有值时显示一键清空按钮。" },
      { name: "placeholder", type: "string", description: "占位提示，写选择对象（选择状态），不写“请选择”。" },
      { name: "loading", type: "boolean", default: "false", description: "选项异步加载中，面板内显示加载占位。" },
      { name: "disabled", type: "boolean", default: "false", description: "禁止展开面板；原因就近说明。" },
      { name: "onChange", type: "(value: string | string[]) => void", description: "选中变化回调。" },
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
        description: "输入即时过滤选项，匹配的片段高亮显示。",
        code: `<Combobox
  placeholder="搜索试剂名称"
  options={[
    { value: "ec", label: "碳酸乙烯酯", hint: "EC" },
    { value: "dmc", label: "碳酸二甲酯", hint: "DMC" },
  ]}
/>`,
        preview: "combobox/basic",
      },
      {
        id: "allow-create",
        title: "允许创建新值",
        kind: "variant",
        description: "无匹配时首项提供创建入口，创建即选中；重名或相似项给出提示。",
        code: `<Combobox
  allowCreate
  placeholder="搜索或输入标签"
  options={tagOptions}
  onCreate={(name) => createTag({ projectId: "project-042", name })}
/>`,
        preview: "combobox/allow-create",
      },
      {
        id: "business",
        title: "真实业务示例",
        kind: "business",
        description: "选择仪器：选项带编号与可用状态，忙碌仪器禁用并注明原因。",
        code: `<Combobox
  placeholder="搜索仪器名称或编号"
  options={[
    { value: "ins-07", label: "恒温箱 07", hint: "可用" },
    { value: "ins-09", label: "恒温箱 09", hint: "维护中", disabled: true },
  ]}
  emptyText="没有匹配的仪器"
/>`,
        preview: "combobox/business",
      },
    ],
    props: [
      { name: "value", type: "string", description: "受控值；选中已有项或创建的新值。" },
      { name: "options", type: "{ value: string; label: ReactNode; hint?: string; disabled?: boolean }[]", required: true, description: "候选列表；hint 放编号、状态等副信息。" },
      { name: "allowCreate", type: "boolean", default: "false", description: "无匹配时展示“创建：输入值”入口。" },
      { name: "onCreate", type: "(name: string) => void", description: "创建回调；创建成功后自动选中新值。" },
      { name: "onSearch", type: "(keyword: string) => void", description: "搜索回调；远程场景防抖 ≥300ms。" },
      { name: "loading", type: "boolean", default: "false", description: "远程搜索中，面板内显示加载占位。" },
      { name: "emptyText", type: "ReactNode", default: '"无匹配结果"', description: "无匹配时的空态文案；allowCreate 时创建入口始终在前。" },
      { name: "onChange", type: "(value: string) => void", description: "选中变化回调。" },
    ],
    states: [
      { name: "default", note: "未选中时为输入态，选中后回显选项 label。" },
      { name: "hover", note: "输入框边框变为品牌色；选项悬停高亮。" },
      { name: "focus-visible", note: "输入框 3px 外发光；面板打开时高亮项清晰可见。" },
      { name: "pressed", note: "点选瞬间选项背景高亮，时长 < 120ms。" },
      { name: "disabled", note: "灰底 + not-allowed，不展开面板。" },
      { name: "loading", note: "远程搜索时面板内显示 spinner 与“正在搜索”占位，输入不锁定。" },
      { name: "empty", note: "无匹配时展示空态；allowCreate 时首项为“创建：输入值”。" },
      { name: "error", note: "搜索服务失败时面板内给出错误与重试，保留已输入关键词。" },
      { name: "permission-limited", note: "创建入口仅对有权限的角色显示；无权限时只能选已有值。" },
      { name: "mobile", note: "面板全宽展示，选项触控高度 ≥40px。" },
      { name: "dark-mode", note: "使用语义令牌自动适配，不单独覆盖颜色。" },
    ],
    interaction: [
      "输入即时过滤，匹配片段高亮；远程搜索防抖 ≥300ms。",
      "无匹配且 allowCreate 时，首项固定为“创建：输入值”。",
      "创建前检测重名与相似项并提示，创建成功后自动选中。",
      "选中后输入框显示选中值，清除后恢复输入态。",
    ],
    keyboard: [
      "输入字符即搜索；↓ 进入列表，↑ / ↓ 移动高亮。",
      "Enter 选中高亮项或触发创建；Esc 关闭面板并保留输入。",
    ],
    accessibility: [
      "输入框使用 role=\"combobox\"，同步 aria-expanded 与 aria-controls。",
      "aria-activedescendant 指向当前高亮项。",
      "结果数量变化通过 aria-live=\"polite\" 播报。",
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
      "不要把 Combobox 当普通 Select 用（选项固定时是多此一举）。",
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
    status: "beta",
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
        description: "点选日期即确认；也支持手动输入，失焦时解析。",
        code: `<DatePicker placeholder="选择日期" defaultValue="2026-09-22" />`,
        preview: "date-picker/basic",
      },
      {
        id: "disabled-date",
        title: "禁用日期",
        kind: "variant",
        description: "不可选的日期在面板内直接禁用并弱化显示，而不是选中后再报错。",
        code: `<DatePicker
  placeholder="选择实验日期"
  disabledDate={(date) => date.isAfter("2026-09-22")}
/>`,
        preview: "date-picker/disabled-date",
      },
      {
        id: "business",
        title: "真实业务示例",
        kind: "business",
        description: "预约设备日期：可约范围与规则前置写在辅助文本里。",
        code: `<div className="field">
  <label htmlFor="reserve-date">预约日期</label>
  <DatePicker id="reserve-date" disabledDate={(d) => d.isAfter("2026-10-06")} />
  <small>可预约未来 14 天，需提前 2 小时；预约计入 示例项目（project-042）额度。</small>
</div>`,
        preview: "date-picker/business",
      },
    ],
    props: [
      { name: "value", type: "string | null", description: "受控值，格式 YYYY-MM-DD；null 表示未选择。" },
      { name: "showTime", type: "boolean", default: "false", description: "同时选择时间；开启后面板需点“确定”才确认。" },
      { name: "disabledDate", type: "(date: Date) => boolean", description: "禁用日期函数；被禁日期不可点且弱化显示。" },
      { name: "format", type: "string", default: '"YYYY-MM-DD"', description: "展示格式，全平台统一，不逐页自定义。" },
      { name: "placeholder", type: "string", description: "占位提示，写格式示例（例如：2026-09-22）。" },
      { name: "disabled", type: "boolean", default: "false", description: "禁止打开面板；原因就近说明。" },
      { name: "onChange", type: "(value: string | null) => void", description: "选中变化回调。" },
    ],
    states: [
      { name: "default", note: "显示格式化日期或占位文本，前置日历图标。" },
      { name: "hover", note: "触发器边框变为品牌色。" },
      { name: "focus-visible", note: "触发器 3px 外发光；面板打开后焦点在面板内可循环。" },
      { name: "pressed", note: "面板中日期按下时背景加深一档，时长 < 120ms。" },
      { name: "disabled", note: "灰底 + not-allowed，不展开面板；原因就近说明。" },
      { name: "loading", note: "不适用：日期数据本地生成，无加载态。", applicable: false },
      { name: "empty", note: "未选择时显示占位文本；清除后恢复占位。" },
      { name: "error", note: "必选未选或手动输入非法时红色边框 + 就近文案，aria-invalid=\"true\"。" },
      { name: "permission-limited", note: "无修改权限时只读展示日期文本，不渲染触发器。" },
      { name: "mobile", note: "日期单元触控区域 ≥40px，面板高度适配屏幕。" },
      { name: "dark-mode", note: "使用语义令牌自动适配，不单独覆盖颜色。" },
    ],
    interaction: [
      "点击触发器打开面板，点选日期即确认（无时间部分时）。",
      "disabledDate 命中的日期不可点且弱化显示，规则前置说明。",
      "支持手动输入，失焦解析；非法输入回退为原值并提示。",
      "showTime 时需点“确定”才提交值，避免半完成状态。",
    ],
    keyboard: [
      "Tab 聚焦触发器，Enter / ↓ 打开面板。",
      "方向键移动日期，PageUp / PageDown 切换月份，Enter 选中，Esc 关闭。",
    ],
    accessibility: [
      "触发器使用 aria-haspopup=\"dialog\" 并同步 aria-expanded。",
      "日期网格 role=\"grid\"，日期单元同步 aria-selected，禁用日期 aria-disabled=\"true\"。",
      "手动输入框必须关联标签（预约日期），不能只靠图标。",
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
      "允许手动输入并做容错解析。",
      "时区与格式全局统一。",
    ],
    donts: [
      "不要只给日历面板而不允许手动输入。",
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
    status: "beta",
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
        description: "第一次点击选开始，第二次点击选结束，悬停预览区间。",
        code: `<DateRangePicker placeholder={["开始日期", "结束日期"]} />`,
        preview: "date-range-picker/basic",
      },
      {
        id: "presets",
        title: "快捷选项",
        kind: "variant",
        description: "常用区间一键填充；快捷项语义必须写清是否含今天。",
        code: `<DateRangePicker
  presets={[
    { label: "最近 7 天", value: ["2026-09-16", "2026-09-22"] },
    { label: "最近 30 天", value: ["2026-08-24", "2026-09-22"] },
    { label: "本轮次", value: ["2026-09-01", "2026-09-22"] },
  ]}
/>`,
        preview: "date-range-picker/presets",
      },
      {
        id: "business",
        title: "真实业务示例",
        kind: "business",
        description: "任务列表时间筛选：已选区间、命中数量与清除动作一并展示。",
        code: `<DateRangePicker
  value={["2026-09-01", "2026-09-22"]}
  onChange={(range) => applyFilter({ projectId: "project-042", createdAt: range })}
/>
<span>已选 22 天 · 命中 18 个任务 · <a>清除筛选</a></span>`,
        preview: "date-range-picker/business",
      },
    ],
    props: [
      { name: "value", type: "[string, string] | null", description: "受控区间 [开始, 结束]，格式 YYYY-MM-DD；null 表示未选择。" },
      { name: "presets", type: "{ label: string; value: [string, string] }[]", description: "快捷区间；命名必须具体（最近 7 天，含今天）。" },
      { name: "disabledDate", type: "(date: Date) => boolean", description: "禁用日期函数，对开始与结束同时生效。" },
      { name: "placeholder", type: "[string, string]", default: '["开始日期", "结束日期"]', description: "两个输入各自的占位。" },
      { name: "disabled", type: "boolean", default: "false", description: "禁止打开面板；原因就近说明。" },
      { name: "onChange", type: "(value: [string, string] | null) => void", description: "区间确认后回调；中途点选不触发。" },
    ],
    states: [
      { name: "default", note: "显示已选区间（开始 ~ 结束）或两个占位。" },
      { name: "hover", note: "触发器边框变为品牌色；面板内悬停日期预览区间。" },
      { name: "focus-visible", note: "触发器 3px 外发光；面板打开后焦点在面板内可循环。" },
      { name: "pressed", note: "面板中日期按下时背景加深一档，时长 < 120ms。" },
      { name: "disabled", note: "灰底 + not-allowed，不展开面板；原因就近说明。" },
      { name: "loading", note: "不适用：日期数据本地生成，无加载态。", applicable: false },
      { name: "empty", note: "未选择时显示开始 / 结束两个占位；清除后恢复。" },
      { name: "error", note: "手动输入非法或结束早于开始时红色边框 + 就近文案，aria-invalid=\"true\"。" },
      { name: "permission-limited", note: "无权限时只读展示区间文本，不渲染触发器。" },
      { name: "mobile", note: "窄屏面板切换为单月视图，日期单元 ≥40px。" },
      { name: "dark-mode", note: "使用语义令牌自动适配，不单独覆盖颜色。" },
    ],
    interaction: [
      "第一次点击选开始，第二次点击选结束；悬停实时预览区间。",
      "快捷项一键填充并关闭面板。",
      "跨月导航不清空已选的开始日期。",
      "结束早于开始时自动交换并给出提示，不静默互换。",
    ],
    keyboard: [
      "Tab 在开始 / 结束输入间切换，Enter / ↓ 打开面板。",
      "面板内方向键移动，Enter 确认，Esc 关闭并保留已选。",
    ],
    accessibility: [
      "开始与结束输入各自拥有标签（开始日期 / 结束日期）。",
      "区间高亮同时用颜色与文字（已选 22 天）表达，不只依赖颜色。",
      "快捷项为真实按钮，可 Tab 到达。",
    ],
    responsive: [
      "窄屏面板切换为单月视图。",
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
        code: `<Checkbox defaultChecked>同时导出原始数据</Checkbox>
<Checkbox>包含失败步骤</Checkbox>
<Checkbox>仅当前项目（project-042）</Checkbox>`,
        preview: "checkbox/basic",
      },
      {
        id: "indeterminate",
        title: "全选与半选",
        kind: "variant",
        description: "部分子项选中时父级呈半选态，点击父级在全选 / 全不选间切换。",
        code: `<Checkbox indeterminate={selected.length > 0 && selected.length < total} checked={selected.length === total}>
  全选
</Checkbox>
<Checkbox.Group value={selected} options={datasetOptions} onChange={setSelected} />`,
        preview: "checkbox/indeterminate",
      },
      {
        id: "business",
        title: "真实业务示例",
        kind: "business",
        description: "批量选择数据集：已选计数与批量动作随勾选即时更新，动作本身需二次确认。",
        code: `<Checkbox.Group value={selected} onChange={setSelected}>
  <Checkbox value="ds-118">电导率筛选第 3 轮（ds-118）</Checkbox>
  <Checkbox value="ds-120">热稳定性复测（ds-120）</Checkbox>
  <Checkbox value="ds-121">空白对照组（ds-121）</Checkbox>
</Checkbox.Group>
<span>已选 {selected.length} / 3 项</span>
<Button variant="secondary" size="sm" disabled={selected.length === 0}>批量导出</Button>`,
        preview: "checkbox/business",
      },
    ],
    props: [
      { name: "checked", type: "boolean", description: "是否选中；受控使用。" },
      { name: "indeterminate", type: "boolean", default: "false", description: "半选态，仅用于全选父级，视觉与未选明确区分。" },
      { name: "disabled", type: "boolean", default: "false", description: "禁止切换；原因就近说明。" },
      { name: "children", type: "ReactNode", description: "选项文案，点击文案同样切换。" },
      { name: "onChange", type: "(checked: boolean) => void", description: "切换回调；只更新待提交状态，不产生副作用。" },
      { name: "Checkbox.Group value", type: "string[]", description: "组受控值，选中的 value 数组。" },
      { name: "Checkbox.Group options", type: "{ value: string; label: ReactNode; disabled?: boolean }[]", description: "组选项配置。" },
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
      "使用原生 input type=\"checkbox\"，半选态同步 aria-checked=\"mixed\"。",
      "Group 使用 fieldset / legend 或 role=\"group\" + aria-label 表达分组含义。",
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
        code: `<Radio.Group
  defaultValue="all"
  options={[
    { value: "all", label: "全部" },
    { value: "running", label: "运行中" },
    { value: "finished", label: "已完成" },
  ]}
/>`,
        preview: "radio/basic",
      },
      {
        id: "card-options",
        title: "带描述的卡片样式",
        kind: "variant",
        description: "选项有附加说明时用卡片样式，描述文本跟随选项一并展示。",
        code: `<Radio.Group
  optionType="card"
  defaultValue="fast"
  options={[
    { value: "fast", label: "快速筛选", description: "CPU · 约 30 秒" },
    { value: "precise", label: "高精度计算", description: "GPU · 约 300 秒 · 消耗额度" },
  ]}
/>`,
        preview: "radio/card-options",
      },
      {
        id: "business",
        title: "真实业务示例",
        kind: "business",
        description: "选择计算模式：有代价的档位标明代价，无权限的档位禁用并注明。",
        code: `<Radio.Group
  optionType="card"
  value={mode}
  onChange={setMode}
  options={[
    { value: "fast", label: "快速筛选", description: "CPU · 约 30 秒 · 不计额度" },
    { value: "precise", label: "高精度计算", description: "GPU · 约 300 秒 · 计入 project-042 额度" },
    { value: "ultra", label: "超高精度", description: "需申请权限", disabled: true },
  ]}
/>`,
        preview: "radio/business",
      },
    ],
    props: [
      { name: "value", type: "string", description: "组受控值。" },
      { name: "options", type: "{ value: string; label: ReactNode; description?: ReactNode; disabled?: boolean }[]", required: true, description: "选项配置；description 用于卡片样式。" },
      { name: "optionType", type: '"default" | "card"', default: '"default"', description: "default 为圆点平铺；card 为带描述的卡片。" },
      { name: "defaultValue", type: "string", description: "默认选中；仅在有安全默认时使用。" },
      { name: "disabled", type: "boolean", default: "false", description: "整组禁用；单个选项禁用用 options.disabled。" },
      { name: "onChange", type: "(value: string) => void", description: "选中变化回调。" },
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
        code: `<Switch defaultChecked aria-label="邮件通知" /> 邮件通知
<Switch aria-label="自动保存" /> 自动保存`,
        preview: "switch/basic",
      },
      {
        id: "states",
        title: "异步切换与回滚",
        kind: "state",
        description: "异步写入期间显示 loading 并锁定，成功才切换位置，失败回滚并提示。",
        code: `<Switch
  checked={enabled}
  loading={pending}
  onChange={async (next) => {
    setPending(true);
    await updateSetting({ autoRefresh: next }); // 失败时抛出，Switch 回滚
    setPending(false);
  }}
/>`,
        preview: "switch/states",
      },
      {
        id: "business",
        title: "真实业务示例",
        kind: "business",
        description: "任务自动刷新：开启后立即按 30 秒间隔轮询，关闭即停，无需任何提交动作。",
        code: `<div className="setting-row">
  <Switch checked={autoRefresh} onChange={setAutoRefresh} aria-label="任务自动刷新" />
  <div>
    <strong>任务自动刷新</strong>
    <p>开启后每 30 秒刷新 run-28003 的状态，关闭即停止。</p>
  </div>
</div>`,
        preview: "switch/business",
      },
    ],
    props: [
      { name: "checked", type: "boolean", description: "是否开启；受控使用。" },
      { name: "loading", type: "boolean", default: "false", description: "异步写入中显示 spinner 并锁定，防止反复点击。" },
      { name: "disabled", type: "boolean", default: "false", description: "禁止切换；原因就近说明。" },
      { name: "aria-label", type: "string", description: "控制对象名称；旁边无可见文案时必填。" },
      { name: "onChange", type: "(checked: boolean) => void | Promise<void>", description: "切换回调；返回 Promise 时失败必须回滚到原状态。" },
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
        code: `<Form layout="vertical" onSubmit={handleSubmit}>
  <Form.Item label="任务名称" required help="用于列表与导出命名，2–40 个字符。">
    <Input placeholder="例如：第 3 轮电导率优化" />
  </Form.Item>
  <Form.Item label="所属项目" required>
    <Select options={projectOptions} placeholder="选择项目" />
  </Form.Item>
</Form>`,
        preview: "form/basic",
      },
      {
        id: "validation",
        title: "校验与错误就近",
        kind: "state",
        description: "错误显示在出错字段正下方：控件红边 + aria-invalid，错误文案 role=\"alert\" 即时播报。",
        code: `<Form.Item
  label="样本质量"
  required
  error="质量需在 0–500 mg 之间，当前为 620 mg。"
>
  <InputNumber unit="mg" min={0} max={500} aria-invalid="true" />
</Form.Item>`,
        preview: "form/validation",
      },
      {
        id: "business",
        title: "真实业务示例",
        kind: "business",
        description: "提交计算任务：影响范围写在按钮旁，提交中按钮 loading，失败保留全部已填内容。",
        code: `<Form layout="vertical" onSubmit={submitRun}>
  <Form.Item label="任务名称" required help="用于列表与导出命名，2–40 个字符。">
    <Input placeholder="例如：第 3 轮电导率优化" />
  </Form.Item>
  <Form.Item label="数据集" required>
    <Select options={datasetOptions} placeholder="选择数据集" />
  </Form.Item>
  <div className="action-with-scope">
    <Button variant="primary" loading={submitting}>创建计算任务</Button>
    <span>将使用 示例项目（project-042）· 预计最长 300 秒</span>
  </div>
</Form>`,
        preview: "form/business",
      },
    ],
    props: [
      { name: "layout", type: '"vertical" | "inline"', default: '"vertical"', description: "垂直布局是默认；inline 仅用于筛选区等紧凑场景。" },
      { name: "validateTrigger", type: '"onBlur" | "onChange" | "onSubmit"', default: '"onBlur"', description: "失焦校验格式类规则，提交校验业务规则。" },
      { name: "onSubmit", type: "(values: Record<string, unknown>) => void | Promise<void>", required: true, description: "提交回调；异步期间提交按钮 loading 并禁止重复提交。" },
      { name: "Form.Item label", type: "ReactNode", required: true, description: "字段标签，必须可见并通过 htmlFor 关联控件。" },
      { name: "Form.Item required", type: "boolean", default: "false", description: "必填标记；视觉星号、aria-required 与校验规则三者配套。" },
      { name: "Form.Item help", type: "ReactNode", description: "辅助说明，常驻显示在控件下方，写约束与影响范围。" },
      { name: "Form.Item error", type: "ReactNode", description: "校验错误文案；出现时控件红边 + aria-invalid=\"true\"。" },
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
    status: "beta",
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
        description: "点击或拖拽均可；接受的格式与大小上限前置写在区域内。",
        code: `<Upload accept=".csv,.xlsx" maxSize={50 * 1024 * 1024}>
  拖拽文件到此处，或点击选择
</Upload>`,
        preview: "upload/basic",
      },
      {
        id: "progress",
        title: "进度与失败重试",
        kind: "state",
        description: "逐文件展示进度与百分比；失败文件给出具体原因并可单独重试。",
        code: `<Upload.FileList
  files={[
    { name: "cycle_data_20260901.csv", size: "18.2 MB", status: "uploading", percent: 72 },
    { name: "notes_final(2).xlsx", size: "61 MB", status: "error", reason: "超过 50 MB 上限" },
  ]}
  onRetry={(file) => retry(file)}
/>`,
        preview: "upload/progress",
      },
      {
        id: "business",
        title: "真实业务示例",
        kind: "business",
        description: "数据导入语义：原始文件不可变保留，解析产物单独存储，解析失败可重新解析。",
        code: `<Upload
  accept=".csv,.xlsx"
  maxSize={50 * 1024 * 1024}
  keepOriginal
  onUploaded={(file) => createDataset({ projectId: "project-042", source: file })}
>
  导入仪器原始数据
</Upload>
<Alert type="info">
  原始文件将不可变保留，与解析产物分开存储；解析失败可重新解析，不覆盖原始文件。
</Alert>`,
        preview: "upload/business",
      },
    ],
    props: [
      { name: "accept", type: "string", required: true, description: "允许的类型（扩展名 + MIME）；不符在选择时即拒绝。" },
      { name: "maxSize", type: "number", required: true, description: "单文件字节上限；超限拒绝并在提示中写明上限。" },
      { name: "multiple", type: "boolean", default: "false", description: "允许一次选择多个文件。" },
      { name: "keepOriginal", type: "boolean", default: "true", description: "原始文件不可变保留；解析产物与原始文件分开存储，数据导入场景必须为 true。" },
      { name: "onProgress", type: "(file: UploadFile, percent: number) => void", description: "逐文件进度回调。" },
      { name: "onChange", type: "(files: UploadFile[]) => void", description: "文件状态变化回调（上传中 / 成功 / 失败）。" },
      { name: "disabled", type: "boolean", default: "false", description: "禁止选择文件；上传中或达数量上限时自动禁用。" },
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
      "同名文件给出选择：覆盖、保留两者或自动重命名。",
    ],
    keyboard: [
      "Tab 聚焦上传区，Enter / Space 打开文件选择。",
      "文件项的操作（重试、删除、取消）均可 Tab 到达并触发。",
    ],
    accessibility: [
      "上传区使用按钮语义，并经 aria-describedby 指向格式与上限说明。",
      "进度条使用 role=\"progressbar\" 并同步 aria-valuenow。",
      "失败原因 role=\"alert\" 就近播报；文件列表每项可朗读名称、大小与状态。",
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
    status: "beta",
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
        description: "占位文本写明可搜索的字段范围；页面级搜索支持 / 快捷键聚焦。",
        code: `<SearchField placeholder="搜索数据集名称或编号" onSearch={handleSearch} />`,
        preview: "search-field/basic",
      },
      {
        id: "loading-clear",
        title: "搜索中与可清空",
        kind: "variant",
        description: "搜索中右侧显示 spinner，输入不锁定；有值时提供一键清除。",
        code: `<SearchField value="ds-118" loading allowClear onSearch={handleSearch} />`,
        preview: "search-field/loading-clear",
      },
      {
        id: "business",
        title: "真实业务示例",
        kind: "business",
        description: "任务列表搜索：防抖 300ms 即时过滤，空结果给出清除动作。",
        code: `<SearchField
  placeholder="搜索任务名称或编号"
  debounce={300}
  onSearch={(kw) => filterRuns({ projectId: "project-042", keyword: kw })}
  emptyText="没有匹配的任务"
/>`,
        preview: "search-field/business",
      },
    ],
    props: [
      { name: "value", type: "string", description: "受控关键词。" },
      { name: "placeholder", type: "string", description: "占位提示，写明可搜范围（搜索任务名称或编号）。" },
      { name: "debounce", type: "number", default: "300", description: "输入防抖毫秒数；不逐击键发请求。" },
      { name: "loading", type: "boolean", default: "false", description: "搜索中右侧显示 spinner，输入保持可编辑。" },
      { name: "allowClear", type: "boolean", default: "true", description: "有值时显示一键清除按钮。" },
      { name: "shortcut", type: "string", description: "聚焦快捷键，页面级搜索约定为 /。" },
      { name: "onSearch", type: "(keyword: string) => void", required: true, description: "防抖后或 Enter 时触发。" },
    ],
    states: [
      { name: "default", note: "放大镜图标 + 占位文本，占位写明可搜字段。" },
      { name: "hover", note: "边框变为品牌色。" },
      { name: "focus-visible", note: "品牌色边框 + 3px 外发光；快捷键聚焦后同样显示。" },
      { name: "pressed", note: "不适用：搜索框无按下态。", applicable: false },
      { name: "disabled", note: "数据加载失败导致不可搜索时禁用并说明原因。" },
      { name: "loading", note: "搜索中右侧显示 spinner，输入不锁定，可继续修改关键词。" },
      { name: "empty", note: "无结果时给出空态（没有匹配的任务）与清除动作。" },
      { name: "error", note: "搜索服务失败用 Message / Alert 提示，保留已输入关键词。" },
      { name: "permission-limited", note: "无权限的对象不出现在结果中，也不提示其存在。" },
      { name: "mobile", note: "高度 ≥40px，唤起搜索键盘（enterKeyHint=\"search\"）。" },
      { name: "dark-mode", note: "使用语义令牌自动适配，不单独覆盖颜色。" },
    ],
    interaction: [
      "输入防抖 ≥300ms 后触发；Enter 立即搜索。",
      "清除按钮一键还原关键词与结果。",
      "结果随关键词即时更新，命中片段高亮。",
      "页面级搜索支持 / 快捷键聚焦。",
    ],
    keyboard: [
      "/ 聚焦搜索框（页面级场景）。",
      "Enter 立即搜索；Esc 清空并失焦。",
      "有建议列表时 ↓ 进入列表，Enter 选中。",
    ],
    accessibility: [
      "使用 type=\"search\" 或 role=\"searchbox\"，并提供 aria-label。",
      "结果数量变化通过 aria-live=\"polite\" 播报。",
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
    status: "beta",
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
        description: "常用条件外露不超过 3 个，其余收进“更多筛选”；有非默认条件时出现重置。",
        code: `<FilterBar
  filters={[
    { key: "status", label: "状态", type: "select", options: statusOptions, primary: true },
    { key: "createdAt", label: "创建时间", type: "date-range", primary: true },
    { key: "owner", label: "负责人", type: "select", options: memberOptions },
    { key: "instrument", label: "仪器", type: "select", options: instrumentOptions },
  ]}
  value={filters}
  onChange={setFilters}
/>`,
        preview: "filter-bar/basic",
      },
      {
        id: "active-filters",
        title: "已选条件回显",
        kind: "variant",
        description: "面板收起后，已选条件以 Tag 回显，可单个移除；重置一键恢复默认。",
        code: `<FilterBar.ActiveFilters
  value={{ status: "运行中", createdAt: "最近 7 天", project: "project-042" }}
  onRemove={(key) => removeFilter(key)}
  onReset={resetFilters}
/>`,
        preview: "filter-bar/active-filters",
      },
      {
        id: "business",
        title: "真实业务示例",
        kind: "business",
        description: "任务列表筛选：条件变化即时刷新表格与计数，无需“查询”按钮。",
        code: `<FilterBar
  filters={taskFilters}
  value={filters}
  onChange={(next) => {
    setFilters(next);
    loadRuns({ projectId: "project-042", ...next }); // 即时应用
  }}
/>
<Table data={runs} />
<span>共 3 个任务 · 已按“状态 = 运行中”筛选</span>`,
        preview: "filter-bar/business",
      },
    ],
    props: [
      { name: "filters", type: "FilterField[]", required: true, description: "条件配置：key / label / type / options；primary 标记常用条件。" },
      { name: "value", type: "Record<string, unknown>", required: true, description: "当前条件值；受控使用并写入 URL 或页面状态。" },
      { name: "visibleCount", type: "number", default: "3", description: "外露的常用条件数量，其余收进“更多筛选”。" },
      { name: "onChange", type: "(value: Record<string, unknown>) => void", required: true, description: "条件变化即时应用，无“确定 / 查询”按钮。" },
      { name: "onReset", type: "() => void", description: "恢复默认条件；仅在有非默认条件时显示入口。" },
    ],
    states: [
      { name: "default", note: "常用条件外露，其余收进“更多筛选”；有非默认条件时出现重置入口。" },
      { name: "hover", note: "各控件自行处理；“更多筛选”按钮悬停时边框变为品牌色。" },
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
      "常用条件外露 ≤3 个，其余收进“更多筛选”面板。",
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
