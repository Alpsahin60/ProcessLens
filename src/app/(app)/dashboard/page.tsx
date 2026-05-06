"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  GitBranch,
  Clock,
  AlertTriangle,
  Users,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Zap,
  Activity,
} from "lucide-react";
import Link from "next/link";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { Topbar } from "@/components/layout/topbar";
import { Badge } from "@/components/ui/badge";
import { getDashboardData } from "@/lib/api";
import { cn } from "@/lib/utils";
import {
  PROCESSES,
  INSIGHTS,
  ACTIVITY,
  EFFICIENCY_TREND,
  PROCESS_VOLUME,
} from "@/lib/mock-data";
import { formatDistanceToNow } from "date-fns";

const FADE_UP: import("framer-motion").Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.4, ease: "easeOut" },
  }),
};

const STATUS_MAP = {
  active: { label: "Active", cls: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20" },
  draft: { label: "Draft", cls: "bg-zinc-500/15 text-zinc-400 border-zinc-500/20" },
  optimizing: { label: "Optimizing", cls: "bg-amber-500/15 text-amber-400 border-amber-500/20" },
  archived: { label: "Archived", cls: "bg-zinc-700/30 text-zinc-500 border-zinc-700/20" },
};

const SEVERITY_MAP = {
  critical: { cls: "bg-red-500/8 border-red-500/20", icon: "text-red-400", badge: "bg-red-500/15 text-red-400", glow: "hover:shadow-[0_0_20px_oklch(0.65_0.22_25/0.15)]" },
  warning: { cls: "bg-amber-500/8 border-amber-500/20", icon: "text-amber-400", badge: "bg-amber-500/15 text-amber-400", glow: "hover:shadow-[0_0_20px_oklch(0.80_0.20_70/0.12)]" },
  info: { cls: "bg-blue-500/8 border-blue-500/20", icon: "text-blue-400", badge: "bg-blue-500/15 text-blue-400", glow: "hover:shadow-none" },
};

interface KpiConfig {
  label: string;
  value: string;
  trend: string;
  direction: "up" | "down";
  positive?: boolean;
  icon: React.ElementType;
  color: string;
  iconBg: string;
  stripe: string;
  accentColor: string;
}

export default function DashboardPage() {
  const [processes, setProcesses] = useState(PROCESSES);
  const [insights, setInsights] = useState(INSIGHTS);
  const [efficiencyTrend, setEfficiencyTrend] = useState(EFFICIENCY_TREND);
  const [processVolume, setProcessVolume] = useState(PROCESS_VOLUME);
  const [kpis, setKpis] = useState({
    totalProcesses: 4,
    avgCycleTimeHours: 68,
    activeBottlenecks: 5,
    teamMembers: 5,
    efficiencyScore: 74,
    trends: { cycleTime: -5.5, bottlenecks: -2, efficiency: 16 },
  });

  useEffect(() => {
    let active = true;
    getDashboardData().then((data) => {
      if (!active) return;
      setProcesses(data.processes);
      setInsights(data.insights);
      setEfficiencyTrend(data.efficiencyTrend);
      setProcessVolume(data.processVolume);
      setKpis(data.kpis);
    });
    return () => { active = false; };
  }, []);

  const kpiCards: KpiConfig[] = [
    {
      label: "Total Processes",
      value: String(kpis.totalProcesses),
      trend: `${processes.filter((p) => p.status === "active").length} active`,
      direction: "up",
      icon: GitBranch,
      color: "text-primary",
      iconBg: "bg-primary/15",
      stripe: "from-primary/12",
      accentColor: "oklch(0.62 0.24 278)",
    },
    {
      label: "Avg Cycle Time",
      value: `${kpis.avgCycleTimeHours}h`,
      trend: `${kpis.trends.cycleTime}% vs last week`,
      direction: "down",
      positive: true,
      icon: Clock,
      color: "text-emerald-400",
      iconBg: "bg-emerald-400/12",
      stripe: "from-emerald-400/10",
      accentColor: "oklch(0.72 0.18 145)",
    },
    {
      label: "Active Bottlenecks",
      value: String(kpis.activeBottlenecks),
      trend: `${kpis.trends.bottlenecks} vs last week`,
      direction: "down",
      positive: true,
      icon: AlertTriangle,
      color: "text-amber-400",
      iconBg: "bg-amber-400/12",
      stripe: "from-amber-400/10",
      accentColor: "oklch(0.80 0.20 70)",
    },
    {
      label: "Team Members",
      value: String(kpis.teamMembers),
      trend: `${kpis.efficiencyScore}% efficiency score`,
      direction: "up",
      icon: Users,
      color: "text-cyan-400",
      iconBg: "bg-cyan-400/12",
      stripe: "from-cyan-400/10",
      accentColor: "oklch(0.72 0.20 200)",
    },
  ];

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Topbar breadcrumbs={[{ label: "Dashboard" }]} />

      <main className="flex-1 overflow-y-auto scrollbar-thin px-6 py-6 space-y-5">
        {/* Page header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-xl font-semibold text-foreground tracking-tight">Overview</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
            </p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/8 text-xs text-emerald-400 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-breathe" />
            All systems operational
          </div>
        </motion.div>

        {/* KPI Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {kpiCards.map((kpi, i) => (
            <motion.div
              key={kpi.label}
              custom={i}
              initial="hidden"
              animate="visible"
              variants={FADE_UP}
              className="relative p-5 rounded-2xl border border-border bg-card overflow-hidden cursor-default group transition-all duration-300 hover:-translate-y-0.5"
              style={{
                boxShadow: "0 1px 0 oklch(1 0 0 / 0.06) inset, 0 4px 16px oklch(0 0 0 / 0.2)",
              }}
            >
              {/* Gradient stripe */}
              <div
                className={cn("absolute inset-0 bg-gradient-to-br to-transparent pointer-events-none", kpi.stripe)}
              />
              {/* Hover glow */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{
                  background: `radial-gradient(circle at 0% 0%, ${kpi.accentColor}18, transparent 60%)`,
                }}
              />

              <div className="relative">
                <div className="flex items-start justify-between mb-4">
                  <p className="text-xs font-medium text-muted-foreground leading-tight">{kpi.label}</p>
                  <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center", kpi.iconBg)}>
                    <kpi.icon className={cn("w-4 h-4", kpi.color)} />
                  </div>
                </div>
                <p className="text-2xl font-bold text-foreground tracking-tight mb-1.5 font-mono">
                  {kpi.value}
                </p>
                <div className={cn("flex items-center gap-1 text-xs font-medium", kpi.positive ? "text-emerald-400" : "text-muted-foreground")}>
                  {kpi.direction === "up" ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {kpi.trend}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Efficiency chart */}
          <motion.div
            custom={4}
            initial="hidden"
            animate="visible"
            variants={FADE_UP}
            className="lg:col-span-2 p-5 rounded-2xl border border-border bg-card"
            style={{ boxShadow: "0 1px 0 oklch(1 0 0 / 0.06) inset, 0 4px 16px oklch(0 0 0 / 0.18)" }}
          >
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-sm font-semibold text-foreground">Process Efficiency</p>
                <p className="text-xs text-muted-foreground mt-0.5">Overall score across all active processes</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-foreground font-mono">{kpis.efficiencyScore}%</p>
                <p className="text-xs text-emerald-400 flex items-center gap-1 justify-end mt-0.5">
                  <TrendingUp className="w-3 h-3" /> +{kpis.trends.efficiency}pp since Jan
                </p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={185}>
              <AreaChart data={efficiencyTrend} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                <defs>
                  <linearGradient id="effGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="effGradLine" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#818cf8" />
                    <stop offset="100%" stopColor="#6366f1" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: "rgba(255,255,255,0.30)" }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "rgba(255,255,255,0.30)" }} tickLine={false} axisLine={false} domain={[40, 100]} />
                <Tooltip
                  contentStyle={{ background: "oklch(0.098 0.012 265)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", fontSize: "12px", boxShadow: "0 8px 32px rgba(0,0,0,0.4)" }}
                  labelStyle={{ color: "oklch(0.96 0.005 260)", fontWeight: 600 }}
                  cursor={{ stroke: "rgba(99,102,241,0.3)", strokeWidth: 1 }}
                />
                <Area type="monotone" dataKey="baseline" stroke="rgba(255,255,255,0.10)" strokeDasharray="4 4" fill="none" strokeWidth={1} />
                <Area type="monotone" dataKey="value" stroke="url(#effGradLine)" strokeWidth={2.5} fill="url(#effGrad)" dot={false} activeDot={{ r: 4, fill: "#6366f1", strokeWidth: 2, stroke: "#fff" }} />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Volume chart */}
          <motion.div
            custom={5}
            initial="hidden"
            animate="visible"
            variants={FADE_UP}
            className="p-5 rounded-2xl border border-border bg-card"
            style={{ boxShadow: "0 1px 0 oklch(1 0 0 / 0.06) inset, 0 4px 16px oklch(0 0 0 / 0.18)" }}
          >
            <div className="mb-5">
              <p className="text-sm font-semibold text-foreground">Process Volume</p>
              <p className="text-xs text-muted-foreground mt-0.5">Instances this week</p>
            </div>
            <ResponsiveContainer width="100%" height={185}>
              <BarChart data={processVolume} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                <defs>
                  <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.62 0.24 278)" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="oklch(0.62 0.24 278)" stopOpacity={0.3} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: "rgba(255,255,255,0.30)" }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "rgba(255,255,255,0.30)" }} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ background: "oklch(0.098 0.012 265)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", fontSize: "12px", boxShadow: "0 8px 32px rgba(0,0,0,0.4)" }}
                  cursor={{ fill: "rgba(255,255,255,0.03)" }}
                />
                <Bar dataKey="value" fill="url(#barGrad)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Processes + Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Recent Processes */}
          <motion.div
            custom={6}
            initial="hidden"
            animate="visible"
            variants={FADE_UP}
            className="lg:col-span-2 p-5 rounded-2xl border border-border bg-card"
            style={{ boxShadow: "0 1px 0 oklch(1 0 0 / 0.06) inset, 0 4px 16px oklch(0 0 0 / 0.18)" }}
          >
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-semibold text-foreground">Processes</p>
              <Link href="/processes" className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors font-medium">
                View all <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="space-y-1.5">
              {processes.map((p) => {
                const status = STATUS_MAP[p.status];
                const maxBottleneck = Math.max(...p.nodes.map((n) => n.bottleneckScore));
                return (
                  <Link
                    key={p.id}
                    href={`/processes/${p.id}`}
                    className="flex items-center gap-4 p-3 rounded-xl border border-border hover:border-white/10 hover:bg-white/3 transition-all duration-200 group cursor-pointer"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors duration-200">
                        {p.name}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">{p.description}</p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right hidden sm:block">
                        <p className="text-xs font-semibold text-foreground font-mono">{p.avgCycleTimeHours}h</p>
                        <p className="text-[10px] text-muted-foreground">cycle time</p>
                      </div>
                      {maxBottleneck > 60 && (
                        <div className="flex items-center gap-1 text-[10px] text-red-400 bg-red-500/10 px-1.5 py-0.5 rounded-md border border-red-500/20">
                          <AlertTriangle className="w-3 h-3" />
                          <span className="font-medium">{maxBottleneck}</span>
                        </div>
                      )}
                      <span className={cn("text-[10px] px-2 py-0.5 rounded-lg font-medium border", status.cls)}>
                        {status.label}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </motion.div>

          {/* Activity Feed */}
          <motion.div
            custom={7}
            initial="hidden"
            animate="visible"
            variants={FADE_UP}
            className="p-5 rounded-2xl border border-border bg-card"
            style={{ boxShadow: "0 1px 0 oklch(1 0 0 / 0.06) inset, 0 4px 16px oklch(0 0 0 / 0.18)" }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-3.5 h-3.5 text-muted-foreground" />
              <p className="text-sm font-semibold text-foreground">Activity</p>
            </div>
            <div className="space-y-3.5">
              {ACTIVITY.slice(0, 6).map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.05, duration: 0.25 }}
                  className="flex items-start gap-2.5"
                >
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-semibold shrink-0 mt-0.5"
                    style={{ backgroundColor: item.userColor + "22", color: item.userColor }}
                  >
                    {item.userInitials.substring(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-foreground leading-relaxed">
                      <span className="font-medium">{item.user}</span>{" "}
                      <span className="text-muted-foreground">{item.action}</span>{" "}
                      <span className="font-medium">{item.target}</span>
                    </p>
                    <p className="text-[10px] text-muted-foreground/50 mt-0.5">
                      {formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Insights */}
        <motion.div
          custom={8}
          initial="hidden"
          animate="visible"
          variants={FADE_UP}
          className="p-5 rounded-2xl border border-border bg-card"
          style={{ boxShadow: "0 1px 0 oklch(1 0 0 / 0.06) inset, 0 4px 16px oklch(0 0 0 / 0.18)" }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div
                className="w-7 h-7 rounded-xl flex items-center justify-center"
                style={{ background: "oklch(0.62 0.24 278 / 0.18)" }}
              >
                <Zap className="w-3.5 h-3.5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Insights Engine</p>
                <p className="text-xs text-muted-foreground">Rule-based analysis</p>
              </div>
            </div>
            <Badge className="text-[10px] bg-red-500/12 text-red-400 border-red-500/20 border px-2">
              {insights.filter((i) => i.severity === "critical").length} critical
            </Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {insights.slice(0, 3).map((insight) => {
              const sev = SEVERITY_MAP[insight.severity];
              return (
                <Link
                  key={insight.id}
                  href={`/processes/${insight.processId}`}
                  className={cn(
                    "p-4 rounded-xl border transition-all duration-200 cursor-pointer group",
                    sev.cls,
                    sev.glow
                  )}
                >
                  <div className="flex items-start gap-2.5 mb-2.5">
                    <AlertTriangle className={cn("w-4 h-4 shrink-0 mt-0.5", sev.icon)} />
                    <p className="text-xs font-semibold text-foreground leading-tight">{insight.title}</p>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                    {insight.description}
                  </p>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
                    <span className={cn("text-[10px] px-2 py-0.5 rounded-md font-semibold", sev.badge)}>
                      {insight.impactPercent}% impact
                    </span>
                    <span className="text-[10px] text-muted-foreground group-hover:text-primary transition-colors flex items-center gap-1">
                      {insight.processName} <ArrowRight className="w-2.5 h-2.5" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
