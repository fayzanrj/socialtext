"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Loader from "../Loader";
import toast from "react-hot-toast";
import { acceptRequest, deleteRequest, sendRequest } from "@/utilities/reqFuncs";


const SendRequest = ({
  userId,
  searchedUserId,
  requested,
  userHasRequested,
}) => {
  const [requestSent, setRequestSent] = useState(requested);
  const [isRequested, setIsRequested] = useState(userHasRequested);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const handleClick = async () => {
    if (isRequested) {
      acceptRequest(userId, searchedUserId, setIsLoading);
    } else if (requestSent) {
      deleteRequest(userId, searchedUserId, setIsLoading, setRequestSent);
    } else {
      sendRequest(userId, searchedUserId, setIsLoading, setRequestSent);
    }
  };

  return (
    <button
      onClick={handleClick}
      className="w-full bg-[#a18aff] h-8 text-white py-1 my-1 rounded-md text-center relative"
    >
      {isLoading ? (
        <Loader />
      ) : isRequested ? (
        "Accept Request"
      ) : requestSent ? (
        "Cancel Request"
      ) : (
        "Send Request"
      )}
    </button>
  );
};

export default SendRequest;
