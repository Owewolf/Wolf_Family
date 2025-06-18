#!/usr/bin/env python3
import pandas as pd
import psycopg2
import os
from datetime import datetime

def connect_to_db():
    """Connect to PostgreSQL database using environment variables"""
    try:
        conn = psycopg2.connect(
            host=os.getenv('PGHOST'),
            database=os.getenv('PGDATABASE'),
            user=os.getenv('PGUSER'),
            password=os.getenv('PGPASSWORD'),
            port=os.getenv('PGPORT', 5432)
        )
        return conn
    except Exception as e:
        print(f"Database connection error: {e}")
        return None

def safe_str(value):
    """Safely convert value to string, handling NaN and None"""
    if pd.isna(value) or value is None:
        return None
    return str(value).strip() if str(value).strip() else None

def parse_date(date_value):
    """Parse date from various formats"""
    if pd.isna(date_value):
        return None
    
    if isinstance(date_value, str):
        try:
            return datetime.strptime(date_value, '%Y-%m-%d')
        except:
            try:
                return datetime.strptime(date_value, '%m/%d/%Y')
            except:
                return None
    elif hasattr(date_value, 'strftime'):
        return date_value
    return None

def batch_import_flights():
    """Import flights in batches to avoid timeout"""
    print("Starting batch import of flight data...")
    
    # Read Excel file
    df = pd.read_excel('../attached_assets/Logbook_All_TabV1_Cleaned_1750015246968.xlsx')
    print(f"Loaded {len(df)} flights from Excel file")
    
    # Connect to database
    conn = connect_to_db()
    if not conn:
        print("Failed to connect to database")
        return
    
    cursor = conn.cursor()
    
    # Clear existing data
    print("Clearing existing flight data...")
    cursor.execute("DELETE FROM flights")
    cursor.execute("DELETE FROM airports WHERE id > 16")  # Keep seeded airports
    conn.commit()
    
    # Process in batches of 100
    batch_size = 100
    total_imported = 0
    total_skipped = 0
    
    for batch_start in range(0, len(df), batch_size):
        batch_end = min(batch_start + batch_size, len(df))
        batch_df = df.iloc[batch_start:batch_end]
        
        print(f"Processing batch {batch_start//batch_size + 1}: rows {batch_start}-{batch_end-1}")
        
        batch_imported = 0
        batch_skipped = 0
        
        for index, row in batch_df.iterrows():
            try:
                # Parse flight date
                flight_date = parse_date(row['flight_flightDate'])
                if not flight_date:
                    batch_skipped += 1
                    continue
                
                # Get airport codes
                from_airport = safe_str(row.get(' flight_from', ''))
                to_airport = safe_str(row.get(' flight_to', ''))
                
                if not from_airport or not to_airport:
                    batch_skipped += 1
                    continue
                
                from_airport = from_airport.upper().strip()
                to_airport = to_airport.upper().strip()
                
                # Create airports if they don't exist
                for airport_code in [from_airport, to_airport]:
                    cursor.execute("""
                        INSERT INTO airports (code, name, city, country, latitude, longitude)
                        VALUES (%s, %s, %s, %s, %s, %s)
                        ON CONFLICT (code) DO NOTHING
                    """, (airport_code, airport_code, 'Unknown', 'Unknown', None, None))
                
                # Insert flight
                cursor.execute("""
                    INSERT INTO flights (
                        flight_date, flight_number, from_airport, to_airport, 
                        selected_crew_pic, selected_crew_sic, selected_crew_relief, selected_crew_student,
                        actual_departure_time, actual_arrival_time, distance, total_time,
                        pic, sic, night, actual_instrument, dual_received, dual_given,
                        simulator, pic_night, sic_night, aircraft_type, aircraft_id, notes
                    ) VALUES (
                        %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s
                    )
                """, (
                    flight_date.strftime('%Y-%m-%d'),
                    safe_str(row.get(' flight_flightNumber')),
                    from_airport,
                    to_airport,
                    safe_str(row.get(' flight_selectedCrewPIC')),
                    safe_str(row.get(' flight_selectedCrewSIC')),
                    safe_str(row.get(' flight_selectedCrewRelief')),
                    safe_str(row.get(' flight_selectedCrewStudent')),
                    safe_str(row.get(' flight_actualDepartureTime')),
                    safe_str(row.get(' flight_actualArrivalTime')),
                    row.get('flight_distance') if pd.notna(row.get('flight_distance')) else None,
                    safe_str(row.get(' flight_totalTime')),
                    safe_str(row.get(' flight_pic')),
                    safe_str(row.get(' flight_sic')),
                    safe_str(row.get(' flight_night')),
                    safe_str(row.get(' flight_actualInstrument')),
                    row.get(' flight_dualReceived') if pd.notna(row.get(' flight_dualReceived')) else None,
                    row.get(' flight_dualGiven') if pd.notna(row.get(' flight_dualGiven')) else None,
                    safe_str(row.get(' flight_simulator')),
                    safe_str(row.get(' flight_picNight')),
                    safe_str(row.get(' flight_sicNight')),
                    safe_str(row.get(' flight_aircraftType')),
                    safe_str(row.get(' flight_aircraftID')),
                    safe_str(row.get(' flight_notes'))
                ))
                
                batch_imported += 1
                
            except Exception as e:
                print(f"Error processing row {index}: {e}")
                batch_skipped += 1
                continue
        
        # Commit batch
        conn.commit()
        total_imported += batch_imported
        total_skipped += batch_skipped
        
        print(f"Batch complete: {batch_imported} imported, {batch_skipped} skipped")
    
    cursor.close()
    conn.close()
    
    print(f"\nImport complete!")
    print(f"Total flights imported: {total_imported}")
    print(f"Total flights skipped: {total_skipped}")
    print(f"Success rate: {(total_imported/(total_imported+total_skipped)*100):.1f}%")

if __name__ == "__main__":
    batch_import_flights()