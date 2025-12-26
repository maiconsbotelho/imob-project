-- Create a sequence for the friendly code, starting at 100000 to ensure 6 digits
CREATE SEQUENCE IF NOT EXISTS properties_code_seq START 100000;

-- Add the code column with the default value from the sequence
ALTER TABLE properties ADD COLUMN IF NOT EXISTS code INTEGER DEFAULT nextval('properties_code_seq');

-- Create a unique index to ensure uniqueness
CREATE UNIQUE INDEX IF NOT EXISTS properties_code_idx ON properties (code);
