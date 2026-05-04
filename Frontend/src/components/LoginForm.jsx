import { useState } from "react";
import { loginUser } from "../api/authApi";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import AuthCard from "./AuthCard";
import toast from "react-hot-toast";

export default function LoginForm() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e?.preventDefault?.();
    if (loading) return;

    if (!form.email.trim() || !form.password) {
      toast.error("Please enter email and password");
      return;
    }

    setLoading(true);
    try {
      const res = await loginUser(form);

      if (res?.token) {
        localStorage.setItem("token", res.token);
      } else {
        toast.error("Login succeeded but token was missing");
        return;
      }

      toast.success(res?.message);
      navigate("/");
    } catch (err) {
      toast.error(err?.message || err?.detail || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard 
      title="Welcome Back" 
      subtitle="Sign in to continue your AI-powered interview prep"
    >
      <form onSubmit={handleLogin} noValidate>
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
            autoComplete="current-password"
            placeholder="••••••••"
            value={form.password}
            onChange={handleChange}
            className="auth-input"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="auth-button"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>

        <div className="auth-footer">
          Don't have an account?{" "}
          <Link to="/register" className="auth-link">
            Create an account
          </Link>
        </div>
      </form>
    </AuthCard>
  );
}