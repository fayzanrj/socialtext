"use client";
import React, { useRef, useState } from "react";
import Loader from "../Loader";
import axios from "axios";
import toast from "react-hot-toast";

// HEADERS FOR API REQUEST
const headers = {
  "Content-Type": "application/json",
  api_key: process.env.NEXT_PUBLIC_API_KEY,
};

const ChangePasswordModal = ({ setModal, userId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const oldPass = useRef();
  const newPass = useRef();
  const conNewPass = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // IF PASSWORD NOT MATCH
    if (newPass?.current.value !== conNewPass?.current.value) {
      setIsLoading(false);
      toast.error("New passwords doesnt match");
      return;
    }

    try {
      setIsLoading(true);
      const data = {
        userId: userId,
        oldPass: oldPass?.current.value,
        newPass: newPass?.current.value,
      };
      const response = await axios.put("/api/user/changePassword", data, {
        headers: headers,
      });
      toast.success(response.data.msg);
      setModal(false);
    } catch (error) {
      toast.error(error.response ? error.response.data.msg : error.message);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <form
      className="form w-11/12 relative h-[92.4svh] sm:h-96  md:w-[80%] lg:w-96 shadow-2xl "
      onSubmit={handleSubmit}
    >
      <span className="close" onClick={() => setModal(false)}>
        X
      </span>

      <div className="w-11/12 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <span className="title">Change password</span>
        <div>
          <input
            className="w-full py-2 px-4 border-2 border-stone-400 my-2 rounded-lg"
            ref={oldPass}
            required
            type={showPassword ? "text" : "password"}
            placeholder="Old password"
          />
          <input
            className="w-full py-2 px-4 border-2 border-stone-400 my-2 rounded-lg"
            ref={newPass}
            required
            type={showPassword ? "text" : "password"}
            placeholder="New password"
          />
          <input
            className="w-full py-2 px-4 border-2 border-stone-400 my-2 rounded-lg"
            ref={conNewPass}
            required
            type={showPassword ? "text" : "password"}
            placeholder="Confirm New password"
          />
        </div>

        <div className="w-full text-right">
          <button type="button" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? "Hide" : "Show"} password
          </button>
        </div>

        <button
          type="submit"
          className="w-full bg-black rounded h-10 mt-4  text-white relative"
          disabled={isLoading}
        >
          {isLoading ? <Loader /> : "CHANGE PASSWORD"}
        </button>
      </div>
    </form>
  );
};

export default ChangePasswordModal;
