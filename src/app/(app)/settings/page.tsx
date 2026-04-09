"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Bell,
  Shield,
  Zap,
  Database,
  Webhook,
  Check,
} from "lucide-react";
import { Topbar } from "@/components/layout/topbar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const SECTIONS = [
  { id: "profile", label: "Profile", icon: User },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Shield },
  { id: "integrations", label: "Integrations", icon: Zap },
  { id: "data", label: "Data & Export", icon: Database },
  { id: "webhooks", label: "Webhooks", icon: Webhook },
];

const INTEGRATIONS = [
  { name: "Slack", description: "Get bottleneck alerts in Slack channels", icon: "💬", connected: true },
  { name: "Jira", description: "Import bug resolution workflows from Jira", icon: "🔵", connected: true },
  { name: "Notion", description: "Export process docs to Notion pages", icon: "📝", connected: false },
  { name: "GitHub", description: "Track engineering process from PRs & issues", icon: "🐙", connected: false },
  { name: "Zapier", description: "Connect ProcessLens to 5,000+ apps", icon: "⚡", connected: false },
  { name: "Salesforce", description: "Map CRM stage transitions as processes", icon: "☁️", connected: false },
];

const FADE_UP = {
  hidden: { opacity: 0, y: 10 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.25 } }),
};

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState("profile");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Topbar breadcrumbs={[{ label: "Settings" }]} />
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar nav */}
        <nav className="w-52 border-r border-border p-3 space-y-0.5 shrink-0 overflow-y-auto scrollbar-thin">
          {SECTIONS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveSection(id)}
              className={cn(
                "w-full flex items-center gap-2.5 h-9 px-2.5 rounded-md text-sm transition-colors text-left",
                activeSection === id
                  ? "bg-primary/15 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5"
              )}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </nav>

        {/* Content */}
        <main className="flex-1 overflow-y-auto scrollbar-thin p-6">
          {activeSection === "profile" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-lg space-y-6">
              <div>
                <h2 className="text-base font-semibold text-foreground">Profile</h2>
                <p className="text-xs text-muted-foreground mt-0.5">Manage your personal information</p>
              </div>

              {/* Avatar */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary/20 border-2 border-primary/30 flex items-center justify-center text-xl font-bold text-primary">
                  SC
                </div>
                <div>
                  <button className="text-xs text-primary hover:text-primary/80 transition-colors">Change photo</button>
                  <p className="text-[10px] text-muted-foreground mt-0.5">JPG, PNG up to 2MB</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "First Name", value: "Sarah", id: "fn" },
                  { label: "Last Name", value: "Chen", id: "ln" },
                ].map((f) => (
                  <div key={f.id}>
                    <Label className="text-xs text-muted-foreground mb-1.5 block">{f.label}</Label>
                    <Input defaultValue={f.value} className="h-9 bg-white/5 border-white/10 text-sm" />
                  </div>
                ))}
              </div>

              <div>
                <Label className="text-xs text-muted-foreground mb-1.5 block">Email</Label>
                <Input defaultValue="sarah.chen@acme.io" className="h-9 bg-white/5 border-white/10 text-sm" />
              </div>

              <div>
                <Label className="text-xs text-muted-foreground mb-1.5 block">Bio</Label>
                <Textarea
                  defaultValue="Head of Operations at Acme. Obsessed with making processes efficient."
                  className="bg-white/5 border-white/10 text-sm resize-none"
                  rows={3}
                />
              </div>

              <div>
                <Label className="text-xs text-muted-foreground mb-1.5 block">Organization</Label>
                <Input defaultValue="Acme Corp" className="h-9 bg-white/5 border-white/10 text-sm" />
              </div>

              <button
                onClick={handleSave}
                className={cn(
                  "flex items-center gap-2 h-9 px-4 rounded-md text-sm font-medium transition-all",
                  saved
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : "bg-primary text-primary-foreground hover:bg-primary/90"
                )}
              >
                {saved ? <Check className="w-3.5 h-3.5" /> : null}
                {saved ? "Saved!" : "Save changes"}
              </button>
            </motion.div>
          )}

          {activeSection === "notifications" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-lg space-y-6">
              <div>
                <h2 className="text-base font-semibold text-foreground">Notifications</h2>
                <p className="text-xs text-muted-foreground mt-0.5">Choose what you want to be notified about</p>
              </div>
              {[
                { label: "Critical bottlenecks", desc: "When a node exceeds 80 bottleneck score", default: true },
                { label: "New comments", desc: "When someone comments on your processes", default: true },
                { label: "@Mentions", desc: "When someone mentions you in a comment", default: true },
                { label: "Process updates", desc: "When a process you follow is edited", default: false },
                { label: "Weekly digest", desc: "Weekly summary of your process performance", default: true },
                { label: "Team invites", desc: "When someone joins your organization", default: false },
              ].map((n, i) => (
                <motion.div
                  key={n.label}
                  custom={i}
                  initial="hidden"
                  animate="visible"
                  variants={FADE_UP}
                  className="flex items-start justify-between py-3 border-b border-border/50 last:border-0"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">{n.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{n.desc}</p>
                  </div>
                  <Toggle defaultChecked={n.default} />
                </motion.div>
              ))}
            </motion.div>
          )}

          {activeSection === "security" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-lg space-y-6">
              <div>
                <h2 className="text-base font-semibold text-foreground">Security</h2>
                <p className="text-xs text-muted-foreground mt-0.5">Manage your account security settings</p>
              </div>
              <div className="p-4 rounded-xl border border-border bg-card/50 space-y-4">
                <p className="text-xs font-semibold text-foreground">Change Password</p>
                {["Current password", "New password", "Confirm new password"].map((f) => (
                  <div key={f}>
                    <Label className="text-xs text-muted-foreground mb-1.5 block">{f}</Label>
                    <Input type="password" className="h-9 bg-white/5 border-white/10 text-sm" />
                  </div>
                ))}
                <button className="h-9 px-4 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
                  Update password
                </button>
              </div>
              <div className="p-4 rounded-xl border border-border bg-card/50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">Two-Factor Authentication</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Add an extra layer of security</p>
                  </div>
                  <button className="h-8 px-3 rounded-md bg-white/5 border border-white/10 text-xs text-muted-foreground hover:text-foreground hover:bg-white/8 transition-colors">
                    Enable
                  </button>
                </div>
              </div>
              <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/5">
                <p className="text-sm font-semibold text-foreground mb-1">Danger Zone</p>
                <p className="text-xs text-muted-foreground mb-3">Permanently delete your account and all data</p>
                <button className="h-8 px-3 rounded-md border border-red-500/30 text-red-400 text-xs hover:bg-red-500/10 transition-colors">
                  Delete account
                </button>
              </div>
            </motion.div>
          )}

          {activeSection === "integrations" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl space-y-4">
              <div>
                <h2 className="text-base font-semibold text-foreground">Integrations</h2>
                <p className="text-xs text-muted-foreground mt-0.5">Connect ProcessLens with your existing tools</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {INTEGRATIONS.map((intg, i) => (
                  <motion.div
                    key={intg.name}
                    custom={i}
                    initial="hidden"
                    animate="visible"
                    variants={FADE_UP}
                    className="flex items-start gap-3 p-4 rounded-xl border border-border bg-card hover:border-white/15 transition-colors"
                  >
                    <span className="text-2xl shrink-0">{intg.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground">{intg.name}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5 leading-relaxed">{intg.description}</p>
                    </div>
                    <button
                      className={cn(
                        "shrink-0 h-7 px-2.5 rounded-md text-[11px] font-medium transition-colors border",
                        intg.connected
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : "bg-white/5 text-muted-foreground border-white/8 hover:text-foreground hover:bg-white/10"
                      )}
                    >
                      {intg.connected ? "Connected" : "Connect"}
                    </button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {(activeSection === "data" || activeSection === "webhooks") && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-lg">
              <div className="mb-6">
                <h2 className="text-base font-semibold text-foreground capitalize">{activeSection === "data" ? "Data & Export" : "Webhooks"}</h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {activeSection === "data" ? "Export your process data in various formats" : "Configure webhook endpoints for real-time events"}
                </p>
              </div>
              <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center">
                  {activeSection === "data" ? <Database className="w-6 h-6 text-muted-foreground/40" /> : <Webhook className="w-6 h-6 text-muted-foreground/40" />}
                </div>
                <p className="text-sm font-medium text-foreground">Coming soon</p>
                <p className="text-xs text-muted-foreground">This feature is in development</p>
              </div>
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
}

function Toggle({ defaultChecked }: { defaultChecked?: boolean }) {
  const [checked, setChecked] = useState(defaultChecked ?? false);
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => setChecked(!checked)}
      className={cn(
        "relative w-9 h-5 rounded-full transition-colors shrink-0 focus:outline-none",
        checked ? "bg-primary" : "bg-white/15"
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-all",
          checked ? "left-4.5" : "left-0.5"
        )}
      />
    </button>
  );
}
