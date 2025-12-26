import { PropertyDetailClient } from "@/components/PropertyDetailClient";
import { mockProperties } from "@/data/mockProperties";
import { supabase } from "@/lib/supabase";
import { Metadata } from "next";
import Link from "next/link";

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getProperty(id: string) {
  try {
    const { data, error } = await supabase.from("properties").select("*").eq("id", id).single();

    if (error || !data) {
      // Fallback to mock data if supabase fails or not found (e.g. dev environment without local db)
      const mock = mockProperties.find((p) => p.id === id);
      return mock || null;
    }

    return data;
  } catch (error) {
    console.error("Error fetching property:", error);
    return mockProperties.find((p) => p.id === id) || null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const property = await getProperty(id);

  if (!property) {
    return {
      title: "Imóvel não encontrado | ImóvelPro",
      description: "O imóvel que você procura não foi encontrado.",
    };
  }

  const title = `${property.title} | ImóvelPro`;
  const description = `${property.type} para ${property.status} em ${property.city}. ${property.bedrooms} quartos, ${property.area}m². Confira!`;
  const imageUrl = property.images[0] || "/logo.png"; // Fallback image

  return {
    title: title,
    description: description,
    openGraph: {
      title: title,
      description: description,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: property.title,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
      images: [imageUrl],
    },
  };
}

export default async function PropertyDetailPage({ params }: PageProps) {
  const { id } = await params;
  const property = await getProperty(id);

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Imóvel não encontrado</h2>
          <Link href="/imoveis" className="text-blue-600 hover:text-blue-700">
            Voltar para listagem
          </Link>
        </div>
      </div>
    );
  }

  return <PropertyDetailClient property={property} />;
}
