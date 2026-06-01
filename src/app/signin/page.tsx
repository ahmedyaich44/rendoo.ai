"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthShell from "@/components/AuthShell";
import { createClient } from "@/lib/supabase/client";

const NAVY = "#1B3263";

function WelcomeIllustration() {
  return (
    <svg viewBox="0 0 280 220" width="240" height="190" fill="none">
      {/* Lavender bg circle */}
      <ellipse cx="140" cy="130" rx="115" ry="95" fill="#ede9fe" />

      {/* Banner poles */}
      <rect x="72" y="68" width="7" height="75" rx="3.5" fill="#94a3b8" />
      <rect x="201" y="68" width="7" height="75" rx="3.5" fill="#94a3b8" />

      {/* Banner */}
      <rect x="65" y="42" width="150" height="42" rx="8" fill="#6d28d9" />
      <rect x="65" y="72" width="10" height="12" rx="2" fill="#5b21b6" />
      <rect x="205" y="72" width="10" height="12" rx="2" fill="#5b21b6" />
      <text x="140" y="70" textAnchor="middle" fill="white" fontSize="15" fontWeight="bold" fontFamily="sans-serif">WELCOME</text>

      {/* Left arm */}
      <rect x="84" y="110" width="36" height="11" rx="5.5" fill="#6d28d9" />
      {/* Right arm */}
      <rect x="160" y="110" width="36" height="11" rx="5.5" fill="#6d28d9" />

      {/* Body */}
      <rect x="116" y="116" width="48" height="58" rx="10" fill="#7c3aed" />

      {/* Head */}
      <circle cx="140" cy="106" r="22" fill="#fbbf8a" />

      {/* Hair bun */}
      <ellipse cx="140" cy="85" rx="16" ry="13" fill="#1a1a1a" />
      <circle cx="140" cy="76" r="9" fill="#1a1a1a" />

      {/* Ear rings */}
      <circle cx="118" cy="108" r="3" fill="#fbbf8a" />
      <circle cx="162" cy="108" r="3" fill="#fbbf8a" />

      {/* Legs */}
      <rect x="118" y="168" width="20" height="45" rx="8" fill="#c4b5fd" />
      <rect x="142" y="168" width="20" height="45" rx="8" fill="#c4b5fd" />

      {/* Shoes */}
      <ellipse cx="128" cy="214" rx="16" ry="7" fill="#1e1b4b" />
      <ellipse cx="152" cy="214" rx="16" ry="7" fill="#1e1b4b" />
    </svg>
  );
}

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="#999" strokeWidth="2" />
      <circle cx="12" cy="12" r="3" stroke="#999" strokeWidth="2" />
    </svg>
  ) : (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" stroke="#999" strokeWidth="2" strokeLinecap="round" />
      <line x1="1" y1="1" x2="23" y2="23" stroke="#999" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

export default function SignInPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function getOAuthRedirectBase() {
    if (window.location.hostname === "0.0.0.0") {
      return "http://localhost:3000";
    }
    return window.location.origin;
  }

  async function handleSignIn() {
    setErrorMessage(null);

    if (!email || !password) {
      setErrorMessage("Please provide both email and password.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    router.push("/");
  }

  async function handleGoogleSignIn() {
    setErrorMessage(null);
    setLoading(true);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${getOAuthRedirectBase()}/auth/callback?next=/` },
    });

    setLoading(false);

    if (error) {
      setErrorMessage(error.message);
    }
  }

  return (
    <AuthShell
      backHref="/"
      subtitle="Bonjour et bienvenue ! Votre aventure Rendoo commence ici ✨"
      title="Se connecter"
      illustration={<WelcomeIllustration />}
    >
      {/* Email */}
      <div className="bg-white rounded-2xl px-4 pt-3 pb-3 mb-3 shadow-sm">
        <label className="block text-xs font-bold mb-1" style={{ color: NAVY }}>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Jhon.doe@gmail.com"
          className="w-full text-base text-gray-400 bg-transparent outline-none placeholder-gray-400"
        />
      </div>

      {/* Password */}
      <div className="bg-white rounded-2xl px-4 pt-3 pb-3 mb-2 shadow-sm">
        <label className="block text-xs text-gray-400 font-medium mb-1">Mot de passe</label>
        <div className="flex items-center">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="flex-1 text-base text-gray-800 bg-transparent outline-none"
          />
          <button onClick={() => setShowPassword((v) => !v)} className="ml-2 flex-shrink-0 transition-opacity duration-150 hover:opacity-60 active:scale-90">
            <EyeIcon open={showPassword} />
          </button>
        </div>
      </div>

      {/* Forgot password */}
      <div className="flex justify-end mb-5">
        <Link href="/forgot-password" className="text-sm font-bold transition-opacity duration-150 hover:opacity-60" style={{ color: NAVY }}>
          Mot de passe oublié ?
        </Link>
      </div>

      {/* Sign in button */}
      <button
        onClick={handleSignIn}
        disabled={loading}
        className="w-full py-4 rounded-full text-white font-bold text-base mb-5 shadow-md transition-all duration-200 hover:brightness-125 hover:shadow-xl active:scale-95"
        style={{ background: NAVY }}
      >
        {loading ? "Signing in..." : "Se connecter"}
      </button>

      {errorMessage && (
        <p className="text-center text-sm text-red-600 mb-4">{errorMessage}</p>
      )}

      {/* Divider */}
      <div className="flex items-center gap-3 mb-5">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-sm text-gray-400 font-medium">Ou</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      {/* Google button */}
      <button
        onClick={handleGoogleSignIn}
        disabled={loading}
        className="w-full flex items-center justify-center gap-3 py-3.5 rounded-full bg-white border border-gray-200 font-bold text-gray-800 text-base shadow-sm mb-8 transition-all duration-200 hover:bg-gray-50 hover:shadow-md active:scale-95"
      >
        <GoogleIcon />
        Se connecter avec Google
      </button>

      {/* Sign up link */}
      <p className="text-center text-sm text-gray-500">
        Pas encore inscrit ?{" "}
        <Link href="/signup" className="font-bold transition-opacity duration-150 hover:opacity-60" style={{ color: NAVY }}>
          Inscrivez-vous maintenant
        </Link>
      </p>
    </AuthShell>
  );
}
