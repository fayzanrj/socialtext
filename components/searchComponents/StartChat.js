"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Loader from "../Loader";

const StartChat = ({ userId, searchedUserId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const handleClick = async () => { 
    setIsLoading(true);
    try {
      const users = [userId, searchedUserId];
      const res = await axios.post("/api/chat/createChat", { users });
      if (res.data.status === "success") {
        router.push(`/${userId}/conversations/${res.data.chat._id}`);
      }
    } catch (error) {}
    setIsLoading(false);
  };

  return (
    <button
      onClick={handleClick}
      className="w-full bg-[#a18aff] h-8 text-white py-1 my-1 rounded-md text-center relative"
    >
      {isLoading ? <Loader /> : "START A CHAT"}
    </button>
  );
};

export default StartChat;
