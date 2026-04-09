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

const FADE_UP: import("framer-motion").Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.3 },
  }),
};

export default function ProcessesPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [processes, setProcesses] = useState(PROCESSES);

  useEffect(() => {
    let active = true;

    getProcesses().then((data) => {
      if (active) {
        setProcesses(data);
      }
    });

    return () => {
      active = false;
    };
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
            className="flex items-center gap-1.5 h-8 px-3 rounded-md bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            New Process
          </Link>
        }
      />
      <main className="flex-1 overflow-y-auto scrollbar-thin px-6 py-6">
        {/* Filters */}
        <div className="flex items-center gap-3 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search processes..."
              className="pl-9 h-9 bg-white/5 border-white/10 text-sm placeholder:text-muted-foreground/60 focus:border-primary/50"
            />
          </div>
          <div className="flex items-center gap-1.5">
            {["all", "active", "optimizing", "draft", "archived"].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={cn(
                  "h-8 px-3 rounded-md text-xs font-medium transition-all capitalize",
                  statusFilter === s
                    ? "bg-primary/15 text-primary border border-primary/30"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5 border border-transparent"
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          {[
            { label: "Total", value: processes.length, color: "text-foreground" },
            {
              label: "Active",
              value: processes.filter((p) => p.status === "active").length,
              color: "text-emerald-400",
            },
            {
              label: "Bottlenecks",
              value: processes.flatMap((p) => p.nodes).filter((n) => n.bottleneckScore >= 60).length,
              color: "text-red-400",
            },
            {
              label: "Avg Cycle",
              value: `${Math.round(processes.reduce((a, p) => a + p.avgCycleTimeHours, 0) / Math.max(processes.length, 1))}h`,
              color: "text-primary",
            },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              custom={i}
              initial="hidden"
              animate="visible"
              variants={FADE_UP}
              className="p-4 rounded-xl border border-border bg-card text-center"
            >
              <p className={cn("text-xl font-bold", stat.color)}>{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Process Grid */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center">
              <GitBranch className="w-6 h-6 text-muted-foreground/40" />
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
                    className="flex flex-col p-5 rounded-xl border border-border bg-card hover:border-white/15 hover:bg-white/3 transition-all group cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={cn("text-[10px] px-2 py-0.5 rounded-md font-medium border", status.cls)}>
                            {status.label}
                          </span>
                          <span className="text-[10px] text-muted-foreground/60">v{p.version}</span>
                        </div>
                        <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                          {p.name}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{p.description}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0 ml-3 mt-1" />
                    </div>

                    {/* Metrics */}
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <div>
                        <p className="text-[10px] text-muted-foreground">Cycle Time</p>
                        <p className="text-sm font-semibold text-foreground flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3 text-primary" />
                          {p.avgCycleTimeHours}h
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground">Completion</p>
                        <p className="text-sm font-semibold text-foreground mt-0.5">{p.completionRate}%</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground">Bottlenecks</p>
                        <p
                          className={cn(
                            "text-sm font-semibold mt-0.5 flex items-center gap-1",
                            bottlenecks.length > 0 ? "text-red-400" : "text-emerald-400"
                          )}
                        >
                          {bottlenecks.length > 0 && <AlertTriangle className="w-3 h-3" />}
                          {bottlenecks.length}
                        </p>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="mb-3">
                      <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-1.5">
                        <span>Completion rate</span>
                        <span>{p.completionRate}%</span>
                      </div>
                      <div className="h-1 rounded-full bg-white/8">
                        <div
                          className="h-full rounded-full bg-primary/60"
                          style={{ width: `${p.completionRate}%` }}
                        />
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {p.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 border border-white/8 text-muted-foreground"
                        >
                          {tag}
                        </span>
                      ))}
                      <span className="ml-auto text-[10px] text-muted-foreground/60">
                        {formatDistanceToNow(new Date(p.updatedAt), { addSuffix: true })}
                      </span>
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
