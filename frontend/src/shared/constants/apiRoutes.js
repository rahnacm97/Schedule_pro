const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const ApiRoutes = {
  AUTH: {
    SIGNUP: '/auth/signup',
    LOGIN: '/auth/login',
    GOOGLE: '/auth/google',
    ME: '/auth/me',
    PUBLIC_PROFILE: (suffix) => `/auth/public/${suffix}`,
  },
  AVAILABILITY: {
    BASE: '/availability',
    PUBLIC: (suffix) => `/availability/public/${suffix}`,
  },
  BOOKINGS: {
    BASE: '/bookings',
    STATS: '/bookings/stats',
    PUBLIC: (suffix) => `/bookings/${suffix}`,
    CANCEL: (id) => `/bookings/${id}/cancel`,
  },
  CALENDAR: {
    GOOGLE_AUTH: '/calendar/google/auth',
  },
};

export default ApiRoutes;
