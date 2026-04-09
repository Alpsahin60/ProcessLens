"use client";

import { use, useEffect, useState } from "react";
import { notFound } from "next/navigation";
import { motion } from "framer-motion";
import {
  Clock,
  AlertTriangle,
  Save,
  Share2,
  History,
  List,
  Calendar,
  Zap,
  GitBranch,
} from "lucide-react";
import { Topbar } from "@/components/layout/topbar";
import { FlowCanvas } from "@/components/process/flow-canvas";
import { getProcess, getProcessInsights } from "@/lib/api";
import { cn } from "@/lib/utils";
import { PROCESSES, INSIGHTS } from "@/lib/mock-data";
import { useAppStore } from "@/store/app-store";

const VIEW_MODES = ["flow", "table", "timeline"] as const;
type ViewMode = (typeof VIEW_MODES)[number];

const STATUS_MAP = {
  active: { label: "Active", cls: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20" },
  draft: { label: "Draft", cls: "bg-zinc-500/15 text-zinc-400 border-zinc-500/20" },
  optimizing: { label: "Optimizing", cls: "bg-amber-500/15 text-amber-400 border-amber-500/20" },
  archived: { label: "Archived", cls: "bg-zinc-700/30 text-zinc-500 border-zinc-700/20" },
};

export default function ProcessDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const fallbackProcess = PROCESSES.find((p) => p.id === id);
  const [process, setProcess] = useState(fallbackProcess);
  const [insights, setInsights] = useState(INSIGHTS.filter((i) => i.processId === id));
  const [viewMode, setViewMode] = useState<ViewMode>("flow");
  const { simulationMode } = useAppStore();

  useEffect(() => {
    let active = true;

    Promise.all([getProcess(id), getProcessInsights(id)]).then(([nextProcess, nextInsights]) => {
      if (!active) return;
      if (nextProcess) {
        setProcess(nextProcess);
      }
      setInsights(nextInsights);
    });

    return () => {
      active = false;
    };
  }, [id]);

  if (!process) notFound();
  const status = STATUS_MAP[process.status];
  const criticalNodes = process.nodes.filter((n) => n.bottleneckScore >= 60);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Topbar
        breadcrumbs={[
          { label: "Processes", href: "/processes" },
          { label: process.name },
        ]}
        actions={
          <div className="flex items-center gap-2">
            {/* View mode switcher */}
            <div className="flex items-center gap-0.5 p-0.5 rounded-lg bg-white/5 border border-white/8">
              {VIEW_MODES.map((mode) => {
                const Icon = mode === "flow" ? GitBranch : mode === "table" ? List : Calendar;
                return (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    className={cn(
                      "flex items-center gap-1.5 h-7 px-2.5 rounded-md text-xs font-medium capitalize transition-all",
                      viewMode === mode
                        ? "bg-white/10 text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <Icon className="w-3 h-3" />
                    {mode}
                  </button>
                );
              })}
            </div>

            <button className="flex items-center gap-1.5 h-8 px-3 rounded-md bg-white/5 border border-white/8 hover:bg-white/8 text-xs text-muted-foreground hover:text-foreground transition-colors">
              <History className="w-3.5 h-3.5" />
              History
            </button>
            <button className="flex items-center gap-1.5 h-8 px-3 rounded-md bg-white/5 border border-white/8 hover:bg-white/8 text-xs text-muted-foreground hover:text-foreground transition-colors">
              <Share2 className="w-3.5 h-3.5" />
              Share
            </button>
            <button className="flex items-center gap-1.5 h-8 px-3 rounded-md bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors">
              <Save className="w-3.5 h-3.5" />
              Save
            </button>
          </div>
        }
      />

      {/* Process meta bar */}
      <div className="flex items-center gap-6 px-6 py-2.5 border-b border-border bg-card/50 shrink-0">
        <span className={cn("text-[10px] px-2 py-0.5 rounded-md font-medium border", status.cls)}>
          {status.label}
        </span>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Clock className="w-3.5 h-3.5" />
          <span>
            Avg cycle:{" "}
            <span className="text-foreground font-medium">{process.avgCycleTimeHours}h</span>
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <GitBranch className="w-3.5 h-3.5" />
          <span>
            <span className="text-foreground font-medium">{process.nodes.length}</span> nodes
          </span>
        </div>
        {criticalNodes.length > 0 && (
          <div className="flex items-center gap-1.5 text-xs text-red-400">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>
              <span className="font-medium">{criticalNodes.length}</span> bottleneck
              {criticalNodes.length !== 1 ? "s" : ""}
            </span>
          </div>
        )}
        {simulationMode && (
          <div className="flex items-center gap-1.5 text-xs text-primary ml-auto">
            <Zap className="w-3.5 h-3.5" />
            <span className="font-medium">Simulation Active</span>
          </div>
        )}
      </div>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {viewMode === "flow" && (
          <FlowCanvas process={process} />
        )}

        {viewMode === "table" && (
          <div className="flex-1 overflow-y-auto scrollbar-thin p-6">
            <div className="rounded-xl border border-border overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-white/3">
                    {["Step", "Type", "Duration", "Team", "Bottleneck Score", "Status"].map((h) => (
                      <th key={h} className="text-left text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 px-4 py-3">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {process.nodes.map((node) => (
                    <tr
                      key={node.id}
                      className="border-b border-border/50 hover:bg-white/3 transition-colors cursor-pointer"
                    >
                      <td className="px-4 py-3">
                        <p className="text-xs font-medium text-foreground">{node.label}</p>
                        {node.description && (
                          <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-1">{node.description}</p>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-[10px] text-muted-foreground capitalize bg-white/5 border border-white/8 px-1.5 py-0.5 rounded">
                          {node.type}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-foreground">
                        {node.avgDurationHours < 1
                          ? `${Math.round(node.avgDurationHours * 60)}m`
                          : `${node.avgDurationHours}h`}
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{node.team}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="relative h-1.5 w-16 rounded-full bg-white/8">
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${node.bottleneckScore}%`,
                                backgroundColor:
                                  node.bottleneckScore >= 80
                                    ? "#ef4444"
                                    : node.bottleneckScore >= 60
                                    ? "#f59e0b"
                                    : node.bottleneckScore >= 35
                                    ? "#eab308"
                                    : "#10b981",
                              }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground">{node.bottleneckScore}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={cn(
                            "text-[10px] px-1.5 py-0.5 rounded font-medium",
                            node.bottleneckScore >= 80
                              ? "bg-red-500/15 text-red-400"
                              : node.bottleneckScore >= 60
                              ? "bg-amber-500/15 text-amber-400"
                              : "bg-emerald-500/15 text-emerald-400"
                          )}
                        >
                          {node.bottleneckScore >= 80
                            ? "Critical"
                            : node.bottleneckScore >= 60
                            ? "Warning"
                            : "Normal"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {viewMode === "timeline" && (
          <div className="flex-1 overflow-y-auto scrollbar-thin p-6">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-6 top-0 bottom-0 w-px bg-white/8" />
              <div className="space-y-4 pl-16">
                {process.nodes.map((node, i) => (
                  <motion.div
                    key={node.id}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="relative"
                  >
                    {/* Dot */}
                    <div
                      className="absolute -left-11 top-3 w-3 h-3 rounded-full border-2 border-background"
                      style={{
                        backgroundColor:
                          node.bottleneckScore >= 80
                            ? "#ef4444"
                            : node.bottleneckScore >= 60
                            ? "#f59e0b"
                            : "#10b981",
                      }}
                    />
                    {/* Duration bar */}
                    <div className="absolute -left-16 top-2.5 w-5 text-[9px] text-right text-muted-foreground font-mono">
                      {node.avgDurationHours < 1
                        ? `${Math.round(node.avgDurationHours * 60)}m`
                        : `${node.avgDurationHours}h`}
                    </div>

                    <div className="p-4 rounded-xl border border-border bg-card hover:border-white/12 transition-colors">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm font-semibold text-foreground">{node.label}</p>
                          {node.description && (
                            <p className="text-xs text-muted-foreground mt-0.5">{node.description}</p>
                          )}
                        </div>
                        {node.bottleneckScore >= 60 && (
                          <span
                            className={cn(
                              "text-[10px] px-2 py-0.5 rounded font-medium ml-3",
                              node.bottleneckScore >= 80
                                ? "bg-red-500/15 text-red-400"
                                : "bg-amber-500/15 text-amber-400"
                            )}
                          >
                            Score: {node.bottleneckScore}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-[10px] text-muted-foreground capitalize bg-white/5 px-1.5 py-0.5 rounded border border-white/8">
                          {node.type}
                        </span>
                        {node.team && (
                          <span className="text-[10px] text-muted-foreground">{node.team}</span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Insights sidebar */}
        {insights.length > 0 && viewMode !== "flow" && (
          <div className="w-72 border-l border-border overflow-y-auto scrollbar-thin p-4 shrink-0">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-3.5 h-3.5 text-primary" />
              <p className="text-xs font-semibold text-foreground">Insights</p>
            </div>
            <div className="space-y-3">
              {insights.map((insight) => (
                <div
                  key={insight.id}
                  className={cn(
                    "p-3 rounded-lg border",
                    insight.severity === "critical"
                      ? "bg-red-500/8 border-red-500/20"
                      : "bg-amber-500/8 border-amber-500/20"
                  )}
                >
                  <div className="flex items-start gap-2 mb-1.5">
                    <AlertTriangle
                      className={cn(
                        "w-3.5 h-3.5 shrink-0 mt-0.5",
                        insight.severity === "critical" ? "text-red-400" : "text-amber-400"
                      )}
                    />
                    <p className="text-xs font-medium text-foreground leading-tight">{insight.title}</p>
                  </div>
                  <p className="text-[10px] text-muted-foreground leading-relaxed line-clamp-3">
                    {insight.description}
                  </p>
                  <p
                    className={cn(
                      "text-[10px] font-semibold mt-2",
                      insight.severity === "critical" ? "text-red-400" : "text-amber-400"
                    )}
                  >
                    {insight.impactPercent}% impact
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
