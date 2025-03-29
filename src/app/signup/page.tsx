"use client";
import Link from "next/link";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

function SignupPage() {
  const router = useRouter();
  const [user, setUser] = React.useState({
    email: "",
    password: "",
    username: "",
  });
  const [buttonDisabled, setButtonDisabled] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const onSignup = async () => {
    try {
      setLoading(true);
      const response = await axios.post("/api/users/signup", user);
      console.log("Signup success", response.data);
      router.push("/login");
    } catch (error: any) {
      console.log("Signup failed");
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user.email.length > 0 && user.password.length > 0 && user.username.length > 0) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [user]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-800 to-gray-900 p-6">
      <div className="bg-gray-900 rounded-xl shadow-xl p-8 w-full max-w-md transform transition-all duration-500 hover:scale-105 hover:shadow-2xl">
        <h1 className="text-4xl font-extrabold text-center text-white mb-8">
          {loading ? "Processing..." : "Create Account"}
        </h1>
        <hr className="border-gray-700 mb-6" />
        <div className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-lg font-semibold text-white mb-1">Username</label>
            <input
              className="w-full p-3 border-2 border-gray-700 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
              id="username"
              type="text"
              value={user.username}
              onChange={(e) => setUser({ ...user, username: e.target.value })}
              placeholder="Enter your username"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-lg font-semibold text-white mb-1">Email</label>
            <input
              className="w-full p-3 border-2 border-gray-700 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
              id="email"
              type="email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-lg font-semibold text-white mb-1">Password</label>
            <input
              className="w-full p-3 border-2 border-gray-700 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
              id="password"
              type="password"
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              placeholder="Enter your password"
            />
          </div>
        </div>
        <button
          onClick={onSignup}
          disabled={buttonDisabled}
          className={`w-full py-3 mt-6 text-lg font-semibold text-white rounded-lg shadow-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 ${
            buttonDisabled ? "bg-gray-600 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500"
          }`}
        >
          {buttonDisabled ? "Complete all fields" : "Sign Up"}
        </button>
        <p className="text-center mt-4 text-gray-400">
          Already have an account?{" "}
          <Link href="/login" className="text-indigo-400 hover:text-indigo-600 transition-colors duration-300">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default SignupPage;
