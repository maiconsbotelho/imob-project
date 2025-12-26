import { Bath, Bed, Car, Heart, MapPin, Share2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Property } from "../types/property";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Button } from "./ui/button";

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    setIsFavorite(favorites.includes(property.id));
  }, [property.id]);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    if (favorites.includes(property.id)) {
      const newFavorites = favorites.filter((id: string) => id !== property.id);
      localStorage.setItem("favorites", JSON.stringify(newFavorites));
      setIsFavorite(false);
      // Optional: dispatch event to update other components listening to localstorage changes
      window.dispatchEvent(new Event("storage"));
    } else {
      favorites.push(property.id);
      localStorage.setItem("favorites", JSON.stringify(favorites));
      setIsFavorite(true);
      window.dispatchEvent(new Event("storage"));
    }
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}/imoveis/${property.id}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: property.title,
          text: `Confira este imóvel: ${property.title}`,
          url: url,
        });
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      navigator.clipboard.writeText(url);
      alert("Link copiado para a área de transferência!");
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Link href={`/imoveis/${property.id}`} className="group block h-full">
      <div className="relative bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-blue-900/10 transition-all duration-500 border border-gray-100 h-full flex flex-col">
        {/* Image Container */}
        <div className="relative h-64 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10 opacity-60 group-hover:opacity-40 transition-opacity" />

          <ImageWithFallback
            src={property.images[0]}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          />

          {/* Badges */}
          <div className="absolute top-4 left-4 z-20 flex gap-2">
            <span
              className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm backdrop-blur-md ${
                property.status === "venda" ? "bg-blue-600/90 text-white" : "bg-purple-600/90 text-white"
              }`}
            >
              {property.status === "venda" ? "Venda" : "Aluguel"}
            </span>
            {property.featured && (
              <span className="px-3 py-1.5 bg-yellow-400/90 text-yellow-950 text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm backdrop-blur-md">
                Destaque
              </span>
            )}
          </div>

          {/* Action Buttons (Overlay) */}
          <div className="absolute top-4 right-4 z-20 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
            <Button
              size="icon"
              variant="secondary"
              className={`h-8 w-8 rounded-full bg-white/90 hover:bg-white text-gray-700 hover:text-red-500 shadow-sm ${
                isFavorite ? "text-red-500" : ""
              }`}
              onClick={toggleFavorite}
            >
              <Heart className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`} />
            </Button>
            <Button
              size="icon"
              variant="secondary"
              className="h-8 w-8 rounded-full bg-white/90 hover:bg-white text-gray-700 hover:text-blue-500 shadow-sm"
              onClick={handleShare}
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>

          {/* Price Overlay */}
          <div className="absolute bottom-4 left-4 z-20">
            <span className="text-2xl font-bold text-white drop-shadow-md">
              {formatPrice(property.price)}
              {property.status === "aluguel" && <span className="text-sm font-normal text-gray-200">/mês</span>}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col flex-grow">
          <div className="mb-4">
            <div className="flex items-center gap-1.5 text-gray-500 text-sm mb-2 font-medium">
              <MapPin className="h-4 w-4 text-blue-500" />
              <span className="line-clamp-1">
                {property.city}, {property.state}
              </span>
            </div>
            <h3 className="font-bold text-xl text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
              {property.title}
            </h3>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-3 gap-3 py-4 border-t border-gray-100 mt-auto">
            <div className="flex flex-col items-center justify-center p-2 bg-gray-50 rounded-xl group-hover:bg-blue-50 transition-colors">
              <Bed className="h-5 w-5 text-gray-400 group-hover:text-blue-500 mb-1 transition-colors" />
              <span className="text-xs font-semibold text-gray-700">
                {property.bedrooms} <span className="font-normal text-gray-500">Quartos</span>
              </span>
            </div>
            <div className="flex flex-col items-center justify-center p-2 bg-gray-50 rounded-xl group-hover:bg-blue-50 transition-colors">
              <Bath className="h-5 w-5 text-gray-400 group-hover:text-blue-500 mb-1 transition-colors" />
              <span className="text-xs font-semibold text-gray-700">
                {property.bathrooms} <span className="font-normal text-gray-500">Banheiros</span>
              </span>
            </div>
            <div className="flex flex-col items-center justify-center p-2 bg-gray-50 rounded-xl group-hover:bg-blue-50 transition-colors">
              <Car className="h-5 w-5 text-gray-400 group-hover:text-blue-500 mb-1 transition-colors" />
              <span className="text-xs font-semibold text-gray-700">
                {property.parking} <span className="font-normal text-gray-500">Vagas</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
