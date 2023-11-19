"use client";
import axios from "axios";
import { useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import Loader from "../Loader";
import { useRouter } from "next/navigation";
import GroupEditModal from "./GroupEditModal";
import SingleEditModal from "./SingleEditModal";

const ChatEdit = ({ groupAdmin, isGroupChat, userId, chatId ,chatUsers}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setIsModalOpen(!isModalOpen)}
        className="outline-none"
      >
        <BsThreeDotsVertical size={"1.2rem"} />
      </button>
      {isModalOpen &&
        (isGroupChat ? (
          <GroupEditModal
            groupAdmin={groupAdmin}
            userId={userId}
            chatId={chatId}
            chatUsers={chatUsers}
          />
        ) : (
          <SingleEditModal userId={userId} chatId={chatId} />
        ))}
    </div>
  );
};

export default ChatEdit;


