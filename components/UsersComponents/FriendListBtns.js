'use client'
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React from 'react'
import toast from 'react-hot-toast';
const requestHeaders = {
  "Content-Type": "application/json",
  api_key: process.env.NEXT_PUBLIC_API_KEY,
};

const FriendListBtns = ({userId, itemId, setIsLoading, isLoading, blockUser}) => {
    const router = useRouter();
    const createChat = async () => {
        setIsLoading(true);
        try {
          const users = [userId, itemId];
          const res = await axios.post(
            "/api/chat/createChat",
            { users },
            {
              headers: requestHeaders,
            }
          );
          router.push(`/${userId}/conversations/${res.data.chat._id}`);
        } catch (error) {
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
    <div className="">
    <button
      onClick={createChat}
      disabled={isLoading}
      className="bg-[#a18af1] text-white p-1 mb-1 w-32 rounded-md"
    >
      Send Message
    </button>
    <br />
    <button
      disabled={isLoading}
      className="bg-red-600 text-white p-1 mb-1 w-32 rounded-md"
    >
      Remove
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
  )
}

export default FriendListBtns