# InfraGuru - Refactored Codebase Structure

## Overview
This codebase has been refactored to clearly separate user-facing and admin-facing logic for better maintainability, scalability, and developer onboarding.

## Folder Structure

```
src/
├── admin/                    # Admin-only features
│   ├── components/          # Admin-specific components
│   │   ├── HomeDashboard.jsx
│   │   ├── TeamDashboard.jsx
│   │   ├── LeadTable.jsx
│   │   ├── TableView.jsx
│   │   ├── BulkAssignModal.jsx
│   │   ├── DashboardHeader.jsx
│   │   ├── EmployeeDetail.jsx
│   │   ├── EmployeeDetailLayout.jsx
│   │   ├── EmployeeDetailSidebar.jsx
│   │   ├── MembersAttendanceTable.jsx
│   │   ├── TeamLeadsAssigned.jsx
│   │   ├── PieChartSection.jsx
│   │   ├── FreshLeads.jsx
│   │   ├── AdminBroadCast.jsx
│   │   ├── PermissionsModal.jsx
│   │   ├── apexdonutchart.jsx
│   │   ├── Agents/            # Agent management
│   │   ├── projects-dev/      # Projects module
│   │   └── uploadBulkLeadPopup/
│   └── pages/               # Admin pages
│       ├── DashboardLayout.jsx
│       ├── AddLead.jsx
│       ├── EditLead.jsx
│       ├── AddProject.jsx
│       └── EditProject.jsx
│
├── user/                    # User-facing features
│   ├── components/         # User-specific components
│   └── pages/              # User pages
│       ├── UserDashboardLayout.jsx
│       └── UserDashboard.jsx
│
├── shared/                  # Shared between admin and user
│   ├── components/         # Common components
│   │   ├── TopBar.jsx
│   │   ├── SidebarMenu.jsx
│   │   ├── InputField.jsx
│   │   ├── ProtectedRouteNew.jsx
│   │   ├── RoleBasedRoute.jsx
│   │   ├── UserBroadCast.jsx
│   │   ├── UserLeads.jsx
│   │   ├── Profile.jsx
│   │   ├── bell/           # Notification bell
│   │   ├── broadcast-shared/ # Shared broadcast components
│   │   └── Debug components (DebugTeamsAPI, LeadsDebug, TestUserLeadsAPI)
│   │
│   ├── services/           # API services
│   │   ├── apiService.js
│   │   └── socketService.js
│   │
│   ├── contexts/           # React contexts
│   │   ├── AuthContext.jsx
│   │   └── AuthContextDefinition.js
│   │
│   ├── hooks/              # Custom hooks
│   │   ├── useAuth.js
│   │   └── useLeads.js
│   │
│   ├── providers/          # Provider components
│   │   └── QueryProvider.jsx
│   │
│   ├── utils/              # Utility functions
│   │   └── testEndpoints.js
│   │
│   ├── lib/                # Third-party configurations
│   │   └── queryClient.js
│   │
│   └── stores/             # State management
│       └── authStore.js
│
├── pages/                   # Public pages (auth)
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── ForgotPassword.jsx
│   └── ResetPassword.jsx
│
├── assets/                  # Static assets
├── App.jsx                  # Main app with role-based routing
├── main.jsx                 # Entry point
└── index.css                # Global styles
```

## Key Features

### 1. Role-Based Routing
- **Automatic Redirection**: Users are automatically routed to `/admin` or `/user` based on their role from the profile API
- **Protected Routes**: All authenticated routes are wrapped with `<ProtectedRoute>`
- **Role Validation**: `<RoleBasedRoute>` component validates user role before rendering

### 2. Admin Features (`/admin/*`)
- Full dashboard with team management
- Lead management (create, edit, delete, bulk assign)
- Project management
- Employee and agent detail views
- Admin broadcast
- Team analytics and reports
- Permissions management

### 3. User Features (`/user/*`)
- Simple, clean dashboard
- View assigned leads
- User broadcast
- Profile management

### 4. Shared Features
- Authentication (login, register, password reset)
- Profile viewing/editing
- Broadcast messaging (both admin and user versions)
- Common UI components (TopBar, Sidebar, etc.)

## Authentication Flow

