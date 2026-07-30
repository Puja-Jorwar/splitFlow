import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Receipt,
  Users,
  CreditCard,
  Activity,
  Zap,
  CheckCircle2,
  Sparkles,
  Star,
  TrendingUp,
  Shield,
  Globe,
  BarChart3,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/logo";

const TESTIMONIALS = [
  {
    text: "SplitFlow changed how our friend group handles shared costs. No more awkward \"who paid for what\" convos.",
    name: "Priya M.",
    role: "Software Engineer",
    initials: "PM",
    color: "bg-indigo-500/20 text-indigo-300",
  },
  {
    text: "We use it for our apartment. Utilities, groceries, takeout — everything tracked perfectly.",
    name: "Carlos R.",
    role: "Designer",
    initials: "CR",
    color: "bg-emerald-500/20 text-emerald-300",
  },
  {
    text: "The cleanest expense splitting app I've used. The real-time balance updates are just chef's kiss.",
    name: "Aisha K.",
    role: "Product Manager",
    initials: "AK",
    color: "bg-pink-500/20 text-pink-300",
  },
];

const FEATURES = [
  {
    icon: <Receipt className="h-5 w-5" />,
    color: "text-emerald-400 bg-emerald-500/10",
    title: "Track Every Expense",
    desc: "Log expenses with categories, notes, receipts, and custom split configurations.",
  },
  {
    icon: <Users className="h-5 w-5" />,
    color: "text-indigo-400 bg-indigo-500/10",
    title: "Smart Group Splitting",
    desc: "Split equally, by percentage, or custom amounts across any number of people.",
  },
  {
    icon: <Activity className="h-5 w-5" />,
    color: "text-pink-400 bg-pink-500/10",
    title: "Real-time Balances",
    desc: "Balances recalculate instantly across all members as expenses are added.",
  },
  {
    icon: <CreditCard className="h-5 w-5" />,
    color: "text-sky-400 bg-sky-500/10",
    title: "Settle Up Instantly",
    desc: "Record direct payments to settle debts. Clean history, zero friction.",
  },
  {
    icon: <Zap className="h-5 w-5" />,
    color: "text-amber-400 bg-amber-500/10",
    title: "Receipt Scanning",
    desc: "Scan any paper receipt and let AI extract and split line items for you.",
  },
  {
    icon: <BarChart3 className="h-5 w-5" />,
    color: "text-violet-400 bg-violet-500/10",
    title: "Spending Analytics",
    desc: "Visualize category breakdown, monthly trends, and group-level insights.",
  },
];

const STEPS = [
  {
    step: "01",
    title: "Create a Group",
    desc: "Set up groups for roommates, trips, or events. Invite members with just an email.",
    icon: <Users className="h-6 w-6 text-indigo-400" />,
  },
  {
    step: "02",
    title: "Log Expenses",
    desc: "Add expenses as they happen. Choose who paid, the split method, and category.",
    icon: <Receipt className="h-6 w-6 text-emerald-400" />,
  },
  {
    step: "03",
    title: "Settle Balances",
    desc: "See exactly who owes what. Record settlements and watch balances clear.",
    icon: <TrendingUp className="h-6 w-6 text-pink-400" />,
  },
];

