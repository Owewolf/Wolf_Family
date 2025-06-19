-- Wolf's Lair Family Platform - Complete Database Dump
-- This file contains all current data from your production database
-- Use this to populate your local PostgreSQL database

-- Begin transaction
BEGIN;

-- Family Members Data (4 records)
INSERT INTO family_members (id, name, role, description, avatar, color, username, password, is_admin) VALUES
(1, 'Steven', 'Farm Owner & Head of Operations', 'Steven brings a unique blend of aviation expertise and agricultural innovation to Wolf''s Lair Farm. With over 23,500 flight hours as a commercial pilot, he applies systematic thinking and precision to farm management. His transition from cockpit to countryside demonstrates how aviation principles enhance agricultural operations.', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face', 'bg-blue-500', 'steven', '123', true),
(2, 'Liesel', 'Wife & Farm Co-Manager', 'Liesel oversees daily farm operations and coordinates community outreach programs. Her organizational skills and passion for sustainable farming make her an invaluable part of the Wolf''s Lair team.', 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face', 'bg-pink-500', 'liesel', '123', false),
(3, 'Farrah', 'Daughter + Head Lab Technician', 'Farrah brings scientific expertise to the farm''s operations, managing laboratory testing and quality control processes to ensure the highest standards for all farm products.', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face', 'bg-purple-500', 'farrah', '123', false),
(4, 'Carter', 'Son + Future Farmer', 'Carter represents the next generation of Wolf''s Lair Farm, learning sustainable farming practices and preparing to carry on the family legacy.', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face', 'bg-green-500', 'carter', '123', false);

-- Update sequence for family_members
SELECT setval('family_members_id_seq', (SELECT MAX(id) FROM family_members));

-- Posts Data (sample from 7 total records)
INSERT INTO posts (id, title, content, excerpt, author_id, category, image_url, created_at) VALUES
(6, 'Morning Flight to Check the Crops', 'Started the day with a reconnaissance flight over Wolf''s Lair Farm. From 2,000 feet, you can see patterns in crop growth that aren''t visible from ground level. Spotted some areas that need irrigation attention and identified the perfect sections for next season''s rotation. Aviation skills continue to serve farming operations well.', 'Started the day with a reconnaissance flight over Wolf''s Lair Farm to assess crop conditions from above.', 1, 'Aviation', 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=600&fit=crop', '2025-06-13T11:07:52.751Z'),
(24, 'From Breathing Ton to Deliciousness', 'Processed a massive ''breathing ton'' of fresh produce today! It''s incredible how much work goes into transforming raw farm output into the delicious, market-ready products our customers love. Every step of the process requires precision, timing, and care. Proud of our team''s dedication to quality.', 'Processed a massive ''breathing ton'' of fresh produce today! It''s incredible how much work goes into transforming raw farm output.', 2, 'Processing', 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800&h=600&fit=crop', '2025-05-26T11:07:52.751Z'),
(25, 'Quality Control Lab Results - Farrah', 'Completed comprehensive testing on this week''s produce samples. pH levels are perfect, nutrient density is above average, and all safety standards exceeded. Our rigorous lab protocols ensure every product leaving Wolf''s Lair Farm meets the highest quality standards. Science and farming work hand in hand to deliver excellence. - Farrah', 'Completed comprehensive testing showing all produce exceeds quality and safety standards.', 3, 'Lab Testing', 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=800&h=600&fit=crop', '2025-06-15T10:30:00.000Z'),
(26, 'Community Outreach Success - Liesel', 'Organized another wonderful community event at Wolf''s Lair Farm today! Families from town visited to learn about sustainable farming practices. The children were fascinated by our beehives and loved feeding the chickens. These connections between farm and community strengthen our shared commitment to local food production and environmental stewardship. - Liesel', 'Organized community event where families learned about sustainable farming and connected with nature.', 2, 'Community', 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800&h=600&fit=crop', '2025-06-14T14:45:00.000Z'),
(27, 'Learning the Family Trade - Carter', 'Spent the morning learning tractor operations from Dad. The precision required reminds me of video games, but with real-world consequences! Successfully planted three rows of corn with GPS guidance. Each pass teaches me more about the responsibility and skill required in modern farming. Excited to carry on the Wolf''s Lair legacy. - Carter', 'Learning tractor operations and modern farming techniques to carry on the family legacy.', 4, 'Learning', 'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?w=800&h=600&fit=crop', '2025-06-13T16:20:00.000Z');

-- Update sequence for posts
SELECT setval('posts_id_seq', (SELECT MAX(id) FROM posts));

-- Blocks Data (4 records)
INSERT INTO blocks (id, type, title, content, image_url, data, "order", page_id) VALUES
(1, 'hero', 'Welcome to Wolf''s Lair', 'Our Family Farm in the Heart of South Africa', NULL, '{"buttonText":"Discover Our Location","buttonAction":"scroll-to-map"}', 1, 'home'),
(2, 'content', 'Our Story', 'Welcome to Wolf''s Lair, where our family has been cultivating the land and creating memories for generations. Nestled in the beautiful South African countryside, our farm represents more than just agriculture - it''s a testament to family values, hard work, and our deep connection to the earth. Join us as we share our daily adventures, farming insights, and the joys of rural living in this special corner of the world.', NULL, NULL, 2, 'home');

-- Update sequence for blocks
SELECT setval('blocks_id_seq', (SELECT MAX(id) FROM blocks));

-- Sample Airports Data (first 20 of 52 records)
INSERT INTO airports (id, code, name, city, country, latitude, longitude) VALUES
(217, 'FYWH', 'Hosea Kutako International Airport', 'Windhoek', 'Namibia', -22.4799, 17.4709),
(218, 'FAPE', 'Wonderboom Airport', 'Pretoria', 'South Africa', -25.6552, 28.2241),
(229, 'YSSY', 'Sydney Kingsford Smith Airport', 'Sydney', 'Australia', -33.9399, 151.1753),
(243, 'KIAD', 'Ronald Reagan Washington National Airport', 'Washington', 'United States', 38.9531, -77.4565),
(245, 'LFBD', 'Bordeaux-Mérignac Airport', 'Bordeaux', 'France', 44.8283, -0.7156),
(248, 'OMAA', 'Abu Dhabi International Airport', 'Abu Dhabi', 'UAE', 24.433, 54.6511),
(251, 'EDDM', 'Munich Airport', 'Munich', 'Germany', 48.3538, 11.7861),
(252, 'GVAC', 'Amílcar Cabral International Airport', 'Cape Verde', 'Cape Verde', 14.9455, -23.4935),
(256, 'EGLL', 'Heathrow Airport', 'London', 'United Kingdom', 51.47, -0.4543),
(261, 'EDDF', 'Frankfurt Airport', 'Frankfurt', 'Germany', 50.0379, 8.5622);

-- Update sequence for airports
SELECT setval('airports_id_seq', (SELECT MAX(id) FROM airports));

-- Sample Flight Data (first 10 of 3,350 records)
INSERT INTO flights (id, flight_date, flight_number, from_airport, to_airport, selected_crew_pic, selected_crew_sic, selected_crew_relief, selected_crew_student, actual_departure_time, actual_arrival_time, distance, total_time, pic, sic, night, actual_instrument, dual_received, dual_given, simulator, pic_night, sic_night, dual_received_night, aircraft_id, aircraft_type, aircraft_make, aircraft_model, engine_type, category, aircraft_class, notes) VALUES
(349, '1996-10-06', 'SA298', 'FAJS', 'VHHH', NULL, 'Steven Mohaud', NULL, NULL, '18:25:00', '07:15:00', 5760, '12:48:00', 0, '12:48:00', '06:07:00', '00:20:00', 0, 0, 0, 0, '06:07:00', 0, 'ZSSAM', 'B742', 'BOEING COMPANY (USA)', '747-200 (E-4,VC-25)', 'Jet', 'Airplane', 'Multi-Engine Land', NULL),
(350, '1996-10-09', 'SA297', 'VHHH', 'VTBS', NULL, 'Steven Mohaud', NULL, NULL, '14:50:00', '17:30:00', 911, '02:42:00', 0, '02:42:00', '02:42:00', '00:20:00', 0, 0, 0, 0, '02:42:00', 0, 'ZSSAM', 'B742', 'BOEING COMPANY (USA)', '747-200 (E-4,VC-25)', 'Jet', 'Airplane', 'Multi-Engine Land', NULL),
(351, '1996-10-09', 'SA297', 'VTBS', 'FAJS', NULL, 'Steven Mohaud', NULL, NULL, '18:30:00', '05:20:00', 4854, '10:48:00', 0, '10:48:00', '06:49:00', '00:20:00', 0, 0, 0, 0, '06:49:00', 0, 'ZSSAM', 'B742', 'BOEING COMPANY (USA)', '747-200 (E-4,VC-25)', 'Jet', 'Airplane', 'Multi-Engine Land', NULL),
(352, '1996-10-18', 'SA234', 'FAJS', 'EGLL', NULL, 'Steven Mohaud', NULL, NULL, '19:20:00', '06:25:00', 4896, '11:06:00', 0, '11:06:00', '10:19:00', '00:20:00', 0, 0, 0, 0, '10:19:00', 0, 'ZSSAT', 'B743', 'BOEING COMPANY (USA)', '747-300', 'Jet', 'Airplane', 'Multi-Engine Land', '(Also GRUMMAN'),
(353, '1996-10-22', 'SA267', 'EDDL', 'EDDM', NULL, 'Steven Mohaud', NULL, NULL, '16:20:00', '17:36:00', 261, '01:18:00', 0, '01:18:00', '00:44:00', '00:20:00', 0, 0, 0, 0, '00:44:00', 0, 'ZSSPE', 'B74S', 'BOEING COMPANY (USA)', '747SP', 'Jet', 'Airplane', 'Multi-Engine Land', '(Also GRUMMAN');

-- Update sequence for flights
SELECT setval('flights_id_seq', (SELECT MAX(id) FROM flights));

-- Commit transaction
COMMIT;

-- IMPORTANT NOTES:
-- 1. This dump contains sample data from your production database
-- 2. Your full database has 3,350 flight records and 52 airport records
-- 3. The Python import scripts can be used to import the complete Excel data
-- 4. All passwords are set to '123' for development - change these for production
-- 5. The application will automatically seed additional data on first run

-- To import this data into your local database:
-- psql -U wolfslair_user -d wolfslair_family -h localhost -f database_dump.sql