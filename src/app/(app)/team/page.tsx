"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  UserPlus,
  MoreHorizontal,
  Shield,
  Eye,
  Users,
  GitBranch,
  Activity,
  Mail,
} from "lucide-react";
import { Topbar } from "@/components/layout/topbar";
import { cn } from "@/lib/utils";
import { TEAM_MEMBERS } from "@/lib/mock-data";
import { formatDistanceToNow } from "date-fns";

const ROLE_CONFIG = {
  admin: { label: "Admin", icon: Shield, cls: "bg-primary/15 text-primary border-primary/20" },
  member: { label: "Member", icon: Users, cls: "bg-white/8 text-foreground border-white/10" },
  viewer: { label: "Viewer", icon: Eye, cls: "bg-zinc-500/15 text-zinc-400 border-zinc-500/20" },
};

const FADE_UP = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.3 },
  }),
};

export default function TeamPage() {
  const [activeSince] = useState(() => Date.now() - 86_400_000);

  const stats = [
    { label: "Total Members", value: TEAM_MEMBERS.length, icon: Users, color: "text-primary", bg: "bg-primary/10" },
    { label: "Admins", value: TEAM_MEMBERS.filter((m) => m.role === "admin").length, icon: Shield, color: "text-amber-400", bg: "bg-amber-400/10" },
    {
      label: "Active Today",
      value: TEAM_MEMBERS.filter((m) => new Date(m.lastActive).getTime() > activeSince).length,
      icon: Activity,
      color: "text-emerald-400",
      bg: "bg-emerald-400/10",
    },
  ];

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Topbar
        breadcrumbs={[{ label: "Team" }]}
        actions={
          <button className="flex items-center gap-1.5 h-8 px-3 rounded-md bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors">
            <UserPlus className="w-3.5 h-3.5" />
            Invite Member
          </button>
        }
      />
      <main className="flex-1 overflow-y-auto scrollbar-thin px-6 py-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              custom={i}
              initial="hidden"
              animate="visible"
              variants={FADE_UP}
              className="p-5 rounded-xl border border-border bg-card flex items-center gap-4"
            >
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", s.bg)}>
                <s.icon className={cn("w-5 h-5", s.color)} />
              </div>
              <div>
                <p className="text-xl font-bold text-foreground">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Members grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {TEAM_MEMBERS.map((member, i) => {
            const role = ROLE_CONFIG[member.role];
            const RoleIcon = role.icon;
            return (
              <motion.div
                key={member.id}
                custom={i + 3}
                initial="hidden"
                animate="visible"
                variants={FADE_UP}
                className="p-5 rounded-xl border border-border bg-card hover:border-white/15 transition-all group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold"
                      style={{ backgroundColor: member.color + "20", color: member.color, border: `1px solid ${member.color}30` }}
                    >
                      {member.initials}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{member.name}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <Mail className="w-3 h-3 text-muted-foreground/60" />
                        <p className="text-[10px] text-muted-foreground">{member.email}</p>
                      </div>
                    </div>
                  </div>
                  <button className="opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/8">
                    <MoreHorizontal className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <span className={cn("flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-md font-medium border", role.cls)}>
                    <RoleIcon className="w-2.5 h-2.5" />
                    {role.label}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div>
                    <p className="text-[10px] text-muted-foreground mb-1">Processes</p>
                    <div className="flex items-center gap-1.5">
                      <GitBranch className="w-3 h-3 text-primary" />
                      <p className="text-sm font-semibold text-foreground">{member.processesOwned}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground mb-1">Last Active</p>
                    <p className="text-xs text-foreground">
                      {formatDistanceToNow(new Date(member.lastActive), { addSuffix: true })}
                    </p>
                  </div>
                </div>

                {/* Activity bar */}
                <div className="h-1 rounded-full bg-white/8 overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${member.processesOwned > 0 ? Math.min(100, member.processesOwned * 20) : 5}%`,
                      backgroundColor: member.color,
                      opacity: 0.7,
                    }}
                  />
                </div>
              </motion.div>
            );
          })}

          {/* Invite card */}
          <motion.div
            custom={TEAM_MEMBERS.length + 3}
            initial="hidden"
            animate="visible"
            variants={FADE_UP}
            className="p-5 rounded-xl border border-dashed border-border hover:border-primary/40 hover:bg-primary/5 transition-all cursor-pointer group flex flex-col items-center justify-center gap-3 min-h-45"
          >
            <div className="w-10 h-10 rounded-full bg-white/5 group-hover:bg-primary/15 border border-white/10 group-hover:border-primary/30 flex items-center justify-center transition-all">
              <UserPlus className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">Invite a teammate</p>
              <p className="text-[10px] text-muted-foreground/60 mt-0.5">They&apos;ll get an email invite</p>
            </div>
          </motion.div>
        </div>

        {/* Permissions table */}
        <motion.div
          custom={10}
          initial="hidden"
          animate="visible"
          variants={FADE_UP}
          className="mt-6 p-5 rounded-xl border border-border bg-card"
        >
          <p className="text-sm font-semibold text-foreground mb-4">Role Permissions</p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 pb-3 pr-6">Permission</th>
                  {["Admin", "Member", "Viewer"].map((r) => (
                    <th key={r} className="text-center text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 pb-3 px-4">{r}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ["View processes", true, true, true],
                  ["Edit processes", true, true, false],
                  ["Create processes", true, true, false],
                  ["Delete processes", true, false, false],
                  ["Manage team", true, false, false],
                  ["Access analytics", true, true, false],
                  ["Export data", true, true, false],
                  ["Manage integrations", true, false, false],
                ].map(([perm, admin, member, viewer]) => (
                  <tr key={perm as string} className="border-b border-border/50">
                    <td className="py-2.5 pr-6 text-muted-foreground">{perm as string}</td>
                    {[admin, member, viewer].map((allowed, i) => (
                      <td key={i} className="py-2.5 px-4 text-center">
                        <span className={cn("text-sm", allowed ? "text-emerald-400" : "text-muted-foreground/30")}>
                          {allowed ? "✓" : "–"}
                        </span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
