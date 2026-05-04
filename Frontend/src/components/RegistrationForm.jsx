import { useState } from "react";
import { registerUser } from "../api/authApi";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import AuthCard from "./AuthCard";
import toast from "react-hot-toast";

export default function RegistrationForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegister = async (e) => {
    e?.preventDefault?.();
    if (loading) return;

    if (!form.name.trim() || !form.email.trim() || !form.password) {
      toast.error("Please fill all fields");
      return;
    }

    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      const res = await registerUser(form);
      toast.success(res?.message);
      navigate("/login");
    } catch (err) {
      toast.error(err?.message || err?.detail || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard 
      title="Create Account" 
      subtitle="Join thousands of candidates using AI to ace their interviews"
    >
      <form onSubmit={handleRegister} noValidate>
        <div className="auth-input-group">
          <label htmlFor="name" className="auth-label">
            Full Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="John Doe"
            value={form.name}
            onChange={handleChange}
            className="auth-input"
          />
        </div>

        <div className="auth-input-group">
          <label htmlFor="email" className="auth-label">
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="name@company.com"
            value={form.email}
            onChange={handleChange}
            className="auth-input"
          />
        </div>

        <div className="auth-input-group">
          <label htmlFor="password" className="auth-label">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            placeholder="••••••••"
            value={form.password}
            onChange={handleChange}
            className="auth-input"
          />
          <p className="mt-2 text-xs text-slate-500">
            Must be at least 6 characters
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="auth-button"
        >
          {loading ? "Creating account..." : "Get Started"}
        </button>

        <div className="auth-footer">
          Already have an account?{" "}
          <Link to="/login" className="auth-link">
            Sign in
          </Link>
        </div>
      </form>
    </AuthCard>
  );
}
