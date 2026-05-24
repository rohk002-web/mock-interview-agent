import { useState } from "react";
import { Mail, Lock, User, Eye, EyeOff, ArrowRight } from "lucide-react";

const CreateUserForm = ({ onSubmit, loading }) => {
  const [showPwd, setShowPwd] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const pwdStrength = (() => {
    let s = 0;
    const pwd = formData.password;
    if (pwd.length >= 8) s++;
    if (/[A-Z]/.test(pwd)) s++;
    if (/\d/.test(pwd)) s++;
    if (/[^A-Za-z0-9]/.test(pwd)) s++;
    return s;
  })();

  const strengthLabels = ["Too weak", "Weak", "Okay", "Strong", "Excellent"];
  const strengthColors = ["bg-white/10", "bg-rose-500", "bg-amber-400", "bg-cyan-400", "bg-emerald-400"];

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold tracking-tight">Start practicing today</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs text-white/60 font-medium">Full Name</label>
          <div className="relative group">
            <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-cyan-300 transition" />
            <input
              type="text"
              name="name"
              placeholder="Ada Lovelace"
              value={formData.name}
              onChange={handleChange}
              className="w-full pl-10 h-12 rounded-lg bg-white/[0.04] border border-white/10 text-white placeholder:text-white/30 focus:ring-2 focus:ring-cyan-400/40 focus:border-cyan-400/40 transition outline-none"
              required
            />
          </div>
        </div>

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
          <label className="text-xs text-white/60 font-medium">Password</label>
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

          {formData.password.length > 0 && (
            <div className="pt-2 animate-fade-in">
              <div className="flex gap-1">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                      i < pwdStrength ? strengthColors[pwdStrength] : "bg-white/10"
                    }`}
                  />
                ))}
              </div>
              <p className="text-[11px] text-white/50 mt-1.5">
                Strength: <span className="text-white/80">{strengthLabels[pwdStrength]}</span>
              </p>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full h-12 rounded-lg bg-gradient-to-r from-cyan-400 to-fuchsia-500 text-[#070711] font-semibold shadow-lg shadow-fuchsia-500/30 hover:shadow-fuchsia-500/50 transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2 group cursor-pointer"
        >
          {loading ? "Creating..." : "Create my account"}
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>
      </form>
    </div>
  );
};

export default CreateUserForm;