/**
 * Wolf's Lair Family Platform - Fixed Database Export
 * Exports all data with correct column names matching the actual database schema
 */

import { db } from './server/db.js';
import { familyMembers, posts, flights, airports, blocks, users } from './shared/schema.js';
import fs from 'fs';

function escapeSqlValue(value: any): string {
    if (value === null || value === undefined) {
        return 'NULL';
    }
    if (typeof value === 'boolean') {
        return value ? 'true' : 'false';
    }
    if (typeof value === 'number') {
        return value.toString();
    }
    if (value instanceof Date) {
        return `'${value.toISOString()}'`;
    }
    if (typeof value === 'object') {
        return `'${JSON.stringify(value).replace(/'/g, "''")}'`;
    }
    return `'${value.toString().replace(/'/g, "''")}'`;
}

async function main() {
    try {
        console.log('Generating corrected database dump...');
        
        // Fetch all data
        const [
            familyMembersData,
            postsData,
            flightsData,
            airportsData,
            blocksData,
            usersData
        ] = await Promise.all([
            db.select().from(familyMembers),
            db.select().from(posts),
            db.select().from(flights),
            db.select().from(airports),
            db.select().from(blocks),
            db.select().from(users)
        ]);
        
        // Generate SQL dump with correct column names
        let sqlDump = `-- Wolf's Lair Family Platform - Complete Database Export (Fixed Schema)
-- Generated on: ${new Date().toISOString()}
-- This file contains ALL data with correct column names matching your database schema

-- Begin transaction
BEGIN;

-- FAMILY_MEMBERS DATA (${familyMembersData.length} records)
INSERT INTO family_members (id, name, role, description, avatar, color, username, password, is_admin) VALUES
`;

        // Family Members - with correct column names
        familyMembersData.forEach((member, index) => {
            const values = [
                member.id,
                escapeSqlValue(member.name),
                escapeSqlValue(member.role),
                escapeSqlValue(member.description),
                escapeSqlValue(member.avatar),
                escapeSqlValue(member.color),
                escapeSqlValue(member.username),
                escapeSqlValue(member.password),
                member.isAdmin ? 'true' : 'false'
            ];
            const isLast = index === familyMembersData.length - 1;
            sqlDump += `(${values.join(', ')})${isLast ? ';\n\n' : ',\n'}`;
        });

        sqlDump += `SELECT setval('family_members_id_seq', (SELECT MAX(id) FROM family_members));

-- POSTS DATA (${postsData.length} records)
INSERT INTO posts (id, title, content, excerpt, author_id, category, image_url, created_at) VALUES
`;

        // Posts - with correct column names
        postsData.forEach((post, index) => {
            const values = [
                post.id,
                escapeSqlValue(post.title),
                escapeSqlValue(post.content),
                escapeSqlValue(post.excerpt),
                post.authorId,
                escapeSqlValue(post.category),
                escapeSqlValue(post.imageUrl),
                escapeSqlValue(post.createdAt)
            ];
            const isLast = index === postsData.length - 1;
            sqlDump += `(${values.join(', ')})${isLast ? ';\n\n' : ',\n'}`;
        });

        sqlDump += `SELECT setval('posts_id_seq', (SELECT MAX(id) FROM posts));

-- BLOCKS DATA (${blocksData.length} records)
INSERT INTO blocks (id, type, title, content, image_url, data, "order", page_id) VALUES
`;

        // Blocks - with correct column names
        blocksData.forEach((block, index) => {
            const values = [
                block.id,
                escapeSqlValue(block.type),
                escapeSqlValue(block.title),
                escapeSqlValue(block.content),
                escapeSqlValue(block.imageUrl),
                escapeSqlValue(block.data),
                block.order,
                escapeSqlValue(block.pageId)
            ];
            const isLast = index === blocksData.length - 1;
            sqlDump += `(${values.join(', ')})${isLast ? ';\n\n' : ',\n'}`;
        });

        sqlDump += `SELECT setval('blocks_id_seq', (SELECT MAX(id) FROM blocks));

-- AIRPORTS DATA (${airportsData.length} records)
INSERT INTO airports (id, code, name, city, country, latitude, longitude) VALUES
`;

        // Airports - batch insert for better performance
        const airportBatches = [];
        for (let i = 0; i < airportsData.length; i += 50) {
            airportBatches.push(airportsData.slice(i, i + 50));
        }

        airportBatches.forEach((batch, batchIndex) => {
            batch.forEach((airport, index) => {
                const values = [
                    airport.id,
                    escapeSqlValue(airport.code),
                    escapeSqlValue(airport.name),
                    escapeSqlValue(airport.city),
                    escapeSqlValue(airport.country),
                    airport.latitude || 'NULL',
                    airport.longitude || 'NULL'
                ];
                const isLastInBatch = index === batch.length - 1;
                const isLastBatch = batchIndex === airportBatches.length - 1;
                
                if (isLastInBatch) {
                    sqlDump += `(${values.join(', ')})${isLastBatch ? ';\n\n' : ';\n\nINSERT INTO airports (id, code, name, city, country, latitude, longitude) VALUES\n'}`;
                } else {
                    sqlDump += `(${values.join(', ')}),\n`;
                }
            });
        });

        sqlDump += `SELECT setval('airports_id_seq', (SELECT MAX(id) FROM airports));

-- FLIGHTS DATA (${flightsData.length} records)
-- Processing in batches for performance
`;

        // Flights - batch insert for large dataset
        const flightBatches = [];
        for (let i = 0; i < flightsData.length; i += 100) {
            flightBatches.push(flightsData.slice(i, i + 100));
        }

        flightBatches.forEach((batch, batchIndex) => {
            sqlDump += `INSERT INTO flights (id, flight_date, flight_number, from_airport, to_airport, selected_crew_pic, selected_crew_sic, selected_crew_relief, selected_crew_student, actual_departure_time, actual_arrival_time, distance, total_time, pic, sic, night, actual_instrument, dual_received, dual_given, simulator, pic_night, sic_night, dual_received_night, aircraft_id, aircraft_type, aircraft_make, aircraft_model, engine_type, category, aircraft_class, notes) VALUES\n`;
            
            batch.forEach((flight, index) => {
                const values = [
                    flight.id,
                    escapeSqlValue(flight.flightDate),
                    escapeSqlValue(flight.flightNumber),
                    escapeSqlValue(flight.from),
                    escapeSqlValue(flight.to),
                    escapeSqlValue(flight.selectedCrewPIC),
                    escapeSqlValue(flight.selectedCrewSIC),
                    escapeSqlValue(flight.selectedCrewRelief),
                    escapeSqlValue(flight.selectedCrewStudent),
                    escapeSqlValue(flight.actualDepartureTime),
                    escapeSqlValue(flight.actualArrivalTime),
                    flight.distance || 'NULL',
                    escapeSqlValue(flight.totalTime),
                    escapeSqlValue(flight.pic),
                    escapeSqlValue(flight.sic),
                    escapeSqlValue(flight.night),
                    escapeSqlValue(flight.actualInstrument),
                    flight.dualReceived || 'NULL',
                    flight.dualGiven || 'NULL',
                    escapeSqlValue(flight.simulator),
                    escapeSqlValue(flight.picNight),
                    escapeSqlValue(flight.sicNight),
                    flight.dualReceivedNight || 'NULL',
                    escapeSqlValue(flight.aircraftID),
                    escapeSqlValue(flight.aircraftType),
                    escapeSqlValue(flight.aircraftMake),
                    escapeSqlValue(flight.aircraftModel),
                    escapeSqlValue(flight.engineType),
                    escapeSqlValue(flight.category),
                    escapeSqlValue(flight.aircraftClass),
                    escapeSqlValue(flight.notes)
                ];
                const isLastInBatch = index === batch.length - 1;
                sqlDump += `(${values.join(', ')})${isLastInBatch ? ';\n\n' : ',\n'}`;
            });
        });

        sqlDump += `SELECT setval('flights_id_seq', (SELECT MAX(id) FROM flights));

-- USERS DATA (${usersData.length} records)
`;
        if (usersData.length > 0) {
            sqlDump += `INSERT INTO users (id, username, password) VALUES\n`;
            usersData.forEach((user, index) => {
                const values = [
                    user.id,
                    escapeSqlValue(user.username),
                    escapeSqlValue(user.password)
                ];
                const isLast = index === usersData.length - 1;
                sqlDump += `(${values.join(', ')})${isLast ? ';\n\n' : ',\n'}`;
            });
            sqlDump += `SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));\n\n`;
        } else {
            sqlDump += `-- No users data to import\n\n`;
        }

        sqlDump += `-- Commit transaction
COMMIT;

-- IMPORT INSTRUCTIONS FOR ULTRAMARINE LINUX:
-- 1. Follow INSTALLATION_GUIDE.md to set up PostgreSQL
-- 2. Create database and user: 
--    CREATE DATABASE wolfslair_family;
--    CREATE USER wolfslair_user WITH ENCRYPTED PASSWORD 'WolfsLair2025!';
--    GRANT ALL PRIVILEGES ON DATABASE wolfslair_family TO wolfslair_user;
-- 3. Run: npm run db:push (to create empty tables)
-- 4. Import data: psql -U wolfslair_user -d wolfslair_family -h localhost -f complete_database_dump_fixed.sql
-- 5. Start application: npm run dev
`;
        
        // Write to file
        const outputFile = 'complete_database_dump_fixed.sql';
        fs.writeFileSync(outputFile, sqlDump, 'utf8');
        
        // Generate summary
        const totalRecords = familyMembersData.length + postsData.length + flightsData.length + 
                           airportsData.length + blocksData.length + usersData.length;
        
        console.log('Database export completed successfully');
        console.log(`Output file: ${outputFile}`);
        console.log('\nData Summary:');
        console.log(`  family_members: ${familyMembersData.length} records`);
        console.log(`  posts: ${postsData.length} records`);
        console.log(`  flights: ${flightsData.length.toLocaleString()} records`);
        console.log(`  airports: ${airportsData.length} records`);
        console.log(`  blocks: ${blocksData.length} records`);
        console.log(`  users: ${usersData.length} records`);
        console.log(`\nTotal records: ${totalRecords.toLocaleString()}`);
        
        const stats = fs.statSync(outputFile);
        console.log(`File size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
        
    } catch (error) {
        console.error('Export failed:', error);
        process.exit(1);
    }
}

main();