"use client";
import UserChatListItem from "@/components/chatListComponents/UserChatListItem";
import { pusherClient } from "@/utilities/pusher";
import { useRouter } from "next/navigation";
import { createContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

export const AppContext = createContext();

export function Provider({ children }) {
  const [msgsToSend, setMsgsToSend ] = useState([]);
  const router = useRouter();

  // useEffect(() => {
    // const token = sessionStorage.getItem("authToken");
    // const userId = sessionStorage.getItem("userId");

    // if (token) {
    //   if (userId) {
    //     router.push(`/${userId}/conversations`);;
    //   } else {
    //     router.push("/");
    //   }
    // } else {
    //   router.push("/");
    // }
    // return () => {
    //   pusherClient.unsubscribe(userId);
    //   pusherClient.unbind_all()
    // };
  // }, []);

  return (
    <AppContext.Provider value={{msgsToSend, setMsgsToSend}}>
      {children}
    </AppContext.Provider>
  );
}
