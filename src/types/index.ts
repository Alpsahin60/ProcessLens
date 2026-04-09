export type NodeType = "task" | "decision" | "delay" | "external";

export type BottleneckLevel = "none" | "low" | "medium" | "high" | "critical";

export interface ProcessNode {
  id: string;
  type: NodeType;
  label: string;
  description?: string;
  avgDurationHours: number;
  bottleneckScore: number; // 0–100
  assignee?: string;
  team?: string;
  comments: Comment[];
  position: { x: number; y: number };
}

export interface ProcessEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  animated?: boolean;
}

export type ProcessStatus = "active" | "draft" | "archived" | "optimizing";

export interface Process {
  id: string;
  name: string;
  description: string;
  status: ProcessStatus;
  nodes: ProcessNode[];
  edges: ProcessEdge[];
  avgCycleTimeHours: number;
  completionRate: number;
  teamId: string;
  createdAt: string;
  updatedAt: string;
  version: number;
  tags: string[];
}

export interface KpiData {
  value: number | string;
  trend: number; // percentage change
  trendDirection: "up" | "down";
  label: string;
}

export interface TrendDataPoint {
  date: string;
  value: number;
  baseline?: number;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "admin" | "member" | "viewer";
  avatar?: string;
  initials: string;
  color: string;
  processesOwned: number;
  lastActive: string;
}

export interface Insight {
  id: string;
  type: "bottleneck" | "handoff" | "delay" | "efficiency";
  severity: "info" | "warning" | "critical";
  title: string;
  description: string;
  processId: string;
  processName: string;
  nodeId?: string;
  impactPercent: number;
  createdAt: string;
}

export interface ActivityItem {
  id: string;
  type: "comment" | "edit" | "share" | "alert" | "version";
  user: string;
  userInitials: string;
  userColor: string;
  action: string;
  target: string;
  processId?: string;
  timestamp: string;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userInitials: string;
  userColor: string;
  content: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  type: "bottleneck" | "comment" | "mention" | "system";
  title: string;
  description: string;
  read: boolean;
  createdAt: string;
  processId?: string;
}
