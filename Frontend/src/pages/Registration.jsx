import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { registerUser } from "../api/authApi";
import AuthSidePanel from "../components/AuthSidePanel";
import CreateUserForm from "../components/CreateUserForm";
import "../components/AuthStyles.css";

const Registration = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCreateUser = async (data) => {
    setLoading(true);

    try {
      if (!data.name.trim() || !data.email.trim() || !data.password) {
        toast.error("Please fill all fields");
        return false;
      }

      if (data.password.length < 6) {
        toast.error("Password must be at least 6 characters");
        return false;
      }

      const res = await registerUser(data);
      toast.success(res?.message || "Account created successfully!");
      navigate("/login");
      return true;
    } catch (err) {
      toast.error(err?.message || err?.detail || "Registration failed");
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
          <CreateUserForm 
          onSubmit={handleCreateUser} loading={loading} 
          />
        </div>
      </div>
    </div>
  );
};

export default Registration;