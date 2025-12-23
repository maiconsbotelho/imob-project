"use client";

import { ArrowRight, DollarSign, Home, MapPin, Search } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

export function Hero() {
  const router = useRouter();
  const [location, setLocation] = useState("");
  const [type, setType] = useState("");
  const [priceRange, setPriceRange] = useState("");

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (location) params.append("search", location);
    if (type) params.append("type", type);
    if (priceRange) params.append("price", priceRange);

    router.push(`/imoveis?${params.toString()}`);
  };

  return (
    <div className="relative h-[100vh] min-h-[700px] w-full overflow-hidden flex items-center justify-center -mt-20">
      {/* Dynamic Background with Gradient Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transform scale-105 animate-slow-zoom"
        style={{
          backgroundImage: "url('/banner.webp')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
      </div>

      {/* Main Content */}
      <div className="relative container mx-auto px-4 z-10 pt-4">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Text & CTA */}
          <div className="lg:col-span-7 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight sm:leading-[1.1] tracking-tight">
                Descubra o Lar <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-200 to-white">
                  Dos Seus Sonhos
                </span>
              </h1>

              <p className="text-base sm:text-xl text-gray-300 mb-6 sm:mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-light px-4 sm:px-0">
                Explore as propriedades mais exclusivas e encontre o lugar perfeito para viver seus melhores momentos.
                Segurança, conforto e sofisticação em um só lugar.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center justify-center lg:justify-start w-full sm:w-auto">
                <Link href="/imoveis" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto h-12 sm:h-14 px-8 text-base sm:text-lg bg-blue-600 hover:bg-blue-700 rounded-full transition-all shadow-[0_0_40px_-10px_rgba(37,99,235,0.5)] hover:shadow-[0_0_60px_-15px_rgba(37,99,235,0.6)] border border-blue-500/50"
                  >
                    Ver Imóveis
                    <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Advanced Search Card */}
          <div className="lg:col-span-5 mt-8 lg:mt-0">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-3xl shadow-2xl"
            >
              <h3 className="text-white text-xl font-semibold mb-6 flex items-center gap-2">
                <Search className="h-5 w-5 text-blue-400" />
                Encontre seu imóvel ideal
              </h3>

              <div className="space-y-4">
                <div className="relative">
                  <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                  <Input
                    placeholder="Cidade ou Bairro"
                    className="h-12 pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-400 focus-visible:ring-blue-500/50"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <Home className="absolute left-3 top-3.5 h-5 w-5 text-gray-400 z-10" />
                    <Select value={type} onValueChange={setType}>
                      <SelectTrigger className="h-12 pl-10 bg-white/5 border-white/10 text-gray-400 hover:text-white focus:ring-blue-500/50">
                        <SelectValue placeholder="Tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="casa">Casa</SelectItem>
                        <SelectItem value="apartamento">Apartamento</SelectItem>
                        <SelectItem value="terreno">Terreno</SelectItem>
                        <SelectItem value="sobrado">Sobrado</SelectItem>
                        <SelectItem value="sitio">Sítio</SelectItem>
                        <SelectItem value="chacara">Chácara</SelectItem>
                        <SelectItem value="comercial">Comercial</SelectItem>
                        <SelectItem value="rural">Rural</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3.5 h-5 w-5 text-gray-400 z-10" />
                    <Select value={priceRange} onValueChange={setPriceRange}>
                      <SelectTrigger className="h-12 pl-10 bg-white/5 border-white/10 text-gray-400 hover:text-white focus:ring-blue-500/50">
                        <SelectValue placeholder="Faixa de Preço" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Até R$ 500k</SelectItem>
                        <SelectItem value="mid">R$ 500k - R$ 1M</SelectItem>
                        <SelectItem value="high">Acima de R$ 1M</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button
                  className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-600/20 transition-all"
                  onClick={handleSearch}
                >
                  Buscar Imóveis
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
