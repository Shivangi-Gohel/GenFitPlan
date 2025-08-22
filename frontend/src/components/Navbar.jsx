import {
  UserButton,
  useUser,
} from "@clerk/clerk-react";
import {
  Bot,
  DumbbellIcon,
  HomeIcon,
  LayoutDashboard,
  Search,
  UserIcon,
  ZapIcon,
  X,
  Menu,
} from "lucide-react";
import { Button } from "./ui/button";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

const Navbar = () => {
  const { isSignedIn } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false)

   const navLinks = [
    { path: "/", label: "Home", icon: <HomeIcon size={16} /> },
    { path: "/generate-program", label: "Generate", icon: <DumbbellIcon size={16} /> },
    { path: "/profile", label: "Profile", icon: <UserIcon size={16} /> },
    { path: "/workout-history", label: "Dashboard", icon: <LayoutDashboard size={16} /> },
    { path: "/youtube-search", label: "Video search", icon: <Search size={16} /> },
    { path: "/chatbot", label: "Ask AI", icon: <Bot size={16} /> },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/60 backdrop-blur-md border-b border-border py-3">
      <div className="container mx-auto flex items-center justify-between px-3">
        <div
          onClick={() => navigate("/")}
          className="flex items-center gap-2 cursor-pointer"
        >
          <div className="p-1 bg-primary/10 rounded">
            <ZapIcon className="w-4 h-4 text-primary" />
          </div>
          <span className="text-xl font-bold font-mono">
            Gen<span className="text-primary">Fit</span>Plan
          </span>
        </div>

        {/* DESKTOP NAV */}
        <nav className="hidden md:flex items-center gap-5">
          {isSignedIn ? (
            <>
              {navLinks.map(({ path, label, icon }) => (
                <div
                  key={path}
                  onClick={() => navigate(path)}
                  className={`flex items-center gap-1.5 text-sm transition-colors cursor-pointer ${
                    location.pathname === path
                      ? "text-primary font-semibold"
                      : "hover:text-primary"
                  }`}
                >
                  {icon}
                  <span>{label}</span>
                </div>
              ))}
              <UserButton />
            </>
          ) : (
            <>
              <Button
                variant={"outline"}
                className="border-primary/50 text-primary hover:text-white hover:bg-primary/10"
                onClick={() => navigate("/sign-in")}
              >
                Sign In
              </Button>
              <Button
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={() => navigate("/sign-up")}
              >
                Sign Up
              </Button>
            </>
          )}
        </nav>

        {/* MOBILE MENU BUTTON */}
        <button
          className="md:hidden p-2 rounded hover:bg-primary/10"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* MOBILE NAV */}
      {isOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-md border-t border-border p-4 space-y-4">
          {isSignedIn ? (
            <>
              {navLinks.map(({ path, label, icon }) => (
                <div
                  key={path}
                  onClick={() => {
                    navigate(path)
                    setIsOpen(false)
                  }}
                  className={`flex items-center gap-2 text-sm cursor-pointer ${
                    location.pathname === path
                      ? "text-primary font-semibold"
                      : "hover:text-primary"
                  }`}
                >
                  {icon}
                  <span>{label}</span>
                </div>
              ))}
              <UserButton />
            </>
          ) : (
            <div className="flex flex-col gap-2">
              <Button
                variant={"outline"}
                className="border-primary/50 text-primary hover:text-white hover:bg-primary/10"
                onClick={() => {
                  navigate("/sign-in")
                  setIsOpen(false)
                }}
              >
                Sign In
              </Button>
              <Button
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={() => {
                  navigate("/sign-up")
                  setIsOpen(false)
                }}
              >
                Sign Up
              </Button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
export default Navbar;
