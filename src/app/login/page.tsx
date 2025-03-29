"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

function LoginPage() {
  const router = useRouter();
  const [user, setUser] = useState({ email: "", password: "" });
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); 

  const onLogin = async () => {
    try {
      setLoading(true);
      setErrorMessage("");
  
      const response = await axios.post("/api/users/login", user);
      console.log("Login data", response.data);
      toast.success("Login success");
      router.push("/profile");
    } catch (error: any) {
      console.log("Login failed", error);
  
     
      let errorMsg = "Something went wrong. Please try again.";
      if (error.response) {
        errorMsg = error.response.data?.message || error.response.data?.error || errorMsg;
      } else if (error.message) {
        errorMsg = error.message;
      }
  
      setErrorMessage(errorMsg); 
      toast.error(errorMsg); 
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    setButtonDisabled(!(user.email && user.password));
  }, [user]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-800">
      <div className="bg-gray-900 rounded-xl shadow-xl p-8 w-full max-w-md transform transition-all duration-500 hover:scale-105 hover:shadow-2xl">
        <h1 className="text-4xl font-extrabold text-center text-white mb-8">
          {loading ? "Processing..." : "Login"}
        </h1>
        <p className="text-sm text-gray-400 mb-4">Welcome back! Please login to continue.</p>

        {errorMessage && (
          <p className="text-red-500 text-center mb-4 font-semibold">{errorMessage}</p>
        )}

        <div className="w-full">
          <label htmlFor="email" className="text-sm font-semibold text-gray-400">
            Email
          </label>
          <input
            className="w-full p-3 border-2 border-gray-700 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
            id="email"
            type="text"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            placeholder="Enter your email"
          />
        </div>

        <div className="w-full mt-4">
          <label htmlFor="password" className="text-sm font-semibold text-gray-400">
            Password
          </label>
          <input
            className="w-full p-3 border-2 border-gray-700 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
            id="password"
            type="password"
            value={user.password}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
            placeholder="Enter your password"
          />
        </div>

        <button
          onClick={onLogin}
          disabled={buttonDisabled}
          className={`w-full py-3 mt-6 text-lg font-semibold text-white rounded-lg shadow-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 ${
            buttonDisabled ? "bg-gray-600 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500"
          }`}
        >
          {buttonDisabled ? "Complete all fields" : "Login Here"}
        </button>

        <p className="text-center mt-4 text-gray-400">
          Don't have an account?{" "}
          <Link href="/signup" className="text-indigo-400 hover:text-indigo-600 transition-colors duration-300">
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
