"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Mail, CheckCircle2, AlertCircle, Loader2, ArrowLeft, RefreshCw } from "lucide-react";

const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  (process.env.NEXT_PUBLIC_BACKEND_URL
    ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1`
    : "http://localhost:8000/api/v1");

type PageStatus = "loading" | "pending" | "verifying" | "success" | "error" | "invalid";

export default function VerifyEmailPage() {
  const [status, setStatus] = useState<PageStatus>("loading");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState("");
  const [resendSuccess, setResendSuccess] = useState<boolean | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const emailParam = params.get("email") || "";
    const tokenParam = params.get("token") || "";

    setEmail(emailParam);

    if (emailParam && tokenParam) {
      // User clicked the verification link in their email
      verifyEmailToken(emailParam, tokenParam);
    } else if (emailParam && !tokenParam) {
      // User was redirected here immediately after registration
      setStatus("pending");
      setMessage("We've sent a verification link to your email address.");
    } else {
      // Neither token nor email provided
      setStatus("invalid");
      setMessage("This verification link is incomplete or invalid.");
    }
  }, []);

  const verifyEmailToken = async (emailVal: string, tokenVal: string) => {
    setStatus("verifying");
    setMessage("Verifying your email address...");

    try {
      const response = await fetch(`${apiBaseUrl}/auth/verify-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: emailVal, token: tokenVal }),
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Unable to verify your email.");
      }

      setStatus("success");
      setMessage(result.message || "Email verified successfully! You can now sign in.");
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to verify your email. Please request a new link."
      );
    }
  };

  const handleResend = async () => {
    if (!email) return;

    setIsResending(true);
    setResendMessage("");
    setResendSuccess(null);

    try {
      const response = await fetch(`${apiBaseUrl}/auth/resend-verification-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to resend verification email.");
      }

      setResendSuccess(true);
      setResendMessage("A new verification link has been sent to your email!");
    } catch (err) {
      setResendSuccess(false);
      setResendMessage(
        err instanceof Error ? err.message : "Failed to resend verification email."
      );
    } finally {
      setIsResending(false);
    }
  };

  return (
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-950 px-4">
      {/* Background Blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-violet-600/20 blur-3xl animate-pulse" />
        <div className="absolute top-1/2 -right-40 h-96 w-96 rounded-full bg-indigo-500/15 blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
        <div className="absolute -bottom-40 left-1/3 h-96 w-96 rounded-full bg-fuchsia-600/15 blur-3xl animate-pulse" style={{ animationDelay: "4s" }} />
      </div>

      {/* Grid pattern overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative w-full max-w-md">
        {/* Logo / Brand */}
        <div className="mb-8 flex flex-col items-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-500/25">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h2 className="text-sm font-semibold uppercase tracking-widest text-violet-400">
            Auth Hub
          </h2>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl text-center">
          {/* Status Icon */}
          <div className="mb-6 flex justify-center">
            {status === "verifying" || status === "loading" ? (
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : status === "success" ? (
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <CheckCircle2 className="h-8 w-8" />
              </div>
            ) : status === "pending" ? (
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <Mail className="h-8 w-8" />
              </div>
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
                <AlertCircle className="h-8 w-8" />
              </div>
            )}
          </div>

          {/* Heading */}
          <h1 className="mb-2 text-2xl font-bold text-white">
            {status === "verifying"
              ? "Verifying Email"
              : status === "success"
              ? "Email Verified!"
              : status === "pending"
              ? "Check Your Email"
              : "Email Verification"}
          </h1>

          {/* Subtitle / Message */}
          <p className="mb-6 text-sm text-slate-300 leading-relaxed">
            {status === "pending" ? (
              <>
                We have sent a verification link to{" "}
                <span className="font-semibold text-violet-300">{email}</span>.
                Please check your inbox (and spam folder) and click the link to verify your account.
              </>
            ) : (
              message
            )}
          </p>

          {/* Resend Status Toast / Feedback */}
          {resendMessage && (
            <div
              className={`mb-6 rounded-xl p-3 text-xs border ${
                resendSuccess
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                  : "border-rose-500/30 bg-rose-500/10 text-rose-300"
              }`}
            >
              {resendMessage}
            </div>
          )}

          {/* Actions */}
          <div className="space-y-3">
            {status === "success" ? (
              <Link
                href="/login"
                className="inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-600/25 transition-all hover:from-violet-500 hover:to-indigo-500"
              >
                Sign In Now
              </Link>
            ) : status === "pending" || status === "error" ? (
              <>
                {email && (
                  <button
                    onClick={handleResend}
                    disabled={isResending}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-3 text-sm font-medium text-white transition-all hover:bg-white/10 disabled:opacity-50"
                  >
                    {isResending ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Resending link...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="h-4 w-4" />
                        Resend Verification Email
                      </>
                    )}
                  </button>
                )}
                <Link
                  href="/login"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl py-2 text-sm text-slate-400 hover:text-white transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Sign In
                </Link>
              </>
            ) : status === "invalid" ? (
              <Link
                href="/login"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 py-3 text-sm font-semibold text-white hover:bg-violet-500 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Sign In
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </main>
  );
}

