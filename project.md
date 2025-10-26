# AI Code Generator Prompt: Skydiving Gear Inventory App - React Frontend

## Project Overview

You are tasked with creating a comprehensive React-based frontend for a **Skydiving Gear Inventory Management Application**. This is a desktop application (Electron wrapper) that helps skydivers, riggers, and dropzones track their parachute equipment, parts, maintenance schedules, and safety compliance.

---

## Core Requirements

### Technology Stack

- **React 18+** with functional components and hooks
- **TypeScript** for type safety
- **Tailwind CSS** for styling (use utility classes only)
- **React Router v6** for navigation
- **Axios** for API calls
- **React Query (TanStack Query)** for data fetching and caching
- **React Hook Form** for form validation
- **Zustand** or **Redux Toolkit** for global state management
- **date-fns** for date manipulation
- **Recharts** for data visualization
- **Lucide React** for icons
- **React Hot Toast** for notifications

### Project Structure

```
src/
├── components/
│   ├── common/          # Reusable UI components
│   ├── gear/            # Gear-specific components
│   ├── parts/           # Parts management components
│   ├── maintenance/     # Maintenance tracking components
│   └── layout/          # Layout components (Header, Sidebar, etc.)
├── pages/               # Route pages
├── services/            # API service layer
├── hooks/               # Custom React hooks
├── store/               # State management
├── types/               # TypeScript type definitions
├── utils/               # Utility functions
├── constants/           # Constants and enums
└── assets/              # Static assets
```

---

## Detailed Feature Requirements

### 1. Dashboard Page (`/dashboard`)

**Purpose**: Overview of gear status, upcoming maintenance, and alerts

**Components to create**:

- `DashboardPage.tsx` - Main dashboard container
- `SummaryCards.tsx` - Display key metrics (total gear, items due for maintenance, overdue items, recent usage)
- `MaintenanceCalendar.tsx` - Calendar view of upcoming maintenance
- `AlertsPanel.tsx` - Critical alerts (overdue maintenance, expiring gear)
- `RecentActivity.tsx` - Recent usage logs and maintenance performed
- `QuickActions.tsx` - Quick access buttons (Add Gear, Log Jump, etc.)

**Data to display**:

```typescript
interface DashboardSummary {
  totalGearItems: number;
  totalParts: number;
  maintenanceDueSoon: number;
  maintenanceOverdue: number;
  activeGear: number;
  retiredGear: number;
  totalJumps: number;
  recentActivity: Activity[];
  upcomingMaintenance: MaintenanceItem[];
  criticalAlerts: Alert[];
}
```

**Visual Requirements**:

- Use card-based layout with shadow and rounded corners
- Color-coded status indicators:
  - Green: OK/Active
  - Yellow: Due soon (within 30 days)
  - Red: Overdue
  - Gray: Retired
- Responsive grid layout (1 column mobile, 2-3 columns tablet/desktop)
- Interactive charts showing gear usage over time

---

### 2. Gear Inventory Page (`/gear`)

**Purpose**: List, search, filter, and manage all gear items

**Components to create**:

- `GearInventoryPage.tsx` - Main container
- `GearList.tsx` - Filterable/sortable table of gear
- `GearCard.tsx` - Card view option for gear items
- `GearFilters.tsx` - Filter by category, status, manufacturer
- `GearSearch.tsx` - Search by name, serial number, model
- `GearModal.tsx` - Add/Edit gear form in modal
- `GearDetails.tsx` - Detailed view of single gear item

**Data Model**:

```typescript
interface GearItem {
  id: string;
  categoryId: string;
  categoryName: string;
  name: string;
  manufacturer: string;
  model: string;
  serialNumber: string;
  purchaseDate: Date;
  purchasePrice: number;
  status: "ACTIVE" | "RETIRED" | "IN_MAINTENANCE";
  location: string;
  notes: string;
  totalJumps?: number;
  nextMaintenanceDate?: Date;
  parts: Part[];
  metadata?: Record<string, any>;
}

interface GearCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
}

// Categories: Main Parachute, Reserve Parachute, Container, AAD, Helmet, Altimeter
```

**Form Fields** (Add/Edit Gear):

- Category (dropdown with icons)
- Name (text input, required)
- Manufacturer (text input or searchable dropdown)
- Model (text input)
- Serial Number (text input, unique validation)
- Purchase Date (date picker)
- Purchase Price (number input with currency)
- Status (radio buttons)
- Location (text input)
- Notes (textarea)
- Upload Photos (file upload - future feature)

**Table Columns**:

- Checkbox (for bulk actions)
- Category icon + Name
- Manufacturer / Model
- Serial Number
- Status badge
- Total Jumps
- Next Maintenance (with countdown indicator)
- Actions (View, Edit, Delete)

**Features**:

- ✅ Toggle between table view and card grid view
- ✅ Multi-select for bulk operations
- ✅ Export to CSV/Excel
- ✅ Inline editing for quick updates
- ✅ Drag-and-drop reordering (optional)
- ✅ Print QR codes for gear labels

---

### 3. Parts Management Page (`/gear/:id/parts`)

**Purpose**: Track individual parts within gear that need separate maintenance

**Components to create**:

- `PartsListPage.tsx` - List all parts for a specific gear item
- `PartCard.tsx` - Display individual part with status
- `PartModal.tsx` - Add/Edit part form
- `PartMaintenanceHistory.tsx` - History timeline for part

**Data Model**:

```typescript
interface Part {
  id: string;
  gearItemId: string;
  gearItemName: string;
  partType: string; // Line Set, Pilot Chute, Closing Loop, Risers, etc.
  name: string;
  manufacturer: string;
  model: string;
  serialNumber?: string;
  installationDate: Date;
  requiresMaintenance: boolean;
  isCritical: boolean; // Safety-critical component
  expiryDate?: Date;
  nextMaintenanceDate?: Date;
  jumpsAtInstallation?: number;
  currentJumps?: number;
  status: "OK" | "DUE_SOON" | "OVERDUE" | "EXPIRED";
  metadata?: Record<string, any>;
}
```

**Part Types** (predefined):

- Main Parachute: Canopy, Line Set, Slider, Pilot Chute
- Reserve Parachute: Canopy, Line Set, Pilot Chute, Freebag
- Container: Closing Loop, Pins, Risers, Main Bridle, Reserve Bridle
- AAD: Battery, Calibration Certificate

**Visual Requirements**:

- Hierarchical view showing gear → parts
- Visual indicators for critical parts
- Countdown timers for expiry dates
- Color-coded status per part
- Quick "Replace Part" action

---

### 4. Maintenance Tracker Page (`/maintenance`)

**Purpose**: Schedule, track, and record maintenance activities

**Components to create**:

- `MaintenanceTrackerPage.tsx` - Main container with tabs
- `MaintenanceScheduleList.tsx` - All scheduled maintenance items
- `MaintenanceCalendarView.tsx` - Calendar with maintenance dates
- `MaintenanceHistoryList.tsx` - Past maintenance records
- `MaintenanceModal.tsx` - Create/Edit maintenance schedule
- `RecordMaintenanceModal.tsx` - Record completed maintenance
- `MaintenanceReminderSettings.tsx` - Configure notification preferences

**Data Models**:

