"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { toPersianDigits } from "@/lib/utils/format";

type Step = "phone" | "code";

export default function CustomerLoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const cooldownTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  function startCooldown(seconds: number) {
    setCooldown(seconds);
    if (cooldownTimer.current) clearInterval(cooldownTimer.current);
    cooldownTimer.current = setInterval(() => {
      setCooldown((c) => {
        if (c <= 1 && cooldownTimer.current) {
          clearInterval(cooldownTimer.current);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
  }

  async function handleSendCode(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setLoading(true);

    const res = await fetch("/api/auth/otp/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone }),
    });
    const data = await res.json();

    setLoading(false);
    if (!res.ok) {
      setError(data.error ?? "مشکلی پیش آمد. لطفاً دوباره تلاش کنید.");
      return;
    }

    setStep("code");
    setInfo("کد تایید برای شما پیامک شد.");
    startCooldown(60);
  }

  async function handleVerifyCode(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await fetch("/api/auth/otp/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, code }),
    });
    const data = await res.json();

    setLoading(false);
    if (!res.ok) {
      setError(data.error ?? "کد تایید صحیح نیست.");
      return;
    }

    router.push("/account");
    router.refresh();
  }

  return (
    <div className="container-page flex min-h-[70vh] max-w-md items-center py-16">
      <div className="w-full rounded-card bg-white p-8 shadow-card">
        <h1 className="mb-1 text-center font-display text-2xl font-bold text-brand">
          ورود / عضویت
        </h1>
        <p className="mb-6 text-center text-sm text-ink-muted">
          {step === "phone"
            ? "شماره تلفن همراه خود را وارد کنید."
            : `کد ارسال‌شده به ${phone} را وارد کنید.`}
        </p>

        {step === "phone" && (
          <form onSubmit={handleSendCode}>
            <div className="mb-4">
              <label className="mb-1 block text-sm text-ink-muted">شماره تلفن</label>
              <input
                type="tel"
                dir="ltr"
                className="input-field text-center tracking-wider"
                placeholder="09xxxxxxxxx"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                autoFocus
              />
            </div>

            {error && (
              <p className="mb-4 rounded-lg bg-brand/10 px-3 py-2 text-sm text-brand">{error}</p>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? "در حال ارسال کد..." : "دریافت کد تایید"}
            </button>
          </form>
        )}

        {step === "code" && (
          <form onSubmit={handleVerifyCode}>
            <div className="mb-4">
              <label className="mb-1 block text-sm text-ink-muted">کد تایید (۶ رقم)</label>
              <input
                type="text"
                inputMode="numeric"
                dir="ltr"
                maxLength={6}
                className="input-field text-center text-lg tracking-[0.5em]"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                required
                autoFocus
              />
            </div>

            {info && <p className="mb-4 text-center text-sm text-ink-muted">{info}</p>}
            {error && (
              <p className="mb-4 rounded-lg bg-brand/10 px-3 py-2 text-sm text-brand">{error}</p>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? "در حال بررسی..." : "تایید و ورود"}
            </button>

            <div className="mt-4 flex items-center justify-between text-sm">
              <button
                type="button"
                onClick={() => {
                  setStep("phone");
                  setCode("");
                  setError(null);
                }}
                className="text-ink-muted hover:text-ink"
              >
                تغییر شماره
              </button>
              <button
                type="button"
                disabled={cooldown > 0}
                onClick={handleSendCode}
                className="text-brand hover:underline disabled:cursor-not-allowed disabled:text-ink-muted disabled:no-underline"
              >
                {cooldown > 0 ? `ارسال دوباره (${toPersianDigits(cooldown)})` : "ارسال دوباره کد"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
