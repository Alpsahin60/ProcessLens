"use client";

import { useState } from "react";
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
import { TrendingUp, TrendingDown, Clock, AlertTriangle, GitBranch, Filter } from "lucide-react";
import { Topbar } from "@/components/layout/topbar";
import { cn } from "@/lib/utils";
import {
  PROCESSES,
  EFFICIENCY_TREND,
  CYCLE_TIME_TREND,
  BOTTLENECK_TREND,
  PROCESS_VOLUME,
} from "@/lib/mock-data";

const FADE_UP = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.3 },
  }),
};

const PROCESS_COMPARISON = PROCESSES.map((p) => ({
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

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<"week" | "month" | "quarter">("month");

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Topbar
        breadcrumbs={[{ label: "Analytics" }]}
        actions={
          <div className="flex items-center gap-1.5 p-0.5 rounded-lg bg-white/5 border border-white/8">
            {(["week", "month", "quarter"] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={cn(
                  "h-7 px-3 rounded-md text-xs font-medium capitalize transition-all",
                  period === p
                    ? "bg-white/10 text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {p}
              </button>
            ))}
          </div>
        }
      />
      <main className="flex-1 overflow-y-auto scrollbar-thin px-6 py-6 space-y-6">
        {/* KPI row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: "Efficiency Score",
              value: "74%",
              change: "+16pp",
              up: true,
              icon: TrendingUp,
              color: "text-primary",
              bg: "bg-primary/10",
            },
            {
              label: "Avg Cycle Time",
              value: "68h",
              change: "–23% vs Q1",
              up: false,
              icon: Clock,
              color: "text-emerald-400",
              bg: "bg-emerald-400/10",
              positive: true,
            },
            {
              label: "Bottleneck Rate",
              value: "24%",
              change: "–8pp this month",
              up: false,
              icon: AlertTriangle,
              color: "text-amber-400",
              bg: "bg-amber-400/10",
              positive: true,
            },
            {
              label: "Process Instances",
              value: "100",
              change: "+18% vs last week",
              up: true,
              icon: GitBranch,
              color: "text-cyan-400",
              bg: "bg-cyan-400/10",
            },
          ].map((kpi, i) => (
            <motion.div
              key={kpi.label}
              custom={i}
              initial="hidden"
              animate="visible"
              variants={FADE_UP}
              className="p-5 rounded-xl border border-border bg-card"
            >
              <div className="flex items-start justify-between mb-4">
                <p className="text-xs font-medium text-muted-foreground">{kpi.label}</p>
                <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", kpi.bg)}>
                  <kpi.icon className={cn("w-4 h-4", kpi.color)} />
                </div>
              </div>
              <p className="text-2xl font-bold text-foreground tracking-tight mb-1">{kpi.value}</p>
              <p
                className={cn(
                  "text-xs flex items-center gap-1",
                  kpi.positive ? "text-emerald-400" : kpi.up ? "text-emerald-400" : "text-muted-foreground"
                )}
              >
                {kpi.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {kpi.change}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Charts row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <motion.div custom={4} initial="hidden" animate="visible" variants={FADE_UP} className="p-5 rounded-xl border border-border bg-card">
            <p className="text-sm font-semibold text-foreground mb-1">Efficiency Over Time</p>
            <p className="text-xs text-muted-foreground mb-4">Composite score across all processes</p>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={EFFICIENCY_TREND} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: "rgba(255,255,255,0.35)" }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "rgba(255,255,255,0.35)" }} tickLine={false} axisLine={false} domain={[40, 100]} />
                <Tooltip contentStyle={{ background: "oklch(0.10 0.01 265)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", fontSize: "12px" }} />
                <Area type="monotone" dataKey="baseline" stroke="rgba(255,255,255,0.15)" strokeDasharray="4 4" fill="none" strokeWidth={1} />
                <Area type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={2.5} fill="url(#g1)" />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div custom={5} initial="hidden" animate="visible" variants={FADE_UP} className="p-5 rounded-xl border border-border bg-card">
            <p className="text-sm font-semibold text-foreground mb-1">Cycle Time Reduction</p>
            <p className="text-xs text-muted-foreground mb-4">Average hours per process instance</p>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={CYCLE_TIME_TREND} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: "rgba(255,255,255,0.35)" }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "rgba(255,255,255,0.35)" }} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "oklch(0.10 0.01 265)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", fontSize: "12px" }} />
                <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2.5} dot={{ fill: "#10b981", r: 3 }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Charts row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <motion.div custom={6} initial="hidden" animate="visible" variants={FADE_UP} className="lg:col-span-2 p-5 rounded-xl border border-border bg-card">
            <p className="text-sm font-semibold text-foreground mb-1">Process Comparison</p>
            <p className="text-xs text-muted-foreground mb-4">Cycle time vs completion rate by process</p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={PROCESS_COMPARISON} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: "rgba(255,255,255,0.35)" }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "rgba(255,255,255,0.35)" }} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "oklch(0.10 0.01 265)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", fontSize: "12px" }} />
                <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "12px" }} />
                <Bar dataKey="cycleTime" fill="rgba(99,102,241,0.6)" radius={[3, 3, 0, 0]} name="Cycle Time (h)" />
                <Bar dataKey="completion" fill="rgba(16,185,129,0.6)" radius={[3, 3, 0, 0]} name="Completion %" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div custom={7} initial="hidden" animate="visible" variants={FADE_UP} className="p-5 rounded-xl border border-border bg-card">
            <p className="text-sm font-semibold text-foreground mb-1">Performance Radar</p>
            <p className="text-xs text-muted-foreground mb-4">Current vs target</p>
            <ResponsiveContainer width="100%" height={200}>
              <RadarChart data={RADAR_DATA}>
                <PolarGrid stroke="rgba(255,255,255,0.08)" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: "rgba(255,255,255,0.4)" }} />
                <Radar name="Current" dataKey="A" stroke="#6366f1" fill="#6366f1" fillOpacity={0.2} />
                <Radar name="Target" dataKey="B" stroke="#10b981" fill="#10b981" fillOpacity={0.1} strokeDasharray="4 4" />
                <Legend wrapperStyle={{ fontSize: "11px" }} />
              </RadarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Process breakdown table */}
        <motion.div custom={8} initial="hidden" animate="visible" variants={FADE_UP} className="p-5 rounded-xl border border-border bg-card">
          <p className="text-sm font-semibold text-foreground mb-4">Process Breakdown</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {["Process", "Status", "Cycle Time", "Completion", "Bottlenecks", "Efficiency"].map((h) => (
                    <th key={h} className="text-left text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 pb-3 pr-4">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {PROCESSES.map((p) => {
                  const bottlenecks = p.nodes.filter((n) => n.bottleneckScore >= 60);
                  const efficiency = Math.round((p.completionRate * (1 - bottlenecks.length * 0.1)));
                  return (
                    <tr key={p.id} className="border-b border-border/50 hover:bg-white/3 transition-colors">
                      <td className="py-3 pr-4">
                        <p className="text-xs font-medium text-foreground">{p.name}</p>
                        <p className="text-[10px] text-muted-foreground">{p.nodes.length} nodes</p>
                      </td>
                      <td className="py-3 pr-4">
                        <span className={cn(
                          "text-[10px] px-1.5 py-0.5 rounded font-medium",
                          p.status === "active" ? "bg-emerald-500/15 text-emerald-400" :
                          p.status === "optimizing" ? "bg-amber-500/15 text-amber-400" :
                          "bg-zinc-500/15 text-zinc-400"
                        )}>
                          {p.status}
                        </span>
                      </td>
                      <td className="py-3 pr-4 font-mono text-xs text-foreground">{p.avgCycleTimeHours}h</td>
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-2">
                          <div className="h-1 w-16 rounded-full bg-white/8">
                            <div className="h-full rounded-full bg-primary/60" style={{ width: `${p.completionRate}%` }} />
                          </div>
                          <span className="text-xs text-foreground">{p.completionRate}%</span>
                        </div>
                      </td>
                      <td className="py-3 pr-4">
                        <span className={cn("text-xs font-medium", bottlenecks.length > 0 ? "text-red-400" : "text-emerald-400")}>
                          {bottlenecks.length}
                        </span>
                      </td>
                      <td className="py-3">
                        <span className={cn("text-xs font-semibold", efficiency >= 70 ? "text-emerald-400" : efficiency >= 50 ? "text-amber-400" : "text-red-400")}>
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
