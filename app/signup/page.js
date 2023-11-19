"use client";
import Image from "next/image";
import React, { useState } from "react";
import logo from "@/public/logo/logo.png";
import Loader from "@/components/Loader";
import VerificationModal from "@/components/VerificationModal";
import axios from "axios";
import toast from "react-hot-toast";
import Link from "next/link";
import isValidUsername from "@/utilities/checkUsername";

const requestHeaders = {
  "Content-Type": "application/json",
  api_key: process.env.NEXT_PUBLIC_API_KEY,
};

const page = () => {
  // STATES
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  // SUBMIT FUNCTION
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // CHECKING IF PASSWORD MATCHES
      if (password !== confirmPassword) {
        toast.error("Passwords does not match");
        return;
      }

      // CHECKING IF USERNAME IS VALID
      const usernameIsValid = isValidUsername(username);
      if (!usernameIsValid) {
        toast.error("Invalid Username");
        return;
      }
      const data = { username, password, email };

      //   AXIOS REQUEST
      const response = await axios.post("/api/auth/signup", data, {
        headers: requestHeaders,
      });

      toast.success(response.data.msg, { duration: 8000 });
      setIsModalOpen(true);
    } catch (error) {
      // CTACHING ERRORS
      if (error.response) {
        toast.error(error.response.data.msg);
      } else {
        toast.error(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="h-[100svh] relative">
      {isModalOpen && (
        <VerificationModal
          setModal={setIsModalOpen}
          variant={"REGISTER"}
          username={username}
        />
      )}
      <form
        onSubmit={handleSubmit}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%] sm:w-[28rem] p-5 sm:p-10 shadow-2xl rounded-sm"
      >
        {/* LOGO */}
        <div className="w-full relative h-10">
          <Image
            src={logo}
            width={70}
            height={70}
            alt="logo"
            className="absolute right-0"
          />
        </div>

        {/* EMAIL / USERNAME */}
        <label htmlFor="username" className="font-semibold">
          Userame
        </label>
        <input
          disabled={isLoading || isModalOpen}
          type="text"
          id="username"
          placeholder="Username e.g. johndoe or john_doe"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-2 border-2 border-gray-300 rounded-md mt-2 mb-3 outline-gray-400"
        />

        {/* EMAIL / USERNAME */}
        <label htmlFor="email" className="font-semibold">
          Email
        </label>
        <input
          disabled={isLoading || isModalOpen}
          type="email"
          id="email"
          placeholder="Email e.g. johndoe@mail.com"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border-2 border-gray-300 rounded-md mt-2 mb-3 outline-gray-400"
        />

        {/* PASSWORD */}
        <label htmlFor="password" className="font-semibold">
          Password
        </label>
        <input
          disabled={isLoading || isModalOpen}
          id="password"
          placeholder="Password"
          type={showPassword ? "text" : "password"}
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border-2 border-gray-300 rounded-md mt-2 mb-3 outline-gray-400"
        />

        {/* CONFIRM PASSWORD */}
        <label htmlFor="confirmPassword" className="font-semibold">
          Confirm pasword
        </label>
        <input
          disabled={isLoading || isModalOpen}
          id="confirmPassword"
          placeholder="Confirm your password"
          type={showPassword ? "text" : "password"}
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full p-2 border-2 border-gray-300 rounded-md mt-2  outline-gray-400"
        />

        <div className="text-sm mt-4 relative">
          <div>
            Already a user?{" "}
            <span className="text-blue-600 underline">
              <Link href={"/login"}>Log in</Link>
            </span>
          </div>
          <div className="absolute right-0 top-1/2  transform -translate-y-1/2">
            <button type="button" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? "Hide" : "Show"} password
            </button>
          </div>
        </div>

        {/* SUBMIT BTN */}
        <button
          disabled={isLoading || isModalOpen}
          type="submit"
          className="w-full h-10 bg-[#a18af1] rounded-md mt-5 text-white font-semibold relative"
        >
          {isLoading ? <Loader /> : "SIGN UP"}
        </button>
      </form>
    </main>
  );
};

export default page;
