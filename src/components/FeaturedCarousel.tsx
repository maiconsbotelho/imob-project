"use client";

import { PropertyCard } from "@/components/PropertyCard";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useProperties } from "@/contexts/PropertyContext";
import Autoplay from "embla-carousel-autoplay";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import React from "react";

export function FeaturedCarousel() {
  const { properties } = useProperties();
  // Filter only featured properties, or take the first 6 if none are marked as featured
  const featuredProperties = properties.filter((p) => p.featured);
  const displayProperties = featuredProperties.length > 0 ? featuredProperties : properties.slice(0, 6);

  const plugin = React.useRef(Autoplay({ delay: 4000, stopOnInteraction: true }));

  return (
    <section className="py-24 bg-gray-50 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-20">
          <div className="inline-block mb-4">
            <span className="py-1.5 px-3 sm:py-2 sm:px-4 rounded-full bg-blue-100 text-blue-700 font-bold text-[10px] sm:text-xs tracking-wider uppercase">
              Oportunidades
            </span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-gray-900 mb-6 tracking-tight leading-tight">
            Imóveis em{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Destaque</span>
          </h2>
          <Link
            href="/imoveis"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium group"
          >
            Ver todos os imóveis
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {displayProperties.length === 0 ? (
          <div className="text-center py-12 text-gray-500 bg-white rounded-2xl shadow-sm border border-gray-100">
            <p className="text-lg">Nenhum imóvel em destaque no momento</p>
          </div>
        ) : (
          <div className="relative">
            <Carousel
              plugins={[plugin.current]}
              className="w-full"
              opts={{
                align: "start",
                loop: true,
              }}
            >
              <CarouselContent className="-ml-4 pb-4">
                {displayProperties.map((property) => (
                  <CarouselItem key={property.id} className="pl-4 md:basis-1/2 lg:basis-1/3 xl:basis-1/3">
                    <div className="h-full p-1">
                      <PropertyCard property={property} />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="hidden md:block">
                <CarouselPrevious className="absolute -left-12 top-1/2 -translate-y-1/2 h-12 w-12 border-none bg-white/80 hover:bg-white text-blue-900 shadow-lg backdrop-blur-sm" />
                <CarouselNext className="absolute -right-12 top-1/2 -translate-y-1/2 h-12 w-12 border-none bg-white/80 hover:bg-white text-blue-900 shadow-lg backdrop-blur-sm" />
              </div>
            </Carousel>
          </div>
        )}
      </div>
    </section>
  );
}
