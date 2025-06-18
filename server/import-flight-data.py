#!/usr/bin/env python3
import pandas as pd
import psycopg2
from datetime import datetime
import sys
import os

# Known airport coordinates for common airports
AIRPORT_COORDS = {
    'FAJS': {'lat': -26.1392, 'lng': 28.2460, 'name': 'OR Tambo International Airport', 'city': 'Johannesburg'},
    'FACT': {'lat': -33.9649, 'lng': 18.6017, 'name': 'Cape Town International Airport', 'city': 'Cape Town'},
    'FAPE': {'lat': -29.6097, 'lng': 30.3982, 'name': 'King Shaka International Airport', 'city': 'Durban'},
    'FAGM': {'lat': -25.3842, 'lng': 31.1056, 'name': 'Kruger Mpumalanga International Airport', 'city': 'Nelspruit'},
    'FASK': {'lat': -29.6889, 'lng': 17.0806, 'name': 'Upington Airport', 'city': 'Upington'},
    'FAWK': {'lat': -25.8372, 'lng': 25.5486, 'name': 'Wonderboom Airport', 'city': 'Pretoria'},
    'FALA': {'lat': -25.9397, 'lng': 27.9260, 'name': 'Lanseria International Airport', 'city': 'Johannesburg'},
    'FABL': {'lat': -29.0972, 'lng': 26.3024, 'name': 'Bloemfontein Airport', 'city': 'Bloemfontein'},
    'FAPE': {'lat': -33.7859, 'lng': 25.6173, 'name': 'Port Elizabeth Airport', 'city': 'Port Elizabeth'},
    'FARG': {'lat': -28.7419, 'lng': 24.7284, 'name': 'Kimberley Airport', 'city': 'Kimberley'},
    'KJFK': {'lat': 40.6413, 'lng': -73.7781, 'name': 'John F. Kennedy International Airport', 'city': 'New York'},
    'KLAX': {'lat': 33.9425, 'lng': -118.4081, 'name': 'Los Angeles International Airport', 'city': 'Los Angeles'},
    'EGLL': {'lat': 51.4700, 'lng': -0.4543, 'name': 'London Heathrow Airport', 'city': 'London'},
    'EDDF': {'lat': 50.0264, 'lng': 8.5431, 'name': 'Frankfurt Airport', 'city': 'Frankfurt'},
    'LFPG': {'lat': 49.0097, 'lng': 2.5479, 'name': 'Charles de Gaulle Airport', 'city': 'Paris'},
    'LIRF': {'lat': 41.8003, 'lng': 12.2389, 'name': 'Leonardo da Vinci Airport', 'city': 'Rome'},
    'LEMD': {'lat': 40.4719, 'lng': -3.5626, 'name': 'Madrid-Barajas Airport', 'city': 'Madrid'},
    'EHAM': {'lat': 52.3086, 'lng': 4.7639, 'name': 'Amsterdam Airport Schiphol', 'city': 'Amsterdam'},
    'EGKK': {'lat': 51.1537, 'lng': -0.1821, 'name': 'London Gatwick Airport', 'city': 'London'},
    'LOWW': {'lat': 48.1103, 'lng': 16.5697, 'name': 'Vienna International Airport', 'city': 'Vienna'},
    'LSGG': {'lat': 46.2381, 'lng': 6.1089, 'name': 'Geneva Airport', 'city': 'Geneva'},
    'LSZH': {'lat': 47.4647, 'lng': 8.5492, 'name': 'Zurich Airport', 'city': 'Zurich'},
    'OMDB': {'lat': 25.2532, 'lng': 55.3657, 'name': 'Dubai International Airport', 'city': 'Dubai'},
    'OTHH': {'lat': 25.2731, 'lng': 51.6086, 'name': 'Hamad International Airport', 'city': 'Doha'},
    'OERK': {'lat': 24.9559, 'lng': 67.1608, 'name': 'Jinnah International Airport', 'city': 'Karachi'},
    'VHHH': {'lat': 22.3080, 'lng': 113.9185, 'name': 'Hong Kong International Airport', 'city': 'Hong Kong'},
    'RJAA': {'lat': 35.7647, 'lng': 140.3864, 'name': 'Narita International Airport', 'city': 'Tokyo'},
    'WSSS': {'lat': 1.3644, 'lng': 103.9915, 'name': 'Singapore Changi Airport', 'city': 'Singapore'},
    'YSSY': {'lat': -33.9399, 'lng': 151.1753, 'name': 'Sydney Kingsford Smith Airport', 'city': 'Sydney'},
    'YMML': {'lat': -37.6690, 'lng': 144.8410, 'name': 'Melbourne Airport', 'city': 'Melbourne'},
}

