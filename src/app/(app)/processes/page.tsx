"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Plus,
  Search,
  GitBranch,
  AlertTriangle,
  Clock,
  ArrowRight,
  Layers,
} from "lucide-react";
import { Topbar } from "@/components/layout/topbar";
import { Input } from "@/components/ui/input";
import { getProcesses } from "@/lib/api";
import { cn } from "@/lib/utils";
import { PROCESSES } from "@/lib/mock-data";
import { formatDistanceToNow } from "date-fns";

const STATUS_MAP = {
  active: { label: "Active", cls: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20" },
  draft: { label: "Draft", cls: "bg-zinc-500/15 text-zinc-400 border-zinc-500/20" },
  optimizing: { label: "Optimizing", cls: "bg-amber-500/15 text-amber-400 border-amber-500/20" },
  archived: { label: "Archived", cls: "bg-zinc-700/30 text-zinc-500 border-zinc-700/20" },
};

const STATUS_DOT = {
  active: "bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.8)]",
  draft: "bg-zinc-500",
  optimizing: "bg-amber-500 shadow-[0_0_6px_rgba(245,158,11,0.7)]",
  archived: "bg-zinc-700",
};

const FADE_UP: import("framer-motion").Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.055, duration: 0.35, ease: "easeOut" },
  }),
};

