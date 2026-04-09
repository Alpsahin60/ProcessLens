"use client";

import { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import { Clock, Zap, GitBranch, CheckSquare, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import type { NodeType } from "@/types";

function getBottleneckStyle(score: number): { border: string; bg: string; glow: string; badge: string } {
  if (score >= 80)
    return {
      border: "border-red-500/60",
      bg: "bg-red-500/10",
      glow: "shadow-[0_0_16px_rgba(239,68,68,0.3)]",
      badge: "bg-red-500 text-white",
    };
  if (score >= 60)
    return {
      border: "border-amber-500/60",
      bg: "bg-amber-500/10",
      glow: "shadow-[0_0_12px_rgba(245,158,11,0.25)]",
      badge: "bg-amber-500 text-white",
    };
  if (score >= 35)
    return {
      border: "border-yellow-500/40",
      bg: "bg-yellow-500/5",
      glow: "",
      badge: "bg-yellow-500/80 text-white",
    };
  return {
    border: "border-white/10",
    bg: "bg-card",
    glow: "",
    badge: "bg-emerald-500/80 text-white",
  };
}

const NODE_TYPE_CONFIG: Record<NodeType, { icon: React.ElementType; color: string; label: string }> = {
  task: { icon: CheckSquare, color: "text-primary", label: "Task" },
  decision: { icon: GitBranch, color: "text-purple-400", label: "Decision" },
  delay: { icon: Clock, color: "text-amber-400", label: "Delay" },
  external: { icon: Zap, color: "text-cyan-400", label: "External" },
};

interface NodeData {
  label: string;
  type: NodeType;
  avgDurationHours: number;
  bottleneckScore: number;
  assignee?: string;
  team?: string;
  comments?: unknown[];
  selected?: boolean;
  simRemoved?: boolean;
}

function ProcessNodeBase({ data, selected }: { data: NodeData; selected?: boolean }) {
  const config = NODE_TYPE_CONFIG[data.type] ?? NODE_TYPE_CONFIG.task;
  const Icon = config.icon;
  const style = getBottleneckStyle(data.simRemoved ? 0 : data.bottleneckScore);
  const hours = data.avgDurationHours;
  const timeLabel = hours < 1 ? `${Math.round(hours * 60)}m` : `${hours}h`;
  const commentCount = Array.isArray(data.comments) ? data.comments.length : 0;

  return (
    <div
      className={cn(
        "relative px-3.5 pt-3 pb-3 rounded-xl border min-w-[140px] max-w-[180px] transition-all duration-200",
        style.border,
        style.bg,
        style.glow,
        selected && "ring-2 ring-primary/60 ring-offset-1 ring-offset-background",
        data.simRemoved && "opacity-40 grayscale"
      )}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!w-2.5 !h-2.5 !bg-white/20 !border-white/30 hover:!bg-primary/60 transition-colors"
      />

      {/* Type badge */}
      <div className={cn("absolute -top-2.5 left-3 flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-semibold", config.color.replace("text-", "bg-").replace("-400", "-500/15"), "border border-current/20")}>
        <Icon className={cn("w-2.5 h-2.5", config.color)} />
        <span className={config.color}>{config.label}</span>
      </div>

      {/* Bottleneck score */}
      {data.bottleneckScore > 30 && !data.simRemoved && (
        <div
          className={cn(
            "absolute -top-2.5 right-3 px-1.5 py-0.5 rounded-full text-[9px] font-bold",
            style.badge
          )}
        >
          {data.bottleneckScore}
        </div>
      )}

      {/* Label */}
      <p className="text-xs font-semibold text-foreground leading-tight mb-1.5 mt-0.5 pr-4">
        {data.label}
      </p>

      {/* Meta */}
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-muted-foreground font-mono">{timeLabel}</span>
        {data.team && (
          <span className="text-[10px] text-muted-foreground/60 truncate max-w-[70px]">{data.team}</span>
        )}
      </div>

      {/* Comments indicator */}
      {commentCount > 0 && (
        <div className="absolute -bottom-2 right-2 flex items-center gap-0.5 bg-primary/20 border border-primary/30 rounded-full px-1.5 py-0.5">
          <MessageSquare className="w-2.5 h-2.5 text-primary" />
          <span className="text-[9px] text-primary font-medium">{commentCount}</span>
        </div>
      )}

      <Handle
        type="source"
        position={Position.Right}
        className="!w-2.5 !h-2.5 !bg-white/20 !border-white/30 hover:!bg-primary/60 transition-colors"
      />
    </div>
  );
}

export const TaskNode = memo(({ data, selected }: { data: NodeData; selected?: boolean }) => (
  <ProcessNodeBase data={{ ...data, type: "task" }} selected={selected} />
));

export const DecisionNode = memo(({ data, selected }: { data: NodeData; selected?: boolean }) => (
  <ProcessNodeBase data={{ ...data, type: "decision" }} selected={selected} />
));

export const DelayNode = memo(({ data, selected }: { data: NodeData; selected?: boolean }) => (
  <ProcessNodeBase data={{ ...data, type: "delay" }} selected={selected} />
));

export const ExternalNode = memo(({ data, selected }: { data: NodeData; selected?: boolean }) => (
  <ProcessNodeBase data={{ ...data, type: "external" }} selected={selected} />
));

TaskNode.displayName = "TaskNode";
DecisionNode.displayName = "DecisionNode";
DelayNode.displayName = "DelayNode";
ExternalNode.displayName = "ExternalNode";
