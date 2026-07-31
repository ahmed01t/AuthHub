"use client";

import { useEffect, useState } from "react";

const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api/v1";

export default function VerifyEmailPage() {
  const [message, setMessage] = useState("Verifying your email address…");
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);

  useEffect(() => {
    const verifyEmail = async () => {
      const params = new URLSearchParams(window.location.search);
      const email = params.get("email");
      const token = params.get("token");

      if (!email || !token) {
        setIsSuccess(false);
        setMessage("This verification link is incomplete or invalid.");
        return;
      }

      try {
        const response = await fetch(`${apiBaseUrl}/auth/verify-email`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ email, token }),
        });
        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Unable to verify your email.");
        }

        setIsSuccess(true);
        setMessage(result.message || "Email verified successfully. You can now sign in.");
      } catch (error) {
        setIsSuccess(false);
        setMessage(
          error instanceof Error
            ? error.message
            : "Unable to verify your email. Please request a new link."
        );
      }
    };

    verifyEmail();
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <section className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Email verification</h1>
        <p
          className={`mt-4 ${
            isSuccess === false ? "text-red-600" : isSuccess ? "text-green-600" : "text-slate-600"
          }`}
        >
          {message}
        </p>
      </section>
    </main>
  );
}
