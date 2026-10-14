/** 样张用的轻量 SVG 图（生产里用 ECharts + 同一套 chart 令牌）。 */
export function LineChartMini({ series, height = 180, yLabel, xLabel, xMax = 50 }: { series: { name: string; color: string; points: number[] }[]; height?: number; yLabel?: string; xLabel?: string; xMax?: number }) {
  const W = 800, H = height, L = 36, R = 8, T = 10, B = 26;
  const all = series.flatMap((s) => s.points);
  const min = Math.floor(Math.min(...all) / 5) * 5, max = 100;
  const n = Math.max(...series.map((s) => s.points.length));
  const x = (i: number) => L + (i / (n - 1)) * (W - L - R);
  const y = (v: number) => T + (1 - (v - min) / (max - min)) * (H - T - B);
  const ticks = [min, (min + max) / 2, max];
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label={yLabel}>
      {ticks.map((t) => (
        <g key={t}>
          <line x1={L} x2={W - R} y1={y(t)} y2={y(t)} stroke="hsl(var(--border))" strokeDasharray={t === min ? "" : "3 3"} />
          <text x={L - 8} y={y(t) + 4} textAnchor="end" className="fill-muted-foreground text-[11px] tabular">{t}</text>
        </g>
      ))}
      {[0, 0.2, 0.4, 0.6, 0.8, 1].map((f) => (
        <text key={f} x={L + f * (W - L - R)} y={H - 8} textAnchor={f === 0 ? "start" : f === 1 ? "end" : "middle"} className="fill-muted-foreground text-[11px] tabular">{Math.round(f * xMax)}</text>
      ))}
      {series.map((s) => (
        <polyline key={s.name} fill="none" stroke={s.color} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" points={s.points.map((v, i) => `${x(i)},${y(v)}`).join(" ")} />
      ))}
      {xLabel && <title>{xLabel}</title>}
    </svg>
  );
}

export function Sparkline({ points, color = "hsl(var(--chart-1))" }: { points: number[]; color?: string }) {
  const W = 88, H = 28, min = Math.min(...points), max = Math.max(...points);
  const d = points.map((v, i) => `${(i / (points.length - 1)) * W},${H - 2 - ((v - min) / (max - min || 1)) * (H - 4)}`).join(" ");
  return <svg viewBox={`0 0 ${W} ${H}`} className="h-7 w-[88px]" aria-hidden><polyline fill="none" stroke={color} strokeWidth={1.5} points={d} /></svg>;
}
