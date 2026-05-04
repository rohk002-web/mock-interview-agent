import { useState } from "react";
import { Link } from "react-router-dom";

const SignInForm = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ok = await onSubmit(formData);
    if (ok) {
      setFormData({ email: "", password: "" });
    }
  };

  return (
    <div className="auth-card">
      <div className="auth-header text-left">
        <h2 className="auth-title">Welcome Back</h2>
        <p className="auth-subtitle">Sign in to continue your AI-powered interview</p>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="auth-input-group">
          <label htmlFor="email" className="auth-label">Email Address</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="name@company.com"
            value={formData.email}
            onChange={handleChange}
            required
            className="auth-input"
          />
        </div>

        <div className="auth-input-group">
          <label htmlFor="password" className="auth-label">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            required
            className="auth-input"
          />
        </div>

        <button type="submit" disabled={loading} className="auth-button">
          {loading ? "Signing in..." : "Sign in"}
        </button>

        <div className="auth-footer">
          Don't have an account?{" "}
          <Link to="/register" className="auth-link">Create an account</Link>
        </div>
      </form>
    </div>
  );
};

export default SignInForm;
