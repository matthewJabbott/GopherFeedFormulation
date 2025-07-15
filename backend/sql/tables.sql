CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  clerk_id VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(40),
  first_name VARCHAR(40),
  last_name VARCHAR(40),
  role ENUM( 'Admin', 'Member', 'Guest') NOT NULL DEFAULT 'Guest',
  last_login TIMESTAMP NULL DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  ip_address VARCHAR(45) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE ingredients (
  `id` INT(8) NOT NULL AUTO_INCREMENT,
  `created_at` DATE NOT NULL,
  `Name` varchar(255) NOT NULL,
  `Dry matter` DECIMAL(8,2) DEFAULT 0.00,
  `Crude protein` DECIMAL(8,2) DEFAULT 0.00,
  `Digestible Protein` DECIMAL(8,2) DEFAULT 0.00,
  `Total lipid` DECIMAL(8,2) DEFAULT 0.00,
  `Carbohydrate` DECIMAL(8,2) DEFAULT 0.00,
  `Total phosphorus` DECIMAL(8,2) DEFAULT 0.00,
  `Calcium` DECIMAL(8,2) DEFAULT 0.00,
  `Ash` DECIMAL(8,2) DEFAULT 0.00,
  `Gross energy` DECIMAL(8,2) DEFAULT 0.00,
  `Digestible energy` DECIMAL(8,2) DEFAULT 0.00, 
  `Alanine` DECIMAL(8,2) DEFAULT 0.00, 
  `Arginine` DECIMAL(8,2) DEFAULT 0.00, 
  `Aspartic acid` DECIMAL(8,2) DEFAULT 0.00, 
  `Cysteine` DECIMAL(8,2) DEFAULT 0.00, 
  `Glutamic acid` DECIMAL(8,2) DEFAULT 0.00, 
  `Glycine` DECIMAL(8,2) DEFAULT 0.00, 
  `Histidine` DECIMAL(8,2) DEFAULT 0.00, 
  `Isoleucine` DECIMAL(8,2) DEFAULT 0.00, 
  `Leucine` DECIMAL(8,2) DEFAULT 0.00, 
  `Lysine` DECIMAL(8,2) DEFAULT 0.00, 
  `Methionine` DECIMAL(8,2) DEFAULT 0.00, 
  `Phenylalanine` DECIMAL(8,2) DEFAULT 0.00, 
  `Proline` DECIMAL(8,2) DEFAULT 0.00, 
  `Serine` DECIMAL(8,2) DEFAULT 0.00, 
  `Taurine` DECIMAL(8,2) DEFAULT 0.00, 
  `Threonine` DECIMAL(8,2) DEFAULT 0.00, 
  `Tyrosine` DECIMAL(8,2) DEFAULT 0.00, 
  `Valine` DECIMAL(8,2) DEFAULT 0.00, 
  `C14:0` DECIMAL(8,2) DEFAULT 0.00, 
  `C16:0` DECIMAL(8,2) DEFAULT 0.00, 
  `C16:1` DECIMAL(8,2) DEFAULT 0.00, 
  `C18:0` DECIMAL(8,2) DEFAULT 0.00, 
  `C18:1` DECIMAL(8,2) DEFAULT 0.00, 
  `C18:2n-6` DECIMAL(8,2) DEFAULT 0.00, 
  `C18:3n-3` DECIMAL(8,2) DEFAULT 0.00, 
  `C20:4n-6` DECIMAL(8,2) DEFAULT 0.00, 
  `C20:5n-3` DECIMAL(8,2) DEFAULT 0.00, 
  `C22:6n-3` DECIMAL(8,2) DEFAULT 0.00, 
  `SFA` DECIMAL(8,2) DEFAULT 0.00, 
  `MUFA` DECIMAL(8,2) DEFAULT 0.00, 
  `PUFA` DECIMAL(8,2) DEFAULT 0.00, 
  `lcPUFA` DECIMAL(8,2) DEFAULT 0.00, 
  `LC n-3` DECIMAL(8,2) DEFAULT 0.00, 
  `LC n-6` DECIMAL(8,2) DEFAULT 0.00, 
  `isCore` BOOLEAN DEFAULT true,
  `clerk_id` VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`clerk_id`) REFERENCES users(`clerk_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Create tables
CREATE TABLE species (
  id INT AUTO_INCREMENT PRIMARY KEY,
  common_name VARCHAR(255) NOT NULL,
  scientific_name VARCHAR(255) NOT NULL,
  source VARCHAR(255),
  general_info TEXT
);

CREATE TABLE weight_category (
  id INT AUTO_INCREMENT PRIMARY KEY,
  category_name VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE diet_specification (
  species_id INT,
  weight_cat_id INT,
  protein_min DECIMAL(8,2),
  protein_max DECIMAL(8,2),
  lipid_min DECIMAL(8,2),
  lipid_max DECIMAL(8,2),
  gross_energy_min DECIMAL(8,2),
  gross_energy_max DECIMAL(8,2),
  phosphorus_min DECIMAL(8,2),
  phosphorus_max DECIMAL(8,2),
  lcPUFA_min DECIMAL(8,2),
  lcPUFA_max DECIMAL(8,2),
  PRIMARY KEY (species_id, weight_cat_id),
  FOREIGN KEY (species_id) REFERENCES species(id),
  FOREIGN KEY (weight_cat_id) REFERENCES weight_category(id)
);

CREATE TABLE ingredient_specification (
  species_id INT,
  weight_cat_id INT,
  ingredients_id INT,
  min_value DECIMAL(8,2),
  max_value DECIMAL(8,2),
  PRIMARY KEY (species_id, weight_cat_id, ingredients_id),
  FOREIGN KEY (species_id) REFERENCES species(id),
  FOREIGN KEY (weight_cat_id) REFERENCES weight_category(id),
  FOREIGN KEY (ingredients_id) REFERENCES ingredients(id)
);

CREATE TABLE feeds (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(40) UNIQUE,
  feed_description VARCHAR(100),
  species_id INT,
  weight_cat_id INT,
  created_at DATE,
  clerk_id VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  FOREIGN KEY (species_id) REFERENCES species(id),
  FOREIGN KEY (weight_cat_id) REFERENCES weight_category(id),
  FOREIGN KEY (clerk_id) REFERENCES users(clerk_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE feed_ingredient_association (
  id INT AUTO_INCREMENT PRIMARY KEY,
  feed_id INT NOT NULL,
  ingredient_id INT NOT NULL,
  percentage FLOAT(5,2) DEFAULT 0.00,
  FOREIGN KEY (feed_id) REFERENCES feeds(id) ON DELETE CASCADE,
  FOREIGN KEY (ingredient_id) REFERENCES ingredients(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  clerk_id VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  category ENUM('ingredient', 'feed', 'user') NOT NULL,
  description TEXT NOT NULL,
  ip_address VARCHAR(45),
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (clerk_id) REFERENCES users(clerk_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Insert user
INSERT INTO users (clerk_id, email, username, first_name, last_name, role)
VALUES 
  ('user_2wWWVIGmZfSrtUlVtem5wBCJEd3', 'testuser@feedportal.com', 'testuser', 'Test', 'Admin', 'Admin'),
  ('user_2whp9wRR5Xg3pbkJus1h7yWjK8i', 'member@example.com', 'memberuser', 'Mark', 'Member', 'Member'),
  ('user_2x1NVW5BNDlAamqnBMLmdOPb6xe', 'guest@example.com', 'guestuser', 'Guest', 'User', 'Guest');

INSERT INTO `ingredients` 
(`created_at`, `Name`, `Dry matter`, `Crude protein`, `Digestible Protein`, `Total lipid`, `Carbohydrate`, `Total phosphorus`, `Calcium`, `Ash`, `Gross energy`, `Digestible energy`, `Alanine`, `Arginine`, `Aspartic acid`, `Cysteine`, `Glutamic acid`, `Glycine`, `Histidine`, `Isoleucine`, `Leucine`, `Lysine`, `Methionine`, `Phenylalanine`, `Proline`, `Serine`, `Taurine`, `Threonine`, `Tyrosine`, `Valine`, `C14:0`, `C16:0`, `C16:1`, `C18:0`, `C18:1`, `C18:2n-6`, `C18:3n-3`, `C20:4n-6`, `C20:5n-3`, `C22:6n-3`, `SFA`, `MUFA`, `PUFA`, `lcPUFA`, `LC n-3`, `LC n-6`, `isCore`, `clerk_id`) 
VALUES 
('2024-08-17', 'Fish meal (anchovy)', '922', '688', '585', '65', '19', '24', '45', '150', '19', '15', '39', '35', '61', '2', '84', '37', '19', '25', '46', '52', '18', '24', '25', '24', '6', '26', '19', '31', '4', '13.4', '4', '3.2', '5.3', '0.7', '0.5', '0.7', '8.6', '11', '21.2', '12.3', '25.2', '22.3', '21.2', '1.1', 1, 'user_2wWWVIGmZfSrtUlVtem5wBCJEd3'),
('2024-08-17', 'Poultry meal', '950', '660', '561', '141', '7', '22', '11', '142', '21', '19', '43', '45', '52', '11', '82', '61', '12', '25', '46', '36', '14', '25', '49', '35', '3', '27', '18', '27', '1.4', '22.6', '4.9', '7.3', '44.1', '11.9', '2.2', '0.5', '0.8', '1.3', '32.3', '53', '17.8', '3.3', '2.5', '0.8', 1, 'user_2wWWVIGmZfSrtUlVtem5wBCJEd3'),
('2024-08-17', 'Soy protein concentrate', '946', '605', '484', '20', '253', '3', '5', '68', '19.7', '16', '25', '41', '72', '10', '116', '25', '14', '26', '46', '39', '7', '30', '30', '32', '0', '24', '21', '28', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '1', 'user_2wWWVIGmZfSrtUlVtem5wBCJEd3'),
('2024-08-17', 'Fish oil (Menhaden)', '990', '0', '0', '970', '0', '0', '0', '20', '38', '34', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '44', '131.8', '53.6', '31.9', '119', '14.4', '7.5', '10.7', '91.8', '99.6', '249.4', '212.6', '345.6', '253.3', '233.5', '19.8', '1', 'user_2wWWVIGmZfSrtUlVtem5wBCJEd3'),
('2024-08-17', 'Canola oil', '990', '0', '0', '980', '0', '0', '0', '10', '36', '36', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '50', '8.3', '25', '449.8', '166.6', '108.3', '0', '0', '0', '75', '458.2', '274.9', '0', '108.3', '166.6', '1', 'user_2wWWVIGmZfSrtUlVtem5wBCJEd3'),
('2024-08-17', 'Wheat flour', '900', '120', '72', '12', '752', '8', '1', '16', '17', '10', '3', '5', '6', '3', '31', '4', '1', '3', '7', '4', '1', '5', '19', '5', '0', '4', '3', '4', '0.1', '2.9', '0.2', '0.5', '2.9', '7.1', '0.5', '0', '0.2', '0.3', '3.6', '3.4', '8.3', '0.6', '0.6', '0', 1, 'user_2wWWVIGmZfSrtUlVtem5wBCJEd3'),
('2024-08-17', 'Wheat gluten', '919', '739', '591', '42', '131', '2', '1', '7', '21', '20', '19', '26', '25', '20', '299', '25', '13', '28', '53', '11', '15', '43', '115', '40', '0', '21', '27', '28', '0', '3.4', '0', '0.3', '4', '11.2', '2.3', '14', '0', '0', '15.6', '9.1', '33.7', '20.1', '0', '20.1', 1, 'user_2wWWVIGmZfSrtUlVtem5wBCJEd3');

-- Insert species
INSERT INTO species (id, common_name, scientific_name, source, general_info) VALUES
(1, 'Atlantic salmon', 'Salmo salar', 'https://www.fao.org/fishery/docs/DOCUMENT/aquaculture/CulturedSpecies/file/en/en_atlanticsalmon.htm', 'Atlantic salmon culture began in the 19th century in the UK in freshwater. Sea cage culture was first used in the 1960s in Norway to raise Atlantic salmon to marketable size. The early successes in Norway prompted the development of salmon culture in Scotland, and latterly Ireland, the Faroe Islands, Canada, the Northeastern seaboard of the USA, Chile and Australia (Tasmania). Minor production also occurs in New Zealand, France and Spain. All of the major production areas lie within latitudes 40-70º in the Northern Hemisphere, and 40-50º in the Southern Hemisphere. Salmon farming reached Tasmania in 1984, with the importation of eggs from Nova Scotia, Canada. The area has favourable sea temperatures and its relative isolation from other wild and cultured Atlantic salmon avoids some of the major infectious disease problems. Lack of suitable sites will most likely limit the expansion of the industry there.'),
(2, 'Barramundi', 'Lates calcarifer', 'https://www.fao.org/fishery/docs/DOCUMENT/aquaculture/CulturedSpecies/file/en/en_barramundi.htm', 'Lates calcarifer, known as seabass in Asia and barramundi in Australia, is a large, euryhaline member of the family Centropomidae that is widely distributed in the Indo-West Pacific region from the Arabian Gulf to China, Taiwan Province of China, Papua New Guinea and northern Australia. Aquaculture of this species commenced in the 1970s in Thailand and rapidly spread throughout much of Southeast Asia. Today barramundi is farmed throughout most of its range, with most production in Southeast Asia, generally from small coastal cage farms. Often these farms will culture a mixture of species, including barramundi, groupers (Family Serranidae, Subfamily Epinephelinae) and snappers (Family Lutjanidae). Australia is experiencing the development of large-scale barramundi farms that reflect the industrialized style of aquaculture seen in Europe. Where barramundi farming is undertaken outside the tropics, recirculation production systems are often used (e.g. in southern Australia and in the north-eastern United States of America). Barramundi has been introduced for aquaculture purposes to Iran, Guam, French Polynesia, the United States of America (Hawaii, Massachusetts) and Israel.'),
(3, 'Australian hybrid abalone', 'Haliotis laevigata x Haliotis rubra', 'https://aagai.com.au/abalone-farming/', 'Abalone are a coastal species adapted to living with strong currents and swells. They require especially high-quality water, rich in oxygen and very low in. Frequently, abalone are found in quite dense aggregations where they are at once protected from extreme wave action and where drift algae collect. This characteristic makes abalone especially vulnerable to overfishing, but also amenable to culture at relatively high densities. Globally, production of abalone is dominated by Chinese producers, nearing 300,000 tonnes annually, with other major producing countries including Republic of Korea, South Africa and Australian. Australian greenlip (Haliotis laevigata) and Australian hybrid (tiger) abalone, a cross between greenlip and blacklip (Haliotis rubra) are highly regarded on the world market. Greenlip are the main species farmed in Western Australia and South Australia. While farm production is dominated by tigers in the cooler waters of Victoria and Tasmania. The first attempts to commercially breed abalone in Australia were conducted in Tasmania and South Australia in the late 1980''s. The lack of availability of quality seaweeds, the natural diet of abalone was a major constraint to growth and a major driver for research and development of formulated feeds funded by the FRDC, (Fisheries Research and Development Corporation). Formulated diets consist mostly of cereal grains and pulses, with very small additions of fish meal for essential fatty acids.'),
(4, 'Greenlip abalone', 'Haliotis laevigata', 'https://aagai.com.au/abalone-farming/', 'Abalone are a coastal species adapted to living with strong currents and swells. They require especially high-quality water, rich in oxygen and very low in. Frequently, abalone are found in quite dense aggregations where they are at once protected from extreme wave action and where drift algae collect. This characteristic makes abalone especially vulnerable to overfishing, but also amenable to culture at relatively high densities. Globally, production of abalone is dominated by Chinese producers, nearing 300,000 tonnes annually, with other major producing countries including Republic of Korea, South Africa and Australian. Australian greenlip (Haliotis laevigata) and Australian hybrid (tiger) abalone, a cross between greenlip and blacklip (Haliotis rubra) are highly regarded on the world market. Greenlip are the main species farmed in Western Australia and South Australia. While farm production is dominated by tigers in the cooler waters of Victoria and Tasmania. The first attempts to commercially breed abalone in Australia were conducted in Tasmania and South Australia in the late 1980''s. The lack of availability of quality seaweeds, the natural diet of abalone was a major constraint to growth and a major driver for research and development of formulated feeds funded by the FRDC, (Fisheries Research and Development Corporation). Formulated diets consist mostly of cereal grains and pulses, with very small additions of fish meal for essential fatty acids.'),
(5, 'Whiteleg shrimp', 'Penaeus vannamei', 'https://www.fao.org/fishery/docs/DOCUMENT/aquaculture/CulturedSpecies/file/en/en_whitelegshrimp.htm', 'The first spawning of this species was achieved in Florida in 1973 from nauplii spawned and shipped from a wild-caught mated female from Panama. Following good pond results and the discovery of unilateral ablation (and adequate nutrition) to promote maturation in Panama in 1976, commercial culture of Penaeus vannamei began in South and Central America. Subsequent development of intensive breeding and rearing techniques led to its culture in Hawaii, mainland United States of America, and much of Central and South America by the early 1980s. From this time, the commercial culture of this species in Latin America showed a rapidly increasing trend (with peaks every 3–4 years during the warm, wet ''el niño'' years), punctuated by declines co-incident with disease outbreaks during the cold ''la niña'' years. Despite these problems, production of P. vannamei from the Americas has been increasing – after declining from its earlier peak production of 193 000 tonnes in 1998 to 143 000 tonnes in 2000 it had grown to over 270 000 tonnes by 2004. Asia has seen a phenomenal increase in the production of P. vannamei. Although no production was reported to FAO in 1999, it was nearly 1 116 000 tonnes by 2004 and had overtaken the production of P. monodon in China, Taiwan Province of China and Thailand, due to a number of favourable factors.'),
(6, 'Black tiger shrimp', 'Penaeus monodon', 'https://www.fao.org/fishery/docs/CDrom/aquaculture/I1129m/file/en/en_gianttigerprawn.htm', 'Penaeus monodon was originally harvested together with other shrimp species from traditional trapping-growing ponds or as a significant by-product of extensive milkfish ponds. From 1970-1975, research on breeding was conducted and monoculture techniques in small ponds were gradually developed at the Tungkang Marine Laboratory in Taiwan Province of China and partly at the IFREMER (Centre Océanologique du Pacifique) in Tahiti in the South Pacific. In Thailand, extensive and semi-intensive farms were commercially established in 1972 and 1974 respectively, after the first success in breeding P. monodon at Phuket Fisheries Station in 1972. Between 1980 and 1987 there was a boom of small-scale intensive farms in Taiwan Province of China due to commercial success in formulated feed development, mainly to produce shrimp for export to Japan. However, it is believed that a viral disease outbreak caused the collapse of the industry in Taiwan Province of China in 1987-1988. This led Thailand, encouraged by extremely high prices in the Japanese market due to supply shortages, to replace Taiwan Province of China as the world''s leading producer of farm-raised P. monodon in 1988. Later, the culture of this species spread throughout southeast and south Asia, as it can grow-up to a large size (40-60 g) with high value and demand in the international market. The locally adapted culture technology has allowed Thai farmers to overcome serious disease, environmental and trade problems and maintain its status as a leading producer.'),
(7, 'Yellowtail kingfish', 'Seriola lalandi', 'https://asc-aqua.org/learn-about-seafood-farming/farmed-seriola-yellowtail/', 'In the wild, populations of Seriola species are free swimming pelagic fish, with a global distribution. Their habitats extend from rocky reef structures to sandy estuaries and estuarine systems. Japan is the world''s biggest producer of Seriola, accounting for around 90% of total production, but it is also farmed commercially in Australia, Europe and the U.S. This fish has become more popular as an aquaculture species over the last decade and is now farmed both at sea in cages, and in recirculating aquaculture systems (RAS) on land. The two most commonly farmed species are Seriola lalandi and Seriola quinqueradiata. Seriola are known by a number of different names, including yellowtail, amberjack, kingfish, hamachi, kampachi and hiramasa. In Japan, this fish is known by more than 20 different names, the most famous being Buri.');

-- Insert weight categories
INSERT INTO weight_category (id, category_name) VALUES
(1, 'Nursery (<350 g)'),
(2, 'Grower (350-1000 g)'),
(3, 'Large (1000+ g)'),
(4, 'Nursery (0-5 g)'),
(5, 'Grower (5-15 g)'),
(6, 'Large (15-30+ g)');

-- Insert diet specifications
INSERT INTO diet_specification (species_id, weight_cat_id, protein_min, protein_max, lipid_min, lipid_max, gross_energy_min, gross_energy_max, phosphorus_min, phosphorus_max, lcPUFA_min, lcPUFA_max) VALUES
-- Atlantic salmon
(1, 1, 46.00, 52.00, 20.00, 24.00, 20.00, 23.00, 1.00, 2.00, 2.00, 4.00),  -- Nursery (<350 g)
(1, 2, 40.00, 46.00, 24.00, 30.00, 23.00, 26.00, 1.00, 2.00, 1.00, 3.00),  -- Grower (350-1000 g)
(1, 3, 36.00, 42.00, 30.00, 38.00, 24.00, 28.00, 0.50, 1.50, 0.00, 2.00), -- Large (1000+ g)
-- Barramundi
(2, 1, 50.00, 55.00, 10.00, 15.00, 18.00, 19.00, 1.00, 0.00, 0.00, 0.00), -- Nursery (<350 g)
(2, 2, 45.00, 50.00, 15.00, 20.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00), -- Grower (350-1000 g)
(2, 3, 40.00, 45.00, 20.00, 25.00, 20.00, 22.00, 0.80, 0.00, 0.00, 0.00), -- Large (1000+ g)
-- Australian hybrid abalone
(3, 4, 35.00, 42.00, 4.00, 8.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00), -- Nursery (0-5 g)
(3, 5, 35.00, 42.00, 4.00, 8.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00), -- Grower (5-15 g)
(3, 6, 35.00, 42.00, 4.00, 8.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00), -- Large (15-30+ g)
-- Greenlip abalone
(4, 4, 30.00, 36.00, 4.00, 8.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00), -- Nursery (0-5 g)
(4, 5, 30.00, 36.00, 4.00, 8.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00), -- Grower (5-15 g)
(4, 6, 30.00, 36.00, 4.00, 8.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00), -- Large (15-30+ g)
-- Whiteleg shrimp
(5, 4, 35.00, 40.00, 6.00, 8.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00), -- Nursery (0-5 g)
(5, 5, 33.00, 38.00, 6.00, 8.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00), -- Grower (5-15 g)
(5, 6, 30.00, 35.00, 6.00, 8.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00), -- Large (15-30+ g)
-- Black tiger shrimp
(6, 4, 45.00, 50.00, 6.00, 8.00, 0.00, 0.00, 0.00, 0.00, 1.80, 1.80), -- Nursery (0-5 g)
(6, 5, 40.00, 45.00, 6.00, 8.00, 0.00, 0.00, 0.00, 0.00, 1.80, 1.80), -- Grower (5-15 g)
(6, 6, 40.00, 45.00, 6.00, 8.00, 0.00, 0.00, 0.00, 0.00, 1.80, 1.80), -- Large (15-30+ g)
-- Yellowtail kingfish
(7, 1, 45.00, 50.00, 10.00, 20.00, 0.00, 0.00, 0.00, 0.00, 1.80, 1.80), -- Nursery (<350 g)
(7, 2, 40.00, 45.00, 15.00, 25.00, 0.00, 0.00, 0.00, 0.00, 1.80, 1.80), -- Grower (350-1000 g)
(7, 3, 40.00, 45.00, 20.00, 30.00, 0.00, 0.00, 0.00, 0.00, 1.80, 1.80); -- Large (1000+ g)

-- Insert ingredient specifications
INSERT INTO ingredient_specification (species_id, weight_cat_id, ingredients_id, min_value, max_value) VALUES
-- Species 1, Weight category 1
(1, 1, 1, 30.00, 50.00),  -- Fishmeal (anchovy)
(1, 1, 2, 0.00, 15.00),   -- Poultry meal
-- Blood meal
-- Dehulled lupins
(1, 1, 6, 10.00, 100.00), -- Wheat flour
-- Species 1, Weight category 2
(1, 2, 1, 15.00, 50.00),  -- Fishmeal (anchovy)
(1, 2, 2, 0.00, 15.00),   -- Poultry meal
-- Blood meal
-- Dehulled lupins
(1, 2, 6, 10.00, 100.00), -- Wheat flour
-- Species 1, Weight category 3
(1, 3, 1, 5.00, 50.00),   -- Fishmeal (anchovy)
(1, 3, 2, 0.00, 15.00),   -- Poultry meal
-- Blood meal
-- Dehulled lupins
(1, 3, 6, 15.00, 100.00), -- Wheat flour
-- Species 2, Weight category 1
(2, 1, 1, 15.00, 30.00),  -- Fishmeal (anchovy)
-- Blood meal
-- Dehulled lupins
(2, 1, 4, 4.00, 0.00),   -- Fish oil (Menhaden)
-- Fish oil (Anchovy)
-- Fish oil (Mackerel)
-- Species 2, Weight category 2
(2, 2, 1, 10.00, 20.00),  -- Fishmeal (anchovy)
-- Blood meal
-- Dehulled lupins
(2, 2, 4, 2.00, 4.00),   -- Fish oil (Menhaden)
-- Fish oil (Anchovy)
-- Fish oil (Mackerel)
-- Species 2, Weight category 3
(2, 3, 1, 5.00, 10.00),   -- Fishmeal (anchovy)
-- Blood meal
-- Dehulled lupins
(2, 3, 4, 1.00, 2.00),   -- Fish oil (Menhaden)
-- Fish oil (Anchovy)
-- Fish oil (Mackerel)
-- Species 3, Weight category 4
(3, 4, 1, 0.00, 10.00),   -- Fishmeal (anchovy)
-- Species 3, Weight category 5
(3, 5, 1, 0.00, 10.00),   -- Fishmeal (anchovy)
-- Species 3, Weight category 6
(3, 6, 1, 0.00, 10.00),   -- Fishmeal (anchovy)
-- Species 4, Weight category 4
(4, 4, 1, 0.00, 10.00),   -- Fishmeal (anchovy)
-- Species 4, Weight category 5
(4, 5, 1, 0.00, 10.00),   -- Fishmeal (anchovy)
-- Species 4, Weight category 6
(4, 6, 1, 0.00, 10.00),   -- Fishmeal (anchovy)
-- Species 5, Weight category 4 - NONE
-- Species 5, Weight category 5 - NONE
-- Species 5, Weight category 6 - NONE
-- Species 6, Weight category 4 - NONE
-- Species 6, Weight category 5 - NONE
-- Species 6, Weight category 6 - NONE
-- Species 7, Weight category 1
(7, 1, 1, 0.00, 50.00),   -- Fishmeal (anchovy)
-- Species 7, Weight category 2
(7, 2, 1, 0.00, 50.00),   -- Fishmeal (anchovy)
-- Species 7, Weight category 3
(7, 3, 1, 0.00, 50.00);   -- Fishmeal (anchovy)

-- Insert feeds
INSERT INTO feeds (name, feed_description, species_id, weight_cat_id, created_at, clerk_id) VALUES
('Sample Feed (Admin)', 'Sample feed for admin user', 1, 1, '2023-08-01', 'user_2wWWVIGmZfSrtUlVtem5wBCJEd3'), 
('Sample Feed (Member)', 'Sample feed for member user', 2, 1, '2024-08-17', 'user_2whp9wRR5Xg3pbkJus1h7yWjK8i');

-- Inserting Values into feed_ingredient_association Table
INSERT INTO feed_ingredient_association (feed_id, ingredient_id, percentage) VALUES
-- Associations for Test Feed (Admin)
(1, 2, 10.00),
(1, 3, 15.00),
(1, 5, 20.00),
(1, 6, 55.00),
-- Associations for Test Feed (Member)
(2, 1, 10.00),
(2, 2, 20.00),
(2, 3, 35.00),
(2, 5, 10.00),
(2, 6, 25.00);


INSERT INTO logs (clerk_id, category, description, ip_address)
VALUES 
('user_2wWWVIGmZfSrtUlVtem5wBCJEd3', 'ingredient', 'Added new ingredient: Wheat gluten.', '192.168.1.10'),
('user_2whp9wRR5Xg3pbkJus1h7yWjK8i', 'feed', 'Created feed: Sample Feed (Member).', '203.0.113.42'),
('user_2wWWVIGmZfSrtUlVtem5wBCJEd3', 'user', 'Deleted user user_2uc6RgooYCVZrTcFIsdfhksdfkw.', '198.51.100.15'),
('user_2whp9wRR5Xg3pbkJus1h7yWjK8i', 'ingredient', 'Deleted ingredient: Soybean Meal.', '172.16.0.5'),
('user_2x1NVW5BNDlAamqnBMLmdOPb6xe', 'user', 'User logged in', '10.0.0.25');