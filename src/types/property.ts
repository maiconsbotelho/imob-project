export interface Property {
  id: string;
  code: number;
  title: string;
  description: string;
  price: number;
  type: string;
  status: "venda" | "aluguel";
  bedrooms: number;
  bathrooms: number;
  area: number;
  parking: number;
  address: string;
  city: string;
  state: string;
  images: string[];
  videoUrl?: string;
  featured: boolean;
  createdAt: string;
}
