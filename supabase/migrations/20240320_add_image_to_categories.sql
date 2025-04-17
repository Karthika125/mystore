-- Add image column to categories table
ALTER TABLE categories
ADD COLUMN image TEXT;

-- Update the existing categories to have NULL as image value
UPDATE categories
SET image = NULL
WHERE image IS NULL; 