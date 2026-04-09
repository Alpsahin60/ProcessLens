"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Bell,
  AlertTriangle,
  MessageSquare,
  Zap,
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
    <header className="h-14 flex items-center gap-4 px-6 border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-30">
      {/* Breadcrumbs / Title */}
      <div className="flex-1 min-w-0">
        {breadcrumbs ? (
          <div className="flex items-center gap-1.5 text-sm">
            {breadcrumbs.map((crumb, i) => (
              <span key={i} className="flex items-center gap-1.5">
                {i > 0 && <span className="text-muted-foreground/40">/</span>}
                <span
                  className={cn(
                    i === breadcrumbs.length - 1
                      ? "text-foreground font-medium"
                      : "text-muted-foreground"
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
          className="flex items-center gap-2 h-8 px-3 rounded-md bg-white/5 border border-border hover:bg-white/8 hover:border-white/15 transition-all text-muted-foreground text-xs"
        >
          <Search className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Search...</span>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] bg-white/5 border border-border font-mono">
            ⌘K
          </kbd>
        </button>

        {/* Notifications */}
        <DropdownMenu open={notifOpen} onOpenChange={setNotifOpen}>
          <DropdownMenuTrigger className="relative flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-white/8 transition-colors">
            <Bell className="w-4 h-4" />
            <AnimatePresence>
              {unreadCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500 ring-2 ring-background pointer-events-none"
                />
              )}
            </AnimatePresence>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-80 bg-popover border-border"
            sideOffset={8}
          >
            <DropdownMenuGroup>
              <div className="flex items-center justify-between px-3 py-2 border-b border-border">
                <DropdownMenuLabel className="p-0 text-sm font-semibold">
                  Notifications
                </DropdownMenuLabel>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-xs text-primary hover:text-primary/80 transition-colors"
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
                  return (
                    <button
                      key={n.id}
                      onClick={() => markRead(n.id)}
                      className="w-full flex items-start gap-3 px-3 py-3 hover:bg-white/5 transition-colors text-left border-b border-border/50 last:border-0"
                    >
                      <div
                        className={cn(
                          "w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5",
                          !n.read ? "bg-white/8" : "bg-transparent"
                        )}
                      >
                        <Icon className={cn("w-3.5 h-3.5", color)} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-2">
                          <p className="text-xs font-medium text-foreground leading-tight">
                            {n.title}
                          </p>
                          {!n.read && (
                            <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-1" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed line-clamp-2">
                          {n.description}
                        </p>
                        <p className="text-[10px] text-muted-foreground/60 mt-1">
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
        <div className="w-7 h-7 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-[11px] font-semibold text-primary cursor-pointer hover:bg-primary/30 transition-colors">
          SC
        </div>
      </div>
    </header>
  );
}