def connect_to_db():
    """Connect to PostgreSQL database using environment variables"""
    try:
        conn = psycopg2.connect(
            host=os.getenv('PGHOST', 'localhost'),
            database=os.getenv('PGDATABASE', 'replit'),
            user=os.getenv('PGUSER', 'replit'),
            password=os.getenv('PGPASSWORD', ''),
            port=os.getenv('PGPORT', '5432')
        )
        return conn
    except Exception as e:
        print(f"Error connecting to database: {e}")
        return None

def create_airport_if_not_exists(cursor, airport_code):
    """Create airport record if it doesn't exist"""
    if not airport_code or pd.isna(airport_code):
        return
    
    airport_code = str(airport_code).strip().upper()
    
    # Check if airport exists
    cursor.execute("SELECT code FROM airports WHERE code = %s", (airport_code,))
    if cursor.fetchone():
        return
    
    # Get coordinates from our lookup table
    coords = AIRPORT_COORDS.get(airport_code, {})
    
    # Insert airport
    cursor.execute("""
        INSERT INTO airports (code, name, city, country, latitude, longitude)
        VALUES (%s, %s, %s, %s, %s, %s)
        ON CONFLICT (code) DO NOTHING
    """, (
        airport_code,
        coords.get('name', f'Airport {airport_code}'),
        coords.get('city', 'Unknown'),
        'Unknown',
        coords.get('lat'),
        coords.get('lng')
    ))

def parse_time_duration(time_str):
    """Parse time duration string like '1:30' to decimal hours"""
    if not time_str or pd.isna(time_str):
        return None
    
    time_str = str(time_str).strip()
    if ':' in time_str:
        try:
            parts = time_str.split(':')
            hours = int(parts[0])
            minutes = int(parts[1])
            return hours + (minutes / 60.0)
        except:
            return None
    else:
        try:
            return float(time_str)
        except:
            return None

