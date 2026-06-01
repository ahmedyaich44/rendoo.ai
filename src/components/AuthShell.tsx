"use client";

import Link from "next/link";

interface AuthShellProps {
  subtitle: string;
  title: string;
  illustration: React.ReactNode;
  children: React.ReactNode;
  backHref: string;
}

export default function AuthShell({ subtitle, title, illustration, children, backHref }: AuthShellProps) {
  return (
    <div className="flex justify-center min-h-screen bg-gray-100">
      <div
        className="relative flex flex-col bg-gray-50 w-full max-w-md min-h-screen"
        style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
      >
        {/* Back button */}
        <Link
          href={backHref}
          className="absolute top-5 left-4 w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-sm z-10 transition-all duration-150 hover:bg-gray-100 hover:shadow-md active:scale-90"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M15 6l-6 6 6 6" stroke="#333" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>

        <div className="flex flex-col items-center px-6 pt-14 pb-10 overflow-y-auto">
          {/* Subtitle */}
          <p className="text-center text-sm text-gray-500 leading-5 mt-4 max-w-xs">
            {subtitle}
          </p>

          {/* Title */}
          <h1 className="text-3xl font-extrabold text-gray-900 mt-3 mb-2">{title}</h1>

          {/* Illustration */}
          <div className="my-4">{illustration}</div>

          {/* Form content */}
          <div className="w-full">{children}</div>
        </div>
      </div>
    </div>
  );
}
