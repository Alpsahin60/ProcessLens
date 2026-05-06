"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useInView, useScroll, useTransform, AnimatePresence } from "framer-motion";
import {
  Zap,
  ArrowRight,
  GitBranch,
  BarChart3,
  AlertTriangle,
  Users,
  Check,
  ChevronRight,
  Play,
  Star,
  Sparkles,
  TrendingDown,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ─── Animated Counter ─── */
function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    const dur = 1500;
    const tick = (now: number) => {
      const t = Math.min((now - start) / dur, 1);
      const ease = 1 - Math.pow(1 - t, 4);
      setVal(Math.round(ease * to));
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, to]);

  return <span ref={ref}>{val}{suffix}</span>;
}

/* ─── Mini flow diagram ─── */
const DEMO_NODES = [
  { id: 1, label: "Signup", x: 60, y: 120, score: 5, type: "task" },
  { id: 2, label: "Profile Setup", x: 200, y: 120, score: 22, type: "task" },
  { id: 3, label: "Plan Select", x: 340, y: 120, score: 55, type: "decision" },
  { id: 4, label: "Review Queue", x: 480, y: 60, score: 87, type: "delay" },
  { id: 5, label: "Provisioning", x: 480, y: 180, score: 8, type: "task" },
  { id: 6, label: "Email Sequence", x: 620, y: 120, score: 30, type: "external" },
  { id: 7, label: "First Value", x: 760, y: 120, score: 42, type: "task" },
];

const DEMO_EDGES = [
  { from: 1, to: 2 }, { from: 2, to: 3 }, { from: 3, to: 4 },
  { from: 3, to: 5 }, { from: 4, to: 6 }, { from: 5, to: 6 }, { from: 6, to: 7 },
];

function getScoreColor(score: number) {
  if (score >= 80) return "#ef4444";
  if (score >= 60) return "#f59e0b";
  if (score >= 35) return "#eab308";
  return "#10b981";
}

function MiniFlowDemo() {
  const [pulse, setPulse] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setPulse((p) => (p + 1) % 7), 1100);
    return () => clearInterval(id);
  }, []);

  return (
    <svg viewBox="0 0 860 260" className="w-full h-auto" style={{ overflow: "visible" }}>
      <defs>
        <filter id="glowRed">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <marker id="arrow" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto">
          <path d="M0,0 L0,6 L8,3 z" fill="rgba(255,255,255,0.18)" />
        </marker>
      </defs>
      {DEMO_EDGES.map(({ from, to }) => {
        const s = DEMO_NODES.find((n) => n.id === from)!;
        const t = DEMO_NODES.find((n) => n.id === to)!;
        return (
          <line
            key={`${from}-${to}`}
            x1={s.x + 50} y1={s.y + 16} x2={t.x} y2={t.y + 16}
            stroke="rgba(255,255,255,0.10)" strokeWidth={1.5} markerEnd="url(#arrow)"
          />
        );
      })}
      {DEMO_NODES.map((node, i) => {
        const color = getScoreColor(node.score);
        const isActive = pulse === i;
        const isCritical = node.score >= 80;
        return (
          <g key={node.id} transform={`translate(${node.x}, ${node.y})`}>
            {isCritical && (
              <rect x={-4} y={-4} width={108} height={42} rx={10} fill={color} opacity={0.12} filter="url(#glowRed)" />
            )}
            <rect
              x={0} y={0} width={100} height={34} rx={8}
              fill={isActive ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.03)"}
              stroke={isActive ? color : `${color}35`}
              strokeWidth={isActive ? 1.5 : 1}
            />
            <rect x={0} y={31} width={node.score} height={3} rx={1.5} fill={color} opacity={0.75} />
            <text x={50} y={20} textAnchor="middle" dominantBaseline="middle" fill="rgba(255,255,255,0.82)" fontSize={9} fontWeight={500}>
              {node.label}
            </text>
            {node.score >= 60 && (
              <>
                <rect x={73} y={-9} width={26} height={14} rx={4} fill={color} />
                <text x={86} y={-1.5} textAnchor="middle" dominantBaseline="middle" fill="white" fontSize={7.5} fontWeight={700}>
                  {node.score}
                </text>
              </>
            )}
          </g>
        );
      })}
    </svg>
  );
}

