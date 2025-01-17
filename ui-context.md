# EV Dashboard UI Implementation Guide

## Project Overview
A React-based dashboard for visualizing and managing EV (Electric Vehicle) data from multiple OEM providers (Switch and Tata).

## Backend API Endpoints
Base URL: `https://ev-data-transformer-b24e8690fbba.herokuapp.com`

### 1. Vehicle Overview Endpoint
```
GET /dashboard/overview
```
Returns aggregated statistics about vehicles including:
- Total number of vehicles
- Active/Inactive vehicles count
- Latest data timestamp
- Earliest data timestamp

### 2. Vehicle Data List Endpoint
```
GET /dashboard/data
```
Parameters:
- `page` (default: 1)
- `limit` (default: 100, max: 1000)
- `oem_provider` (optional)
- `vehicle_id` (optional)
- `start_date` (optional, ISO format)
- `end_date` (optional, ISO format)

Response Format:
```json
{
    "data": [
        {
            "vehicle_id": "string",
            "registration_number": "string",
            "timestamp": "ISO datetime",
            "latitude": float,
            "longitude": float,
            "speed": float,
            "odometer": float,
            "battery_soc": integer,
            "ignition_status": boolean,
            "charging_status": integer,
            "distance_to_empty": float,
            "vehicle_status": string,
            "oem_provider": string
        }
    ],
    "pagination": {
        "page": integer,
        "per_page": integer,
        "total_pages": integer,
        "total_records": integer
    }
}
```

## Technical Stack
1. **Core Technologies**:
   - React 18+
   - TypeScript
   - Material UI v5
   - React Router v6
   - Axios for API calls

2. **Additional Libraries**:
   - @nivo/core, @nivo/line for charts
   - date-fns for date manipulation
   - react-query for API state management
   - @mui/x-data-grid for data tables

## Project Structure
```
src/
├── components/
│   ├── layout/
│   │   ├── DashboardLayout.tsx
│   │   ├── Sidebar.tsx
│   │   └── Header.tsx
│   ├── dashboard/
│   │   ├── VehicleOverview.tsx
│   │   ├── VehicleList.tsx
│   │   ├── VehicleMap.tsx
│   │   └── Charts/
│   │       ├── BatteryChart.tsx
│   │       └── SpeedChart.tsx
│   └── common/
│       ├── LoadingSpinner.tsx
│       ├── ErrorBoundary.tsx
│       └── Pagination.tsx
├── services/
│   ├── api.ts
│   └── types.ts
├── hooks/
│   ├── useVehicleData.ts
│   └── useVehicleStats.ts
├── utils/
│   ├── dateUtils.ts
│   └── formatters.ts
└── pages/
    ├── Dashboard.tsx
    ├── VehicleDetails.tsx
    └── Settings.tsx
```

## Features & Components

### 1. Dashboard Overview
- Total vehicles count card
- Active vehicles count card
- Battery status distribution chart
- Vehicle status distribution chart
- Latest data timestamp
- Map showing vehicle locations

### 2. Vehicle List
- Paginated table of vehicles
- Columns:
  - Vehicle ID
  - Registration Number
  - Status
  - Battery Level
  - Last Updated
  - Location
  - Actions
- Filters:
  - OEM Provider
  - Status
  - Date Range
- Sorting capabilities
- Export functionality

### 3. Vehicle Details
- Detailed view of single vehicle
- Historical data charts
- Location history
- Status history
- Battery level trend

### 4. Maps Integration
- Show all vehicles on map
- Cluster markers for multiple vehicles
- Color coding based on status
- Popup with quick info

## UI/UX Guidelines

### 1. Color Scheme
```css
:root {
  --primary: #1976d2;
  --secondary: #dc004e;
  --success: #4caf50;
  --warning: #ff9800;
  --error: #f44336;
  --background: #f5f5f5;
  --paper: #ffffff;
  --text-primary: rgba(0, 0, 0, 0.87);
  --text-secondary: rgba(0, 0, 0, 0.6);
}
```

### 2. Status Colors
- Active: #4caf50
- Inactive: #f44336
- Charging: #2196f3
- Moving: #ff9800
- Stopped: #757575

