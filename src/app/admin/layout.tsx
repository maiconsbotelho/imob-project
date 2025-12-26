"use client";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { Building2, LayoutDashboard, LogOut, MapPin } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { logout } = useAuth();

  // Skip layout for login page
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const isActive = (path: string) => pathname === path;

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-gray-50">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 fixed h-full z-10 hidden md:block">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-blue-600 flex items-center gap-2">
              <Building2 className="h-8 w-8" />
              Admin
            </h2>
          </div>
          
          <nav className="px-4 space-y-2 mt-4">
            <Link 
              href="/admin/dashboard" 
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
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                isActive("/admin/cidades") 
                  ? "bg-blue-50 text-blue-600 font-semibold" 
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <MapPin className="h-5 w-5" />
              Cidades
            </Link>
          </nav>

          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100">
            <button 
              onClick={logout}
              className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl w-full transition-colors font-medium"
            >
              <LogOut className="h-5 w-5" />
              Sair
            </button>
          </div>
        </aside>

        {/* Mobile Header */}
        <div className="md:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-20 px-4 py-3 flex justify-between items-center">
             <h2 className="text-xl font-bold text-blue-600 flex items-center gap-2">
              <Building2 className="h-6 w-6" />
              Admin
            </h2>
            <div className="flex gap-4">
               <Link href="/admin/dashboard" className={isActive("/admin/dashboard") ? "text-blue-600" : "text-gray-600"}>
                  <LayoutDashboard className="h-6 w-6" />
               </Link>
               <Link href="/admin/cidades" className={isActive("/admin/cidades") ? "text-blue-600" : "text-gray-600"}>
                  <MapPin className="h-6 w-6" />
               </Link>
               <button onClick={logout} className="text-red-600">
                  <LogOut className="h-6 w-6" />
               </button>
            </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 md:ml-64 p-4 md:p-8 mt-14 md:mt-0">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}
