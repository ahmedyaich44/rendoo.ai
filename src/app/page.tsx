"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import ProfileTab from "@/components/ProfileTab";
import type { ActivityRow, ActivitySlotRow } from "@/types/activity";

const NAVY = "#1B3263";

const categoryStyles: Record<string, { icon: string; gradient: string }> = {
  sea: {
    icon: "\u{1F3C4}",
    gradient: "linear-gradient(160deg, #0f4c81 0%, #1a7a8c 50%, #2bb5c8 100%)",
  },
  teambuilding: {
    icon: "\u{1F91D}",
    gradient: "linear-gradient(160deg, #1a0533 0%, #3d0a6e 50%, #7b2fc9 100%)",
  },
  football: {
    icon: "\u{26BD}",
    gradient: "linear-gradient(160deg, #0a2e0a 0%, #1a5c1a 50%, #2e8a2e 100%)",
  },
  padel: {
    icon: "\u{1F3BE}",
    gradient: "linear-gradient(160deg, #2e1a00 0%, #6b3d00 50%, #c47a00 100%)",
  },
  vr: {
    icon: "\u{1F97D}",
    gradient: "linear-gradient(160deg, #0d2137 0%, #1a3a5c 50%, #2e5f8a 100%)",
  },
};

function normalizeCategory(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

function getCategoryStyle(category: string) {
  const normalized = normalizeCategory(category);
  return (
    categoryStyles[normalized] ?? {
      icon: "\u{1F3AF}",
      gradient: "linear-gradient(160deg, #0d2137 0%, #1a3a5c 50%, #2e5f8a 100%)",
    }
  );
}

function formatSlotDay(dateIso: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    weekday: "short",
    day: "numeric",
    month: "short",
  }).format(new Date(dateIso));
}

function formatSlotTime(dateIso: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateIso));
}

async function withTimeout<T>(promise: PromiseLike<T>, ms: number, timeoutMessage: string): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      promise,
      new Promise<T>((_, reject) => {
        timer = setTimeout(() => reject(new Error(timeoutMessage)), ms);
      }),
    ]);
  } finally {
    if (timer) {
      clearTimeout(timer);
    }
  }
}

function generateDates() {
  const dates = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dayNames = ["dim.", "lun.", "mar.", "mer.", "jeu.", "ven.", "sam."];
  const monthNames = [
    "jan", "fev", "mar", "avr", "mai", "juin",
    "juil", "aout", "sep", "oct", "nov", "dec",
  ];
  for (let i = 0; i < 14; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    dates.push({
      dayName: dayNames[d.getDay()],
      dayNum: d.getDate(),
      month: monthNames[d.getMonth()],
      key: d.toISOString().split("T")[0],
    });
  }
  return dates;
}

const dates = generateDates();

