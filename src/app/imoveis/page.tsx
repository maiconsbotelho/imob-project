"use client";

import { PropertyCard } from "@/components/PropertyCard";
import { useProperties } from "@/contexts/PropertyContext";
import { Search, SlidersHorizontal } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function PropertyListContent() {
  const { properties } = useProperties();
  const searchParams = useSearchParams();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("todos");
  const [filterStatus, setFilterStatus] = useState<string>("todos");
  const [filterPrice, setFilterPrice] = useState<string>("todos");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const search = searchParams.get("search");
    const type = searchParams.get("type");
    const price = searchParams.get("price");

    if (search) setSearchTerm(search);
    if (type) setFilterType(type);
    if (price) setFilterPrice(price);

    // If any filter is active, show filters area (optional, but nice)
    if (type || price) setShowFilters(true);
  }, [searchParams]);

  const filteredProperties = properties.filter((property) => {
    const matchesSearch =
      property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.address.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = filterType === "todos" || property.type === filterType;
    const matchesStatus = filterStatus === "todos" || property.status === filterStatus;

    let matchesPrice = true;
    if (filterPrice !== "todos") {
      if (filterPrice === "low") {
        // Até 500k
        matchesPrice = property.price <= 500000;
      } else if (filterPrice === "mid") {
        // 500k - 1M
        matchesPrice = property.price > 500000 && property.price <= 1000000;
      } else if (filterPrice === "high") {
        // Acima de 1M
        matchesPrice = property.price > 1000000;
      }
    }

    return matchesSearch && matchesType && matchesStatus && matchesPrice;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8">Todos os Imóveis</h1>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por cidade, endereço ou título..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <SlidersHorizontal className="h-5 w-5" />
              <span>Filtros</span>
            </button>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-200">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Imóvel</label>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="todos">Todos</option>
                  <option value="casa">Casa</option>
                  <option value="apartamento">Apartamento</option>
                  <option value="terreno">Terreno</option>
                  <option value="sobrado">Sobrado</option>
                  <option value="sitio">Sítio</option>
                  <option value="chacara">Chácara</option>
                  <option value="comercial">Comercial</option>
                  <option value="rural">Rural</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="todos">Todos</option>
                  <option value="venda">Venda</option>
                  <option value="aluguel">Aluguel</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Faixa de Preço</label>
                <select
                  value={filterPrice}
                  onChange={(e) => setFilterPrice(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="todos">Todos</option>
                  <option value="low">Até R$ 500k</option>
                  <option value="mid">R$ 500k - R$ 1M</option>
                  <option value="high">Acima de R$ 1M</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            {filteredProperties.length} {filteredProperties.length === 1 ? "imóvel encontrado" : "imóveis encontrados"}
          </p>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>

        {filteredProperties.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">Nenhum imóvel encontrado com os filtros selecionados</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PropertyList() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Carregando...</div>}>
      <PropertyListContent />
    </Suspense>
  );
}