```typescript
interface MaintenanceSchedule {
  id: string;
  entityType: "GEAR" | "PART";
  entityId: string;
  entityName: string;
  maintenanceType: "INSPECTION" | "REPACK" | "REPLACE" | "SERVICE" | "CUSTOM";
  intervalType: "TIME_BASED" | "USAGE_BASED" | "BOTH";

  // Time-based
  intervalMonths?: number;
  intervalDays?: number;

  // Usage-based
  intervalUsage?: number; // e.g., every 180 jumps
  usageUnit?: "JUMPS" | "HOURS" | "CYCLES";

  // Calculated fields
  lastMaintenanceDate?: Date;
  lastMaintenanceUsage?: number;
  nextDueDate?: Date;
  nextDueUsage?: number;
  daysUntilDue?: number;

  // Notifications
  advanceNoticeDays: number;
  notificationEnabled: boolean;

  description?: string;
  status: "UPCOMING" | "DUE_SOON" | "OVERDUE" | "COMPLETED";
}

interface MaintenanceHistory {
  id: string;
  scheduleId?: string;
  entityType: "GEAR" | "PART";
  entityId: string;
  entityName: string;
  maintenanceType: string;
  performedDate: Date;
  performedBy: string;
  riggerCertificate?: string;
  usageAtMaintenance?: number;
  cost?: number;
  notes?: string;
  attachments?: string[]; // File paths
}
```

**Maintenance Types**:

- **Reserve Repack**: Every 180 days (regulatory)
- **AAD Inspection**: Every 12 months (manufacturer)
- **Line Replacement**: Every 500-1000 jumps (varies by manufacturer)
- **Closing Loop Replacement**: Every 300 cycles or visible wear
- **Container Inspection**: Every 12 months
- **Custom**: User-defined

**Form for Recording Maintenance**:

- Maintenance Type (dropdown)
- Date Performed (date picker, default: today)
- Performed By (text input, save recent entries)
- Rigger Certificate # (text input, for repacks)
- Usage at Maintenance (number input, jumps/hours)
- Cost (currency input)
- Notes (textarea)
- Upload Documents (file upload for certificates, reports)
- Auto-calculate next due date

**Views**:

1. **List View**: Table with all schedules
   - Columns: Item, Type, Last Done, Next Due, Days Until, Status, Actions
   - Sortable by due date
   - Filterable by status, type, item

2. **Calendar View**: Month view with color-coded dots
   - Click date to see all maintenance on that day
   - Color coding: Green (completed), Yellow (due soon), Red (overdue)

3. **History View**: Timeline of past maintenance
   - Grouped by gear item or chronological
   - Search and filter capabilities

**Features**:

- ✅ "Mark as Complete" quick action
- ✅ "Snooze" maintenance (with reason)
- ✅ Bulk schedule creation
- ✅ Export maintenance records to PDF
- ✅ Print maintenance certificates

---

### 5. Usage Log Page (`/usage`)

**Purpose**: Record and track gear usage (jumps)

**Components to create**:

- `UsageLogPage.tsx` - Main container
- `UsageLogList.tsx` - Table/list of all jumps
- `UsageLogModal.tsx` - Add/Edit jump log entry
- `UsageStats.tsx` - Statistics and charts
- `QuickLogButton.tsx` - Floating action button for quick logging

**Data Model**:

```typescript
interface UsageLog {
  id: string;
  gearItemId: string;
  gearItemName: string;
  usageDate: Date;
  usageType: "JUMP" | "TRAINING" | "DEMO" | "COMPETITION";
  location: string; // Dropzone name
  altitudeFt?: number;
  exitType?: "SOLO" | "TANDEM" | "FORMATION" | "FREEFLY" | "WINGSUIT";
  conditions?: string; // Weather notes
  notes?: string;
  jumpNumber?: number; // User's jump number
}
```

**Form Fields**:

- Gear Used (searchable dropdown)
- Date (date picker, default: today)
- Jump Type (radio buttons with icons)
- Dropzone (text input with autocomplete from history)
- Altitude (number input, default: 13,500 ft)
- Exit Type (dropdown)
- Weather Conditions (textarea)
- Notes (textarea)
- My Jump # (number input, optional)

**Usage Statistics**:

- Total jumps by gear
- Jumps per month chart (bar chart)
- Gear usage comparison (pie chart)
- Most used gear
- Average jumps per week/month
- Jumps by location
- Jumps by type

**Features**:

- ✅ Quick log (minimal fields, fast entry)
- ✅ Bulk import from CSV
- ✅ Auto-increment jump numbers
- ✅ Filter by date range, gear, location
- ✅ Export to PDF/Excel

---

### 6. Notifications & Alerts Page (`/notifications`)

**Purpose**: Manage email notifications and in-app alerts

**Components to create**:

- `NotificationsPage.tsx` - Main container
- `NotificationList.tsx` - List of all notifications
- `NotificationSettings.tsx` - Configure notification preferences
- `EmailSettings.tsx` - SMTP configuration (admin only)
- `NotificationPreview.tsx` - Preview notification emails

**Data Model**:

```typescript
interface Notification {
  id: string;
  type: "MAINTENANCE_DUE" | "EXPIRY_WARNING" | "OVERDUE" | "REMINDER";
  entityType: "GEAR" | "PART";
  entityId: string;
  entityName: string;
  subject: string;
  message: string;
  priority: "LOW" | "NORMAL" | "HIGH" | "CRITICAL";
  status: "PENDING" | "SENT" | "FAILED" | "READ";
  scheduledSendDate: Date;
  sentDate?: Date;
  readDate?: Date;
}

interface NotificationSettings {
  emailEnabled: boolean;
  recipientEmail: string;
  notificationTypes: {
    maintenanceDue: boolean;
    maintenanceOverdue: boolean;
    expiryWarning: boolean;
    usageMilestone: boolean;
  };
  advanceNotice: {
    maintenance: number; // days
    expiry: number; // days
  };
  sendTime: string; // HH:mm format
}
```

**Notification Types**:

- 🔔 **Maintenance Due Soon**: 30/15/7/1 days before
- ⚠️ **Maintenance Overdue**: Daily reminders
- 📅 **Part Expiry Warning**: 60/30/15/7 days before
- ❌ **Expired Parts**: Daily reminders
- 🎯 **Usage Milestones**: 100/500/1000 jumps
- ✅ **Maintenance Completed**: Confirmation

**Settings Panel**:

- Enable/disable notifications globally
- Email address for notifications
- Choose which notification types to receive
- Set advance notice periods
- Preferred send time
- Test email button

---

### 7. Settings Page (`/settings`)

**Purpose**: Application configuration and preferences

**Components to create**:

- `SettingsPage.tsx` - Main container with tabs
- `GeneralSettings.tsx` - App preferences
- `EmailConfiguration.tsx` - SMTP setup
- `DataManagement.tsx` - Backup, restore, export
- `AboutApp.tsx` - Version info, license

**Settings Categories**:

1. **General**:
   - Units (Imperial/Metric)
   - Date format
   - Currency
   - Default values (altitude, advance notice days)
   - Theme (Light/Dark/Auto)

2. **Email Configuration**:
   - SMTP Host
   - SMTP Port
   - Username
   - Password (encrypted)
   - Use SSL/TLS
   - From Email
   - Test Connection button

3. **Data Management**:
   - Export all data (JSON, CSV)
   - Import data
   - Backup database
   - Restore from backup
   - Clear all data (with confirmation)

4. **About**:
   - App version
   - Database version
   - License information
   - Credits
   - Check for updates

---

## Common UI Components Library

Create reusable components in `/components/common/`:

### 1. `DataTable.tsx`

**Props**:

```typescript
interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  searchable?: boolean;
  filterable?: boolean;
  sortable?: boolean;
  selectable?: boolean;
  onRowClick?: (row: T) => void;
  onSelectionChange?: (selected: T[]) => void;
  actions?: Action[];
  emptyState?: React.ReactNode;
  pagination?: boolean;
}
```

**Features**:

- Sortable columns
- Search bar
- Filters dropdown
- Checkbox selection
- Loading skeleton
- Empty state message
- Pagination controls
- Bulk actions toolbar

### 2. `Modal.tsx`

**Props**:

```typescript
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  size?: "sm" | "md" | "lg" | "xl";
  children: React.ReactNode;
  footer?: React.ReactNode;
  showCloseButton?: boolean;
}
```

**Features**:

- Backdrop with click-outside to close
- ESC key to close
- Smooth animations
- Responsive sizes
- Optional footer with actions

