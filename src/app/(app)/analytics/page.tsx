"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  Legend,
} from "recharts";
import { TrendingUp, TrendingDown, Clock, AlertTriangle, GitBranch } from "lucide-react";
import { Topbar } from "@/components/layout/topbar";
import {
  getAnalyticsKpis,
  getCycleTimeTrend,
  getEfficiencyTrend,
  getProcesses,
} from "@/lib/api";
import { cn } from "@/lib/utils";
import { PROCESSES, EFFICIENCY_TREND, CYCLE_TIME_TREND } from "@/lib/mock-data";
import type { Process } from "@/types";

const FADE_UP: import("framer-motion").Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.35, ease: "easeOut" },
  }),
};

const CHART_TOOLTIP_STYLE = {
  contentStyle: {
    background: "oklch(0.098 0.012 265)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "12px",
    fontSize: "12px",
    boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
  },
  labelStyle: { color: "oklch(0.96 0.005 260)", fontWeight: 600 },
  cursor: { stroke: "rgba(99,102,241,0.2)", strokeWidth: 1 },
};

const toProcessComparison = (processes: Process[]) =>
  processes.map((p) => ({
    name: p.name.split(" ").slice(0, 2).join(" "),
    cycleTime: p.avgCycleTimeHours,
    completion: p.completionRate,
    bottlenecks: p.nodes.filter((n) => n.bottleneckScore >= 60).length,
  }));

const RADAR_DATA = [
  { subject: "Speed", A: 74, B: 65 },
  { subject: "Efficiency", A: 68, B: 70 },
  { subject: "Quality", A: 82, B: 75 },
  { subject: "Automation", A: 45, B: 60 },
  { subject: "Handoffs", A: 55, B: 45 },
  { subject: "Clarity", A: 88, B: 72 },
];

