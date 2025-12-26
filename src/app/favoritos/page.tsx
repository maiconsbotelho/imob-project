"use client";

import { PropertyCard } from "@/components/PropertyCard";
import { useProperties } from "@/contexts/PropertyContext";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function FavoritesPage() {
  const { properties } = useProperties();
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    setFavoriteIds(storedFavorites);
    setLoading(false);
  }, []);

  const favoriteProperties = properties.filter((property) =>
    favoriteIds.includes(property.id)
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">Carregando favoritos...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8">
          Meus Favoritos
        </h1>

        {favoriteProperties.length > 0 ? (
          <>
            <div className="mb-6">
              <p className="text-gray-600">
                {favoriteProperties.length}{" "}
                {favoriteProperties.length === 1
                  ? "imóvel salvo"
                  : "imóveis salvos"}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoriteProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Você ainda não tem favoritos
            </h2>
            <p className="text-gray-600 mb-6">
              Navegue pelos imóveis e clique no coração para salvar os que você
              gostar.
            </p>
            <Link
              href="/imoveis"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              Ver Imóveis
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
