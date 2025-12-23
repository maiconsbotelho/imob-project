import { Bath, Bed, Car, MapPin } from "lucide-react";
import Link from "next/link";
import { Property } from "../types/property";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Link href={`/imoveis/${property.id}`} className="group block">
      <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100">
        <div className="relative h-48 sm:h-56 overflow-hidden">
          <ImageWithFallback
            src={property.images[0]}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-3 left-3 flex gap-2">
            <span className="px-3 py-1 bg-blue-600 text-white text-xs rounded-full">
              {property.status === "venda" ? "Venda" : "Aluguel"}
            </span>
            {property.featured && (
              <span className="px-3 py-1 bg-yellow-500 text-white text-xs rounded-full">Destaque</span>
            )}
          </div>
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-1">{property.title}</h3>

          <div className="flex items-center gap-1 text-gray-600 text-sm mb-3">
            <MapPin className="h-4 w-4" />
            <span className="line-clamp-1">
              {property.city}, {property.state}
            </span>
          </div>

          <div className="flex items-center gap-4 text-gray-600 text-sm mb-4">
            <div className="flex items-center gap-1">
              <Bed className="h-4 w-4" />
              <span>{property.bedrooms}</span>
            </div>
            <div className="flex items-center gap-1">
              <Bath className="h-4 w-4" />
              <span>{property.bathrooms}</span>
            </div>
            <div className="flex items-center gap-1">
              <Car className="h-4 w-4" />
              <span>{property.parking}</span>
            </div>
            <div className="flex items-center gap-1">
              <span>{property.area}m²</span>
            </div>
          </div>

          <div className="pt-3 border-t border-gray-100">
            <span className="text-2xl font-bold text-blue-600">
              {formatPrice(property.price)}
              {property.status === "aluguel" && <span className="text-sm">/mês</span>}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
