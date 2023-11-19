"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import React from "react";
import toast from "react-hot-toast";

const requestHeaders = {
  "Content-Type": "application/json",
  api_key: process.env.NEXT_PUBLIC_API_KEY,
};

const RequestsListBtns = ({
  userId,
  itemId,
  setIsLoading,
  isLoading,
  setList,
  blockUser
}) => {
  // ACCEPT REQUEST FUNCTION
  const acceptRequest = async () => {
    setIsLoading(true);
    try {
      const res = await axios.put(
        "/api/users/acceptRequest",
        {
          acceptedBy: userId,
          sentBy: itemId,
        },
        { headers: requestHeaders }
      );

      toast.success(res.data.msg);

      setList((prevList) => prevList.filter((item) => item._id !== itemId));
    } catch (error) {
      toast.error(error.response ? error.response.data.msg : error.message);
    } finally {
      setIsLoading(false);
    }
  };


   // DELETE REQUEST
   const deleteRequest = async () => {
    setIsLoading(true);
    try {
      const res = await axios.delete(
        `/api/users/deleteRequest?sentBy=${itemId}&sentTo=${userId}`,
        { headers: requestHeaders }
      );

      toast.success(res.data.msg);

      setList((prevList) => prevList.filter((item) => item._id !== itemId));
    } catch (error) {
      toast.error(error.response ? error.response.data.msg : error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const router = useRouter();
  return (
    <div className="">
      <button
        onClick={acceptRequest}
        disabled={isLoading}
        className="bg-[#a18af1] text-white p-1 mb-1 w-32 rounded-md"
      >
        Accept
      </button>
      <br />
      <button
        onClick={deleteRequest}
        disabled={isLoading}
        className="bg-red-600 text-white p-1 mb-1 w-32 rounded-md"
      >
        Delete
      </button>
      <br />
      <button
        onClick={blockUser}
        disabled={isLoading}
        className="bg-red-600 text-white p-1 w-32 rounded-md"
      >
        Block
      </button>
    </div>
  );
};

export default RequestsListBtns;
