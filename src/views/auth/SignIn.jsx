import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import Checkbox from "components/checkbox";
import { login } from "services/authService"; // Import du service login
import { useNavigate } from "react-router-dom"; // Import de useNavigate
export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Initialisation de useNavigate

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError(null);

    // Validation des champs
    if (!email || !password) {
      setError("Please provide both email and password");
      return;
    }

    try {
      const data = await login({ email, password }); // Appel au service login

      // Stocker le token et l'heure dans localStorage
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("loginTime", new Date().getTime().toString());

      navigate("/admin"); // Redirection après connexion réussie
    } catch (err) {
      setError(err.message || "Login failed");
    }
  };

  return (
    <div className="mt-16 mb-16 flex h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10 lg:items-center lg:justify-start">
      <div className="mt-[10vh] w-full max-w-full flex-col items-center md:pl-4 lg:pl-0 xl:max-w-[420px]">
        <h4 className="mb-2.5 text-4xl font-bold text-[#502a56] dark:text-white">
          Sign In
        </h4>
        <p className="mb-9 ml-1 text-base text-gray-600">
          Enter your email and password to sign in!
        </p>
        <form onSubmit={handleSignIn}>
          <div className="mb-3">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-white"
            >
              Email*
            </label>
            <input
              id="email"
              type="email"
              placeholder=""
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#111] focus:border-[#111] sm:text-sm"
            />
          </div>

          <div className="mb-3">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-white"
            >
              Password*
            </label>
            <input
              id="password"
              type="password"
              placeholder="Min. 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#111] focus:border-[#111] sm:text-sm"
            />
          </div>

          <button
            type="submit"
            className="linear mt-2 w-full rounded-xl bg-[#502a56] py-[12px] text-base font-medium text-white transition duration-200 hover:bg-[#502a56] active:bg-[#111] dark:bg-[#ddd] dark:text-[#111] dark:active:bg-[#111]"
          >
            Sign In
          </button>
        </form>

        {/* Affichage des erreurs */}
        {error && (
          <p className="mt-2 text-sm text-red-500">{error}</p>
        )}
      </div>
    </div>
  );
}
