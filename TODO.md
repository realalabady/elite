# TODO: Fix /api/booking/available-slots Route Error

## Steps to Complete

- [x] Remove PrismaService from BookingModule providers to resolve dependency injection conflict
- [x] Update getAvailableSlots method in BookingService to accept serviceId parameter
- [x] Restart the backend server
- [ ] Test the /api/booking/available-slots route to ensure it returns available slots instead of 500 error
