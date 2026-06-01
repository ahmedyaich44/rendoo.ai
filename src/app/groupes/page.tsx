"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import AppLoadingScreen from "@/components/AppLoadingScreen";

const NAVY = "#1B3263";

type BookingRow = {
  id: string;
  status: "pending" | "confirmed" | "cancelled";
  created_at: string;
  activity_slots: {
    id: string;
    starts_at: string;
    ends_at: string;
    price: number;
    currency: string;
    activities: {
      id: string;
      title: string;
      location_name: string;
      city: string;
      country: string;
      category: string;
      image_url: string | null;
    } | null;
  } | null;
};

type BookingQueryRow = {
  id: string;
  status: "pending" | "confirmed" | "cancelled";
  created_at: string;
  activity_slots:
    | {
        id: string;
        starts_at: string;
        ends_at: string;
        price: number;
        currency: string;
        activities:
          | {
              id: string;
              title: string;
              location_name: string;
              city: string;
              country: string;
              category: string;
              image_url: string | null;
            }
          | {
              id: string;
              title: string;
              location_name: string;
              city: string;
              country: string;
              category: string;
              image_url: string | null;
            }[]
          | null;
      }
    | {
        id: string;
        starts_at: string;
        ends_at: string;
        price: number;
        currency: string;
        activities:
          | {
              id: string;
              title: string;
              location_name: string;
              city: string;
              country: string;
              category: string;
              image_url: string | null;
            }
          | {
              id: string;
              title: string;
              location_name: string;
              city: string;
              country: string;
              category: string;
              image_url: string | null;
            }[]
          | null;
      }[]
    | null;
};

function formatDate(dateIso: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateIso));
}

