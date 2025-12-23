"use client";

import { PropertyCard } from "@/components/PropertyCard";
import { useProperties } from "@/contexts/PropertyContext";
import { Award, Search, Shield, TrendingUp } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const { properties } = useProperties();
  const featuredProperties = properties.filter((p) => p.featured).slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-16 sm:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl sm:text-5xl font-bold mb-6">Encontre o Imóvel dos Seus Sonhos</h1>
            <p className="text-lg sm:text-xl mb-8 text-blue-100">
              As melhores oportunidades em casas e apartamentos para você e sua família
            </p>
            <Link
              href="/imoveis"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
            >
              <Search className="h-5 w-5" />
              Ver Todos os Imóveis
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Melhores Ofertas</h3>
              <p className="text-gray-600">Imóveis com os melhores preços do mercado</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Segurança</h3>
              <p className="text-gray-600">Transações 100% seguras e documentadas</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <Award className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Qualidade</h3>
              <p className="text-gray-600">Imóveis selecionados e verificados</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Imóveis em Destaque</h2>
            <Link href="/imoveis" className="text-blue-600 hover:text-blue-700 font-medium">
              Ver todos
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>

          {featuredProperties.length === 0 && (
            <div className="text-center py-12 text-gray-500">Nenhum imóvel em destaque no momento</div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Pronto para encontrar seu novo lar?</h2>
          <p className="text-lg mb-8 text-blue-100">Explore nossa seleção completa de imóveis disponíveis</p>
          <Link
            href="/imoveis"
            className="inline-block px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
          >
            Começar Busca
          </Link>
        </div>
      </section>
    </div>
  );
}
