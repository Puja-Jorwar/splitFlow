import { Link } from "react-router-dom";
import {
  ArrowRight,
  Receipt,
  Wallet,
  Users,
  CreditCard,
  Activity,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#070b19] text-slate-100 relative overflow-hidden select-none">
      {/* Background Decorative Blur Gradients */}
      <div className="absolute top-[-10%] left-[-10%] h-[500px] w-[500px] bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] h-[500px] w-[500px] bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />

      <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#070b19]/80 backdrop-blur-md">
        <div className="container flex h-16 items-center px-4 md:px-6">
          <Link to="/" className="flex items-center gap-2">
            <Logo size="md" />
          </Link>
          <nav className="ml-auto hidden md:flex gap-8">
            <a href="#features" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
              How It Works
            </a>
          </nav>
          <div className="ml-auto flex items-center gap-4">
            <Link to="/auth/login">
              <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white hover:bg-white/5">
                Log in
              </Button>
            </Link>
            <Link to="/auth/signup">
              <Button size="sm" className="bg-primary hover:bg-primary/95 text-white shadow-lg shadow-primary/20">
                Sign up
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="w-full py-16 md:py-28 lg:py-36 xl:py-48 flex items-center justify-center">
          <div className="container px-4 md:px-6">
            <div className="grid gap-12 lg:grid-cols-[1fr_450px] lg:gap-16 items-center">
              <div className="flex flex-col justify-center space-y-6">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 w-fit text-xs font-semibold">
                  <Zap className="h-3 w-3 fill-indigo-400" /> Introducing SplitFlow 2.0
                </div>
                <div className="space-y-4">
                  <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-white leading-tight">
                    Split Expenses <br />
                    <span className="splitflow-gradient-text">
                      Effortlessly
                    </span>{" "}
                    with Friends
                  </h1>
                  <p className="max-w-[600px] text-slate-400 text-base md:text-lg">
                    Ditch the awkward calculations. Track shared expenses, maintain
                    real-time balances, and settle up instantly with friends, roommates, and travel buddies.
                  </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Link to="/auth/signup">
                    <Button size="lg" className="bg-primary hover:bg-primary/95 text-white shadow-xl shadow-primary/30 w-full sm:w-auto">
                      Get Started
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <a href="#features">
                    <Button size="lg" variant="outline" className="border-white/10 hover:bg-white/5 text-slate-300 w-full sm:w-auto">
                      Explore Features
                    </Button>
                  </a>
                </div>
              </div>

              {/* Showcase Card */}
              <div className="flex items-center justify-center">
                <div className="w-full max-w-[450px] rounded-3xl glass-panel p-8 shadow-2xl relative overflow-hidden border border-white/10">
                  <div className="absolute top-0 right-0 h-32 w-32 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
                  <div className="flex justify-between items-center mb-8">
                    <div>
                      <span className="text-xs text-indigo-400 uppercase tracking-widest font-semibold">Active Trip</span>
                      <h3 className="text-2xl font-bold text-white mt-1">Trip to Barcelona</h3>
                    </div>
                    <div className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full text-sm font-bold">
                      €1,240.50
                    </div>
                  </div>
                  <div className="space-y-4">
                    {[
                      { name: "Alex Jones", initials: "AJ", color: "bg-purple-500/20 text-purple-400", status: "owes €145.75", statusColor: "text-rose-400" },
                      { name: "Sarah Miller", initials: "SM", color: "bg-blue-500/20 text-blue-400", status: "gets back €212.25", statusColor: "text-emerald-400" },
                      { name: "Tom Knight", initials: "TK", color: "bg-emerald-500/20 text-emerald-400", status: "owes €66.50", statusColor: "text-rose-400" },
                    ].map((member, i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5">
                        <div className="flex items-center">
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center mr-3 font-bold text-sm ${member.color}`}>
                            {member.initials}
                          </div>
                          <span className="font-medium text-sm text-slate-200">{member.name}</span>
                        </div>
                        <div className={`text-sm font-semibold ${member.statusColor}`}>{member.status}</div>
                      </div>
                    ))}
                  </div>
                  <Button className="w-full mt-8 bg-slate-100 hover:bg-slate-200 text-slate-950 font-bold py-3 rounded-2xl shadow-lg transition-transform hover:scale-[1.01]">
                    Settle Up
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section
          id="features"
          className="w-full py-20 md:py-32 bg-[#0c1125] border-t border-b border-white/5 relative"
        >
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
              <h2 className="text-3xl font-extrabold tracking-tight sm:text-5xl text-white">
                Everything you need to Split
              </h2>
              <p className="max-w-[700px] text-slate-400 text-base md:text-lg">
                SplitFlow makes tracking and settling shared debts frictionless, so you can spend less time math-ing.
              </p>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 py-4 md:grid-cols-2 lg:grid-cols-3">
              {[
                { icon: <Receipt className="h-6 w-6 text-emerald-400" />, title: "Expense Tracking", desc: "Easily log expenses with custom descriptions, amount, category, and date." },
                { icon: <Users className="h-6 w-6 text-indigo-400" />, title: "Smart Splitting", desc: "Split costs equally or divide by percentages and custom share amounts." },
                { icon: <Activity className="h-6 w-6 text-pink-400" />, title: "Real-time Dashboard", desc: "See your dynamic balances, debts, and credits update instantly across all groups." },
                { icon: <CreditCard className="h-6 w-6 text-sky-400" />, title: "Fast Settlements", desc: "Integrate custom options to record settlements and keep history balanced." },
                { icon: <Zap className="h-6 w-6 text-amber-400" />, title: "Receipt Scanning", desc: "Instantly scan paper receipts to extract line items and split quickly." },
                { icon: <Users className="h-6 w-6 text-purple-400" />, title: "Multi-group Support", desc: "Organize spending by rooms, trips, outings, or custom shared spaces." },
              ].map((feature, i) => (
                <div key={i} className="flex flex-col items-start p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/[0.07] transition-all duration-300">
                  <div className="p-3 rounded-xl bg-white/5 mb-4 border border-white/5">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full border-t border-white/5 py-8 bg-[#070b19] z-10 relative">
        <div className="container px-4 md:px-6 flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-indigo-400" />
            <p className="text-sm text-slate-400">
              © 2026 SplitFlow. Built for beautiful pair-programming experiences.
            </p>
          </div>
          <nav className="flex gap-6">
            <a className="text-sm font-medium text-slate-400 hover:text-white transition-colors" href="#">
              Terms
            </a>
            <a className="text-sm font-medium text-slate-400 hover:text-white transition-colors" href="#">
              Privacy
            </a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
