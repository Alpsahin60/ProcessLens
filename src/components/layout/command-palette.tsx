"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "cmdk";
import {
  LayoutDashboard,
  GitBranch,
  BarChart3,
  Users,
  Settings,
  Plus,
  Search,
  AlertTriangle,
  Zap,
} from "lucide-react";
import { useAppStore } from "@/store/app-store";
import { PROCESSES, INSIGHTS } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export function CommandPalette() {
  const router = useRouter();
  const { commandOpen, setCommandOpen } = useAppStore();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || e.key === "/") {
        e.preventDefault();
        setCommandOpen(true);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [setCommandOpen]);

  const runCommand = (fn: () => void) => {
    setCommandOpen(false);
    fn();
  };

  if (!commandOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]"
      onClick={() => setCommandOpen(false)}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-lg glass-stronger rounded-xl shadow-2xl overflow-hidden border border-white/10"
        onClick={(e) => e.stopPropagation()}
        style={{ boxShadow: "0 25px 60px -10px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05)" }}
      >
        <CommandInput
          placeholder="Search processes, navigate, or run commands..."
          className="w-full bg-transparent border-0 border-b border-white/8 px-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          autoFocus
        />
        <CommandList className="max-h-[400px] overflow-y-auto scrollbar-thin p-2">
          <CommandEmpty className="py-8 text-center text-sm text-muted-foreground">
            No results found.
          </CommandEmpty>

          <CommandGroup heading="Navigate" className="[&>div]:text-[10px] [&>div]:font-semibold [&>div]:uppercase [&>div]:tracking-widest [&>div]:text-muted-foreground/60 [&>div]:px-2 [&>div]:py-1.5">
            {[
              { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
              { href: "/processes", icon: GitBranch, label: "Processes" },
              { href: "/analytics", icon: BarChart3, label: "Analytics" },
              { href: "/team", icon: Users, label: "Team" },
              { href: "/settings", icon: Settings, label: "Settings" },
            ].map(({ href, icon: Icon, label }) => (
              <CommandItem
                key={href}
                onSelect={() => runCommand(() => router.push(href))}
                className="flex items-center gap-3 px-2 py-2 rounded-md text-sm text-foreground cursor-pointer hover:bg-white/8 aria-selected:bg-white/8 transition-colors"
              >
                <Icon className="w-4 h-4 text-muted-foreground" />
                {label}
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandSeparator className="my-1 border-t border-white/5" />

          <CommandGroup heading="Processes">
            {PROCESSES.map((p) => (
              <CommandItem
                key={p.id}
                onSelect={() => runCommand(() => router.push(`/processes/${p.id}`))}
                className="flex items-center gap-3 px-2 py-2 rounded-md text-sm text-foreground cursor-pointer hover:bg-white/8 aria-selected:bg-white/8 transition-colors"
              >
                <GitBranch className="w-4 h-4 text-muted-foreground" />
                <div className="flex-1 min-w-0">
                  <span className="truncate">{p.name}</span>
                </div>
                <span
                  className={cn(
                    "text-[10px] px-1.5 py-0.5 rounded font-medium",
                    p.status === "active"
                      ? "bg-emerald-500/15 text-emerald-400"
                      : p.status === "optimizing"
                      ? "bg-amber-500/15 text-amber-400"
                      : "bg-zinc-500/15 text-zinc-400"
                  )}
                >
                  {p.status}
                </span>
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandSeparator className="my-1 border-t border-white/5" />

          <CommandGroup heading="Actions">
            <CommandItem
              onSelect={() => runCommand(() => router.push("/processes"))}
              className="flex items-center gap-3 px-2 py-2 rounded-md text-sm text-foreground cursor-pointer hover:bg-white/8 aria-selected:bg-white/8 transition-colors"
            >
              <Plus className="w-4 h-4 text-primary" />
              Create New Process
            </CommandItem>
          </CommandGroup>

          <CommandSeparator className="my-1 border-t border-white/5" />

          <CommandGroup heading="Insights">
            {INSIGHTS.slice(0, 3).map((insight) => (
              <CommandItem
                key={insight.id}
                onSelect={() => runCommand(() => router.push(`/processes/${insight.processId}`))}
                className="flex items-center gap-3 px-2 py-2 rounded-md text-sm cursor-pointer hover:bg-white/8 aria-selected:bg-white/8 transition-colors"
              >
                <AlertTriangle
                  className={cn(
                    "w-4 h-4 flex-shrink-0",
                    insight.severity === "critical"
                      ? "text-red-400"
                      : "text-amber-400"
                  )}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs truncate text-foreground">{insight.title}</p>
                  <p className="text-[10px] text-muted-foreground truncate">
                    {insight.processName}
                  </p>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>

        <div className="flex items-center gap-4 px-4 py-2 border-t border-white/5 text-[10px] text-muted-foreground/60">
          <span className="flex items-center gap-1">
            <kbd className="px-1 py-0.5 rounded bg-white/5 border border-white/8 font-mono">↑↓</kbd>
            navigate
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-1 py-0.5 rounded bg-white/5 border border-white/8 font-mono">↵</kbd>
            open
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-1 py-0.5 rounded bg-white/5 border border-white/8 font-mono">esc</kbd>
            close
          </span>
        </div>
      </div>
    </div>
  );
}
