/**
 * Wolf's Lair Family Platform - Complete Database Export
 * Exports all data from your database to SQL format for local installation
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

async function exportTable(tableName: string, data: any[]): Promise<string> {
    if (data.length === 0) {
        return `-- No data found in ${tableName}\n\n`;
    }

    console.log(`Exporting ${tableName}: ${data.length} records`);
    
    const columns = Object.keys(data[0]);
    let sql = `-- ${tableName.toUpperCase()} DATA (${data.length} records)\n`;
    
    // Write INSERT statements in batches of 100
    const batchSize = 100;
    for (let i = 0; i < data.length; i += batchSize) {
        const batch = data.slice(i, i + batchSize);
        
        sql += `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES\n`;
        
        batch.forEach((row, index) => {
            const values = columns.map(col => escapeSqlValue(row[col]));
            const valuesStr = `(${values.join(', ')})`;
            
            if (index === batch.length - 1) {
                sql += `${valuesStr};\n`;
            } else {
                sql += `${valuesStr},\n`;
            }
        });
        
        sql += '\n';
    }
    
    // Update sequence
    sql += `SELECT setval('${tableName}_id_seq', (SELECT MAX(id) FROM ${tableName}));\n\n`;
    
    return sql;
}

async function main() {
    try {
        console.log('Starting complete database export...');
        
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
        
        // Generate SQL dump
        let sqlDump = `-- Wolf's Lair Family Platform - Complete Database Export
-- Generated on: ${new Date().toISOString()}
-- This file contains ALL data from your production database

-- Begin transaction
BEGIN;

`;
        
        // Export each table
        sqlDump += await exportTable('family_members', familyMembersData);
        sqlDump += await exportTable('posts', postsData);
        sqlDump += await exportTable('blocks', blocksData);
        sqlDump += await exportTable('users', usersData);
        sqlDump += await exportTable('airports', airportsData);
        sqlDump += await exportTable('flights', flightsData);
        
        sqlDump += `-- Commit transaction
COMMIT;

-- IMPORT INSTRUCTIONS FOR ULTRAMARINE LINUX:
-- 1. Follow INSTALLATION_GUIDE.md to set up PostgreSQL
-- 2. Create database and user as instructed
-- 3. Run: npm run db:push (to create empty tables)
-- 4. Import data: psql -U wolfslair_user -d wolfslair_family -h localhost -f complete_database_dump.sql
-- 5. Start application: npm run dev
`;
        
        // Write to file
        const outputFile = 'complete_database_dump.sql';
        fs.writeFileSync(outputFile, sqlDump, 'utf8');
        
        // Generate summary
        const totalRecords = familyMembersData.length + postsData.length + flightsData.length + 
                           airportsData.length + blocksData.length + usersData.length;
        
        console.log('\n' + '='.repeat(60));
        console.log('DATABASE EXPORT COMPLETE');
        console.log('='.repeat(60));
        console.log(`Output file: ${outputFile}`);
        console.log('\nData Summary:');
        console.log(`  family_members: ${familyMembersData.length.toLocaleString()} records`);
        console.log(`  posts: ${postsData.length.toLocaleString()} records`);
        console.log(`  flights: ${flightsData.length.toLocaleString()} records`);
        console.log(`  airports: ${airportsData.length.toLocaleString()} records`);
        console.log(`  blocks: ${blocksData.length.toLocaleString()} records`);
        console.log(`  users: ${usersData.length.toLocaleString()} records`);
        console.log(`\nTotal records: ${totalRecords.toLocaleString()}`);
        
        const stats = fs.statSync(outputFile);
        console.log(`File size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
        
        console.log('\nExport successful! Use complete_database_dump.sql for your local setup.');
        
    } catch (error) {
        console.error('Export failed:', error);
        process.exit(1);
    }
}

main();