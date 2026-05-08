import { LogOut, Sparkles } from "lucide-react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <div className="w-full">
      <header className="relative overflow-hidden border border-slate-200/70 bg-white/80 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.06)]">
        
        {/* Background Glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-50 via-white to-purple-50 opacity-80" />

        <div className="relative z-10 flex items-center justify-between px-6 py-3 md:px-8">
          
          {/* Left Side */}
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 shadow-md">
                <Sparkles className="w-5 h-5 text-white" />
              </div>

              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900">
                Mock Interview{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-purple-700">
                  AI Agent
                </span>
              </h1>
            </div>

            <p className="text-sm md:text-base text-slate-600 mt-2 ml-1">
              Practice smarter with AI-powered interviews
            </p>
          </div>

          {/* Right Side */}
          <button
            onClick={handleLogout}
            className="group flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-semibold shadow-lg hover:shadow-red-200   active:scale-95 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </header>
    </div>
  );
};

export default Header;