const CARD_STYLE = {
  boxShadow: "0 1px 0 oklch(1 0 0 / 0.06) inset, 0 4px 16px oklch(0 0 0 / 0.18)",
};

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<"week" | "month" | "quarter">("month");
  const [processes, setProcesses] = useState(PROCESSES);
  const [efficiencyTrend, setEfficiencyTrend] = useState(EFFICIENCY_TREND);
  const [cycleTimeTrend, setCycleTimeTrend] = useState(CYCLE_TIME_TREND);
  const [kpis, setKpis] = useState({
    totalProcesses: PROCESSES.length,
    avgCycleTimeHours: 68,
    activeBottlenecks: 5,
    teamMembers: 5,
    efficiencyScore: 74,
    completionRate: 72,
    trends: { cycleTime: -5.5, bottlenecks: -2, efficiency: 16 },
  });

  useEffect(() => {
    let active = true;
    Promise.all([getProcesses(), getAnalyticsKpis(), getEfficiencyTrend(period), getCycleTimeTrend()]).then(
      ([nextProcesses, nextKpis, nextEfficiencyTrend, nextCycleTimeTrend]) => {
        if (!active) return;
        setProcesses(nextProcesses);
        setKpis(nextKpis);
        setEfficiencyTrend(nextEfficiencyTrend);
        setCycleTimeTrend(nextCycleTimeTrend);
      }
    );
    return () => { active = false; };
  }, [period]);

  const processComparison = toProcessComparison(processes);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Topbar
        breadcrumbs={[{ label: "Analytics" }]}
        actions={
          <div className="flex items-center gap-0.5 p-0.5 rounded-xl border border-white/8 bg-white/3">
            {(["week", "month", "quarter"] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={cn(
                  "h-7 px-3.5 rounded-lg text-xs font-medium capitalize transition-all duration-200 cursor-pointer",
                  period === p
                    ? "bg-white/10 text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {p}
              </button>
            ))}
          </div>
        }
      />

      <main className="flex-1 overflow-y-auto scrollbar-thin px-6 py-6 space-y-5">
        {/* Page header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="text-xl font-semibold text-foreground tracking-tight">Analytics</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Performance insights across all processes</p>
        </motion.div>

        {/* KPI row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: "Efficiency Score",
              value: `${kpis.efficiencyScore}%`,
              change: `+${kpis.trends.efficiency}pp`,
              up: true,
              icon: TrendingUp,
              color: "text-primary",
              iconBg: "bg-primary/12",
              stripe: "from-primary/10",
            },
            {
              label: "Avg Cycle Time",
              value: `${kpis.avgCycleTimeHours}h`,
              change: `${kpis.trends.cycleTime}% vs Q1`,
              up: false,
              icon: Clock,
              color: "text-emerald-400",
              iconBg: "bg-emerald-400/12",
              stripe: "from-emerald-400/8",
              positive: true,
            },
            {
              label: "Bottleneck Rate",
              value: `${Math.max(1, Math.round((kpis.activeBottlenecks / Math.max(processes.length, 1)) * 100))}%`,
              change: `${kpis.trends.bottlenecks} this month`,
              up: false,
              icon: AlertTriangle,
              color: "text-amber-400",
              iconBg: "bg-amber-400/12",
              stripe: "from-amber-400/8",
              positive: true,
            },
            {
              label: "Process Instances",
              value: String(kpis.totalProcesses),
              change: "tracked processes",
              up: true,
              icon: GitBranch,
              color: "text-cyan-400",
              iconBg: "bg-cyan-400/12",
              stripe: "from-cyan-400/8",
            },
          ].map((kpi, i) => (
            <motion.div
              key={kpi.label}
              custom={i}
              initial="hidden"
              animate="visible"
              variants={FADE_UP}
              className="relative p-5 rounded-2xl border border-border bg-card overflow-hidden cursor-default"
              style={CARD_STYLE}
            >
              <div className={cn("absolute inset-0 bg-gradient-to-br to-transparent pointer-events-none", kpi.stripe)} />
              <div className="relative">
                <div className="flex items-start justify-between mb-4">
                  <p className="text-xs font-medium text-muted-foreground">{kpi.label}</p>
                  <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center", kpi.iconBg)}>
                    <kpi.icon className={cn("w-4 h-4", kpi.color)} />
                  </div>
                </div>
                <p className="text-2xl font-bold text-foreground tracking-tight mb-1.5 font-mono">{kpi.value}</p>
                <p className={cn("text-xs flex items-center gap-1 font-medium", kpi.positive ? "text-emerald-400" : kpi.up ? "text-emerald-400" : "text-muted-foreground")}>
                  {kpi.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {kpi.change}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Charts row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <motion.div custom={4} initial="hidden" animate="visible" variants={FADE_UP} className="p-5 rounded-2xl border border-border bg-card" style={CARD_STYLE}>
            <p className="text-sm font-semibold text-foreground mb-1">Efficiency Over Time</p>
            <p className="text-xs text-muted-foreground mb-5">Composite score across all processes</p>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={efficiencyTrend} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: "rgba(255,255,255,0.30)" }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "rgba(255,255,255,0.30)" }} tickLine={false} axisLine={false} domain={[40, 100]} />
                <Tooltip {...CHART_TOOLTIP_STYLE} />
                <Area type="monotone" dataKey="baseline" stroke="rgba(255,255,255,0.12)" strokeDasharray="4 4" fill="none" strokeWidth={1} />
                <Area type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={2.5} fill="url(#g1)" dot={false} activeDot={{ r: 4, fill: "#6366f1", strokeWidth: 2, stroke: "#fff" }} />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div custom={5} initial="hidden" animate="visible" variants={FADE_UP} className="p-5 rounded-2xl border border-border bg-card" style={CARD_STYLE}>
            <p className="text-sm font-semibold text-foreground mb-1">Cycle Time Reduction</p>
            <p className="text-xs text-muted-foreground mb-5">Average hours per process instance</p>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={cycleTimeTrend} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: "rgba(255,255,255,0.30)" }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "rgba(255,255,255,0.30)" }} tickLine={false} axisLine={false} />
                <Tooltip {...CHART_TOOLTIP_STYLE} />
                <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2.5} dot={{ fill: "#10b981", r: 3, strokeWidth: 0 }} activeDot={{ r: 5, fill: "#10b981", strokeWidth: 2, stroke: "#fff" }} />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Charts row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <motion.div custom={6} initial="hidden" animate="visible" variants={FADE_UP} className="lg:col-span-2 p-5 rounded-2xl border border-border bg-card" style={CARD_STYLE}>
            <p className="text-sm font-semibold text-foreground mb-1">Process Comparison</p>
            <p className="text-xs text-muted-foreground mb-5">Cycle time vs completion rate by process</p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={processComparison} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                <defs>
                  <linearGradient id="bCycle" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.62 0.24 278)" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="oklch(0.62 0.24 278)" stopOpacity={0.4} />
                  </linearGradient>
                  <linearGradient id="bCompl" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0.4} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: "rgba(255,255,255,0.30)" }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "rgba(255,255,255,0.30)" }} tickLine={false} axisLine={false} />
                <Tooltip {...CHART_TOOLTIP_STYLE} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
                <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "12px" }} />
                <Bar dataKey="cycleTime" fill="url(#bCycle)" radius={[4, 4, 0, 0]} name="Cycle Time (h)" />
                <Bar dataKey="completion" fill="url(#bCompl)" radius={[4, 4, 0, 0]} name="Completion %" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div custom={7} initial="hidden" animate="visible" variants={FADE_UP} className="p-5 rounded-2xl border border-border bg-card" style={CARD_STYLE}>
            <p className="text-sm font-semibold text-foreground mb-1">Performance Radar</p>
            <p className="text-xs text-muted-foreground mb-5">Current vs target</p>
            <ResponsiveContainer width="100%" height={200}>
              <RadarChart data={RADAR_DATA}>
                <PolarGrid stroke="rgba(255,255,255,0.07)" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: "rgba(255,255,255,0.38)" }} />
                <Radar name="Current" dataKey="A" stroke="oklch(0.62 0.24 278)" fill="oklch(0.62 0.24 278)" fillOpacity={0.2} />
                <Radar name="Target" dataKey="B" stroke="#10b981" fill="#10b981" fillOpacity={0.08} strokeDasharray="4 4" />
                <Legend wrapperStyle={{ fontSize: "11px" }} />
              </RadarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Process breakdown table */}
        <motion.div custom={8} initial="hidden" animate="visible" variants={FADE_UP} className="p-5 rounded-2xl border border-border bg-card" style={CARD_STYLE}>
          <p className="text-sm font-semibold text-foreground mb-5">Process Breakdown</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {["Process", "Status", "Cycle Time", "Completion", "Bottlenecks", "Efficiency"].map((h) => (
                    <th key={h} className="text-left text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50 pb-3 pr-4">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {processes.map((p) => {
                  const bottlenecks = p.nodes.filter((n) => n.bottleneckScore >= 60);
                  const efficiency = Math.round(p.completionRate * (1 - bottlenecks.length * 0.1));
                  return (
                    <tr key={p.id} className="border-b border-border/40 hover:bg-white/2 transition-colors">
                      <td className="py-3.5 pr-4">
                        <p className="text-xs font-semibold text-foreground">{p.name}</p>
                        <p className="text-[10px] text-muted-foreground">{p.nodes.length} nodes</p>
                      </td>
                      <td className="py-3.5 pr-4">
                        <span className={cn(
                          "text-[10px] px-2 py-0.5 rounded-lg font-semibold border",
                          p.status === "active" ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/20" :
                          p.status === "optimizing" ? "bg-amber-500/15 text-amber-400 border-amber-500/20" :
                          "bg-zinc-500/15 text-zinc-400 border-zinc-500/20"
                        )}>
                          {p.status}
                        </span>
                      </td>
                      <td className="py-3.5 pr-4 font-mono text-xs font-semibold text-foreground">{p.avgCycleTimeHours}h</td>
                      <td className="py-3.5 pr-4">
                        <div className="flex items-center gap-2.5">
                          <div className="h-1.5 w-16 rounded-full overflow-hidden" style={{ background: "oklch(1 0 0 / 0.06)" }}>
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${p.completionRate}%`,
                                background: "linear-gradient(90deg, oklch(0.62 0.24 278 / 0.8), oklch(0.62 0.24 278 / 0.5))",
                              }}
                            />
                          </div>
                          <span className="text-xs font-mono font-semibold text-foreground">{p.completionRate}%</span>
                        </div>
                      </td>
                      <td className="py-3.5 pr-4">
                        <span className={cn("text-xs font-bold font-mono", bottlenecks.length > 0 ? "text-red-400" : "text-emerald-400")}>
                          {bottlenecks.length}
                        </span>
                      </td>
                      <td className="py-3.5">
                        <span className={cn("text-xs font-bold font-mono", efficiency >= 70 ? "text-emerald-400" : efficiency >= 50 ? "text-amber-400" : "text-red-400")}>
                          {efficiency}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
