#!/usr/bin/env node
/**
 * Wolf's Lair Family Platform - Complete Database Export
 * Exports all data from your database to SQL format for local installation
 */

import { pool } from './server/db.js';
import fs from 'fs';
import path from 'path';

function escapeSqlString(value) {
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

async function exportTableData(tableName) {
    console.log(`Exporting ${tableName}...`);
    
    try {
        // Get column information
        const columnsResult = await pool.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = $1 
            ORDER BY ordinal_position
        `, [tableName]);
        
        const columns = columnsResult.rows.map(row => row.column_name);
        
        // Get all data
        const dataResult = await pool.query(`SELECT * FROM ${tableName} ORDER BY id`);
        const rows = dataResult.rows;
        
        if (rows.length === 0) {
            return `-- No data found in ${tableName}\n\n`;
        }
        
        let sql = `-- ${tableName.toUpperCase()} DATA (${rows.length} records)\n`;
        
        // Write INSERT statements in batches of 50
        const batchSize = 50;
        for (let i = 0; i < rows.length; i += batchSize) {
            const batch = rows.slice(i, i + batchSize);
            
            sql += `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES\n`;
            
            batch.forEach((row, index) => {
                const values = columns.map(col => escapeSqlString(row[col]));
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
        
        console.log(`✓ Exported ${rows.length} records from ${tableName}`);
        return sql;
        
    } catch (error) {
        console.error(`Error exporting ${tableName}:`, error.message);
        return `-- Error exporting ${tableName}: ${error.message}\n\n`;
    }
}

async function main() {
    try {
        console.log('Starting complete database export...');
        
        // Get all tables
        const tablesResult = await pool.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_type = 'BASE TABLE'
            ORDER BY table_name
        `);
        
        const tables = tablesResult.rows.map(row => row.table_name);
        console.log(`Found ${tables.length} tables: ${tables.join(', ')}`);
        
        // Generate SQL dump
        let sqlDump = `-- Wolf's Lair Family Platform - Complete Database Export
-- Generated on: ${new Date().toISOString()}
-- This file contains ALL data from your production database
-- Total tables: ${tables.length}

-- Begin transaction
BEGIN;

`;
        
        // Export each table
        for (const table of tables) {
            const tableData = await exportTableData(table);
            sqlDump += tableData;
        }
        
        sqlDump += `-- Commit transaction
COMMIT;

-- IMPORT INSTRUCTIONS:
-- 1. Create your local database and user as per INSTALLATION_GUIDE.md
-- 2. Run: npm run db:push (to create tables)
-- 3. Import data: psql -U wolfslair_user -d wolfslair_family -h localhost -f complete_database_dump.sql
`;
        
        // Write to file
        const outputFile = 'complete_database_dump.sql';
        fs.writeFileSync(outputFile, sqlDump, 'utf8');
        
        // Generate summary
        const summaryQueries = [
            "SELECT 'family_members' as table_name, COUNT(*) as count FROM family_members",
            "SELECT 'posts' as table_name, COUNT(*) as count FROM posts",
            "SELECT 'flights' as table_name, COUNT(*) as count FROM flights",
            "SELECT 'airports' as table_name, COUNT(*) as count FROM airports",
            "SELECT 'blocks' as table_name, COUNT(*) as count FROM blocks",
            "SELECT 'users' as table_name, COUNT(*) as count FROM users"
        ];
        
        console.log('\n' + '='.repeat(50));
        console.log('DATABASE EXPORT COMPLETE');
        console.log('='.repeat(50));
        console.log(`Output file: ${outputFile}`);
        console.log('\nData Summary:');
        
        let totalRecords = 0;
        for (const query of summaryQueries) {
            try {
                const result = await pool.query(query);
                const { table_name, count } = result.rows[0];
                console.log(`  ${table_name}: ${parseInt(count).toLocaleString()} records`);
                totalRecords += parseInt(count);
            } catch (error) {
                console.log(`  Error querying ${query}: ${error.message}`);
            }
        }
        
        console.log(`\nTotal records: ${totalRecords.toLocaleString()}`);
        
        const stats = fs.statSync(outputFile);
        console.log(`File size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
        
        console.log('\n✅ Export successful! Use complete_database_dump.sql for your local setup.');
        
    } catch (error) {
        console.error('❌ Export failed:', error);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

main();