/* ─── Data ─── */
const FEATURES = [
  {
    icon: GitBranch,
    color: "text-violet-400",
    bg: "from-violet-500/20 to-violet-500/5",
    border: "border-violet-500/20 hover:border-violet-500/40",
    glowColor: "oklch(0.60 0.24 298)",
    title: "Visual Process Mapping",
    description: "Drag-and-drop flow builder with 4 node types. See your entire workflow at a glance — tasks, decisions, delays, and externals.",
    tag: "Core",
  },
  {
    icon: AlertTriangle,
    color: "text-red-400",
    bg: "from-red-500/20 to-red-500/5",
    border: "border-red-500/20 hover:border-red-500/40",
    glowColor: "oklch(0.65 0.22 25)",
    title: "Bottleneck Detection",
    description: "Every node gets a real-time bottleneck score (0–100). Critical nodes glow red — you'll never miss a slowdown again.",
    tag: "Intelligence",
  },
  {
    icon: Zap,
    color: "text-amber-400",
    bg: "from-amber-500/18 to-amber-500/5",
    border: "border-amber-500/20 hover:border-amber-500/40",
    glowColor: "oklch(0.80 0.20 70)",
    title: "Insights Engine",
    description: "Rule-based analysis surfaces actionable insights: 'This step causes 40% of your delay' — no ML required, no guessing.",
    tag: "Intelligence",
  },
  {
    icon: BarChart3,
    color: "text-cyan-400",
    bg: "from-cyan-500/18 to-cyan-500/5",
    border: "border-cyan-500/20 hover:border-cyan-500/40",
    glowColor: "oklch(0.72 0.20 200)",
    title: "Analytics Dashboard",
    description: "Trend charts, KPI cards, and process comparison views. Filter by team, time period, or process status.",
    tag: "Analytics",
  },
  {
    icon: Play,
    color: "text-emerald-400",
    bg: "from-emerald-500/18 to-emerald-500/5",
    border: "border-emerald-500/20 hover:border-emerald-500/40",
    glowColor: "oklch(0.72 0.18 145)",
    title: "Scenario Simulation",
    description: '"What if we remove this step?" Toggle nodes off and instantly see the projected cycle time reduction.',
    tag: "Simulation",
  },
  {
    icon: Users,
    color: "text-primary",
    bg: "from-primary/18 to-primary/5",
    border: "border-primary/20 hover:border-primary/40",
    glowColor: "oklch(0.62 0.24 278)",
    title: "Team Collaboration",
    description: "Comments on nodes, @mentions, activity feeds, and role-based permissions. Work together on live processes.",
    tag: "Collaboration",
  },
];

const TESTIMONIALS = [
  {
    quote: "ProcessLens cut our onboarding cycle time by 31% in the first month. We finally saw where time was actually being lost.",
    name: "Mia Larsson",
    role: "Head of Ops, Riva Health",
    initials: "ML",
    color: "#6366f1",
    stars: 5,
  },
  {
    quote: "The bottleneck heatmap is insane. Spent years trying to explain process delays to leadership — one screenshot from ProcessLens did it instantly.",
    name: "Tom Okafor",
    role: "Product Manager, Blueshift",
    initials: "TO",
    color: "#10b981",
    stars: 5,
  },
  {
    quote: "We ran the simulation feature before a major process change. Saved us from a costly mistake. This tool pays for itself.",
    name: "Jana Kovač",
    role: "COO, Arco Logistics",
    initials: "JK",
    color: "#f59e0b",
    stars: 5,
  },
];

const PLANS = [
  {
    name: "Starter",
    price: "$0",
    period: "forever",
    description: "For individuals exploring process mapping",
    features: ["3 processes", "5 team members", "Basic analytics", "CSV import", "Community support"],
    cta: "Get started free",
    highlighted: false,
  },
  {
    name: "Growth",
    price: "$49",
    period: "per month",
    description: "For teams serious about operational efficiency",
    features: ["Unlimited processes", "25 team members", "Advanced analytics & radar", "Insights engine", "Scenario simulation", "Slack & Jira integrations", "Priority support"],
    cta: "Start 14-day trial",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For large organizations with complex needs",
    features: ["Everything in Growth", "Unlimited members", "SSO / SAML", "Audit logs", "Custom integrations", "Dedicated CSM", "SLA guarantee"],
    cta: "Contact sales",
    highlighted: false,
  },
];

