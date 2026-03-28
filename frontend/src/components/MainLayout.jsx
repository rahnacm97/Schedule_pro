import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Navbar from "./Navbar";
import FrontendRoutes from "../shared/constants/frontendRoutes";

const MainLayout = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-(--bg-main) flex items-center justify-center">
        <p className="font-serif text-(--text-secondary) text-lg italic tracking-tight">
          Loading…
        </p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to={FrontendRoutes.LOGIN} />;
  }

  return (
    <div className="min-h-screen bg-(--bg-main) flex flex-col w-full transition-colors duration-300">
      <Navbar />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
