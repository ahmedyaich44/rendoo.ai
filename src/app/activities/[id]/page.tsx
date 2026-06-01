"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const NAVY = "#1B3263";

type ActivityDetails = {
  id: string;
  title: string;
  description: string | null;
  category: string;
  location_name: string;
  city: string;
  country: string;
  image_url: string | null;
  price: number;
  currency: string;
  capacity: number;
};

type Slot = {
  id: string;
  starts_at: string;
  ends_at: string;
  spots_left: number;
  price: number;
  currency: string;
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

export default function ActivityDetailsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const supabase = createClient();
  const [activity, setActivity] = useState<ActivityDetails | null>(null);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setErrorMessage(null);
      setLoading(true);

      const { data: activityData, error: activityError } = await supabase
        .from("activities")
        .select("id,title,description,category,location_name,city,country,image_url,price,currency,capacity")
        .eq("id", params.id)
        .single();

      if (activityError) {
        setErrorMessage(activityError.message);
        setLoading(false);
        return;
      }

      setActivity(activityData as ActivityDetails);

      const { data: slotsData } = await supabase
        .from("activity_slots")
        .select("id,starts_at,ends_at,spots_left,price,currency")
        .eq("activity_id", params.id)
        .eq("is_active", true)
        .gte("starts_at", new Date().toISOString())
        .order("starts_at", { ascending: true })
        .limit(10);

      setSlots((slotsData ?? []) as Slot[]);
      setLoading(false);
    }

    if (params.id) {
      void load();
    }
  }, [params.id, supabase]);

  return (
    <div className="flex min-h-screen justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white pb-8">
        <div className="sticky top-0 z-10 border-b border-gray-100 bg-white px-4 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M15 6l-6 6 6 6" stroke="#333" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <h1 className="text-lg font-bold text-gray-900">Détails activité</h1>
          </div>
        </div>

        {loading && (
          <div className="px-4 pt-6">
            <div className="rounded-xl bg-gray-100 py-8 text-center text-sm text-gray-500">
              Chargement...
            </div>
          </div>
        )}

        {!loading && errorMessage && (
          <div className="px-4 pt-6">
            <div className="rounded-xl bg-red-50 py-6 text-center text-sm font-medium text-red-600">
              {errorMessage}
            </div>
          </div>
        )}

        {!loading && !errorMessage && activity && (
          <div className="space-y-4 px-4 pt-4">
            <div
              className="h-44 w-full rounded-2xl bg-gray-200"
              style={{
                background: activity.image_url
                  ? `linear-gradient(rgba(0,0,0,.2), rgba(0,0,0,.45)), url('${activity.image_url}') center/cover`
                  : "linear-gradient(160deg, #0d2137 0%, #1a3a5c 50%, #2e5f8a 100%)",
              }}
            />

            <div>
              <p className="text-xs font-semibold text-gray-500">{activity.category}</p>
              <h2 className="text-2xl font-bold text-gray-900">{activity.title}</h2>
              <p className="mt-1 text-sm text-gray-600">
                {activity.location_name}, {activity.city}, {activity.country}
              </p>
            </div>

            <div className="rounded-xl bg-gray-50 px-4 py-3">
              <p className="text-sm font-semibold text-gray-800">
                {activity.price} {activity.currency} • Capacité {activity.capacity}
              </p>
              <p className="mt-2 text-sm text-gray-600">
                {activity.description && activity.description.trim().length > 0
                  ? activity.description
                  : "Aucune description disponible pour cette activité."}
              </p>
            </div>

            <div>
              <h3 className="mb-2 text-sm font-bold text-gray-900">Prochains créneaux</h3>
              {slots.length === 0 && (
                <div className="rounded-xl bg-gray-100 py-6 text-center text-sm text-gray-500">
                  Aucun créneau à venir.
                </div>
              )}
              <div className="space-y-2">
                {slots.map((slot) => (
                  <div key={slot.id} className="rounded-xl border border-gray-200 px-3 py-3">
                    <p className="text-sm font-semibold text-gray-900">
                      {formatDate(slot.starts_at)} - {formatDate(slot.ends_at)}
                    </p>
                    <p className="text-xs text-gray-600">
                      {slot.spots_left} places • {slot.price} {slot.currency}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => router.push("/")}
              className="w-full rounded-full py-3.5 text-base font-bold text-white"
              style={{ background: NAVY }}
            >
              {"Retour à l'accueil"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
