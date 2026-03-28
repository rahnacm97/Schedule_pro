const FrontendRoutes = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  DASHBOARD: '/dashboard',
  AVAILABILITY: '/availability',
  APPOINTMENTS: '/appointments',
  BOOKING_PAGE: (suffix) => `/u/${suffix}`,
};

export default FrontendRoutes;
