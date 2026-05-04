import { useState } from "react";
import { Link } from "react-router-dom";

const CreateUserForm = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    name: "",
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
      setFormData({ name: "", email: "", password: "" });
    }
  };

  return (
    <div className="auth-card">
      <div className="auth-header text-left">
        <h2 className="auth-title">Create Account</h2>
        <p className="auth-subtitle">Join thousands of candidates using AI to ace their interviews</p>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="auth-input-group">
          <label htmlFor="name" className="auth-label">Full Name</label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="John Doe"
            value={formData.name}
            onChange={handleChange}
            required
            className="auth-input"
          />
        </div>

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
            autoComplete="new-password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            required
            minLength={6}
            className="auth-input"
          />
          <p className="mt-2 text-xs text-slate-500">Must be at least 6 characters</p>
        </div>

        <button type="submit" disabled={loading} className="auth-button">
          {loading ? "Creating account..." : "Get Started"}
        </button>

        <div className="auth-footer">
          Already have an account?{" "}
          <Link to="/login" className="auth-link">Sign in</Link>
        </div>
      </form>
    </div>
  );
};

export default CreateUserForm;