export default function ProcessesPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [processes, setProcesses] = useState(PROCESSES);

  useEffect(() => {
    let active = true;
    getProcesses().then((data) => {
      if (active) setProcesses(data);
    });
    return () => { active = false; };
  }, []);

  const filtered = processes.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    const matchStatus = statusFilter === "all" || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Topbar
        breadcrumbs={[{ label: "Processes" }]}
        actions={
          <Link
            href="/processes/new"
            className="flex items-center gap-1.5 h-8 px-3.5 rounded-lg text-xs font-semibold text-white transition-all duration-200 hover:opacity-90 cursor-pointer"
            style={{
              background: "linear-gradient(135deg, oklch(0.62 0.24 278), oklch(0.60 0.24 298))",
              boxShadow: "0 0 10px oklch(0.62 0.24 278 / 0.35)",
            }}
          >
            <Plus className="w-3.5 h-3.5" />
            New Process
          </Link>
        }
      />

      <main className="flex-1 overflow-y-auto scrollbar-thin px-6 py-6 space-y-5">
        {/* Page header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-xl font-semibold text-foreground tracking-tight">Processes</h1>
            <p className="text-sm text-muted-foreground mt-0.5">{processes.length} total processes mapped</p>
          </div>
        </motion.div>

        {/* Stats row */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: "Total", value: processes.length, color: "text-foreground", stripe: "from-white/4", icon: Layers, iconColor: "text-muted-foreground" },
            { label: "Active", value: processes.filter((p) => p.status === "active").length, color: "text-emerald-400", stripe: "from-emerald-500/8", icon: GitBranch, iconColor: "text-emerald-400" },
            { label: "Bottlenecks", value: processes.flatMap((p) => p.nodes).filter((n) => n.bottleneckScore >= 60).length, color: "text-red-400", stripe: "from-red-500/8", icon: AlertTriangle, iconColor: "text-red-400" },
            { label: "Avg Cycle", value: `${Math.round(processes.reduce((a, p) => a + p.avgCycleTimeHours, 0) / Math.max(processes.length, 1))}h`, color: "text-primary", stripe: "from-primary/8", icon: Clock, iconColor: "text-primary" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              custom={i}
              initial="hidden"
              animate="visible"
              variants={FADE_UP}
              className={cn(
                "relative p-4 rounded-2xl border border-border bg-card overflow-hidden text-center",
              )}
              style={{ boxShadow: "0 1px 0 oklch(1 0 0 / 0.06) inset, 0 4px 12px oklch(0 0 0 / 0.16)" }}
            >
              <div className={cn("absolute inset-0 bg-gradient-to-br to-transparent pointer-events-none", stat.stripe)} />
              <div className="relative">
                <stat.icon className={cn("w-4 h-4 mx-auto mb-2", stat.iconColor)} />
                <p className={cn("text-2xl font-bold font-mono", stat.color)}>{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.3 }}
          className="flex items-center gap-3"
        >
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground/60" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search processes..."
              className="pl-9 h-9 bg-white/4 border-white/8 text-sm placeholder:text-muted-foreground/50 focus:border-primary/50 rounded-xl"
            />
          </div>
          <div className="flex items-center gap-1 p-0.5 rounded-xl border border-white/7 bg-white/3">
            {["all", "active", "optimizing", "draft", "archived"].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={cn(
                  "h-8 px-3 rounded-lg text-xs font-medium transition-all duration-200 capitalize cursor-pointer",
                  statusFilter === s
                    ? "bg-white/10 text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Process Grid */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-20 text-center">
            <div className="w-14 h-14 rounded-2xl bg-white/4 border border-white/8 flex items-center justify-center">
              <GitBranch className="w-7 h-7 text-muted-foreground/40" />
            </div>
            <p className="text-sm font-medium text-foreground">No processes found</p>
            <p className="text-xs text-muted-foreground">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-4">
            {filtered.map((p, i) => {
              const status = STATUS_MAP[p.status];
              const bottlenecks = p.nodes.filter((n) => n.bottleneckScore >= 60);
              return (
                <motion.div
                  key={p.id}
                  custom={i}
                  initial="hidden"
                  animate="visible"
                  variants={FADE_UP}
                >
                  <Link
                    href={`/processes/${p.id}`}
                    className="flex flex-col p-5 rounded-2xl border border-border bg-card transition-all duration-300 group cursor-pointer relative overflow-hidden"
                    style={{ boxShadow: "0 1px 0 oklch(1 0 0 / 0.06) inset, 0 4px 16px oklch(0 0 0 / 0.18)" }}
                  >
                    {/* Hover gradient */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                      style={{ background: "radial-gradient(circle at 0% 0%, oklch(0.62 0.24 278 / 0.06), transparent 60%)" }}
                    />

                    {/* Top border glow on hover */}
                    <div
                      className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ background: "linear-gradient(90deg, transparent, oklch(0.62 0.24 278 / 0.5), transparent)" }}
                    />

                    <div className="relative">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", STATUS_DOT[p.status])} />
                            <span className={cn("text-[10px] px-2 py-0.5 rounded-lg font-semibold border", status.cls)}>
                              {status.label}
                            </span>
                            <span className="text-[10px] text-muted-foreground/50 font-mono">v{p.version}</span>
                          </div>
                          <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors duration-200 truncate">
                            {p.name}
                          </h3>
                          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{p.description}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-muted-foreground/30 group-hover:text-primary group-hover:translate-x-0.5 transition-all duration-200 shrink-0 ml-3 mt-1" />
                      </div>

                      {/* Metrics */}
                      <div className="grid grid-cols-3 gap-3 mb-4 pt-3 border-t border-border/50">
                        <div>
                          <p className="text-[10px] text-muted-foreground/60 uppercase tracking-wide">Cycle Time</p>
                          <p className="text-sm font-bold text-foreground flex items-center gap-1 mt-1 font-mono">
                            <Clock className="w-3 h-3 text-primary" />
                            {p.avgCycleTimeHours}h
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] text-muted-foreground/60 uppercase tracking-wide">Completion</p>
                          <p className="text-sm font-bold text-foreground mt-1 font-mono">{p.completionRate}%</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-muted-foreground/60 uppercase tracking-wide">Bottlenecks</p>
                          <p className={cn("text-sm font-bold mt-1 flex items-center gap-1 font-mono", bottlenecks.length > 0 ? "text-red-400" : "text-emerald-400")}>
                            {bottlenecks.length > 0 && <AlertTriangle className="w-3 h-3" />}
                            {bottlenecks.length}
                          </p>
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div className="mb-3">
                        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "oklch(1 0 0 / 0.06)" }}>
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${p.completionRate}%` }}
                            transition={{ duration: 0.8, delay: i * 0.07 + 0.3, ease: "easeOut" }}
                            className="h-full rounded-full"
                            style={{
                              background: "linear-gradient(90deg, oklch(0.62 0.24 278 / 0.8), oklch(0.62 0.24 278 / 0.5))",
                            }}
                          />
                        </div>
                      </div>

                      {/* Tags */}
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {p.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] px-2 py-0.5 rounded-lg bg-white/4 border border-white/7 text-muted-foreground"
                          >
                            {tag}
                          </span>
                        ))}
                        <span className="ml-auto text-[10px] text-muted-foreground/40">
                          {formatDistanceToNow(new Date(p.updatedAt), { addSuffix: true })}
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
