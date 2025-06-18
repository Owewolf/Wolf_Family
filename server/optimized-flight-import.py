#!/usr/bin/env python3

import pandas as pd
import psycopg2
from psycopg2.extras import execute_batch
import os
from datetime import datetime
import sys

def connect_to_db():
    """Connect to PostgreSQL database using environment variables"""
    try:
        conn = psycopg2.connect(
            host=os.getenv('PGHOST'),
            database=os.getenv('PGDATABASE'),
            user=os.getenv('PGUSER'),
            password=os.getenv('PGPASSWORD'),
            port=os.getenv('PGPORT')
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
    
    try:
        if isinstance(date_value, str):
            # Try different date formats
            for fmt in ['%Y-%m-%d', '%m/%d/%Y', '%d/%m/%Y']:
                try:
                    return datetime.strptime(date_value.strip(), fmt).strftime('%Y-%m-%d')
                except ValueError:
                    continue
        else:
            # Handle pandas timestamp
            return date_value.strftime('%Y-%m-%d')
    except:
        pass
    
    return None

def optimized_import_flights():
    """Import flight data with optimized batch processing"""
    
    # Connect to database
    conn = connect_to_db()
    if not conn:
        return False
    
    try:
        cursor = conn.cursor()
        
        # Read Excel file
        print("Reading Excel file...")
        df = pd.read_excel('../attached_assets/Logbook_All_TabV1_Cleaned_1750015246968.xlsx')
        total_rows = len(df)
        print(f"Found {total_rows} flight records")
        
        # Clear existing data
        print("Clearing existing flight and airport data...")
        cursor.execute("DELETE FROM flights")
        cursor.execute("DELETE FROM airports")
        conn.commit()
        
        # Prepare airport data
        airports = set()
        flight_data = []
        
        # Process flights in smaller batches
        batch_size = 500
        processed = 0
        
        for index, row in df.iterrows():
            try:
                # Parse flight date
                flight_date = parse_date(row.get('flight_flightDate'))
                if not flight_date:
                    continue
                
                # Get airport codes
                from_airport = safe_str(row.get(' flight_from'))
                to_airport = safe_str(row.get(' flight_to'))
                
                if not from_airport or not to_airport:
                    # Skip records without airport data for now
                    continue
                
                # Add airports to set
                airports.add(from_airport)
                airports.add(to_airport)
                
                # Prepare flight record using actual column names
                flight_record = (
                    flight_date,
                    safe_str(row.get(' flight_flightNumber')),
                    from_airport,
                    to_airport,
                    safe_str(row.get(' flight_selectedCrewPIC')),
                    safe_str(row.get(' flight_selectedCrewSIC')),
                    safe_str(row.get(' flight_selectedCrewRelief')),
                    safe_str(row.get(' flight_selectedCrewStudent')),
                    safe_str(row.get(' flight_actualDepartureTime')),
                    safe_str(row.get(' flight_actualArrivalTime')),
                    float(row.get('flight_distance', 0)) if pd.notna(row.get('flight_distance')) else None,
                    str(row.get(' flight_totalTime')) if pd.notna(row.get(' flight_totalTime')) else None,
                    str(row.get(' flight_pic')) if pd.notna(row.get(' flight_pic')) else None,
                    str(row.get(' flight_sic')) if pd.notna(row.get(' flight_sic')) else None,
                    str(row.get(' flight_night')) if pd.notna(row.get(' flight_night')) else None,
                    str(row.get(' flight_actualInstrument')) if pd.notna(row.get(' flight_actualInstrument')) else None,
                    float(row.get(' flight_dualReceived', 0)) if pd.notna(row.get(' flight_dualReceived')) else None,
                    float(row.get(' flight_dualGiven', 0)) if pd.notna(row.get(' flight_dualGiven')) else None,
                    str(row.get(' flight_simulator')) if pd.notna(row.get(' flight_simulator')) else None,
                    str(row.get(' flight_picNight')) if pd.notna(row.get(' flight_picNight')) else None,
                    str(row.get(' flight_sicNight')) if pd.notna(row.get(' flight_sicNight')) else None,
                    int(row.get(' flight_dualReceivedNight', 0)) if pd.notna(row.get(' flight_dualReceivedNight')) else None,
                    safe_str(row.get(' aircraft_aircraftID')),
                    safe_str(row.get(' aircraftType_type')),
                    safe_str(row.get(' aircraftType_make')),
                    safe_str(row.get(' aircraftType_model')),
                    safe_str(row.get(' aircraftType_selectedEngineType')),
                    safe_str(row.get(' aircraftType_selectedCategory')),
                    safe_str(row.get(' aircraftType_selectedAircraftClass')),
                    safe_str(row.get(' aircraftType_notes'))
                )
                
                flight_data.append(flight_record)
                processed += 1
                
                # Insert batch when we reach batch_size
                if len(flight_data) >= batch_size:
                    insert_flight_batch(cursor, flight_data)
                    conn.commit()
                    print(f"Processed {processed}/{total_rows} flights...")
                    flight_data = []
                
            except Exception as e:
                print(f"Error processing row {index}: {e}")
                continue
        
        # Insert remaining flights
        if flight_data:
            insert_flight_batch(cursor, flight_data)
            conn.commit()
        
        # Insert airports
        print(f"Inserting {len(airports)} unique airports...")
        airport_data = [(code, f"Airport {code}", None, None, None, None) for code in airports]
        
        airport_query = """
        INSERT INTO airports (code, name, city, country, latitude, longitude)
        VALUES (%s, %s, %s, %s, %s, %s)
        ON CONFLICT (code) DO NOTHING
        """
        
        execute_batch(cursor, airport_query, airport_data, page_size=100)
        conn.commit()
        
        print(f"Successfully imported {processed} flights and {len(airports)} airports")
        return True
        
    except Exception as e:
        print(f"Import error: {e}")
        return False
    finally:
        if conn:
            conn.close()

def insert_flight_batch(cursor, flight_data):
    """Insert a batch of flight records"""
    flight_query = """
    INSERT INTO flights (
        flight_date, flight_number, from_airport, to_airport,
        selected_crew_pic, selected_crew_sic, selected_crew_relief, selected_crew_student,
        actual_departure_time, actual_arrival_time, distance, total_time,
        pic, sic, night, actual_instrument, dual_received, dual_given,
        simulator, pic_night, sic_night, dual_received_night,
        aircraft_id, aircraft_type, aircraft_make, aircraft_model,
        engine_type, category, aircraft_class, notes
    ) VALUES (
        %s, %s, %s, %s, %s, %s, %s, %s, %s, %s,
        %s, %s, %s, %s, %s, %s, %s, %s, %s, %s,
        %s, %s, %s, %s, %s, %s, %s, %s, %s, %s
    )
    """
    
    execute_batch(cursor, flight_query, flight_data, page_size=100)

if __name__ == "__main__":
    print("Starting optimized flight data import...")
    success = optimized_import_flights()
    if success:
        print("Import completed successfully!")
        sys.exit(0)
    else:
        print("Import failed!")
        sys.exit(1)