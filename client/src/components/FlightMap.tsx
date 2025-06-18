import { useEffect, useRef } from "react";
import { MapPin } from "lucide-react";
import type { Flight, Airport } from "@shared/schema";

interface FlightMapProps {
  flights: Flight[];
  airports: Airport[];
}

export default function FlightMap({ flights, airports }: FlightMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadGoogleMaps = () => {
      if (window.google?.maps) {
        initializeMap();
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=geometry`;
      script.async = true;
      script.defer = true;
      script.onload = initializeMap;
      document.head.appendChild(script);
    };

    const initializeMap = () => {
      if (!mapRef.current || !window.google?.maps) return;

      const defaultCenter = { lat: -26.1392, lng: 28.2460 }; // OR Tambo
      
      const map = new window.google.maps.Map(mapRef.current, {
        zoom: 4,
        center: defaultCenter,
        mapTypeId: window.google.maps.MapTypeId.TERRAIN
      });

      if (flights.length === 0) return;

      const bounds = new window.google.maps.LatLngBounds();
      const airportMap = new Map(airports.map(a => [a.code, a]));
      const routeColors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
      const airportsAdded = new Set();
      
      // Group flights by route to handle multiple flights between same airports
      const routeGroups = new Map();
      flights.forEach((flight, index) => {
        const routeKey = `${flight.from}-${flight.to}`;
        if (!routeGroups.has(routeKey)) {
          routeGroups.set(routeKey, []);
        }
        routeGroups.get(routeKey).push({ flight, index });
      });

      // Analyze airports for takeoff/landing on same day
      const airportActivity = new Map();
      flights.forEach(flight => {
        const date = flight.flightDate;
        
        // Track departures
        const fromKey = `${flight.from}-${date}`;
        if (!airportActivity.has(fromKey)) {
          airportActivity.set(fromKey, { departures: 0, arrivals: 0 });
        }
        airportActivity.get(fromKey).departures++;
        
        // Track arrivals
        const toKey = `${flight.to}-${date}`;
        if (!airportActivity.has(toKey)) {
          airportActivity.set(toKey, { departures: 0, arrivals: 0 });
        }
        airportActivity.get(toKey).arrivals++;
      });

      // Add airport markers with color coding
      flights.forEach(flight => {
        const fromAirport = airportMap.get(flight.from);
        const toAirport = airportMap.get(flight.to);
        
        // Add departure airport
        if (fromAirport?.latitude && fromAirport?.longitude && !airportsAdded.has(flight.from)) {
          const position = new window.google.maps.LatLng(fromAirport.latitude, fromAirport.longitude);
          bounds.extend(position);
          airportsAdded.add(flight.from);
          
          // Check if this airport has both takeoffs and landings on same day
          const fromActivity = airportActivity.get(`${flight.from}-${flight.flightDate}`);
          const hasBothActivities = fromActivity && fromActivity.departures > 0 && fromActivity.arrivals > 0;
          const color = hasBothActivities ? '#f59e0b' : '#10b981'; // Orange if both, green if departure only
          
          new window.google.maps.Marker({
            position,
            map,
            title: `${fromAirport.name} (${fromAirport.code})`,
            icon: {
              url: `data:image/svg+xml,${encodeURIComponent(`<svg width="12" height="12" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg"><circle cx="6" cy="6" r="6" fill="${color}"/></svg>`)}`,
              scaledSize: new window.google.maps.Size(12, 12)
            }
          });
        }
        
        // Add arrival airport
        if (toAirport?.latitude && toAirport?.longitude && !airportsAdded.has(flight.to)) {
          const position = new window.google.maps.LatLng(toAirport.latitude, toAirport.longitude);
          bounds.extend(position);
          airportsAdded.add(flight.to);
          
          // Check if this airport has both takeoffs and landings on same day
          const toActivity = airportActivity.get(`${flight.to}-${flight.flightDate}`);
          const hasBothActivities = toActivity && toActivity.departures > 0 && toActivity.arrivals > 0;
          const color = hasBothActivities ? '#f59e0b' : '#ef4444'; // Orange if both, red if arrival only
          
          new window.google.maps.Marker({
            position,
            map,
            title: `${toAirport.name} (${toAirport.code})`,
            icon: {
              url: `data:image/svg+xml,${encodeURIComponent(`<svg width="12" height="12" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg"><circle cx="6" cy="6" r="6" fill="${color}"/></svg>`)}`,
              scaledSize: new window.google.maps.Size(12, 12)
            }
          });
        }
      });

      // Add flight paths with offsets for multiple routes
      routeGroups.forEach((flightGroup, routeKey) => {
        const reverseRouteKey = `${routeKey.split('-')[1]}-${routeKey.split('-')[0]}`;
        const hasReverseRoute = routeGroups.has(reverseRouteKey);
        
        flightGroup.forEach(({ flight, index }) => {
          const fromAirport = airportMap.get(flight.from);
          const toAirport = airportMap.get(flight.to);
          
          if (fromAirport?.latitude && fromAirport?.longitude && toAirport?.latitude && toAirport?.longitude) {
            const from = new window.google.maps.LatLng(fromAirport.latitude, fromAirport.longitude);
            const to = new window.google.maps.LatLng(toAirport.latitude, toAirport.longitude);
            
            let path = [from, to];
            
            // Create smooth great circle offset for round-trip routes
            if (hasReverseRoute) {
              const distance = window.google.maps.geometry.spherical.computeDistanceBetween(from, to);
              const offsetDistance = Math.max(distance * 0.08, 25000);
              
              // Create multiple points along the great circle with consistent offset
              const numPoints = 18; // Fewer points, plus start/end
              const pathPoints = [from]; // Start at actual airport
              
              // Add offset points in the middle section only
              for (let i = 1; i < numPoints; i++) {
                const fraction = i / (numPoints);
                const pointOnGreatCircle = window.google.maps.geometry.spherical.interpolate(from, to, fraction);
                
                // Calculate bearing perpendicular to the great circle at this point
                const bearing = window.google.maps.geometry.spherical.computeHeading(from, to);
                const offsetBearing = bearing + 90; // Both flights offset to the right (east)
                
                // Apply offset to create parallel track, with reduced offset near endpoints
                const distanceFromCenter = Math.abs(fraction - 0.5) * 2; // 0 at center, 1 at endpoints
                const taperedOffset = offsetDistance * (1 - distanceFromCenter * 0.7); // Reduce offset near endpoints
                
                const offsetPoint = window.google.maps.geometry.spherical.computeOffset(
                  pointOnGreatCircle,
                  taperedOffset,
                  offsetBearing
                );
                
                pathPoints.push(offsetPoint);
              }
              
              pathPoints.push(to); // End at actual airport
              path = pathPoints;
            }
            
            new window.google.maps.Polyline({
              path,
              geodesic: true,
              strokeColor: routeColors[index % routeColors.length],
              strokeOpacity: 0.8,
              strokeWeight: 3,
              map
            });
          }
        });
      });

      if (bounds.isEmpty()) {
        map.setCenter(defaultCenter);
      } else {
        map.fitBounds(bounds);
      }
    };

    loadGoogleMaps();
  }, [flights, airports]);

  return (
    <div className="space-y-4">
      <h4 className="font-semibold text-emerald-700 flex items-center">
        <MapPin className="h-4 w-4 mr-2" />
        Flight Routes
      </h4>
      <div 
        ref={mapRef} 
        className="h-96 w-full rounded-lg border border-emerald-200"
        style={{ minHeight: '384px' }}
      />
    </div>
  );
}