export default function LandingPage() {
  const [billAmount, setBillAmount] = useState<string>("240");
  const [numPeople, setNumPeople] = useState<number>(4);
  const splitAmount = ((parseFloat(billAmount) || 0) / numPeople).toFixed(2);

  return (
    <div className="flex min-h-screen flex-col bg-[#030712] text-slate-100 overflow-x-hidden">

      {/* ===== NAVIGATION ===== */}
      <header className="fixed top-0 z-50 w-full border-b border-white/[0.06] bg-[#030712]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
            <Logo size="md" />
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            {["Features", "Demo", "How It Works"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/ /g, "-")}`}
                className="text-sm font-medium text-slate-400 hover:text-white transition-colors duration-200"
              >
                {item}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <Link to="/auth/login">
              <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white hover:bg-white/5 font-medium">
                Log in
              </Button>
            </Link>
            <Link to="/auth/signup">
              <Button size="sm" className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 font-semibold px-5 rounded-xl transition-all duration-200 hover:shadow-indigo-500/30">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 pt-16">
        {/* ===== HERO ===== */}
        <section className="relative w-full min-h-[90vh] flex items-center justify-center hero-mesh overflow-hidden py-24 px-6">
          {/* Ambient orbs */}
          <div className="absolute top-[-15%] left-[-10%] h-[700px] w-[700px] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none animate-pulse-glow" />
          <div className="absolute bottom-[-10%] right-[-15%] h-[600px] w-[600px] bg-purple-600/8 rounded-full blur-[120px] pointer-events-none animate-pulse-glow animation-delay-300" />

          <div className="max-w-7xl mx-auto w-full grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-20 items-center">

            {/* Left — Copy */}
            <div className="flex flex-col space-y-8 animate-slide-up">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 w-fit text-xs font-bold shadow-sm">
                <Sparkles className="h-3.5 w-3.5 fill-indigo-400 text-indigo-400" />
                Smart Expense Splitting
              </div>

              <div className="space-y-5">
                <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tighter text-white leading-[1.08]">
                  Split Bills.{" "}
                  <br className="hidden sm:block" />
                  <span className="splitflow-gradient-text">Skip the Drama.</span>
                </h1>
                <p className="max-w-[520px] text-slate-400 text-base md:text-lg leading-relaxed">
                  SplitFlow tracks group expenses in real time, calculates exactly who owes what, and lets you settle up in one tap. No spreadsheets, no awkward reminders.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/auth/signup">
                  <Button size="lg" className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl shadow-indigo-500/25 font-bold rounded-2xl px-8 py-3 h-auto transition-all duration-200 hover:scale-[1.01] hover:shadow-indigo-500/35 w-full sm:w-auto">
                    Start for Free
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <a href="#demo">
                  <Button size="lg" variant="outline" className="border-white/10 hover:bg-white/5 text-slate-300 rounded-2xl px-8 py-3 h-auto font-medium w-full sm:w-auto transition-all duration-200">
                    Try Live Demo
                    <ChevronRight className="ml-1.5 h-4 w-4" />
                  </Button>
                </a>
              </div>

              {/* Trust signals */}
              <div className="flex flex-wrap items-center gap-6 pt-2">
                {[
                  { icon: <Shield className="h-3.5 w-3.5 text-emerald-400" />, text: "Free forever" },
                  { icon: <Globe className="h-3.5 w-3.5 text-indigo-400" />, text: "No credit card" },
                  { icon: <CheckCircle2 className="h-3.5 w-3.5 text-sky-400" />, text: "Open source" },
                ].map((t) => (
                  <div key={t.text} className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
                    {t.icon} {t.text}
                  </div>
                ))}
              </div>
            </div>

            {/* Right — Preview Card */}
            <div className="flex justify-center lg:justify-end animate-slide-up animation-delay-200">
              <div className="w-full max-w-[400px] rounded-[1.75rem] bg-[#0d1326]/80 border border-white/[0.07] p-6 shadow-[0_32px_80px_-12px_rgba(0,0,0,0.7)] backdrop-blur-xl relative overflow-hidden animate-float-medium">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/5 to-transparent pointer-events-none" />

                {/* Card Header */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Live Group</p>
                    <h3 className="text-xl font-extrabold text-white mt-0.5">Barcelona Trip 🇪🇸</h3>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest">Total Spent</p>
                    <p className="text-lg font-extrabold text-white">€1,240</p>
                  </div>
                </div>

                {/* Members */}
                <div className="space-y-2.5 mb-6">
                  {[
                    { name: "Alex J.", initials: "AJ", color: "bg-purple-500/20 text-purple-400", amount: "-€145", tag: "owes", tagColor: "text-rose-400 bg-rose-500/10" },
                    { name: "Sarah M.", initials: "SM", color: "bg-blue-500/20 text-blue-400", amount: "+€212", tag: "owed", tagColor: "text-emerald-400 bg-emerald-500/10" },
                    { name: "Tom K.", initials: "TK", color: "bg-emerald-500/20 text-emerald-400", amount: "-€66", tag: "owes", tagColor: "text-rose-400 bg-rose-500/10" },
                  ].map((m, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.06] transition-colors">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${m.color}`}>{m.initials}</div>
                        <span className="text-sm font-medium text-slate-200">{m.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${m.tagColor}`}>{m.tag}</span>
                        <span className="text-sm font-bold text-white">{m.amount}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="rounded-xl bg-white/[0.03] border border-white/[0.05] p-3 text-center">
                    <p className="text-lg font-extrabold text-white">12</p>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider mt-0.5">Expenses</p>
                  </div>
                  <div className="rounded-xl bg-white/[0.03] border border-white/[0.05] p-3 text-center">
                    <p className="text-lg font-extrabold text-emerald-400">3</p>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider mt-0.5">Members</p>
                  </div>
                </div>

                {/* CTA */}
                <Link to="/auth/login">
                  <Button className="w-full mt-4 bg-white hover:bg-slate-100 text-slate-900 font-bold rounded-2xl py-3 h-auto transition-all hover:scale-[1.01] text-sm shadow-lg">
                    Settle Up Now
                  </Button>
                </Link>
              </div>
            </div>

          </div>
        </section>

        {/* ===== STATS BAR ===== */}
        <section className="border-y border-white/[0.06] bg-white/[0.01]">
          <div className="max-w-7xl mx-auto px-6 py-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { label: "Expenses Tracked", value: "2M+" },
                { label: "Active Groups", value: "180K+" },
                { label: "Amount Split", value: "$45M+" },
                { label: "Happy Users", value: "95K+" },
              ].map((stat) => (
                <div key={stat.label} className="space-y-1">
                  <div className="text-3xl font-extrabold stat-number">{stat.value}</div>
                  <div className="text-xs text-slate-500 uppercase tracking-widest font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== FEATURES ===== */}
        <section id="features" className="w-full py-28 bg-[#030712] px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20 space-y-4">
              <div className="badge-indigo mx-auto w-fit">Features</div>
              <h2 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tighter">
                Everything you need to split smarter
              </h2>
              <p className="max-w-xl mx-auto text-slate-400 text-base md:text-lg leading-relaxed">
                Built for friend groups, roommates, and travel buddies. Powerful when you need it, simple when you don't.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {FEATURES.map((f, i) => (
                <div
                  key={i}
                  className="glass-card rounded-3xl p-7 relative overflow-hidden group"
                >
                  <div className="absolute top-0 right-0 h-24 w-24 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: `radial-gradient(circle, currentColor 0%, transparent 70%)`, opacity: 0.05 }}
                  />
                  <div className={`inline-flex p-3 rounded-2xl mb-5 ${f.color}`}>
                    {f.icon}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2.5">{f.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== INTERACTIVE DEMO ===== */}
        <section id="demo" className="w-full py-28 border-t border-white/[0.06] bg-[#060b1a] px-6">
          <div className="max-w-7xl mx-auto grid gap-16 lg:grid-cols-2 items-center">
            <div className="space-y-7">
              <div className="badge-emerald badge-indigo w-fit">Interactive Demo</div>
              <h2 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tighter leading-tight">
                See the split<br />before you sign up.
              </h2>
              <p className="text-slate-400 text-base md:text-lg leading-relaxed">
                Adjust the bill amount and number of people — watch balances recalculate in real time. This is exactly what SplitFlow does for all your real expenses.
              </p>
              <ul className="space-y-3">
                {[
                  "Live recalculation as you type",
                  "Handles any number of people",
                  "Works for restaurants, rent, trips, and more",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-slate-300 font-medium">
                    <CheckCircle2 className="h-4.5 w-4.5 text-emerald-400 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex justify-center">
              <div className="w-full max-w-[420px] rounded-[1.75rem] bg-[#0d1326]/90 border border-white/[0.07] p-8 shadow-2xl backdrop-blur-xl space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="demo-amount" className="text-slate-300 text-sm font-semibold">Total Bill Amount ($)</Label>
                  <Input
                    id="demo-amount"
                    type="number"
                    min="0"
                    value={billAmount}
                    onChange={(e) => setBillAmount(e.target.value)}
                    className="bg-white/[0.04] border-white/[0.08] focus:border-indigo-500/50 focus:ring-0 text-white rounded-xl h-12 text-xl font-bold"
                    placeholder="0.00"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm font-semibold text-slate-300">
                    <span>Split Between</span>
                    <span className="text-indigo-400">{numPeople} people</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setNumPeople(Math.max(2, numPeople - 1))}
                      className="h-11 w-11 rounded-xl bg-white/[0.04] border border-white/[0.08] text-slate-300 font-bold text-lg hover:bg-white/[0.08] transition-colors flex items-center justify-center"
                    >
                      −
                    </button>
                    <div className="flex-1 bg-white/[0.03] border border-white/[0.07] rounded-xl py-2.5 text-center font-semibold text-white text-sm">
                      {numPeople} People
                    </div>
                    <button
                      onClick={() => setNumPeople(Math.min(20, numPeople + 1))}
                      className="h-11 w-11 rounded-xl bg-white/[0.04] border border-white/[0.08] text-slate-300 font-bold text-lg hover:bg-white/[0.08] transition-colors flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="border-t border-white/[0.07] pt-6">
                  <div className="rounded-2xl bg-indigo-600/10 border border-indigo-500/20 p-6 text-center">
                    <p className="text-[11px] text-indigo-300 uppercase tracking-widest font-bold mb-2">Each person pays</p>
                    <div className="text-5xl font-extrabold text-white tracking-tighter">${splitAmount}</div>
                  </div>
                </div>

                <Link to="/auth/signup">
                  <Button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl h-11 transition-all duration-200">
                    Try with real expenses →
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ===== HOW IT WORKS ===== */}
        <section id="how-it-works" className="w-full py-28 bg-[#030712] border-t border-white/[0.06] px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20 space-y-4">
              <div className="badge-indigo mx-auto w-fit">Workflow</div>
              <h2 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tighter">
                Up and running in 3 steps
              </h2>
              <p className="max-w-lg mx-auto text-slate-400 text-base md:text-lg leading-relaxed">
                No tutorials needed. SplitFlow is designed to be instantly obvious.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {STEPS.map((s, i) => (
                <div key={i} className="glass-card rounded-3xl p-8 text-center relative overflow-hidden group">
                  <div className="w-14 h-14 mx-auto mb-6 rounded-2xl bg-white/[0.04] border border-white/[0.07] flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    {s.icon}
                  </div>
                  <div className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.15em] mb-3">Step {s.step}</div>
                  <h3 className="text-xl font-bold text-white mb-3">{s.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== TESTIMONIALS ===== */}
        <section className="w-full py-28 border-t border-white/[0.06] bg-[#060b1a] px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16 space-y-4">
              <div className="flex justify-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-amber-400 fill-amber-400" />
                ))}
              </div>
              <h2 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tighter">
                Loved by real people
              </h2>
              <p className="text-slate-400 text-base md:text-lg">
                Join thousands already using SplitFlow to keep friendships intact.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
              {TESTIMONIALS.map((t, i) => (
                <div key={i} className="glass-card rounded-3xl p-7 space-y-5">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} className="h-4 w-4 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed">"{t.text}"</p>
                  <div className="flex items-center gap-3 pt-2 border-t border-white/[0.05]">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold ${t.color}`}>
                      {t.initials}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{t.name}</p>
                      <p className="text-xs text-slate-500">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== CTA ===== */}
        <section className="w-full py-24 border-t border-white/[0.06] bg-[#030712] px-6">
          <div className="max-w-4xl mx-auto">
            <div className="relative rounded-[2rem] overflow-hidden border border-white/[0.07] p-12 md:p-20 text-center">
              {/* Background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/15 via-transparent to-purple-600/10" />
              <div className="absolute top-[-50%] left-[50%] -translate-x-1/2 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />

              <div className="relative z-10 space-y-6">
                <div className="badge-indigo mx-auto w-fit">Start today</div>
                <h2 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tighter">
                  Keep your friendships<br />
                  <span className="splitflow-gradient-text">and your balances</span> clear.
                </h2>
                <p className="max-w-xl mx-auto text-slate-400 text-base md:text-lg leading-relaxed">
                  Completely free. No credit card. Start splitting in under a minute.
                </p>
                <Link to="/auth/signup">
                  <Button size="lg" className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold h-auto py-4 px-10 rounded-2xl shadow-2xl shadow-indigo-500/25 transition-all duration-200 hover:scale-[1.02] hover:shadow-indigo-500/35 mt-4">
                    Create a Free Account
                    <ArrowRight className="ml-2.5 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ===== FOOTER ===== */}
      <footer className="w-full border-t border-white/[0.06] py-10 bg-[#030712] px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <Logo size="sm" />
            <p className="text-sm text-slate-500 text-center">
              © 2026 SplitFlow. Built with ❤️ for better friendships.
            </p>
            <div className="flex gap-6">
              {["Terms", "Privacy", "Contact"].map((link) => (
                <a key={link} className="text-sm text-slate-500 hover:text-slate-200 transition-colors font-medium" href="#">
                  {link}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
