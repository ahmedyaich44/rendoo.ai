"use client";

import Link from "next/link";

const NAVY = "#1B3263";

function EmailSentIllustration() {
  return (
    <svg viewBox="0 0 320 280" width="300" height="260" fill="none">
      {/* Ground / base shadow */}
      <ellipse cx="160" cy="258" rx="100" ry="10" fill="#e8e8e8" />

      {/* Background tree right */}
      <rect x="230" y="140" width="14" height="110" rx="7" fill="#d4d4d4" />
      <ellipse cx="237" cy="130" rx="32" ry="42" fill="#d4d4d4" />
      <ellipse cx="217" cy="150" rx="22" ry="30" fill="#e0e0e0" />

      {/* Background bush / plant left */}
      <ellipse cx="72" cy="222" rx="30" ry="20" fill="#d4d4d4" />
      <ellipse cx="55" cy="215" rx="20" ry="15" fill="#e0e0e0" />
      <ellipse cx="90" cy="210" rx="22" ry="16" fill="#d8d8d8" />

      {/* Small cloud puff left */}
      <ellipse cx="62" cy="100" rx="28" ry="18" fill="#ececec" />
      <ellipse cx="44" cy="108" rx="18" ry="14" fill="#ececec" />
      <ellipse cx="80" cy="108" rx="18" ry="14" fill="#ececec" />

      {/* Paper plane 1 (small, left) */}
      <g transform="translate(48,148) rotate(-20)">
        <polygon points="0,0 36,10 0,20" fill="#7c3aed" opacity="0.7" />
        <polygon points="0,10 36,10 18,20" fill="#5b21b6" opacity="0.7" />
      </g>

      {/* Speed lines behind plane */}
      <line x1="30" y1="162" x2="55" y2="160" stroke="#a78bfa" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
      <line x1="22" y1="170" x2="48" y2="167" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />

      {/* Paper plane 2 (medium, going up-left) */}
      <g transform="translate(88,100) rotate(-35)">
        <polygon points="0,0 44,12 0,24" fill="#6d28d9" opacity="0.85" />
        <polygon points="0,12 44,12 22,24" fill="#4c1d95" opacity="0.85" />
      </g>
      <line x1="68" y1="116" x2="95" y2="110" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
      <line x1="60" y1="124" x2="88" y2="118" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round" opacity="0.35" />

      {/* Main envelope (large, held up) */}
      <g transform="translate(130,52)">
        {/* Envelope body */}
        <rect x="0" y="18" width="90" height="68" rx="6" fill="#7c3aed" />
        {/* Envelope top flap */}
        <path d="M0 18 L45 52 L90 18 Z" fill="#6d28d9" />
        {/* Envelope bottom fold lines */}
        <path d="M0 86 L38 58" stroke="#5b21b6" strokeWidth="1.5" opacity="0.5" />
        <path d="M90 86 L52 58" stroke="#5b21b6" strokeWidth="1.5" opacity="0.5" />
        {/* Letter lines on envelope */}
        <rect x="20" y="62" width="50" height="4" rx="2" fill="#a78bfa" opacity="0.6" />
        <rect x="26" y="72" width="38" height="4" rx="2" fill="#a78bfa" opacity="0.4" />
      </g>

      {/* Person body */}
      {/* Right arm raised holding envelope */}
      <rect x="195" y="88" width="38" height="13" rx="6.5" fill="#5b21b6" />

      {/* Torso */}
      <rect x="183" y="148" width="52" height="66" rx="12" fill="#4338ca" />

      {/* Left arm down */}
      <rect x="155" y="152" width="30" height="12" rx="6" fill="#4338ca" />
      <circle cx="154" cy="158" r="9" fill="#fbbf8a" />

      {/* Head */}
      <circle cx="209" cy="134" r="24" fill="#fbbf8a" />

      {/* Hair */}
      <ellipse cx="209" cy="113" rx="17" ry="13" fill="#1a1a2e" />
      <ellipse cx="209" cy="108" rx="11" ry="8" fill="#1a1a2e" />

      {/* Ear */}
      <circle cx="185" cy="136" r="5" fill="#fbbf8a" />

      {/* Legs */}
      <rect x="185" y="208" width="20" height="46" rx="9" fill="#c4b5fd" />
      <rect x="209" y="208" width="20" height="46" rx="9" fill="#c4b5fd" />

      {/* Shoes */}
      <ellipse cx="195" cy="254" rx="16" ry="7" fill="#1a1a2e" />
      <ellipse cx="219" cy="254" rx="16" ry="7" fill="#1a1a2e" />
    </svg>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="flex justify-center min-h-screen bg-gray-100">
      <div
        className="flex flex-col bg-gray-50 w-full max-w-md min-h-screen items-center justify-center px-8"
        style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
      >
        {/* Illustration */}
        <div className="mb-6">
          <EmailSentIllustration />
        </div>

        {/* Title */}
        <h1 className="text-3xl font-extrabold text-gray-900 text-center mb-4">
          Vérifiez votre email
        </h1>

        {/* Subtitle */}
        <p className="text-base text-gray-400 text-center leading-6 mb-10 max-w-xs">
          Veuillez vérifier votre email et cliquer sur le lien reçu pour réinitialiser votre mot de passe
        </p>

        {/* CTA */}
        <Link
          href="/signin"
          className="w-full flex items-center justify-center py-4 rounded-full text-white font-bold text-base shadow-md transition-all duration-200 hover:brightness-125 hover:shadow-xl active:scale-95"
          style={{ background: NAVY }}
        >
          Retour à la connexion
        </Link>
      </div>
    </div>
  );
}
