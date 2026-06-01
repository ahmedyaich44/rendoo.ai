"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthShell from "@/components/AuthShell";
import { createClient } from "@/lib/supabase/client";

const NAVY = "#1B3263";

function GroupIllustration() {
  return (
    <svg viewBox="0 0 300 220" width="260" height="190" fill="none">
      {/* Lavender bg circle */}
      <ellipse cx="150" cy="130" rx="120" ry="95" fill="#ede9fe" />

      {/* === Left person (dark jacket) === */}
      {/* Body */}
      <rect x="40" y="118" width="44" height="62" rx="10" fill="#1e1b4b" />
      {/* Tie */}
      <rect x="59" y="118" width="8" height="30" rx="3" fill="#6d28d9" />
      {/* Head */}
      <circle cx="62" cy="108" r="20" fill="#fbbf8a" />
      {/* Hair */}
      <ellipse cx="62" cy="92" rx="14" ry="10" fill="#1a1a1a" />
      {/* Legs */}
      <rect x="42" y="174" width="17" height="40" rx="7" fill="#7c3aed" />
      <rect x="63" y="174" width="17" height="40" rx="7" fill="#7c3aed" />
      {/* Shoes */}
      <ellipse cx="50" cy="214" rx="14" ry="6" fill="#1a1a1a" />
      <ellipse cx="71" cy="214" rx="14" ry="6" fill="#1a1a1a" />
      {/* Right arm reaching out */}
      <rect x="84" y="120" width="28" height="11" rx="5.5" fill="#1e1b4b" />
      <circle cx="114" cy="125" r="7" fill="#fbbf8a" />

      {/* === Middle person (purple jacket, fist bump) === */}
      {/* Body */}
      <rect x="106" y="115" width="46" height="64" rx="10" fill="#6d28d9" />
      {/* Tie */}
      <rect x="125" y="115" width="8" height="32" rx="3" fill="#1e1b4b" />
      {/* Head */}
      <circle cx="129" cy="104" r="21" fill="#fbbf8a" />
      {/* Hair */}
      <ellipse cx="129" cy="86" rx="15" ry="12" fill="#1a1a1a" />
      {/* Legs */}
      <rect x="108" y="173" width="18" height="42" rx="7" fill="#7c3aed" />
      <rect x="131" y="173" width="18" height="42" rx="7" fill="#7c3aed" />
      {/* Shoes */}
      <ellipse cx="117" cy="215" rx="14" ry="6" fill="#1a1a1a" />
      <ellipse cx="140" cy="215" rx="14" ry="6" fill="#1a1a1a" />
      {/* Left arm (fist) */}
      <rect x="82" y="118" width="24" height="11" rx="5.5" fill="#6d28d9" />
      <circle cx="82" cy="123" r="7" fill="#fbbf8a" />
      {/* Right arm reaching right */}
      <rect x="152" y="118" width="26" height="11" rx="5.5" fill="#6d28d9" />
      <circle cx="178" cy="123" r="7" fill="#fbbf8a" />

      {/* === Right person (dark jacket, woman) === */}
      {/* Body */}
      <rect x="175" y="118" width="44" height="62" rx="10" fill="#1e1b4b" />
      {/* Head */}
      <circle cx="197" cy="108" r="20" fill="#fbbf8a" />
      {/* Hair - bun */}
      <ellipse cx="197" cy="91" rx="14" ry="10" fill="#1a1a1a" />
      <circle cx="197" cy="84" rx="8" ry="8" fill="#1a1a1a" />
      {/* Book/tablet in arm */}
      <rect x="208" y="130" width="22" height="28" rx="4" fill="#6d28d9" />
      {/* Left arm out */}
      <rect x="155" y="120" width="20" height="10" rx="5" fill="#1e1b4b" />
      <circle cx="175" cy="125" r="7" fill="#fbbf8a" />
      {/* Legs */}
      <rect x="177" y="174" width="17" height="40" rx="7" fill="#7c3aed" />
      <rect x="198" y="174" width="17" height="40" rx="7" fill="#7c3aed" />
      {/* Shoes */}
      <ellipse cx="185" cy="214" rx="14" ry="6" fill="#1a1a1a" />
      <ellipse cx="206" cy="214" rx="14" ry="6" fill="#1a1a1a" />
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

const GENRES = [
  "Préfère ne pas dire",
  "Homme",
  "Femme",
  "Autre",
];

export default function SignUpPage() {
  const router = useRouter();
  const supabase = createClient();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [genre, setGenre] = useState("Préfère ne pas dire");
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

  async function handleSignUp() {
    setErrorMessage(null);

    if (!email || !password) {
      setErrorMessage("Please provide both email and password.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name.trim(),
          phone: phone.trim(),
          gender: genre,
        },
      },
    });

    setLoading(false);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    router.push("/verify-email");
  }

  async function handleGoogleSignUp() {
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
      backHref="/signin"
      subtitle="Yay! Vous êtes tout près de quelque chose d'incroyable. ✨"
      title="S'inscrire"
      illustration={<GroupIllustration />}
    >
      {/* Nom */}
      <div className="bg-white rounded-2xl px-4 pt-3 pb-3 mb-3 shadow-sm">
        <label className="block text-xs text-gray-400 font-medium mb-1">Nom</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="John Doe"
          className="w-full text-base text-gray-500 bg-transparent outline-none placeholder-gray-400"
        />
      </div>

      {/* Email */}
      <div className="bg-white rounded-2xl px-4 pt-3 pb-3 mb-3 shadow-sm">
        <label className="block text-xs text-gray-400 font-medium mb-1">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="john.doe@example.com"
          className="w-full text-base text-gray-500 bg-transparent outline-none placeholder-gray-400"
        />
      </div>

      {/* Téléphone */}
      <div className="bg-white rounded-2xl px-4 pt-3 pb-3 mb-3 shadow-sm">
        <label className="block text-xs text-gray-400 font-medium mb-1">Téléphone</label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+216 xx xxx xxx"
          className="w-full text-base text-gray-500 bg-transparent outline-none placeholder-gray-400"
        />
      </div>

      {/* Genre */}
      <div className="bg-white rounded-2xl px-4 pt-3 pb-3 mb-3 shadow-sm">
        <label className="block text-xs text-gray-400 font-medium mb-1">Genre</label>
        <div className="flex items-center">
          <select
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            className="flex-1 text-base font-semibold text-gray-800 bg-transparent outline-none appearance-none"
          >
            {GENRES.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M6 9l6 6 6-6" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      {/* Mot de passe */}
      <div className="bg-white rounded-2xl px-4 pt-3 pb-3 mb-5 shadow-sm">
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

      {/* Sign up button */}
      <button
        onClick={handleSignUp}
        disabled={loading}
        className="w-full py-4 rounded-full text-white font-bold text-base mb-5 shadow-md transition-all duration-200 hover:brightness-125 hover:shadow-xl active:scale-95"
        style={{ background: NAVY }}
      >
        {loading ? "Creating account..." : "S'inscrire"}
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
        onClick={handleGoogleSignUp}
        disabled={loading}
        className="w-full flex items-center justify-center gap-3 py-3.5 rounded-full bg-white border border-gray-200 font-bold text-gray-800 text-base shadow-sm mb-6 transition-all duration-200 hover:bg-gray-50 hover:shadow-md active:scale-95"
      >
        <GoogleIcon />
        {"S'inscrire avec Google"}
      </button>

      {/* Privacy policy */}
      <p className="text-center text-sm text-gray-500 mb-3">
        En créant un compte, vous acceptez notre{" "}
        <Link href="#" className="font-bold transition-opacity duration-150 hover:opacity-60" style={{ color: NAVY }}>
          Politique de confidentialité
        </Link>
      </p>

      {/* Sign in link */}
      <p className="text-center text-sm text-gray-500 pb-6">
        Vous avez déjà un compte ?{" "}
        <Link href="/signin" className="font-bold transition-opacity duration-150 hover:opacity-60" style={{ color: NAVY }}>
          Se connecter
        </Link>
      </p>
    </AuthShell>
  );
}
