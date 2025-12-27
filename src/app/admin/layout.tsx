"use client";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import {
  Building2,
  DollarSign,
  Home,
  LayoutDashboard,
  LogOut,
  MapPin,
  Menu,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
  SheetHeader,
} from "@/components/ui/sheet";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  // Skip layout for login page
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const isActive = (path: string) => pathname === path;

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-blue-600 flex items-center gap-2">
          <Building2 className="h-8 w-8" />
          Admin
        </h2>
      </div>

      <nav className="px-4 space-y-2 mt-4 flex-1">
        <Link
          href="/admin/dashboard"
          onClick={() => setIsOpen(false)}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
            isActive("/admin/dashboard")
              ? "bg-blue-50 text-blue-600 font-semibold"
              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
          }`}
        >
          <LayoutDashboard className="h-5 w-5" />
          Imóveis
        </Link>

        <Link
          href="/admin/cidades"
          onClick={() => setIsOpen(false)}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
            isActive("/admin/cidades")
              ? "bg-blue-50 text-blue-600 font-semibold"
              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
          }`}
        >
          <MapPin className="h-5 w-5" />
          Cidades
        </Link>

        <Link
          href="/admin/tipos"
          onClick={() => setIsOpen(false)}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
            isActive("/admin/tipos")
              ? "bg-blue-50 text-blue-600 font-semibold"
              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
          }`}
        >
          <Home className="h-5 w-5" />
          Tipos
        </Link>

        <Link
          href="/admin/precos"
          onClick={() => setIsOpen(false)}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
            isActive("/admin/precos")
              ? "bg-blue-50 text-blue-600 font-semibold"
              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
          }`}
        >
          <DollarSign className="h-5 w-5" />
          Preços
        </Link>
      </nav>

      <div className="p-4 border-t border-gray-200">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-600 hover:bg-red-50 transition-colors font-medium"
        >
          <LogOut className="h-5 w-5" />
          Sair
        </button>
      </div>
    </div>
  );

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-gray-50">
        {/* Desktop Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 fixed h-full z-10 hidden md:block">
          <SidebarContent />
        </aside>

        {/* Mobile Header */}
        <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-20 flex items-center justify-between px-4">
          <h2 className="text-xl font-bold text-blue-600 flex items-center gap-2">
            <Building2 className="h-6 w-6" />
            Admin
          </h2>

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <button className="p-2 -mr-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                <Menu className="h-6 w-6" />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-72">
              <SheetHeader className="sr-only">
                <SheetTitle>Menu de Navegação</SheetTitle>
                <SheetDescription>
                  Navegue pelo painel administrativo
                </SheetDescription>
              </SheetHeader>
              <SidebarContent />
            </SheetContent>
          </Sheet>
        </div>

        {/* Mobile Bottom Navigation */}
        <div className="md:hidden fixed bottom-4 left-4 right-4 z-50">
          <div className="bg-blue-600/70 backdrop-blur-md rounded-2xl shadow-lg shadow-blue-600/20 border border-blue-500/50">
            <div className="grid grid-cols-4 gap-1 p-2">
              <Link
                href="/admin/dashboard"
                className={`flex flex-col items-center justify-center gap-1 p-2 rounded-xl transition-all active:scale-95 ${
                  isActive("/admin/dashboard")
                    ? "bg-white/20 text-white"
                    : "text-blue-100 hover:text-white hover:bg-white/10"
                }`}
              >
                <LayoutDashboard className="h-6 w-6" />
                <span className="text-[10px] font-medium">Imóveis</span>
              </Link>

              <Link
                href="/admin/cidades"
                className={`flex flex-col items-center justify-center gap-1 p-2 rounded-xl transition-all active:scale-95 ${
                  isActive("/admin/cidades")
                    ? "bg-white/20 text-white"
                    : "text-blue-100 hover:text-white hover:bg-white/10"
                }`}
              >
                <MapPin className="h-6 w-6" />
                <span className="text-[10px] font-medium">Cidades</span>
              </Link>

              <Link
                href="/admin/tipos"
                className={`flex flex-col items-center justify-center gap-1 p-2 rounded-xl transition-all active:scale-95 ${
                  isActive("/admin/tipos")
                    ? "bg-white/20 text-white"
                    : "text-blue-100 hover:text-white hover:bg-white/10"
                }`}
              >
                <Home className="h-6 w-6" />
                <span className="text-[10px] font-medium">Tipos</span>
              </Link>

              <Link
                href="/admin/precos"
                className={`flex flex-col items-center justify-center gap-1 p-2 rounded-xl transition-all active:scale-95 ${
                  isActive("/admin/precos")
                    ? "bg-white/20 text-white"
                    : "text-blue-100 hover:text-white hover:bg-white/10"
                }`}
              >
                <DollarSign className="h-6 w-6" />
                <span className="text-[10px] font-medium">Preços</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 md:ml-64 p-4 md:p-8 mt-4 md:mt-0 mb-20 md:mb-0 overflow-x-hidden pt-4 md:pt-8">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}