/* ─── Main Component ─── */
export default function LandingPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">

      {/* ── Floating Nav ── */}
      <div className="fixed top-4 inset-x-4 z-50 flex justify-center pointer-events-none">
        <nav
          className="flex items-center justify-between w-full max-w-5xl h-13 px-5 rounded-2xl pointer-events-auto"
          style={{
            background: "oklch(0.072 0.018 265 / 0.85)",
            backdropFilter: "blur(20px) saturate(1.3)",
            WebkitBackdropFilter: "blur(20px) saturate(1.3)",
            border: "1px solid oklch(1 0 0 / 0.09)",
            boxShadow: "0 1px 0 oklch(1 0 0 / 0.06) inset, 0 8px 32px oklch(0 0 0 / 0.35)",
          }}
        >
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, oklch(0.62 0.24 278), oklch(0.60 0.24 298))",
                boxShadow: "0 0 10px oklch(0.62 0.24 278 / 0.4)",
              }}
            >
              <Zap className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-semibold text-sm text-foreground">ProcessLens</span>
          </div>

          {/* Links */}
          <div className="hidden md:flex items-center gap-7 text-sm text-muted-foreground">
            {["Features", "Pricing", "Docs"].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="hover:text-foreground transition-colors duration-200">
                {item}
              </a>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2.5">
            <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors hidden sm:block">
              Sign in
            </Link>
            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 h-8 px-4 rounded-xl text-xs font-semibold text-white transition-all duration-200 hover:opacity-90 hover:scale-[1.02]"
              style={{
                background: "linear-gradient(135deg, oklch(0.62 0.24 278), oklch(0.60 0.24 298))",
                boxShadow: "0 0 12px oklch(0.62 0.24 278 / 0.4)",
              }}
            >
              Get started free
            </Link>
          </div>
        </nav>
      </div>

      {/* ── Hero ── */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex flex-col items-center justify-center pt-20 overflow-hidden"
      >
        {/* Aurora orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="aurora-orb absolute w-[800px] h-[800px] -top-64 left-1/2 -translate-x-1/2"
            style={{
              background: "radial-gradient(circle, oklch(0.62 0.24 278 / 0.18) 0%, transparent 70%)",
              animationDelay: "0s",
            }}
          />
          <div
            className="aurora-orb absolute w-[500px] h-[500px] top-1/3 -right-40"
            style={{
              background: "radial-gradient(circle, oklch(0.60 0.24 298 / 0.10) 0%, transparent 70%)",
              animationDelay: "-3s",
              animationDuration: "10s",
            }}
          />
          <div
            className="aurora-orb absolute w-[400px] h-[400px] top-1/2 -left-20"
            style={{
              background: "radial-gradient(circle, oklch(0.72 0.20 200 / 0.08) 0%, transparent 70%)",
              animationDelay: "-6s",
              animationDuration: "12s",
            }}
          />
        </div>

        {/* Grid */}
        <div className="absolute inset-0 bg-grid opacity-100 pointer-events-none" />

        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto px-6"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border mb-8"
            style={{
              background: "oklch(0.62 0.24 278 / 0.10)",
              borderColor: "oklch(0.62 0.24 278 / 0.30)",
              boxShadow: "0 0 16px oklch(0.62 0.24 278 / 0.15)",
            }}
          >
            <Sparkles className="w-3 h-3 text-primary" />
            <span className="shimmer-text text-xs font-semibold">Now in public beta — free to try</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.08, ease: "easeOut" }}
            className="text-5xl sm:text-6xl lg:text-[5rem] font-bold tracking-tight text-foreground leading-[1.04] mb-7"
          >
            Make invisible{" "}
            <span className="text-gradient-vivid">workflows</span>
            <br />
            <span className="text-gradient">visible.</span>
          </motion.h1>

          {/* Sub */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.18, ease: "easeOut" }}
            className="text-lg text-muted-foreground max-w-2xl leading-relaxed mb-10"
          >
            ProcessLens helps ops teams and product managers map business processes,
            detect bottlenecks with heatmap scoring, and drive efficiency with data-driven
            insights — no PhD required.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.28, ease: "easeOut" }}
            className="flex flex-col sm:flex-row items-center gap-3"
          >
            <Link
              href="/dashboard"
              className="flex items-center gap-2.5 h-12 px-7 rounded-2xl font-semibold text-sm text-white transition-all duration-200 hover:scale-[1.02] hover:opacity-95 active:scale-[0.98]"
              style={{
                background: "linear-gradient(135deg, oklch(0.65 0.24 278), oklch(0.58 0.24 298))",
                boxShadow: "0 0 24px oklch(0.62 0.24 278 / 0.35), 0 4px 12px oklch(0 0 0 / 0.3)",
              }}
            >
              Start for free
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/processes/p1"
              className="flex items-center gap-2.5 h-12 px-6 rounded-2xl text-sm font-medium text-foreground transition-all duration-200 hover:bg-white/6 border border-white/10 hover:border-white/18"
              style={{ background: "oklch(1 0 0 / 0.04)" }}
            >
              <Play className="w-4 h-4 text-muted-foreground" />
              See live demo
            </Link>
          </motion.div>

          {/* Social proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex items-center gap-3 mt-10 text-xs text-muted-foreground"
          >
            <div className="flex -space-x-2">
              {[
                { initials: "ML", color: "#6366f1" },
                { initials: "TO", color: "#10b981" },
                { initials: "JK", color: "#f59e0b" },
                { initials: "AO", color: "#ec4899" },
              ].map(({ initials, color }) => (
                <div
                  key={initials}
                  className="w-6 h-6 rounded-full border-2 flex items-center justify-center text-[9px] font-semibold"
                  style={{ backgroundColor: color + "28", color, borderColor: "oklch(0.072 0.018 265)" }}
                >
                  {initials}
                </div>
              ))}
            </div>
            <span>Trusted by <strong className="text-foreground font-semibold">500+</strong> ops teams worldwide</span>
          </motion.div>
        </motion.div>

        {/* Hero visual — floating browser mockup */}
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.38, ease: "easeOut" }}
          className="relative z-10 w-full max-w-5xl mx-auto px-6 mt-16 animate-float"
        >
          <div
            className="relative rounded-2xl overflow-hidden"
            style={{
              border: "1px solid oklch(1 0 0 / 0.10)",
              background: "oklch(0.105 0.013 265 / 0.95)",
              backdropFilter: "blur(20px)",
              boxShadow: "0 0 0 1px oklch(1 0 0 / 0.05), 0 0 60px -10px oklch(0.62 0.24 278 / 0.3), 0 40px 80px -20px oklch(0 0 0 / 0.65)",
            }}
          >
            {/* Window chrome */}
            <div
              className="flex items-center gap-2 px-4 h-10 border-b"
              style={{ borderColor: "oklch(1 0 0 / 0.07)", background: "oklch(1 0 0 / 0.03)" }}
            >
              <div className="flex gap-1.5">
                {["#ef4444", "#f59e0b", "#10b981"].map((c) => (
                  <div key={c} className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c + "60" }} />
                ))}
              </div>
              <div className="flex-1 flex items-center justify-center">
                <div
                  className="flex items-center gap-2 px-3 h-5 rounded text-[10px] text-muted-foreground"
                  style={{ background: "oklch(1 0 0 / 0.05)", border: "1px solid oklch(1 0 0 / 0.07)" }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" style={{ boxShadow: "0 0 4px rgba(16,185,129,0.8)" }} />
                  processlens.app/processes/customer-onboarding
                </div>
              </div>
            </div>
            {/* Flow diagram */}
            <div className="p-6" style={{ background: "oklch(0.088 0.014 265 / 0.6)" }}>
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-foreground">Customer Onboarding</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    7 nodes · Avg cycle: 72h ·{" "}
                    <span className="text-red-400 font-medium">1 critical bottleneck</span>
                  </p>
                </div>
                <div className="flex items-center gap-3 text-[10px]">
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm bg-red-500" /> Critical</span>
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm bg-amber-500" /> High</span>
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm bg-emerald-500" /> Normal</span>
                </div>
              </div>
              <MiniFlowDemo />
            </div>
          </div>
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <div className="w-px h-10 bg-gradient-to-b from-transparent to-white/20" />
          <p className="text-[10px] text-muted-foreground/50 uppercase tracking-widest">Scroll to explore</p>
        </motion.div>
      </section>

      {/* ── Stats ── */}
      <section className="py-20 border-t border-border">
        <div className="max-w-5xl mx-auto px-6">
          <div
            className="relative p-8 rounded-3xl overflow-hidden"
            style={{
              background: "oklch(0.105 0.013 265)",
              border: "1px solid oklch(1 0 0 / 0.08)",
              boxShadow: "0 1px 0 oklch(1 0 0 / 0.06) inset",
            }}
          >
            {/* Inner glow */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "radial-gradient(ellipse 60% 50% at 50% 0%, oklch(0.62 0.24 278 / 0.07), transparent)",
              }}
            />
            <div className="relative grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
              {[
                { value: 31, suffix: "%", label: "Avg cycle time reduction" },
                { value: 500, suffix: "+", label: "Teams using ProcessLens" },
                { value: 4800, suffix: "+", label: "Processes mapped" },
                { value: 94, suffix: "%", label: "Customer satisfaction" },
              ].map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                >
                  <p className="text-4xl font-bold text-gradient mb-2 font-mono">
                    <Counter to={s.value} suffix={s.suffix} />
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{s.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="py-24">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/25 bg-primary/8 text-xs font-semibold text-primary mb-4">
              <Activity className="w-3 h-3" />
              Features
            </div>
            <h2 className="text-4xl font-bold text-foreground mb-4 leading-tight">
              Everything you need to{" "}
              <span className="text-gradient">optimize processes</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-base">
              Not just a diagramming tool. ProcessLens turns your process maps into a
              living source of operational truth.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.4 }}
                className={cn(
                  "relative p-5 rounded-2xl border bg-card transition-all duration-300 cursor-default group overflow-hidden",
                  f.border
                )}
                style={{ boxShadow: "0 1px 0 oklch(1 0 0 / 0.06) inset, 0 4px 16px oklch(0 0 0 / 0.18)" }}
              >
                {/* Hover glow */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at 0% 100%, ${f.glowColor}12, transparent 60%)`,
                  }}
                />

                <div className={cn("w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center mb-4", f.bg)}>
                  <f.icon className={cn("w-5 h-5", f.color)} />
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-sm font-semibold text-foreground">{f.title}</h3>
                  <span className="text-[9px] px-1.5 py-0.5 rounded font-semibold bg-white/5 text-muted-foreground border border-white/8">
                    {f.tag}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{f.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-24 border-t border-border" style={{ background: "oklch(0.105 0.013 265 / 0.4)" }}>
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-400/25 bg-amber-400/8 text-xs font-semibold text-amber-400 mb-4">
              <Star className="w-3 h-3 fill-amber-400" />
              Social Proof
            </div>
            <h2 className="text-4xl font-bold text-foreground mb-3">
              Teams that made the{" "}
              <span className="text-gradient-violet">invisible visible</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.10, duration: 0.4 }}
                className="relative p-6 rounded-2xl border border-white/7 bg-card overflow-hidden group"
                style={{ boxShadow: "0 1px 0 oklch(1 0 0 / 0.06) inset, 0 4px 20px oklch(0 0 0 / 0.2)" }}
              >
                <div
                  className="absolute top-0 left-0 right-0 h-px pointer-events-none"
                  style={{ background: `linear-gradient(90deg, transparent, ${t.color}50, transparent)` }}
                />
                <div className="flex items-center gap-0.5 mb-4">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-5 italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold border"
                    style={{ backgroundColor: t.color + "18", color: t.color, borderColor: t.color + "30" }}
                  >
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground">{t.name}</p>
                    <p className="text-[10px] text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" className="py-24 border-t border-border">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-400/25 bg-emerald-400/8 text-xs font-semibold text-emerald-400 mb-4">
              <TrendingDown className="w-3 h-3" />
              Pricing
            </div>
            <h2 className="text-4xl font-bold text-foreground mb-3">
              Simple, transparent{" "}
              <span className="text-gradient">pricing</span>
            </h2>
            <p className="text-muted-foreground">No hidden fees. Start free, scale when ready.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {PLANS.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.10, duration: 0.4 }}
                className={cn("relative p-6 rounded-2xl flex flex-col overflow-hidden")}
                style={
                  plan.highlighted
                    ? {
                        border: "1px solid transparent",
                        background:
                          "linear-gradient(oklch(0.105 0.013 265), oklch(0.105 0.013 265)) padding-box, linear-gradient(135deg, oklch(0.62 0.24 278 / 0.8), oklch(0.60 0.24 298 / 0.5)) border-box",
                        boxShadow: "0 0 40px oklch(0.62 0.24 278 / 0.18), 0 4px 24px oklch(0 0 0 / 0.3), inset 0 0 32px oklch(0.62 0.24 278 / 0.04)",
                      }
                    : {
                        background: "oklch(0.105 0.013 265)",
                        border: "1px solid oklch(1 0 0 / 0.08)",
                        boxShadow: "0 1px 0 oklch(1 0 0 / 0.06) inset, 0 4px 16px oklch(0 0 0 / 0.18)",
                      }
                }
              >
                {/* Inner glow for highlighted */}
                {plan.highlighted && (
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: "radial-gradient(ellipse 80% 50% at 50% 0%, oklch(0.62 0.24 278 / 0.10), transparent)",
                    }}
                  />
                )}

                {plan.highlighted && (
                  <div
                    className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-[10px] font-bold text-white"
                    style={{
                      background: "linear-gradient(135deg, oklch(0.62 0.24 278), oklch(0.60 0.24 298))",
                      boxShadow: "0 2px 8px oklch(0.62 0.24 278 / 0.4)",
                    }}
                  >
                    Most Popular
                  </div>
                )}

                <div className="relative mb-6">
                  <p className="text-base font-bold text-foreground mb-1">{plan.name}</p>
                  <div className="flex items-baseline gap-1.5 mb-2">
                    <span className="text-3xl font-bold text-foreground font-mono">{plan.price}</span>
                    {plan.period && <span className="text-xs text-muted-foreground">{plan.period}</span>}
                  </div>
                  <p className="text-xs text-muted-foreground">{plan.description}</p>
                </div>

                <ul className="space-y-2.5 mb-8 flex-1 relative">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-xs text-muted-foreground">
                      <div className="w-4 h-4 rounded-full bg-emerald-500/15 flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5 text-emerald-400" />
                      </div>
                      {f}
                    </li>
                  ))}
                </ul>

                <Link
                  href="/dashboard"
                  className={cn(
                    "relative flex items-center justify-center gap-1.5 h-11 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer",
                    plan.highlighted
                      ? "text-white hover:opacity-90 hover:scale-[1.01]"
                      : "text-foreground hover:bg-white/7 border border-white/10 hover:border-white/16 bg-white/4"
                  )}
                  style={
                    plan.highlighted
                      ? {
                          background: "linear-gradient(135deg, oklch(0.62 0.24 278), oklch(0.60 0.24 298))",
                          boxShadow: "0 0 16px oklch(0.62 0.24 278 / 0.35)",
                        }
                      : undefined
                  }
                >
                  {plan.cta}
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="py-24 border-t border-border relative overflow-hidden">
        {/* Aurora */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className="aurora-orb absolute w-[600px] h-[600px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{
              background: "radial-gradient(circle, oklch(0.62 0.24 278 / 0.12) 0%, transparent 70%)",
            }}
          />
        </div>
        <div className="absolute inset-0 bg-grid opacity-50 pointer-events-none" />

        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
              Your processes are{" "}
              <span className="text-gradient-vivid">leaking time</span>.
              <br />
              Let&apos;s fix that.
            </h2>
            <p className="text-muted-foreground mb-10 max-w-xl mx-auto text-base leading-relaxed">
              Join 500+ teams who mapped their workflows, found their bottlenecks, and started shipping faster.
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2.5 h-14 px-9 rounded-2xl font-semibold text-base text-white transition-all duration-200 hover:scale-[1.02] hover:opacity-95 active:scale-[0.98]"
              style={{
                background: "linear-gradient(135deg, oklch(0.65 0.24 278), oklch(0.58 0.24 298))",
                boxShadow: "0 0 40px oklch(0.62 0.24 278 / 0.4), 0 8px 24px oklch(0 0 0 / 0.35)",
              }}
            >
              Start for free — no credit card required
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-border py-8 px-6 lg:px-12">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div
              className="w-5 h-5 rounded-md flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, oklch(0.62 0.24 278), oklch(0.60 0.24 298))" }}
            >
              <Zap className="w-3 h-3 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-xs font-semibold text-foreground">ProcessLens</span>
            <span className="text-xs text-muted-foreground ml-1">© 2026. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6 text-xs text-muted-foreground">
            {["Privacy", "Terms", "Docs", "Status"].map((l) => (
              <a key={l} href="#" className="hover:text-foreground transition-colors duration-200">{l}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
