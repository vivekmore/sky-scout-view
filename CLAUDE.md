# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Sky Scout View is a real-time weather monitoring dashboard for skydiving operations. It displays wind conditions, forecasts, and weather data from Ambient Weather stations via WebSocket and REST API connections. The application is built with React, TypeScript, and Vite.

## Common Development Commands

```bash
# Development
npm run dev              # Start dev server on port 8080

# Building
npm run build            # Production build
npm run build:pages      # Build for GitHub Pages (copies index.html to 404.html)
npm run build:dev        # Development mode build
npm run preview          # Preview production build locally

# Code Quality
npm run lint             # Run ESLint
npm run lint:fix         # Run ESLint with auto-fix
npm run format           # Format code with Prettier
npm run format:check     # Check formatting without writing

# Git Hooks
npm run prepare          # Install lefthook hooks
```

## Architecture

### Data Flow

The application uses a **WebSocket-first architecture** with REST API fallback:

1. **WebSocketContext** (`src/contexts/WeatherWebSocketContext.tsx`) - Global state provider that:
   - Connects to Ambient Weather WebSocket API
   - Maintains latest weather data and message history (last 100 samples)
   - Provides real-time updates to all components
   - Auto-cleans data older than 30 minutes

2. **Weather Service** (`src/services/weatherService.ts`) - REST API client for:
   - Device discovery
   - Historical data fetching
   - Configuration management (stored in localStorage)
   - Mock data generation for development

3. **Hook Pattern** (`src/hooks/useWebSocketWindData.ts`, `src/hooks/useWindData.ts`):
   - Hooks consume WebSocket context
   - Calculate rolling averages (5min, 10min, 20min)
   - Provide computed wind statistics

### Component Structure

```
src/
├── components/
│   ├── ui/              # shadcn/ui components (generated, customizable)
│   ├── wind/            # Wind-specific components (compass, indicators)
│   ├── layout/          # Layout components (AppLayout)
│   ├── WeatherDashboard.tsx     # Main dashboard view
│   ├── WeatherContent.tsx       # Content wrapper
│   └── WindChart.tsx            # Time-series wind visualization
├── contexts/
│   └── WeatherWebSocketContext.tsx  # Global WebSocket state
├── hooks/
│   ├── useWebSocketWindData.ts  # WebSocket-based wind data hook
│   └── useWindData.ts           # Legacy polling-based hook
├── services/
│   ├── ambientWeatherWebSocket.ts  # WebSocket connection manager
│   └── weatherService.ts           # REST API client
├── types/
│   └── weather.ts       # TypeScript type definitions
└── pages/
    ├── Index.tsx        # Dashboard route (/dashboard)
    ├── SimpleView.tsx   # Simple view route (/)
    └── NotFound.tsx     # 404 page
```

### Routing and Deployment

**Base URL Handling**: The app uses dynamic base path configuration (see `vite.config.ts` and `src/App.tsx`):
- Dev mode: `/`
- Local builds: `./` (relative paths)
- GitHub Pages: `/<repo-name>/` (auto-detected from `GITHUB_REPOSITORY` env var)
- Root GitHub Pages sites (`*.github.io`): `/`

**Routes**:
- `/` - SimpleView (primary view)
- `/dashboard` - Full dashboard with charts
- `*` - 404 page

To test routing locally after build:
```bash
npm run build
npx serve -s dist
```

## Key Technical Details

### WebSocket Connection

The Ambient Weather WebSocket API requires:
- API Key and Application Key (stored in localStorage)
- MAC address of the weather station
- Connection established via `src/services/ambientWeatherWebSocket.ts`
- Auto-reconnection with exponential backoff
- Message format: `{ windspeedmph, winddir, windgustmph, dateutc, macAddress }`

### Wind Calculations

Wind averaging uses circular mean for direction (handles 359° → 1° wrap-around correctly):
```typescript
// See src/hooks/useWebSocketWindData.ts
function calculateCircularMean(angles: number[]): number {
  const radians = angles.map(a => a * Math.PI / 180);
  const sinSum = radians.reduce((sum, r) => sum + Math.sin(r), 0);
  const cosSum = radians.reduce((sum, r) => sum + Math.cos(r), 0);
  return (Math.atan2(sinSum, cosSum) * 180 / Math.PI + 360) % 360;
}
```

### State Management

- **WebSocket State**: React Context (`WeatherWebSocketContext`)
- **Local State**: React hooks (useState, useEffect)
- **Server State**: React Query (for potential REST API calls)
- **Config Storage**: localStorage for API credentials

### Styling

Uses **shadcn/ui** with Tailwind CSS:
- Theme colors defined in `src/index.css` using CSS variables
- Custom breakpoints: `xs` (400px), `3xl` (1920px), `4xl` (2560px), `5xl` (3840px)
- Dark mode support via `darkMode: ["class"]`
- All UI components are in `src/components/ui/` and can be customized

## Git Workflow

**Pre-commit hooks** (via lefthook):
1. Prettier formats all staged files
2. ESLint auto-fixes staged files
3. Both automatically stage the fixed files

To bypass hooks (not recommended):
```bash
git commit --no-verify
```

## Environment Variables

No `.env` file needed for basic operation. API credentials are stored in localStorage.

For development with custom API endpoints, you can use:
```bash
# Not currently used, but available for future needs
VITE_API_BASE_URL=https://custom-api.example.com
```

## Common Tasks

### Adding a New Weather Metric

1. Update `WeatherData` interface in `src/contexts/WeatherWebSocketContext.tsx`
2. Extract the new field in `handleMessage` callback
3. Add display component in `src/components/`
4. Consume via `useWeatherWebSocket()` hook

### Modifying Wind Calculations

1. Edit calculation logic in `src/hooks/useWebSocketWindData.ts`
2. Update `WindAverages` type in `src/types/weather.ts` if adding new fields
3. Update consuming components to display new values

### Changing API Configuration

API config is hardcoded with fallback in `weatherService.getConfig()`:
```typescript
apiKey: "0116a8e2bd0e41acb8df02b2821eedbbad89280a712f425b9b47809ee61bf5b2"
applicationKey: "dd3dd1d0c9de43afb0a08324da83706dbe4fe8b4852349b88bddc2793ed14732"
macAddress: "EC:64:C9:F1:82:EA"
```

To change: Either update localStorage or modify the fallback values in `weatherService.ts:50-53`.

## Technology Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Component library
- **React Router v6** - Client-side routing
- **React Query** - Server state management
- **socket.io-client** - WebSocket connections
- **Recharts** - Data visualization
- **date-fns** - Date manipulation
- **Lucide React** - Icon library

## Project History

This project was originally planned as a comprehensive skydiving gear inventory management application (see `project.md` for the full specification). The current implementation focuses on real-time weather monitoring for dropzone operations.
