"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError("ایمیل یا رمز عبور اشتباه است.");
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-card bg-ivory-soft p-8 shadow-soft"
      >
        <h1 className="mb-1 text-center font-display text-2xl font-bold text-brand">
          SAIRA
        </h1>
        <p className="mb-6 text-center text-sm text-ink-muted">ورود به پنل مدیریت</p>

        <div className="mb-4">
          <label className="mb-1 block text-sm text-ink-muted">ایمیل</label>
          <input
            type="email"
            dir="ltr"
            className="input-field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="mb-1 block text-sm text-ink-muted">رمز عبور</label>
          <input
            type="password"
            dir="ltr"
            className="input-field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error && (
          <p className="mb-4 rounded-lg bg-brand/10 px-3 py-2 text-sm text-brand">
            {error}
          </p>
        )}

        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? "در حال ورود..." : "ورود"}
        </button>
      </form>
    </div>
  );
}
