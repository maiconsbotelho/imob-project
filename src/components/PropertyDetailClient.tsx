"use client";

import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { Property } from "@/types/property";
import { ArrowLeft, Bath, Bed, Car, Heart, Home, MapPin, Share2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface PropertyDetailClientProps {
  property: Property;
}

export function PropertyDetailClient({ property }: PropertyDetailClientProps) {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    setIsFavorite(favorites.includes(property.id));
  }, [property.id]);

  const toggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    if (favorites.includes(property.id)) {
      const newFavorites = favorites.filter((favId: string) => favId !== property.id);
      localStorage.setItem("favorites", JSON.stringify(newFavorites));
      setIsFavorite(false);
    } else {
      favorites.push(property.id);
      localStorage.setItem("favorites", JSON.stringify(favorites));
      setIsFavorite(true);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: property.title,
      text: `🏠 *${property.title}*\n\n${property.description.substring(0, 100)}...\n\n📍 ${property.city} - ${
        property.state
      }\n💰 ${formatPrice(property.price)}\n\nVeja mais detalhes no link abaixo:`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      // Fallback: Copy to clipboard with a nice message
      const textToCopy = `${shareData.text}\n${shareData.url}`;
      navigator.clipboard.writeText(textToCopy);
      alert("Link e descrição copiados para a área de transferência!");
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const videoId = property.videoUrl ? getYouTubeId(property.videoUrl) : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-5 w-5" />
            <span>Voltar</span>
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Image Gallery */}
        <div className="mb-8">
          <div className="rounded-xl overflow-hidden mb-4">
            <ImageWithFallback
              src={property.images[selectedImage] || property.images[0]}
              alt={property.title}
              className="w-full h-64 sm:h-96 object-cover"
            />
          </div>

          {property.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {property.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === index ? "border-blue-600" : "border-transparent"
                  }`}
                >
                  <ImageWithFallback
                    src={image}
                    alt={`${property.title} - ${index + 1}`}
                    className="w-full h-20 object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  {property.status === "venda" ? "Venda" : "Aluguel"}
                </span>
                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium capitalize">
                  {property.type}
                </span>
                {property.featured && (
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
                    Destaque
                  </span>
                )}
              </div>

              <div className="flex justify-between items-start mb-4">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{property.title}</h1>
                <div className="flex gap-2">
                  <button
                    onClick={toggleFavorite}
                    className={`p-2 rounded-full transition-colors ${
                      isFavorite ? "bg-red-50 text-red-600" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                    title={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                  >
                    <Heart className={`h-6 w-6 ${isFavorite ? "fill-current" : ""}`} />
                  </button>
                  <button
                    onClick={handleShare}
                    className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                    title="Compartilhar"
                  >
                    <Share2 className="h-6 w-6" />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 text-gray-600 mb-6">
                <MapPin className="h-5 w-5" />
                <span>
                  {property.address}, {property.city} - {property.state}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6 pb-6 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-12 h-12 bg-blue-50 rounded-lg">
                    <Bed className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{property.bedrooms}</p>
                    <p className="text-sm text-gray-600">Quartos</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-12 h-12 bg-blue-50 rounded-lg">
                    <Bath className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{property.bathrooms}</p>
                    <p className="text-sm text-gray-600">Banheiros</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-12 h-12 bg-blue-50 rounded-lg">
                    <Car className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{property.parking}</p>
                    <p className="text-sm text-gray-600">Vagas</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-12 h-12 bg-blue-50 rounded-lg">
                    <Home className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{property.area}</p>
                    <p className="text-sm text-gray-600">m²</p>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Descrição</h2>
                <p className="text-gray-700 leading-relaxed mb-8">{property.description}</p>

                {videoId && (
                  <div className="mt-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Vídeo do Imóvel</h2>
                    <div className="relative pb-[56.25%] h-0 rounded-xl overflow-hidden bg-gray-100 shadow-sm">
                      <iframe
                        className="absolute top-0 left-0 w-full h-full"
                        src={`https://www.youtube.com/embed/${videoId}`}
                        title="YouTube video player"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-sm sticky top-24">
              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-2">Preço</p>
                <p className="text-3xl font-bold text-blue-600">
                  {formatPrice(property.price)}
                  {property.status === "aluguel" && <span className="text-lg">/mês</span>}
                </p>
              </div>

              <button className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold mb-3">
                Tenho Interesse
              </button>

              <button className="w-full py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-semibold">
                Agendar Visita
              </button>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-2">Código do Imóvel</p>
                <p className="font-mono text-gray-900">#{property.id}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
