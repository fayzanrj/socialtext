"use client";
import Image from "next/image";
import React, { useState } from "react";
import logo from "@/public/logo/logo.png";
import Loader from "@/components/Loader";
import VerificationModal from "@/components/VerificationModal";
import axios from "axios";
import toast from "react-hot-toast";
import Link from "next/link";
import { useRouter } from "next/navigation";


const requestHeaders = {
  "Content-Type": "application/json",
  api_key: process.env.NEXT_PUBLIC_API_KEY,
};

const Page = () => {
  // STATES
  const [userDetail, setUserDetail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [verifyUsername, setVerifyUsername] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  // VERIFY USER FUNCTION
  const verifyUser = async (email, username, id) => {
    setIsModalOpen(true);
    const data = {
      email: email,
      username: username,
      id: id,
    };

    try {
      await axios.put("/api/auth/sendCode", data, {
        headers: requestHeaders,
      });
    } catch (error) {
      // CATCHING ERRORS
      if (error.response) {
        toast.error(error.response.data.msg);
      } else {
        toast.error(error.message);
      }
    }
  };

  // SUBMIT FUNCTION
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const data = { userDetail, password };

      // AXIOS REQUEST
      const response = await axios.post("/api/auth/login", data, {
        headers: requestHeaders,
      });

      if (!response.data.user.isVerified) {
        toast(
          "An email with verification code has been sent to your email. If you cant find it please check your spam.",
          {
            duration: 10000,
          }
        );

        const { username, email, _id } = response.data.user;
        setVerifyUsername(username);
        verifyUser(email, username, _id);
      } else {
        toast.success("Logged in successfully");
        await sessionStorage.setItem("userId", response.data.user._id);
        router.push(`/t/conversations`);
      }
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
          variant={"LOGIN"}
          username={verifyUsername}
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
        <label htmlFor="userDetails" className="font-semibold">
          Userame or Email
        </label>
        <input
          disabled={isLoading || isModalOpen}
          type="text"
          id="userDetails"
          placeholder="Username or Email"
          required
          value={userDetail}
          onChange={(e) => setUserDetail(e.target.value)}
          className="w-full p-2 border-2 border-gray-300 rounded-md mt-2 mb-6 outline-gray-400"
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
          className="w-full p-2 border-2 border-gray-300 rounded-md mt-2  outline-gray-400"
        />

        <div className="text-sm mt-4 relative">
          <div>
            Not a user yet?{" "}
            <span className="text-blue-600 underline">
              <Link href={"/signup"}>Sign up</Link>
            </span>
          </div>
          <div className="absolute right-0 top-1/2  transform -translate-y-1/2">
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
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
          {isLoading ? <Loader /> : "LOG IN"}
        </button>
      </form>
    </main>
  );
};

export default Page;
