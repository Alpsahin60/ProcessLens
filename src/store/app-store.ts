"use client";

import { create } from "zustand";
import type { Process, Notification } from "@/types";
import { PROCESSES, NOTIFICATIONS } from "@/lib/mock-data";

interface AppState {
  // Navigation
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (v: boolean) => void;
  toggleSidebar: () => void;

  // Command palette
  commandOpen: boolean;
  setCommandOpen: (v: boolean) => void;

  // Notifications
  notifications: Notification[];
  unreadCount: number;
  markAllRead: () => void;
  markRead: (id: string) => void;

  // Processes
  processes: Process[];
  selectedProcessId: string | null;
  setSelectedProcessId: (id: string | null) => void;
  selectedProcess: () => Process | null;

  // Process builder
  selectedNodeId: string | null;
  setSelectedNodeId: (id: string | null) => void;
  showNodePanel: boolean;
  setShowNodePanel: (v: boolean) => void;

  // Simulation mode
  simulationMode: boolean;
  setSimulationMode: (v: boolean) => void;
  simulationRemovedNodes: string[];
  toggleSimulationNode: (id: string) => void;
  resetSimulation: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  sidebarCollapsed: false,
  setSidebarCollapsed: (v) => set({ sidebarCollapsed: v }),
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),

  commandOpen: false,
  setCommandOpen: (v) => set({ commandOpen: v }),

  notifications: NOTIFICATIONS,
  unreadCount: NOTIFICATIONS.filter((n) => !n.read).length,
  markAllRead: () =>
    set((s) => ({
      notifications: s.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    })),
  markRead: (id) =>
    set((s) => {
      const updated = s.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      );
      return { notifications: updated, unreadCount: updated.filter((n) => !n.read).length };
    }),

  processes: PROCESSES,
  selectedProcessId: "p1",
  setSelectedProcessId: (id) => set({ selectedProcessId: id }),
  selectedProcess: () => {
    const { processes, selectedProcessId } = get();
    return processes.find((p) => p.id === selectedProcessId) ?? null;
  },

  selectedNodeId: null,
  setSelectedNodeId: (id) => set({ selectedNodeId: id, showNodePanel: id !== null }),
  showNodePanel: false,
  setShowNodePanel: (v) => set({ showNodePanel: v }),

  simulationMode: false,
  setSimulationMode: (v) => set({ simulationMode: v, simulationRemovedNodes: [] }),
  simulationRemovedNodes: [],
  toggleSimulationNode: (id) =>
    set((s) => ({
      simulationRemovedNodes: s.simulationRemovedNodes.includes(id)
        ? s.simulationRemovedNodes.filter((n) => n !== id)
        : [...s.simulationRemovedNodes, id],
    })),
  resetSimulation: () => set({ simulationRemovedNodes: [], simulationMode: false }),
}));