### 3. `StatusBadge.tsx`

**Props**:

```typescript
interface StatusBadgeProps {
  status: "OK" | "DUE_SOON" | "OVERDUE" | "EXPIRED" | "ACTIVE" | "RETIRED";
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
}
```

**Styling**:

- OK/Active: Green background, check icon
- Due Soon: Yellow background, clock icon
- Overdue: Red background, alert icon
- Expired: Red background, X icon
- Retired: Gray background, archive icon

### 4. `DatePicker.tsx`

**Props**:

```typescript
interface DatePickerProps {
  value: Date | null;
  onChange: (date: Date | null) => void;
  label?: string;
  placeholder?: string;
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;
  error?: string;
  required?: boolean;
}
```

**Features**:

- Calendar popup
- Keyboard navigation
- Date validation
- Custom date formats
- Relative date helpers (Today, Tomorrow, Next Week)

### 5. `FormField.tsx`

**Props**:

```typescript
interface FormFieldProps {
  label: string;
  name: string;
  type?: "text" | "number" | "email" | "textarea" | "select";
  placeholder?: string;
  value: any;
  onChange: (value: any) => void;
  error?: string;
  required?: boolean;
  helpText?: string;
  options?: Option[]; // for select
}
```

### 6. `Card.tsx`

**Props**:

```typescript
interface CardProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  hoverable?: boolean;
  className?: string;
}
```

### 7. `ConfirmDialog.tsx`

**Props**:

```typescript
interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info";
  onConfirm: () => void;
  onCancel: () => void;
}
```

### 8. `LoadingSpinner.tsx`

- Centered spinner
- Full-page overlay option
- Inline spinner option
- Custom size and color

### 9. `EmptyState.tsx`

**Props**:

```typescript
interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}
```

### 10. `StatCard.tsx`

**Props**:

```typescript
interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: "blue" | "green" | "yellow" | "red";
}
```

---

## API Service Layer

Create in `/services/api/`:

### `apiClient.ts`

```typescript
import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:8080/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if needed
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // Handle errors globally
    return Promise.reject(error);
  }
);

export default apiClient;
```

### `gearService.ts`

```typescript
import apiClient from "./apiClient";
import { GearItem, GearCategory } from "@/types";

export const gearService = {
  // Get all gear
  getAll: () => apiClient.get<GearItem[]>("/gear"),

  // Get gear by ID
  getById: (id: string) => apiClient.get<GearItem>(`/gear/${id}`),

  // Create new gear
  create: (data: Partial<GearItem>) => apiClient.post<GearItem>("/gear", data),

  // Update gear
  update: (id: string, data: Partial<GearItem>) => apiClient.put<GearItem>(`/gear/${id}`, data),

  // Delete gear
  delete: (id: string) => apiClient.delete(`/gear/${id}`),

  // Get gear categories
  getCategories: () => apiClient.get<GearCategory[]>("/gear/categories"),

  // Get gear with maintenance status
  getWithMaintenanceStatus: () => apiClient.get<GearItem[]>("/gear/maintenance-status"),
};
```

### `maintenanceService.ts`

```typescript
export const maintenanceService = {
  // Get all schedules
  getSchedules: () => apiClient.get("/maintenance/schedules"),

  // Create schedule
  createSchedule: (data: MaintenanceSchedule) => apiClient.post("/maintenance/schedules", data),

  // Get history
  getHistory: (entityId?: string) =>
    apiClient.get("/maintenance/history", { params: { entityId } }),

  // Record maintenance
  recordMaintenance: (data: MaintenanceHistory) => apiClient.post("/maintenance/history", data),

  // Get due maintenance
  getDueMaintenance: (days: number) => apiClient.get("/maintenance/due", { params: { days } }),
};
```

### `usageService.ts`

```typescript
export const usageService = {
  // Get all usage logs
  getAll: (gearId?: string) => apiClient.get("/usage", { params: { gearId } }),

  // Create usage log
  create: (data: UsageLog) => apiClient.post("/usage", data),

  // Get usage statistics
  getStats: (gearId?: string) => apiClient.get("/usage/stats", { params: { gearId } }),
};
```

### `notificationService.ts`

```typescript
export const notificationService = {
  // Get all notifications
  getAll: () => apiClient.get("/notifications"),

  // Mark as read
  markAsRead: (id: string) => apiClient.put(`/notifications/${id}/read`),

  // Get settings
  getSettings: () => apiClient.get("/notifications/settings"),

  // Update settings
  updateSettings: (data: NotificationSettings) => apiClient.put("/notifications/settings", data),

  // Test email
  testEmail: () => apiClient.post("/notifications/test-email"),
};
```

---

## Custom React Hooks

Create in `/hooks/`:

### `useGear.ts`

```typescript
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { gearService } from "@/services/api/gearService";

export const useGear = () => {
  const queryClient = useQueryClient();

  const { data: gearList, isLoading } = useQuery({
    queryKey: ["gear"],
    queryFn: gearService.getAll,
  });

  const createGearMutation = useMutation({
    mutationFn: gearService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gear"] });
    },
  });

  const updateGearMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<GearItem> }) =>
      gearService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gear"] });
    },
  });

  const deleteGearMutation = useMutation({
    mutationFn: gearService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gear"] });
    },
  });

  return {
    gearList,
    isLoading,
    createGear: createGearMutation.mutate,
    updateGear: updateGearMutation.mutate,
    deleteGear: deleteGearMutation.mutate,
  };
};
```

### `useMaintenance.ts`

```typescript
export const useMaintenance = () => {
  const queryClient = useQueryClient();

  const { data: schedules } = useQuery({
    queryKey: ["maintenance", "schedules"],
    queryFn: maintenanceService.getSchedules,
  });

  const { data: dueMaintenance } = useQuery({
    queryKey: ["maintenance", "due"],
    queryFn: () => maintenanceService.getDueMaintenance(30),
    refetchInterval: 60000, // Refetch every minute
  });

  const recordMaintenanceMutation = useMutation({
    mutationFn: maintenanceService.recordMaintenance,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["maintenance"] });
      queryClient.invalidateQueries({ queryKey: ["gear"] });
    },
  });

  return {
    schedules,
    dueMaintenance,
    recordMaintenance: recordMaintenanceMutation.mutate,
  };
};
```

### `useNotifications.ts`

```typescript
export const useNotifications = () => {
  const { data: notifications, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: notificationService.getAll,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const unreadCount = useMemo(
    () => notifications?.filter((n) => n.status !== "READ").length ?? 0,
    [notifications]
  );

  const markAsReadMutation = useMutation({
    mutationFn: notificationService.markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  return {
    notifications,
    unreadCount,
    isLoading,
    markAsRead: markAsReadMutation.mutate,
  };
};
```

---

## State Management (Zustand)

Create in `/store/`:

### `useAppStore.ts`

```typescript
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AppState {
  // UI State
  theme: "light" | "dark" | "auto";
  sidebarCollapsed: boolean;

  // User Preferences
  dateFormat: string;
  units: "imperial" | "metric";
  currency: string;

  // Actions
  setTheme: (theme: "light" | "dark" | "auto") => void;
  toggleSidebar: () => void;
  setDateFormat: (format: string) => void;
  setUnits: (units: "imperial" | "metric") => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      theme: "auto",
      sidebarCollapsed: false,
      dateFormat: "MM/dd/yyyy",
      units: "imperial",
      currency: "USD",

      setTheme: (theme) => set({ theme }),
      toggleSidebar: () =>
        set((state) => ({
          sidebarCollapsed: !state.sidebarCollapsed,
        })),
      setDateFormat: (dateFormat) => set({ dateFormat }),
      setUnits: (units) => set({ units }),
    }),
    {
      name: "app-storage",
    }
  )
);
```

---

## TypeScript Type Definitions

