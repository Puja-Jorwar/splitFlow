import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Receipt,
  Wallet,
  Users,
  CreditCard,
  Activity,
  Zap,
  CheckCircle2,
  Sparkles,
  Calculator,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";


export default function LandingPage() {
  // Calculator Demo State
  const [billAmount, setBillAmount] = useState<string>("150");
  const [numFriends, setNumFriends] = useState<number>(3);
  
  const parsedAmount = parseFloat(billAmount) || 0;
  const splitAmount = parsedAmount > 0 ? (parsedAmount / (numFriends + 1)).toFixed(2) : "0.00";

  return (
    <div className="flex min-h-screen flex-col bg-[#030712] text-slate-100 relative overflow-hidden select-none font-sans">
      
      {/* Aurora Ambient Lighting Gradients */}
      <div className="absolute top-[-10%] left-[-20%] h-[600px] w-[600px] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-[40%] right-[-10%] h-[700px] w-[700px] bg-purple-600/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] h-[500px] w-[500px] bg-pink-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#030712]/75 backdrop-blur-xl">
        <div className="container flex h-16 items-center justify-between px-6 mx-auto">
          <Link to="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
            <Logo size="md" />
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-semibold text-slate-400 hover:text-white transition-colors">
              Features
            </a>
            <a href="#demo" className="text-sm font-semibold text-slate-400 hover:text-white transition-colors">
              Interactive Demo
            </a>
            <a href="#how-it-works" className="text-sm font-semibold text-slate-400 hover:text-white transition-colors">
              How It Works
            </a>
          </nav>
          <div className="flex items-center gap-4">
            <Link to="/auth/login">
              <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white hover:bg-white/5 font-semibold">
                Log in
              </Button>
            </Link>
            <Link to="/auth/signup">
              <Button size="sm" className="bg-primary hover:bg-primary/95 text-white shadow-lg shadow-primary/20 font-semibold px-4 rounded-xl">
                Sign up
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        
        {/* Hero Section */}
        <section className="w-full py-20 md:py-32 xl:py-40 flex items-center justify-center">
          <div className="container px-6 mx-auto">
            <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:gap-16 items-center">
              
              {/* Hero Copy */}
              <div className="flex flex-col justify-center space-y-8 text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 w-fit text-xs font-bold shadow-sm backdrop-blur-sm animate-pulse">
                  <Sparkles className="h-3.5 w-3.5 text-indigo-400 fill-indigo-400" /> Smart Expense Splitting
                </div>
                <div className="space-y-4">
                  <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl text-white leading-tight">
                    Split Expenses,<br />
                    <span className="splitflow-gradient-text">Keep Good Vibes.</span>
                  </h1>
                  <p className="max-w-[550px] text-slate-400 text-base md:text-lg leading-relaxed">
                    Ditch the calculator and awkward follow-ups. SplitFlow organizes group bills, calculates balances, and coordinates settlements automatically.
                  </p>
                </div>
                <div className="flex flex-col gap-4 sm:flex-row">
                  <Link to="/auth/signup" className="w-full sm:w-auto">
                    <Button size="lg" className="bg-primary hover:bg-primary/95 text-white shadow-xl shadow-primary/20 w-full sm:w-auto font-bold rounded-2xl h-13 px-8 transition-transform hover:scale-[1.01]">
                      Get Started Free
                      <ArrowRight className="ml-2.5 h-4.5 w-4.5" />
                    </Button>
                  </Link>
                  <a href="#demo" className="w-full sm:w-auto">
                    <Button size="lg" variant="outline" className="border-white/10 hover:bg-white/5 text-slate-300 w-full sm:w-auto rounded-2xl h-13 px-8 font-semibold">
                      Try Quick Split
                    </Button>
                  </a>
                </div>
              </div>

              {/* Barcelona Showcase Card */}
              <div className="flex items-center justify-center">
                <div className="w-full max-w-[420px] rounded-[2rem] bg-slate-900/40 border border-white/5 p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 h-40 w-40 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
                  <div className="flex justify-between items-center mb-8">
                    <div>
                      <span className="text-xs text-indigo-400 uppercase tracking-widest font-bold">Active Group</span>
                      <h3 className="text-2xl font-extrabold text-white mt-1">Barcelona Trip</h3>
                    </div>
                    <div className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full text-xs font-extrabold">
                      €1,240.50
                    </div>
                  </div>
                  <div className="space-y-4">
                    {[
                      { name: "Alex Jones", initials: "AJ", color: "bg-purple-500/20 text-purple-400", status: "owes €145.75", statusColor: "text-rose-400" },
                      { name: "Sarah Miller", initials: "SM", color: "bg-blue-500/20 text-blue-400", status: "gets back €212.25", statusColor: "text-emerald-400" },
                      { name: "Tom Knight", initials: "TK", color: "bg-emerald-500/20 text-emerald-400", status: "owes €66.50", statusColor: "text-rose-400" },
                    ].map((member, i) => (
                      <div key={i} className="flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] transition-all">
                        <div className="flex items-center">
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center mr-3 font-bold text-xs ${member.color}`}>
                            {member.initials}
                          </div>
                          <span className="font-semibold text-sm text-slate-200">{member.name}</span>
                        </div>
                        <div className={`text-sm font-bold ${member.statusColor}`}>{member.status}</div>
                      </div>
                    ))}
                  </div>
                  <Button asChild className="w-full mt-8 bg-slate-100 hover:bg-slate-200 text-slate-950 font-bold py-3.5 rounded-2xl shadow-lg transition-transform hover:scale-[1.01]">
                    <Link to="/auth/login">Settle Up</Link>
                  </Button>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Interactive Split Demo */}
        <section id="demo" className="w-full py-20 bg-[#060a18] border-t border-b border-white/5 relative flex items-center justify-center">
          <div className="container px-6 mx-auto">
            <div className="grid gap-12 lg:grid-cols-2 items-center">
              
              <div className="space-y-6">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 w-fit text-xs font-bold">
                  <Calculator className="h-3.5 w-3.5" /> Interactive Calculator
                </div>
                <h2 className="text-3xl font-extrabold tracking-tight sm:text-5xl text-white">
                  See how simple it is.
                </h2>
                <p className="text-slate-400 text-base md:text-lg leading-relaxed">
                  Adjust the bill amount and choose how many friends to split it with. See your individual shares calculate in real-time, instantly.
                </p>
                <div className="space-y-4 pt-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
                    <span className="text-sm text-slate-300 font-medium">Automatic equal distribution</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
                    <span className="text-sm text-slate-300 font-medium">Zero transaction fees on ledger updates</span>
                  </div>
                </div>
              </div>

              {/* Calculator Box */}
              <div className="flex items-center justify-center">
                <div className="w-full max-w-[420px] rounded-[2rem] bg-slate-900/40 border border-white/5 p-8 shadow-2xl backdrop-blur-xl space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="demo-amount" className="text-slate-300 text-sm font-semibold">Total Bill Amount ($)</Label>
                    <Input
                      id="demo-amount"
                      type="number"
                      value={billAmount}
                      onChange={(e) => setBillAmount(e.target.value)}
                      className="bg-slate-950/50 border-white/5 focus:border-primary/50 text-white rounded-xl h-12 text-lg font-bold"
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm font-semibold text-slate-300">
                      <span>Split Between</span>
                      <span className="text-indigo-400 font-bold">{numFriends + 1} People</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button
                        onClick={() => setNumFriends(Math.max(1, numFriends - 1))}
                        className="bg-white/5 hover:bg-white/10 border-white/5 rounded-xl h-11 w-11 font-bold text-slate-200"
                      >
                        -
                      </Button>
                      <div className="flex-1 text-center bg-slate-950/30 border border-white/5 rounded-xl py-2.5 font-bold text-white text-base">
                        You + {numFriends} Friend{numFriends > 1 ? "s" : ""}
                      </div>
                      <Button
                        onClick={() => setNumFriends(Math.min(10, numFriends + 1))}
                        className="bg-white/5 hover:bg-white/10 border-white/5 rounded-xl h-11 w-11 font-bold text-slate-200"
                      >
                        +
                      </Button>
                    </div>
                  </div>

                  <div className="border-t border-white/5 pt-6 mt-6">
                    <div className="rounded-2xl bg-indigo-600/10 border border-indigo-500/20 p-5 text-center">
                      <span className="text-xs text-indigo-300 uppercase tracking-widest font-bold">Each Person Pays</span>
                      <div className="text-4xl font-extrabold text-white mt-1.5">${splitAmount}</div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-24 bg-[#030712] flex items-center justify-center">
          <div className="container px-6 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-20">
              <span className="text-xs text-indigo-400 uppercase tracking-widest font-bold">Powerful Features</span>
              <h2 className="text-3xl font-extrabold tracking-tight sm:text-5xl text-white">
                Engineered for Frictionless Splitting
              </h2>
              <p className="max-w-[700px] text-slate-400 text-base md:text-lg leading-relaxed">
                We designed SplitFlow to make shared ledgers simple, fast, and gorgeous. Here is what you get.
              </p>
            </div>
            
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[
                { icon: <Receipt className="h-6 w-6 text-emerald-400" />, title: "Track Every Penny", desc: "Log shared expenses with details like category, split configurations, and receipts." },
                { icon: <Users className="h-6 w-6 text-indigo-400" />, title: "Smart Splitting Options", desc: "Divide bills equally, by percentage, or custom amounts to handle complex balances." },
                { icon: <Activity className="h-6 w-6 text-pink-400" />, title: "Real-time Calculations", desc: "Watch your balances recalculate on the fly. Know exactly who gets what." },
                { icon: <CreditCard className="h-6 w-6 text-sky-400" />, title: "Frictionless Settlement", desc: "Record payments directly with a few clicks. Clear debts instantly." },
                { icon: <Zap className="h-6 w-6 text-amber-400" />, title: "Receipt Scanning", desc: "Leverage OCR technology to scan and extract items from paper bills in seconds." },
                { icon: <Users className="h-6 w-6 text-purple-400" />, title: "Group Organization", desc: "Separate roommates, dinner groups, and trips into independent ledgers." },
              ].map((feature, i) => (
                <div key={i} className="flex flex-col items-start p-8 rounded-3xl bg-slate-900/30 border border-white/5 hover:border-white/10 hover:bg-slate-900/50 transition-all duration-300 hover:scale-[1.01] hover:shadow-xl relative overflow-hidden">
                  <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 mb-5 shrink-0">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="w-full py-24 bg-[#060a18] border-t border-white/5 flex items-center justify-center">
          <div className="container px-6 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-20">
              <span className="text-xs text-indigo-400 uppercase tracking-widest font-bold">Simplified Workflow</span>
              <h2 className="text-3xl font-extrabold tracking-tight sm:text-5xl text-white">
                How SplitFlow Works
              </h2>
              <p className="max-w-[700px] text-slate-400 text-base md:text-lg leading-relaxed">
                Three simple steps to keep your shared group balances completely in sync.
              </p>
            </div>

            <div className="grid gap-10 md:grid-cols-3 max-w-5xl mx-auto">
              {[
                { step: "01", title: "Create a Group", desc: "Set up a shared group for your roommates, vacation, or dinners and invite members by email." },
                { step: "02", title: "Log Expenses", desc: "Add expenses as they happen. Specify who paid and choose your splitting strategy." },
                { step: "03", title: "Settle Balances", desc: "See clean summaries of who owes whom. Record direct payments to clear balances." },
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center text-center p-8 rounded-3xl bg-white/[0.02] border border-white/5 relative">
                  <div className="w-12 h-12 rounded-full bg-primary/20 text-primary-foreground font-extrabold flex items-center justify-center text-lg mb-6 border border-primary/20">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="w-full py-24 bg-[#030712] border-t border-white/5 flex items-center justify-center">
          <div className="container px-6 mx-auto">
            <div className="max-w-4xl mx-auto rounded-[2.5rem] bg-gradient-to-br from-indigo-600/20 to-purple-600/10 border border-white/5 p-12 text-center relative overflow-hidden">
              <div className="absolute top-[-20%] right-[-20%] h-60 w-60 bg-indigo-500/25 rounded-full blur-3xl pointer-events-none" />
              <h2 className="text-3xl font-extrabold tracking-tight sm:text-5xl text-white mb-4">
                Keep Balances Clear Today
              </h2>
              <p className="max-w-[600px] text-slate-400 text-base md:text-lg mx-auto mb-8 leading-relaxed">
                Join thousands of users who split costs without friction. Sign up for SplitFlow free.
              </p>
              <Link to="/auth/signup">
                <Button size="lg" className="bg-primary hover:bg-primary/95 text-white font-bold h-12 px-8 rounded-xl shadow-xl shadow-primary/30 transition-transform hover:scale-[1.01]">
                  Get Started Now
                </Button>
              </Link>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="w-full border-t border-white/5 py-8 bg-[#030712] z-10 relative">
        <div className="container px-6 mx-auto flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-indigo-400" />
            <p className="text-sm text-slate-400">
              © 2026 SplitFlow. All rights reserved. Premium Product Design.
            </p>
          </div>
          <nav className="flex gap-6">
            <a className="text-sm font-semibold text-slate-400 hover:text-white transition-colors" href="#">
              Terms of Service
            </a>
            <a className="text-sm font-semibold text-slate-400 hover:text-white transition-colors" href="#">
              Privacy Policy
            </a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
