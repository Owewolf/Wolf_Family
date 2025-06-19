# Wolf's Lair Family Platform - Local Installation Guide for Ultramarine Linux

## System Overview
This is a comprehensive family and farm management platform built with:
- **Frontend:** React 18 + TypeScript + Vite
- **Backend:** Node.js + Express + TypeScript
- **Database:** PostgreSQL 15+
- **UI Framework:** Tailwind CSS + shadcn/ui components
- **Authentication:** Passport.js with local strategy

## Current Database Statistics
- **Family Members:** 4 records
- **Posts:** 7 records
- **Flights:** 3,350 records
- **Airports:** 52 records
- **Blocks:** 4 records
- **Users:** Data available

---

## 1. System Dependencies Installation

### Update System
```bash
sudo dnf update -y
```

### Install Core Dependencies
```bash
# Node.js 20.x (LTS)
sudo dnf install -y nodejs npm

# PostgreSQL Database
sudo dnf install -y postgresql postgresql-server postgresql-contrib

# Development Tools
sudo dnf install -y git curl wget gcc gcc-c++ make

# Python (for data import scripts)
sudo dnf install -y python3 python3-pip python3-devel

# Optional: Development tools
sudo dnf groupinstall -y "Development Tools"
```

### Verify Installations
```bash
node --version    # Should be >= 20.x
npm --version     # Should be >= 10.x
psql --version    # Should be >= 15.x
python3 --version # Should be >= 3.11
```

---

## 2. PostgreSQL Database Setup

### Initialize PostgreSQL
```bash
# Initialize database cluster
sudo postgresql-setup --initdb

# Enable and start PostgreSQL
sudo systemctl enable postgresql
sudo systemctl start postgresql

# Check status
sudo systemctl status postgresql
```

### Create Database and User
```bash
# Switch to postgres user
sudo -u postgres psql

# In PostgreSQL prompt:
CREATE DATABASE wolfslair_family;
CREATE USER wolfslair_user WITH ENCRYPTED PASSWORD 'WolfsLair2025!';
GRANT ALL PRIVILEGES ON DATABASE wolfslair_family TO wolfslair_user;
ALTER USER wolfslair_user CREATEDB;
\q
```

### Configure PostgreSQL Authentication
```bash
# Edit pg_hba.conf
sudo nano /var/lib/pgsql/data/pg_hba.conf

# Add this line after the existing local connections:
local   wolfslair_family    wolfslair_user                     md5

# Restart PostgreSQL
sudo systemctl restart postgresql
```

### Test Database Connection
```bash
psql -U wolfslair_user -d wolfslair_family -h localhost
# Enter password: WolfsLair2025!
# If successful, you'll see the PostgreSQL prompt
\q
```

---

## 3. Project Setup

### Clone/Download Project
```bash
# If you have the project files, create the directory structure:
mkdir -p ~/wolfslair-family-platform
cd ~/wolfslair-family-platform

# Your project should have this structure:
```

## Project Directory Structure
```
wolfslair-family-platform/
│
├── client/                          # Frontend React application
│   ├── src/                        # React source files
│   └── index.html                  # HTML template
│
├── server/                          # Backend Express server
│   ├── index.ts                    # Main server entry point
│   ├── routes.ts                   # API routes
│   ├── storage.ts                  # Database operations
│   ├── db.ts                       # Database connection
│   ├── seed.ts                     # Database seeding
│   ├── vite.ts                     # Vite integration
│   ├── *.py                        # Python data import scripts
│   └── ...
│
├── shared/                          # Shared TypeScript definitions
│   └── schema.ts                   # Database schema & types
│
├── dist/                           # Built application (generated)
├── node_modules/                   # Dependencies (generated)
│
├── package.json                    # Node.js dependencies
├── package-lock.json              # Dependency lock file
├── tsconfig.json                   # TypeScript configuration
├── vite.config.ts                  # Vite build configuration
├── tailwind.config.ts              # Tailwind CSS configuration
├── drizzle.config.ts               # Database migration config
├── postcss.config.js               # PostCSS configuration
└── components.json                 # shadcn/ui configuration
```

### Install Python Dependencies
```bash
# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install Python packages for data scripts
pip install psycopg2-binary pandas openpyxl
```

### Install Node.js Dependencies
```bash
# Install all dependencies
npm install

# Verify installation
npm list --depth=0
```

---

## 4. Environment Configuration

### Create Environment File
```bash
# Create .env file in project root
cat > .env << 'EOF'
# Database Configuration
DATABASE_URL=postgresql://wolfslair_user:WolfsLair2025!@localhost:5432/wolfslair_family

# Application Configuration
NODE_ENV=development
PORT=5000

# Session Configuration
SESSION_SECRET=your-secure-session-secret-change-this-in-production
EOF
```

---

