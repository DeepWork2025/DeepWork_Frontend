import React, { useState } from "react";
import { Link } from "react-router-dom";

interface RegisterFormProps {
  onRegister: (user: {
    username: string;
    email: string;
    password: string;
  }) => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onRegister }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onRegister({ username, email, password });

    validateField(username, "username", "Username cannot be blank");
    validateField(email, "email", "Email cannot be blank");
    validateField(password, "password", "Password cannot be blank");
  };

  const validateField = (value: string, field: string, message: string) => {
    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]: value.trim() === "" ? message : "",
    }));
  };

  const handleInputChange =
    (setter: React.Dispatch<React.SetStateAction<string>>, field: string) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setter(e.target.value);
      validateField(e.target.value, field, `${field} cannot be blank`);
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
            Already have an account?{" "}
            <Link to="/login" className="text-[#194185] hover:underline">
              Sign In
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
              type="text"
              name="username"
              id="username"
              placeholder="Abc"
              value={username}
              onChange={handleInputChange(setUsername, "username")}
              className="w-full px-4 py-2 border rounded-md focus:ring-red-500 focus:border-red-500"
            />
            {errors.username && (
              <p className="text-red-500 text-sm">{errors.username}</p>
            )}
          </div>

          {/* Email*/}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="abc@gmail.com"
              value={email}
              onChange={handleInputChange(setEmail, "email")}
              className="w-full px-4 py-2 border rounded-md focus:ring-red-500 focus:border-red-500"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
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
              onChange={handleInputChange(setPassword, "password")}
              className="w-full px-4 py-2 border rounded-md focus:ring-red-500 focus:border-red-500"
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password}</p>
            )}
          </div>

          {/* submit */}
            <button
              type="submit"
              className="w-full text-white py-2 rounded-md transition duration-200 bg-[#7CD4FD] hover:bg-[#194185]"
            >
              Submit
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
              <span>Sign Up</span>
            </button>

        
        </form>

      </div>
    

    </div>
  );


};



export default RegisterForm;
