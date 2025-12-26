"use client";

import { LayoutDashboard, LogIn, LogOut, Menu } from "lucide-react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";

export function Header() {
  const pathname = usePathname();
  const { isAuthenticated, logout } = useAuth();
  const isAdminRoute = pathname?.startsWith("/admin");
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 20);
  });

  const navLinks = [
    { name: "Início", href: "/" },
    { name: "Imóveis", href: "/imoveis" },
    { name: "Favoritos", href: "/favoritos" },
    { name: "Negocie seu Imóvel", href: "/negocie" },
    { name: "Sobre", href: "/sobre" },
    { name: "Contato", href: "/contato" },
  ];

  return (
    <motion.header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled || pathname !== "/" ? "bg-white/80 backdrop-blur-md shadow-sm border-b" : "bg-transparent"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between flex-row-reverse md:flex-row">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative h-12 md:h-16 w-40">
              <Image
                src={scrolled || pathname !== "/" ? "/logo.png" : "/logo-branco.png"}
                alt="ImóvelPro"
                fill
                className="object-contain object-right md:object-left"
                priority
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {!isAdminRoute &&
              navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-sm font-medium transition-colors hover:text-blue-500 ${
                    scrolled || pathname !== "/" ? "text-gray-700" : "text-white/90 hover:text-white"
                  } ${pathname === link.href ? "text-blue-600 font-bold" : ""}`}
                >
                  {link.name}
                </Link>
              ))}

            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                {!isAdminRoute && (
                  <Link href="/admin/dashboard">
                    <Button
                      variant="ghost"
                      className={`flex items-center gap-2 ${
                        scrolled || pathname !== "/"
                          ? "text-gray-700 hover:bg-gray-100"
                          : "text-white/90 hover:text-white hover:bg-white/10"
                      }`}
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      Painel Admin
                    </Button>
                  </Link>
                )}
                <Button
                  variant="ghost"
                  onClick={logout}
                  className={`flex items-center gap-2 ${
                    scrolled || pathname !== "/"
                      ? "text-red-600 hover:bg-red-50"
                      : "text-red-200 hover:text-red-100 hover:bg-red-500/20"
                  }`}
                >
                  <LogOut className="h-4 w-4" />
                  Sair
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                {/* Optional: Login Text Link if they want explicit "Login" vs "Area do Corretor" */}
                {/* 
                <Link href="/admin/login">
                  <Button variant="ghost" className={scrolled ? "text-gray-700" : "text-white/90 hover:text-white"}>
                    Login
                  </Button>
                </Link>
                */}

                <Link href="/admin/login">
                  <Button
                    className={`rounded-full px-6 font-semibold transition-all flex items-center gap-2 ${
                      scrolled || pathname !== "/"
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "bg-white text-blue-600 hover:bg-gray-100"
                    }`}
                  >
                    <LogIn className="h-4 w-4" />
                    Área do Corretor
                  </Button>
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={
                    scrolled || pathname !== "/" ? "text-gray-900" : "text-white hover:bg-white/10 hover:text-white"
                  }
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2">
                    <div className="relative h-8 w-32">
                      <Image src="/logo.png" alt="ImóvelPro" fill className="object-contain object-left" />
                    </div>
                  </SheetTitle>
                  <SheetDescription className="sr-only">Menu de navegação</SheetDescription>
                </SheetHeader>
                <div className="flex flex-col gap-4 mt-8">
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={`text-lg font-medium p-2 rounded-lg transition-colors hover:bg-gray-100 ${
                        pathname === link.href ? "text-blue-600 bg-blue-50" : "text-gray-600"
                      }`}
                    >
                      {link.name}
                    </Link>
                  ))}

                  <div className="h-px bg-gray-100 my-2" />

                  {isAuthenticated ? (
                    <>
                      <Link href="/admin/dashboard" onClick={() => setIsOpen(false)}>
                        <Button className="w-full justify-start gap-2 bg-blue-600 text-white hover:bg-blue-700">
                          <LayoutDashboard className="h-4 w-4" />
                          Painel Admin
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        onClick={() => {
                          logout();
                          setIsOpen(false);
                        }}
                        className="w-full justify-start gap-2 text-red-600 hover:bg-red-50 border-red-200"
                      >
                        <LogOut className="h-4 w-4" />
                        Sair
                      </Button>
                    </>
                  ) : (
                    <Link href="/admin/login" onClick={() => setIsOpen(false)}>
                      <Button className="w-full bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2 justify-center">
                        <LogIn className="h-4 w-4" />
                        Área do Corretor
                      </Button>
                    </Link>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
