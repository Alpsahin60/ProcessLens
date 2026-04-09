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

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarCollapsed, toggleSidebar, processes } = useAppStore();

  return (
    <motion.aside
      initial={false}
      animate={{ width: sidebarCollapsed ? 64 : 240 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className="relative flex flex-col h-screen bg-sidebar border-r border-sidebar-border shrink-0 overflow-hidden"
    >
      {/* Logo */}
      <div className="flex items-center h-14 px-4 border-b border-sidebar-border">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="relative shrink-0">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center glow-primary-sm">
              <Zap className="w-4 h-4 text-primary-foreground" strokeWidth={2.5} />
            </div>
          </div>
          <AnimatePresence>
            {!sidebarCollapsed && (
              <motion.span
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.15 }}
                className="font-semibold text-sm tracking-tight text-foreground whitespace-nowrap"
              >
                ProcessLens
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* New Process Button */}
      <div className="px-3 py-3">
        {sidebarCollapsed ? (
          <Link
            href="/processes"
            title="New Process"
            className="flex items-center justify-center w-full h-8 rounded-md bg-primary/10 hover:bg-primary/20 border border-primary/20 transition-colors"
          >
            <Plus className="w-4 h-4 text-primary" />
          </Link>
        ) : (
          <Link
            href="/processes"
            className="flex items-center gap-2 w-full h-8 px-3 rounded-md bg-primary/10 hover:bg-primary/20 border border-primary/20 transition-colors text-primary text-xs font-medium"
          >
            <Plus className="w-3.5 h-3.5" />
            New Process
          </Link>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 overflow-y-auto scrollbar-thin">
        <div className="space-y-0.5">
          {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                title={sidebarCollapsed ? label : undefined}
                className={cn(
                  "relative flex items-center gap-3 h-9 px-2.5 rounded-md text-sm transition-all duration-150 group",
                  active
                    ? "bg-primary/15 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                )}
              >
                {active && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute inset-0 rounded-md bg-primary/15"
                    transition={{ duration: 0.2 }}
                  />
                )}
                <Icon
                  className={cn(
                    "relative w-4 h-4 shrink-0",
                    active ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                  )}
                />
                <AnimatePresence>
                  {!sidebarCollapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.1 }}
                      className="relative whitespace-nowrap font-medium"
                    >
                      {label}
                    </motion.span>
                  )}
                </AnimatePresence>
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
              className="mt-6"
            >
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 px-2.5 mb-2">
                Recent
              </p>
              <div className="space-y-0.5">
                {processes.slice(0, 3).map((p) => (
                  <Link
                    key={p.id}
                    href={`/processes/${p.id}`}
                    className={cn(
                      "flex items-center gap-2.5 h-8 px-2.5 rounded-md text-xs transition-colors",
                      pathname === `/processes/${p.id}`
                        ? "bg-white/8 text-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                    )}
                  >
                    <span
                      className={cn(
                        "w-1.5 h-1.5 rounded-full shrink-0",
                        STATUS_COLORS[p.status]
                      )}
                    />
                    <span className="truncate">{p.name}</span>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Collapse toggle */}
      <div className="p-3 border-t border-sidebar-border">
        <button
          onClick={toggleSidebar}
          className="flex items-center justify-center w-full h-8 rounded-md text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
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
    </motion.aside>
  );
}
