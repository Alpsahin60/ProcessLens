"use client";

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
import { cn } from "@/lib/utils";
import {
  PROCESSES,
  INSIGHTS,
  ACTIVITY,
  EFFICIENCY_TREND,
  CYCLE_TIME_TREND,
  PROCESS_VOLUME,
} from "@/lib/mock-data";
import { formatDistanceToNow } from "date-fns";

const FADE_UP = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.35, ease: [0.4, 0, 0.2, 1] },
  }),
};

const KPI_CARDS = [
  {
    label: "Total Processes",
    value: "4",
    trend: "+1 this month",
    direction: "up" as const,
    icon: GitBranch,
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    label: "Avg Cycle Time",
    value: "68h",
    trend: "–5.5% vs last week",
    direction: "down" as const,
    icon: Clock,
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
    positive: true,
  },
  {
    label: "Active Bottlenecks",
    value: "5",
    trend: "–2 vs last week",
    direction: "down" as const,
    icon: AlertTriangle,
    color: "text-amber-400",
    bg: "bg-amber-400/10",
    positive: true,
  },
  {
    label: "Team Members",
    value: "5",
    trend: "2 active today",
    direction: "up" as const,
    icon: Users,
    color: "text-cyan-400",
    bg: "bg-cyan-400/10",
  },
];

