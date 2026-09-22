import type { ArticleDoc } from "./types";

/** 基础 Foundations：色彩、排版、间距、圆角、图标、动效、响应式、无障碍。 */
export const foundationDocs: ArticleDoc[] = [
  {
    id: "color",
    name: "Color",
    chineseName: "色彩",
    status: "stable",
    summary: "颜色只表达语义，不负责装饰：品牌蓝用于动作，绿/黄/红/紫/橙各归其位。",
    keywords: ["color", "颜色", "色彩", "token", "语义色"],
    sections: [
      {
        id: "semantic",
        heading: "语义优先",
        body: [
          "DataCore 的颜色系统按语义组织，而不是按色相组织。同一个“成功”在浅色和深色主题中都读得出来，同一屏里不出现两种表达同一语义的颜色。",
          "文档使用白色与中性灰建立层级，品牌首页使用近黑背景。主色用于动作与链接，当前导航使用中性底色和字重；深色模式保持相同语义。",
        ],
        preview: "color/semantic",
      },
      {
        id: "roles",
        heading: "语义角色",
        body: ["每个语义色只承担一种含义，不能跨语义混用。"],
        list: [
          "Brand #2664e8 — 主要动作、链接、当前导航。",
          "Success #058764 — 成功、已完成、可用。",
          "Warning #b87308 — 待确认、需复核、即将到期。",
          "Danger #c33636 — 阻断、错误、危险动作。",
          "Violet #7253c7 — Agent、模型、智能建议。",
          "Orange — 执行、设备、外部系统。",
        ],
      },
      {
        id: "rules",
        heading: "使用规则",
        body: [
          "信息层级靠字号、字重和间距表达，不靠新增颜色。一个区块一种语义色；没有语义的装饰不使用彩色。",
          "深色主题使用同一组语义令牌自动适配，业务代码不手写两套色值。",
        ],
      },
    ],
    related: ["/foundations/typography", "/foundations/accessibility", "/components/badge"],
  },
  {
    id: "typography",
    name: "Typography",
    chineseName: "排版",
    status: "stable",
    summary: "中文系统字体优先，数字与 ID 一律等宽；层级只有 Display / Heading / Body / Mono 四档。",
    keywords: ["typography", "font", "排版", "字体", "字号", "等宽"],
    sections: [
      {
        id: "font-stack",
        heading: "字体栈",
        body: [
          "中文界面以系统字体为先：Noto Sans SC、PingFang SC、Microsoft YaHei 依次回退，西文与数字共用同一套字族，不为装饰引入额外字体。",
          "等宽字体只用于需要对齐与核对的内容：任务 ID、数据集 ID、数值、时间戳。正文段落不使用等宽字体。",
        ],
      },
      {
        id: "hierarchy",
        heading: "四级层级",
        body: ["层级收敛为四档，信息高低靠字号与字重表达，不靠新增颜色。"],
        list: [
          "Display 30–40/600 — 文档标题，一页一个；品牌首页可放大至 62px。",
          "Heading 18–20/600 — 区块标题与卡片组标题。",
          "Body 16/400 — 正文；表格与表单 14px，辅助元数据 12–13px。",
          "Mono 13 — ID、数字与代码片段。",
        ],
        preview: "typography/hierarchy",
      },
      {
        id: "numbers",
        heading: "数字与 ID 等宽",
        body: [
          "任务 ID（run-28003）、数据集 ID（ds-118）、电导率、时长、迭代次数等数值一律使用等宽字体，保证纵向对齐、逐位可比。",
          "表格中的数值列右对齐；ID 列保持左对齐并使用等宽，复制时不带额外格式。",
        ],
        preview: "typography/numbers",
      },
      {
        id: "rules",
        heading: "使用规则",
        body: ["排版的纪律比字体本身更重要，以下规则全站生效。"],
        list: [
          "一个页面只有一个 Display，不靠加粗一切来制造层级。",
          "正文行高 1.6–1.8，段落之间用间距分隔，不用空行或分隔线堆砌。",
          "标题不写句号，正文用全角标点；数字与单位之间留一个半角空格。",
          "不手写 font-size 像素值，统一引用层级令牌。",
        ],
      },
    ],
    related: ["/foundations/color", "/components/typography", "/components/table", "/foundations/accessibility"],
  },
  {
    id: "spacing-layout",
    name: "Spacing & Layout",
    chineseName: "间距与布局",
    status: "beta",
    summary: "以 4px 为基准的间距刻度，8/16/24 构成页面节奏；布局容器克制，同屏只对齐一套栅格。",
    keywords: ["spacing", "layout", "间距", "布局", "栅格", "4px"],
    sections: [
      {
        id: "scale",
        heading: "间距刻度",
        body: [
          "所有间距从 4px 基准派生，常用刻度为 4、8、12、16、24、32。不允许出现 7px、13px 这类刻度外数值。",
        ],
        list: [
          "4 — 图标与文字之间、徽标内边距。",
          "8 — 组件内部元素、行内操作间隔。",
          "16 — 卡片内边距、卡片之间。",
          "24 — 区块之间、筛选区与表格之间。",
          "32 — 页面级分隔，仅在页面骨架使用。",
        ],
        preview: "spacing-layout/scale",
      },
      {
        id: "rhythm",
        heading: "节奏规则",
        body: [
          "页面自上而下是稳定的节奏：标题区与筛选区间隔 24，筛选区与表格间隔 16，卡片内部元素间隔 8–12。节奏一致时，用户不需要重新学习每一页。",
        ],
        preview: "spacing-layout/rhythm",
      },
      {
        id: "layout",
        heading: "布局容器",
        body: [
          "文档与表单内容最大宽度 880px，数据密集型页面最大 1240px，居中并保留 24–32px 左右留白，窄屏收敛到 16px。",
          "同屏只使用一套栅格：卡片栅格列数随宽度 4 → 2 → 1 收敛，不混用两套不同列宽的网格。",
        ],
      },
      {
        id: "rules",
        heading: "使用规则",
        body: ["间距是布局的第一手段，以下规则全站生效。"],
        list: [
          "用 Stack / Grid 组件管理间距，不在业务代码里手写 margin 硬撑布局。",
          "优先用间距分组，其次才是分隔线；能空开的就不要划线。",
          "相邻元素的间距归属唯一：统一由容器 gap 负责，不双重叠加。",
        ],
      },
    ],
    related: ["/components/layout", "/components/stack", "/components/grid", "/foundations/radius-elevation"],
  },
  {
    id: "radius-elevation",
    name: "Radius & Elevation",
    chineseName: "圆角与阴影",
    status: "beta",
    summary: "圆角表达容器层级：控件小圆角、卡片大圆角；阴影只有两档，克制到几乎不被察觉。",
    keywords: ["radius", "elevation", "shadow", "圆角", "阴影", "层级"],
    sections: [
      {
        id: "radius",
        heading: "圆角层级",
        body: [
          "圆角从小到大对应“控件 → 输入 → 容器”的层级。嵌套时外层圆角必须大于内层，视觉上才成立。",
        ],
        list: [
          "radius-sm 4–6 — 徽标、标签、小按钮。",
          "radius-md 8–10 — 按钮、输入框、下拉面板。",
          "radius-lg 16 — 卡片、对话框、页面级容器。",
          "radius-xl 22 — 仅首页主视觉等大型容器使用。",
        ],
        preview: "radius-elevation/radius",
      },
      {
        id: "elevation",
        heading: "阴影与高度",
        body: [
          "阴影只表达“浮起”这一件事：静止卡片使用 shadow-sm，悬停或浮层（下拉、对话框、抽屉）使用 shadow-md，没有第三档。",
          "深色主题下阴影效果减弱，浮层主要靠边框与背景色区分，不加深阴影。",
        ],
        preview: "radius-elevation/elevation",
      },
      {
        id: "rules",
        heading: "使用规则",
        body: ["圆角与阴影服务于层级，不服务于装饰。"],
        list: [
          "边框优先于阴影：默认用 1px 边框界定容器，阴影只在浮起时追加。",
          "同一层级的容器圆角一致；卡片套卡片时内层降一档。",
          "不用大圆角加强阴影的组合制造“气球感”。",
        ],
      },
    ],
    related: ["/foundations/color", "/components/card", "/components/modal", "/components/drawer"],
  },
  {
    id: "icons",
    name: "Icons",
    chineseName: "图标",
    status: "beta",
    summary: "只用 Lucide，16/18/20 三档尺寸，浅色底 + 深色图标；图标有语义才出现，不做装饰。",
    keywords: ["icon", "lucide", "图标", "语义"],
    sections: [
      {
        id: "library",
        heading: "图标库",
        body: [
          "全站统一使用 Lucide，不混用其他图标库、emoji 或自制 SVG。同一语义在全站使用同一个图标：任务一律 flask，数据集一律 database，Agent 一律 bot。",
        ],
      },
      {
        id: "sizes",
        heading: "尺寸",
        body: ["只有三档尺寸，随上下文选择，不在同一行混用多档。"],
        list: [
          "16 — 按钮内、表格行内、状态文字前。",
          "18 — 导航、卡片操作区、常规功能入口。",
          "20 — 空状态、结果页等页面级图形。",
        ],
        preview: "icons/sizes",
      },
      {
        id: "semantic",
        heading: "有语义才出现",
        body: [
          "每个图标都必须能回答“它代表什么对象或状态”。状态类信息使用浅色图标底 + 深色图标的组合：成功绿底、警告黄底、失败红底、Agent 紫底。",
          "卡片标题前不放图标：标题靠文字本身表达，成排卡片标题前重复的图标是噪音。只有功能入口与状态标识才使用图标。",
        ],
        preview: "icons/semantic",
      },
      {
        id: "rules",
        heading: "使用规则",
        body: ["图标是界面里最被滥用的元素，以下规则全站生效。"],
        list: [
          "图标与文字基线对齐，间距 6–8px。",
          "纯图标按钮必须有 aria-label，关键操作不能只靠图标传达。",
          "不为没有语义的装饰需求找“差不多”的图形，宁可不用。",
        ],
      },
    ],
    related: ["/components/icon-button", "/components/badge", "/components/empty", "/foundations/color"],
  },
  {
    id: "motion",
    name: "Motion",
    chineseName: "动效",
    status: "beta",
    summary: "动效只解释界面发生了什么：时长小于 200ms，加载用骨架屏，尊重 prefers-reduced-motion。",
    keywords: ["motion", "animation", "动效", "过渡", "骨架屏", "reduced-motion"],
    sections: [
      {
        id: "duration",
        heading: "时长与缓动",
        body: [
          "微交互 120–160ms，面板展开与浮层 160–200ms；任何超过 200ms 的动效都需要理由，超过 400ms 不允许。",
          "进入用 ease-out，离开用 ease-in；不使用弹性、弹跳曲线，界面不是玩具。",
        ],
        preview: "motion/duration",
      },
      {
        id: "skeleton",
        heading: "加载用骨架屏",
        body: [
          "预计超过 300ms 的加载展示骨架屏，骨架的结构与真实内容一一对应，加载完成后原位替换，不抖动。",
          "Spinner 只用于按钮内和小面积区域；整页加载不允许“白屏转圈”。",
        ],
        preview: "motion/skeleton",
      },
      {
        id: "reduced-motion",
        heading: "尊重降低动态偏好",
        body: [
          "prefers-reduced-motion 下取消位移与缩放，只保留透明度渐变；骨架屏退化为静态占位，自动播放与循环动画停止。",
          "任何信息都不能只通过动画传达：进度变化必须同时有文字或数值。",
        ],
      },
      {
        id: "rules",
        heading: "使用规则",
        body: ["动效是解释，不是表演。"],
        list: [
          "动效回答“它从哪里来、到哪里去”，不回答“好看”。",
          "列表入场不逐项 stagger 超过 5 项，批量更新直接到位。",
          "动画期间不阻塞交互：加载中可以取消、可以离开。",
        ],
      },
    ],
    related: ["/components/skeleton", "/components/spin", "/components/progress", "/foundations/accessibility"],
  },
  {
    id: "responsive",
    name: "Responsive",
    chineseName: "响应式",
    status: "beta",
    summary: "320px 起可用：内容重排而不是消失，宽表横向滚动，导航收进抽屉，点击区不小于 40px。",
    keywords: ["responsive", "mobile", "响应式", "移动端", "断点", "抽屉"],
    sections: [
      {
        id: "principles",
        heading: "原则与断点",
        body: [
          "最小支持宽度 320px。断点为 760px 与 1100px：1100px 以下收起辅助栏，760px 以下进入移动布局。",
          "桌面端的功能在移动端降级而不是消失：复杂操作收入菜单，多栏重排为单栏。",
        ],
      },
      {
        id: "content",
        heading: "内容自适应",
        body: [
          "宽表、代码块、JSON 预览在窄屏横向滚动，列不被压缩，首列语义保持可见。",
          "卡片栅格随宽度 4 → 2 → 1 收敛；长文本截断并提供完整查看入口。",
        ],
        preview: "responsive/content",
      },
      {
        id: "navigation",
        heading: "导航与抽屉",
        body: [
          "760px 以下侧边导航收进抽屉：遮罩可点击关闭，Esc 可关闭；打开时焦点进入抽屉，关闭后返还触发按钮。",
          "顶栏保留菜单、搜索与页面主操作；面包屑在窄屏只保留当前页。",
        ],
      },
      {
        id: "touch",
        heading: "触控目标",
        body: [
          "可点击元素最小 40×40px，相邻目标间距不小于 8px；行内文字按钮在移动端自动增高。",
          "仅 hover 才出现的操作在触控设备上常显，或收入行尾菜单。",
        ],
        preview: "responsive/touch",
      },
    ],
    related: ["/components/drawer", "/components/table", "/templates/list-page", "/foundations/accessibility"],
  },
  {
    id: "accessibility",
    name: "Accessibility",
    chineseName: "无障碍",
    status: "stable",
    summary: "键盘可达、焦点可见、错误可读：支持 200% 缩放，文本对比度不低于 WCAG AA。",
    keywords: ["accessibility", "a11y", "无障碍", "键盘", "对比度", "aria"],
    sections: [
      {
        id: "keyboard",
        heading: "键盘可达与焦点可见",
        body: [
          "所有交互元素 Tab 可达，焦点顺序与视觉顺序一致；focus-visible 使用 3px 品牌色外发光，不允许 outline: none 而无替代方案。",
          "弹层打开时焦点进入，Esc 关闭并返还焦点到触发元素；不可见的元素不可聚焦。",
        ],
        preview: "accessibility/keyboard",
      },
      {
        id: "forms",
        heading: "表单错误与读屏",
        body: [
          "出错输入设置 aria-invalid=\"true\"，错误文案容器使用 role=\"alert\"，提交失败即时播报；label 通过 for/id 与控件关联。",
          "错误不只靠红色表达：必须同时有文字说明与图标，颜色只是增强。",
        ],
        preview: "accessibility/forms",
      },
      {
        id: "zoom-contrast",
        heading: "缩放与对比度",
        body: [
          "200% 缩放下布局不破坏、内容不丢失，除宽表数据区外不出现横向滚动。",
          "正文对比度不低于 4.5:1，大字号文本与图标不低于 3:1；深浅两个主题都需满足。disabled 不通过把对比度降到不可读来“变灰”。",
        ],
      },
      {
        id: "checklist",
        heading: "交付检查清单",
        body: ["每个页面交付前完成以下走查，缺一不可。"],
        list: [
          "键盘全流程走查：能到、能触发、能离开。",
          "读屏走查关键流程：状态变化（提交成功、任务失败）被播报。",
          "200% 缩放与 320px 宽度各走查一遍核心页面。",
          "深色主题复核对比度与焦点可见性。",
        ],
      },
    ],
    related: ["/foundations/color", "/foundations/motion", "/components/form", "/components/alert"],
  },
];
