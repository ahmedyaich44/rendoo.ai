"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AuthShell from "@/components/AuthShell";

const NAVY = "#1B3263";

function ForgotPasswordIllustration() {
  return (
    <svg viewBox="0 0 300 230" width="260" height="200" fill="none">
      {/* Floor shadow */}
      <ellipse cx="150" cy="210" rx="100" ry="12" fill="#e2e8f0" />

      {/* Floating screen/phone mockup */}
      <rect x="130" y="30" width="110" height="145" rx="12" fill="white" stroke="#e2e8f0" strokeWidth="2" />
      {/* Screen header bar */}
      <rect x="130" y="30" width="110" height="28" rx="12" fill="#7c3aed" />
      <rect x="130" y="44" width="110" height="14" fill="#7c3aed" />
      <text x="185" y="49" textAnchor="middle" fill="white" fontSize="9" fontFamily="sans-serif">PASSWORD</text>
      {/* Lock icon on screen */}
      <rect x="163" y="68" width="44" height="36" rx="8" fill="#ede9fe" />
      <rect x="174" y="58" width="22" height="20" rx="11" stroke="#6d28d9" strokeWidth="5" fill="none" />
      <circle cx="185" cy="82" r="5" fill="#6d28d9" />
      {/* Form lines on screen */}
      <rect x="140" y="114" width="80" height="7" rx="3.5" fill="#f1f5f9" />
      <text x="145" y="120" fill="#94a3b8" fontSize="6" fontFamily="sans-serif">Email</text>
      <rect x="140" y="126" width="80" height="7" rx="3.5" fill="#f1f5f9" />
      {/* Reset button on screen */}
      <rect x="140" y="140" width="80" height="18" rx="9" fill="#6d28d9" />
      <text x="180" y="152" textAnchor="middle" fill="white" fontSize="7" fontFamily="sans-serif">Reset Password</text>
      {/* Dots nav */}
      <circle cx="175" cy="166" r="3" fill="#6d28d9" />
      <circle cx="185" cy="166" r="2" fill="#cbd5e1" />
      <circle cx="194" cy="166" r="2" fill="#cbd5e1" />

      {/* Question mark bubble */}
      <circle cx="120" cy="60" r="20" fill="white" stroke="#e2e8f0" strokeWidth="1.5" />
      <text x="120" y="67" textAnchor="middle" fill="#6d28d9" fontSize="18" fontWeight="bold" fontFamily="sans-serif">¿?</text>

      {/* Lamp/light */}
      <line x1="260" y1="10" x2="260" y2="60" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" />
      <rect x="244" y="56" width="32" height="18" rx="4" fill="#e2e8f0" />
      <path d="M248 74 L252 95 L268 95 L272 74" fill="#fef9c3" />

      {/* Person sitting on chair */}
      {/* Chair */}
      <rect x="40" y="155" width="68" height="8" rx="4" fill="#94a3b8" />
      <rect x="44" y="163" width="8" height="42" rx="4" fill="#94a3b8" />
      <rect x="96" y="163" width="8" height="42" rx="4" fill="#94a3b8" />
      <rect x="40" y="118" width="8" height="45" rx="4" fill="#94a3b8" />

      {/* Body sitting */}
      <rect x="44" y="118" width="50" height="42" rx="10" fill="#c4b5fd" />
      {/* Legs/knees */}
      <rect x="44" y="154" width="22" height="35" rx="8" fill="#1e1b4b" />
      <rect x="70" y="154" width="22" height="35" rx="8" fill="#1e1b4b" />
      {/* Feet/shoes */}
      <ellipse cx="55" cy="190" rx="13" ry="6" fill="#6d28d9" />
      <ellipse cx="81" cy="190" rx="13" ry="6" fill="#6d28d9" />

      {/* Head */}
      <circle cx="69" cy="106" r="20" fill="#fbbf8a" />
      {/* Hair */}
      <ellipse cx="69" cy="89" rx="14" ry="10" fill="#c87941" />
      {/* Hand on chin (thinking pose) */}
      <rect x="80" y="118" width="30" height="10" rx="5" fill="#c4b5fd" />
      <circle cx="112" cy="113" r="8" fill="#fbbf8a" />

      {/* Plant */}
      <rect x="245" y="175" width="14" height="30" rx="4" fill="#7c3aed" />
      <ellipse cx="252" cy="175" rx="20" ry="16" fill="#4ade80" />
      <ellipse cx="238" cy="168" rx="14" ry="11" fill="#22c55e" />
      <ellipse cx="266" cy="165" rx="14" ry="11" fill="#16a34a" />
    </svg>
  );
}

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const router = useRouter();

  return (
    <AuthShell
      backHref="/signin"
      subtitle="Entrez votre email pour réinitialiser votre mot de passe"
      title="Mot de passe oublié"
      illustration={<ForgotPasswordIllustration />}
    >
      <p className="text-center text-sm text-gray-400 leading-5 mb-6">
        {"Saisissez l'email associée à votre compte pour recevoir le lien de réinitialisation."}
      </p>

      {/* Email */}
      <div className="bg-white rounded-2xl px-4 pt-3 pb-3 mb-6 shadow-sm">
        <label className="block text-xs font-bold mb-1" style={{ color: NAVY }}>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full text-base text-gray-500 bg-transparent outline-none placeholder-gray-400"
        />
      </div>

      {/* Submit */}
      <button
        onClick={() => router.push("/verify-email")}
        disabled={!email}
        className="w-full py-4 rounded-full text-white font-bold text-base shadow-md transition-all duration-200 hover:brightness-125 hover:shadow-xl active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
        style={{ background: NAVY }}
      >
        Envoyer le lien de réinitialisation
      </button>
    </AuthShell>
  );
}
