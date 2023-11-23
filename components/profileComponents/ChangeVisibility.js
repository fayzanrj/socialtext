"use client";
import React, { useState } from "react";
import Loader from "../Loader";
import toast from "react-hot-toast";
import axios from "axios";

const ChangeVisibility = ({ isUserPrivate, userId }) => {
  const [isPrivate, setIsPrivate] = useState(isUserPrivate);
  const [isLoading, setIsLoading] = useState(false);

  const handleChangeVisibility = async () => {
    // HEADERS FOR API REQUEST
    const headers = {
      "Content-Type": "application/json",
      api_key: process.env.NEXT_PUBLIC_API_KEY,
    };
    try {
      setIsLoading(true);
      const response = await axios.put(
        `/api/user/changeAccountVisibility/${userId}`,
        null,
        { headers }
      );
      toast.success(response.data.msg);
      setIsPrivate(!isPrivate);
    } catch (error) {
      toast.error(error.response ? error.response.data.msg : error.message);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="w- text-center m-auto  z-10">
      <button
        className="bg-black w-[90%] text-white my-2 p-2  h-10 rounded-lg relative sm:w-full sm:px-0 md:p-2 md:w-60"
        onClick={handleChangeVisibility}
      >
        {isLoading ? (
          <Loader />
        ) : (
          <p>Make your account {isPrivate ? "Public" : "Private"} </p>
        )}
      </button>
      <p className="text-sm">
        *By making your account
        {isPrivate
          ? " PUBLIC everyone will be able to see your profile and initiate a conversation with you"
          : " PRIVATE no one will be able to see your profile and initiate a conversation with you"}
      </p>
    </div>
  );
};

export default ChangeVisibility;
