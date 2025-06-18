#!/usr/bin/env python3

import psycopg2
import os

# Complete airport coordinates database for all airports in the spreadsheet
AIRPORT_COORDINATES = {
    # South African airports
    'FAJS': (-26.1392, 28.2460, 'OR Tambo International Airport', 'Johannesburg', 'South Africa'),
    'FACT': (-33.9648, 18.6017, 'Cape Town International Airport', 'Cape Town', 'South Africa'),
    'FADN': (-29.9702, 30.9505, 'King Shaka International Airport', 'Durban', 'South Africa'),
    'FAEL': (-26.8733, 26.8722, 'Welkom Airport', 'Welkom', 'South Africa'),
    'FAGG': (-26.0975, 28.1469, 'Grand Central Airport', 'Midrand', 'South Africa'),
    'FAPE': (-25.6552, 28.2241, 'Wonderboom Airport', 'Pretoria', 'South Africa'),
    
    # European airports
    'EDDF': (50.0379, 8.5622, 'Frankfurt Airport', 'Frankfurt', 'Germany'),
    'EDDL': (51.2895, 6.7668, 'Düsseldorf Airport', 'Düsseldorf', 'Germany'),
    'EDDM': (48.3538, 11.7861, 'Munich Airport', 'Munich', 'Germany'),
    'EGLL': (51.4700, -0.4543, 'Heathrow Airport', 'London', 'United Kingdom'),
    'EHAM': (52.3086, 4.7639, 'Amsterdam Airport Schiphol', 'Amsterdam', 'Netherlands'),
    'EKCH': (55.6181, 12.6561, 'Copenhagen Airport', 'Copenhagen', 'Denmark'),
    'LFPG': (49.0097, 2.5479, 'Charles de Gaulle Airport', 'Paris', 'France'),
    'LFBD': (44.8283, -0.7156, 'Bordeaux-Mérignac Airport', 'Bordeaux', 'France'),
    'LFBO': (43.6291, 1.3638, 'Toulouse-Blagnac Airport', 'Toulouse', 'France'),
    'LSZH': (47.4647, 8.5492, 'Zurich Airport', 'Zurich', 'Switzerland'),
    
    # Asian airports
    'VHHH': (22.3080, 113.9185, 'Hong Kong International Airport', 'Hong Kong', 'Hong Kong'),
    'VTBS': (13.6900, 100.7501, 'Suvarnabhumi Airport', 'Bangkok', 'Thailand'),
    'VABB': (19.0896, 72.8656, 'Chhatrapati Shivaji Maharaj International Airport', 'Mumbai', 'India'),
    'ZBAA': (40.0801, 116.5846, 'Beijing Capital International Airport', 'Beijing', 'China'),
    'RJBB': (34.7848, 135.4387, 'Kansai International Airport', 'Osaka', 'Japan'),
    
    # Middle Eastern airports
    'OMAA': (24.4330, 54.6511, 'Abu Dhabi International Airport', 'Abu Dhabi', 'UAE'),
    'OEJN': (24.5564, 39.7050, 'Prince Mohammad Bin Abdulaziz Airport', 'Medina', 'Saudi Arabia'),
    
    # African airports
    'DGAA': (36.6910, 3.2154, 'Houari Boumediene Airport', 'Algiers', 'Algeria'),
    'DIAP': (32.0968, 20.2693, 'Benina International Airport', 'Benghazi', 'Libya'),
    'DNMM': (15.5892, 32.5532, 'Khartoum Airport', 'Khartoum', 'Sudan'),
    'FIMP': (1.3542, 32.4455, 'Entebbe International Airport', 'Entebbe', 'Uganda'),
    'FLLI': (-15.3279, 28.4526, 'Kenneth Kaunda International Airport', 'Lusaka', 'Zambia'),
    'FLLS': (-17.8217, 25.8225, 'Livingstone Airport', 'Livingstone', 'Zambia'),
    'FNLU': (-8.8583, 13.2312, 'Quatro de Fevereiro Airport', 'Luanda', 'Angola'),
    'FQMA': (-20.4304, 57.6836, 'Sir Seewoosagur Ramgoolam International Airport', 'Mauritius', 'Mauritius'),
    'FVBU': (-17.9318, 25.8187, 'Kasane Airport', 'Kasane', 'Botswana'),
    'FVFA': (-19.9726, 23.4115, 'Francistown Airport', 'Francistown', 'Botswana'),
    'FVHA': (-24.5559, 25.9182, 'Sir Seretse Khama International Airport', 'Gaborone', 'Botswana'),
    'FWCL': (-17.7059, 24.2737, 'Chobe Airport', 'Kasane', 'Botswana'),
    'FWKI': (1.4546, 9.4122, 'Libreville Leon M\'ba Airport', 'Libreville', 'Gabon'),
    'FYWH': (-22.4799, 17.4709, 'Hosea Kutako International Airport', 'Windhoek', 'Namibia'),
    'FZAA': (-4.3856, 15.4446, 'Ndjili International Airport', 'Kinshasa', 'DRC'),
    'GOBD': (12.6352, -16.0514, 'Léopold Sédar Senghor International Airport', 'Dakar', 'Senegal'),
    'GOOY': (14.7397, -17.4902, 'Blaise Diagne International Airport', 'Dakar', 'Senegal'),
    'GVAC': (14.9455, -23.4935, 'Amílcar Cabral International Airport', 'Cape Verde', 'Cape Verde'),
    'HKJK': (-1.3192, 36.9278, 'Jomo Kenyatta International Airport', 'Nairobi', 'Kenya'),
    'HRYR': (-25.9539, 32.5724, 'Maputo International Airport', 'Maputo', 'Mozambique'),
    'HTDA': (-6.8781, 39.2026, 'Julius Nyerere International Airport', 'Dar es Salaam', 'Tanzania'),
    'HTKJ': (-3.4297, 36.6333, 'Kilimanjaro International Airport', 'Kilimanjaro', 'Tanzania'),
    'HUEN': (0.0464, 32.4355, 'Entebbe International Airport', 'Entebbe', 'Uganda'),
    
    # North American airports
    'KATL': (33.6407, -84.4277, 'Hartsfield-Jackson Atlanta International Airport', 'Atlanta', 'United States'),
    'KIAD': (38.9531, -77.4565, 'Ronald Reagan Washington National Airport', 'Washington', 'United States'),
    'KJFK': (40.6413, -73.7781, 'John F. Kennedy International Airport', 'New York', 'United States'),
    
    # South American airports
    'SAEZ': (-34.8222, -58.5358, 'Ezeiza International Airport', 'Buenos Aires', 'Argentina'),
    'SBGR': (-23.4356, -46.4731, 'São Paulo/Guarulhos International Airport', 'São Paulo', 'Brazil'),
    
    # Australian airports
    'YPPH': (-31.9403, 115.9672, 'Perth Airport', 'Perth', 'Australia'),
    'YSSY': (-33.9399, 151.1753, 'Sydney Kingsford Smith Airport', 'Sydney', 'Australia'),
}

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

