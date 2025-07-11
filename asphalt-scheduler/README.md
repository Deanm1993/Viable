# Asphalt Pro - Job Scoping & Scheduling Application

A comprehensive Next.js TypeScript application designed specifically for asphalt contractors to scope, schedule, and manage asphalt jobs efficiently. Built with mobile-first design for use on job sites with tablets and phones.

## 🚀 Features

### Core Features

#### 1. **Multi-Step Job Scoping Form**
- **Location & Site Details**: Address input with Google Maps integration, site restrictions (truck access), hazard identification, and day/night shift selection
- **Job Type & Measurements**: Visual job type selection (Mill & Fill, Overlay, Resheet, etc.) with automatic tonnage calculations
- **Materials & Specifications**: Asphalt mix selection (AC10, AC14, AC20, SMA), specification standards, and supplier management
- **Resources Required**: Equipment checklist (pavers, rollers, sweepers), services (traffic control, testing), and crew requirements
- **Assignment & Scheduling**: Customer selection, crew assignment, and scheduling with duration estimates

#### 2. **Intelligent Calculations**
- **Automatic tonnage calculations** using industry-standard formulas (area × depth × 2.4 density)
- **Truck load calculations** based on vehicle capacity
- **Duration estimates** based on crew size and job complexity
- **Real-time validation** with smart warnings for unusual specifications

#### 3. **Smart Defaults & Recommendations**
- Auto-populate equipment based on job type (e.g., Mill & Fill adds sweeper)
- Night shift penalty rate calculations (+25%)
- Specification recommendations (e.g., SMA defaults to RMS spec)
- Site hazard-based equipment suggestions

#### 4. **Mobile-First Design**
- **Touch-optimized interface** with large tap targets (44px minimum)
- **Responsive layout** that works on phones, tablets, and desktop
- **Offline-ready architecture** for site visits without internet
- **Progressive Web App** capabilities for native-like experience

### Technical Stack

- **Frontend**: Next.js 14 with TypeScript and App Router
- **Styling**: Tailwind CSS with Shadcn UI components
- **Backend**: Supabase (PostgreSQL) with Row Level Security
- **Authentication**: Supabase Auth
- **Maps**: Google Maps API integration (planned)
- **State Management**: React hooks and local state
- **Forms**: React Hook Form with Zod validation

## 🛠️ Setup Instructions

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

### 1. Clone and Install

```bash
git clone <repository-url>
cd asphalt-scheduler
npm install
```

### 2. Environment Configuration

Copy the example environment file:

```bash
cp .env.example .env.local
```

Update `.env.local` with your configuration:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-key
```

### 3. Database Setup

1. Create a new Supabase project
2. Run the SQL schema from `database/schema.sql` in your Supabase SQL editor
3. The schema includes:
   - All necessary tables with proper relationships
   - Row Level Security policies
   - Sample data for development
   - Automatic job number generation

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📱 Mobile Usage

This application is designed for field use on construction sites:

- **Touch-friendly interface** with large buttons and form fields
- **Portrait and landscape orientations** supported
- **Works offline** for basic form completion (sync when connected)
- **Photo capture** for site conditions (coming soon)
- **GPS location** integration for accurate site positioning

## 🗄️ Database Schema

### Core Tables

- **companies**: Multi-tenant support for contractor businesses
- **customers**: Client management with contact details
- **job_scopes**: Main job data with measurements and requirements
- **suppliers**: Mix suppliers and tip sites with rates
- **calendar_events**: Scheduling and crew assignments

### Key Features

- **Row Level Security**: Data isolation between companies
- **Automatic timestamps**: Created/updated tracking
- **JSONB fields**: Flexible storage for equipment and site restrictions
- **UUID primary keys**: Scalable and secure identifiers

## 🧮 Calculation Engine

### Tonnage Formula
```
Tonnage = Area (m²) × Depth (mm) × 2.4 (density factor) / 1000
```

### Truck Loads
```
Truck Loads = Tonnage ÷ Truck Capacity (default 25t)
```

### Duration Estimate
```
Duration = Tonnage ÷ (Crew Size × Hourly Rate)
```

## 🎯 Smart Features

### Validation Warnings
- Paving thickness validation (25-100mm recommended)
- Truck capacity vs tonnage checking
- Mix type appropriateness for thickness
- Site access vs truck type compatibility

### Auto-Population
- Equipment requirements based on job type
- Specification defaults based on mix selection
- Penalty rates for night work
- Crew size recommendations

## 🔧 Development

### Project Structure

```
src/
├── app/                 # Next.js App Router pages
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (Button, Input, etc.)
│   ├── layout/         # Layout components
│   └── job-scoping/    # Job scoping form steps
├── lib/                # Utilities and configuration
├── types/              # TypeScript type definitions
└── globals.css         # Global styles
```

### Key Components

- **MainLayout**: Responsive sidebar navigation
- **JobScopingForm**: Multi-step form with progress tracking
- **LocationStep**: Address and site restriction input
- **JobDetailsStep**: Measurements with real-time calculations
- **MaterialsStep**: Mix types and supplier selection
- **ResourcesStep**: Equipment and services checklist
- **AssignmentStep**: Customer and crew assignment

## 🚧 Future Enhancements

### Planned Features
- **Calendar View**: Drag-and-drop job scheduling
- **Google Maps Integration**: Interactive site mapping and markup
- **Photo Management**: Site condition documentation
- **PDF Quote Generation**: Professional quote exports
- **Weather Integration**: Weather warnings on calendar
- **Crew Availability**: Real-time crew scheduling
- **Material Tracking**: Supplier inventory integration
- **Cost Estimation**: Automated pricing calculations

### Technical Improvements
- Progressive Web App (PWA) implementation
- Offline sync capabilities
- Real-time collaboration features
- Advanced reporting and analytics
- Integration with accounting software

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please read the contributing guidelines before submitting pull requests.

## 📞 Support

For support and questions, please open an issue on GitHub or contact the development team.

---

Built with ❤️ for asphalt contractors who need efficient, mobile-friendly job management tools.