```
1. User logs in → AuthContext fetches profile
2. Profile contains user.role ('admin' or 'user')
3. App.jsx routes to appropriate section:
   - role === 'admin' → /admin/dashboard
   - role === 'user' → /user/dashboard
4. RoleBasedRoute prevents unauthorized access
```

## Import Path Updates

### Before Refactoring
```javascript
import api from '../services/apiService'
import { useAuth } from '../hooks/useAuth'
import HomeDashboard from './components/HomeDashboard'
```

### After Refactoring
```javascript
// From admin components
import api from '../../shared/services/apiService'
import { useAuth } from '../../shared/hooks/useAuth'

// From user components
import api from '../../shared/services/apiService'
import { useAuth } from '../../shared/hooks/useAuth'

// In App.jsx
import HomeDashboard from './admin/components/HomeDashboard'
import UserDashboard from './user/pages/UserDashboard'
import api from './shared/services/apiService'
```

## Route Structure

### Admin Routes (`/admin/*`)
- `/admin/dashboard` - Main admin dashboard
- `/admin/team-dashboard` - Team overview
- `/admin/leads` - Lead management
- `/admin/leads/add` - Add new lead
- `/admin/leads/edit/:id` - Edit lead
- `/admin/projects` - Projects list
- `/admin/projects/add` - Add project
- `/admin/projects/edit/:id` - Edit project
- `/admin/agents` - Agent management
- `/admin/broadcast` - Admin broadcast
- `/admin/profile` - Admin profile
- `/admin/employee/:id` - Employee details
- `/admin/employee/:id/leads` - Employee leads
- `/admin/agent/:id` - Agent details

### User Routes (`/user/*`)
- `/user/dashboard` - User dashboard
- `/user/leads` - User's assigned leads
- `/user/broadcast` - User broadcast
- `/user/profile` - User profile

### Public Routes
- `/login` - Login page
- `/register` - Registration page
- `/forgot-password` - Password reset request
- `/reset-password` - Password reset form

## Development Guidelines

### Adding New Admin Features
1. Create component in `src/admin/components/` or page in `src/admin/pages/`
2. Add route in `App.jsx` under `/admin` section
3. Import shared utilities from `src/shared/`

### Adding New User Features
1. Create component in `src/user/components/` or page in `src/user/pages/`
2. Add route in `App.jsx` under `/user` section
3. Import shared utilities from `src/shared/`

### Adding Shared Features
1. Create component/utility in appropriate `src/shared/` subfolder
2. Export from the file
3. Import in admin or user components as needed

### Import Rules
- **Never** import from `admin/` in `user/` or vice versa
- **Always** import shared utilities from `shared/`
- Use relative paths: `../../shared/...` from feature folders

## Benefits of This Structure

✅ **Clear Separation of Concerns**: Admin and user code are completely isolated
✅ **Easy Onboarding**: New developers immediately understand the structure
✅ **Maintainability**: Changes to admin features won't affect user features
✅ **Scalability**: Easy to add new features to either section
✅ **Code Reusability**: Shared utilities prevent duplication
✅ **Type Safety**: Clear boundaries make TypeScript migration easier
✅ **Testing**: Isolated modules are easier to test

## Migration Notes

### Removed
- Old mixed components folder structure
- Unused components and dead code
- Duplicate imports

### Updated
- All import paths to reflect new structure
- App.jsx with role-based routing
- AuthContext to work with new structure

### Added
- RoleBasedRoute component for automatic role-based redirection
- Basic user dashboard and layout
- Clear folder structure with admin/user/shared separation
- This documentation

## Next Steps

1. ✅ Folder structure created
2. ✅ Files moved to appropriate locations
3. ✅ Role-based routing implemented
4. ✅ Basic user UI created
5. ⏳ Update all import paths (in progress)
6. ⏳ Test authentication flow
7. ⏳ Test admin features
8. ⏳ Test user features
9. ⏳ Remove any remaining unused code

## Support

For questions or issues with the new structure, refer to:
- `src/App.jsx` - Main routing logic
- `src/shared/components/RoleBasedRoute.jsx` - Role-based routing
- `src/shared/contexts/AuthContext.jsx` - Authentication logic