Create in `/types/`:

### `gear.types.ts`

```typescript
export interface GearItem {
  id: string;
  categoryId: string;
  categoryName: string;
  name: string;
  manufacturer: string;
  model: string;
  serialNumber: string;
  purchaseDate: Date;
  purchasePrice: number;
  status: GearStatus;
  location: string;
  notes: string;
  totalJumps?: number;
  nextMaintenanceDate?: Date;
  parts: Part[];
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export type GearStatus = "ACTIVE" | "RETIRED" | "IN_MAINTENANCE";

export interface GearCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface Part {
  id: string;
  gearItemId: string;
  gearItemName: string;
  partType: string;
  name: string;
  manufacturer: string;
  model: string;
  serialNumber?: string;
  installationDate: Date;
  requiresMaintenance: boolean;
  isCritical: boolean;
  expiryDate?: Date;
  nextMaintenanceDate?: Date;
  status: PartStatus;
  metadata?: Record<string, any>;
}

export type PartStatus = "OK" | "DUE_SOON" | "OVERDUE" | "EXPIRED";
```

### `maintenance.types.ts`

```typescript
export interface MaintenanceSchedule {
  id: string;
  entityType: "GEAR" | "PART";
  entityId: string;
  entityName: string;
  maintenanceType: MaintenanceType;
  intervalType: "TIME_BASED" | "USAGE_BASED" | "BOTH";
  intervalMonths?: number;
  intervalDays?: number;
  intervalUsage?: number;
  usageUnit?: "JUMPS" | "HOURS" | "CYCLES";
  lastMaintenanceDate?: Date;
  lastMaintenanceUsage?: number;
  nextDueDate?: Date;
  nextDueUsage?: number;
  daysUntilDue?: number;
  advanceNoticeDays: number;
  notificationEnabled: boolean;
  description?: string;
  status: MaintenanceStatus;
  createdAt: Date;
  updatedAt: Date;
}

export type MaintenanceType = "INSPECTION" | "REPACK" | "REPLACE" | "SERVICE" | "CUSTOM";

export type MaintenanceStatus = "UPCOMING" | "DUE_SOON" | "OVERDUE" | "COMPLETED";

export interface MaintenanceHistory {
  id: string;
  scheduleId?: string;
  entityType: "GEAR" | "PART";
  entityId: string;
  entityName: string;
  maintenanceType: string;
  performedDate: Date;
  performedBy: string;
  riggerCertificate?: string;
  usageAtMaintenance?: number;
  cost?: number;
  notes?: string;
  attachments?: string[];
  createdAt: Date;
}
```

### `usage.types.ts`

```typescript
export interface UsageLog {
  id: string;
  gearItemId: string;
  gearItemName: string;
  usageDate: Date;
  usageType: UsageType;
  location: string;
  altitudeFt?: number;
  exitType?: ExitType;
  conditions?: string;
  notes?: string;
  jumpNumber?: number;
  createdAt: Date;
}

export type UsageType = "JUMP" | "TRAINING" | "DEMO" | "COMPETITION";

export type ExitType = "SOLO" | "TANDEM" | "FORMATION" | "FREEFLY" | "WINGSUIT" | "STATIC_LINE";

export interface UsageStats {
  totalJumps: number;
  jumpsByMonth: { month: string; count: number }[];
  jumpsByGear: { gearId: string; gearName: string; count: number }[];
  jumpsByType: { type: UsageType; count: number }[];
  jumpsByLocation: { location: string; count: number }[];
  averageJumpsPerWeek: number;
  averageJumpsPerMonth: number;
  mostUsedGear: string;
  favoriteDropzone: string;
}
```

### `notification.types.ts`

```typescript
export interface Notification {
  id: string;
  type: NotificationType;
  entityType: "GEAR" | "PART";
  entityId: string;
  entityName: string;
  subject: string;
  message: string;
  priority: NotificationPriority;
  status: NotificationStatus;
  scheduledSendDate: Date;
  sentDate?: Date;
  readDate?: Date;
  createdAt: Date;
}

export type NotificationType = "MAINTENANCE_DUE" | "EXPIRY_WARNING" | "OVERDUE" | "REMINDER";

export type NotificationPriority = "LOW" | "NORMAL" | "HIGH" | "CRITICAL";

export type NotificationStatus = "PENDING" | "SENT" | "FAILED" | "READ";

export interface NotificationSettings {
  emailEnabled: boolean;
  recipientEmail: string;
  notificationTypes: {
    maintenanceDue: boolean;
    maintenanceOverdue: boolean;
    expiryWarning: boolean;
    usageMilestone: boolean;
  };
  advanceNotice: {
    maintenance: number;
    expiry: number;
  };
  sendTime: string;
}
```

---

## Utility Functions

Create in `/utils/`:

### `dateUtils.ts`

```typescript
import { format, formatDistance, addDays, differenceInDays, isPast } from "date-fns";

export const formatDate = (date: Date | string, dateFormat = "MM/dd/yyyy"): string => {
  return format(new Date(date), dateFormat);
};

export const formatDateTime = (date: Date | string): string => {
  return format(new Date(date), "MM/dd/yyyy HH:mm");
};

export const getRelativeTime = (date: Date | string): string => {
  return formatDistance(new Date(date), new Date(), { addSuffix: true });
};

export const calculateDaysUntil = (date: Date | string): number => {
  return differenceInDays(new Date(date), new Date());
};

export const isOverdue = (date: Date | string): boolean => {
  return isPast(new Date(date));
};

export const getStatusFromDate = (date: Date | string): MaintenanceStatus => {
  const daysUntil = calculateDaysUntil(date);

  if (daysUntil < 0) return "OVERDUE";
  if (daysUntil <= 7) return "DUE_SOON";
  if (daysUntil <= 30) return "UPCOMING";
  return "UPCOMING";
};

export const addMaintenanceInterval = (lastDate: Date, months?: number, days?: number): Date => {
  let nextDate = new Date(lastDate);
  if (months) {
    nextDate.setMonth(nextDate.getMonth() + months);
  }
  if (days) {
    nextDate = addDays(nextDate, days);
  }
  return nextDate;
};
```

### `formatters.ts`

```typescript
export const formatCurrency = (amount: number, currency = "USD"): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);
};

export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat("en-US").format(num);
};

export const formatAltitude = (ft: number, units: "imperial" | "metric"): string => {
  if (units === "metric") {
    const meters = Math.round(ft * 0.3048);
    return `${formatNumber(meters)} m`;
  }
  return `${formatNumber(ft)} ft`;
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

export const capitalize = (text: string): string => {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

export const formatSerialNumber = (serial: string): string => {
  // Format serial numbers consistently
  return serial.toUpperCase().replace(/\s+/g, "-");
};
```

### `validators.ts`

```typescript
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidSerialNumber = (serial: string): boolean => {
  // Serial numbers should be alphanumeric with dashes/underscores
  const serialRegex = /^[A-Za-z0-9\-_]+$/;
  return serialRegex.test(serial);
};

export const isValidDate = (date: any): boolean => {
  return date instanceof Date && !isNaN(date.getTime());
};

export const validateGearForm = (data: Partial<GearItem>): ValidationErrors => {
  const errors: ValidationErrors = {};

  if (!data.name || data.name.trim().length === 0) {
    errors.name = "Name is required";
  }

  if (!data.categoryId) {
    errors.categoryId = "Category is required";
  }

  if (data.serialNumber && !isValidSerialNumber(data.serialNumber)) {
    errors.serialNumber = "Invalid serial number format";
  }

  if (data.purchasePrice && data.purchasePrice < 0) {
    errors.purchasePrice = "Price must be positive";
  }

  return errors;
};

export const validateMaintenanceForm = (data: Partial<MaintenanceSchedule>): ValidationErrors => {
  const errors: ValidationErrors = {};

  if (!data.maintenanceType) {
    errors.maintenanceType = "Maintenance type is required";
  }

  if (!data.intervalType) {
    errors.intervalType = "Interval type is required";
  }

  if (data.intervalType === "TIME_BASED" || data.intervalType === "BOTH") {
    if (!data.intervalMonths && !data.intervalDays) {
      errors.interval = "Time interval is required";
    }
  }

  if (data.intervalType === "USAGE_BASED" || data.intervalType === "BOTH") {
    if (!data.intervalUsage || data.intervalUsage <= 0) {
      errors.intervalUsage = "Usage interval must be positive";
    }
  }

  return errors;
};

type ValidationErrors = Record<string, string>;
```

