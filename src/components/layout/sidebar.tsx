"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  GitBranch,
  BarChart3,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
  Zap,
  Plus,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/app-store";

const NAV_ITEMS = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/processes", icon: GitBranch, label: "Processes" },
  { href: "/analytics", icon: BarChart3, label: "Analytics" },
  { href: "/team", icon: Users, label: "Team" },
  { href: "/settings", icon: Settings, label: "Settings" },
];

const STATUS_COLORS: Record<string, string> = {
  active: "bg-emerald-500",
  draft: "bg-zinc-500",
  optimizing: "bg-amber-500",
  archived: "bg-zinc-700",
};

const STATUS_GLOW: Record<string, string> = {
  active: "shadow-[0_0_6px_rgba(16,185,129,0.8)]",
  draft: "shadow-none",
  optimizing: "shadow-[0_0_6px_rgba(245,158,11,0.7)]",
  archived: "shadow-none",
};

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarCollapsed, toggleSidebar, processes } = useAppStore();

  return (
    <motion.aside
      initial={false}
      animate={{ width: sidebarCollapsed ? 64 : 244 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      className="relative flex flex-col h-screen bg-sidebar border-r border-sidebar-border shrink-0 overflow-hidden"
    >
      {/* Subtle top glow */}
      <div
        className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{
          background: "linear-gradient(90deg, transparent, oklch(0.62 0.24 278 / 0.5), transparent)",
        }}
      />

      {/* Logo */}
      <div className="flex items-center h-14 px-4 border-b border-sidebar-border relative">
        <div className="flex items-center gap-2.5 min-w-0">
          {/* Logo mark */}
          <div className="relative shrink-0">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center glow-primary-sm"
              style={{
                background: "linear-gradient(135deg, oklch(0.62 0.24 278), oklch(0.60 0.24 298))",
              }}
            >
              <Zap className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
          </div>

          <AnimatePresence mode="wait">
            {!sidebarCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.15 }}
                className="flex flex-col min-w-0"
              >
                <span className="font-semibold text-sm tracking-tight text-foreground whitespace-nowrap leading-none">
                  ProcessLens
                </span>
                <span className="text-[10px] text-muted-foreground/60 whitespace-nowrap mt-0.5">
                  v2.0 · Workspace
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* New Process Button */}
      <div className="px-3 pt-3 pb-2">
        {sidebarCollapsed ? (
          <Link
            href="/processes"
            title="New Process"
            className="flex items-center justify-center w-full h-8 rounded-lg border border-primary/25 hover:border-primary/50 hover:bg-primary/10 transition-all duration-200 cursor-pointer"
            style={{ background: "oklch(0.62 0.24 278 / 0.08)" }}
          >
            <Plus className="w-4 h-4 text-primary" />
          </Link>
        ) : (
          <Link
            href="/processes"
            className="flex items-center gap-2 w-full h-8 px-3 rounded-lg border border-primary/25 hover:border-primary/50 transition-all duration-200 text-primary text-xs font-medium cursor-pointer"
            style={{ background: "oklch(0.62 0.24 278 / 0.08)" }}
          >
            <Plus className="w-3.5 h-3.5" />
            <AnimatePresence mode="wait">
              {!sidebarCollapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.1 }}
                >
                  New Process
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 overflow-y-auto scrollbar-thin py-1">
        <div className="space-y-0.5">
          {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                title={sidebarCollapsed ? label : undefined}
                className={cn(
                  "relative flex items-center gap-3 h-9 px-2.5 rounded-lg text-sm transition-all duration-150 group cursor-pointer overflow-hidden",
                  active
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {/* Active background */}
                {active && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute inset-0 rounded-lg"
                    style={{
                      background: "linear-gradient(135deg, oklch(0.62 0.24 278 / 0.18) 0%, oklch(0.62 0.24 278 / 0.06) 100%)",
                    }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                  />
                )}

                {/* Active left bar indicator */}
                {active && (
                  <motion.div
                    layoutId="activeBar"
                    className="nav-active-bar"
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                  />
                )}

                {/* Hover background for inactive */}
                {!active && (
                  <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-150 bg-white/4" />
                )}

                <Icon
                  className={cn(
                    "relative w-4 h-4 shrink-0 transition-colors duration-150",
                    active ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                  )}
                />

                <AnimatePresence mode="wait">
                  {!sidebarCollapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.1 }}
                      className="relative whitespace-nowrap font-medium text-sm"
                    >
                      {label}
                    </motion.span>
                  )}
                </AnimatePresence>

                {/* Active dot for collapsed */}
                {active && sidebarCollapsed && (
                  <div className="absolute right-1.5 top-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-primary" />
                )}
              </Link>
            );
          })}
        </div>

        {/* Recent Processes */}
        <AnimatePresence>
          {!sidebarCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="mt-5"
            >
              <div className="flex items-center gap-2 px-2.5 mb-2">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">
                  Recent
                </p>
                <div className="flex-1 h-px bg-border/50" />
              </div>
              <div className="space-y-0.5">
                {processes.slice(0, 3).map((p) => (
                  <Link
                    key={p.id}
                    href={`/processes/${p.id}`}
                    className={cn(
                      "flex items-center gap-2.5 h-8 px-2.5 rounded-md text-xs transition-all duration-150 cursor-pointer group",
                      pathname === `/processes/${p.id}`
                        ? "bg-white/6 text-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-white/4"
                    )}
                  >
                    <span
                      className={cn(
                        "w-1.5 h-1.5 rounded-full shrink-0",
                        STATUS_COLORS[p.status],
                        STATUS_GLOW[p.status]
                      )}
                    />
                    <span className="truncate">{p.name}</span>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Insights promo — only when expanded */}
        <AnimatePresence>
          {!sidebarCollapsed && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.2, delay: 0.05 }}
              className="mt-5 mx-0"
            >
              <div
                className="relative p-3 rounded-xl overflow-hidden border border-primary/15 cursor-pointer"
                style={{ background: "oklch(0.62 0.24 278 / 0.06)" }}
              >
                <div className="flex items-start gap-2.5">
                  <div
                    className="w-6 h-6 rounded-md flex items-center justify-center shrink-0"
                    style={{ background: "oklch(0.62 0.24 278 / 0.25)" }}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-foreground leading-tight">AI Insights</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5 leading-relaxed">
                      3 new recommendations ready
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Bottom: User + Collapse */}
      <div className="border-t border-sidebar-border">
        {/* User row */}
        <AnimatePresence>
          {!sidebarCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex items-center gap-2.5 px-4 py-3"
            >
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-semibold text-white shrink-0"
                style={{
                  background: "linear-gradient(135deg, oklch(0.62 0.24 278), oklch(0.60 0.24 298))",
                  boxShadow: "0 0 8px oklch(0.62 0.24 278 / 0.5)",
                }}
              >
                SC
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-foreground truncate">Sarah Chen</p>
                <p className="text-[10px] text-muted-foreground truncate">Pro Plan</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Collapse toggle */}
        <div className="px-3 pb-3">
          <button
            onClick={toggleSidebar}
            className="flex items-center justify-center w-full h-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all duration-200 cursor-pointer border border-transparent hover:border-border"
          >
            {sidebarCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <div className="flex items-center gap-2 text-xs">
                <ChevronLeft className="w-4 h-4" />
                <span>Collapse</span>
              </div>
            )}
          </button>
        </div>
      </div>
    </motion.aside>
  );
}
