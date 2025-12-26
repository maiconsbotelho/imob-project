"use client";

import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { Property } from "@/types/property";
import { ArrowLeft, Bath, Bed, Car, ChevronLeft, ChevronRight, Heart, Home, MapPin, Share2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

interface PropertyDetailClientProps {
  property: Property;
}

export function PropertyDetailClient({ property }: PropertyDetailClientProps) {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const fullscreenScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    setIsFavorite(favorites.includes(property.id));
  }, [property.id]);

  useEffect(() => {
    if (scrollContainerRef.current) {
      const width = scrollContainerRef.current.offsetWidth;
      // Check if we need to scroll (avoid conflict with user scrolling)
      if (Math.abs(scrollContainerRef.current.scrollLeft - selectedImage * width) > 20) {
        scrollContainerRef.current.scrollTo({
          left: selectedImage * width,
          behavior: "smooth",
        });
      }
    }

    if (fullscreenScrollRef.current) {
      const width = fullscreenScrollRef.current.offsetWidth;
      if (Math.abs(fullscreenScrollRef.current.scrollLeft - selectedImage * width) > 20) {
        fullscreenScrollRef.current.scrollTo({
          left: selectedImage * width,
          behavior: "smooth",
        });
      }
    }
  }, [selectedImage, isFullScreen]);

  useEffect(() => {
    if (!isFullScreen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsFullScreen(false);
      if (e.key === "ArrowLeft") handlePrevImage();
      if (e.key === "ArrowRight") handleNextImage();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullScreen]);

  const handleThumbnailClick = (index: number) => {
    // Check if mobile carousel is visible/active by checking offsetWidth
    if (scrollContainerRef.current && scrollContainerRef.current.offsetWidth > 0) {
      // Mobile behavior: Just scroll, let onScroll update the state to avoid race condition
      const width = scrollContainerRef.current.offsetWidth;
      scrollContainerRef.current.scrollTo({
        left: index * width,
        behavior: "smooth",
      });
    } else {
      // Desktop behavior: Update state directly
      setSelectedImage(index);
    }
  };

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

  const handleContact = (type: "interest" | "visit") => {
    const prefix =
      type === "visit" ? "Olá, gostaria de agendar uma visita para o imóvel" : "Olá, tenho interesse no imóvel";

    const message = `${prefix}: ${property.title} (Cód: ${property.code}) localizado em ${property.city}. Link: ${window.location.href}`;
    const whatsappUrl = `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleNextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedImage((prev) => (prev + 1) % property.images.length);
  };

  const handlePrevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedImage((prev) => (prev - 1 + property.images.length) % property.images.length);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fullscreen Modal */}
      {isFullScreen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4">
          <button
            onClick={() => setIsFullScreen(false)}
            className="absolute top-4 right-4 z-50 text-white/70 hover:text-white transition-colors p-2"
          >
            <X className="h-8 w-8" />
          </button>

          <button
            onClick={handlePrevImage}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-50 text-white/70 hover:text-white transition-colors p-2 bg-black/50 rounded-full hover:bg-black/70"
          >
            <ChevronLeft className="h-8 w-8" />
          </button>

          <button
            onClick={handleNextImage}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-50 text-white/70 hover:text-white transition-colors p-2 bg-black/50 rounded-full hover:bg-black/70"
          >
            <ChevronRight className="h-8 w-8" />
          </button>

          <div
            ref={fullscreenScrollRef}
            className="relative w-full h-full max-w-7xl max-h-[90vh] flex overflow-x-auto snap-x snap-mandatory scrollbar-hide z-40 items-center"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            onScroll={(e) => {
              const scrollLeft = e.currentTarget.scrollLeft;
              const width = e.currentTarget.offsetWidth;
              const index = Math.round(scrollLeft / width);
              if (index !== selectedImage && index >= 0 && index < property.images.length) {
                setSelectedImage(index);
              }
            }}
          >
            {property.images.map((image, index) => (
              <div key={index} className="min-w-full h-full flex items-center justify-center snap-center relative p-2">
                <ImageWithFallback
                  src={image}
                  alt={`${property.title} - ${index + 1}`}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            ))}
          </div>

          <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/90 bg-black/50 px-4 py-2 rounded-full text-sm z-50">
            {selectedImage + 1} / {property.images.length}
          </p>
        </div>
      )}

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
          {/* Mobile Main Image (Carousel) */}
          <div className="md:hidden relative mb-4">
            <div
              ref={scrollContainerRef}
              className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide rounded-xl"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              onScroll={(e) => {
                const scrollLeft = e.currentTarget.scrollLeft;
                const width = e.currentTarget.offsetWidth;
                const index = Math.round(scrollLeft / width);
                if (index !== selectedImage && index >= 0 && index < property.images.length) {
                  setSelectedImage(index);
                }
              }}
            >
              {property.images.map((image, index) => (
                <div
                  key={index}
                  className="min-w-full snap-center relative aspect-video"
                  onClick={() => setIsFullScreen(true)}
                >
                  <ImageWithFallback
                    src={image}
                    alt={`${property.title} - ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
                    {index + 1} / {property.images.length}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Desktop Main Image & Thumbnails */}
          <div className="hidden md:flex gap-4 h-[400px]">
            <div className="flex-1 rounded-xl overflow-hidden relative group">
              <ImageWithFallback
                src={property.images[selectedImage] || property.images[0]}
                alt={property.title}
                className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                onClick={() => setIsFullScreen(true)}
              />

              {/* Navigation Arrows */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevImage(e);
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-all opacity-0 group-hover:opacity-100"
                aria-label="Imagem anterior"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNextImage(e);
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-all opacity-0 group-hover:opacity-100"
                aria-label="Próxima imagem"
              >
                <ChevronRight className="h-6 w-6" />
              </button>

              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none flex items-center justify-center opacity-0 group-hover:opacity-100">
                <span className="bg-black/50 text-white px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm">
                  Ver em tela cheia
                </span>
              </div>
            </div>

            {/* Desktop Vertical Thumbnails */}
            {property.images.length > 1 && (
              <div className="w-[180px] flex flex-col gap-3 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                {property.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => handleThumbnailClick(index)}
                    className={`shrink-0 rounded-lg overflow-hidden border-2 transition-all aspect-video relative ${
                      selectedImage === index ? "border-blue-600" : "border-transparent"
                    }`}
                  >
                    <ImageWithFallback
                      src={image}
                      alt={`${property.title} - ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Mobile Thumbnails */}
          {property.images.length > 1 && (
            <div className="md:hidden flex gap-2 mt-4 overflow-x-auto pb-2 scrollbar-hide snap-x">
              {property.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => handleThumbnailClick(index)}
                  className={`shrink-0 w-24 rounded-lg overflow-hidden border-2 transition-all aspect-video relative snap-start ${
                    selectedImage === index ? "border-blue-600" : "border-transparent"
                  }`}
                >
                  <ImageWithFallback
                    src={image}
                    alt={`${property.title} - ${index + 1}`}
                    className="w-full h-full object-cover"
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
                <div className="flex flex-col gap-1">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{property.title}</h1>
                  {property.code && (
                    <span className="inline-flex items-center w-fit bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium border border-gray-200 mt-1">
                      Cód. Imóvel: {property.code}
                    </span>
                  )}
                </div>
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

              <button
                onClick={() => handleContact("interest")}
                className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold mb-3"
              >
                Tenho Interesse
              </button>

              <button
                onClick={() => handleContact("visit")}
                className="w-full py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-semibold"
              >
                Agendar Visita
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
