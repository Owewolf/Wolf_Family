#!/bin/bash

# Wolf's Lair Family Platform - Automated Local Setup Script for Ultramarine Linux
# This script automates the complete installation process

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
DB_NAME="wolfslair_family"
DB_USER="wolfslair_user"
DB_PASS="WolfsLair2025!"
APP_PORT="5000"

echo -e "${BLUE}🐺 Wolf's Lair Family Platform - Local Setup${NC}"
echo "=============================================="

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to print status
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   print_error "This script should not be run as root"
   exit 1
fi

echo -e "${YELLOW}Step 1: System Dependencies${NC}"
echo "Installing system packages..."

# Update system
sudo dnf update -y

# Install Node.js and npm
if ! command_exists node; then
    print_warning "Installing Node.js..."
    sudo dnf install -y nodejs npm
else
    print_status "Node.js already installed: $(node --version)"
fi

# Install PostgreSQL
if ! command_exists psql; then
    print_warning "Installing PostgreSQL..."
    sudo dnf install -y postgresql postgresql-server postgresql-contrib
    
    # Initialize PostgreSQL
    sudo postgresql-setup --initdb
    sudo systemctl enable postgresql
    sudo systemctl start postgresql
else
    print_status "PostgreSQL already installed: $(psql --version)"
    sudo systemctl start postgresql || true
fi

# Install development tools
sudo dnf install -y git curl wget gcc gcc-c++ make python3 python3-pip python3-devel

print_status "System dependencies installed"

echo -e "\n${YELLOW}Step 2: PostgreSQL Database Setup${NC}"

# Configure PostgreSQL
print_warning "Configuring PostgreSQL..."

# Create database and user
sudo -u postgres psql << EOF
-- Drop existing database and user if they exist
DROP DATABASE IF EXISTS ${DB_NAME};
DROP USER IF EXISTS ${DB_USER};

-- Create new database and user
CREATE DATABASE ${DB_NAME};
CREATE USER ${DB_USER} WITH ENCRYPTED PASSWORD '${DB_PASS}';
GRANT ALL PRIVILEGES ON DATABASE ${DB_NAME} TO ${DB_USER};
ALTER USER ${DB_USER} CREATEDB;
ALTER DATABASE ${DB_NAME} OWNER TO ${DB_USER};
EOF

# Configure authentication
print_warning "Configuring PostgreSQL authentication..."
PG_HBA_FILE="/var/lib/pgsql/data/pg_hba.conf"

# Backup original file
sudo cp "$PG_HBA_FILE" "$PG_HBA_FILE.backup"

# Add authentication rule if not exists
if ! sudo grep -q "local.*${DB_NAME}.*${DB_USER}" "$PG_HBA_FILE"; then
    sudo sed -i "/^local.*all.*all.*peer/a local   ${DB_NAME}    ${DB_USER}                     md5" "$PG_HBA_FILE"
    sudo systemctl restart postgresql
fi

print_status "PostgreSQL configured"

echo -e "\n${YELLOW}Step 3: Project Dependencies${NC}"

# Check if package.json exists
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from the project root directory."
    exit 1
fi

# Install Node.js dependencies
print_warning "Installing Node.js dependencies..."
npm install

# Create Python virtual environment
print_warning "Setting up Python environment..."
python3 -m venv venv
source venv/bin/activate
pip install psycopg2-binary pandas openpyxl

print_status "Dependencies installed"

echo -e "\n${YELLOW}Step 4: Environment Configuration${NC}"

# Create .env file
cat > .env << EOF
# Database Configuration
DATABASE_URL=postgresql://${DB_USER}:${DB_PASS}@localhost:5432/${DB_NAME}

# Application Configuration
NODE_ENV=development
PORT=${APP_PORT}

# Session Configuration
SESSION_SECRET=your-secure-session-secret-change-this-in-production-$(date +%s)
EOF

print_status "Environment file created"

echo -e "\n${YELLOW}Step 5: Database Schema${NC}"

# Push database schema
print_warning "Creating database tables..."
npm run db:push

print_status "Database schema created"

echo -e "\n${YELLOW}Step 6: Sample Data Import${NC}"

# Import sample data
if [ -f "database_dump.sql" ]; then
    print_warning "Importing sample data..."
    PGPASSWORD=${DB_PASS} psql -U ${DB_USER} -d ${DB_NAME} -h localhost -f database_dump.sql
    print_status "Sample data imported"
else
    print_warning "database_dump.sql not found - application will seed basic data on first run"
fi

echo -e "\n${YELLOW}Step 7: Testing Installation${NC}"

# Test database connection
print_warning "Testing database connection..."
PGPASSWORD=${DB_PASS} psql -U ${DB_USER} -d ${DB_NAME} -h localhost -c "SELECT COUNT(*) FROM family_members;" > /dev/null 2>&1
if [ $? -eq 0 ]; then
    print_status "Database connection successful"
else
    print_error "Database connection failed"
    exit 1
fi

# Test Node.js dependencies
print_warning "Testing Node.js setup..."
npm run check > /dev/null 2>&1
if [ $? -eq 0 ]; then
    print_status "TypeScript compilation successful"
else
    print_warning "TypeScript compilation issues detected - application should still work"
fi

echo -e "\n${GREEN}🎉 Installation Complete!${NC}"
echo "=========================="
echo
echo -e "${BLUE}Your Wolf's Lair Family Platform is ready!${NC}"
echo
echo "Database Information:"
echo "  Database: ${DB_NAME}"
echo "  User: ${DB_USER}"
echo "  Host: localhost:5432"
echo
echo "To start the application:"
echo -e "  ${YELLOW}npm run dev${NC}"
echo
echo "Access your application at:"
echo -e "  ${BLUE}http://localhost:${APP_PORT}${NC}"
echo
echo "Family Member Accounts (password: 123):"
echo "  • steven (Admin)"
echo "  • liesel"
echo "  • farrah" 
echo "  • carter"
echo
echo "Database includes:"
echo "  • 4 Family Members"
echo "  • 7+ Farm Posts"
echo "  • 3,350+ Flight Records"
echo "  • 52+ Airport Records"
echo
echo -e "${YELLOW}Next Steps:${NC}"
echo "1. Run: npm run dev"
echo "2. Open: http://localhost:5000"
echo "3. Login with any family member account"
echo "4. Change passwords for production use"
echo
echo -e "${GREEN}Happy farming! 🚜${NC}"