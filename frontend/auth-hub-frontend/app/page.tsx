import Link from "next/link";
import type { ReactNode } from "react";
import {
  ArrowRight,
  Check,
  KeyRound,
  LockKeyhole,
  MailCheck,
  ShieldCheck,
  Sparkles,
  UserRoundCheck,
} from "lucide-react";

const benefits = [
  "Secure sign-in with protected sessions",
  "Email verification and password recovery",
  "Simple account and security controls",
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="relative isolate">
        <div className="absolute inset-x-0 top-0 -z-10 h-[42rem] bg-[radial-gradient(circle_at_18%_15%,rgba(99,102,241,0.38),transparent_27rem),radial-gradient(circle_at_78%_18%,rgba(168,85,247,0.28),transparent_24rem)]" />
        <div className="absolute left-1/2 top-64 -z-10 h-96 w-96 -translate-x-1/2 rounded-full bg-indigo-500/20 blur-3xl" />

        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3 font-bold tracking-tight">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-indigo-400 to-violet-600 shadow-lg shadow-indigo-500/30">
              <KeyRound className="h-5 w-5" />
            </span>
            <span className="text-xl">AuthHub</span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-white/10 hover:text-white"
            >
              Log in
            </Link>
            <Link
              href="/Register"
              className="rounded-lg bg-white px-4 py-2 text-sm font-bold text-slate-900 shadow-lg shadow-white/10 transition hover:bg-indigo-50"
            >
              Sign up
            </Link>
          </div>
        </nav>

        <section className="mx-auto grid max-w-7xl items-center gap-16 px-6 pb-24 pt-16 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:pb-32 lg:pt-24">
          <div className="max-w-2xl">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-indigo-300/20 bg-indigo-400/10 px-4 py-2 text-sm font-medium text-indigo-100">
              <Sparkles className="h-4 w-4 text-indigo-300" />
              Authentication made effortless
            </div>
            <h1 className="text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
              Welcome to <span className="bg-gradient-to-r from-indigo-300 via-violet-300 to-fuchsia-300 bg-clip-text text-transparent">AuthHub.</span>
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-slate-300 sm:text-xl">
              Your secure home for account access. Create an account, verify your email, and manage your credentials with confidence.
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/Register"
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-500 px-6 py-3.5 font-bold text-white shadow-xl shadow-indigo-500/25 transition hover:bg-indigo-400"
              >
                Create your account
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 px-6 py-3.5 font-semibold text-white transition hover:border-white/30 hover:bg-white/10"
              >
                I already have an account
              </Link>
            </div>

            <ul className="mt-10 space-y-3 text-sm text-slate-300 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:space-y-0">
              {benefits.map((benefit) => (
                <li key={benefit} className="flex items-start gap-2.5">
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-emerald-400/15 text-emerald-300">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  {benefit}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative mx-auto w-full max-w-lg">
            <div className="absolute -inset-6 rounded-[2rem] bg-gradient-to-br from-indigo-500/25 to-fuchsia-500/20 blur-2xl" />
            <div className="relative rounded-[2rem] border border-white/15 bg-slate-900/70 p-5 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-7">
              <div className="flex items-center justify-between border-b border-white/10 pb-5">
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-indigo-500/20 text-indigo-300">
                    <ShieldCheck className="h-6 w-6" />
                  </span>
                  <div>
                    <p className="font-semibold">Account protected</p>
                    <p className="text-sm text-slate-400">Your security overview</p>
                  </div>
                </div>
                <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-300">Active</span>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <FeatureCard icon={<LockKeyhole className="h-5 w-5" />} title="Private by default" text="Secure cookies and protected routes keep access under control." />
                <FeatureCard icon={<MailCheck className="h-5 w-5" />} title="Email verified" text="Confirm account ownership with a secure verification flow." />
                <FeatureCard icon={<UserRoundCheck className="h-5 w-5" />} title="Your account" text="Update your profile and credentials whenever you need." />
                <FeatureCard icon={<KeyRound className="h-5 w-5" />} title="Easy recovery" text="Reset passwords safely when access is lost." />
              </div>

              <div className="mt-6 rounded-2xl border border-indigo-300/15 bg-gradient-to-r from-indigo-500/15 to-violet-500/10 p-4">
                <p className="text-sm font-semibold text-indigo-100">Ready when you are</p>
                <p className="mt-1 text-sm leading-6 text-slate-300">Join AuthHub and take control of your account in minutes.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function FeatureCard({ icon, title, text }: { icon: ReactNode; title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4 transition hover:border-indigo-300/30 hover:bg-white/[0.07]">
      <span className="mb-3 inline-flex rounded-lg bg-indigo-400/10 p-2 text-indigo-300">{icon}</span>
      <h2 className="font-semibold text-slate-100">{title}</h2>
      <p className="mt-1.5 text-sm leading-5 text-slate-400">{text}</p>
    </div>
  );
}
