import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { loginUser } from "../api/authApi";
import AuthSidePanel from "../components/AuthSidePanel";
import SignInForm from "../components/SignInForm";
import "../components/AuthStyles.css";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignIn = async (data) => {
    setLoading(true);

    try {
      if (!data.email.trim() || !data.password) {
        toast.error("Please enter email and password");
        return false;
      }

      const res = await loginUser(data);

      if (res?.token) {
        localStorage.setItem("token", res.token);
      } else {
        toast.error("Login succeeded but token was missing");
        return false;
      }

      toast.success(res?.message || "Welcome back!");
      navigate("/");
      return true;
    } catch (err) {
      toast.error(err?.message || err?.detail || "Login failed");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-wrapper">
        <AuthSidePanel />
        <div className="auth-form-container">
          <SignInForm 
          onSubmit={handleSignIn} loading={loading} 
          />
        </div>
      </div>
    </div>
  );
};

export default Login;