#!/usr/bin/env python3
"""
Wolf's Lair Family Platform - Complete Database Export Script
This script exports ALL data from your current database to SQL format
for easy import on your local machine.
"""

import os
import psycopg2
import json
from datetime import datetime

def get_db_connection():
    """Get database connection using environment variables"""
    database_url = os.environ.get('DATABASE_URL')
    if not database_url:
        raise Exception("DATABASE_URL environment variable not set")
    
    return psycopg2.connect(database_url)

def escape_sql_string(value):
    """Safely escape SQL string values"""
    if value is None:
        return 'NULL'
    if isinstance(value, str):
        return "'" + value.replace("'", "''") + "'"
    if isinstance(value, bool):
        return 'true' if value else 'false'
    if isinstance(value, (int, float)):
        return str(value)
    if isinstance(value, datetime):
        return "'" + value.isoformat() + "'"
    return "'" + str(value).replace("'", "''") + "'"

def export_table_data(cursor, table_name, file_handle):
    """Export all data from a table as INSERT statements"""
    print(f"Exporting {table_name}...")
    
    # Get table structure
    cursor.execute(f"""
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = '{table_name}' 
        ORDER BY ordinal_position
    """)
    columns = cursor.fetchall()
    column_names = [col[0] for col in columns]
    
    # Get all data
    cursor.execute(f"SELECT * FROM {table_name} ORDER BY id")
    rows = cursor.fetchall()
    
    if not rows:
        file_handle.write(f"-- No data found in {table_name}\n\n")
        return
    
    file_handle.write(f"-- {table_name.upper()} DATA ({len(rows)} records)\n")
    
    # Write INSERT statements in batches
    batch_size = 100
    for i in range(0, len(rows), batch_size):
        batch = rows[i:i + batch_size]
        
        file_handle.write(f"INSERT INTO {table_name} ({', '.join(column_names)}) VALUES\n")
        
        for j, row in enumerate(batch):
            values = [escape_sql_string(val) for val in row]
            values_str = "(" + ", ".join(values) + ")"
            
            if j == len(batch) - 1:  # Last row in batch
                file_handle.write(f"{values_str};\n")
            else:
                file_handle.write(f"{values_str},\n")
        
        file_handle.write("\n")
    
    # Update sequence
    file_handle.write(f"SELECT setval('{table_name}_id_seq', (SELECT MAX(id) FROM {table_name}));\n\n")
    
    print(f"✓ Exported {len(rows)} records from {table_name}")

def main():
    try:
        # Connect to database
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Get all tables
        cursor.execute("""
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_type = 'BASE TABLE'
            ORDER BY table_name
        """)
        tables = [row[0] for row in cursor.fetchall()]
        
        print(f"Found {len(tables)} tables: {', '.join(tables)}")
        
        # Create complete database dump
        output_file = "complete_database_dump.sql"
        
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write("-- Wolf's Lair Family Platform - Complete Database Export\n")
            f.write(f"-- Generated on: {datetime.now().isoformat()}\n")
            f.write("-- This file contains ALL data from your production database\n")
            f.write("-- Total tables: {}\n\n".format(len(tables)))
            
            f.write("-- Begin transaction\n")
            f.write("BEGIN;\n\n")
            
            # Export each table
            for table in tables:
                try:
                    export_table_data(cursor, table, f)
                except Exception as e:
                    print(f"Error exporting {table}: {e}")
                    f.write(f"-- Error exporting {table}: {e}\n\n")
            
            f.write("-- Commit transaction\n")
            f.write("COMMIT;\n\n")
            
            f.write("-- IMPORT INSTRUCTIONS:\n")
            f.write("-- 1. Create your local database and user\n")
            f.write("-- 2. Run: npm run db:push (to create tables)\n")
            f.write("-- 3. Import data: psql -U wolfslair_user -d wolfslair_family -h localhost -f complete_database_dump.sql\n")
        
        # Generate summary report
        cursor.execute("""
            SELECT 
                'family_members' as table_name, COUNT(*) as count FROM family_members
            UNION ALL
            SELECT 'posts', COUNT(*) FROM posts
            UNION ALL  
            SELECT 'flights', COUNT(*) FROM flights
            UNION ALL
            SELECT 'airports', COUNT(*) FROM airports
            UNION ALL
            SELECT 'blocks', COUNT(*) FROM blocks
            UNION ALL
            SELECT 'users', COUNT(*) FROM users
        """)
        
        summary = cursor.fetchall()
        
        print("\n" + "="*50)
        print("DATABASE EXPORT COMPLETE")
        print("="*50)
        print(f"Output file: {output_file}")
        print("\nData Summary:")
        
        total_records = 0
        for table, count in summary:
            print(f"  {table}: {count:,} records")
            total_records += count
        
        print(f"\nTotal records: {total_records:,}")
        print(f"File size: {os.path.getsize(output_file) / 1024 / 1024:.2f} MB")
        
        cursor.close()
        conn.close()
        
        print("\n✅ Export successful! Use complete_database_dump.sql for your local setup.")
        
    except Exception as e:
        print(f"❌ Export failed: {e}")
        return 1

if __name__ == "__main__":
    exit(main())