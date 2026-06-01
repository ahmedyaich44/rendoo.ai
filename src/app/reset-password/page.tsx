"use client";

import { useState } from "react";
import AuthShell from "@/components/AuthShell";

const NAVY = "#1B3263";

function ResetPasswordIllustration() {
  return (
    <svg viewBox="0 0 300 240" width="270" height="216" fill="none">
      {/* Gear / cog background left */}
      <circle cx="52" cy="90" r="36" stroke="#e2e8f0" strokeWidth="10" fill="none" />
      <circle cx="52" cy="90" r="20" fill="#f1f5f9" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
        <rect
          key={i}
          x="48"
          y="48"
          width="8"
          height="14"
          rx="3"
          fill="#e2e8f0"
          transform={`rotate(${angle} 52 90)`}
        />
      ))}

      {/* Gear background right (smaller) */}
      <circle cx="262" cy="70" r="26" stroke="#e2e8f0" strokeWidth="8" fill="none" />
      <circle cx="262" cy="70" r="14" fill="#f1f5f9" />
      {[0, 60, 120, 180, 240, 300].map((angle, i) => (
        <rect
          key={i}
          x="259"
          y="38"
          width="6"
          height="10"
          rx="2.5"
          fill="#e2e8f0"
          transform={`rotate(${angle} 262 70)`}
        />
      ))}

      {/* Lock icon top right */}
      <rect x="218" y="38" width="44" height="38" rx="8" fill="#ede9fe" />
      <rect x="228" y="20" width="24" height="28" rx="12" stroke="#a78bfa" strokeWidth="6" fill="none" />
      <circle cx="240" cy="54" r="5" fill="#7c3aed" />
      <rect x="238" y="54" width="4" height="10" rx="2" fill="#7c3aed" />

      {/* Reset Password card / form mockup */}
      <rect x="108" y="30" width="130" height="148" rx="10" fill="white" stroke="#e2e8f0" strokeWidth="1.5" />
      {/* Card header */}
      <rect x="108" y="30" width="130" height="28" rx="10" fill="#ede9fe" />
      <rect x="108" y="44" width="130" height="14" fill="#ede9fe" />
      <text x="173" y="49" textAnchor="middle" fill="#6d28d9" fontSize="9" fontWeight="bold" fontFamily="sans-serif">Reset Password</text>
      {/* Form fields */}
      <rect x="118" y="68" width="110" height="14" rx="4" fill="#f1f5f9" />
      <text x="123" y="78" fill="#94a3b8" fontSize="7" fontFamily="sans-serif">Old Password</text>
      <rect x="118" y="88" width="60" height="6" rx="2" fill="#e2e8f0" opacity="0.7" />
      <rect x="118" y="100" width="110" height="14" rx="4" fill="#f1f5f9" />
      <text x="123" y="110" fill="#94a3b8" fontSize="7" fontFamily="sans-serif">New Password</text>
      <rect x="118" y="120" width="110" height="14" rx="4" fill="#f1f5f9" />
      <text x="123" y="130" fill="#94a3b8" fontSize="7" fontFamily="sans-serif">Confirm New Password</text>
      {/* Set password button */}
      <rect x="118" y="140" width="110" height="22" rx="11" fill="#7c3aed" />
      <text x="173" y="154" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold" fontFamily="sans-serif">Set Password</text>

      {/* Person holding key */}
      {/* Key */}
      <g transform="translate(48,120)">
        {/* Key head */}
        <circle cx="24" cy="24" r="18" stroke="#94a3b8" strokeWidth="7" fill="none" />
        <circle cx="24" cy="24" r="8" fill="#cbd5e1" />
        {/* Key shaft */}
        <rect x="36" y="20" width="62" height="10" rx="5" fill="#94a3b8" />
        {/* Key teeth */}
        <rect x="76" y="30" width="8" height="12" rx="3" fill="#94a3b8" />
        <rect x="90" y="30" width="8" height="8" rx="3" fill="#94a3b8" />
      </g>

      {/* Right arm grabbing key */}
      <rect x="102" y="138" width="30" height="12" rx="6" fill="#6d28d9" />
      <circle cx="103" cy="144" r="9" fill="#fbbf8a" />

      {/* Torso */}
      <rect x="110" y="162" width="48" height="58" rx="11" fill="#6d28d9" />

      {/* Left arm */}
      <rect x="84" y="168" width="28" height="11" rx="5.5" fill="#6d28d9" />
      <circle cx="83" cy="173" r="8" fill="#fbbf8a" />

      {/* Head */}
      <circle cx="134" cy="152" r="22" fill="#fbbf8a" />

      {/* Hair */}
      <ellipse cx="134" cy="133" rx="16" ry="12" fill="#92400e" />
      <ellipse cx="134" cy="128" rx="10" ry="7" fill="#92400e" />

      {/* Ear */}
      <circle cx="112" cy="154" r="5" fill="#fbbf8a" />

      {/* Legs */}
      <rect x="112" y="214" width="19" height="22" rx="8" fill="#374151" />
      <rect x="136" y="214" width="19" height="22" rx="8" fill="#374151" />

      {/* Shoes */}
      <ellipse cx="121" cy="236" rx="15" ry="6" fill="#1a1a2e" />
      <ellipse cx="145" cy="236" rx="15" ry="6" fill="#1a1a2e" />

      {/* Cactus right */}
      <rect x="258" y="168" width="14" height="62" rx="7" fill="#86efac" />
      <rect x="244" y="186" width="14" height="28" rx="7" fill="#86efac" />
      <rect x="272" y="192" width="14" height="22" rx="7" fill="#86efac" />
      <rect x="248" y="168" width="22" height="10" rx="5" fill="#4ade80" opacity="0.5" />
      {/* Cactus pot */}
      <rect x="252" y="226" width="26" height="18" rx="5" fill="#7c3aed" />
      <rect x="249" y="224" width="32" height="6" rx="3" fill="#6d28d9" />

      {/* Person silhouette / shadow figure right */}
      <ellipse cx="252" cy="130" rx="14" ry="20" fill="#e2e8f0" opacity="0.6" />
      <ellipse cx="252" cy="102" rx="10" ry="12" fill="#e2e8f0" opacity="0.6" />

      {/* Chat bubble */}
      <rect x="56" y="52" width="60" height="26" rx="8" fill="#ede9fe" />
      <path d="M72 78 L68 88 L80 78" fill="#ede9fe" />
      {/* Dots in bubble */}
      <circle cx="71" cy="65" r="3.5" fill="#a78bfa" />
      <circle cx="86" cy="65" r="3.5" fill="#a78bfa" />
      <rect x="66" y="72" width="34" height="3" rx="1.5" fill="#c4b5fd" opacity="0.7" />
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

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const mismatch = confirm.length > 0 && password !== confirm;

  return (
    <AuthShell
      backHref="/signin"
      subtitle="Créez un nouveau mot de passe pour réinitialiser votre compte."
      title="Définir un nouveau mot de passe"
      illustration={<ResetPasswordIllustration />}
    >
      {/* New password */}
      <div className="bg-white rounded-2xl px-4 pt-3 pb-3 mb-3 shadow-sm">
        <label className="block text-xs text-gray-400 font-medium mb-1">Nouveau mot de passe</label>
        <div className="flex items-center">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="flex-1 text-base text-gray-800 bg-transparent outline-none"
          />
          <button
            onClick={() => setShowPassword((v) => !v)}
            className="ml-2 flex-shrink-0 transition-opacity duration-150 hover:opacity-60 active:scale-90"
          >
            <EyeIcon open={showPassword} />
          </button>
        </div>
      </div>

      {/* Confirm password */}
      <div
        className="bg-white rounded-2xl px-4 pt-3 pb-3 mb-1 shadow-sm"
        style={{ border: mismatch ? "1.5px solid #f87171" : "1.5px solid transparent" }}
      >
        <label className="block text-xs text-gray-400 font-medium mb-1">Confirmer le mot de passe</label>
        <div className="flex items-center">
          <input
            type={showConfirm ? "text" : "password"}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="••••••••"
            className="flex-1 text-base text-gray-800 bg-transparent outline-none"
          />
          <button
            onClick={() => setShowConfirm((v) => !v)}
            className="ml-2 flex-shrink-0 transition-opacity duration-150 hover:opacity-60 active:scale-90"
          >
            <EyeIcon open={showConfirm} />
          </button>
        </div>
      </div>

      {/* Mismatch error */}
      {mismatch && (
        <p className="text-xs text-red-400 mb-4 pl-1">Les mots de passe ne correspondent pas.</p>
      )}

      <div className="mt-5">
        <button
          disabled={mismatch || !password || !confirm}
          className="w-full py-4 rounded-full text-white font-bold text-base shadow-md transition-all duration-200 hover:brightness-125 hover:shadow-xl active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
          style={{ background: NAVY }}
        >
          Réinitialiser le mot de passe
        </button>
      </div>
    </AuthShell>
  );
}
