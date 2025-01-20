import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Banner from "./pages/Banner";
import ProfilePage from "./pages/Profile";

const App: React.FC = () => {
  const [users, setUsers] = useState<
    { email: string; password: string; username: string }[]
  >([]);

  const handleRegister = (newUser: {
    username: string;
    email: string;
    password: string;
  }) => {
    if (users.find((user) => user.email === newUser.email)) {
      alert("Email already registered!");
      return;
    }
    setUsers([...users, newUser]);
    alert("Registration successful!");
  };

  const handleLogin = (email: string, password: string): boolean => {
    return users.some(
      (user) => user.email === email && user.password === password
    );
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Banner />} />
        <Route
          path="/register"
          element={<Register onRegister={handleRegister} />}
        />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </Router>
  );
};

export default App;
