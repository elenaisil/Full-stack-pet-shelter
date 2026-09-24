DROP TABLE IF EXISTS adoption CASCADE;
DROP TABLE IF EXISTS pet CASCADE;
DROP TABLE IF EXISTS adopter CASCADE;
DROP TABLE IF EXISTS shelter CASCADE;

-- Shelter Table
CREATE TABLE shelter (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    location VARCHAR(100),
    capacity INT CHECK (capacity >= 0),
    phone VARCHAR(20),
    creation_day DATE NOT NULL DEFAULT CURRENT_DATE
);

-- Adopter Table (Consolidated with Auth and Roles)
CREATE TABLE adopter (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255), -- Store hashed passwords in a real app
    role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    phone VARCHAR(50),
    address VARCHAR(255),
    city VARCHAR(100)
);

-- Pet Table
CREATE TABLE pet (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    species VARCHAR(100),
    age INT CHECK (age >= 0),
    gender VARCHAR(20) CHECK (gender IN ('Male', 'Female', 'Unknown')),
    adopted BOOLEAN DEFAULT FALSE,
    shelter_id INT,
    FOREIGN KEY (shelter_id) REFERENCES shelter(id) ON DELETE SET NULL
);

-- Adoption Table (Consolidated with Status)
CREATE TABLE adoption (
    id BIGSERIAL PRIMARY KEY,
    pet_id INT NOT NULL,
    adopter_id INT NOT NULL,
    adoption_date DATE DEFAULT CURRENT_DATE,
    status VARCHAR(50) DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Rejected', 'Completed')),
    FOREIGN KEY (pet_id) REFERENCES pet(id) ON DELETE CASCADE,
    FOREIGN KEY (adopter_id) REFERENCES adopter(id) ON DELETE CASCADE
);

-- Insert Shelters
INSERT INTO shelter (name, location, capacity, phone, creation_day) VALUES 
('Happy Paws Rescue', 'Budapest', 50, '36-1-555-0100', '2020-05-15'),
('Safe Haven Tails', 'Debrecen', 30, '36-52-555-0199', '2018-11-20');

-- Insert Adopters (Including the Admin)
INSERT INTO adopter (name, email, password, role, phone, address, city) VALUES 
('System Admin', 'admin@pawpal.com', 'hashed_password_here', 'admin', '36-70-000-0000', 'Tech Hub', 'Budapest'),
('Alice Smith', 'alice@example.com', 'password123', 'user', '36-20-555-1111', '123 Main St', 'Budapest'),
('Bob Johnson', 'bob@example.com', 'password456', 'user', '36-30-555-2222', '456 Oak Ave', 'Szeged');

-- Insert Pets
INSERT INTO pet (name, species, age, gender, adopted, shelter_id) VALUES 
('Bella', 'Dog', 3, 'Female', FALSE, 1),
('Max', 'Dog', 5, 'Male', TRUE, 1),
('Luna', 'Cat', 2, 'Female', FALSE, 2),
('Charlie', 'Dog', 1, 'Male', FALSE, 2);

-- Insert Adoptions
-- Alice (ID 2) adopts Max (ID 2)
INSERT INTO adoption (pet_id, adopter_id, adoption_date, status) VALUES 
(2, 2, '2023-10-01', 'Approved');