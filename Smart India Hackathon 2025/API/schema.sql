-- Nabha Medicine Availability Tracker Database Schema
-- SQLite database for MVP

-- pharmacies table
CREATE TABLE pharmacies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    location TEXT NOT NULL,
    latitude REAL,
    longitude REAL,
    phone TEXT,
    address TEXT
);

-- stock table
CREATE TABLE stock (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    pharmacy_id INTEGER NOT NULL,
    medicine_name TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (pharmacy_id) REFERENCES pharmacies(id)
);

-- Sample data for Nabha area
INSERT INTO pharmacies (name, location, latitude, longitude, phone, address) VALUES 
('Nabha Medical Store', 'Near Civil Hospital', 30.3760, 76.1530, '+91-9876543210', 'Civil Hospital Road, Nabha'),
('Bansal Pharmacy', 'Market Road', 30.3745, 76.1550, '+91-9876543211', 'Market Road, Nabha'),
('Sharma Medical Center', 'Railway Road', 30.3750, 76.1520, '+91-9876543212', 'Railway Road, Nabha'),
('Punjab Medical Store', 'Bus Stand', 30.3730, 76.1540, '+91-9876543213', 'Bus Stand Area, Nabha');

-- Sample medicine stock data
INSERT INTO stock (pharmacy_id, medicine_name, quantity) VALUES
(1, 'Aspirin', 20),
(1, 'Paracetamol', 50),
(1, 'Amoxicillin', 30),
(1, 'Metformin', 25),
(1, 'Atorvastatin', 15),
(2, 'Aspirin', 5),
(2, 'Amoxicillin', 30),
(2, 'Ibuprofen', 40),
(2, 'Omeprazole', 20),
(3, 'Paracetamol', 35),
(3, 'Cetirizine', 45),
(3, 'Ranitidine', 30),
(4, 'Aspirin', 10),
(4, 'Paracetamol', 25),
(4, 'Amoxicillin', 20);