### `constants.ts`

```typescript
export const GEAR_CATEGORIES = [
  { id: "main", name: "Main Parachute", icon: "🪂" },
  { id: "reserve", name: "Reserve Parachute", icon: "🎯" },
  { id: "container", name: "Container/Harness", icon: "🎒" },
  { id: "aad", name: "AAD", icon: "⚡" },
  { id: "helmet", name: "Helmet", icon: "🪖" },
  { id: "altimeter", name: "Altimeter", icon: "📊" },
  { id: "other", name: "Other Equipment", icon: "🔧" },
];

export const PART_TYPES = {
  MAIN_PARACHUTE: ["Canopy", "Line Set", "Slider", "Pilot Chute", "Deployment Bag"],
  RESERVE_PARACHUTE: ["Canopy", "Line Set", "Pilot Chute", "Freebag"],
  CONTAINER: [
    "Closing Loop",
    "Main Pin",
    "Reserve Pin",
    "Main Risers",
    "Reserve Risers",
    "Main Bridle",
    "Reserve Bridle",
    "Leg Straps",
    "Chest Strap",
  ],
  AAD: ["Battery", "Control Unit", "Cutter"],
};

export const MAINTENANCE_TYPES = [
  { value: "REPACK", label: "Reserve Repack", icon: "📦" },
  { value: "INSPECTION", label: "Inspection", icon: "🔍" },
  { value: "REPLACE", label: "Part Replacement", icon: "🔄" },
  { value: "SERVICE", label: "Service/Repair", icon: "🔧" },
  { value: "CUSTOM", label: "Custom Maintenance", icon: "⚙️" },
];

export const USAGE_TYPES = [
  { value: "JUMP", label: "Jump", icon: "🪂" },
  { value: "TRAINING", label: "Training", icon: "📚" },
  { value: "DEMO", label: "Demo", icon: "🎪" },
  { value: "COMPETITION", label: "Competition", icon: "🏆" },
];

export const EXIT_TYPES = [
  { value: "SOLO", label: "Solo" },
  { value: "TANDEM", label: "Tandem" },
  { value: "FORMATION", label: "Formation" },
  { value: "FREEFLY", label: "Freefly" },
  { value: "WINGSUIT", label: "Wingsuit" },
  { value: "STATIC_LINE", label: "Static Line" },
];

export const STATUS_COLORS = {
  OK: "bg-green-100 text-green-800",
  ACTIVE: "bg-green-100 text-green-800",
  DUE_SOON: "bg-yellow-100 text-yellow-800",
  UPCOMING: "bg-blue-100 text-blue-800",
  OVERDUE: "bg-red-100 text-red-800",
  EXPIRED: "bg-red-100 text-red-800",
  RETIRED: "bg-gray-100 text-gray-800",
  IN_MAINTENANCE: "bg-orange-100 text-orange-800",
};

export const PRIORITY_COLORS = {
  LOW: "bg-gray-100 text-gray-800",
  NORMAL: "bg-blue-100 text-blue-800",
  HIGH: "bg-orange-100 text-orange-800",
  CRITICAL: "bg-red-100 text-red-800",
};

export const DEFAULT_INTERVALS = {
  RESERVE_REPACK: { months: 6, days: 0, description: "180 days (FAA requirement)" },
  AAD_INSPECTION: { months: 12, days: 0, description: "Annual inspection" },
  CONTAINER_INSPECTION: { months: 12, days: 0, description: "Annual inspection" },
  LINE_REPLACEMENT: { usage: 500, unit: "JUMPS", description: "500-1000 jumps" },
  CLOSING_LOOP: { usage: 300, unit: "CYCLES", description: "300 cycles or wear" },
};
```

---

## Layout Components

Create in `/components/layout/`:

### `AppLayout.tsx`

```typescript
interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { sidebarCollapsed } = useAppStore();

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className={`flex-1 flex flex-col transition-all duration-300 ${
        sidebarCollapsed ? 'ml-16' : 'ml-64'
      }`}>
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};
```

### `Sidebar.tsx`

```typescript
export const Sidebar: React.FC = () => {
  const { sidebarCollapsed, toggleSidebar } = useAppStore();
  const location = useLocation();

  const menuItems = [
    { path: '/', icon: <LayoutDashboard />, label: 'Dashboard' },
    { path: '/gear', icon: <Package />, label: 'Gear Inventory' },
    { path: '/maintenance', icon: <Wrench />, label: 'Maintenance' },
    { path: '/usage', icon: <Activity />, label: 'Usage Log' },
    { path: '/notifications', icon: <Bell />, label: 'Notifications' },
    { path: '/settings', icon: <Settings />, label: 'Settings' },
  ];

  return (
    <aside className={`fixed left-0 top-0 h-screen bg-white border-r border-gray-200
      transition-all duration-300 ${sidebarCollapsed ? 'w-16' : 'w-64'}`}>
      {/* Sidebar content */}
    </aside>
  );
};
```

### `Header.tsx`

```typescript
export const Header: React.FC = () => {
  const { notifications, unreadCount } = useNotifications();
  const { theme, setTheme } = useAppStore();

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center
      justify-between px-6">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold text-gray-800">
          Skydive Gear Tracker
        </h1>
      </div>

      <div className="flex items-center gap-4">
        {/* Search bar */}
        <SearchInput />

        {/* Notifications */}
        <NotificationBell count={unreadCount} />

        {/* Theme toggle */}
        <ThemeToggle />

        {/* User menu */}
        <UserMenu />
      </div>
    </header>
  );
};
```

---

## Specific Component Examples

### `GearList.tsx` (Full Implementation)