// SVG Icons
function SearchIcon({ color = "#1B3263", size = 24 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="11" cy="11" r="7" stroke={color} strokeWidth="2.2" />
      <line x1="16.5" y1="16.5" x2="21" y2="21" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

function GroupsIcon({ color = "#888", size = 26 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="9" cy="8" r="3" stroke={color} strokeWidth="2" />
      <circle cx="17" cy="8" r="2.5" stroke={color} strokeWidth="2" />
      <path d="M3 19c0-3.314 2.686-5 6-5s6 1.686 6 5" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <path d="M17 14c2.5 0 4 1.3 4 4" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function ProfileIcon({ color = "#888", size = 24 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="4" stroke={color} strokeWidth="2" />
      <path d="M4 20c0-4 3.582-6 8-6s8 2 8 6" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function ChevronRight({ color = "#888", size = 20 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M9 6l6 6-6 6" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M12 2C8.134 2 5 5.134 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.866-3.134-7-7-7z" stroke="#555" strokeWidth="2" />
      <circle cx="12" cy="9" r="2.5" stroke="#555" strokeWidth="2" />
    </svg>
  );
}

type Tab = "recherche" | "groupes" | "profil";

export default function Home() {
  const router = useRouter();
  const supabase = createClient();
  const [selectedDate, setSelectedDate] = useState(dates[0].key);
  const [activeTab, setActiveTab] = useState<Tab>("recherche");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [userLoading, setUserLoading] = useState(true);
  const [pageError, setPageError] = useState<string | null>(null);
  const [activities, setActivities] = useState<ActivityRow[]>([]);
  const [activitiesLoading, setActivitiesLoading] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<ActivityRow | null>(null);
  const [slots, setSlots] = useState<ActivitySlotRow[]>([]);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [selectedSlotDate, setSelectedSlotDate] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function loadCurrentUser() {
      try {
        const {
          data: { user },
        } = await withTimeout(
          supabase.auth.getUser(),
          10000,
          "Timeout while loading user session.",
        );

        if (!user) {
          setIsLoggedIn(false);
          setDisplayName(null);
          return;
        }

        const metadataName =
          user.user_metadata?.full_name ??
          user.user_metadata?.name ??
          user.email?.split("@")[0] ??
          null;

        setIsLoggedIn(true);
        setDisplayName(metadataName ? metadataName.split(" ")[0] : null);
      } catch {
        setPageError("Impossible de charger la session utilisateur.");
      } finally {
        setUserLoading(false);
      }
    }

    loadCurrentUser();
  }, [supabase]);

  useEffect(() => {
    async function loadActivities() {
      setActivitiesLoading(true);
      try {
        const endpoints = ["/api/activities"];
        if (typeof window !== "undefined") {
          endpoints.push(`${window.location.origin}/api/activities`);
        }

        let loaded = false;

        for (const endpoint of endpoints) {
          try {
            const response = await withTimeout(
              fetch(endpoint, {
                method: "GET",
                headers: { Accept: "application/json" },
                cache: "no-store",
              }),
              10000,
              `Timeout while loading activities from ${endpoint}.`,
            );

            const payload = (await response.json()) as {
              ok: boolean;
              message?: string;
              data?: ActivityRow[];
            };

            if (!response.ok || !payload.ok) {
              continue;
            }

            const rows = Array.isArray(payload.data) ? payload.data : [];
            setActivities(rows);
            setPageError(null);
            loaded = true;
            break;
          } catch {
            // Try the next endpoint variant
          }
        }

        if (!loaded) {
          setActivities([]);
          setPageError("Impossible de charger les activites.");
        }
      } catch {
        setPageError("Impossible de charger les activites.");
      } finally {
        setActivitiesLoading(false);
      }
    }

    loadActivities();
  }, []);

  useEffect(() => {
    if (!userLoading && !activitiesLoading) {
      return;
    }

    const timer = setTimeout(() => {
      setUserLoading(false);
      setActivitiesLoading(false);
      setPageError((current) => current ?? "Le chargement a pris trop de temps. Verifiez la connexion puis reessayez.");
    }, 12000);

    return () => clearTimeout(timer);
  }, [userLoading, activitiesLoading]);

  async function handleTabClick(tab: Tab) {
    if (tab === "groupes") {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/signin");
        return;
      }

      router.push("/groupes");
      return;
    }

    if (tab !== "profil") {
      setActiveTab(tab);
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/signin");
      return;
    }

    setActiveTab("profil");
  }

  const availableCategories = useMemo(() => {
    const unique = new Set(
      activities
        .map((activity) => activity.category?.trim())
        .filter((category): category is string => Boolean(category)),
    );
    return Array.from(unique).sort((a, b) => a.localeCompare(b));
  }, [activities]);

  const filteredActivities = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return activities.filter((activity) => {
      if (selectedCategories.length > 0) {
        const selected = new Set(selectedCategories.map((c) => normalizeCategory(c)));
        if (!selected.has(normalizeCategory(activity.category))) return false;
      }
      if (query) {
        return (
          activity.title.toLowerCase().includes(query) ||
          activity.location_name.toLowerCase().includes(query) ||
          activity.city.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [activities, selectedCategories, searchQuery]);

  function toggleCategory(category: string) {
    setSelectedCategories((current) =>
      current.includes(category)
        ? current.filter((item) => item !== category)
        : [...current, category],
    );
  }

  async function openQuickBook(activity: ActivityRow) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/signin");
      return;
    }

    setSelectedActivity(activity);
    setSelectedSlotId(null);
    setBookingError(null);
    setSlotsLoading(true);

    const { data } = await supabase
      .from("activity_slots")
      .select("id,starts_at,ends_at,spots_left,price,currency")
      .eq("activity_id", activity.id)
      .eq("is_active", true)
      .gte("starts_at", new Date().toISOString())
      .order("starts_at", { ascending: true })
      .limit(20);

    const loadedSlots = (data ?? []) as ActivitySlotRow[];
    setSlots(loadedSlots);
    setSelectedSlotDate(null);
    setSlotsLoading(false);
  }

  function closeQuickBook() {
    setSelectedActivity(null);
    setSelectedSlotId(null);
    setSlots([]);
    setSlotsLoading(false);
    setBookingLoading(false);
    setBookingError(null);
    setSelectedSlotDate(null);
  }

  async function handleBookNow() {
    if (!selectedSlotId) {
      setBookingError("Choisissez un creneau pour continuer.");
      return;
    }

    setBookingError(null);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/signin");
      return;
    }

    setBookingLoading(true);
    const { error } = await supabase.rpc("book_activity_slot", {
      p_slot_id: selectedSlotId,
    });
    setBookingLoading(false);

    if (error) {
      setBookingError(error.message);
      return;
    }

    closeQuickBook();
  }

  const availableSlotDates = useMemo(() => {
    const unique = new Set(slots.map((slot) => slot.starts_at.split("T")[0]));
    return Array.from(unique).sort();
  }, [slots]);
  const minSlotDate = availableSlotDates[0];
  const maxSlotDate = availableSlotDates[availableSlotDates.length - 1];

  const filteredSlots = useMemo(() => {
    if (!selectedSlotDate) {
      return slots;
    }
    return slots.filter((slot) => slot.starts_at.startsWith(selectedSlotDate));
  }, [slots, selectedSlotDate]);

  if (userLoading || activitiesLoading) {
    return (
      <div className="flex justify-center min-h-screen bg-gradient-to-br from-slate-100 to-blue-50">
        <div className="relative flex flex-col bg-white w-full max-w-md min-h-screen" style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}>
          {/* Skeleton header */}
          <div className="flex items-center justify-between px-4 pt-5 pb-3 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-gray-200 animate-pulse" />
              <div>
                <div className="h-5 w-24 rounded-md bg-gray-200 animate-pulse" />
                <div className="h-3 w-32 rounded-md bg-gray-200 animate-pulse mt-1" />
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
          </div>
          {/* Skeleton hero */}
          <div className="mx-4 mt-4 rounded-2xl bg-gray-200 animate-pulse" style={{ height: 220 }} />
          {/* Skeleton search */}
          <div className="mx-4 mt-4 h-11 rounded-xl bg-gray-200 animate-pulse" />
          {/* Skeleton date pills */}
          <div className="flex gap-2 px-4 mt-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex-shrink-0 w-14 h-16 rounded-xl bg-gray-200 animate-pulse" />
            ))}
          </div>
          {/* Skeleton activity cards */}
          <div className="flex flex-col gap-4 px-4 mt-5">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="w-full rounded-2xl bg-gray-200 animate-pulse" style={{ height: 200 }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center min-h-screen bg-gradient-to-br from-slate-100 to-blue-50">
      {/* Phone-width container */}
      <div
        className="relative flex flex-col bg-white w-full max-w-md min-h-screen"
        style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
      >
        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto pb-28">

          {/* Profile tab */}
          {activeTab === "profil" && (
            <ProfileTab onBack={() => setActiveTab("recherche")} />
          )}

          {/* Recherche / home tab content */}
          {activeTab !== "profil" && (<>

          {pageError && (
            <div className="mx-4 mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              <p>{pageError}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-3 rounded-full bg-red-100 px-4 py-1.5 text-xs font-semibold text-red-700"
              >
                Reessayer
              </button>
            </div>
          )}

          {/* Header */}
          <div className="flex items-center justify-between px-4 pt-5 pb-3 sticky top-0 z-10 border-b border-gray-100/60" style={{ background: "rgba(255,255,255,0.80)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)" }}>
            <div className="flex items-center gap-3">
              <SearchIcon />
              <div>
                <h1 className="text-xl font-bold text-gray-900 leading-tight">Activites</h1>
                <p className="text-sm text-gray-500">Toutes les activites</p>
              </div>
            </div>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 transition-all duration-150 hover:bg-gray-200 active:scale-90">
              <ChevronRight color="#333" size={18} />
            </button>
          </div>

          {/* Hero Banner */}
          <div className="mx-4 mt-4 rounded-2xl overflow-hidden relative" style={{ height: 220 }}>
            {isLoggedIn ? (
              <div
                className="w-full h-full relative px-6 py-7 flex flex-col items-center justify-center text-center"
                style={{
                  backgroundImage:
                    "linear-gradient(to top, rgba(9,16,31,0.82) 0%, rgba(9,16,31,0.28) 60%, rgba(9,16,31,0.10) 100%), url('https://images.unsplash.com/photo-1521412644187-c49fa049e84d?auto=format&fit=crop&w=1200&q=80')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <h2 className="text-2xl font-extrabold text-white leading-tight">
                  Heureux de vous revoir, {displayName ?? "ami"} !
                </h2>
                <p className="text-gray-100 text-base font-semibold mt-2">
                  Quelle activite vous interesse ?
                </p>
                <p className="text-gray-200 mt-4 text-base">21 C - Tunis</p>
              </div>
            ) : (
              <div
                className="w-full h-full flex flex-col items-center justify-center px-6"
                style={{
                  background:
                    "linear-gradient(135deg, #0d1b2a 0%, #1a2e4a 40%, #1e4d7a 70%, #2a6496 100%)",
                }}
              >
                <div className="absolute inset-0 flex items-center justify-center opacity-20 select-none pointer-events-none">
                  <span className="text-7xl">SPORT</span>
                  <span className="text-5xl ml-6">PLAY</span>
                  <span className="text-6xl ml-4">FUN</span>
                </div>
                <div className="relative z-10 text-center">
                  <h2 className="text-2xl font-extrabold text-white leading-tight">
                    Bienvenue sur{" "}
                    <span style={{ color: "#5ba3f5" }}>Rendoo</span> !
                  </h2>
                  <p className="text-sm text-gray-300 mt-2 leading-5">
                    {"Connectez-vous et creez votre premiere"}<br />{"activite a partir d aujourd hui"}
                  </p>
                  <Link
                    href="/signin"
                    className="mt-4 inline-flex items-center gap-2 px-8 py-2.5 rounded-full text-white font-semibold text-sm transition-all duration-200 hover:brightness-125 hover:shadow-lg active:scale-95"
                    style={{ background: NAVY }}
                  >
                    <span>&rarr;</span> Commencer
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Bottom sheet feel */}
          <div className="bg-white rounded-t-3xl mt-3 px-4 pt-4">

            {/* Location */}
            <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3 mb-3">
              <span className="text-base font-medium text-gray-800">Tunis, Tunisie</span>
              <PinIcon />
            </div>

            {/* Search input */}
            <div className="relative mb-4">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <SearchIcon color="#9ca3af" size={18} />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher une activite ou un lieu..."
                className="w-full rounded-xl bg-white border border-gray-100 py-3 pl-10 pr-10 text-sm text-gray-800 placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#1B3263]/25 transition-all"
                style={{ boxShadow: "0 2px 10px rgba(0,0,0,0.06)" }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg leading-none"
                  aria-label="Effacer la recherche"
                >
                  ×
                </button>
              )}
            </div>

            {/* Date picker */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide mb-5">
              {dates.map((d, index) => {
                const isSelected = d.key === selectedDate;
                const isToday = index === 0;
                return (
                  <button
                    key={d.key}
                    onClick={() => setSelectedDate(d.key)}
                    className="flex-shrink-0 flex flex-col items-center justify-center rounded-xl w-14 transition-all duration-150 hover:brightness-95 active:scale-90"
                    style={{
                      height: isToday ? 72 : 64,
                      background: isSelected ? NAVY : "#f5f5f5",
                      color: isSelected ? "#fff" : "#444",
                    }}
                  >
                    {isToday && (
                      <span
                        className="text-[10px] font-bold px-1.5 py-0.5 rounded-full mb-0.5"
                        style={{
                          background: isSelected ? "rgba(255,255,255,0.25)" : "#1B3263",
                          color: "#fff",
                        }}
                      >
                        Auj.
                      </span>
                    )}
                    <span className="text-xs font-medium opacity-80">{d.dayName}</span>
                    <span className="text-xl font-bold leading-tight">{d.dayNum}</span>
                    <span className="text-xs opacity-75">{d.month}</span>
                  </button>
                );
              })}
            </div>

            {/* Activity cards */}
            <div className="flex flex-col gap-4">
              {/* Section label */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold tracking-widest text-gray-400 uppercase">
                  Activites
                </span>
                {filteredActivities.length > 0 && (
                  <span
                    className="text-xs font-bold px-2.5 py-0.5 rounded-full"
                    style={{ background: "#eef2ff", color: NAVY }}
                  >
                    {filteredActivities.length}
                  </span>
                )}
              </div>

              {availableCategories.length > 0 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {availableCategories.map((category) => {
                    const active = selectedCategories.includes(category);
                    const style = getCategoryStyle(category);
                    return (
                      <button
                        key={category}
                        onClick={() => toggleCategory(category)}
                        className="whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-all duration-150 active:scale-95"
                        style={{
                          background: active ? NAVY : "#f3f4f6",
                          color: active ? "#fff" : "#374151",
                        }}
                      >
                        <span className="mr-1.5">{style.icon}</span>
                        {category}
                      </button>
                    );
                  })}
                </div>
              )}

              {activitiesLoading && (
                <div className="rounded-xl bg-gray-100 py-8 text-center text-sm text-gray-500">
                  Chargement des activites...
                </div>
              )}

              {!activitiesLoading && activities.length === 0 && (
                <div className="rounded-2xl bg-gray-50 py-10 flex flex-col items-center text-center px-6">
                  <svg viewBox="0 0 100 100" width="88" height="88" fill="none" className="mb-4 opacity-60">
                    <circle cx="50" cy="38" r="22" stroke="#94a3b8" strokeWidth="3" />
                    <path d="M34 38c0-8.837 7.163-16 16-16" stroke="#1B3263" strokeWidth="3" strokeLinecap="round" />
                    <circle cx="43" cy="35" r="2.5" fill="#94a3b8" />
                    <circle cx="57" cy="35" r="2.5" fill="#94a3b8" />
                    <path d="M43 44s2 3 7 3 7-3 7-3" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
                    <path d="M28 72c0-12.15 9.85-22 22-22s22 9.85 22 22" stroke="#cbd5e1" strokeWidth="3" strokeLinecap="round" />
                    <circle cx="72" cy="72" r="14" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="2" />
                    <path d="M68 72h8M72 68v8" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                  <p className="text-sm font-semibold text-gray-700 mb-1">Aucune activite pour le moment</p>
                  <p className="text-xs text-gray-400 leading-relaxed">Les activites publiees apparaitront ici. Revenez bientot !</p>
                </div>
              )}

              {!activitiesLoading && activities.length > 0 && filteredActivities.length === 0 && (
                <div className="rounded-2xl bg-gray-50 py-10 flex flex-col items-center text-center px-6">
                  <svg viewBox="0 0 100 100" width="88" height="88" fill="none" className="mb-4 opacity-60">
                    <circle cx="44" cy="42" r="22" stroke="#cbd5e1" strokeWidth="3" />
                    <line x1="60" y1="58" x2="76" y2="74" stroke="#94a3b8" strokeWidth="3.5" strokeLinecap="round" />
                    <path d="M36 42h16M44 34v16" stroke="#1B3263" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                  <p className="text-sm font-semibold text-gray-700 mb-1">Aucun resultat</p>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    {searchQuery
                      ? `Aucune activite ne correspond a "${searchQuery}".`
                      : "Aucune activite pour les filtres selectionnes."}
                  </p>
                  <button
                    onClick={() => { setSelectedCategories([]); setSearchQuery(""); }}
                    className="mt-4 text-xs font-semibold px-4 py-2 rounded-full"
                    style={{ background: "#eef2ff", color: NAVY }}
                  >
                    Reinitialiser les filtres
                  </button>
                </div>
              )}

              {filteredActivities.map((a) => {
                const style = getCategoryStyle(a.category);
                return (
                <button
                  key={a.id}
                  onClick={() => void openQuickBook(a)}
                  className="w-full rounded-2xl overflow-hidden text-left transition-all duration-200 hover:scale-[1.02] active:scale-[0.97]"
                  style={{ height: 220, boxShadow: "0 4px 24px rgba(0,0,0,0.10)" }}
                >
                  <div
                    className="w-full h-full relative flex flex-col justify-end p-4"
                    style={{
                      background: a.image_url
                        ? `linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.20) 60%, rgba(0,0,0,0.04) 100%), url('${a.image_url}') center/cover`
                        : style.gradient,
                    }}
                  >
                    {/* Category badge */}
                    <div className="absolute top-3 left-3">
                      <span
                        className="flex items-center gap-1.5 text-white text-xs font-semibold px-3 py-1.5 rounded-full"
                        style={{ background: "rgba(91,163,245,0.35)", backdropFilter: "blur(4px)" }}
                      >
                        {style.icon} {a.category}
                      </span>
                    </div>
                    {/* Text overlay */}
                    <div>
                      <h3 className="text-white text-lg font-bold leading-tight drop-shadow">
                        {a.title}
                      </h3>
                      <p className="text-gray-300 text-sm mt-0.5">
                        {a.location_name}, {a.city}, {a.country}
                      </p>
                    </div>
                  </div>
                </button>
                );
              })}

              {/* "Can't find your space?" card */}
              <div
                className="rounded-2xl p-6 flex flex-col items-center text-center mb-4"
                style={{
                  border: "2px dashed #cbd5e1",
                  background: "#f8fafc",
                }}
              >
                {/* Illustration placeholder */}
                <div className="w-28 h-28 mb-4 flex items-center justify-center">
                  <svg viewBox="0 0 120 120" width="112" height="112" fill="none">
                    {/* Person body */}
                    <ellipse cx="55" cy="110" rx="18" ry="4" fill="#e2e8f0" />
                    <rect x="47" y="72" width="16" height="30" rx="6" fill="#6d28d9" />
                    {/* Legs */}
                    <rect x="47" y="95" width="7" height="18" rx="3" fill="#1e293b" />
                    <rect x="58" y="95" width="7" height="18" rx="3" fill="#1e293b" />
                    {/* Shoes */}
                    <rect x="44" y="110" width="13" height="5" rx="2.5" fill="#6d28d9" />
                    <rect x="55" y="110" width="13" height="5" rx="2.5" fill="#6d28d9" />
                    {/* Arms */}
                    <rect x="30" y="74" width="17" height="8" rx="4" fill="#6d28d9" />
                    <rect x="63" y="72" width="17" height="8" rx="4" fill="#6d28d9" />
                    {/* Head */}
                    <circle cx="55" cy="62" r="12" fill="#fcd9b6" />
                    <path d="M48 56 Q55 50 62 56" stroke="#1e293b" strokeWidth="2" fill="none" />
                    {/* Hair */}
                    <path d="M44 60 Q44 48 55 46 Q66 48 66 60" fill="#1e293b" />
                    {/* Hand on head */}
                    <circle cx="30" cy="72" r="4" fill="#fcd9b6" />
                    {/* Signpost */}
                    <rect x="80" y="50" width="4" height="55" rx="2" fill="#94a3b8" />
                    <rect x="70" y="52" width="28" height="10" rx="3" fill="#6d28d9" />
                    <rect x="72" y="66" width="28" height="10" rx="3" fill="#7c3aed" />
                    <rect x="68" y="80" width="28" height="10" rx="3" fill="#6d28d9" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Vous ne trouvez pas votre espace ?
                </h3>
                <p className="text-sm text-gray-500 leading-5 mb-5">
                  {"Creez votre groupe, ajoutez un espace personnalise et invitez de autres personnes a rejoindre !"}
                </p>
                <button
                  className="flex items-center justify-between gap-3 w-full px-6 py-3.5 rounded-full text-white font-bold text-base transition-all duration-200 hover:brightness-125 hover:shadow-lg active:scale-95"
                  style={{ background: NAVY }}
                >
                  <span className="flex-1 text-center">Creez votre activite</span>
                  <ChevronRight color="white" size={20} />
                </button>
              </div>
            </div>
          </div>

          </>)}
        </div>

        {selectedActivity && (
          <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/45">
            <button
              aria-label="Close quick book"
              className="absolute inset-0"
              onClick={closeQuickBook}
            />
            <div className="relative z-50 w-full max-w-md rounded-t-3xl bg-white px-4 pt-3 pb-6">
              <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-gray-300" />
              <div className="mb-3 flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold text-gray-500">Reservation rapide</p>
                  <h3 className="text-lg font-bold text-gray-900">{selectedActivity.title}</h3>
                  <p className="text-sm text-gray-500">
                    {selectedActivity.location_name}, {selectedActivity.city}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => router.push(`/activities/${selectedActivity.id}`)}
                    className="rounded-full bg-blue-50 px-3 py-1.5 text-sm font-semibold text-blue-700 transition-colors hover:bg-blue-100"
                  >
                    Voir plus
                  </button>
                  <button
                    onClick={closeQuickBook}
                    className="rounded-full bg-gray-100 px-3 py-1.5 text-sm font-semibold text-gray-700"
                  >
                    Fermer
                  </button>
                </div>
              </div>

              {slotsLoading && (
                <div className="rounded-xl bg-gray-100 py-8 text-center text-sm text-gray-500">
                  Chargement des creneaux...
                </div>
              )}

              {!slotsLoading && slots.length === 0 && (
                <div className="rounded-xl bg-gray-100 py-8 text-center text-sm text-gray-500">
                  Aucun creneau disponible pour le moment.
                </div>
              )}

              {!slotsLoading && slots.length > 0 && (
                <>
                  <div className="mb-3">
                    <p className="mb-2 text-xs font-semibold text-gray-500">Choisissez une date</p>
                    <div className="flex items-center gap-2">
                      <input
                        type="date"
                        value={selectedSlotDate ?? ""}
                        min={minSlotDate}
                        max={maxSlotDate}
                        onChange={(e) => setSelectedSlotDate(e.target.value || null)}
                        className="flex-1 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                      />
                      <button
                        onClick={() => setSelectedSlotDate(null)}
                        className="whitespace-nowrap rounded-full px-3 py-2 text-xs font-semibold"
                        style={{
                          background: selectedSlotDate === null ? NAVY : "#f3f4f6",
                          color: selectedSlotDate === null ? "#fff" : "#374151",
                        }}
                      >
                        Toutes
                      </button>
                    </div>
                  </div>
                  {selectedSlotDate && filteredSlots.length === 0 && (
                    <p className="mb-3 text-center text-xs font-medium text-gray-500">
                      Aucun creneau pour cette date.
                    </p>
                  )}
                  <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
                  {filteredSlots.map((slot) => {
                    const isSelected = selectedSlotId === slot.id;
                    return (
                      <button
                        key={slot.id}
                        onClick={() => setSelectedSlotId(slot.id)}
                        className="min-w-[170px] rounded-xl border px-3 py-3 text-left transition-all duration-150 active:scale-95"
                        style={{
                          borderColor: isSelected ? NAVY : "#e5e7eb",
                          background: isSelected ? "#eef2ff" : "#fff",
                        }}
                      >
                        <p className="text-xs font-semibold uppercase text-gray-500">
                          {formatSlotDay(slot.starts_at)}
                        </p>
                        <p className="mt-1 text-sm font-bold text-gray-900">
                          {formatSlotTime(slot.starts_at)} - {formatSlotTime(slot.ends_at)}
                        </p>
                        <p className="mt-1 text-xs text-gray-600">
                          {slot.spots_left} places - {slot.price} {slot.currency}
                        </p>
                      </button>
                    );
                  })}
                  </div>
                </>
              )}

              {bookingError && (
                <p className="mb-3 text-center text-sm font-medium text-red-600">{bookingError}</p>
              )}

              <button
                onClick={() => void handleBookNow()}
                disabled={bookingLoading || slotsLoading || slots.length === 0}
                className="w-full rounded-full py-3.5 text-center text-base font-bold text-white transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-60"
                style={{ background: NAVY }}
              >
                {bookingLoading ? "Reservation en cours..." : "Book now"}
              </button>
            </div>
          </div>
        )}

        {/* Bottom Navigation — floating pill */}
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md px-4 pb-4 pointer-events-none">
          <div
            className="flex items-stretch pointer-events-auto rounded-2xl border border-white/60"
            style={{
              height: 64,
              background: "rgba(255,255,255,0.50)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.05)",
            }}
          >
            {(
              [
                { id: "recherche", label: "Recherche", icon: <SearchIcon color={activeTab === "recherche" ? NAVY : "#bbb"} size={24} /> },
                { id: "groupes", label: "Groupes", icon: <GroupsIcon color={activeTab === "groupes" ? NAVY : "#bbb"} size={24} /> },
                { id: "profil", label: "Profil", icon: <ProfileIcon color={activeTab === "profil" ? NAVY : "#bbb"} size={24} /> },
              ] as { id: Tab; label: string; icon: React.ReactNode }[]
            ).map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => void handleTabClick(tab.id)}
                  className="flex-1 flex flex-col items-center justify-center gap-0.5 transition-all duration-150 active:scale-90 relative rounded-2xl"
                  style={{ background: isActive ? "rgba(27,50,99,0.10)" : "transparent" }}
                >
                  {tab.icon}
                  <span
                    className="text-[11px] font-semibold"
                    style={{ color: isActive ? NAVY : "#bbb" }}
                  >
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}