def import_flight_data():
    """Import flight data from Excel file"""
    try:
        # Read Excel file
        df = pd.read_excel('attached_assets/Logbook_All_TabV1_Cleaned_1750015246968.xlsx')
        
        print(f"Read {len(df)} flights from Excel file")
        
        # Connect to database
        conn = connect_to_db()
        if not conn:
            print("Failed to connect to database")
            return
        
        cursor = conn.cursor()
        
        # Process each flight
        imported_count = 0
        for index, row in df.iterrows():
            try:
                # Clean column names (remove leading spaces)
                flight_date = row['flight_flightDate']
                flight_number = str(row.get(' flight_flightNumber', '')).strip() if pd.notna(row.get(' flight_flightNumber')) else None
                from_airport = str(row.get(' flight_from', '')).strip() if pd.notna(row.get(' flight_from')) else None
                to_airport = str(row.get(' flight_to', '')).strip() if pd.notna(row.get(' flight_to')) else None
                
                if not from_airport or not to_airport:
                    print(f"Skipping row {index}: Missing airport codes")
                    continue
                
                # Create airports if they don't exist
                create_airport_if_not_exists(cursor, from_airport)
                create_airport_if_not_exists(cursor, to_airport)
                
                # Parse flight data
                flight_data = {
                    'flight_date': flight_date.strftime('%Y-%m-%d') if pd.notna(flight_date) else None,
                    'flight_number': flight_number,
                    'from_airport': from_airport.upper() if from_airport else None,
                    'to_airport': to_airport.upper() if to_airport else None,
                    'selected_crew_pic': row.get(' flight_selectedCrewPIC', '').strip() if pd.notna(row.get(' flight_selectedCrewPIC')) else None,
                    'selected_crew_sic': row.get(' flight_selectedCrewSIC', '').strip() if pd.notna(row.get(' flight_selectedCrewSIC')) else None,
                    'selected_crew_relief': row.get(' flight_selectedCrewRelief', '').strip() if pd.notna(row.get(' flight_selectedCrewRelief')) else None,
                    'selected_crew_student': row.get(' flight_selectedCrewStudent', '').strip() if pd.notna(row.get(' flight_selectedCrewStudent')) else None,
                    'actual_departure_time': row.get(' flight_actualDepartureTime', '').strip() if pd.notna(row.get(' flight_actualDepartureTime')) else None,
                    'actual_arrival_time': row.get(' flight_actualArrivalTime', '').strip() if pd.notna(row.get(' flight_actualArrivalTime')) else None,
                    'distance': row.get('flight_distance') if pd.notna(row.get('flight_distance')) else None,
                    'total_time': row.get(' flight_totalTime', '').strip() if pd.notna(row.get(' flight_totalTime')) else None,
                    'pic': row.get(' flight_pic', '').strip() if pd.notna(row.get(' flight_pic')) else None,
                    'sic': row.get(' flight_sic', '').strip() if pd.notna(row.get(' flight_sic')) else None,
                    'night': row.get(' flight_night', '').strip() if pd.notna(row.get(' flight_night')) else None,
                    'actual_instrument': row.get(' flight_actualInstrument', '').strip() if pd.notna(row.get(' flight_actualInstrument')) else None,
                    'dual_received': row.get(' flight_dualReceived') if pd.notna(row.get(' flight_dualReceived')) else None,
                    'dual_given': row.get(' flight_dualGiven') if pd.notna(row.get(' flight_dualGiven')) else None,
                    'simulator': row.get(' flight_simulator', '').strip() if pd.notna(row.get(' flight_simulator')) else None,
                    'pic_night': row.get(' flight_picNight', '').strip() if pd.notna(row.get(' flight_picNight')) else None,
                    'sic_night': row.get(' flight_sicNight', '').strip() if pd.notna(row.get(' flight_sicNight')) else None,
                    'dual_received_night': row.get(' flight_dualReceivedNight') if pd.notna(row.get(' flight_dualReceivedNight')) else None,
                    'aircraft_id': row.get(' aircraft_aircraftID', '').strip() if pd.notna(row.get(' aircraft_aircraftID')) else None,
                    'aircraft_type': row.get(' aircraftType_type', '').strip() if pd.notna(row.get(' aircraftType_type')) else None,
                    'aircraft_make': row.get(' aircraftType_make', '').strip() if pd.notna(row.get(' aircraftType_make')) else None,
                    'aircraft_model': row.get(' aircraftType_model', '').strip() if pd.notna(row.get(' aircraftType_model')) else None,
                    'engine_type': row.get(' aircraftType_selectedEngineType', '').strip() if pd.notna(row.get(' aircraftType_selectedEngineType')) else None,
                    'category': row.get(' aircraftType_selectedCategory', '').strip() if pd.notna(row.get(' aircraftType_selectedCategory')) else None,
                    'aircraft_class': row.get(' aircraftType_selectedAircraftClass', '').strip() if pd.notna(row.get(' aircraftType_selectedAircraftClass')) else None,
                    'notes': row.get(' aircraftType_notes', '').strip() if pd.notna(row.get(' aircraftType_notes')) else None
                }
                
                # Insert flight
                cursor.execute("""
                    INSERT INTO flights (
                        flight_date, flight_number, from_airport, to_airport,
                        selected_crew_pic, selected_crew_sic, selected_crew_relief, selected_crew_student,
                        actual_departure_time, actual_arrival_time, distance, total_time,
                        pic, sic, night, actual_instrument, dual_received, dual_given,
                        simulator, pic_night, sic_night, dual_received_night,
                        aircraft_id, aircraft_type, aircraft_make, aircraft_model,
                        engine_type, category, aircraft_class, notes
                    ) VALUES (
                        %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s,
                        %s, %s, %s, %s, %s, %s, %s, %s, %s, %s,
                        %s, %s, %s, %s, %s, %s, %s, %s
                    )
                """, tuple(flight_data.values()))
                
                imported_count += 1
                
                if imported_count % 100 == 0:
                    print(f"Imported {imported_count} flights...")
                    
            except Exception as e:
                print(f"Error processing row {index}: {e}")
                continue
        
        # Commit the transaction
        conn.commit()
        print(f"Successfully imported {imported_count} flights and their airports")
        
        cursor.close()
        conn.close()
        
    except Exception as e:
        print(f"Error importing flight data: {e}")

if __name__ == "__main__":
    import_flight_data()