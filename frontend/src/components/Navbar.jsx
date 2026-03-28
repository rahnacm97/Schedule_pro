import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../hooks/useTheme";
import { LogOut, Menu, X, Sun, Moon } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import FrontendRoutes from "../shared/constants/frontendRoutes";
import Logo from "./Logo";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (!user) return null;

  const navLinks = [
    { label: "Dashboard", to: FrontendRoutes.DASHBOARD },
    { label: "Appointments", to: FrontendRoutes.APPOINTMENTS },
    { label: "Availability", to: FrontendRoutes.AVAILABILITY },
  ];

  return (
    <nav className="bg-(--nav-bg) border-b border-(--divider-color) h-16 md:h-13 px-4 md:px-7 flex items-center justify-between sticky top-0 z-50 transition-colors duration-300">
      {/* Brand */}
      <Link
        to={FrontendRoutes.HOME}
        className="flex items-center gap-2.5 group"
      >
        <Logo />
        <div className="leading-none">
          <span className="font-serif text-(--text-primary) text-[15px] tracking-tight block transition-colors">
            Schedule
          </span>
          <span className="font-serif italic text-(--accent-color) text-[11px] tracking-tight block -mt-0.5 transition-colors">
            Pro
          </span>
        </div>
      </Link>

      {/* Desktop Nav links */}
      <div className="hidden md:flex items-center gap-1">
        {navLinks.map(({ label, to }) => (
          <Link
            key={to}
            to={to}
            className={`text-[13px] px-3.5 py-1.5 rounded-xl transition-all font-medium ${
              location.pathname === to
                ? "text-(--text-primary) bg-(--nav-hover-bg) shadow-sm"
                : "text-(--text-secondary) hover:text-(--text-primary) hover:bg-(--nav-hover-bg)"
            }`}
          >
            {label}
          </Link>
        ))}
      </div>

      {/* Right side */}
      <div className="hidden md:flex items-center gap-3">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl text-(--text-secondary) hover:text-(--nav-text) hover:bg-(--nav-hover-bg) transition-all"
          title={
            theme === "light" ? "Switch to dark mode" : "Switch to light mode"
          }
        >
          {theme === "light" ? (
            <Moon className="w-4.5 h-4.5" />
          ) : (
            <Sun className="w-4.5 h-4.5" />
          )}
        </button>
        <div className="w-px h-5 bg-(--divider-color)" />
        <span className="text-[13px] text-(--text-secondary) font-medium px-1 transition-colors">
          {user.name}
        </span>
        <button
          onClick={logout}
          title="Log out"
          className="p-2 flex items-center justify-center rounded-xl text-(--text-secondary) hover:text-red-500 hover:bg-red-500/10 transition-all"
        >
          <LogOut className="w-4.5 h-4.5" />
        </button>
      </div>

      {/* Mobile Menu Button */}
      <div className="flex md:hidden items-center gap-1">
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-xl text-(--text-secondary) hover:bg-(--nav-hover-bg)"
        >
          {theme === "light" ? (
            <Moon className="w-5.5 h-5.5" />
          ) : (
            <Sun className="w-5.5 h-5.5" />
          )}
        </button>
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2.5 rounded-xl text-(--text-secondary) hover:bg-(--nav-hover-bg)"
        >
          {isMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile Drawer */}
      {isMenuOpen && (
        <div className="absolute top-16 left-0 w-full bg-(--nav-bg) border-t border-(--divider-color) py-6 px-6 flex flex-col gap-5 md:hidden shadow-xl animate-in fade-in slide-in-from-top-4 duration-300">
          {navLinks.map(({ label, to }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setIsMenuOpen(false)}
              className={`text-[15px] py-3 px-4 rounded-xl transition-all font-medium ${
                location.pathname === to
                  ? "text-(--text-primary) bg-(--nav-hover-bg) shadow-sm"
                  : "text-(--text-secondary) hover:text-(--text-primary) hover:bg-(--nav-hover-bg)"
              }`}
            >
              {label}
            </Link>
          ))}
          <div className="h-px bg-(--divider-color) my-1" />
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-3">
              <span className="text-[14px] text-(--text-secondary) font-medium">
                {user.name}
              </span>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-2 text-[14px] font-medium text-red-500 hover:bg-red-500/10 px-4 py-2.5 rounded-xl transition-all"
            >
              <LogOut className="w-4.5 h-4.5" />
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
