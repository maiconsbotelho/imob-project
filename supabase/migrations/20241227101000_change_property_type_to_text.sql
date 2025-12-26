-- Change properties.type from enum to text to allow dynamic values
ALTER TABLE properties ALTER COLUMN type TYPE TEXT;
-- We can drop the enum type if we are sure it's not used elsewhere, but keeping it is safer for now, or we can drop it to be clean.
-- DROP TYPE "PropertyType"; 
