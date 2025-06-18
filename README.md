# Flight Hours Tracking Application

A comprehensive family communication platform with advanced flight mapping and route visualization capabilities, featuring real-time flight tracking, airport activity monitoring, and detailed flight logging.

## Features

### Flight Tracking & Visualization
- **Interactive Flight Map**: Google Maps integration with terrain view showing flight routes
- **Smart Route Rendering**: Curved flight paths with offset tracks for round-trip flights
- **Airport Activity Markers**: Color-coded airports (green=departure, red=arrival, orange=both)
- **Great Circle Routes**: Geodesic path rendering following Earth's natural curvature

### Flight Data Management
- **Comprehensive Flight Logging**: Track PIC/SIC time, night hours, instrument time
- **Aircraft Information**: Type, make, model, registration details
- **Crew Management**: Multi-crew flight support with PIC/SIC/Relief/Student roles
- **Date-based Filtering**: View flights by specific dates with calendar interface

### Family Communication Platform
- **Multi-user Support**: Family member profiles with role-based access
- **Blog Posts**: Share aviation experiences and safety information
- **Content Blocks**: Dynamic page content management
- **Responsive Design**: Mobile-friendly interface with dark mode support

## Technology Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling with custom aviation theme
- **shadcn/ui** component library
- **Google Maps JavaScript API** for flight visualization
- **React Query** for efficient data fetching
- **Wouter** for client-side routing

### Backend
- **Node.js** with Express server
- **PostgreSQL** database with Neon hosting
- **Drizzle ORM** for type-safe database operations
- **Session-based authentication** with Passport.js
- **TypeScript** for full-stack type safety

### Infrastructure
- **Vite** for fast development and building
- **Full-stack integration** with shared types
- **Environment-based configuration**
- **Hot module replacement** for development

## Database Schema

### Core Tables
- `users` - User authentication and profiles
- `family_members` - Family member information with roles
- `flights` - Comprehensive flight records with timing data
- `airports` - Airport information with coordinates
- `posts` - Blog posts and content
- `blocks` - Dynamic page content blocks

### Key Features
- Foreign key relationships ensuring data integrity
- Optimized indexes for flight date and airport queries
- Support for complex flight routing and multi-leg journeys

## Flight Map Features

### Route Visualization
- **Curved Offset Paths**: Round-trip flights display as parallel curved lines
- **Airport Color Coding**: 
  - Green: Departure airports
  - Red: Arrival airports  
  - Orange: Airports with same-day takeoffs and landings
- **Smooth Geodesic Rendering**: Natural Earth curvature following great circle routes
- **Tapered Offsets**: Maximum separation in middle, connecting at actual airports

### Interactive Elements
- **Dynamic Bounds Fitting**: Automatic map zooming to show all flight activity
- **Airport Markers**: Clickable markers with airport information
- **Real-time Updates**: Live updates when selecting different dates
- **Responsive Design**: Optimized for various screen sizes

## Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL database (Neon recommended)
- Google Maps API key

### Installation
```bash
npm install
```

### Environment Variables
Create `.env` file with:
```
DATABASE_URL=your_postgresql_connection_string
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

### Development
```bash
npm run dev
```

### Database Setup
```bash
npm run db:push
```

## Project Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Route components
│   │   ├── hooks/          # Custom React hooks
│   │   └── lib/            # Utilities and configurations
├── server/                 # Express backend
│   ├── routes.ts          # API route definitions
│   ├── storage.ts         # Database operations
│   └── index.ts           # Server entry point
├── shared/                 # Shared types and schemas
│   └── schema.ts          # Database schema and types
└── README.md
```

## Flight Data Import

The application supports importing flight data from Excel files with the following Python scripts:
- `server/import-flight-data.py` - Basic flight data import
- `server/comprehensive-airport-db.py` - Enhanced import with airport creation
- `server/optimized-flight-import.py` - Batch processing for large datasets

## Contributing

This is a family project focused on aviation tracking and communication. The codebase emphasizes:
- Type safety throughout the stack
- Responsive design principles
- Real-world aviation data accuracy
- User-friendly interfaces for non-technical family members

## License

Private family project - not licensed for public use.