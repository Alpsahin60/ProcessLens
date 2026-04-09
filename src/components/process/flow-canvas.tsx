"use client";

import { useCallback, useMemo } from "react";
import {
  ReactFlow,
  Controls,
  Background,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  BackgroundVariant,
  type NodeTypes,
  type OnConnect,
  type Node,
  type Edge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  MessageSquare,
  User,
  AlertTriangle,
  X,
  Zap,
  GitBranch,
  CheckSquare,
  Play,
  RotateCcw,
  Eye,
  EyeOff,
  Flame,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/app-store";
import { TaskNode, DecisionNode, DelayNode, ExternalNode } from "./custom-nodes";
import type { Process, ProcessNode } from "@/types";
import { formatDistanceToNow } from "date-fns";

const NODE_TYPES: NodeTypes = {
  task: TaskNode as unknown as React.ComponentType,
  decision: DecisionNode as unknown as React.ComponentType,
  delay: DelayNode as unknown as React.ComponentType,
  external: ExternalNode as unknown as React.ComponentType,
};

function toFlowNodes(nodes: ProcessNode[], simRemovedIds: string[]): Node[] {
  return nodes.map((n) => ({
    id: n.id,
    type: n.type,
    position: n.position,
    data: {
      label: n.label,
      type: n.type,
      avgDurationHours: n.avgDurationHours,
      bottleneckScore: n.bottleneckScore,
      assignee: n.assignee,
      team: n.team,
      comments: n.comments,
      simRemoved: simRemovedIds.includes(n.id),
    },
  }));
}

function toFlowEdges(edges: { id: string; source: string; target: string; label?: string; animated?: boolean }[]): Edge[] {
  return edges.map((e) => ({
    id: e.id,
    source: e.source,
    target: e.target,
    label: e.label,
    animated: e.animated ?? false,
    style: { strokeWidth: 2 },
  }));
}

function getBottleneckColor(score: number): string {
  if (score >= 80) return "#ef4444";
  if (score >= 60) return "#f59e0b";
  if (score >= 35) return "#eab308";
  return "#10b981";
}

interface FlowCanvasProps {
  process: Process;
}

export function FlowCanvas({ process }: FlowCanvasProps) {
  const {
    selectedNodeId,
    setSelectedNodeId,
    showNodePanel,
    setShowNodePanel,
    simulationMode,
    setSimulationMode,
    simulationRemovedNodes,
    toggleSimulationNode,
    resetSimulation,
  } = useAppStore();

  const initialNodes = useMemo(
    () => toFlowNodes(process.nodes, simulationRemovedNodes),
    [process.nodes, simulationRemovedNodes]
  );
  const initialEdges = useMemo(() => toFlowEdges(process.edges), [process.edges]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect: OnConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onNodeClick = useCallback(
    (_: unknown, node: Node) => {
      if (simulationMode) {
        toggleSimulationNode(node.id);
        return;
      }
      setSelectedNodeId(node.id);
    },
    [simulationMode, setSelectedNodeId, toggleSimulationNode]
  );

  const selectedNode = process.nodes.find((n) => n.id === selectedNodeId);

  // Compute simulated total time
  const simTotalHours = useMemo(() => {
    if (!simulationMode) return process.avgCycleTimeHours;
    const removedTime = process.nodes
      .filter((n) => simulationRemovedNodes.includes(n.id))
      .reduce((acc, n) => acc + n.avgDurationHours, 0);
    return Math.max(0, process.avgCycleTimeHours - removedTime);
  }, [simulationMode, simulationRemovedNodes, process]);

  const timeSaved = process.avgCycleTimeHours - simTotalHours;
  const timeSavedPct = Math.round((timeSaved / process.avgCycleTimeHours) * 100);

  return (
    <div className="relative flex-1 h-full bg-background overflow-hidden">
      {/* Toolbar */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
        <div className="flex items-center gap-1.5 glass rounded-lg px-3 py-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-medium text-foreground">v{process.version}</span>
        </div>

        {/* Simulation mode */}
        <button
          onClick={() => simulationMode ? resetSimulation() : setSimulationMode(true)}
          className={cn(
            "flex items-center gap-2 glass rounded-lg px-3 py-2 text-xs font-medium transition-all",
            simulationMode
              ? "bg-primary/20 border-primary/40 text-primary"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {simulationMode ? (
            <>
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Simulation
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5" />
              Simulate
            </>
          )}
        </button>
      </div>

      {/* Simulation banner */}
      <AnimatePresence>
        {simulationMode && (
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            className="absolute top-16 left-1/2 -translate-x-1/2 z-20 glass-stronger rounded-xl px-5 py-3 border border-primary/30"
          >
            <div className="flex items-center gap-4 text-sm">
              <Zap className="w-4 h-4 text-primary" />
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Simulated Cycle Time</p>
                <p className="font-bold text-foreground">
                  {simTotalHours}h
                  {timeSaved > 0 && (
                    <span className="text-emerald-400 text-xs font-medium ml-2">
                      −{timeSaved}h ({timeSavedPct}% faster)
                    </span>
                  )}
                </p>
              </div>
              <p className="text-xs text-muted-foreground">
                Click nodes to toggle removal
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-20 flex flex-col gap-1.5 glass rounded-lg p-3">
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-1">Bottleneck</p>
        {[
          { label: "Critical (80+)", color: "#ef4444" },
          { label: "High (60–79)", color: "#f59e0b" },
          { label: "Medium (35–59)", color: "#eab308" },
          { label: "Normal (<35)", color: "#10b981" },
        ].map(({ label, color }) => (
          <div key={label} className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: color }} />
            <span className="text-[10px] text-muted-foreground">{label}</span>
          </div>
        ))}
      </div>

      {/* React Flow Canvas */}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onPaneClick={() => { setSelectedNodeId(null); setShowNodePanel(false); }}
        nodeTypes={NODE_TYPES}
        fitView
        fitViewOptions={{ padding: 0.15 }}
        minZoom={0.3}
        maxZoom={2}
        defaultEdgeOptions={{ style: { strokeWidth: 2 } }}
        className="bg-background"
      >
        <Background variant={BackgroundVariant.Dots} gap={24} size={1} color="rgba(255,255,255,0.06)" />
        <Controls position="bottom-right" />
        <MiniMap
          position="top-right"
          nodeColor={(node) => {
            const processNode = process.nodes.find((n) => n.id === node.id);
            if (!processNode) return "#333";
            return getBottleneckColor(processNode.bottleneckScore);
          }}
          maskColor="rgba(0,0,0,0.7)"
          style={{ width: 140, height: 90 }}
        />
      </ReactFlow>

      {/* Node Detail Panel */}
      <AnimatePresence>
        {showNodePanel && selectedNode && (
          <motion.div
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="absolute right-0 top-0 h-full w-80 glass-stronger border-l border-white/8 overflow-y-auto scrollbar-thin z-20 flex flex-col"
          >
            {/* Panel header */}
            <div className="flex items-start justify-between p-4 border-b border-white/8">
              <div>
                <p className="text-sm font-semibold text-foreground">{selectedNode.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5 capitalize">{selectedNode.type} node</p>
              </div>
              <button
                onClick={() => { setSelectedNodeId(null); setShowNodePanel(false); }}
                className="w-6 h-6 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/8 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Bottleneck score */}
            <div className="p-4 border-b border-white/8">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-medium text-muted-foreground">Bottleneck Score</p>
                <span
                  className={cn(
                    "text-xs font-bold px-2 py-0.5 rounded-md",
                    selectedNode.bottleneckScore >= 80
                      ? "bg-red-500/20 text-red-400"
                      : selectedNode.bottleneckScore >= 60
                      ? "bg-amber-500/20 text-amber-400"
                      : selectedNode.bottleneckScore >= 35
                      ? "bg-yellow-500/20 text-yellow-400"
                      : "bg-emerald-500/20 text-emerald-400"
                  )}
                >
                  {selectedNode.bottleneckScore}/100
                </span>
              </div>
              <div className="relative h-2 rounded-full bg-white/8 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${selectedNode.bottleneckScore}%` }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="h-full rounded-full"
                  style={{
                    background: `linear-gradient(90deg, ${getBottleneckColor(0)}, ${getBottleneckColor(selectedNode.bottleneckScore)})`,
                  }}
                />
              </div>
            </div>

            {/* Stats */}
            <div className="p-4 border-b border-white/8 grid grid-cols-2 gap-3">
              <div>
                <p className="text-[10px] text-muted-foreground mb-1">Avg Duration</p>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-primary" />
                  <p className="text-sm font-semibold text-foreground">
                    {selectedNode.avgDurationHours < 1
                      ? `${Math.round(selectedNode.avgDurationHours * 60)}m`
                      : `${selectedNode.avgDurationHours}h`}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground mb-1">Assignee</p>
                <div className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-muted-foreground" />
                  <p className="text-xs text-foreground">{selectedNode.team ?? "Unassigned"}</p>
                </div>
              </div>
            </div>

            {/* Description */}
            {selectedNode.description && (
              <div className="p-4 border-b border-white/8">
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold mb-2">Description</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{selectedNode.description}</p>
              </div>
            )}

            {/* Comments */}
            <div className="p-4 flex-1">
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold mb-3">
                Comments ({selectedNode.comments.length})
              </p>
              {selectedNode.comments.length === 0 ? (
                <div className="flex flex-col items-center gap-2 py-6 text-center">
                  <MessageSquare className="w-8 h-8 text-muted-foreground/30" />
                  <p className="text-xs text-muted-foreground">No comments yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedNode.comments.map((c) => (
                    <div key={c.id} className="flex items-start gap-2.5">
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-semibold flex-shrink-0"
                        style={{ backgroundColor: c.userColor + "20", color: c.userColor }}
                      >
                        {c.userInitials}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-medium text-foreground">{c.userName}</p>
                          <p className="text-[10px] text-muted-foreground/60">
                            {formatDistanceToNow(new Date(c.createdAt), { addSuffix: true })}
                          </p>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{c.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Comment input */}
              <div className="mt-4 flex items-center gap-2 p-2 rounded-lg bg-white/5 border border-white/8">
                <div className="w-5 h-5 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-[9px] font-semibold text-primary">
                  SC
                </div>
                <input
                  type="text"
                  placeholder="Add a comment..."
                  className="flex-1 bg-transparent text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
