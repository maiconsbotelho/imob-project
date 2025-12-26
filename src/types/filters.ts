export interface PropertyType {
  id: string;
  label: string;
  value: string;
  active: boolean;
}

export interface PriceRange {
  id: string;
  label: string;
  value: string;
  min_price: number | null;
  max_price: number | null;
  active: boolean;
}
