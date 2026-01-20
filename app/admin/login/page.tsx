"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Loader2 } from "lucide-react";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Simple password check - in production, use proper authentication
  const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "admin123";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Simple password authentication
    if (password === ADMIN_PASSWORD) {
      // Store auth in sessionStorage
      sessionStorage.setItem("admin_authenticated", "true");
      router.push("/admin");
    } else {
      setError("Invalid password. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-luxury-ivory flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl p-8 luxury-shadow-lg">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-luxury-gold-light/20 rounded-full mb-4">
              <Lock className="w-8 h-8 text-luxury-gold" />
            </div>
            <h1 className="text-3xl font-bold text-luxury-charcoal mb-2">
              Admin Login
            </h1>
            <p className="text-luxury-charcoal-light">
              Enter password to access admin panel
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-luxury-charcoal mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-luxury-ivory-darker rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury-gold"
                placeholder="Enter admin password"
                required
                autoFocus
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-luxury-charcoal text-luxury-ivory rounded-lg font-medium hover:bg-luxury-charcoal-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </button>
          </form>

          <p className="text-xs text-center text-luxury-charcoal-light mt-6">
            Default password: admin123 (Change in .env: NEXT_PUBLIC_ADMIN_PASSWORD)
          </p>
        </div>
      </div>
    </div>
  );
}
