"use client";

import { Facebook, Instagram, Mail, MapPin, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Info */}
          <div>
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="relative h-36 md:h-20 w-40">
                <Image src="/logo-branco.png" alt="ImóvelPro" fill className="object-contain object-left" />
              </div>
            </div>
            <p className="text-gray-400 leading-relaxed mb-6">
              Transformando o mercado imobiliário com inovação, transparência e tecnologia. Encontre seu lugar no mundo
              com a gente.
            </p>
            <div className="flex gap-4">
              <a
                href="https://www.instagram.com/altrenimoveis/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-800 rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://www.facebook.com/altrenimoveisigrejinha"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-800 rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://wa.me/5551997979739"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-800 rounded-lg hover:bg-blue-600 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
                  <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-6">Links Rápidos</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/imoveis" className="text-gray-400 hover:text-white transition-colors">
                  Buscar Imóveis
                </Link>
              </li>
              <li>
                <Link href="/sobre" className="text-gray-400 hover:text-white transition-colors">
                  Sobre Nós
                </Link>
              </li>
              <li>
                <Link href="/contato" className="text-gray-400 hover:text-white transition-colors">
                  Fale Conosco
                </Link>
              </li>
              <li>
                <Link href="/politica-privacidade" className="text-gray-400 hover:text-white transition-colors">
                  Política de Privacidade
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-lg mb-6">Contato</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-gray-400">
                <MapPin className="h-5 w-5 text-blue-500 shrink-0 mt-1" />
                <span>
                  Rua Gen. Ernesto Dornelles, 168
                  <br />
                  Centro, Igrejinha/RS
                </span>
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <Phone className="h-5 w-5 text-blue-500 shrink-0" />
                <span>(51) 99797-9739</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <Mail className="h-5 w-5 text-blue-500 shrink-0" />
                <span>altrenimoveis@gmail.com</span>
              </li>
            </ul>
            <div className="mt-6 text-gray-400 text-sm space-y-1">
              <p>CNPJ: 39.286.085/0001-51</p>
              <p>CRECI-RS 25793 J</p>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-bold text-lg mb-6">Newsletter</h3>
            <p className="text-gray-400 mb-4">Receba as melhores ofertas e novidades do mercado imobiliário.</p>
            <div className="space-y-3">
              <Input
                type="email"
                placeholder="Seu melhor e-mail"
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus-visible:ring-blue-500"
              />
              <Button className="w-full bg-blue-600 hover:bg-blue-700 font-semibold">Inscrever-se</Button>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} Altren Imóveis. Todos os direitos reservados.</p>
          <p className="flex items-center gap-1">
            Desenvolvido por
            <a
              href="https://www.linkedin.com/in/maiconbotelho/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-400 transition-colors font-medium"
            >
              Maicon Botelho
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
