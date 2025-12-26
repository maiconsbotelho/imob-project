CREATE TABLE IF NOT EXISTS cities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  state TEXT DEFAULT 'RS',
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed some cities
INSERT INTO cities (name, state, active) VALUES
('Porto Alegre', 'RS', true),
('Caxias do Sul', 'RS', true),
('Canoas', 'RS', true),
('Pelotas', 'RS', true),
('Santa Maria', 'RS', true),
('Gravataí', 'RS', true),
('Viamão', 'RS', true),
('Novo Hamburgo', 'RS', true),
('São Leopoldo', 'RS', true),
('Rio Grande', 'RS', true),
('Alvorada', 'RS', true),
('Passo Fundo', 'RS', true),
('Sapucaia do Sul', 'RS', true),
('Uruguaiana', 'RS', true),
('Santa Cruz do Sul', 'RS', true),
('Cachoeirinha', 'RS', true),
('Bagé', 'RS', true),
('Bento Gonçalves', 'RS', true),
('Erechim', 'RS', true),
('Guaíba', 'RS', true)
ON CONFLICT (name) DO NOTHING;

-- Enable RLS
ALTER TABLE cities ENABLE ROW LEVEL SECURITY;

-- Allow read access to everyone
CREATE POLICY "Allow public read access" ON cities FOR SELECT USING (true);

-- Allow write access only to authenticated users (admin)
CREATE POLICY "Allow authenticated insert" ON cities FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated update" ON cities FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated delete" ON cities FOR DELETE USING (auth.role() = 'authenticated');
