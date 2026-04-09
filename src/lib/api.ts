import {
  CYCLE_TIME_TREND,
  EFFICIENCY_TREND,
  INSIGHTS,
  PROCESS_VOLUME,
  PROCESSES,
} from "@/lib/mock-data";
import type { Insight, Process, ProcessEdge, ProcessNode, TrendDataPoint } from "@/types";

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1").replace(/\/$/, "");

interface AnalyticsKpis {
  totalProcesses: number;
  avgCycleTimeHours: number;
  activeBottlenecks: number;
  teamMembers: number;
  efficiencyScore: number;
  completionRate: number;
  trends: {
    cycleTime: number;
    bottlenecks: number;
    efficiency: number;
  };
}

type RawProcess = Partial<Process> & {
  id: string;
  nodes?: Partial<ProcessNode>[];
  edges?: Partial<ProcessEdge>[];
};

type RawInsight = Partial<Insight> & {
  id: string;
  processId: string;
};

async function fetchJson<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }

  return (await response.json()) as T;
}

function fallbackPosition(index: number) {
  return {
    x: 80 + index * 200,
    y: 120 + (index % 2) * 100,
  };
}

function mergeNode(rawNode: Partial<ProcessNode>, fallbackNode: ProcessNode | undefined, index: number): ProcessNode {
  return {
    id: rawNode.id ?? fallbackNode?.id ?? `node-${index + 1}`,
    type: (rawNode.type ?? fallbackNode?.type ?? "task") as ProcessNode["type"],
    label: rawNode.label ?? fallbackNode?.label ?? `Step ${index + 1}`,
    description: rawNode.description ?? fallbackNode?.description,
    avgDurationHours: rawNode.avgDurationHours ?? fallbackNode?.avgDurationHours ?? 0,
    bottleneckScore: rawNode.bottleneckScore ?? fallbackNode?.bottleneckScore ?? 0,
    assignee: rawNode.assignee ?? fallbackNode?.assignee,
    team: rawNode.team ?? fallbackNode?.team ?? "Operations",
    comments: rawNode.comments ?? fallbackNode?.comments ?? [],
    position: rawNode.position ?? fallbackNode?.position ?? fallbackPosition(index),
  };
}

function mergeProcess(raw: RawProcess): Process {
  const fallback = PROCESSES.find((process) => process.id === raw.id);
  const sourceNodes = raw.nodes?.length ? raw.nodes : fallback?.nodes ?? [];
  const sourceEdges = raw.edges?.length ? raw.edges : fallback?.edges ?? [];

  return {
    id: raw.id ?? fallback?.id ?? "unknown-process",
    name: raw.name ?? fallback?.name ?? "Untitled Process",
    description: raw.description ?? fallback?.description ?? "Process data from the ProcessLens API",
    status: (raw.status ?? fallback?.status ?? "draft") as Process["status"],
    nodes: sourceNodes.map((node, index) =>
      mergeNode(node, fallback?.nodes.find((fallbackNode) => fallbackNode.id === node.id), index)
    ),
    edges: sourceEdges.map((edge, index) => ({
      id: edge.id ?? `edge-${index + 1}`,
      source: edge.source ?? fallback?.edges[index]?.source ?? "",
      target: edge.target ?? fallback?.edges[index]?.target ?? "",
      label: edge.label ?? fallback?.edges[index]?.label,
      animated: edge.animated ?? fallback?.edges[index]?.animated ?? false,
    })),
    avgCycleTimeHours: raw.avgCycleTimeHours ?? fallback?.avgCycleTimeHours ?? 0,
    completionRate: raw.completionRate ?? fallback?.completionRate ?? 0,
    teamId: raw.teamId ?? fallback?.teamId ?? "t1",
    createdAt: raw.createdAt ?? fallback?.createdAt ?? new Date().toISOString(),
    updatedAt: raw.updatedAt ?? fallback?.updatedAt ?? new Date().toISOString(),
    version: raw.version ?? fallback?.version ?? 1,
    tags: raw.tags ?? fallback?.tags ?? [],
  };
}

