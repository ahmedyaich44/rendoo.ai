"use client";

type AppLoadingScreenProps = {
  label?: string;
};

export default function AppLoadingScreen({ label = "Chargement..." }: AppLoadingScreenProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-6">
      <div className="flex w-full max-w-md flex-col items-center rounded-3xl bg-white px-8 py-10 shadow-sm">
        <div className="flex h-28 w-28 items-center justify-center rounded-2xl bg-[#1B3263]">
          <span
            className="text-7xl italic leading-none text-white"
            style={{ fontFamily: "Georgia, serif" }}
          >
            R
          </span>
        </div>

        <div className="mt-6 h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-[#1B3263]" />
        <p className="mt-3 text-sm font-semibold text-gray-600">{label}</p>
      </div>
    </div>
  );
}

