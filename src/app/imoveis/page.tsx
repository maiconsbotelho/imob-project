"use client";

import { PropertyCard } from "@/components/PropertyCard";

import { useProperties } from "@/contexts/PropertyContext";
import { supabase } from "@/lib/supabase";
import { City } from "@/types/city";
import { PriceRange, PropertyType } from "@/types/filters";
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
  const [filterCity, setFilterCity] = useState<string>("todos");
  const [filterCode, setFilterCode] = useState<string>("");
  const [showFilters, setShowFilters] = useState(false);
  const [cities, setCities] = useState<City[]>([]);
  const [propertyTypes, setPropertyTypes] = useState<PropertyType[]>([]);
  const [priceRanges, setPriceRanges] = useState<PriceRange[]>([]);

  useEffect(() => {
    async function fetchData() {
      const [citiesResponse, typesResponse, pricesResponse] = await Promise.all([
        supabase.from("cities").select("*").eq("active", true).order("name"),
        supabase.from("property_types").select("*").eq("active", true).order("label"),
        supabase.from("price_ranges").select("*").eq("active", true).order("min_price"),
      ]);

      if (citiesResponse.data) setCities(citiesResponse.data);
      if (typesResponse.data) setPropertyTypes(typesResponse.data);
      if (pricesResponse.data) setPriceRanges(pricesResponse.data);
    }
    fetchData();
  }, []);

  useEffect(() => {
    const search = searchParams.get("search");
    const city = searchParams.get("city");
    const type = searchParams.get("type");
    const price = searchParams.get("price");
    const code = searchParams.get("code");

    if (search) setSearchTerm(search);
    if (city) setFilterCity(city);
    if (type) setFilterType(type);
    if (price) setFilterPrice(price);
    if (code) setFilterCode(code);

    if (type || price || city || code) setShowFilters(true);
  }, [searchParams]);

  const filteredProperties = properties.filter((property) => {
    // Code Filter
    if (filterCode) {
      const sanitizedFilterCode = filterCode.replace(/[^0-9]/g, ""); // Remove non-numeric characters like '#'
      if (sanitizedFilterCode && !property.code?.toString().includes(sanitizedFilterCode)) {
        return false;
      }
    }

    // City Filter
    if (filterCity !== "todos" && property.city !== filterCity) {
      return false;
    }

    // Generic Search
    if (searchTerm) {
      const matchesSearch =
        property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.address.toLowerCase().includes(searchTerm.toLowerCase());

      if (!matchesSearch) return false;
    }

    const matchesType = filterType === "todos" || property.type === filterType;
    const matchesStatus = filterStatus === "todos" || property.status === filterStatus;

    let matchesPrice = true;
    if (filterPrice !== "todos") {
      const selectedRange = priceRanges.find((r) => r.value === filterPrice);
      if (selectedRange) {
        if (selectedRange.min_price !== null && selectedRange.max_price !== null) {
          matchesPrice = property.price >= selectedRange.min_price && property.price <= selectedRange.max_price;
        } else if (selectedRange.min_price !== null) {
          matchesPrice = property.price >= selectedRange.min_price;
        } else if (selectedRange.max_price !== null) {
          matchesPrice = property.price <= selectedRange.max_price;
        }
      }
    }

    return matchesType && matchesStatus && matchesPrice;
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
                placeholder="Buscar por endereço ou título..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="relative w-full sm:w-48">
              <input
                type="text"
                placeholder="Cód. Imóvel"
                value={filterCode}
                onChange={(e) => setFilterCode(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-200">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cidade</label>
                <select
                  value={filterCity}
                  onChange={(e) => setFilterCity(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="todos">Todas</option>
                  {cities.map((city) => (
                    <option key={city.id} value={city.name}>
                      {city.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Imóvel</label>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="todos">Todos</option>
                  {propertyTypes.map((type) => (
                    <option key={type.id} value={type.value}>
                      {type.label}
                    </option>
                  ))}
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
                  {priceRanges.map((range) => (
                    <option key={range.id} value={range.value}>
                      {range.label}
                    </option>
                  ))}
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