const STATUS_MAP = {
  active: { label: "Active", cls: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20" },
  draft: { label: "Draft", cls: "bg-zinc-500/15 text-zinc-400 border-zinc-500/20" },
  optimizing: { label: "Optimizing", cls: "bg-amber-500/15 text-amber-400 border-amber-500/20" },
  archived: { label: "Archived", cls: "bg-zinc-700/30 text-zinc-500 border-zinc-700/20" },
};

const SEVERITY_MAP = {
  critical: { cls: "bg-red-500/10 border-red-500/20", icon: "text-red-400", badge: "bg-red-500/15 text-red-400" },
  warning: { cls: "bg-amber-500/10 border-amber-500/20", icon: "text-amber-400", badge: "bg-amber-500/15 text-amber-400" },
  info: { cls: "bg-blue-500/10 border-blue-500/20", icon: "text-blue-400", badge: "bg-blue-500/15 text-blue-400" },
};

const ACTIVITY_ICONS: Record<string, string> = {
  comment: "💬",
  edit: "✏️",
  share: "🔗",
  alert: "🚨",
  version: "📦",
};

export default function DashboardPage() {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Topbar
        breadcrumbs={[{ label: "Dashboard" }]}
      />
      <main className="flex-1 overflow-y-auto scrollbar-thin px-6 py-6">
        {/* KPI Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {KPI_CARDS.map((kpi, i) => (
            <motion.div
              key={kpi.label}
              custom={i}
              initial="hidden"
              animate="visible"
              variants={FADE_UP}
              className="card p-5 rounded-xl border border-border bg-card hover:border-white/12 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <p className="text-xs font-medium text-muted-foreground">{kpi.label}</p>
                <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", kpi.bg)}>
                  <kpi.icon className={cn("w-4 h-4", kpi.color)} />
                </div>
              </div>
              <p className="text-2xl font-bold text-foreground tracking-tight mb-1">{kpi.value}</p>
              <div className={cn("flex items-center gap-1 text-xs", kpi.positive ? "text-emerald-400" : "text-muted-foreground")}>
                {kpi.direction === "up" ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                {kpi.trend}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          {/* Efficiency chart */}
          <motion.div
            custom={4}
            initial="hidden"
            animate="visible"
            variants={FADE_UP}
            className="lg:col-span-2 p-5 rounded-xl border border-border bg-card"
          >
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-sm font-semibold text-foreground">Process Efficiency</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Overall efficiency score across all active processes
                </p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-foreground">74%</p>
                <p className="text-xs text-emerald-400 flex items-center gap-1 justify-end">
                  <TrendingUp className="w-3 h-3" /> +16pp since Jan
                </p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={EFFICIENCY_TREND} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
                <defs>
                  <linearGradient id="effGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: "rgb(var(--muted-foreground))" }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "rgba(255,255,255,0.3)" }} tickLine={false} axisLine={false} domain={[40, 100]} />
                <Tooltip
                  contentStyle={{ background: "oklch(0.10 0.01 265)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", fontSize: "12px" }}
                  labelStyle={{ color: "oklch(0.95 0.006 260)" }}
                />
                <Area
                  type="monotone"
                  dataKey="baseline"
                  stroke="rgba(255,255,255,0.1)"
                  strokeDasharray="4 4"
                  fill="none"
                  strokeWidth={1}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#6366f1"
                  strokeWidth={2}
                  fill="url(#effGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Volume chart */}
          <motion.div
            custom={5}
            initial="hidden"
            animate="visible"
            variants={FADE_UP}
            className="p-5 rounded-xl border border-border bg-card"
          >
            <div className="mb-5">
              <p className="text-sm font-semibold text-foreground">Process Volume</p>
              <p className="text-xs text-muted-foreground mt-0.5">Instances this week</p>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={PROCESS_VOLUME} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: "rgba(255,255,255,0.3)" }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "rgba(255,255,255,0.3)" }} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ background: "oklch(0.10 0.01 265)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", fontSize: "12px" }}
                />
                <Bar dataKey="value" fill="rgba(99, 102, 241, 0.5)" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Processes + Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          {/* Recent Processes */}
          <motion.div
            custom={6}
            initial="hidden"
            animate="visible"
            variants={FADE_UP}
            className="lg:col-span-2 p-5 rounded-xl border border-border bg-card"
          >
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-semibold text-foreground">Processes</p>
              <Link href="/processes" className="text-xs text-primary hover:text-primary/80 flex items-center gap-1 transition-colors">
                View all <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="space-y-2">
              {PROCESSES.map((p) => {
                const status = STATUS_MAP[p.status];
                const maxBottleneck = Math.max(...p.nodes.map((n) => n.bottleneckScore));
                return (
                  <Link
                    key={p.id}
                    href={`/processes/${p.id}`}
                    className="flex items-center gap-4 p-3 rounded-lg border border-border hover:border-white/12 hover:bg-white/3 transition-all group"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
                        {p.name}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">{p.description}</p>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <div className="text-right hidden sm:block">
                        <p className="text-xs font-medium text-foreground">{p.avgCycleTimeHours}h</p>
                        <p className="text-[10px] text-muted-foreground">cycle time</p>
                      </div>
                      {maxBottleneck > 60 && (
                        <div className="flex items-center gap-1 text-[10px] text-red-400">
                          <AlertTriangle className="w-3 h-3" />
                          <span>{maxBottleneck}</span>
                        </div>
                      )}
                      <span className={cn("text-[10px] px-2 py-0.5 rounded-md font-medium border", status.cls)}>
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
            className="p-5 rounded-xl border border-border bg-card"
          >
            <p className="text-sm font-semibold text-foreground mb-4">Activity</p>
            <div className="space-y-3">
              {ACTIVITY.slice(0, 6).map((item) => (
                <div key={item.id} className="flex items-start gap-2.5">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-semibold flex-shrink-0 mt-0.5"
                    style={{ backgroundColor: item.userColor + "20", color: item.userColor }}
                  >
                    {item.userInitials.substring(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-foreground leading-relaxed">
                      <span className="font-medium">{item.user}</span>{" "}
                      <span className="text-muted-foreground">{item.action}</span>{" "}
                      <span className="font-medium">{item.target}</span>
                    </p>
                    <p className="text-[10px] text-muted-foreground/60 mt-0.5">
                      {formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}
                    </p>
                  </div>
                </div>
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
          className="p-5 rounded-xl border border-border bg-card"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-primary/15 flex items-center justify-center">
                <Zap className="w-3.5 h-3.5 text-primary" />
              </div>
              <p className="text-sm font-semibold text-foreground">Insights Engine</p>
            </div>
            <Badge className="text-[10px] bg-primary/15 text-primary border-primary/20 border">
              {INSIGHTS.filter((i) => i.severity === "critical").length} critical
            </Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {INSIGHTS.slice(0, 3).map((insight) => {
              const sev = SEVERITY_MAP[insight.severity];
              return (
                <Link
                  key={insight.id}
                  href={`/processes/${insight.processId}`}
                  className={cn(
                    "p-4 rounded-lg border hover:scale-[1.01] transition-all cursor-pointer group",
                    sev.cls
                  )}
                >
                  <div className="flex items-start gap-2.5 mb-2">
                    <AlertTriangle className={cn("w-4 h-4 flex-shrink-0 mt-0.5", sev.icon)} />
                    <p className="text-xs font-semibold text-foreground leading-tight">{insight.title}</p>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                    {insight.description}
                  </p>
                  <div className="flex items-center justify-between mt-3">
                    <span className={cn("text-[10px] px-1.5 py-0.5 rounded font-medium", sev.badge)}>
                      {insight.impactPercent}% impact
                    </span>
                    <span className="text-[10px] text-muted-foreground">{insight.processName}</span>
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
