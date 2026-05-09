import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Check } from "lucide-react";

const SignInForm = ({ onSubmit, loading }) => {
  const [showPwd, setShowPwd] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold tracking-tight">Welcome back </h2>
        <p className="text-sm text-white/50 mt-1.5">Sign in to resume your interview prep.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs text-white/60 font-medium">Email</label>
          <div className="relative group">
            <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-cyan-300 transition" />
            <input
              type="email"
              name="email"
              placeholder="you@domain.com"
              value={formData.email}
              onChange={handleChange}
              className="w-full pl-10 h-12 rounded-lg bg-white/[0.04] border border-white/10 text-white placeholder:text-white/30 focus:ring-2 focus:ring-cyan-400/40 focus:border-cyan-400/40 transition outline-none"
              required
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs text-white/60 font-medium">Password</label>
          </div>
          <div className="relative group">
            <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-cyan-300 transition" />
            <input
              type={showPwd ? "text" : "password"}
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              className="w-full pl-10 pr-11 h-12 rounded-lg bg-white/[0.04] border border-white/10 text-white placeholder:text-white/30 focus:ring-2 focus:ring-cyan-400/40 focus:border-cyan-400/40 transition outline-none"
              required
            />
            <button
              type="button"
              onClick={() => setShowPwd(!showPwd)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 transition"
            >
              {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full h-12 rounded-lg bg-gradient-to-r from-cyan-400 to-fuchsia-500 text-[#070711] font-semibold shadow-lg shadow-fuchsia-500/30 hover:shadow-fuchsia-500/50 transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2 group cursor-pointer"
        >
          {loading ? "Signing in..." : "Sign in"}
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>
      </form>
    </div>
  );
};

export default SignInForm;