```typescript
import React, { useState, useMemo } from 'react';
import { useGear } from '@/hooks/useGear';
import { DataTable } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { GearModal } from './GearModal';
import { formatDate, formatCurrency } from '@/utils/formatters';
import { Plus, Edit, Trash, Eye } from 'lucide-react';

export const GearList: React.FC = () => {
  const { gearList, isLoading, deleteGear } = useGear();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGear, setSelectedGear] = useState<GearItem | null>(null);

  const filteredGear = useMemo(() => {
    return gearList?.filter(gear => {
      const matchesSearch =
        gear.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        gear.serialNumber.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === 'all' || gear.categoryId === selectedCategory;

      const matchesStatus =
        selectedStatus === 'all' || gear.status === selectedStatus;

      return matchesSearch && matchesCategory && matchesStatus;
    }) || [];
  }, [gearList, searchTerm, selectedCategory, selectedStatus]);

  const columns = [
    {
      key: 'name',
      label: 'Gear',
      render: (gear: GearItem) => (
        <div className="flex items-center gap-2">
          <span className="text-2xl">{getCategoryIcon(gear.categoryId)}</span>
          <div>
            <div className="font-medium">{gear.name}</div>
            <div className="text-sm text-gray-500">{gear.categoryName}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'manufacturer',
      label: 'Manufacturer / Model',
      render: (gear: GearItem) => (
        <div>
          <div>{gear.manufacturer}</div>
          <div className="text-sm text-gray-500">{gear.model}</div>
        </div>
      ),
    },
    {
      key: 'serialNumber',
      label: 'Serial Number',
    },
    {
      key: 'status',
      label: 'Status',
      render: (gear: GearItem) => <StatusBadge status={gear.status} />,
    },
    {
      key: 'totalJumps',
      label: 'Total Jumps',
      render: (gear: GearItem) => gear.totalJumps || 0,
    },
    {
      key: 'nextMaintenance',
      label: 'Next Maintenance',
      render: (gear: GearItem) => {
        if (!gear.nextMaintenanceDate) return '-';
        const daysUntil = calculateDaysUntil(gear.nextMaintenanceDate);
        return (
          <div>
            <div>{formatDate(gear.nextMaintenanceDate)}</div>
            <div className={`text-sm ${
              daysUntil < 0 ? 'text-red-600' :
              daysUntil < 7 ? 'text-yellow-600' :
              'text-gray-500'
            }`}>
              {daysUntil < 0 ? `${Math.abs(daysUntil)} days overdue` :
               daysUntil === 0 ? 'Due today' :
               `in ${daysUntil} days`}
            </div>
          </div>
        );
      },
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (gear: GearItem) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleView(gear)}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleEdit(gear)}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(gear)}
            className="p-1 hover:bg-red-100 text-red-600 rounded"
          >
            <Trash className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  const handleEdit = (gear: GearItem) => {
    setSelectedGear(gear);
    setIsModalOpen(true);
  };

  const handleDelete = async (gear: GearItem) => {
    if (confirm(`Are you sure you want to delete ${gear.name}?`)) {
      await deleteGear(gear.id);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gear Inventory</h2>
        <button
          onClick={() => {
            setSelectedGear(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white
            rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-5 h-5" />
          Add Gear
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <input
          type="text"
          placeholder="Search by name or serial number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
        />

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg"
        >
          <option value="all">All Categories</option>
          {GEAR_CATEGORIES.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg"
        >
          <option value="all">All Status</option>
          <option value="ACTIVE">Active</option>
          <option value="RETIRED">Retired</option>
          <option value="IN_MAINTENANCE">In Maintenance</option>
        </select>
      </div>

      {/* Table */}
      <DataTable
        data={filteredGear}
        columns={columns}
        loading={isLoading}
        searchable={false}
        pagination={true}
        emptyState={
          <div className="text-center py-12">
            <Package className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600">No gear found</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-4 text-blue-600 hover:text-blue-700"
            >
              Add your first gear item
            </button>
          </div>
        }
      />

      {/* Modal */}
      <GearModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedGear(null);
        }}
        gear={selectedGear}
      />
    </div>
  );
};
```

---

## Routing Setup

### `App.tsx`

```typescript
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AppLayout } from '@/components/layout/AppLayout';
import { Dashboard } from '@/pages/Dashboard';
import { GearInventory } from '@/pages/GearInventory';
import { MaintenanceTracker } from '@/pages/MaintenanceTracker';
import { UsageLog } from '@/pages/UsageLog';
import { Notifications } from '@/pages/Notifications';
import { Settings } from '@/pages/Settings';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/gear" element={<GearInventory />} />
            <Route path="/gear/:id" element={<GearDetails />} />
            <Route path="/maintenance" element={<MaintenanceTracker />} />
            <Route path="/usage" element={<UsageLog />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </AppLayout>
        <Toaster position="top-right" />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
```

---

## Styling Guidelines

### Tailwind Configuration

```javascript
// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#eff6ff",
          100: "#dbeafe",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
        },
        danger: {
          50: "#fef2f2",
          100: "#fee2e2",
          500: "#ef4444",
          600: "#dc2626",
        },
        success: {
          50: "#f0fdf4",
          100: "#dcfce7",
          500: "#22c55e",
          600: "#16a34a",
        },
        warning: {
          50: "#fffbeb",
          100: "#fef3c7",
          500: "#f59e0b",
          600: "#d97706",
        },
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
```

### Design Tokens

- **Border Radius**: `rounded-lg` (8px) for cards, `rounded` (4px) for buttons
- **Shadows**: `shadow-sm` for cards, `shadow-md` for modals
- **Spacing**: Use consistent padding (p-4, p-6) and gaps (gap-4, gap-6)
- **Typography**:
  - Headers: `text-2xl font-bold` or `text-xl font-semibold`
  - Body: `text-base text-gray-700`
  - Small text: `text-sm text-gray-500`

---

## Performance Optimizations

1. **Code Splitting**: Use `React.lazy` for route-based code splitting
2. **Memoization**: Use `useMemo` and `useCallback` for expensive calculations
3. **Virtualization**: Use `react-window` for long lists (1000+ items)
4. **Image Optimization**: Lazy load images, use appropriate formats
5. **Debouncing**: Debounce search inputs (300ms delay)
6. **Pagination**: Load data in chunks (50 items per page)

---

## Error Handling

### Error Boundary

```typescript
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">
              Something went wrong
            </h1>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              Reload App
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
```

---

## Testing Requirements

Write tests for:

1. **Component rendering**: Snapshot tests for UI components
2. **User interactions**: Click, form submission, navigation
3. **API integration**: Mock API calls, test error states
4. **Business logic**: Date calculations, validation functions
5. **Edge cases**: Empty states, loading states, error states

---

## Accessibility (A11Y)

### Requirements

1. **Keyboard Navigation**: All interactive elements must be keyboard accessible (Tab, Enter, Escape)
2. **ARIA Labels**: Use proper aria-label, aria-describedby for screen readers
3. **Focus Management**: Visible focus indicators, trap focus in modals
4. **Color Contrast**: Minimum 4.5:1 ratio for text, 3:1 for large text
5. **Semantic HTML**: Use proper heading hierarchy (h1 → h2 → h3)
6. **Alt Text**: Descriptive alt text for all images and icons

### Example Implementation

```typescript
// Accessible Button
<button
  aria-label="Add new gear"
  onClick={handleAddGear}
  className="px-4 py-2 bg-blue-600 text-white rounded focus:ring-2
    focus:ring-blue-500 focus:outline-none"
>
  <Plus className="w-5 h-5" aria-hidden="true" />
  <span>Add Gear</span>
</button>

// Accessible Form Field
<div>
  <label htmlFor="gear-name" className="block text-sm font-medium mb-1">
    Gear Name <span className="text-red-500">*</span>
  </label>
  <input
    id="gear-name"
    type="text"
    required
    aria-required="true"
    aria-invalid={!!errors.name}
    aria-describedby={errors.name ? "name-error" : undefined}
    className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
  />
  {errors.name && (
    <p id="name-error" className="text-sm text-red-600 mt-1" role="alert">
      {errors.name}
    </p>
  )}
</div>

// Accessible Modal
<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="modal-title"
  className="fixed inset-0 z-50 flex items-center justify-center"
>
  <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
    <h2 id="modal-title" className="text-xl font-bold p-6">
      Add New Gear
    </h2>
    {/* Modal content */}
  </div>
</div>
```

---

## Responsive Design Guidelines

### Breakpoints (Tailwind defaults)

- **Mobile**: < 640px (sm)
- **Tablet**: 640px - 1024px (md, lg)
- **Desktop**: > 1024px (xl, 2xl)

### Responsive Patterns

```typescript
// Stack on mobile, grid on desktop
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Cards */}
</div>

// Hide sidebar on mobile
<aside className="hidden md:block w-64">
  {/* Sidebar */}
</aside>

// Mobile menu button
<button className="md:hidden" onClick={toggleMobileMenu}>
  <Menu className="w-6 h-6" />
</button>

// Responsive text sizes
<h1 className="text-xl md:text-2xl lg:text-3xl font-bold">
  Dashboard
</h1>

// Responsive padding
<div className="p-4 md:p-6 lg:p-8">
  {/* Content */}
</div>
```

---

## Animation Guidelines

Use subtle animations for better UX:

