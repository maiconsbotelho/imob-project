export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  type: 'casa' | 'apartamento' | 'terreno' | 'sobrado' | 'sitio' | 'chacara' | 'comercial' | 'rural';
  status: 'venda' | 'aluguel';
  bedrooms: number;
  bathrooms: number;
  area: number;
  parking: number;
  address: string;
  city: string;
  state: string;
  images: string[];
  featured: boolean;
  createdAt: string;
}
