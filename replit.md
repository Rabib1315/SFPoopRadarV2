# SF Poop Radar - Replit Application Guide

## Overview

SF Poop Radar is a mobile-first web application designed to track and report human and dog waste incidents in San Francisco. The app features a modern, responsive design with a mobile app-like interface that allows users to view incidents on a map, report new incidents, receive alerts, and manage settings.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **Routing**: Wouter for client-side routing
- **State Management**: React Query (@tanstack/react-query) for server state
- **Forms**: React Hook Form with Zod validation
- **UI Components**: Radix UI primitives with shadcn/ui styling
- **Mobile Design**: Custom mobile app container with iPhone-like interface

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (@neondatabase/serverless)
- **API Design**: RESTful API with JSON responses
- **Development**: Vite for frontend bundling and HMR
- **Session Management**: Express sessions with PostgreSQL store

### Build System
- **Bundler**: Vite for client-side, ESBuild for server-side
- **TypeScript**: Strict mode enabled with path mapping
- **Module System**: ES Modules throughout
- **Development**: TSX for TypeScript execution in development

## Key Components

### Database Schema
The application uses three main tables:
- **users**: User authentication and profiles
- **incidents**: Core incident reports with location, type, and status
- **neighborhoods**: SF neighborhood statistics and counts

### API Endpoints
- `GET /api/incidents` - Retrieve all incidents
- `GET /api/incidents/:id` - Get specific incident
- `POST /api/incidents` - Create new incident report
- `GET /api/incidents/recent` - Get recent incidents
- `GET /api/stats/today` - Get today's statistics
- `GET /api/neighborhoods` - Get neighborhood data

### Mobile UI Components
- **Status Bar**: iOS-style status bar with app branding
- **Bottom Navigation**: Tab-based navigation with special "Report Poop" button
- **Mobile Container**: iPhone-like frame with rounded corners
- **Map Container**: Interactive incident map with clickable markers
- **Incident Popup**: Detailed incident information overlay

## Data Flow

1. **User Interaction**: User navigates through mobile interface
2. **Client-side Routing**: Wouter handles page transitions
3. **API Calls**: React Query manages server state and caching
4. **Database Operations**: Drizzle ORM handles PostgreSQL queries
5. **Real-time Updates**: Statistics and incidents update automatically

## External Dependencies

### UI Framework
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first styling
- **Lucide React**: Icon library

### Database & ORM
- **Neon Database**: Serverless PostgreSQL
- **Drizzle ORM**: Type-safe database operations
- **Drizzle Kit**: Database migrations and schema management

### Development Tools
- **Vite**: Frontend build tool with HMR
- **ESBuild**: Fast TypeScript compilation
- **TSX**: TypeScript execution for development

## Deployment Strategy

### Development
- Uses Vite dev server with Express API proxy
- HMR enabled for rapid development
- Replit-specific plugins for error handling

### Production Build
- Frontend built with Vite to `dist/public`
- Backend bundled with ESBuild to `dist/index.js`
- Static files served by Express in production

### Database
- PostgreSQL connection via DATABASE_URL environment variable
- Drizzle migrations in `./migrations` directory
- Schema defined in `shared/schema.ts`

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes

- July 06, 2025: Replaced custom map with Google Maps embedded iframe focused on Tenderloin area
- July 06, 2025: Removed orange plus button from map interface  
- July 06, 2025: Added image upload functionality to incident reports
- July 06, 2025: Enhanced location sharing with improved geolocation detection
- July 06, 2025: Added imageUrl field to incident schema and storage
- July 06, 2025: Implemented automatic neighborhood detection from GPS coordinates
- July 06, 2025: Removed manual location and neighborhood input fields from report form
- July 06, 2025: Updated sample incidents to show properly within Tenderloin area on map
- July 06, 2025: Added location validation to ensure GPS sharing before report submission

## Changelog

Changelog:
- July 06, 2025. Initial setup
- July 06, 2025. Updated map interface and report functionality per user requirements