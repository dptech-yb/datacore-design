import { ArrowRight, Loader2, Plus, Trash2 } from "lucide-react";
import { TopBar } from "@/components/shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/input";
import { SegmentedList, SegmentedTrigger, Tabs } from "@/components/ui/tabs";

const BLUE = ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900"];
const GRAY = ["0", "25", "50", "100", "200", "300", "400", "500", "600", "700", "800", "900", "950"];
const SEM = [
  ["primary", "动作 / 链接 / 选中"], ["success", "完成 / 通过"], ["warning", "待确认 / 需处理"],
  ["danger", "失败 / 阻断 / 删除"], ["agent", "Agent / AI 产出"],
];

function Swatch({ v, label, dark }: { v: string; label: string; dark?: boolean }) {
  return (
    <div className="min-w-0">
      <div className="h-10 rounded-md border" style={{ background: `hsl(var(${v}))` }} />
      <div className={`mt-1 truncate text-xs ${dark ? "font-medium" : "text-muted-foreground"}`}>{label}</div>
    </div>
  );
}

export default function Brand() {
  return (
    <>
      <TopBar crumbs={["设计规范", "品牌与令牌（Phase 0 草案）"]} />
      <main className="mx-auto max-w-[1100px] space-y-6 px-6 py-6">
        <header>
          <h1 className="text-2xl font-semibold tracking-tight">品牌与令牌</h1>
          <p className="mt-1 max-w-3xl text-base text-muted-foreground">保持 DataCore 蓝色系（主色与现主站 #2563EB 一致），把颜色收敛成“一种品牌蓝 + 一组低饱和中性灰 + 五个语义色”；装饰性渐变和青色只留给品牌插画与图表，不再用于按钮和卡片。</p>
        </header>

        <Card>
          <CardHeader><div><CardTitle>色阶（第一层，只在令牌文件里出现）</CardTitle><CardDescription>DataCore Blue · 中性灰（比现在的 slate 降低饱和，整屏不再发蓝发雾）</CardDescription></div></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-5 gap-2 sm:grid-cols-10">{BLUE.map((k) => <Swatch key={k} v={`--blue-${k}`} label={`blue ${k}`} dark={k === "600"} />)}</div>
            <div className="grid grid-cols-5 gap-2 sm:grid-cols-[repeat(13,minmax(0,1fr))]">{GRAY.map((k) => <Swatch key={k} v={`--gray-${k}`} label={`gray ${k}`} />)}</div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader><div><CardTitle>语义色（第二层，组件只能用这一层）</CardTitle><CardDescription>一种颜色只表达一种含义；红绿只表示好坏，不做分组色</CardDescription></div></CardHeader>
            <CardContent className="space-y-2">
              {SEM.map(([k, d]) => (
                <div key={k} className="flex items-center gap-3">
                  <span className="size-7 rounded-md" style={{ background: `hsl(var(--${k}))` }} />
                  <span className="size-7 rounded-md border" style={{ background: `hsl(var(--${k}-soft))` }} />
                  <code className="w-20 font-mono text-sm">{k}</code>
                  <span className="text-sm text-muted-foreground">{d}</span>
                </div>
              ))}
              <div className="flex items-center gap-1.5 pt-2">
                <span className="mr-2 w-[124px] text-sm text-muted-foreground">图表分类色</span>
                {[1, 2, 3, 4, 5, 6].map((i) => <span key={i} className="h-7 flex-1 rounded" style={{ background: `hsl(var(--chart-${i}))` }} />)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><div><CardTitle>字体与字号</CardTitle><CardDescription>Inter（拉丁与数字，等宽数字）+ 苹方 / 思源黑体；产品基准 14px</CardDescription></div></CardHeader>
            <CardContent className="space-y-2.5">
              {[["text-3xl font-semibold", "30 / 38 · 页面大标题", "电解液配方优化"], ["text-2xl font-semibold", "24 / 32 · 页标题", "低温电解液"], ["text-xl font-semibold", "20 / 28 · 详情标题", "LiFSI 浓度梯度"], ["text-md font-semibold", "16 / 24 · 卡片标题", "容量保持率"], ["text-base", "14 / 22 · 正文", "按电解液自动分组，导出对比图。"], ["text-sm text-muted-foreground", "13 / 20 · 辅助", "6 颗 · 1 颗异常"], ["text-xs text-muted-foreground", "12 / 18 · 注释", "更新于 12 分钟前"]].map(([c, m, s]) => (
                <div key={m} className="flex items-baseline gap-4">
                  <span className="w-36 shrink-0 text-xs text-subtle">{m}</span><span className={c}>{s}</span>
                </div>
              ))}
              <div className="flex items-baseline gap-4"><span className="w-36 shrink-0 text-xs text-subtle">数字 · tabular</span><span className="font-mono text-base tabular">183.62 · 97.1% · 4-10-1</span></div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader><div><CardTitle>基础组件（shadcn/ui · 已套 DataCore 令牌）</CardTitle><CardDescription>默认控件高 32px，紧凑 28px；圆角 6px，卡片 8px；阴影只用于浮层</CardDescription></div></CardHeader>
          <CardContent className="space-y-5">
            <div className="flex flex-wrap items-center gap-2">
              <Button>开始计算<ArrowRight /></Button>
              <Button variant="secondary"><Plus />新建</Button>
              <Button variant="soft">次要强调</Button>
              <Button variant="ghost">取消</Button>
              <Button variant="danger"><Trash2 />删除</Button>
              <Button disabled><Loader2 className="animate-spin" />处理中</Button>
              <Button size="sm" variant="secondary">紧凑</Button>
              <Button variant="link">查看详情</Button>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="primary" dot>测试中</Badge><Badge tone="success" dot>完成</Badge><Badge tone="warning" dot>待处理</Badge>
              <Badge tone="danger" dot>异常</Badge><Badge tone="agent">Agent 生成</Badge><Badge>草稿</Badge><Badge tone="outline">只读</Badge>
            </div>
            <div className="grid max-w-xl gap-4 sm:grid-cols-2">
              <div className="space-y-1.5"><Label htmlFor="a">项目名称</Label><Input id="a" placeholder="例如：低温电解液" /></div>
              <div className="space-y-1.5"><Label htmlFor="b">目标列名</Label><Input id="b" defaultValue="1Conductivity" aria-invalid className="border-danger focus-visible:border-danger focus-visible:ring-danger/20" /><p className="text-xs text-danger">需以英文字母开头</p></div>
            </div>
            <Tabs defaultValue="s"><SegmentedList><SegmentedTrigger value="s">单目标</SegmentedTrigger><SegmentedTrigger value="m">多目标</SegmentedTrigger></SegmentedList></Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><div><CardTitle>相对现主站的主要变化</CardTitle></div></CardHeader>
          <CardContent>
            <ul className="grid gap-x-8 gap-y-2 text-base sm:grid-cols-2">
              {["顶栏 + 侧栏两套导航 → 单一左侧导航（全局 + 当前分区展开），顶部只留面包屑和页面动作",
                "页面底色与卡片拉开一档（gray-25 / 白），去掉大面积渐变光晕和“卡片套卡片”",
                "正文 14px、控件 32px，信息密度提高约 20%，表格默认数字右对齐 + 等宽数字",
                "状态一律 Badge + 圆点 + 文字，颜色只来自语义令牌",
                "错误态不再展示接口路径与状态码；原生 alert/confirm/select 全部替换",
                "深色模式由同一套令牌切换（右下角头像旁按钮），浅色先定稿"].map((t) => (
                <li key={t} className="flex gap-2"><span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />{t}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
