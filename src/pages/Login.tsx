import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/auth";
import { Link } from "react-router-dom";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await loginUser(credentials.username, credentials.password);
      navigate("/home");
    } catch (err) {
      console.log(err);
      setError("Login failed. Check your credentials.");
    }
  };

  return (
    <div className="flex h-screen">
      {/* left */}
      <div className="flex flex-col justify-center items-center w-1/2 px-10 text-white bg-[#7CD4FD]">
        <h1 className="text-3xl font-bold mb-4">Deep Work</h1>
        <img
          src="/images/illustration.svg"
          alt="Illustration"
          className="w-64 h-64"
        />
        <p className="text-lg text-center mt-4">
          Start for free & get <br /> to focus today!
        </p>
      </div>

      {/* right */}
      <div className="flex flex-col justify-center w-1/2 px-12 bg-white ">
        <div className="text-left mb-6">
          <h2 className="text-2xl font-semibold">Get Started</h2>
          <p className="text-sm text-gray-500">
            Don't have an account yet?{" "}
            <Link to="/register" className="text-[#194185] hover:underline">
              Sign Up
            </Link>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username */}
        <div>
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-700"
          >
            User Name
          </label>
          
          <input
            type="username"
            placeholder="username"
            value={credentials.username}
            onChange={(e) =>
              setCredentials({ ...credentials, username: e.target.value })
            }
            className="w-full px-4 py-2 border rounded-md focus:ring-red-500 focus:border-red-500"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>

          {/* Password  */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
          type="password"
          placeholder="Password"
          value={credentials.password}
          onChange={(e) =>
            setCredentials({ ...credentials, password: e.target.value })
          }
          className="w-full px-4 py-2 border rounded-md focus:ring-red-500 focus:border-red-500"
        />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>

          {/* submit */}
            <button
              type="submit"
              className="w-full text-white py-2 rounded-md transition duration-200 bg-[#7CD4FD] hover:bg-[#194185]"
            >
              Log In
            </button>

        
        <div className="text-center text-gray-500 mb-4">Or</div>
        
            {/* Social Media */}
            <button
              className="flex items-center justify-center space-x-4 px-4 py-2 h-11 w-full bg-white border rounded-md shadow hover:bg-gray-100"
            >
              <img
                src="https://img.icons8.com/color/30/000000/google-logo.png"
                alt="google"
              />
              <span>Log In</span>
            </button>

        
        </form>

      </div>
    </div>
  );
};

export default Login;
