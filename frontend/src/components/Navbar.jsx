import {
  SignInButton,
  SignUpButton,
  UserButton,
  useUser,
} from "@clerk/clerk-react";
import {
  BookDashed,
  Bot,
  DumbbellIcon,
  HomeIcon,
  LayoutDashboard,
  Search,
  UserIcon,
  ZapIcon,
} from "lucide-react";
import { Button } from "./ui/button";
import { useLocation, useNavigate } from "react-router-dom";

const Navbar = () => {
  const { isSignedIn } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/60 backdrop-blur-md border-b border-border py-3">
      <div className="container mx-auto flex items-center justify-between">
        {/* LOGO */}
        <div
          onClick={() => navigate("/")}
          className="flex items-center gap-2 cursor-pointer ml-3"
        >
          <div className="p-1 bg-primary/10 rounded">
            <ZapIcon className="w-4 h-4 text-primary" />
          </div>
          <span className="text-xl font-bold font-mono">
            Gen<span className="text-primary">Fit</span>Plan
          </span>
        </div>

        {/* NAVIGATION */}
        <nav className="flex items-center gap-5 mr-5">
          {isSignedIn ? (
            <>
              <div
                onClick={() => navigate("/")}
                className={`flex items-center gap-1.5 text-sm hover:text-primary transition-colors cursor-pointer ${
                  location.pathname === "/"
                    ? "text-primary font-semibold"
                    : "hover:text-primary"
                }`}
              >
                <HomeIcon size={16} />
                <span>Home</span>
              </div>

              <div
                onClick={() => navigate("/generate-program")}
                className={`flex items-center gap-1.5 text-sm hover:text-primary transition-colors cursor-pointer ${
                  location.pathname === "/generate-program"
                    ? "text-primary font-semibold"
                    : "hover:text-primary"
                }`}
              >
                <DumbbellIcon size={16} />
                <span>Generate</span>
              </div>

              <div
                onClick={() => navigate("/profile")}
                className={`flex items-center gap-1.5 text-sm hover:text-primary transition-colors cursor-pointer ${
                  location.pathname === "/profile"
                    ? "text-primary font-semibold"
                    : "hover:text-primary"
                }`}
              >
                <UserIcon size={16} />
                <span>Profile</span>
              </div>

              <div
                onClick={() => navigate("/workout-history")}
                className={`flex items-center gap-1.5 text-sm hover:text-primary transition-colors cursor-pointer ${
                  location.pathname === "/workout-history"
                    ? "text-primary font-semibold"
                    : "hover:text-primary"
                }`}
              >
                <LayoutDashboard size={16} />
                <span>Dashboard</span>
              </div>

              <div
                onClick={() => navigate("/youtube-search")}
                className={`flex items-center gap-1.5 text-sm hover:text-primary transition-colors cursor-pointer ${
                  location.pathname === "/youtube-search"
                    ? "text-primary font-semibold"
                    : "hover:text-primary"
                }`}
              >
                <Search size={16} />
                <span>Video search</span>
              </div>

              <div
                onClick={() => navigate("/chatbot")}
                className={`flex items-center gap-1.5 text-sm hover:text-primary transition-colors cursor-pointer ${
                  location.pathname === "/chatbot"
                    ? "text-primary font-semibold"
                    : "hover:text-primary"
                }`}
              >
                <Bot size={16} />
                <span>Ask AI</span>
              </div>

              <UserButton />
            </>
          ) : (
            <>
              {/* <SignInButton> */}
              <Button
                variant={"outline"}
                className="border-primary/50 text-primary hover:text-white hover:bg-primary/10"
                onClick={() => navigate("/sign-in")}
              >
                Sign In
              </Button>
              {/* </SignInButton> */}

              {/* <SignUpButton> */}
              <Button
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={() => navigate("/sign-up")}
              >
                Sign Up
              </Button>
              {/* </SignUpButton> */}
            </>
          )}
        </nav>
      </div>
    </header>
  );
};
export default Navbar;
