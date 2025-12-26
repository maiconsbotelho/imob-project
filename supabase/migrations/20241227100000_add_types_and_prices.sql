-- Create property_types table
CREATE TABLE property_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label TEXT NOT NULL,
  value TEXT NOT NULL UNIQUE,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Insert default property types
INSERT INTO property_types (label, value) VALUES
('Casa', 'casa'),
('Apartamento', 'apartamento'),
('Terreno', 'terreno'),
('Sobrado', 'sobrado'),
('Sítio', 'sitio'),
('Chácara', 'chacara'),
('Comercial', 'comercial'),
('Rural', 'rural');

-- Create price_ranges table
CREATE TABLE price_ranges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label TEXT NOT NULL,
  value TEXT NOT NULL UNIQUE,
  min_price DOUBLE PRECISION,
  max_price DOUBLE PRECISION,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Insert default price ranges
INSERT INTO price_ranges (label, value, min_price, max_price) VALUES
('Até R$ 500k', 'low', 0, 500000),
('R$ 500k - R$ 1M', 'mid', 500000, 1000000),
('Acima de R$ 1M', 'high', 1000000, NULL);
