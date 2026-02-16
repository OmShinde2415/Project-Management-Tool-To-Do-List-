"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleGoLogin = () => {
    router.push("/login");
  };

  const isAuthPage = pathname === "/login" || pathname === "/register";

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/dashboard" className="text-lg font-semibold text-slate-900">
          PM Tool
        </Link>

        <nav className="flex items-center gap-3 text-sm">
          <Link href="/dashboard" className="text-slate-700 hover:text-slate-900">
            Dashboard
          </Link>
          {isAuthPage ? (
            <>
              <Link href="/login" className="text-slate-700 hover:text-slate-900">
                Login
              </Link>
              <Link href="/register" className="text-slate-700 hover:text-slate-900">
                Register
              </Link>
            </>
          ) : (
            <button
              onClick={handleGoLogin}
              className="rounded bg-slate-900 px-3 py-1.5 text-white hover:bg-slate-800"
            >
              Login
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
