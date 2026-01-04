# Staff and Admin Routes

## Overview

The application now has separate routes for staff and admin users to access the reservations management system.

## Routes

### Admin Route

- **URL**: `/admin/reservations`
- **Access Level**: Full access (can view, cancel, reschedule, archive bookings)
- **Features**:
  - View all bookings (active and archived)
  - Cancel appointments
  - Reschedule appointments
  - Archive/unarchive bookings
  - Role switcher (for testing between admin and staff views)

### Staff Route

- **URL**: `/staff/reservations`
- **Access Level**: Read-only access
- **Features**:
  - View all bookings (active and archived)
  - Cannot cancel, reschedule, or archive bookings
  - No role switcher (locked to staff role)
  - "Read-only" badge in booking details

## Usage

### For Admins

Navigate to: `http://localhost:5173/admin/reservations`

Admins have full control over all reservations and can:

- Manage all bookings
- Switch between admin and staff views (for testing)
- Access all action buttons

### For Staff Members

Navigate to: `http://localhost:5173/staff/reservations`

Staff members can:

- View all reservation details
- Check booking status and patient information
- Search and filter bookings
- View archived bookings
- **Cannot** modify any bookings (read-only access)

## Implementation Details

### File Structure

```
src/
├── pages/
│   ├── admin/
│   │   └── Reservations.tsx      # Main component (shared)
│   └── staff/
│       └── Reservations.tsx      # Staff route wrapper
├── hooks/
│   └── useUserRole.ts            # Role and permissions management
└── App.tsx                       # Route configuration
```

### How It Works

1. **Staff Route** (`/staff/reservations`):

   - Wraps the AdminReservations component
   - Automatically sets role to "staff" on mount
   - Hides role switcher buttons
   - Role persists in localStorage

2. **Admin Route** (`/admin/reservations`):
   - Direct access to AdminReservations component
   - Shows role switcher for testing
   - Full permissions by default
   - Can switch to staff view for testing

### Permission System

Permissions are managed through the `useUserRole` hook:

```typescript
{
  canCancel: boolean,        // Admin: true, Staff: false
  canReschedule: boolean,    // Admin: true, Staff: false
  canArchive: boolean,       // Admin: true, Staff: false
  canUnarchive: boolean,     // Admin: true, Staff: false
  canViewArchived: boolean   // Admin: true, Staff: true
}
```

## Testing

1. **Test Admin Route**:

   ```
   http://localhost:5173/admin/reservations
   ```

   - Verify all action buttons are visible
   - Test cancel, reschedule, archive operations
   - Try switching between admin and staff views

2. **Test Staff Route**:
   ```
   http://localhost:5173/staff/reservations
   ```
   - Verify no action buttons appear
   - Check "Read-only" badge is visible
   - Verify no role switcher buttons
   - Refresh page and confirm role persists

## Future Enhancements

Consider adding:

- Backend authentication integration
- User login system
- Route protection middleware
- Audit logs for admin actions
- Role assignment management
