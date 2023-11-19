// "use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import React from "react";
import toast from "react-hot-toast";
const requestHeaders = {
  "Content-Type": "application/json",
  api_key: process.env.NEXT_PUBLIC_API_KEY,
};

const RequestedListBtns = ({ userId, itemId, setIsLoading, isLoading, setList, blockUser}) => {
  const router = useRouter();

   // DELETE REQUEST
   const deleteRequest = async () => {
    setIsLoading(true);
    try {
      const res = await axios.delete(
        `/api/users/deleteRequest?sentBy=${userId}&sentTo=${itemId}`,
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
  return (
    <div className="">
          <button
            onClick={deleteRequest}
            disabled={isLoading}
            className="bg-[#a18af1] text-white p-1 mb-1 w-32 rounded-md"
          >
            Cancel Request
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

export default RequestedListBtns;
