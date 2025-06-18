#!/usr/bin/env python3
import pandas as pd
import psycopg2
from datetime import datetime
import sys
import os

# Comprehensive airport coordinates database
AIRPORT_COORDS = {
    # South African airports
    'FAJS': {'lat': -26.1392, 'lng': 28.2460, 'name': 'OR Tambo International Airport', 'city': 'Johannesburg', 'country': 'South Africa'},
    'FACT': {'lat': -33.9649, 'lng': 18.6017, 'name': 'Cape Town International Airport', 'city': 'Cape Town', 'country': 'South Africa'},
    'FAPE': {'lat': -29.6097, 'lng': 30.3982, 'name': 'King Shaka International Airport', 'city': 'Durban', 'country': 'South Africa'},
    'FAGM': {'lat': -25.3842, 'lng': 31.1056, 'name': 'Kruger Mpumalanga International Airport', 'city': 'Nelspruit', 'country': 'South Africa'},
    'FASK': {'lat': -29.6889, 'lng': 17.0806, 'name': 'Upington Airport', 'city': 'Upington', 'country': 'South Africa'},
    'FAWK': {'lat': -25.8372, 'lng': 25.5486, 'name': 'Wonderboom Airport', 'city': 'Pretoria', 'country': 'South Africa'},
    'FALA': {'lat': -25.9397, 'lng': 27.9260, 'name': 'Lanseria International Airport', 'city': 'Johannesburg', 'country': 'South Africa'},
    'FABL': {'lat': -29.0972, 'lng': 26.3024, 'name': 'Bloemfontein Airport', 'city': 'Bloemfontein', 'country': 'South Africa'},
    'FAPE': {'lat': -33.7859, 'lng': 25.6173, 'name': 'Port Elizabeth Airport', 'city': 'Port Elizabeth', 'country': 'South Africa'},
    'FARG': {'lat': -28.7419, 'lng': 24.7284, 'name': 'Kimberley Airport', 'city': 'Kimberley', 'country': 'South Africa'},
    'FADN': {'lat': -31.8986, 'lng': 29.6097, 'name': 'Virginia Airport', 'city': 'Durban', 'country': 'South Africa'},
    'FAEL': {'lat': -33.0353, 'lng': 27.8258, 'name': 'East London Airport', 'city': 'East London', 'country': 'South Africa'},
    'FAGC': {'lat': -25.4486, 'lng': 30.9528, 'name': 'Grand Central Airport', 'city': 'Midrand', 'country': 'South Africa'},
    'FAGG': {'lat': -25.9853, 'lng': 28.1417, 'name': 'Rand Airport', 'city': 'Germiston', 'country': 'South Africa'},
    'FAHS': {'lat': -25.8142, 'lng': 28.3925, 'name': 'Heidelberg Airport', 'city': 'Heidelberg', 'country': 'South Africa'},
    'FAOR': {'lat': -26.1222, 'lng': 27.9258, 'name': 'Baragwanath Airport', 'city': 'Soweto', 'country': 'South Africa'},
    'FASS': {'lat': -26.7147, 'lng': 27.2569, 'name': 'Sasol Airport', 'city': 'Secunda', 'country': 'South Africa'},
    'FATZ': {'lat': -23.8619, 'lng': 29.9811, 'name': 'Tzaneen Airport', 'city': 'Tzaneen', 'country': 'South Africa'},
    'FAVB': {'lat': -22.4597, 'lng': 17.6347, 'name': 'Eros Airport', 'city': 'Windhoek', 'country': 'Namibia'},
    'FYWE': {'lat': -17.9311, 'lng': 25.8386, 'name': 'Livingstone Airport', 'city': 'Livingstone', 'country': 'Zambia'},
    
    # US airports
    'KJFK': {'lat': 40.6413, 'lng': -73.7781, 'name': 'John F. Kennedy International Airport', 'city': 'New York', 'country': 'USA'},
    'KLAX': {'lat': 33.9425, 'lng': -118.4081, 'name': 'Los Angeles International Airport', 'city': 'Los Angeles', 'country': 'USA'},
    'KORD': {'lat': 41.9742, 'lng': -87.9073, 'name': 'Chicago O\'Hare International Airport', 'city': 'Chicago', 'country': 'USA'},
    'KDFW': {'lat': 32.8998, 'lng': -97.0403, 'name': 'Dallas/Fort Worth International Airport', 'city': 'Dallas', 'country': 'USA'},
    'KDEN': {'lat': 39.8561, 'lng': -104.6737, 'name': 'Denver International Airport', 'city': 'Denver', 'country': 'USA'},
    'KATL': {'lat': 33.6407, 'lng': -84.4277, 'name': 'Hartsfield-Jackson Atlanta International Airport', 'city': 'Atlanta', 'country': 'USA'},
    'KLAS': {'lat': 36.0840, 'lng': -115.1537, 'name': 'McCarran International Airport', 'city': 'Las Vegas', 'country': 'USA'},
    'KPHX': {'lat': 33.4343, 'lng': -112.0116, 'name': 'Phoenix Sky Harbor International Airport', 'city': 'Phoenix', 'country': 'USA'},
    'KIAH': {'lat': 29.9902, 'lng': -95.3368, 'name': 'George Bush Intercontinental Airport', 'city': 'Houston', 'country': 'USA'},
    'KMIA': {'lat': 25.7933, 'lng': -80.2906, 'name': 'Miami International Airport', 'city': 'Miami', 'country': 'USA'},
    
    # European airports
    'EGLL': {'lat': 51.4700, 'lng': -0.4543, 'name': 'London Heathrow Airport', 'city': 'London', 'country': 'UK'},
    'EGKK': {'lat': 51.1537, 'lng': -0.1821, 'name': 'London Gatwick Airport', 'city': 'London', 'country': 'UK'},
    'EGGW': {'lat': 51.8747, 'lng': -0.3683, 'name': 'London Luton Airport', 'city': 'London', 'country': 'UK'},
    'EGSS': {'lat': 51.8850, 'lng': 0.2350, 'name': 'London Stansted Airport', 'city': 'London', 'country': 'UK'},
    'EDDF': {'lat': 50.0264, 'lng': 8.5431, 'name': 'Frankfurt Airport', 'city': 'Frankfurt', 'country': 'Germany'},
    'EDDM': {'lat': 48.3538, 'lng': 11.7861, 'name': 'Munich Airport', 'city': 'Munich', 'country': 'Germany'},
    'LFPG': {'lat': 49.0097, 'lng': 2.5479, 'name': 'Charles de Gaulle Airport', 'city': 'Paris', 'country': 'France'},
    'LFPO': {'lat': 48.7233, 'lng': 2.3794, 'name': 'Orly Airport', 'city': 'Paris', 'country': 'France'},
    'LIRF': {'lat': 41.8003, 'lng': 12.2389, 'name': 'Leonardo da Vinci Airport', 'city': 'Rome', 'country': 'Italy'},
    'LEMD': {'lat': 40.4719, 'lng': -3.5626, 'name': 'Madrid-Barajas Airport', 'city': 'Madrid', 'country': 'Spain'},
    'EHAM': {'lat': 52.3086, 'lng': 4.7639, 'name': 'Amsterdam Airport Schiphol', 'city': 'Amsterdam', 'country': 'Netherlands'},
    'LOWW': {'lat': 48.1103, 'lng': 16.5697, 'name': 'Vienna International Airport', 'city': 'Vienna', 'country': 'Austria'},
    'LSGG': {'lat': 46.2381, 'lng': 6.1089, 'name': 'Geneva Airport', 'city': 'Geneva', 'country': 'Switzerland'},
    'LSZH': {'lat': 47.4647, 'lng': 8.5492, 'name': 'Zurich Airport', 'city': 'Zurich', 'country': 'Switzerland'},
    
    # Middle East airports
    'OMDB': {'lat': 25.2532, 'lng': 55.3657, 'name': 'Dubai International Airport', 'city': 'Dubai', 'country': 'UAE'},
    'OTHH': {'lat': 25.2731, 'lng': 51.6086, 'name': 'Hamad International Airport', 'city': 'Doha', 'country': 'Qatar'},
    'OERK': {'lat': 24.9559, 'lng': 67.1608, 'name': 'Jinnah International Airport', 'city': 'Karachi', 'country': 'Pakistan'},
    'OJAI': {'lat': 26.2711, 'lng': 50.6339, 'name': 'Bahrain International Airport', 'city': 'Manama', 'country': 'Bahrain'},
    'OKBK': {'lat': 29.2267, 'lng': 47.9689, 'name': 'Kuwait International Airport', 'city': 'Kuwait City', 'country': 'Kuwait'},
    
    # Asian airports
    'VHHH': {'lat': 22.3080, 'lng': 113.9185, 'name': 'Hong Kong International Airport', 'city': 'Hong Kong', 'country': 'Hong Kong'},
    'RJAA': {'lat': 35.7647, 'lng': 140.3864, 'name': 'Narita International Airport', 'city': 'Tokyo', 'country': 'Japan'},
    'RJTT': {'lat': 35.5533, 'lng': 139.7811, 'name': 'Haneda Airport', 'city': 'Tokyo', 'country': 'Japan'},
    'WSSS': {'lat': 1.3644, 'lng': 103.9915, 'name': 'Singapore Changi Airport', 'city': 'Singapore', 'country': 'Singapore'},
    'ZSPD': {'lat': 31.1434, 'lng': 121.8052, 'name': 'Shanghai Pudong International Airport', 'city': 'Shanghai', 'country': 'China'},
    'ZBAA': {'lat': 40.0801, 'lng': 116.5846, 'name': 'Beijing Capital International Airport', 'city': 'Beijing', 'country': 'China'},
    'VIDP': {'lat': 28.5562, 'lng': 77.1000, 'name': 'Indira Gandhi International Airport', 'city': 'Delhi', 'country': 'India'},
    'VOMM': {'lat': 13.0827, 'lng': 80.2707, 'name': 'Chennai International Airport', 'city': 'Chennai', 'country': 'India'},
    'VTBS': {'lat': 13.6900, 'lng': 100.7501, 'name': 'Suvarnabhumi Airport', 'city': 'Bangkok', 'country': 'Thailand'},
    'WMKK': {'lat': 2.7456, 'lng': 101.7072, 'name': 'Kuala Lumpur International Airport', 'city': 'Kuala Lumpur', 'country': 'Malaysia'},
    
    # Australian airports
    'YSSY': {'lat': -33.9399, 'lng': 151.1753, 'name': 'Sydney Kingsford Smith Airport', 'city': 'Sydney', 'country': 'Australia'},
    'YMML': {'lat': -37.6690, 'lng': 144.8410, 'name': 'Melbourne Airport', 'city': 'Melbourne', 'country': 'Australia'},
    'YBBN': {'lat': -27.3942, 'lng': 153.1173, 'name': 'Brisbane Airport', 'city': 'Brisbane', 'country': 'Australia'},
    'YPPH': {'lat': -31.9403, 'lng': 115.9669, 'name': 'Perth Airport', 'city': 'Perth', 'country': 'Australia'},
    'YPAD': {'lat': -34.9461, 'lng': 138.5311, 'name': 'Adelaide Airport', 'city': 'Adelaide', 'country': 'Australia'},
    
    # African airports
    'HECA': {'lat': 30.1219, 'lng': 31.4056, 'name': 'Cairo International Airport', 'city': 'Cairo', 'country': 'Egypt'},
    'HAAB': {'lat': 9.0300, 'lng': 38.7628, 'name': 'Addis Ababa Bole International Airport', 'city': 'Addis Ababa', 'country': 'Ethiopia'},
    'HKJK': {'lat': -1.3192, 'lng': 36.9278, 'name': 'Jomo Kenyatta International Airport', 'city': 'Nairobi', 'country': 'Kenya'},
    'HTDA': {'lat': -6.8781, 'lng': 39.2026, 'name': 'Julius Nyerere International Airport', 'city': 'Dar es Salaam', 'country': 'Tanzania'},
    'FMMM': {'lat': -18.7969, 'lng': 47.4789, 'name': 'Ivato Airport', 'city': 'Antananarivo', 'country': 'Madagascar'},
    'GMMN': {'lat': 33.3675, 'lng': -7.5897, 'name': 'Mohammed V International Airport', 'city': 'Casablanca', 'country': 'Morocco'},
    'DAAG': {'lat': 36.6911, 'lng': 3.2156, 'name': 'Houari Boumediene Airport', 'city': 'Algiers', 'country': 'Algeria'},
    'DTTA': {'lat': 36.8510, 'lng': 10.2272, 'name': 'Tunis-Carthage International Airport', 'city': 'Tunis', 'country': 'Tunisia'},
    'HLLM': {'lat': -29.4628, 'lng': 27.5533, 'name': 'Moshoeshoe I International Airport', 'city': 'Maseru', 'country': 'Lesotho'},
    'FQMA': {'lat': -25.6147, 'lng': 31.3078, 'name': 'Maputo International Airport', 'city': 'Maputo', 'country': 'Mozambique'},
    'FBSK': {'lat': -24.5553, 'lng': 25.9181, 'name': 'Sir Seretse Khama International Airport', 'city': 'Gaborone', 'country': 'Botswana'},
    'FYWH': {'lat': -22.4817, 'lng': 17.4706, 'name': 'Hosea Kutako International Airport', 'city': 'Windhoek', 'country': 'Namibia'},
    'FVFA': {'lat': -20.0167, 'lng': 28.5183, 'name': 'Victoria Falls Airport', 'city': 'Victoria Falls', 'country': 'Zimbabwe'},
    'FVHA': {'lat': -17.9319, 'lng': 31.0928, 'name': 'Harare International Airport', 'city': 'Harare', 'country': 'Zimbabwe'},
    
    # South American airports
    'SBGR': {'lat': -23.4356, 'lng': -46.4731, 'name': 'São Paulo/Guarulhos International Airport', 'city': 'São Paulo', 'country': 'Brazil'},
    'SCEL': {'lat': -33.3928, 'lng': -70.7856, 'name': 'Arturo Merino Benítez International Airport', 'city': 'Santiago', 'country': 'Chile'},
    'SAEZ': {'lat': -34.8222, 'lng': -58.5358, 'name': 'Ezeiza International Airport', 'city': 'Buenos Aires', 'country': 'Argentina'},
    'SKBO': {'lat': 4.7016, 'lng': -74.1469, 'name': 'El Dorado International Airport', 'city': 'Bogotá', 'country': 'Colombia'},
    'SPJC': {'lat': -12.0219, 'lng': -77.1142, 'name': 'Jorge Chávez International Airport', 'city': 'Lima', 'country': 'Peru'},
    'SABE': {'lat': -34.5592, 'lng': -58.4156, 'name': 'Jorge Newbery Airfield', 'city': 'Buenos Aires', 'country': 'Argentina'},
}

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
            return datetime.strptime(date_value, '%Y-%m-%d').date()
        except:
            try:
                return datetime.strptime(date_value, '%m/%d/%Y').date()
            except:
                return None
    elif hasattr(date_value, 'date'):
        return date_value.date()
    elif hasattr(date_value, 'strftime'):
        return date_value.date()
    return None

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
    if not airport_code:
        return
    
    airport_code = airport_code.upper()
    
    # Check if airport exists
    cursor.execute("SELECT code FROM airports WHERE code = %s", (airport_code,))
    if cursor.fetchone():
        return
    
    # Get coordinates from our comprehensive lookup table
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
        coords.get('country', 'Unknown'),
        coords.get('lat'),
        coords.get('lng')
    ))

