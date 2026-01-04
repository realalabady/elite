# Authentication System Documentation

## Overview

The application now has a complete authentication system that protects admin and staff routes from unauthorized access.

## Features

### 🔐 Authentication

- Login page with username/password
- Protected routes for admin and staff
- Persistent login (localStorage)
- Automatic logout functionality
- Role-based access control

### 👥 User Roles

- **Admin**: Full access to all reservation management features
- **Staff**: Read-only access to view reservations

### 🛡️ Protected Routes

- `/admin/reservations` - Requires admin role
- `/staff/reservations` - Requires staff role
- Unauthenticated users are redirected to `/login`
- Users are redirected to their appropriate dashboard based on role

## Demo Credentials

### Admin User

```
Username: admin
Password: admin123
```

- Full permissions (cancel, reschedule, archive)
- Access to `/admin/reservations`

### Staff User

```
Username: staff
Password: staff123
```

- Read-only permissions
- Access to `/staff/reservations`

## How It Works

### 1. Authentication Flow

```
User visits protected route
    ↓
Not authenticated? → Redirect to /login
    ↓
Login successful → Redirect to appropriate route based on role
    ↓
Admin → /admin/reservations
Staff → /staff/reservations
```

### 2. File Structure

```
src/
├── contexts/
│   └── AuthContext.tsx          # Authentication state management
├── pages/
│   ├── Login.tsx                # Login page
│   ├── admin/
│   │   └── Reservations.tsx     # Admin dashboard
│   └── staff/
│       └── Reservations.tsx     # Staff dashboard
├── components/
│   ├── ProtectedRoute.tsx       # Route protection wrapper
│   └── layout/
│       └── Navbar.tsx           # Updated with logout
└── App.tsx                      # Updated routing

db.json                          # Added users array
```

### 3. Core Components

#### AuthContext

- Manages authentication state
- Provides login/logout functions
- Stores user info in localStorage
- Validates credentials against json-server

#### ProtectedRoute

- Wraps protected pages
- Checks authentication status
- Enforces role requirements
- Redirects unauthorized users

#### Login Page

- Clean, modern UI
- Form validation
- Error handling
- Demo credentials display

### 4. Navigation Changes

- Navbar shows user name when logged in
- Logout button appears for authenticated users
- Works in both desktop and mobile views

## Testing

### Test Admin Access

1. Navigate to: `http://localhost:5173/admin/reservations`
2. You'll be redirected to login
3. Enter admin credentials
4. Should redirect to admin dashboard with full permissions

### Test Staff Access

1. Navigate to: `http://localhost:5173/staff/reservations`
2. You'll be redirected to login
3. Enter staff credentials
4. Should redirect to staff dashboard with read-only access

### Test Role Enforcement

1. Login as staff
2. Try accessing `/admin/reservations`
3. Should redirect back to `/staff/reservations`

### Test Logout

1. Login with any account
2. Click logout in navbar
3. Try accessing protected route
4. Should redirect to login

## API Endpoints Used

### Get Users (Login)

```
GET http://localhost:3002/users
```

Returns array of users with credentials and roles.

## Security Notes

⚠️ **Important**: This is a demo authentication system suitable for development/testing only.

For production, you should:

- Implement server-side authentication
- Never store passwords in plain text
- Use JWT tokens or sessions
- Add password hashing (bcrypt)
- Implement HTTPS
- Add rate limiting
- Add CSRF protection
- Use secure HttpOnly cookies

## Adding New Users

Edit `db.json` and add to the users array:

```json
{
  "id": 3,
  "username": "newuser",
  "password": "password123",
  "name": "New User Name",
  "role": "admin" // or "staff"
}
```

Restart json-server after editing.

## Customization

### Change Required Role for Route

```tsx
<Route
  path="/custom-route"
  element={
    <ProtectedRoute requiredRole="admin">
      <YourComponent />
    </ProtectedRoute>
  }
/>
```

### Make Route Require Any Authentication (No Specific Role)

```tsx
<Route
  path="/any-authenticated"
  element={
    <ProtectedRoute>
      <YourComponent />
    </ProtectedRoute>
  }
/>
```

## Troubleshooting

### "Can't access protected routes"

- Ensure json-server is running: `npm run json-server`
- Check console for errors
- Verify localStorage has `auth_user` key
- Clear localStorage and login again

### "Role not persisting"

- Check browser localStorage
- Verify `auth_user` key contains correct role
- Try logout and login again

### "Logout not working"

- Check if AuthContext is wrapped around app
- Verify localStorage is being cleared
- Check browser console for errors
