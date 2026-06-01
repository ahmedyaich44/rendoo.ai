"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const NAVY = "#1B3263";

// ── SVG icons ────────────────────────────────────────────────────────────────

function ChevronRight() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M9 6l6 6-6 6" stroke="#bbb" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function BackIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M15 18l-6-6 6-6" stroke="#222" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function EditProfileIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="10" cy="8" r="3.5" stroke="#555" strokeWidth="1.8" />
      <path d="M3 20c0-3.5 3-5.5 7-5.5" stroke="#555" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M16 13l4 4-2.5 2.5-4-4 .5-2.5 2 0z" stroke="#555" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}

function PrefsIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="3" stroke="#555" strokeWidth="1.8" />
      <path
        d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"
        stroke="#555"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function SupportIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="#555" strokeWidth="1.8" />
      <path d="M12 8v.01M12 11v5" stroke="#555" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function FaqIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <rect x="4" y="3" width="16" height="18" rx="2" stroke="#555" strokeWidth="1.8" />
      <path d="M9 9h.01M9 12h6M9 15h4" stroke="#555" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function TermsIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <rect x="4" y="3" width="16" height="18" rx="2" stroke="#555" strokeWidth="1.8" />
      <path d="M8 8h8M8 12h8M8 16h5" stroke="#555" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function PrivacyIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2L4 6v6c0 5.25 3.5 9.74 8 11 4.5-1.26 8-5.75 8-11V6l-8-4z"
        stroke="#555"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" stroke="#555" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points="16,17 21,12 16,7" stroke="#555" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="21" y1="12" x2="9" y2="12" stroke="#555" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="#bbb" strokeWidth="1.5" />
      <path d="M14.5 8.5H13a1 1 0 00-1 1V11h2.5l-.5 2.5H12V19h-2.5v-5.5H8V11h1.5V9.5A3 3 0 0112.5 6.5H14.5v2z" fill="#bbb" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="#bbb" strokeWidth="1.5" />
      <path
        d="M15 9.5a3 3 0 01-3-3h-2v8a1.5 1.5 0 11-1.5-1.5h.5v-2h-.5A3.5 3.5 0 1013 14.5V11a5 5 0 003 1V10a3 3 0 01-1-.5z"
        fill="#bbb"
      />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="#bbb" strokeWidth="1.5" />
      <rect x="8" y="8" width="8" height="8" rx="2" stroke="#bbb" strokeWidth="1.4" />
      <circle cx="12" cy="12" r="2" stroke="#bbb" strokeWidth="1.4" />
      <circle cx="15.5" cy="8.5" r="0.6" fill="#bbb" />
    </svg>
  );
}

// ── Helper components ─────────────────────────────────────────────────────────

interface RowProps {
  icon: React.ReactNode;
  label: string;
  subtitle?: string;
  onClick?: () => void;
  danger?: boolean;
}

function Row({ icon, label, subtitle, onClick, danger }: RowProps) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-4 px-4 py-4 text-left transition-colors duration-150 hover:bg-gray-50 active:bg-gray-100"
    >
      <span className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-full bg-gray-100">
        {icon}
      </span>
      <div className="flex-1 min-w-0">
        <span
          className="block text-[15px] font-medium leading-tight"
          style={{ color: danger ? "#e53e3e" : "#1a1a1a" }}
        >
          {label}
        </span>
        {subtitle && (
          <span className="block text-xs text-gray-400 mt-0.5 leading-snug">{subtitle}</span>
        )}
      </div>
      <ChevronRight />
    </button>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mx-4 mb-4 bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
      <p className="px-4 pt-4 pb-2 text-sm font-bold text-gray-800">{title}</p>
      <div className="divide-y divide-gray-100">{children}</div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

interface ProfileTabProps {
  onBack?: () => void;
}

export default function ProfileTab({ onBack }: ProfileTabProps) {
  const supabase = createClient();
  const [displayName, setDisplayName] = useState<string>("Yaich Ahmed");
  const [initials, setInitials] = useState<string>("YA");
  const [location] = useState("Tunis, Tunisie");

  useEffect(() => {
    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const fullName =
        user.user_metadata?.full_name ??
        user.user_metadata?.name ??
        user.email?.split("@")[0] ??
        "Utilisateur";

      setDisplayName(fullName);

      const parts = fullName.trim().split(" ");
      if (parts.length >= 2) {
        setInitials((parts[0][0] + parts[1][0]).toUpperCase());
      } else {
        setInitials(fullName.substring(0, 2).toUpperCase());
      }
    }
    loadUser();
  }, [supabase]);

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.reload();
  }

  return (
    <div className="flex flex-col min-h-0 overflow-y-auto pb-6">
      {/* Top bar */}
      <div className="flex items-center px-4 pt-5 pb-4 bg-white">
        <button
          onClick={onBack}
          className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 active:scale-90 transition-all duration-150 mr-3"
        >
          <BackIcon />
        </button>
      </div>

      {/* Avatar + name */}
      <div className="flex items-center justify-between px-6 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 leading-tight">{displayName}</h2>
          <p className="text-sm text-gray-400 mt-0.5">{location}</p>
        </div>
        {/* Avatar circle */}
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold flex-shrink-0"
          style={{ background: NAVY }}
        >
          {initials}
        </div>
      </div>

      {/* Section Compte */}
      <Section title="Section Compte">
        <Row
          icon={<EditProfileIcon />}
          label="Modifier le profil"
          subtitle="Entrez votre nom, email, numéro de téléphone..."
        />
        <Row icon={<PrefsIcon />} label="Préférences" subtitle="Changer la langue, le thème" />
      </Section>

      {/* Assistance */}
      <Section title="Assistance">
        <Row icon={<SupportIcon />} label="Contacter le support" />
        <Row icon={<FaqIcon />} label="FAQ" />
      </Section>

      {/* Mentions légales */}
      <Section title="Mentions légales">
        <Row icon={<TermsIcon />} label="Conditions d'utilisation" />
        <Row icon={<PrivacyIcon />} label="Politique de confidentialité" />
      </Section>

      {/* Session */}
      <Section title="Session">
        <Row icon={<LogoutIcon />} label="Déconnexion" onClick={handleLogout} />
      </Section>

      {/* Follow us */}
      <div className="flex flex-col items-center gap-4 mt-2">
        <p className="text-sm text-gray-400 font-medium">Suivez-nous !</p>
        <div className="flex items-center gap-6">
          <button className="hover:opacity-70 active:scale-90 transition-all duration-150">
            <FacebookIcon />
          </button>
          <button className="hover:opacity-70 active:scale-90 transition-all duration-150">
            <TikTokIcon />
          </button>
          <button className="hover:opacity-70 active:scale-90 transition-all duration-150">
            <InstagramIcon />
          </button>
        </div>
      </div>
    </div>
  );
}
