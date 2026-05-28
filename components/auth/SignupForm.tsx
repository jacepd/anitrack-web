"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function SignupForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) { setError("Passwords do not match."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }

    setLoading(true);
    setError("");
    const supabase = createClient();
    const { error: err } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });

    if (err) {
      setError(err.message);
      setLoading(false);
    } else {
      setSuccess(true);
    }
  };

  if (success) {
    return (
      <div className="text-center space-y-3">
        <p className="text-4xl">🎉</p>
        <p className="font-bold text-lg">Check your email!</p>
        <p className="text-subtle text-sm">
          We sent a confirmation link to <span className="text-text-main">{email}</span>.
          Click it to activate your account.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-subtle text-sm block mb-1">Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com" className="input" required />
      </div>
      <div>
        <label className="text-subtle text-sm block mb-1">Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
          placeholder="Min. 6 characters" className="input" required />
      </div>
      <div>
        <label className="text-subtle text-sm block mb-1">Confirm Password</label>
        <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)}
          placeholder="Repeat password" className="input" required />
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <button type="submit" disabled={loading} className="btn-primary w-full py-3">
        {loading ? "Creating account..." : "Create Account"}
      </button>
    </form>
  );
}
