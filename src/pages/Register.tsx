import React from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api/auth";
import RegisterForm from "../components/registerForm/RegisterForm";

const Register: React.FC = () => {
  const navigate = useNavigate();

  const handleRegister = async (user: {
    username: string;
    email: string;
    password: string;
  }) => {
    try {
      await registerUser(user);
      navigate("/login");
    } catch (err) {
      console.error("Registration failed", err);
    }
  };

  return <RegisterForm onRegister={handleRegister} />;
};

export default Register;
