import { ZapIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();
  return (
    <footer className="border-t border-border bg-background/80 backdrop-blur-sm">
      <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col items-center md:items-start gap-2">
            <div onClick={()=>navigate("/")} className="flex items-center gap-2">
              <div className="p-1 bg-primary/10 rounded">
                <ZapIcon className="w-4 h-4 text-primary" />
              </div>
              <span className="text-xl font-bold font-mono">
                Gen<span className="text-primary">Fit</span>Plan
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} GenFitPlan - All rights reserved
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-12 gap-y-2 text-sm">
            <div
              onClick={() => navigate("/about")}
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              About
            </div>
            <div
              onClick={() => navigate("/terms")}
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Terms
            </div>
            <div
              onClick={() => navigate("/privacy")}
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Privacy
            </div>
            <div
              onClick={() => navigate("/contact")}
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Contact
            </div>
            <div
              onClick={() => navigate("/blog")}
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Blog
            </div>
            <div
              onClick={() => navigate("/help")}
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Help
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-2 border border-border rounded-md bg-background/50">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="text-xs font-mono">SYSTEM OPERATIONAL</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;