function SearchIcon({ color = "#888", size = 24 }: { color?: string; size?: number }) {
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

export default function GroupesPage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [cancelLoadingId, setCancelLoadingId] = useState<string | null>(null);
  const [confirmCancelBookingId, setConfirmCancelBookingId] = useState<string | null>(null);

  useEffect(() => {
    async function loadBookings() {
      setErrorMessage(null);
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/signin");
        return;
      }

      const { data, error } = await supabase
        .from("bookings")
        .select(`
          id,
          status,
          created_at,
          activity_slots (
            id,
            starts_at,
            ends_at,
            price,
            currency,
            activities (
              id,
              title,
              location_name,
              city,
              country,
              category,
              image_url
            )
          )
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        setErrorMessage(error.message);
        setLoading(false);
        return;
      }

      const normalized: BookingRow[] = ((data ?? []) as BookingQueryRow[]).map((row) => {
        const slot = Array.isArray(row.activity_slots)
          ? (row.activity_slots[0] ?? null)
          : (row.activity_slots ?? null);
        const activity = Array.isArray(slot?.activities)
          ? (slot.activities[0] ?? null)
          : (slot?.activities ?? null);
        return {
          id: row.id,
          status: row.status,
          created_at: row.created_at,
          activity_slots: slot
            ? {
                id: slot.id,
                starts_at: slot.starts_at,
                ends_at: slot.ends_at,
                price: slot.price,
                currency: slot.currency,
                activities: activity
                  ? {
                      id: activity.id,
                      title: activity.title,
                      location_name: activity.location_name,
                      city: activity.city,
                      country: activity.country,
                      category: activity.category,
                      image_url: activity.image_url,
                    }
                  : null,
              }
            : null,
        };
      });

      setBookings(normalized);
      setLoading(false);
    }

    loadBookings();
  }, [router, supabase]);

  const confirmedCount = useMemo(
    () => bookings.filter((booking) => booking.status === "confirmed").length,
    [bookings],
  );

  async function handleCancelReservation(bookingId: string) {
    setErrorMessage(null);
    setCancelLoadingId(bookingId);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/signin");
      return;
    }

    const { error } = await supabase.rpc("cancel_booking_and_release_spot", {
      p_booking_id: bookingId,
    });

    setCancelLoadingId(null);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    setBookings((current) =>
      current.map((booking) =>
        booking.id === bookingId ? { ...booking, status: "cancelled" } : booking,
      ),
    );
    setConfirmCancelBookingId(null);
  }

  if (loading) {
    return <AppLoadingScreen label="Chargement des réservations..." />;
  }

  return (
    <div className="flex justify-center min-h-screen bg-gradient-to-br from-slate-100 to-blue-50">
      <div className="w-full max-w-md min-h-screen bg-white pb-28">
        <div
          className="sticky top-0 z-10 border-b border-gray-100/60 px-4 py-4"
          style={{ background: "rgba(255,255,255,0.80)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)" }}
        >
          <div>
            <h1 className="text-xl font-bold text-gray-900">Mes réservations</h1>
            <p className="text-sm text-gray-500">{confirmedCount} confirmées</p>
          </div>
        </div>

        <div className="space-y-3 px-4 pt-4">
          {loading && (
            <div className="rounded-xl bg-gray-100 py-8 text-center text-sm text-gray-500">
              Chargement des réservations...
            </div>
          )}

          {!loading && errorMessage && (
            <div className="rounded-xl bg-red-50 py-6 text-center text-sm font-medium text-red-600">
              {errorMessage}
            </div>
          )}

          {!loading && !errorMessage && bookings.length === 0 && (
            <div className="rounded-xl bg-gray-100 py-8 text-center text-sm text-gray-500">
              Aucune réservation pour le moment.
            </div>
          )}

          {!loading && !errorMessage && bookings.map((booking) => {
            const slot = booking.activity_slots;
            const activity = slot?.activities;
            return (
              <div key={booking.id} className="overflow-hidden rounded-2xl border border-gray-200">
                <div
                  className="h-28 w-full bg-gray-200"
                  style={{
                    background: activity?.image_url
                      ? `linear-gradient(rgba(0,0,0,.15), rgba(0,0,0,.45)), url('${activity.image_url}') center/cover`
                      : "linear-gradient(160deg, #0d2137 0%, #1a3a5c 50%, #2e5f8a 100%)",
                  }}
                />
                <div className="space-y-1 px-4 py-3">
                  <div className="flex items-center justify-between gap-2">
                    <h2 className="text-lg font-bold text-gray-900">{activity?.title ?? "Activité"}</h2>
                    <span
                      className="rounded-full px-2.5 py-1 text-xs font-semibold capitalize"
                      style={{
                        background: booking.status === "confirmed" ? "#DCFCE7" : "#F3F4F6",
                        color: booking.status === "confirmed" ? "#166534" : "#4B5563",
                      }}
                    >
                      {booking.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {activity?.location_name}, {activity?.city}, {activity?.country}
                  </p>
                  {slot && (
                    <p className="text-sm font-semibold text-gray-800">
                      {formatDate(slot.starts_at)} - {formatDate(slot.ends_at)}
                    </p>
                  )}
                  {slot && (
                    <p className="text-sm text-gray-700">
                      {slot.price} {slot.currency}
                    </p>
                  )}
                  {activity?.id && (
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        onClick={() => router.push(`/activities/${activity.id}`)}
                        className="rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 transition-colors hover:bg-blue-100"
                      >
                        Voir plus
                      </button>

                      {booking.status !== "cancelled" && (
                        <button
                          onClick={() => setConfirmCancelBookingId(booking.id)}
                          disabled={cancelLoadingId === booking.id}
                          className="rounded-full bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 transition-colors hover:bg-red-100 disabled:opacity-60"
                        >
                          {cancelLoadingId === booking.id ? "Annulation..." : "Annuler"}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

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
            <button
              onClick={() => router.push("/")}
              className="flex-1 flex flex-col items-center justify-center gap-0.5 transition-all duration-150 active:scale-90 rounded-2xl"
            >
              <SearchIcon color="#bbb" size={24} />
              <span className="text-[11px] font-semibold text-[#bbb]">Recherche</span>
            </button>
            <button
              onClick={() => router.push("/groupes")}
              className="flex-1 flex flex-col items-center justify-center gap-0.5 transition-all duration-150 active:scale-90 rounded-2xl"
              style={{ background: "rgba(27,50,99,0.10)" }}
            >
              <GroupsIcon color={NAVY} size={24} />
              <span className="text-[11px] font-semibold" style={{ color: NAVY }}>Groupes</span>
            </button>
            <button
              onClick={() => router.push("/")}
              className="flex-1 flex flex-col items-center justify-center gap-0.5 transition-all duration-150 active:scale-90 rounded-2xl"
            >
              <ProfileIcon color="#bbb" size={24} />
              <span className="text-[11px] font-semibold text-[#bbb]">Profil</span>
            </button>
          </div>
        </div>

        {confirmCancelBookingId && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/45 px-4 pb-6">
            <button
              className="absolute inset-0"
              aria-label="Close confirmation"
              onClick={() => setConfirmCancelBookingId(null)}
            />
            <div className="relative w-full max-w-md rounded-2xl bg-white p-5 shadow-xl">
              <h3 className="text-lg font-bold text-gray-900">Confirmer l&apos;annulation</h3>
              <p className="mt-2 text-sm text-gray-600">
                Etes-vous sur de vouloir annuler cette reservation ?
              </p>
              <div className="mt-5 flex items-center justify-end gap-2">
                <button
                  onClick={() => setConfirmCancelBookingId(null)}
                  className="rounded-full bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-200"
                >
                  Retour
                </button>
                <button
                  onClick={() => void handleCancelReservation(confirmCancelBookingId)}
                  disabled={cancelLoadingId === confirmCancelBookingId}
                  className="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-60"
                >
                  {cancelLoadingId === confirmCancelBookingId ? "Annulation..." : "Confirmer"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