## 5. Database Schema and Data Import

### Create Database Tables
```bash
# Push database schema to PostgreSQL
npm run db:push
```

### Import Sample Data
The application includes seed data that will be automatically loaded on first run. This includes:

**Family Members (4 records):**
- Steven (Farm Owner & Head of Operations)
- Liesel (Wife & Farm Co-Manager) 
- Farrah (Daughter + Head Lab Technician)
- Carter (Son + Future Farmer)

**Posts (7 records):**
- Various farm activities and family updates
- Aviation-related posts
- Community outreach activities
- Lab testing results

**Aviation Data:**
- **Flights:** 3,350 flight records
- **Airports:** 52 airport records with coordinates
- Detailed logbook entries from 1996 onwards

**Content Blocks (4 records):**
- Hero sections and content for the homepage

### Manual Data Import (if needed)
```bash
# If you have Excel files to import:
source venv/bin/activate
python3 server/comprehensive-airport-db.py
```

---

## 6. Application Startup

### Development Mode
```bash
# Start the development server
npm run dev

# This will:
# 1. Start the Express backend on port 5000
# 2. Start the Vite frontend development server
# 3. Enable hot-reload for both frontend and backend
# 4. Automatically seed the database if empty
```

### Production Build
```bash
# Build the application
npm run build

# Start production server
npm start
```

### Verify Installation
```bash
# Check if application is running
curl http://localhost:5000/api/family-members

# Should return JSON with family member data
```

---

## 7. Access the Application

### Local Development
- **Frontend:** http://localhost:5000
- **API Endpoints:** http://localhost:5000/api/*
- **Database:** localhost:5432/wolfslair_family

### Available Features
- **Family Dashboard:** View family member profiles
- **Aviation Logbook:** Browse 3,350+ flight records
- **Farm Posts:** Read family updates and farm activities
- **Interactive Calendar:** Track activities and events
- **Responsive Design:** Works on desktop and mobile

---

## 8. Database Management

### Useful PostgreSQL Commands
```bash
# Connect to database
psql -U wolfslair_user -d wolfslair_family -h localhost

# View tables
\dt

# Check record counts
SELECT 
  'family_members' as table_name, COUNT(*) as count FROM family_members
UNION ALL
SELECT 'posts', COUNT(*) FROM posts
UNION ALL  
SELECT 'flights', COUNT(*) FROM flights
UNION ALL
SELECT 'airports', COUNT(*) FROM airports;

# Exit PostgreSQL
\q
```

### Backup Database
```bash
# Create backup
pg_dump -U wolfslair_user -h localhost wolfslair_family > wolfslair_backup.sql

# Restore backup (if needed)
psql -U wolfslair_user -h localhost wolfslair_family < wolfslair_backup.sql
```

---

## 9. Development Scripts

### Available npm Commands
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
npm run check    # TypeScript type checking
npm run db:push  # Push schema changes to database
```

### Python Data Import Scripts
```bash
source venv/bin/activate

# Import flight data from Excel
python3 server/import-flight-data.py

# Add airport coordinates
python3 server/add-airport-coordinates.py

# Comprehensive import with error handling
python3 server/comprehensive-airport-db.py
```

---

## 10. Troubleshooting

### Common Issues

**PostgreSQL Connection Error:**
```bash
# Check if PostgreSQL is running
sudo systemctl status postgresql

# Check if user can connect
psql -U wolfslair_user -d wolfslair_family -h localhost
```

**Node.js Permission Errors:**
```bash
# Fix npm permissions
sudo chown -R $(whoami) ~/.npm
sudo chown -R $(whoami) /usr/local/lib/node_modules
```

**Port Already in Use:**
```bash
# Find process using port 5000
sudo lsof -i :5000

# Kill process if needed
sudo kill -9 <PID>
```

**Missing Dependencies:**
```bash
# Clear npm cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Log Files
```bash
# Application logs (in development)
# Check terminal output where npm run dev is running

# PostgreSQL logs
sudo tail -f /var/lib/pgsql/data/log/postgresql-*.log
```

---

## 11. Security Considerations

### Development Environment
- Default passwords are set for development
- Change all passwords before production deployment
- Use environment variables for sensitive data

### Production Deployment
- Use strong passwords
- Enable SSL/TLS
- Configure firewall rules
- Regular security updates

---

## 12. Support and Maintenance

### Regular Maintenance
```bash
# Update system packages
sudo dnf update -y

# Update npm packages
npm update

# Update Python packages
source venv/bin/activate
pip list --outdated
pip install --upgrade package_name
```

### Monitoring
- Check application logs regularly
- Monitor database performance
- Keep backups current

---

This installation guide provides everything needed to run the Wolf's Lair Family Platform on Ultramarine Linux with your complete database including all 3,350+ flight records, 52 airports, family profiles, and farm content.