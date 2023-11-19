"use client";
import getChatIcon from "@/utilities/getChatIcon";
import getChatName from "@/utilities/getChatName";
import { pusherClient } from "@/utilities/pusher";
import axios from "axios";
import { memo, useEffect, useState } from "react";
import toast from "react-hot-toast";
import UserChatListItem from "./UserChatListItem";
import UserChatListSkeleton from "./UserChatListSkeleton";
import { MdGroupAdd, MdOutlineAddCircle } from "react-icons/md";
import Link from "next/link";
import { BsFillArrowLeftSquareFill } from "react-icons/bs";
import { useRouter } from "next/navigation";
import { getTime } from "@/utilities/getTime";

const headers = {
  "Content-Type": "application/json",
  api_key: process.env.NEXT_PUBLIC_API_KEY,
};


const UserChatsList = ({ userId, allChats }) => {
  // STATE TO STORE ALL THE CHATS
  const [chats, setChats] = useState([]) ;
  const [isLoading, setIsLoading] = useState(true);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const router = useRouter();

  // FUNCTION TO FETCH CHATS
  const fetchAllChats = async (userId, setChats) => {
    try {
      const response = await axios.get(`/api/chat/getAllChats/${userId}`, {
        headers : headers
      });
      console.log(response.data);
        setChats(await response.data.chats);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  // PUSHER HANDLE NOTIFICATION FUNCTION
  const handleNotification = (text) => {
    toast(
      <NotificationBox
        name={text.sender.username}
        img={text.sender.icon}
        msg={text.content}
        chatId={text.chatId}
        userId={userId}
      />,
      {
        position: "top-right",
        style: {
          height: "10svh",
          maxHeight: "10svh",
          overflow: "hidden",
          minWidth: window.innerWidth > 640 ? "40%" : "100%",
          border: 1,
          borderColor: "#e3e4e6",
        },
      }
    );
  };

  // FUNCTION TO UPDATE CHATLIST WHEN PUSHER PUSHES A NEW LATEST MESSAGE
  const handleUpdateChat = (msg) => {
    setChats((prevChat) => {
      // console.log(msg)
      const updatedList = [...prevChat]; // Create a copy of the array
      const index = updatedList.findIndex((item) => item._id === msg.chatId);

      if (index !== -1) {
        let newChatItem = updatedList.splice(index, 1);
        newChatItem[0].updatedAt = msg.createdAt;
        newChatItem[0].latestMessage = msg;
        updatedList.unshift(newChatItem[0]);
      }

      return updatedList; // No need to create a new array
    });
  };

  // FUNCTION TO UPDATE CHAT LIST WHEN PUSHER PUSHES A DELETE CHAT
  const handleDeleteChat = (chatId) => {
    router.push(`/${userId}/conversations`);
    setChats((prevChat) => {
      const updatedList = [...prevChat]; // Create a copy of the array
      const index = updatedList.findIndex((item) => item._id === chatId);
      if (index !== -1) {
        updatedList.splice(index, 1);
      }

      return updatedList; // No need to create a new array
    });
  };

  // FUNCTION TO UPDATE READBY
  const handleReadyBy = (msg) => {
    console.log(msg);
    setChats((prevChat) => {
      const updatedList = [...prevChat];
      const index = updatedList.findIndex((item) => item._id === msg.chatId);

      if (index !== -1) {
        updatedList[index].latestMessage.readBy = msg.readBy;
      }

      return updatedList;
    });
  };

  // FUNCTION TO ADD NEW CHAT
  const handleAddNewChat = (chat) => {
    setChats((prevChat) => {
      const updatedList = [...prevChat];

      updatedList.unshift(chat);
      return updatedList;
    });
  };

  const handleUpdateChatName = (chat) => {
    setChats((prevChat) => {
      const updatedList = [...prevChat]; // Create a copy of the array
      const index = updatedList.findIndex((item) => item._id === chat.chatId);

      if (index !== -1) {
        let newChatItem = updatedList.splice(index, 1);
        newChatItem[0].updatedAt = chat.msg.createdAt
        newChatItem[0].latestMessage = chat.msg
        newChatItem[0].chatName = chat.newName;
        updatedList.unshift(newChatItem[0]);
      }

      return updatedList; // No need to create a new array
    });
  };
  // USEFFECT TO RUN fetchAllChats WHEN COMPONENT IS MOUNTED
  useEffect(() => {
    fetchAllChats(userId, setChats);
  }, []);

  // USE EFFECT TO HANDLE PUSHER
  useEffect(() => {
    // SUBSCRIBING TO THE PUSHER WITH THE LOGGED IN USER'S USERID
    pusherClient.subscribe(userId);

    // BINDING WITH PUSHER
    pusherClient.bind("message-notification", handleNotification);
    pusherClient.bind("update-chatList", handleUpdateChat);
    pusherClient.bind("delete-chat", handleDeleteChat);
    pusherClient.bind("update-readBy", handleReadyBy);
    pusherClient.bind("add-newChat", handleAddNewChat);
    pusherClient.bind("update-chatName", handleUpdateChatName);
    return () => {
      // REMOVING PUSHER WHEN COMPONENT IS UNMOUNTED
      pusherClient.unbind("message-notification", handleNotification);
      pusherClient.unbind("update-chatList", handleUpdateChat);
      pusherClient.unbind("delete-chat", handleDeleteChat);
      pusherClient.unbind("update-readBy", handleReadyBy);
      pusherClient.unbind("add-newChat", handleAddNewChat);
      pusherClient.unbind("update-chatName", handleUpdateChatName);
      pusherClient.unsubscribe(userId);
    };
  }, []);

  return (
    <div className="w-full sm:w-[16.5rem] border-2 border-t-0 md-ml-20 -z-50">
      <div className="p-2.5 w-full relative flex justify-between items-center h-[7%] select-none">
        <h3 className="font-semibold font-serif text-xl">Messages</h3>
        <div>
          <Link href={`/${userId}/users/creategroup`}>
            <button>
              <MdGroupAdd
                size={"1.2rem"}
                onClick={() => setIsGroupModalOpen(!isGroupModalOpen)}
              />
            </button>
          </Link>
          <Link href={`/${userId}/users`}>
            <button className="text-2xl ml-2">+</button>
          </Link>
        </div>
      </div>
      <hr className="w-[90%] m-auto " />
      <div className="SCROLL_BAR w-full h-[93%]  overflow-x-hidden">
        {isLoading ? (
          // IF CHATS ARE LOADING
          <UserChatListSkeleton />
        ) : (chats && chats.length > 0 )? (
          // IF THERE ARE CHATS
          chats.map((chat, index) => {
            return (
              <UserChatListItem
                key={index}
                userId={userId}
                chatId={chat._id}
                isGroupChat={chat.isGroupChat}
                chatName={getChatName(chat, userId)}
                icon={getChatIcon(chat, userId)}
                readBy={chat.latestMessage ? chat.latestMessage.readBy : ""}
                isChatUpdate={
                  chat.latestMessage ? chat.latestMessage.isChatUpdate : false
                }
                sender={
                  chat.latestMessage
                    ? JSON.parse(JSON.stringify(chat.latestMessage.sender))
                    : ""
                }
                senderName={
                  chat.latestMessage ? chat.latestMessage.sender.username : ""
                }
                msg={
                  chat.latestMessage
                    ? chat.latestMessage.content
                    : `@${chat.groupAdmin.username}: Started chat `
                }
                updatedAt={getTime(chat.updatedAt)}
              />
            );
          })
        ) : (
          // IF THERE IS NO CHATS
          <NoChats userId={userId} />
        )}
      </div>
    </div>
  );
};

export default memo(UserChatsList);

// NOTIFICATION BOX TO SHOW ON AN NOTIFICATION
const NotificationBox = ({ name, img, msg }) => {
  return (
    <div className="w-full h-10 overflow-hidden px-2 flex gap-3 items-center cursor-pointe">
      {/* USER AVATAR DIV */}
      <div className="w-[15%]  sm:w-[10%] min-w-min-[10%] h-full overflow-hidden">
        <img
          className="rounded-full"
          src={img}
          width={45}
          height={50}
          alt="avatar"
        />
      </div>

      <div className="w-full sm:max-w-[70%] h-full overflow-hidden ">
        {/* USERNAME AND TIME */}
        <p className="font-semibold text-[.9rem] sm:text-sm w-full h-1/2 overflow-hidden">
          @{name}
        </p>

        <div className="pl-2 w-full h-1/2 text-[.85rem] sm:text-[.8rem] overflow-hidden mt-[.1rem]">
          {msg}
        </div>
      </div>
    </div>
  );
};

// NO CHATS COMPONENTS
const NoChats = ({ userId }) => {
  return (
    <div className="w-full h-full relative">
      <div className="w-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center font-semibold">
        <p>No Chats to show</p>
        <p>
          Start a new chat{" "}
          <span>
            <Link href={`/${userId}/users`}>
              <MdOutlineAddCircle size={"1.75rem"} className="m-auto" />
            </Link>
          </span>
        </p>
      </div>
    </div>
  );
};