```typescript
// Fade in
<div className="animate-fade-in">Content</div>

// Slide in from right (for modals)
<div className="animate-slide-in-right">Modal</div>

// Loading spinner
<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />

// Pulse for loading states
<div className="animate-pulse bg-gray-200 h-4 w-full rounded" />

// Custom transitions
<button className="transition-all duration-200 hover:scale-105 hover:shadow-lg">
  Click me
</button>
```

### Custom Animations (tailwind.config.js)

```javascript
theme: {
  extend: {
    animation: {
      'fade-in': 'fadeIn 0.3s ease-in',
      'slide-in-right': 'slideInRight 0.3s ease-out',
    },
    keyframes: {
      fadeIn: {
        '0%': { opacity: '0' },
        '100%': { opacity: '1' },
      },
      slideInRight: {
        '0%': { transform: 'translateX(100%)', opacity: '0' },
        '100%': { transform: 'translateX(0)', opacity: '1' },
      },
    },
  },
}
```

---

## Data Visualization Components

### Usage Chart (Recharts)

```typescript
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

export const UsageChart: React.FC<{ data: UsageStats }> = ({ data }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Jumps per Month</h3>
      <LineChart width={600} height={300} data={data.jumpsByMonth}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="count"
          stroke="#3b82f6"
          strokeWidth={2}
          name="Jumps"
        />
      </LineChart>
    </div>
  );
};
```

### Maintenance Calendar

```typescript
import { Calendar } from 'react-calendar';

export const MaintenanceCalendar: React.FC = () => {
  const { dueMaintenance } = useMaintenance();

  const getTileClassName = ({ date }: { date: Date }) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const hasOverdue = dueMaintenance?.some(m =>
      format(m.nextDueDate, 'yyyy-MM-dd') === dateStr && m.status === 'OVERDUE'
    );
    const hasDueSoon = dueMaintenance?.some(m =>
      format(m.nextDueDate, 'yyyy-MM-dd') === dateStr && m.status === 'DUE_SOON'
    );

    if (hasOverdue) return 'bg-red-100 text-red-800';
    if (hasDueSoon) return 'bg-yellow-100 text-yellow-800';
    return '';
  };

  return (
    <Calendar
      tileClassName={getTileClassName}
      className="rounded-lg shadow"
    />
  );
};
```

---

## Form Handling Best Practices

### Using React Hook Form

```typescript
import { useForm } from 'react-hook-form';

interface GearFormData {
  name: string;
  categoryId: string;
  manufacturer: string;
  model: string;
  serialNumber: string;
  purchaseDate: Date;
  purchasePrice: number;
  status: GearStatus;
}

export const GearForm: React.FC = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<GearFormData>();
  const { createGear } = useGear();

  const onSubmit = async (data: GearFormData) => {
    try {
      await createGear(data);
      toast.success('Gear added successfully!');
      reset();
    } catch (error) {
      toast.error('Failed to add gear');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1">
          Gear Name *
        </label>
        <input
          id="name"
          {...register('name', { required: 'Name is required' })}
          className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
        />
        {errors.name && (
          <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="categoryId" className="block text-sm font-medium mb-1">
          Category *
        </label>
        <select
          id="categoryId"
          {...register('categoryId', { required: 'Category is required' })}
          className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select a category</option>
          {GEAR_CATEGORIES.map(cat => (
            <option key={cat.id} value={cat.id}>
              {cat.icon} {cat.name}
            </option>
          ))}
        </select>
        {errors.categoryId && (
          <p className="text-sm text-red-600 mt-1">{errors.categoryId.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="purchasePrice" className="block text-sm font-medium mb-1">
          Purchase Price
        </label>
        <input
          id="purchasePrice"
          type="number"
          step="0.01"
          {...register('purchasePrice', {
            min: { value: 0, message: 'Price must be positive' }
          })}
          className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
        />
        {errors.purchasePrice && (
          <p className="text-sm text-red-600 mt-1">{errors.purchasePrice.message}</p>
        )}
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <button
          type="button"
          onClick={() => reset()}
          className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Save Gear
        </button>
      </div>
    </form>
  );
};
```

---

## Loading States

### Skeleton Loaders

```typescript
export const GearCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow animate-pulse">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 bg-gray-200 rounded" />
        <div className="flex-1">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
          <div className="h-3 bg-gray-200 rounded w-1/2" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-gray-200 rounded w-full" />
        <div className="h-3 bg-gray-200 rounded w-5/6" />
      </div>
    </div>
  );
};

// Usage
{isLoading ? (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {Array.from({ length: 6 }).map((_, i) => (
      <GearCardSkeleton key={i} />
    ))}
  </div>
) : (
  <GearList data={gearList} />
)}
```

### Loading Overlay

```typescript
export const LoadingOverlay: React.FC<{ message?: string }> = ({ message }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center
      justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2
          border-blue-600 mx-auto mb-4" />
        <p className="text-gray-700">{message || 'Loading...'}</p>
      </div>
    </div>
  );
};
```

---

## Empty States

```typescript
export const EmptyState: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}> = ({ icon, title, description, action }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="text-gray-400 mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      <p className="text-gray-600 text-center mb-6 max-w-md">
        {description}
      </p>
      {action && (
        <button
          onClick={action.onClick}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg
            hover:bg-blue-700 transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  );
};

// Usage examples
<EmptyState
  icon={<Package className="w-16 h-16" />}
  title="No gear found"
  description="You haven't added any gear yet. Start by adding your first parachute system."
  action={{
    label: "Add Your First Gear",
    onClick: () => setModalOpen(true)
  }}
/>

<EmptyState
  icon={<Calendar className="w-16 h-16" />}
  title="No maintenance scheduled"
  description="All your gear is up to date! Schedule maintenance to get reminders."
/>
```

---

## Notification/Toast System

```typescript
import toast from 'react-hot-toast';

// Success notification
toast.success('Gear added successfully!', {
  duration: 3000,
  position: 'top-right',
});

// Error notification
toast.error('Failed to save gear', {
  duration: 4000,
});

// Custom notification
toast.custom((t) => (
  <div className={`${t.visible ? 'animate-enter' : 'animate-leave'}
    bg-white shadow-lg rounded-lg p-4 flex items-center gap-3`}>
    <AlertCircle className="w-5 h-5 text-yellow-500" />
    <div>
      <p className="font-semibold">Maintenance Due Soon</p>
      <p className="text-sm text-gray-600">Reserve repack due in 7 days</p>
    </div>
    <button
      onClick={() => toast.dismiss(t.id)}
      className="ml-auto text-gray-400 hover:text-gray-600"
    >
      <X className="w-4 h-4" />
    </button>
  </div>
));

// Loading notification
const loadingToast = toast.loading('Saving gear...');
// Later...
toast.success('Gear saved!', { id: loadingToast });
```

---

## Search and Filter Implementation

```typescript
export const SearchAndFilter: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: 'all',
    status: 'all',
    maintenanceStatus: 'all',
  });
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'jumps'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const debouncedSearch = useMemo(
    () => debounce((value: string) => {
      // Trigger search
    }, 300),
    []
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      {/* Search */}
      <div className="flex-1">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2
            text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search gear..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg
              focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Filters */}
      <select
        value={filters.category}
        onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
        className="px-4 py-2 border border-gray-300 rounded-lg"
      >
        <option value="all">All Categories</option>
        {GEAR_CATEGORIES.map(cat => (
          <option key={cat.id} value={cat.id}>{cat.name}</option>
        ))}
      </select>

      <select
        value={filters.status}
        onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
        className="px-4 py-2 border border-gray-300 rounded-lg"
      >
        <option value="all">All Status</option>
        <option value="ACTIVE">Active</option>
        <option value="RETIRED">Retired</option>
        <option value="IN_MAINTENANCE">In Maintenance</option>
      </select>

      {/* Sort */}
      <select
        value={`${sortBy}-${sortOrder}`}
        onChange={(e) => {
          const [by, order] = e.target.value.split('-');
          setSortBy(by as any);
          setSortOrder(order as any);
        }}
        className="px-4 py-2 border border-gray-300 rounded-lg"
      >
        <option value="name-asc">Name (A-Z)</option>
        <option value="name-desc">Name (Z-A)</option>
        <option value="date-desc">Newest First</option>
        <option value="date-asc">Oldest First</option>
        <option value="jumps-desc">Most Jumps</option>
        <option value="jumps-asc">Least Jumps</option>
      </select>
    </div>
  );
};
```

