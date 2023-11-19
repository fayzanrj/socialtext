import axios from "axios";
import Loader from "../Loader";
import { useRouter } from "next/navigation";
import { useState } from "react";

const SingleEditModal = ({ chatId, userId }) => {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter()
  
    const handleDeleteChat = async () => {
      setIsLoading(true);
      const response = await axios.delete(
        `/api/chat/deleteChat?chatId=${chatId}&userId=${userId}`
      );
      if(response.data.status === "success"){
        router.push(`/${userId}/conversations`)
      }
      setIsLoading(false);
    };
  
    return (
      <div className="w-48 h-28 p-4 absolute right-1/2 sm:right-[65%] top-4 sm:top-1/2 bg-white  text-white shadow-2xl drop-shadow-xl rounded-lg border-2 border-stone-100 z-20">
        <button
          className="text-sm  w-full h-1/2 bg-red-700 rounded-md relative"
          onClick={handleDeleteChat}
          disabled={isLoading}
        >
          {isLoading ? <Loader /> : `Delete this chat`}
        </button>
  
        <button className="text-sm w-full h-1/2 bg-red-700 my-1 rounded-md">
          Block this user
        </button>
      </div>
    );
  };

  export default SingleEditModal