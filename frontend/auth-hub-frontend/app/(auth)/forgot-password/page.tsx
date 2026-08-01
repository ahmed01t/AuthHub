import React
 from "react";
 export default function ForgotPasswordPage() {
   return (
     <main className="flex min-h-screen items-center justify-center p-6">
         <section className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
              <h1 className="text-2xl font-semibold text-slate-900">Forgot Password</h1>
                <p className="mt-4 text-slate-600">Please enter your email address to reset your password.</p>
                <form className="mt-6">
                    <div className="mb-4">
                        <input
                            type="email"
                            placeholder="Email Address"
                            className="w-full rounded-md border border-slate-300 p-2 focus:border-blue-500 focus:ring focus:ring-blue-200"
                        />
                    </div>
                    <button 
                        type="submit"
                        className="w-full rounded-md bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        Reset Password
                    </button>
                </form>
            </section>
        </main>
    );
}
