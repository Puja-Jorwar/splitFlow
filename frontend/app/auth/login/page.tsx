"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Logo } from "@/components/logo";
import { apiRequest } from "@/lib/api"; // ⭐ ADD

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  // ⭐ ADD STATE
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ⭐ REPLACE FUNCTION BODY ONLY
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await apiRequest("/auth/login", {
        method: "POST",
        body: { email, password },
      });

      localStorage.setItem("token", data.token); // ⭐ STORE TOKEN
      console.log("TOKEN SAVED:", data.token);

      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md space-y-8 px-4">
        <div className="flex flex-col items-center space-y-2 text-center">
          <Link href="/" className="flex items-center justify-center">
            <Logo size="md" />
          </Link>
          <h1 className="text-2xl font-bold">Welcome back</h1>
          <p className="text-sm text-muted-foreground">
            Enter your email and password to sign in to your account
          </p>
        </div>

        <div className="grid gap-6">
          <form onSubmit={handleLogin}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email} // ⭐ ADD
                  onChange={(e) => setEmail(e.target.value)} // ⭐ ADD
                />
              </div>

              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="/auth/reset-password"
                    className="text-sm underline underline-offset-4"
                  >
                    Forgot password?
                  </Link>
                </div>

                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    required
                    value={password} // ⭐ ADD
                    onChange={(e) => setPassword(e.target.value)} // ⭐ ADD
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2"
                    onClick={() => setShowPassword(!showPassword)}
                    type="button"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                    <span className="sr-only">
                      {showPassword ? "Hide password" : "Show password"}
                    </span>
                  </Button>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Signing in..." : "Sign In"}
              </Button>

              {/* ⭐ OPTIONAL ERROR MESSAGE */}
              {error && <p className="text-sm text-red-500">{error}</p>}
            </div>
          </form>

          {/* REST OF UI — UNTOUCHED */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline">Google</Button>
            <Button variant="outline">Apple</Button>
          </div>

          <div className="text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/auth/signup" className="underline underline-offset-4">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
