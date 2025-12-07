"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useToast } from "@/components/toast/use-toast";
import { useRouter } from "next/navigation";
import {useSearchParams} from "next/navigation"; 
import { useSession } from "@/hooks/use-session";
import { loginUser } from "../actions/auth";
import Spinner from "@/components/spinner";

export default function LoginPage() {
  const { session, isLoading } = useSession();
  const { showToast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/shop";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // If session is loading → show subtle loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black-primary flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center p-4">
          <Spinner />
        </main>
        <Footer />
      </div>
    );
  }

  // GUARDRAIL: User is already logged in → show friendly redirect screen
  if (session) {
    return (
      <div className="min-h-screen bg-black-primary flex flex-col">
        <Header />

        <main className="flex-1 flex items-center justify-center px-6 py-12">
          <motion.div
            className="max-w-md w-full text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="border border-border bg-black-secondary/50 backdrop-blur-sm p-12 rounded-none">
              <div className="mb-8">
                <div className="w-24 h-24 mx-auto mb-6 bg-gold-primary/20 rounded-full flex items-center justify-center">
                  <span className="text-4xl font-bold text-gold-primary">
                    {session.name?.charAt(0).toUpperCase() || "U"}
                  </span>
                </div>

                <h1 className="text-3xl font-bold tracking-widest mb-3">
                  You're Already Logged In
                </h1>

                <p className="text-xl text-gold-primary font-medium mb-2">
                  Welcome back, {session.name || session.email}!
                </p>

                <p className="text-muted-foreground">
                  You are currently signed in and ready to shop.
                </p>
              </div>

              <div className="space-y-4">
                <Link
                  href="/profile"
                  className="block w-full py-4 bg-gold-primary text-black-primary font-bold tracking-widest hover:bg-gold-secondary transition-colors"
                >
                  GO TO MY PROFILE
                </Link>

                <Link
                  href="/shop"
                  className="block w-full py-4 border border-border text-foreground font-bold tracking-widest hover:border-gold-primary hover:text-gold-primary transition-colors"
                >
                  CONTINUE SHOPPING
                </Link>

                <Link
                  href="/"
                  className="block text-sm text-muted-foreground hover:text-gold-primary transition-colors underline underline-offset-4"
                >
                  ← Back to Homepage
                </Link>
              </div>
            </div>
          </motion.div>
        </main>

        <Footer />
      </div>
    );
  }

  // MAIN LOGIN FORM (only shown when NOT logged in)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    const success = await loginUser(email, password);

    if (success) {
      showToast("Welcome back!", "success");
      if(redirect){
        router.push(redirect);
      }else{
        router.push('/profile');
      }
    } else {
      showToast("Invalid email or password.", "error");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black-primary flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-12 sm:py-16">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="border border-border p-8 sm:p-12">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-widest mb-2 text-center">
              WELCOME
            </h1>
            <p className="text-center text-muted-foreground mb-8">
              Sign in to your Mode Men Mag account
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-bold tracking-widest text-gold-primary mb-3">
                  EMAIL
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 bg-black-secondary border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:border-gold-primary transition-colors text-sm"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-xs font-bold tracking-widest text-gold-primary mb-3">
                  PASSWORD
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-black-secondary border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:border-gold-primary transition-colors text-sm"
                  required
                  disabled={loading}
                />
              </div>

              <div className="flex justify-end">
                <a
                  href="#"
                  className="text-sm text-gold-primary hover:underline underline-offset-2 transition-colors"
                >
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                disabled={loading || !email || !password}
                className="w-full py-4 bg-gold-primary text-black-primary font-bold tracking-widest hover:bg-gold-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "SIGNING IN..." : "SIGN IN"}
              </button>
            </form>

            <div className="mt-8 pt-8 border-t border-border text-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link
                  href="/signup"
                  className="text-gold-primary hover:text-gold-secondary font-medium transition-colors"
                >
                  Create one
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
