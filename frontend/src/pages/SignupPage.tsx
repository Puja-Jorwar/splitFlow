import type React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail, ArrowLeft, User, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Logo } from "@/components/logo";
import { apiRequest } from "@/lib/api";

export default function SignupPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const name = `${firstName} ${lastName}`.trim();
      const data = await apiRequest("/auth/register", {
        method: "POST",
        body: { name, email, password },
      });

      localStorage.setItem("token", data.token);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to register account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#070b19] text-slate-100 relative items-center justify-center overflow-hidden px-4 select-none">
      {/* Decorative Blurs */}
      <div className="absolute top-[-20%] left-[-20%] h-[600px] w-[600px] bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-20%] h-[600px] w-[600px] bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Back button */}
      <Link to="/" className="absolute top-6 left-6 text-slate-400 hover:text-white flex items-center gap-1.5 text-sm font-medium transition-colors">
        <ArrowLeft className="h-4 w-4" />
        Back to Home
      </Link>

      <div className="w-full max-w-md space-y-6 z-10 py-10">
        <div className="flex flex-col items-center space-y-3 text-center">
          <Link to="/" className="flex items-center justify-center">
            <Logo size="lg" />
          </Link>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mt-4">Create an account</h1>
          <p className="text-sm text-slate-400">
            Sign up to track and divide shared bills with ease
          </p>
        </div>

        <div className="rounded-3xl glass-panel p-8 shadow-2xl border border-white/10 relative overflow-hidden">
          <form onSubmit={handleSignup} className="space-y-4">
            {error && (
              <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">
                <ShieldAlert className="h-5 w-5 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Registration failed</p>
                  <p className="text-xs text-rose-400/90 mt-0.5">{error}</p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="first-name" className="text-slate-300 font-medium text-xs">First Name</Label>
                <div className="relative">
                  <Input
                    id="first-name"
                    placeholder="John"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="pl-9 bg-slate-950/40 border-white/5 focus:border-primary/50 text-white rounded-xl h-10 text-sm"
                  />
                  <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="last-name" className="text-slate-300 font-medium text-xs">Last Name</Label>
                <div className="relative">
                  <Input
                    id="last-name"
                    placeholder="Doe"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="pl-9 bg-slate-950/40 border-white/5 focus:border-primary/50 text-white rounded-xl h-10 text-sm"
                  />
                  <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-slate-300 font-medium text-xs">Email Address</Label>
              <div className="relative">
                <Input
                  id="email"
                  placeholder="name@example.com"
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9 bg-slate-950/40 border-white/5 focus:border-primary/50 text-white rounded-xl h-10 text-sm"
                />
                <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-slate-300 font-medium text-xs">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  required
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9 pr-9 bg-slate-950/40 border-white/5 focus:border-primary/50 text-white rounded-xl h-10 text-sm"
                />
                <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  type="button"
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-200 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <Checkbox id="terms" required className="border-white/20 data-[state=checked]:bg-primary rounded" />
              <Label
                htmlFor="terms"
                className="text-xs text-slate-400 leading-normal"
              >
                I agree to the{" "}
                <Link to="#" className="text-indigo-400 hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link to="#" className="text-indigo-400 hover:underline">
                  Privacy Policy
                </Link>
              </Label>
            </div>

            <Button type="submit" className="w-full bg-primary hover:bg-primary/95 text-white font-bold h-11 rounded-xl shadow-lg shadow-primary/20 transition-transform active:scale-[0.99] mt-4" disabled={loading}>
              {loading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>

          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full border-white/5" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#0f142b] px-3 text-slate-400">
                Or sign up with
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="border-white/5 hover:bg-white/5 text-slate-300 rounded-xl h-10 text-xs">Google</Button>
            <Button variant="outline" className="border-white/5 hover:bg-white/5 text-slate-300 rounded-xl h-10 text-xs">Apple</Button>
          </div>

          <div className="text-center text-sm text-slate-400 mt-6">
            Already have an account?{" "}
            <Link
              to="/auth/login"
              className="text-indigo-400 hover:text-indigo-300 font-semibold underline underline-offset-4"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