function mergeInsight(raw: RawInsight): Insight {
  const fallback =
    INSIGHTS.find((insight) => insight.id === raw.id) ??
    INSIGHTS.find(
      (insight) => insight.processId === raw.processId && (!raw.nodeId || insight.nodeId === raw.nodeId)
    );

  return {
    id: raw.id ?? fallback?.id ?? `${raw.processId}-insight`,
    type: (raw.type ?? fallback?.type ?? "efficiency") as Insight["type"],
    severity: (raw.severity ?? fallback?.severity ?? "info") as Insight["severity"],
    title: raw.title ?? fallback?.title ?? "Process insight",
    description: raw.description ?? fallback?.description ?? "Insight data from the ProcessLens API.",
    processId: raw.processId,
    processName:
      raw.processName ??
      fallback?.processName ??
      PROCESSES.find((process) => process.id === raw.processId)?.name ??
      "Unknown Process",
    nodeId: raw.nodeId ?? fallback?.nodeId,
    impactPercent: raw.impactPercent ?? fallback?.impactPercent ?? 0,
    createdAt: raw.createdAt ?? fallback?.createdAt ?? new Date().toISOString(),
  };
}

function getFallbackKpis(): AnalyticsKpis {
  const avgCycleTimeHours = Math.round(
    PROCESSES.reduce((total, process) => total + process.avgCycleTimeHours, 0) / PROCESSES.length
  );

  return {
    totalProcesses: PROCESSES.length,
    avgCycleTimeHours,
    activeBottlenecks: PROCESSES.flatMap((process) => process.nodes).filter(
      (node) => node.bottleneckScore >= 60
    ).length,
    teamMembers: 5,
    efficiencyScore: 74,
    completionRate: Math.round(
      PROCESSES.reduce((total, process) => total + process.completionRate, 0) / PROCESSES.length
    ),
    trends: {
      cycleTime: -5.5,
      bottlenecks: -2,
      efficiency: 16,
    },
  };
}

export async function getProcesses(): Promise<Process[]> {
  try {
    const data = await fetchJson<RawProcess[]>("/processes");
    return data.map((process) => mergeProcess(process));
  } catch {
    return PROCESSES;
  }
}

export async function getProcess(processId: string): Promise<Process | undefined> {
  try {
    const data = await fetchJson<RawProcess>(`/processes/${processId}`);
    return mergeProcess(data);
  } catch {
    return PROCESSES.find((process) => process.id === processId);
  }
}

export async function getProcessInsights(processId: string): Promise<Insight[]> {
  try {
    const data = await fetchJson<RawInsight[]>(`/processes/${processId}/insights`);
    return data.map((insight) => mergeInsight({ ...insight, processId }));
  } catch {
    return INSIGHTS.filter((insight) => insight.processId === processId);
  }
}

export async function getAnalyticsInsights(): Promise<Insight[]> {
  try {
    const data = await fetchJson<RawInsight[]>("/analytics/insights");
    return data.map((insight) => mergeInsight(insight));
  } catch {
    return INSIGHTS;
  }
}

export async function getAnalyticsKpis(): Promise<AnalyticsKpis> {
  try {
    return await fetchJson<AnalyticsKpis>("/analytics/kpis");
  } catch {
    return getFallbackKpis();
  }
}

export async function getEfficiencyTrend(period = "month"): Promise<TrendDataPoint[]> {
  try {
    return await fetchJson<TrendDataPoint[]>(`/analytics/efficiency-trend?period=${period}`);
  } catch {
    return EFFICIENCY_TREND;
  }
}

export async function getCycleTimeTrend(): Promise<TrendDataPoint[]> {
  try {
    return await fetchJson<TrendDataPoint[]>("/analytics/cycle-time-trend");
  } catch {
    return CYCLE_TIME_TREND;
  }
}

export async function getProcessVolume(): Promise<TrendDataPoint[]> {
  try {
    return await fetchJson<TrendDataPoint[]>("/analytics/process-volume");
  } catch {
    return PROCESS_VOLUME;
  }
}

export async function getDashboardData() {
  const [kpis, processes, insights, efficiencyTrend, processVolume] = await Promise.all([
    getAnalyticsKpis(),
    getProcesses(),
    getAnalyticsInsights(),
    getEfficiencyTrend(),
    getProcessVolume(),
  ]);

  return {
    kpis,
    processes,
    insights,
    efficiencyTrend,
    processVolume,
  };
}
