import { useEffect, useState } from "react";
import { Mic, Sparkles, Brain, Target, Waves } from "lucide-react";
import { useNavigate } from "react-router-dom";


const features = [
  { 
    icon: Brain, 
    title: "Role-aware questions", 
    desc: "From SDE to Data Analyst — tailored every session.", 
    color: "from-cyan-400/20 to-blue-500/20", 
    iconColor: "text-cyan-300" 
  },

  { 
    icon: Target, 
    title: "Actionable scoring", 
    desc: "Clarity, confidence, structure — measured every answer.", 
    color: "from-violet-400/20 to-indigo-500/20", 
    iconColor: "text-violet-300" 
  },
];

const AuthSidePanel = ({ children, mode, setMode }) => {
  const navigate = useNavigate();
  const [mouse, setMouse] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const onMove = (e) => {
      setMouse({ 
        x: (e.clientX / window.innerWidth) * 100, 
        y: (e.clientY / window.innerHeight) * 100 
      });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div className="min-h-screen bg-[#070711] text-white relative overflow-hidden font-sans w-full">
      {/* Animated aurora */}
      <div
        className="pointer-events-none absolute inset-0 transition-all duration-700"
        style={{
          background: `radial-gradient(600px circle at ${mouse.x}% ${mouse.y}%, rgba(34,211,238,0.12), transparent 40%)`,
        }}
      />
      <div className="pointer-events-none absolute -top-48 -left-32 w-[560px] h-[560px] rounded-full bg-fuchsia-600/30 blur-[140px] animate-pulse" style={{ animationDuration: "6s" }} />
      <div className="pointer-events-none absolute top-1/3 -right-48 w-[600px] h-[600px] rounded-full bg-cyan-500/25 blur-[140px] animate-pulse" style={{ animationDuration: "8s" }} />
      <div className="pointer-events-none absolute -bottom-40 left-1/3 w-[500px] h-[500px] rounded-full bg-violet-600/30 blur-[140px] animate-pulse" style={{ animationDuration: "7s" }} />

      {/* Grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.7) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage: "radial-gradient(ellipse at center, black 40%, transparent 75%)",
        }}
      />

      <div className="relative z-10 grid lg:grid-cols-[1.1fr_1fr] min-h-screen">
        {/* LEFT */}
        <div className="hidden lg:flex flex-col justify-between p-12 xl:p-16 border-r border-white/5">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-fuchsia-500 blur-md opacity-70" />
              <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-400 to-fuchsia-500 grid place-items-center">
                <Mic className="w-5 h-5 text-[#070711]" />
              </div>
            </div>
            <div>
              <p className="font-semibold tracking-tight text-[15px]">Mock Interview Application</p>
            </div>
          </div>

          <div className="space-y-8 max-w-xl">

            <h1 className="text-5xl xl:text-6xl font-semibold leading-[1.05] tracking-tight">
              Crack interviews with an AI that{" "}
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-cyan-300 via-fuchsia-400 to-violet-400 bg-clip-text text-transparent">
                  actually listens.
                </span>
                <svg className="absolute -bottom-2 left-0 w-full" height="10" viewBox="0 0 200 10" fill="none">
                  <path d="M2 7 Q 50 1 100 5 T 198 4" stroke="url(#g)" strokeWidth="2" strokeLinecap="round" />
                  <defs>
                    <linearGradient id="g" x1="0" x2="1">
                      <stop offset="0%" stopColor="#22d3ee" />
                      <stop offset="100%" stopColor="#d946ef" />
                    </linearGradient>
                  </defs>
                </svg>
              </span>
            </h1>

            <p className="text-white/60 text-lg leading-relaxed max-w-md">
              Practice technical, behavioral, and HR rounds with a voice agent that adapts to your role,
              scores your answers, and tells you exactly what to fix.
            </p>

            <div className="grid gap-3">
              {features.map((f, i) => (
                <div
                  key={f.title}
                  className="group flex gap-4 p-4 rounded-xl border border-white/5 bg-white/[0.03] backdrop-blur hover:bg-white/[0.06] hover:border-white/10 transition-all hover:-translate-y-0.5"
                >
                  <div className={`w-10 h-10 shrink-0 rounded-lg bg-gradient-to-br ${f.color} border border-white/10 grid place-items-center group-hover:scale-110 transition-transform`}>
                    <f.icon className={`w-4 h-4 ${f.iconColor}`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{f.title}</p>
                    <p className="text-xs text-white/50 mt-0.5">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT */}
        <div className="flex items-center justify-center p-6 sm:p-10">
          <div className="w-full max-w-md">
            {/* Mobile brand */}
            <div className="lg:hidden flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-fuchsia-500 grid place-items-center">
                <Mic className="w-5 h-5 text-[#070711]" />
              </div>
              <div>
                <p className="font-semibold tracking-tight">MockMate AI</p>
                <p className="text-xs text-white/50">Your AI Interview Coach</p>
              </div>
            </div>

            {/* Card with gradient border */}
            <div className="relative rounded-2xl p-[1px] bg-gradient-to-br from-cyan-400/40 via-fuchsia-500/20 to-violet-500/40 shadow-2xl shadow-fuchsia-500/10">
              <div className="rounded-2xl bg-[#0b0b18]/90 backdrop-blur-xl p-7 sm:p-8">
                {/* Tabs */}
                <div className="relative grid grid-cols-2 p-1 rounded-xl bg-white/[0.04] border border-white/10 mb-7">
                  <div
                    className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-lg bg-gradient-to-r from-cyan-400 to-fuchsia-500 transition-all duration-300 ease-out shadow-lg shadow-fuchsia-500/30 ${
                      mode === "login" ? "left-1" : "left-[calc(50%)]"
                    }`}
                  />
                  {[
                    { id: "login", label: "Sign in" },
                    { id: "signup", label: "Create account" }
                  ].map((m) => (
                    <button
                      key={m.id}
                      onClick={() => {
                      setMode(m.id);

                      if (m.id === "login") navigate("/login");
                      else navigate("/register");
                    }}
                      className={`relative z-10 py-2.5 text-sm font-medium transition-colors cursor-pointer ${
                        mode === m.id ? "text-[#070711]" : "text-white/60 hover:text-white/90"
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>

                <div key={mode}>
                  {children}
    

                  <p className="text-center text-[11px] text-white/40 mt-7 leading-relaxed">
                    By continuing you agree to our{" "}
                    <a className="text-white/70 hover:text-white underline-offset-2 hover:underline">Terms</a> &{" "}
                    <a className="text-white/70 hover:text-white underline-offset-2 hover:underline">Privacy Policy</a>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthSidePanel;