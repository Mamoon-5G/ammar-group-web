-- Database: ammar_group
CREATE DATABASE IF NOT EXISTS ammar_group;
USE ammar_group;

-- Table structure for products
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  brand VARCHAR(255),
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image VARCHAR(255)
);

-- Insert some demo products
INSERT INTO products (name, brand, description, price, image) VALUES
('Graco Paint Sprayer', 'Graco', 'High-quality paint sprayer for professionals', 25000.00, '/images/graco.png'),
('Mirka Sanding Machine', 'Mirka', 'Durable sanding machine for industrial use', 18000.00, '/images/mirka.png'),
('Berger Industrial Paint', 'Berger', 'Premium industrial coating for heavy duty use', 5000.00, '/images/berger.png'),
('Industrial Air Compressor', 'Atlas Copco', 'Reliable compressor for manufacturing units', 75000.00, '/images/compressor.png'),
('Protective Gear Kit', '3M', 'Industrial safety gear kit including helmet, gloves and masks', 3500.00, '/images/safetykit.png');
