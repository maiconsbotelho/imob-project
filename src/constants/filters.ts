import { PriceRange, PropertyType } from "@/types/filters";

export const propertyTypes: PropertyType[] = [
  { id: "1", label: "Casa", value: "casa", active: true },
  { id: "2", label: "Apartamento", value: "apartamento", active: true },
  { id: "3", label: "Terreno", value: "terreno", active: true },
  { id: "4", label: "Sobrado", value: "sobrado", active: true },
  { id: "5", label: "Sítio", value: "sitio", active: true },
  { id: "6", label: "Chácara", value: "chacara", active: true },
  { id: "7", label: "Comercial", value: "comercial", active: true },
  { id: "8", label: "Rural", value: "rural", active: true },
];

export const priceRanges: PriceRange[] = [
  {
    id: "1",
    label: "Até R$ 500k",
    value: "low",
    min_price: 0,
    max_price: 500000,
    active: true,
  },
  {
    id: "2",
    label: "R$ 500k - R$ 1M",
    value: "mid",
    min_price: 500000,
    max_price: 1000000,
    active: true,
  },
  {
    id: "3",
    label: "Acima de R$ 1M",
    value: "high",
    min_price: 1000000,
    max_price: null,
    active: true,
  },
];
