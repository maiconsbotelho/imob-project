"use client";

import { Building2, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";

export function Header() {
  const pathname = usePathname();
  const { isAuthenticated, logout } = useAuth();
  const isAdminRoute = pathname?.startsWith("/admin");

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Building2 className="h-6 w-6 text-blue-600" />
            <span className="font-bold text-xl text-gray-900">ImóvelPro</span>
          </Link>

          <nav className="flex items-center gap-4">
            {!isAdminRoute && (
              <>
                <Link href="/" className="hidden sm:block px-4 py-2 hover:text-blue-600 transition-colors">
                  Início
                </Link>
                <Link href="/imoveis" className="hidden sm:block px-4 py-2 hover:text-blue-600 transition-colors">
                  Imóveis
                </Link>
              </>
            )}

            {isAuthenticated && isAdminRoute && (
              <button
                onClick={logout}
                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Sair</span>
              </button>
            )}

            {!isAuthenticated && !isAdminRoute && (
              <Link
                href="/admin/login"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Admin
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
