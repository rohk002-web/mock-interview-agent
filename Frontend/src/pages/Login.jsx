import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { loginUser } from "../api/authapi";
import AuthSidePanel from "../components/AuthSidePanel";
import SignInForm from "../components/SignInForm";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("login");
  const navigate = useNavigate();

  useEffect(() => {
    if (mode === "signup") {
      navigate("/register");
    }
  }, [mode, navigate]);

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
      navigate("/home");
      return true;
    } catch (err) {
      toast.error(err?.message || err?.detail || "Login failed");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthSidePanel mode={mode} setMode={setMode}>
      <SignInForm onSubmit={handleSignIn} loading={loading} />
    </AuthSidePanel>
  );
};

export default Login;