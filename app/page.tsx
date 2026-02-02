import Link from "next/link"
import { ArrowRight, Receipt, Wallet, Users, CreditCard, Activity } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/logo"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <Link href="/" className="flex items-center gap-2">
            <Logo size="md" />
          </Link>
          <nav className="ml-auto flex gap-4 sm:gap-6">
            <Link href="#features" className="text-sm font-medium">
              Features
            </Link>
            <Link href="#how-it-works" className="text-sm font-medium">
              How It Works
            </Link>
            <Link href="#pricing" className="text-sm font-medium">
              Pricing
            </Link>
          </nav>
          <div className="ml-auto flex items-center gap-4">
            <Link href="/auth/login">
              <Button variant="ghost" size="sm">
                Log in
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button size="sm">Sign up</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Split Expenses <span className="splitflow-gradient-text">Effortlessly</span> with Friends
                  </h1>
                  <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                    SplitFlow helps you track shared expenses, maintain real-time balances, and settle up easily with
                    friends and roommates.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/auth/signup">
                    <Button size="lg">
                      Get Started
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="#how-it-works">
                    <Button size="lg" variant="outline">
                      Learn More
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="rounded-xl border bg-background p-8 shadow-lg">
                  <div className="flex justify-between mb-6">
                    <h3 className="text-xl font-bold">Trip to Barcelona</h3>
                    <span className="text-green-600 font-semibold">€1,240.50</span>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-2 border-b">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                          <span className="font-semibold text-purple-600">AJ</span>
                        </div>
                        <span>Alex Jones</span>
                      </div>
                      <div className="text-red-500">owes €145.75</div>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                          <span className="font-semibold text-blue-600">SM</span>
                        </div>
                        <span>Sarah Miller</span>
                      </div>
                      <div className="text-green-500">gets back €212.25</div>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center mr-3">
                          <span className="font-semibold text-teal-600">TK</span>
                        </div>
                        <span>Tom Knight</span>
                      </div>
                      <div className="text-red-500">owes €66.50</div>
                    </div>
                  </div>
                  <Button className="w-full mt-6">Settle Up</Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-900">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Key Features</h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  SplitFlow makes expense sharing easy with powerful features designed for friends, roommates, and
                  groups.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                <Receipt className="h-12 w-12 text-emerald-500" />
                <h3 className="text-xl font-bold">Expense Tracking</h3>
                <p className="text-center text-gray-500 dark:text-gray-400">
                  Log expenses with details like amount, category, and participants.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                <Users className="h-12 w-12 text-violet-500" />
                <h3 className="text-xl font-bold">Smart Splitting</h3>
                <p className="text-center text-gray-500 dark:text-gray-400">
                  Split costs equally, by percentage, or specific amounts.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                <Activity className="h-12 w-12 text-amber-500" />
                <h3 className="text-xl font-bold">Real-time Dashboard</h3>
                <p className="text-center text-gray-500 dark:text-gray-400">
                  See who owes whom at a glance with real-time balance updates.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                <CreditCard className="h-12 w-12 text-sky-500" />
                <h3 className="text-xl font-bold">Payment Integration</h3>
                <p className="text-center text-gray-500 dark:text-gray-400">
                  Connect with UPI and PayPal for direct settlements.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-pink-100 dark:bg-pink-900">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6 text-pink-500"
                  >
                    <path d="M16 16v-3a2 2 0 0 0-2-2H3a2 2 0 0 0-2 2v3"></path>
                    <path d="M8.5 19a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"></path>
                    <path d="M16 19a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"></path>
                    <path d="M16 8V5c0-1.1-.9-2-2-2H8v5h8Z"></path>
                    <path d="M22 13h-2l-1.5-6h5.5l-2 6Z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Notifications</h3>
                <p className="text-center text-gray-500 dark:text-gray-400">
                  Get reminders for pending payments and expense updates.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cyan-100 dark:bg-cyan-900">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6 text-cyan-500"
                  >
                    <rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect>
                    <line x1="16" x2="16" y1="2" y2="6"></line>
                    <line x1="8" x2="8" y1="2" y2="6"></line>
                    <line x1="3" x2="21" y1="10" y2="10"></line>
                    <path d="M8 14h.01"></path>
                    <path d="M12 14h.01"></path>
                    <path d="M16 14h.01"></path>
                    <path d="M8 18h.01"></path>
                    <path d="M12 18h.01"></path>
                    <path d="M16 18h.01"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Activity History</h3>
                <p className="text-center text-gray-500 dark:text-gray-400">
                  Track all transactions and settlements over time.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full border-t py-6">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2">
            <Wallet className="h-6 w-6" />
            <p className="text-sm text-gray-500 dark:text-gray-400">© 2024 SplitFlow. All rights reserved.</p>
          </div>
          <nav className="flex gap-4 sm:gap-6">
            <Link className="text-sm font-medium hover:underline" href="#">
              Terms of Service
            </Link>
            <Link className="text-sm font-medium hover:underline" href="#">
              Privacy
            </Link>
            <Link className="text-sm font-medium hover:underline" href="#">
              Contact
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}
