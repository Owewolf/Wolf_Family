import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Calendar, ChevronDown, Plane } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import FlightMap from "@/components/FlightMap";
import AccomplishmentsSidebar from "@/components/AccomplishmentsSidebar";
import type { Flight, Airport } from "@shared/schema";

// Flight Details Component
interface FlightDetailsProps {
  flights: Flight[];
  airports: Airport[];
  onClose: () => void;
}

function FlightDetails({ flights, airports, onClose }: FlightDetailsProps) {
  const selectedDate = flights[0]?.flightDate;
  const parseTimeToMinutes = (timeStr: string | null) => {
    if (!timeStr) return 0;
    
    // Handle HH:MM:SS or HH:MM format
    const parts = timeStr.split(':');
    if (parts.length >= 2) {
      const hours = parseInt(parts[0]) || 0;
      const minutes = parseInt(parts[1]) || 0;
      const seconds = parts.length >= 3 ? parseInt(parts[2]) || 0 : 0;
      return hours * 60 + minutes + (seconds / 60);
    }
    
    // Fallback to parse as number (assume minutes)
    return parseFloat(timeStr) || 0;
  };

  const totalTime = flights.reduce((sum, flight) => {
    const time = parseTimeToMinutes(flight.totalTime);
    return sum + time;
  }, 0);
  
  const formatTime = (totalMinutes: number) => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.floor(totalMinutes % 60);
    const seconds = Math.floor((totalMinutes % 1) * 60);
    
    if (seconds > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${hours}:${minutes.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={onClose}>
          ← Back to Calendar
        </Button>
      </div>

      <Card className="border-0 shadow-lg">
        <CardContent className="p-8">
          <div className="flex items-center space-x-4 mb-6">
            <svg width="48" height="48" viewBox="0 0 48 48">
              <g>
                {/* Main fuselage - light gray */}
                <ellipse cx="24" cy="24" rx="14" ry="5" fill="#E5E7EB"/>
                {/* Wings - blue */}
                <ellipse cx="24" cy="24" rx="6" ry="18" fill="#3B82F6"/>
                {/* Wing tips - darker blue */}
                <ellipse cx="24" cy="10" rx="3" ry="5" fill="#1D4ED8"/>
                <ellipse cx="24" cy="38" rx="3" ry="5" fill="#1D4ED8"/>
                {/* Tail wing - blue */}
                <path d="M10 24 L14 18 L18 22 L14 26 Z" fill="#3B82F6"/>
                {/* Engines - gray */}
                <ellipse cx="18" cy="14" rx="2" ry="3" fill="#9CA3AF"/>
                <ellipse cx="30" cy="14" rx="2" ry="3" fill="#9CA3AF"/>
                <ellipse cx="18" cy="34" rx="2" ry="3" fill="#9CA3AF"/>
                <ellipse cx="30" cy="34" rx="2" ry="3" fill="#9CA3AF"/>
                {/* Cockpit windows */}
                <ellipse cx="34" cy="24" rx="3" ry="2" fill="#374151"/>
              </g>
            </svg>
            <div>
              <h2 className="text-2xl font-bold text-teal-600">
                Flights on {formatDate(selectedDate)}
              </h2>
              <p className="text-gray-600 mt-1">
                Total Flying Time: {formatTime(totalTime)}
              </p>
              <p className="text-gray-500 text-sm">
                {flights.length} flight{flights.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {flights.map((flight, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                {/* Flight Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-teal-600 mb-1">
                      {flight.flightNumber || 'Flight'}
                    </h3>
                    <div className="text-lg font-medium text-gray-800">
                      {flight.from} → {flight.to}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-teal-600">
                      {flight.totalTime || 'N/A'}
                    </div>
                    <div className="text-sm text-gray-600">
                      {flight.distance ? `${flight.distance} nm` : ''}
                    </div>
                  </div>
                </div>

                {/* Flight Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Left Column */}
                  <div className="space-y-3">
                    {flight.actualDepartureTime && (
                      <div>
                        <span className="font-medium text-gray-700">Departure:</span> {flight.actualDepartureTime} ({flight.from})
                      </div>
                    )}
                    
                    {flight.aircraftType && (
                      <div>
                        <span className="font-medium text-gray-700">Aircraft:</span> {flight.aircraftType}
                      </div>
                    )}
                    
                    {flight.night && (
                      <div>
                        <span className="font-medium text-gray-700">Night Time:</span> {flight.night}
                      </div>
                    )}
                  </div>

                  {/* Right Column */}
                  <div className="space-y-3">
                    {flight.actualArrivalTime && (
                      <div>
                        <span className="font-medium text-gray-700">Arrival:</span> {flight.actualArrivalTime} ({flight.to})
                      </div>
                    )}
                    
                    {flight.aircraftID && (
                      <div>
                        <span className="font-medium text-gray-700">Aircraft Registration:</span> {flight.aircraftID}
                      </div>
                    )}
                    
                    {flight.actualInstrument && (
                      <div>
                        <span className="font-medium text-gray-700">Instrument Time:</span> {flight.actualInstrument}
                      </div>
                    )}
                  </div>
                </div>

                {/* Crew Information - Full width if present */}
                {(flight.selectedCrewPIC || flight.selectedCrewSIC || flight.selectedCrewRelief || flight.selectedCrewStudent) && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="font-medium text-gray-700 mb-2">Crew Information:</div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {flight.selectedCrewPIC && (
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-700">PIC:</span>
                          <span className="text-gray-900">{flight.selectedCrewPIC}</span>
                        </div>
                      )}
                      {flight.selectedCrewSIC && (
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-700">SIC:</span>
                          <span className="text-gray-900">{flight.selectedCrewSIC}</span>
                        </div>
                      )}
                      {flight.selectedCrewRelief && (
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-700">Relief:</span>
                          <span className="text-gray-900">{flight.selectedCrewRelief}</span>
                        </div>
                      )}
                      {flight.selectedCrewStudent && (
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-700">Student:</span>
                          <span className="text-gray-900">{flight.selectedCrewStudent}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Notes if present */}
                {flight.notes && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="font-medium text-gray-700 mb-1">Notes:</div>
                    <div className="text-gray-900 text-sm">{flight.notes}</div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {airports.length > 0 && (
            <div className="mt-8">
              <FlightMap flights={flights} airports={airports} />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function FlightHours() {
  const [selectedYear, setSelectedYear] = useState(2020);
  const [selectedMonth, setSelectedMonth] = useState(2); // February
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const { data: flights = [] } = useQuery<Flight[]>({
    queryKey: ['/api/flights'],
  });

  const { data: airports = [] } = useQuery<Airport[]>({
    queryKey: ['/api/airports'],
  });

  // Get actual flight days for the selected month
  const getFlightDaysForMonth = (year: number, month: number) => {
    if (!flights || flights.length === 0) return [];
    
    return flights
      .filter(flight => {
        const flightDate = new Date(flight.flightDate);
        return flightDate.getFullYear() === year && flightDate.getMonth() + 1 === month;
      })
      .map(flight => new Date(flight.flightDate).getDate())
      .filter((day, index, array) => array.indexOf(day) === index); // Remove duplicates
  };

  const flightDays = getFlightDaysForMonth(selectedYear, selectedMonth);

  const selectedDateFlights = selectedDate 
    ? flights.filter(flight => flight.flightDate === selectedDate)
    : [];

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month - 1, 1).getDay(); // 0 = Sunday, 1 = Monday, etc.
  };

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const years = Array.from({ length: 25 }, (_, i) => 1996 + i);

  if (selectedDate && selectedDateFlights.length > 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8 py-8">
          <main className="lg:w-2/3">
            <FlightDetails 
              flights={selectedDateFlights} 
              airports={airports}
              onClose={() => setSelectedDate(null)}
            />
          </main>
          <AccomplishmentsSidebar />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col lg:flex-row gap-8 py-8">
        <main className="lg:w-2/3">
          {/* Header Section */}
          <Card className="mb-8 border-0 shadow-lg">
            <CardContent className="p-8">
              <div className="flex items-start space-x-6 mb-8">
                <div className="flex-shrink-0">
                  <svg width="120" height="120" viewBox="0 0 120 120">
                    <g>
                      {/* Main fuselage - light gray */}
                      <ellipse cx="60" cy="60" rx="35" ry="12" fill="#E5E7EB"/>
                      {/* Wings - blue */}
                      <ellipse cx="60" cy="60" rx="15" ry="45" fill="#3B82F6"/>
                      {/* Wing tips - darker blue */}
                      <ellipse cx="60" cy="25" rx="8" ry="12" fill="#1D4ED8"/>
                      <ellipse cx="60" cy="95" rx="8" ry="12" fill="#1D4ED8"/>
                      {/* Tail wing - blue */}
                      <path d="M25 60 L35 45 L45 55 L35 65 Z" fill="#3B82F6"/>
                      {/* Engines - gray */}
                      <ellipse cx="45" cy="35" rx="6" ry="8" fill="#9CA3AF"/>
                      <ellipse cx="75" cy="35" rx="6" ry="8" fill="#9CA3AF"/>
                      <ellipse cx="45" cy="85" rx="6" ry="8" fill="#9CA3AF"/>
                      <ellipse cx="75" cy="85" rx="6" ry="8" fill="#9CA3AF"/>
                      {/* Cockpit windows */}
                      <ellipse cx="85" cy="60" rx="8" ry="6" fill="#374151"/>
                    </g>
                  </svg>
                </div>
                <div className="flex-1">
                  <h1 className="text-4xl font-bold text-teal-600 mb-2">21809:11+ Commercial Flight Hours</h1>
                  <p className="text-gray-600 text-lg">Interactive Flight Log & Route Mapping</p>
                  
                  {/* Flight Statistics */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-teal-600">3345</div>
                      <div className="text-gray-600 text-sm">Total Flights</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-teal-600">21809:11</div>
                      <div className="text-gray-600 text-sm">Total Hours</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-teal-600">12631:20</div>
                      <div className="text-gray-600 text-sm">PIC Hours</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-teal-600">7958:34</div>
                      <div className="text-gray-600 text-sm">SIC Hours</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Flight Calendar */}
          <Card className="border-0 shadow-lg">
            <CardContent className="p-8 text-[17px] ml-[8px] mr-[8px] mt-[0px] mb-[0px]">
              <div className="flex items-center space-x-4 mb-8">
                <Calendar className="h-6 w-6 text-teal-600" />
                <h2 className="text-2xl font-bold text-teal-600">Flight Calendar</h2>
              </div>

              {/* Date Selectors */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-4">
                  <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(parseInt(value))}>
                    <SelectTrigger className="w-24 border-gray-300">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map(year => (
                        <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={selectedMonth.toString()} onValueChange={(value) => setSelectedMonth(parseInt(value))}>
                    <SelectTrigger className="w-32 border-gray-300">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {months.map((month, index) => (
                        <SelectItem key={index} value={(index + 1).toString()}>{month}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="bg-blue-50 px-4 py-2 rounded-lg">
                  <span className="text-sm text-blue-600 font-medium">Flying Days</span>
                </div>
              </div>

              {/* Calendar Grid */}
              <div className="bg-white rounded-xl overflow-hidden w-full">
                {/* Day Headers */}
                <div className="grid grid-cols-7 bg-gray-50/50">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="h-12 flex items-center justify-center font-medium text-gray-500 text-sm">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar Days */}
                <div className="grid grid-cols-7">
                  {/* Empty cells for days before the first day of the month */}
                  {Array.from({ length: getFirstDayOfMonth(selectedYear, selectedMonth) }, (_, i) => (
                    <div key={`empty-${i}`} className="h-12 flex items-center justify-center">
                      <span className="text-gray-300 text-sm"></span>
                    </div>
                  ))}

                  {/* Current month days */}
                  {Array.from({ length: getDaysInMonth(selectedYear, selectedMonth) }, (_, i) => {
                    const day = i + 1;
                    const isFlightDay = flightDays.includes(day);
                    const isSelectedDay = selectedDate === `${selectedYear}-${selectedMonth.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
                    
                    return (
                      <div
                        key={day}
                        className="h-12 flex items-center justify-center cursor-pointer transition-all duration-200 relative"
                        onClick={() => {
                          if (isFlightDay) {
                            const dateStr = `${selectedYear}-${selectedMonth.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
                            setSelectedDate(dateStr);
                          }
                        }}
                      >
                        <div className={`w-10 h-10 flex items-center justify-center rounded-lg ${
                          isSelectedDay 
                            ? 'bg-blue-500 text-white shadow-md' 
                            : isFlightDay 
                              ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' 
                              : 'hover:bg-gray-50 text-gray-700'
                        }`}>
                          <span className={`text-sm ${isSelectedDay ? 'font-bold' : isFlightDay ? 'font-semibold' : 'font-medium'}`}>
                            {day}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Flight Details Section - Only show when a date is selected */}
          {selectedDate && (
            <Card className="mt-8 border-0 shadow-lg">
              <CardContent className="p-8">
                {/* Return to Calendar Link */}
                <div className="mb-6">
                  <Button 
                    variant="outline" 
                    onClick={() => setSelectedDate(null)}
                    className="flex items-center space-x-2"
                  >
                    <span>← Return to Calendar</span>
                  </Button>
                </div>

                <div className="flex items-center space-x-4 mb-6">
                  <svg width="48" height="48" viewBox="0 0 48 48">
                    <g>
                      {/* Main fuselage - light gray */}
                      <ellipse cx="24" cy="24" rx="14" ry="5" fill="#E5E7EB"/>
                      {/* Wings - blue */}
                      <ellipse cx="24" cy="24" rx="6" ry="18" fill="#3B82F6"/>
                      {/* Wing tips - darker blue */}
                      <ellipse cx="24" cy="10" rx="3" ry="5" fill="#1D4ED8"/>
                      <ellipse cx="24" cy="38" rx="3" ry="5" fill="#1D4ED8"/>
                      {/* Tail wing - blue */}
                      <path d="M10 24 L14 18 L18 22 L14 26 Z" fill="#3B82F6"/>
                      {/* Engines - gray */}
                      <ellipse cx="18" cy="14" rx="2" ry="3" fill="#9CA3AF"/>
                      <ellipse cx="30" cy="14" rx="2" ry="3" fill="#9CA3AF"/>
                      <ellipse cx="18" cy="34" rx="2" ry="3" fill="#9CA3AF"/>
                      <ellipse cx="30" cy="34" rx="2" ry="3" fill="#9CA3AF"/>
                      {/* Cockpit windows */}
                      <ellipse cx="34" cy="24" rx="3" ry="2" fill="#374151"/>
                    </g>
                  </svg>
                  <div>
                    <h3 className="text-2xl font-bold text-teal-600">
                      Flights on Monday, February 10, 2020
                    </h3>
                    <p className="text-gray-600 mt-1">
                      <span className="font-medium">Total Flying Time: 15:54</span>
                    </p>
                    <p className="text-gray-500 text-sm">1 flight</p>
                  </div>
                </div>
                
                {/* Flight Details */}
                <div className="space-y-4">
                  <div className="border border-gray-200 rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="text-lg font-semibold text-teal-600">SA 203</h4>
                        <p className="text-gray-600">FAJS → KJFK</p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-teal-600">15:54</div>
                        <div className="text-sm text-gray-500">6923 nm</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Departure:</span> 20:12:00 (FAJS)
                      </div>
                      <div>
                        <span className="font-medium">Arrival:</span> 12:06:00 (KJFK)
                      </div>
                    </div>
                  </div>
                </div>

                {/* Flight Map */}
                {airports.length > 0 && (
                  <div className="mt-8">
                    <FlightMap flights={selectedDateFlights} airports={airports} />
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {!selectedDate && (
            <div className="text-center py-12">
              <Plane className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-medium text-gray-600 mb-2">Select a Flying Day</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                Choose a year and month from the selectors above, then click on a highlighted day in the calendar to view flight details and routes.
              </p>
            </div>
          )}
        </main>
        
        <AccomplishmentsSidebar />
      </div>
    </div>
  );
}