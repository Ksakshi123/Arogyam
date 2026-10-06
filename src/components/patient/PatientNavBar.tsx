import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut, LayoutDashboard, CalendarDays, BarChart3, UserCircle } from "lucide-react";
import logoImage from "@/assets/arogyam-logo.png";
import { usePatientStore } from "@/store/patientStore";

const navLinks = [
  { label: "Dashboard",   to: "/patient/dashboard",  icon: LayoutDashboard },
  { label: "Weekly Plan", to: "/patient/meal-plan",   icon: CalendarDays },
  { label: "Analytics",   to: "/patient/nutrition",   icon: BarChart3 },
  { label: "Progress",    to: "/patient/progress",    icon: BarChart3 },
  { label: "Profile",     to: "/patient/profile",     icon: UserCircle },
];

const PatientNavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const logout = usePatientStore((s) => s.logout);

  const handleSignOut = () => {
    logout();
    navigate("/", { replace: true });
  };

  return (
    <header className="border-b bg-card/80 backdrop-blur-md sticky top-0 z-40 shadow-sm">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <img
            src={logoImage}
            alt="Arogyam"
            className="w-9 h-9 rounded-lg object-cover shadow-sm group-hover:scale-105 transition-transform"
          />
          <span className="text-xl font-bold hidden sm:block bg-gradient-to-r from-emerald-600 to-teal-700 bg-clip-text text-transparent">
            Arogyam
          </span>
        </Link>

        {/* Nav Links */}
        <nav className="flex items-center gap-1 sm:gap-2">
          {navLinks.map(({ label, to }) => {
            const isActive = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={`hidden sm:inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? "bg-primary/10 text-primary font-semibold"
                    : "text-muted-foreground hover:text-primary hover:bg-primary/5"
                }`}
              >
                {label}
              </Link>
            );
          })}

          {/* Sign Out */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 text-xs flex items-center gap-1.5 ml-1"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </Button>
        </nav>
      </div>

      {/* Mobile bottom nav strip */}
      <div className="flex sm:hidden border-t bg-card/60 px-2 py-1 justify-around">
        {navLinks.map(({ label, to, icon: Icon }) => {
          const isActive = location.pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg text-[10px] font-medium transition-all ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          );
        })}
      </div>
    </header>
  );
};

export default PatientNavBar;
