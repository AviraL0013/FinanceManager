import React, { useState } from "react";
import { FaGoogle, FaGithub, FaGitlab, FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { UserDataContext } from "../context/UserContext";
import axios from 'axios';

const UserLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");  // State to hold error messages

  const navigate = useNavigate();
  const { user, setUser } = React.useContext(UserDataContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous error message

    try {
      const userData = { email, password };

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/users/login`,
        userData
      );

      if (response.status === 200) {
        const data = response.data;
        console.log("Login Successful:", data);
        setUser(data.user);
        localStorage.setItem("token", data.token);
        navigate("/home");

        // Clear input fields after successful login
        setEmail("");
        setPassword("");
      }
    } catch (err) {
      if (err.response) {
        // If server responded with an error
        setError(err.response.data.message || "Login failed. Please try again.");
      } else if (err.request) {
        // If request was made but no response received
        setError("No response from server. Check your network connection.");
      } else {
        // Other errors
        setError("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-black">
      <div className="relative w-full max-w-md p-8 rounded-xl shadow-lg text-white">
        {/* Background Layer for Transparency Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#383A3D] to-[#202224] opacity-70 rounded-xl backdrop-blur-md"></div>

        <div className="relative">
          <h2 className="text-center text-lg font-semibold mb-4">Login with :</h2>
          <div className="flex justify-center gap-4 mb-4">
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-700 rounded-md hover:bg-gray-600">
              <FaGoogle /> Google
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-700 rounded-md hover:bg-gray-600">
              <FaGithub /> Github
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-700 rounded-md hover:bg-gray-600">
              <FaGitlab /> Gitlab
            </button>
          </div>

          <div className="text-center my-4">or</div>

          {/* Display Error Message */}
          {error && (
            <div className="mb-4 text-center text-red-500 bg-red-100 px-4 py-2 rounded-md">
              {error}
            </div>
          )}

          {/* Email & Password Form */}
          <form className="space-y-4" onSubmit={handleLogin}>
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
              <input
                type="email"
                placeholder="Email"
                className="w-full pl-10 p-2 bg-gray-700 rounded-md focus:outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="relative">
              <FaLock className="absolute left-3 top-3 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full pl-10 p-2 bg-gray-700 rounded-md focus:outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span
                className="absolute right-3 top-3 cursor-pointer text-gray-400"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <button type="submit" className="w-full bg-yellow-400 text-black py-2 rounded-md font-semibold hover:bg-yellow-300">
              Login
            </button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-4">
            By creating an account, you agree to the <Link className="text-yellow-400 underline">Terms of Service</Link>.
          </p>

          <p className="text-center text-sm text-gray-400 mt-2">
            Don't have an account? <Link to={'/register'} className="text-yellow-400 underline">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;
