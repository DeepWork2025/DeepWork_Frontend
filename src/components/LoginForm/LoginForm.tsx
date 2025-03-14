import React, { useState } from "react";
import { Link } from "react-router-dom";

interface LoginFormProps {
  onLogin: (username: string, password: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({
    username: "",
    password: "",
  });

  const validateFields = () => {
    const newErrors = {
      username: username.trim() === "" ? "Username cannot be blank" : "",
      password: password.trim() === "" ? "Password cannot be blank" : "",
      general: "",
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateFields()) return;

    try {
      await onLogin(username, password);
    } catch (err) {
      setErrors((prev) => ({
        ...prev,
        general: err instanceof Error ? err.message : "Login failed",
      }));
    }
  };

  const handleInputChange = (setter: (value: string) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setter(e.target.value);
  };

  return (
    <div className="flex h-screen">
      {/* left */}
      <div className="flex flex-col justify-center items-center w-1/2 bg-red-400 text-white px-10">
        <h1 className="text-3xl font-bold mb-4">Deep Work</h1>
        <img
          src="/images/illustration.svg"
          alt="Illustration"
          className="w-64 h-64"
        />
        <p className=" text-lg text-center mt-4">
          Welcome back! <br />
          Please log in to continue.
        </p>
      </div>

      {/* right  */}
      <div className="flex flex-col justify-center w-1/2 px-12 bg-white ">
        <div className="text-left mb-6">
          <h2 className="text-2xl font-semibold">Sign In</h2>
          <p className="text-sm text-gray-500">
            Don't have an account?{" "}
            <Link to="/register" className="text-red-500 hover:underline">
              Sign Up
            </Link>
          </p>
        </div>

        {/* social media */}
        <div className="flex space-x-4 mb-4">
          <button className="flex items-center space-x-2 px-4 py-2 bg-white border rounded-md shadow hover:bg-gray-100">
            <img
              src="https://img.icons8.com/color/30/000000/google-logo.png"
              alt="google"
            />
            <span>Sign In</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white border rounded-md shadow hover:bg-blue-700">
            <img
              src="https://img.icons8.com/ios-filled/30/ffffff/facebook-new.png"
              alt="facebook"
            />
            <span>Sign In</span>
          </button>
        </div>

        <div className="text-center text-gray-500 mb-4">Or</div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* username  */}
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              username
            </label>
            <input
              type="username"
              name="username"
              id="username"
              placeholder="abc@gmail.com"
              value={username}
              onChange={handleInputChange(setUsername)}
              className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.username && (
              <p className="text-red-500 text-sm">{errors.username}</p>
            )}
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
              name="password"
              id="password"
              placeholder="Password"
              value={password}
              onChange={handleInputChange(setPassword)}
              className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password}</p>
            )}
          </div>

          {/* submit */}
          <button
            type="submit"
            className="w-full bg-red-400 text-white py-2 rounded-md hover:bg-red-600 transition duration-200"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
