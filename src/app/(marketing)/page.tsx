"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
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
    const dur = 1400;
    const tick = (now: number) => {
      const t = Math.min((now - start) / dur, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      setVal(Math.round(ease * to));
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, to]);

  return <span ref={ref}>{val}{suffix}</span>;
}

/* ─── Mini flow diagram (animated) ─── */
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
  { from: 1, to: 2 },
  { from: 2, to: 3 },
  { from: 3, to: 4 },
  { from: 3, to: 5 },
  { from: 4, to: 6 },
  { from: 5, to: 6 },
  { from: 6, to: 7 },
];

function getScoreColor(score: number): string {
  if (score >= 80) return "#ef4444";
  if (score >= 60) return "#f59e0b";
  if (score >= 35) return "#eab308";
  return "#10b981";
}

function MiniFlowDemo() {
  const [pulse, setPulse] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setPulse((p) => (p + 1) % 7), 1200);
    return () => clearInterval(id);
  }, []);

  return (
    <svg viewBox="0 0 860 260" className="w-full h-auto" style={{ overflow: "visible" }}>
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="glowRed">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <marker id="arrow" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto">
          <path d="M0,0 L0,6 L8,3 z" fill="rgba(255,255,255,0.2)" />
        </marker>
      </defs>

      {/* Edges */}
      {DEMO_EDGES.map(({ from, to }) => {
        const s = DEMO_NODES.find((n) => n.id === from)!;
        const t = DEMO_NODES.find((n) => n.id === to)!;
        return (
          <line
            key={`${from}-${to}`}
            x1={s.x + 50}
            y1={s.y + 16}
            x2={t.x}
            y2={t.y + 16}
            stroke="rgba(255,255,255,0.12)"
            strokeWidth={1.5}
            markerEnd="url(#arrow)"
          />
        );
      })}

      {/* Nodes */}
      {DEMO_NODES.map((node, i) => {
        const color = getScoreColor(node.score);
        const isActive = pulse === i;
        const isCritical = node.score >= 80;
        return (
          <g key={node.id} transform={`translate(${node.x}, ${node.y})`}>
            {/* Glow for critical */}
            {isCritical && (
              <rect
                x={-3}
                y={-3}
                width={106}
                height={40}
                rx={9}
                fill={color}
                opacity={0.15}
                filter="url(#glowRed)"
              />
            )}
            {/* Node body */}
            <rect
              x={0}
              y={0}
              width={100}
              height={34}
              rx={7}
              fill={isActive ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.04)"}
              stroke={isActive ? color : `${color}40`}
              strokeWidth={isActive ? 1.5 : 1}
            />
            {/* Score indicator bar */}
            <rect x={0} y={31} width={node.score} height={3} rx={1.5} fill={color} opacity={0.8} />
            {/* Label */}
            <text x={50} y={20} textAnchor="middle" dominantBaseline="middle" fill="rgba(255,255,255,0.85)" fontSize={9} fontWeight={500}>
              {node.label}
            </text>
            {/* Score badge for high */}
            {node.score >= 60 && (
              <>
                <rect x={74} y={-8} width={24} height={13} rx={3} fill={color} />
                <text x={86} y={-0.5} textAnchor="middle" dominantBaseline="middle" fill="white" fontSize={7.5} fontWeight={700}>
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

const FEATURES = [
  {
    icon: GitBranch,
    color: "text-primary",
    bg: "bg-primary/10",
    border: "border-primary/20",
    title: "Visual Process Mapping",
    description:
      "Drag-and-drop flow builder with 4 node types: Task, Decision, Delay, and External. See your entire workflow at a glance.",
  },
  {
    icon: AlertTriangle,
    color: "text-red-400",
    bg: "bg-red-400/10",
    border: "border-red-400/20",
    title: "Bottleneck Detection",
    description:
      "Every node gets a real-time bottleneck score (0–100). Critical nodes glow red — you'll never miss a slowdown again.",
  },
  {
    icon: Zap,
    color: "text-amber-400",
    bg: "bg-amber-400/10",
    border: "border-amber-400/20",
    title: "Insights Engine",
    description:
      "Rule-based analysis surfaces actionable insights: 'This step causes 40% of your delay' — no ML required.",
  },
  {
    icon: BarChart3,
    color: "text-cyan-400",
    bg: "bg-cyan-400/10",
    border: "border-cyan-400/20",
    title: "Analytics Dashboard",
    description:
      "Trend charts, KPI cards, and process comparison views. Filter by team, time period, or process status.",
  },
  {
    icon: Play,
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
    border: "border-emerald-400/20",
    title: "Scenario Simulation",
    description:
      "\"What if we remove this step?\" Toggle nodes off and instantly see the projected cycle time reduction.",
  },
  {
    icon: Users,
    color: "text-violet-400",
    bg: "bg-violet-400/10",
    border: "border-violet-400/20",
    title: "Team Collaboration",
    description:
      "Comments on nodes, @mentions, activity feeds, and role-based permissions. Work together on live processes.",
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
    features: [
      "Unlimited processes",
      "25 team members",
      "Advanced analytics & radar",
      "Insights engine",
      "Scenario simulation",
      "Slack & Jira integrations",
      "Priority support",
    ],
    cta: "Start 14-day trial",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For large organizations with complex needs",
    features: [
      "Everything in Growth",
      "Unlimited members",
      "SSO / SAML",
      "Audit logs",
      "Custom integrations",
      "Dedicated CSM",
      "SLA guarantee",
    ],
    cta: "Contact sales",
    highlighted: false,
  },
];

export default function LandingPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Nav */}
      <nav className="fixed top-0 inset-x-0 z-50 flex items-center justify-between h-14 px-6 lg:px-12 border-b border-white/5 bg-background/80 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center glow-primary-sm">
            <Zap className="w-4 h-4 text-primary-foreground" strokeWidth={2.5} />
          </div>
          <span className="font-semibold text-sm text-foreground">ProcessLens</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          {["Features", "Pricing", "Docs"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="hover:text-foreground transition-colors"
            >
              {item}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors hidden sm:block"
          >
            Sign in
          </Link>
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 h-8 px-4 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors glow-primary-sm"
          >
            Get started free
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex flex-col items-center justify-center pt-14 overflow-hidden"
      >
        {/* Gradient mesh background */}
        <div className="absolute inset-0 bg-grid opacity-100" />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% -10%, oklch(0.60 0.22 277 / 0.15), transparent), radial-gradient(ellipse 60% 40% at 80% 50%, oklch(0.70 0.18 200 / 0.06), transparent)",
          }}
        />

        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto px-6"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-xs font-medium text-primary mb-8"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Now in public beta — free to try
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-foreground leading-[1.05] mb-6"
          >
            Make invisible{" "}
            <span className="text-gradient">workflows</span>
            <br />
            visible.
          </motion.h1>

          {/* Sub */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-muted-foreground max-w-2xl leading-relaxed mb-10"
          >
            ProcessLens helps ops teams and product managers map business processes, detect bottlenecks with heatmap scoring, and drive efficiency with data-driven insights — no PhD required.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center gap-3"
          >
            <Link
              href="/dashboard"
              className="flex items-center gap-2 h-12 px-6 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-all glow-primary hover:scale-[1.02] active:scale-[0.98]"
            >
              Start for free
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/processes/p1"
              className="flex items-center gap-2 h-12 px-6 rounded-xl bg-white/5 border border-white/10 text-foreground font-medium text-sm hover:bg-white/8 hover:border-white/20 transition-all"
            >
              <Play className="w-4 h-4" />
              See live demo
            </Link>
          </motion.div>

          {/* Social proof mini */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex items-center gap-3 mt-8 text-xs text-muted-foreground"
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
                  className="w-6 h-6 rounded-full border-2 border-background flex items-center justify-center text-[9px] font-semibold"
                  style={{ backgroundColor: color + "30", color, borderColor: "oklch(0.085 0.012 265)" }}
                >
                  {initials}
                </div>
              ))}
            </div>
            <span>Trusted by <strong className="text-foreground">500+</strong> ops teams</span>
          </motion.div>
        </motion.div>

        {/* Hero demo visual */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative z-10 w-full max-w-5xl mx-auto px-6 mt-16"
        >
          <div
            className="relative rounded-2xl border border-white/10 bg-card/80 backdrop-blur-sm overflow-hidden"
            style={{
              boxShadow: "0 0 80px -20px oklch(0.60 0.22 277 / 0.25), 0 40px 80px -20px rgba(0,0,0,0.6)",
            }}
          >
            {/* Window chrome */}
            <div className="flex items-center gap-2 px-4 h-10 border-b border-white/8 bg-white/3">
              <div className="flex gap-1.5">
                {["#ef4444", "#f59e0b", "#10b981"].map((c) => (
                  <div key={c} className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c + "60" }} />
                ))}
              </div>
              <div className="flex-1 flex items-center justify-center">
                <div className="flex items-center gap-2 px-3 h-5 rounded bg-white/5 border border-white/8 text-[10px] text-muted-foreground">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  processlens.app/processes/customer-onboarding
                </div>
              </div>
            </div>
            {/* Flow diagram */}
            <div className="p-6 bg-background/50">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-foreground">Customer Onboarding</p>
                  <p className="text-xs text-muted-foreground">7 nodes · Avg cycle: 72h · <span className="text-red-400 font-medium">1 critical bottleneck</span></p>
                </div>
                <div className="flex items-center gap-2 text-[10px]">
                  <span className="w-2 h-2 rounded-sm bg-red-500" /> Critical
                  <span className="w-2 h-2 rounded-sm bg-amber-500 ml-2" /> High
                  <span className="w-2 h-2 rounded-sm bg-emerald-500 ml-2" /> Normal
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
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <div className="w-px h-12 bg-linear-to-b from-transparent to-white/20" />
          <p className="text-[10px] text-muted-foreground/60 uppercase tracking-widest">Scroll to explore</p>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="py-20 border-t border-border">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {[
              { value: 31, suffix: "%", label: "Average cycle time reduction" },
              { value: 500, suffix: "+", label: "Teams using ProcessLens" },
              { value: 4800, suffix: "+", label: "Processes mapped" },
              { value: 94, suffix: "%", label: "Customer satisfaction" },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
              >
                <p className="text-4xl font-bold text-gradient mb-2">
                  <Counter to={s.value} suffix={s.suffix} />
                </p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">Features</p>
            <h2 className="text-4xl font-bold text-foreground mb-4">Everything you need to optimize processes</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Not just a diagramming tool. ProcessLens turns your process maps into a living source of operational truth.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.4 }}
                className={cn(
                  "p-5 rounded-xl border bg-card hover:bg-white/5 transition-all",
                  f.border
                )}
              >
                <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center mb-4", f.bg)}>
                  <f.icon className={cn("w-5 h-5", f.color)} />
                </div>
                <h3 className="text-sm font-semibold text-foreground mb-2">{f.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{f.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 border-t border-border bg-card/30">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">Social Proof</p>
            <h2 className="text-4xl font-bold text-foreground mb-4">Teams that made the invisible visible</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-2xl border border-white/8 bg-card"
              >
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-5">&ldquo;{t.quote}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold"
                    style={{ backgroundColor: t.color + "20", color: t.color }}
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

      {/* Pricing */}
      <section id="pricing" className="py-24 border-t border-border">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">Pricing</p>
            <h2 className="text-4xl font-bold text-foreground mb-4">Simple, transparent pricing</h2>
            <p className="text-muted-foreground">No hidden fees. No surprise charges. Start free, scale when ready.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PLANS.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={cn(
                  "relative p-6 rounded-2xl border flex flex-col",
                  plan.highlighted
                    ? "border-primary/50 bg-primary/5 glow-primary"
                    : "border-border bg-card"
                )}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-primary text-primary-foreground text-[10px] font-semibold">
                    Most Popular
                  </div>
                )}
                <div className="mb-6">
                  <p className="text-sm font-semibold text-foreground mb-1">{plan.name}</p>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-3xl font-bold text-foreground">{plan.price}</span>
                    {plan.period && <span className="text-xs text-muted-foreground">{plan.period}</span>}
                  </div>
                  <p className="text-xs text-muted-foreground">{plan.description}</p>
                </div>
                <ul className="space-y-2.5 mb-8 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/dashboard"
                  className={cn(
                    "flex items-center justify-center gap-1.5 h-10 rounded-xl text-sm font-medium transition-all",
                    plan.highlighted
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "bg-white/5 border border-white/10 text-foreground hover:bg-white/8"
                  )}
                >
                  {plan.cta}
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 border-t border-border">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
              Your processes are{" "}
              <span className="text-gradient">leaking time</span>.
              <br />
              Let&apos;s fix that.
            </h2>
            <p className="text-muted-foreground mb-10 max-w-xl mx-auto">
              Join 500+ teams who mapped their workflows, found their bottlenecks, and started shipping faster.
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 h-14 px-8 rounded-2xl bg-primary text-primary-foreground font-semibold text-base hover:bg-primary/90 transition-all glow-primary hover:scale-[1.02] active:scale-[0.98]"
            >
              Start for free — no credit card required
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-6 lg:px-12">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-primary/80 flex items-center justify-center">
              <Zap className="w-3 h-3 text-primary-foreground" strokeWidth={2.5} />
            </div>
            <span className="text-xs font-semibold text-foreground">ProcessLens</span>
            <span className="text-xs text-muted-foreground ml-2">© 2026. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6 text-xs text-muted-foreground">
            {["Privacy", "Terms", "Docs", "Status"].map((l) => (
              <a key={l} href="#" className="hover:text-foreground transition-colors">{l}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
