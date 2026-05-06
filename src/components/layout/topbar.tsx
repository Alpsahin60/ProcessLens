"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Bell,
  AlertTriangle,
  MessageSquare,
  Zap,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/app-store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDistanceToNow } from "date-fns";

const NOTIFICATION_ICONS = {
  bottleneck: AlertTriangle,
  comment: MessageSquare,
  mention: MessageSquare,
  system: Zap,
};

const NOTIFICATION_COLORS = {
  bottleneck: "text-red-400",
  comment: "text-blue-400",
  mention: "text-indigo-400",
  system: "text-amber-400",
};

const NOTIFICATION_BG = {
  bottleneck: "bg-red-500/10",
  comment: "bg-blue-500/10",
  mention: "bg-indigo-500/10",
  system: "bg-amber-500/10",
};

interface TopbarProps {
  title?: string;
  breadcrumbs?: { label: string; href?: string }[];
  actions?: React.ReactNode;
}

export function Topbar({ title, breadcrumbs, actions }: TopbarProps) {
  const { setCommandOpen, notifications, unreadCount, markAllRead, markRead } =
    useAppStore();
  const [notifOpen, setNotifOpen] = useState(false);

  return (
    <header className="h-14 flex items-center gap-4 px-5 border-b border-border sticky top-0 z-30 bg-background/85 backdrop-blur-xl">
      {/* Subtle gradient top line */}
      <div
        className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, oklch(1 0 0 / 0.06) 30%, oklch(1 0 0 / 0.06) 70%, transparent 100%)",
        }}
      />

      {/* Breadcrumbs / Title */}
      <div className="flex-1 min-w-0">
        {breadcrumbs ? (
          <div className="flex items-center gap-1 text-sm">
            {breadcrumbs.map((crumb, i) => (
              <span key={i} className="flex items-center gap-1">
                {i > 0 && (
                  <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/30 shrink-0" />
                )}
                <span
                  className={cn(
                    "font-medium transition-colors",
                    i === breadcrumbs.length - 1
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground cursor-pointer"
                  )}
                >
                  {crumb.label}
                </span>
              </span>
            ))}
          </div>
        ) : (
          <h1 className="text-sm font-semibold text-foreground truncate">{title}</h1>
        )}
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">
        {actions}

        {/* Search trigger */}
        <button
          onClick={() => setCommandOpen(true)}
          className="flex items-center gap-2 h-8 px-3 rounded-lg bg-white/4 border border-white/7 hover:bg-white/7 hover:border-white/12 transition-all duration-200 text-muted-foreground text-xs cursor-pointer group"
        >
          <Search className="w-3.5 h-3.5 group-hover:text-foreground transition-colors" />
          <span className="hidden sm:inline text-xs">Search...</span>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] bg-white/5 border border-white/8 font-mono text-muted-foreground/70">
            ⌘K
          </kbd>
        </button>

        {/* Notifications */}
        <DropdownMenu open={notifOpen} onOpenChange={setNotifOpen}>
          <DropdownMenuTrigger className="relative flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/6 border border-transparent hover:border-white/8 transition-all duration-200 cursor-pointer">
            <Bell className="w-4 h-4" />
            <AnimatePresence>
              {unreadCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500 ring-2 ring-background pointer-events-none"
                  style={{ boxShadow: "0 0 6px rgba(239,68,68,0.8)" }}
                />
              )}
            </AnimatePresence>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="w-80 bg-popover border-border shadow-2xl"
            sideOffset={8}
          >
            <DropdownMenuGroup>
              <div className="flex items-center justify-between px-3 py-2.5 border-b border-border">
                <DropdownMenuLabel className="p-0 text-sm font-semibold">
                  Notifications
                </DropdownMenuLabel>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-xs text-primary hover:text-primary/80 transition-colors cursor-pointer"
                  >
                    Mark all read
                  </button>
                )}
              </div>
            </DropdownMenuGroup>

            <div className="max-h-80 overflow-y-auto scrollbar-thin">
              {notifications.length === 0 ? (
                <div className="py-8 text-center text-muted-foreground text-sm">
                  No notifications
                </div>
              ) : (
                notifications.map((n) => {
                  const Icon = NOTIFICATION_ICONS[n.type];
                  const color = NOTIFICATION_COLORS[n.type];
                  const bg = NOTIFICATION_BG[n.type];
                  return (
                    <button
                      key={n.id}
                      onClick={() => markRead(n.id)}
                      className={cn(
                        "w-full flex items-start gap-3 px-3 py-3 hover:bg-white/4 transition-colors text-left border-b border-border/40 last:border-0 cursor-pointer",
                        !n.read && "bg-white/2"
                      )}
                    >
                      <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5", bg)}>
                        <Icon className={cn("w-3.5 h-3.5", color)} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-2">
                          <p className="text-xs font-medium text-foreground leading-tight">{n.title}</p>
                          {!n.read && (
                            <span
                              className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-1"
                              style={{ boxShadow: "0 0 4px oklch(0.62 0.24 278 / 0.8)" }}
                            />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed line-clamp-2">
                          {n.description}
                        </p>
                        <p className="text-[10px] text-muted-foreground/50 mt-1">
                          {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                        </p>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User avatar */}
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-semibold text-white cursor-pointer transition-all duration-200 hover:scale-105"
          style={{
            background: "linear-gradient(135deg, oklch(0.62 0.24 278), oklch(0.60 0.24 298))",
            boxShadow: "0 0 10px oklch(0.62 0.24 278 / 0.4)",
          }}
        >
          SC
        </div>
      </div>
    </header>
  );
}
