import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Availability from "./pages/Availability";
import Appointments from "./pages/Appointments";
import BookingPage from "./pages/BookingPage";
import FrontendRoutes from "./shared/constants/frontendRoutes";

import { ThemeProvider } from "./context/ThemeProvider";
import MainLayout from "./components/MainLayout";
import Home from "./pages/Home";
import { Toaster } from "react-hot-toast";
import { GoogleOAuthProvider } from "@react-oauth/google";

function App() {
  return (
    <Router>
      <Toaster position="top-center" reverseOrder={false} />
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <ThemeProvider>
          <AuthProvider>
            <Routes>
              <Route path={FrontendRoutes.HOME} element={<Home />} />
              <Route path={FrontendRoutes.SIGNUP} element={<Signup />} />
              <Route path={FrontendRoutes.LOGIN} element={<Login />} />

              <Route element={<MainLayout />}>
                <Route
                  path={FrontendRoutes.DASHBOARD}
                  element={<Dashboard />}
                />
                <Route
                  path={FrontendRoutes.AVAILABILITY}
                  element={<Availability />}
                />
                <Route
                  path={FrontendRoutes.APPOINTMENTS}
                  element={<Appointments />}
                />
              </Route>

              <Route path="/u/:linkSuffix" element={<BookingPage />} />
              <Route
                path="/"
                element={<Navigate to={FrontendRoutes.DASHBOARD} />}
              />
            </Routes>
          </AuthProvider>
        </ThemeProvider>
      </GoogleOAuthProvider>
    </Router>
  );
}

export default App;