---

## Export Functionality

```typescript
import { exportToCSV, exportToPDF } from '@/utils/exporters';

export const ExportMenu: React.FC<{ data: GearItem[] }> = ({ data }) => {
  const handleExportCSV = () => {
    const csvData = data.map(gear => ({
      Name: gear.name,
      Category: gear.categoryName,
      Manufacturer: gear.manufacturer,
      Model: gear.model,
      'Serial Number': gear.serialNumber,
      Status: gear.status,
      'Total Jumps': gear.totalJumps || 0,
      'Next Maintenance': gear.nextMaintenanceDate
        ? formatDate(gear.nextMaintenanceDate)
        : 'N/A',
    }));

    exportToCSV(csvData, 'gear-inventory.csv');
    toast.success('Exported to CSV');
  };

  const handleExportPDF = () => {
    exportToPDF(data, 'gear-inventory.pdf');
    toast.success('Exported to PDF');
  };

  return (
    <div className="relative">
      <button className="flex items-center gap-2 px-4 py-2 border border-gray-300
        rounded-lg hover:bg-gray-50">
        <Download className="w-4 h-4" />
        Export
      </button>
      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg
        border border-gray-200 py-1 z-10">
        <button
          onClick={handleExportCSV}
          className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2"
        >
          <FileText className="w-4 h-4" />
          Export as CSV
        </button>
        <button
          onClick={handleExportPDF}
          className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2"
        >
          <FileText className="w-4 h-4" />
          Export as PDF
        </button>
      </div>
    </div>
  );
};
```

---

## Print Functionality

```typescript
// Print-friendly gear label
export const GearLabel: React.FC<{ gear: GearItem }> = ({ gear }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div>
      <button onClick={handlePrint} className="mb-4 px-4 py-2 bg-blue-600
        text-white rounded no-print">
        Print Label
      </button>

      <div className="print:block border-2 border-black p-4 w-96">
        <QRCode value={gear.id} size={100} />
        <h2 className="text-xl font-bold mt-4">{gear.name}</h2>
        <p className="text-sm">Serial: {gear.serialNumber}</p>
        <p className="text-sm">Category: {gear.categoryName}</p>
        <p className="text-sm font-bold mt-2">
          Next Maintenance: {formatDate(gear.nextMaintenanceDate)}
        </p>
      </div>
    </div>
  );
};

// Add to global CSS
@media print {
  .no-print {
    display: none;
  }

  body {
    print-color-adjust: exact;
    -webkit-print-color-adjust: exact;
  }
}
```

---

## Environment Configuration

### `.env.example`

```bash
# API Configuration
REACT_APP_API_URL=http://localhost:8080/api
REACT_APP_API_TIMEOUT=10000

# Feature Flags
REACT_APP_ENABLE_ANALYTICS=false
REACT_APP_ENABLE_DEBUG=true

# App Configuration
REACT_APP_APP_NAME=Skydive Gear Tracker
REACT_APP_VERSION=1.0.0
```

---

## Package.json Scripts

```json
{
  "name": "skydive-gear-tracker",
  "version": "1.0.0",
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject",
    "lint": "eslint src --ext .ts,.tsx",
    "lint:fix": "eslint src --ext .ts,.tsx --fix",
    "format": "prettier --write \"src/**/*.{ts,tsx,css,md}\"",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "axios": "^1.6.0",
    "@tanstack/react-query": "^5.12.0",
    "react-hook-form": "^7.48.0",
    "zustand": "^4.4.0",
    "date-fns": "^2.30.0",
    "lucide-react": "^0.294.0",
    "recharts": "^2.10.0",
    "react-hot-toast": "^2.4.1",
    "react-calendar": "^4.6.0",
    "qrcode.react": "^3.1.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "typescript": "^5.3.0",
    "tailwindcss": "^3.3.0",
    "@tailwindcss/forms": "^0.5.7",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0",
    "eslint": "^8.54.0",
    "prettier": "^3.1.0"
  }
}
```

---

## Final Implementation Checklist

### Core Features

- ✅ Dashboard with summary cards and alerts
- ✅ Gear inventory CRUD operations
- ✅ Parts management for gear components
- ✅ Maintenance scheduling (time & usage-based)
- ✅ Maintenance history tracking
- ✅ Usage logging (jump records)
- ✅ Notification system (in-app & email)
- ✅ Settings and configuration

### UI/UX

- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Dark/light theme support
- ✅ Loading states and skeletons
- ✅ Empty states with helpful CTAs
- ✅ Error handling and validation
- ✅ Toast notifications
- ✅ Confirmation dialogs
- ✅ Keyboard navigation
- ✅ Accessibility (ARIA labels, focus management)

### Data Management

- ✅ React Query for server state
- ✅ Zustand for client state
- ✅ Form validation with React Hook Form
- ✅ Optimistic updates
- ✅ Error boundaries

### Performance

- ✅ Code splitting by routes
- ✅ Memoization of expensive calculations
- ✅ Debounced search inputs
- ✅ Pagination for large lists
- ✅ Image lazy loading

### Additional Features

- ✅ Search and filter
- ✅ Sort functionality
- ✅ Export to CSV/PDF
- ✅ Print labels with QR codes
- ✅ Data visualization (charts)
- ✅ Calendar view for maintenance

---

## Success Criteria

The generated frontend should:

1. **Be fully functional**: All CRUD operations working with mock/real API
2. **Be type-safe**: No TypeScript errors, proper type definitions
3. **Be accessible**: WCAG 2.1 AA compliance
4. **Be responsive**: Works on all screen sizes
5. **Be performant**: < 3s initial load, smooth interactions
6. **Be maintainable**: Clear code structure, reusable components
7. **Be tested**: Unit tests for critical functions
8. **Be documented**: JSDoc comments for complex functions

---

## Additional Notes for AI Code Generator

1. **Use TypeScript strictly**: No `any` types unless absolutely necessary
2. **Component composition**: Prefer small, focused components over large monolithic ones
3. **Consistent naming**: Use PascalCase for components, camelCase for functions/variables
4. **Error handling**: Every API call should have try-catch and user-friendly error messages
5. **Validation**: Client-side AND server-side validation expected
6. **Comments**: Add JSDoc comments for complex logic, but code should be self-documenting
7. **Git-ready**: Include .gitignore, .env.example
8. **README**: Include setup instructions and architecture overview

---

## Priority Order for Implementation

### Phase 1 (MVP - Week 1-2)

1. Project setup and configuration
2. Layout components (Sidebar, Header, AppLayout)
3. Common UI components (DataTable, Modal, Form fields)
4. Gear inventory page (list, add, edit, delete)
5. Basic API integration

### Phase 2 (Core Features - Week 3-4)

6. Parts management
7. Maintenance scheduling
8. Maintenance history
9. Dashboard with summary
10. Usage logging

### Phase 3 (Enhanced Features - Week 5-6)

11. Notifications system
12. Settings page
13. Data visualization (charts)
14. Export functionality
15. Search and filters

### Phase 4 (Polish - Week 7-8)

16. Responsive design refinements
17. Accessibility improvements
18. Performance optimizations
19. Testing
20. Documentation

---

This prompt provides comprehensive guidance for building a production-ready React frontend for the Skydiving Gear Inventory application. Generate clean, maintainable, and scalable code following all the guidelines and best practices outlined above.