def update_airport_coordinates():
    """Update airports with coordinate data"""
    conn = connect_to_db()
    if not conn:
        return False
    
    try:
        cursor = conn.cursor()
        
        # Get all airport codes in the database
        cursor.execute("SELECT DISTINCT code FROM airports")
        db_airports = [row[0] for row in cursor.fetchall()]
        
        updated_count = 0
        for airport_code in db_airports:
            if airport_code in AIRPORT_COORDINATES:
                lat, lon, name, city, country = AIRPORT_COORDINATES[airport_code]
                
                cursor.execute("""
                    UPDATE airports 
                    SET latitude = %s, longitude = %s, name = %s, city = %s, country = %s
                    WHERE code = %s
                """, (lat, lon, name, city, country, airport_code))
                updated_count += 1
        
        conn.commit()
        print(f"Updated {updated_count} airports with coordinate data")
        
        # Verify the update
        cursor.execute("SELECT COUNT(*) FROM airports WHERE latitude IS NOT NULL AND longitude IS NOT NULL")
        coord_count = cursor.fetchone()[0]
        print(f"Total airports with coordinates: {coord_count}")
        
        return True
        
    except Exception as e:
        print(f"Error updating airport coordinates: {e}")
        return False
    finally:
        if conn:
            conn.close()

if __name__ == "__main__":
    print("Adding airport coordinate data...")
    success = update_airport_coordinates()
    if success:
        print("Airport coordinates updated successfully!")
    else:
        print("Failed to update airport coordinates!")