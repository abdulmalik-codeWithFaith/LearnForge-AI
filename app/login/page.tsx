"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "signup") {
        const res = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, username, password }),
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error ?? "Something went wrong.");
          setLoading(false);
          return;
        }
      }

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password.");
        setLoading(false);
        return;
      }

      router.push("/library");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-sm px-6 py-20">
      <h1 className="font-display text-2xl font-semibold text-ink">
        {mode === "login" ? "Log in" : "Create an account"}
      </h1>

      <button
        type="button"
        onClick={() => signIn("google", { callbackUrl: "/library" })}
        className="mt-6 w-full rounded-md border border-rule bg-surface px-4 py-2.5 text-[14px] text-ink hover:bg-surface-raised transition-colors"
      >
        Continue with Google
      </button>

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-rule" />
        <span className="text-[12px] text-mist-dim">or</span>
        <div className="h-px flex-1 bg-rule" />
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        {mode === "signup" && (
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            required
            className="rounded-md bg-surface-raised px-4 py-2.5 text-[14px] text-ink outline-none ring-1 ring-transparent focus:ring-teal"
          />
        )}
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          className="rounded-md bg-surface-raised px-4 py-2.5 text-[14px] text-ink outline-none ring-1 ring-transparent focus:ring-teal"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          minLength={8}
          className="rounded-md bg-surface-raised px-4 py-2.5 text-[14px] text-ink outline-none ring-1 ring-transparent focus:ring-teal"
        />

        {error && <p className="text-[13px] text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-2 rounded-md bg-teal px-4 py-2.5 text-[14px] font-semibold text-canvas hover:bg-teal-dim transition-colors disabled:opacity-50"
        >
          {loading ? "..." : mode === "login" ? "Log in" : "Sign up"}
        </button>
      </form>

      <button
        type="button"
        onClick={() => setMode(mode === "login" ? "signup" : "login")}
        className="mt-4 text-[13px] text-teal hover:text-ink transition-colors"
      >
        {mode === "login"
          ? "Need an account? Sign up"
          : "Already have an account? Log in"}
      </button>
    </div>
  );
}