def import_comprehensive_flight_data():
    """Import flight data from Excel file with comprehensive error handling"""
    try:
        # Read Excel file
        df = pd.read_excel('../attached_assets/Logbook_All_TabV1_Cleaned_1750015246968.xlsx')
        print(f"Read {len(df)} flights from Excel file")
        print(f"Date range: {df['flight_flightDate'].min()} to {df['flight_flightDate'].max()}")
        
        # Connect to database
        conn = connect_to_db()
        if not conn:
            print("Failed to connect to database")
            return
        
        cursor = conn.cursor()
        
        # Clear existing data
        print("Clearing existing flight and airport data...")
        cursor.execute("DELETE FROM flights")
        cursor.execute("DELETE FROM airports")
        
        # Process each flight
        imported_count = 0
        skipped_count = 0
        
        for index, row in df.iterrows():
            try:
                # Parse flight date
                flight_date = parse_date(row['flight_flightDate'])
                if not flight_date:
                    skipped_count += 1
                    continue
                
                # Get airport codes
                from_airport = safe_str(row.get(' flight_from', ''))
                to_airport = safe_str(row.get(' flight_to', ''))
                
                if not from_airport or not to_airport:
                    skipped_count += 1
                    continue
                
                from_airport = from_airport.upper()
                to_airport = to_airport.upper()
                
                # Create airports if they don't exist
                create_airport_if_not_exists(cursor, from_airport)
                create_airport_if_not_exists(cursor, to_airport)
                
                # Prepare flight data
                flight_data = {
                    'flight_date': flight_date.strftime('%Y-%m-%d'),
                    'flight_number': safe_str(row.get(' flight_flightNumber')),
                    'from_airport': from_airport,
                    'to_airport': to_airport,
                    'selected_crew_pic': safe_str(row.get(' flight_selectedCrewPIC')),
                    'selected_crew_sic': safe_str(row.get(' flight_selectedCrewSIC')),
                    'selected_crew_relief': safe_str(row.get(' flight_selectedCrewRelief')),
                    'selected_crew_student': safe_str(row.get(' flight_selectedCrewStudent')),
                    'actual_departure_time': safe_str(row.get(' flight_actualDepartureTime')),
                    'actual_arrival_time': safe_str(row.get(' flight_actualArrivalTime')),
                    'distance': row.get('flight_distance') if pd.notna(row.get('flight_distance')) else None,
                    'total_time': safe_str(row.get(' flight_totalTime')),
                    'pic': safe_str(row.get(' flight_pic')),
                    'sic': safe_str(row.get(' flight_sic')),
                    'night': safe_str(row.get(' flight_night')),
                    'actual_instrument': safe_str(row.get(' flight_actualInstrument')),
                    'dual_received': row.get(' flight_dualReceived') if pd.notna(row.get(' flight_dualReceived')) else None,
                    'dual_given': row.get(' flight_dualGiven') if pd.notna(row.get(' flight_dualGiven')) else None,
                    'simulator': safe_str(row.get(' flight_simulator')),
                    'pic_night': safe_str(row.get(' flight_picNight')),
                    'sic_night': safe_str(row.get(' flight_sicNight')),
                    'dual_received_night': row.get(' flight_dualReceivedNight') if pd.notna(row.get(' flight_dualReceivedNight')) else None,
                    'aircraft_id': safe_str(row.get(' aircraft_aircraftID')),
                    'aircraft_type': safe_str(row.get(' aircraftType_type')),
                    'aircraft_make': safe_str(row.get(' aircraftType_make')),
                    'aircraft_model': safe_str(row.get(' aircraftType_model')),
                    'engine_type': safe_str(row.get(' aircraftType_selectedEngineType')),
                    'category': safe_str(row.get(' aircraftType_selectedCategory')),
                    'aircraft_class': safe_str(row.get(' aircraftType_selectedAircraftClass')),
                    'notes': safe_str(row.get(' aircraftType_notes'))
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
                
                if imported_count % 500 == 0:
                    print(f"Imported {imported_count} flights...")
                    conn.commit()
                    
            except Exception as e:
                print(f"Error processing row {index}: {e}")
                skipped_count += 1
                continue
        
        # Final commit
        conn.commit()
        print(f"Successfully imported {imported_count} flights")
        print(f"Skipped {skipped_count} invalid records")
        
        # Get date range statistics
        cursor.execute("SELECT MIN(flight_date), MAX(flight_date), COUNT(*) FROM flights")
        min_date, max_date, total_count = cursor.fetchone()
        print(f"Flight data spans from {min_date} to {max_date} ({total_count} total flights)")
        
        # Get airport statistics
        cursor.execute("SELECT COUNT(*) FROM airports WHERE latitude IS NOT NULL")
        airports_with_coords = cursor.fetchone()[0]
        cursor.execute("SELECT COUNT(*) FROM airports")
        total_airports = cursor.fetchone()[0]
        print(f"Created {total_airports} airports, {airports_with_coords} with coordinates")
        
        cursor.close()
        conn.close()
        
    except Exception as e:
        print(f"Error importing flight data: {e}")

if __name__ == "__main__":
    import_comprehensive_flight_data()