### 3. Typography
- Font Family: Roboto
- Sizes:
  - Heading 1: 24px
  - Heading 2: 20px
  - Body: 16px
  - Small: 14px

## Implementation Steps

### Phase 1: Setup & Basic Structure
1. Create new React project with TypeScript
2. Set up Material UI
3. Implement basic routing
4. Create layout components
5. Set up API service

### Phase 2: Core Features
1. Implement dashboard overview
2. Create vehicle list with pagination
3. Add filtering and sorting
4. Implement basic charts

### Phase 3: Advanced Features
1. Add map integration
2. Implement vehicle details view
3. Add historical data charts
4. Create export functionality

### Phase 4: Polish & Optimization
1. Add loading states
2. Implement error handling
3. Add responsive design
4. Optimize performance

## API Integration

### 1. API Service Setup
```typescript
// services/api.ts
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL;

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

export const getVehicleData = async (params: VehicleDataParams) => {
  const response = await api.get('/dashboard/data', { params });
  return response.data;
};

export const getVehicleOverview = async () => {
  const response = await api.get('/dashboard/overview');
  return response.data;
};
```

### 2. Data Types
```typescript
// services/types.ts
export interface VehicleData {
  vehicle_id: string;
  registration_number: string;
  timestamp: string;
  latitude: number;
  longitude: number;
  speed: number;
  odometer: number;
  battery_soc: number;
  ignition_status: boolean;
  charging_status: number;
  distance_to_empty: number;
  vehicle_status: string;
  oem_provider: string;
}

export interface PaginationData {
  page: number;
  per_page: number;
  total_pages: number;
  total_records: number;
}

export interface VehicleDataResponse {
  data: VehicleData[];
  pagination: PaginationData;
}

export interface VehicleDataParams {
  page?: number;
  limit?: number;
  oem_provider?: string;
  vehicle_id?: string;
  start_date?: string;
  end_date?: string;
}
```

## Deployment Guide

### 1. Environment Setup
Create `.env` files for different environments:

```env
# .env.development
REACT_APP_API_URL=http://localhost:5000

# .env.production
REACT_APP_API_URL=https://ev-data-transformer-b24e8690fbba.herokuapp.com
```

### 2. Build Configuration
```json
// package.json
{
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "engines": {
    "node": "16.x",
    "npm": "8.x"
  }
}
```

### 3. Heroku Setup
1. Create new Heroku app
2. Set buildpack to Node.js
3. Configure environment variables
4. Enable automatic deploys from GitHub

### 4. CORS Configuration
Ensure the Flask backend allows requests from the React frontend domain:

```python
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={
    r"/dashboard/*": {"origins": [
        "http://localhost:3000",
        "https://your-frontend-domain.herokuapp.com"
    ]}
})
```

## Performance Considerations

1. **Data Loading**:
   - Implement pagination for large datasets
   - Use React Query for caching
   - Add loading states
   - Implement error boundaries

2. **Rendering**:
   - Use virtualization for long lists
   - Implement memo for expensive components
   - Lazy load routes and components

3. **State Management**:
   - Use React Query for server state
   - Implement local storage for filters
   - Use context for theme/global state

## Testing Strategy

1. **Unit Tests**:
   - Test utility functions
   - Test hooks
   - Test components in isolation

2. **Integration Tests**:
   - Test API integration
   - Test component interactions
   - Test routing

3. **E2E Tests**:
   - Test critical user flows
   - Test data visualization
   - Test filtering and pagination

## Security Considerations

1. **API Security**:
   - Implement proper CORS
   - Use environment variables
   - Sanitize user inputs

2. **Data Handling**:
   - Validate API responses
   - Handle sensitive data properly
   - Implement proper error handling

## Monitoring & Analytics

1. **Error Tracking**:
   - Implement error boundary
   - Add error logging
   - Track API failures

2. **Performance Monitoring**:
   - Track page load times
   - Monitor API response times
   - Track user interactions

## Future Enhancements

1. **Features**:
   - Real-time updates
   - Advanced filtering
   - Custom dashboards
   - Data export

2. **Technical**:
   - PWA support
   - Offline capabilities
   - Advanced caching
   - Performance optimizations 