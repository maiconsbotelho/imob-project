"use client";

import { FeaturedCarousel } from "@/components/FeaturedCarousel";
import { FeaturesSection } from "@/components/FeaturesSection";
import { Hero } from "@/components/Hero";
import { ParallaxSection } from "@/components/ParallaxSection";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Hero />

      <FeaturesSection />

      {/* Featured Properties Carousel */}
      <FeaturedCarousel />

      <ParallaxSection />
    </div>
  );
}
