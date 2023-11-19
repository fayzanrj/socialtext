"use client";

import Loader from "@/components/Loader";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { GrClose } from "react-icons/gr";
import { HiPencil } from "react-icons/hi";

const EditableChatNameBox = ({ name, icon, userId, chatId }) => {
  const [groupName, setGroupName] = useState(name);
  const [groupIcon, setGroupIcon] = useState(icon);
  const [isEditOpen, setIsEditOpen] = useState(false);
  return (
    <div>
      {isEditOpen && (
        <EditInfoModal
          setIsEditOpen={setIsEditOpen}
          isEditOpen={isEditOpen}
          groupName={groupName}
          groupIcon={groupIcon}
          setGroupName={setGroupName}
          setGroupIcon={setGroupIcon}
          userId={userId}
          chatId={chatId}
        />
      )}
      <div className="flex items-center gap-2 cursor-pointer">
        <div className="pb-2 mr-2">
          <Link href={`/${userId}/conversations`} className="text-[2.5rem]">
            &#8249;
          </Link>
        </div>
        <Image
          className="rounded-full cursor-pointer"
          src={groupIcon}
          width={40}
          height={50}
          alt="avatar"
          onClick={() => setIsEditOpen(!isEditOpen)}
        />

        <div
          onClick={() => setIsEditOpen(!isEditOpen)}
          className="font-semibold text-sm cursor-pointer"
        >
          {groupName}
        </div>
      </div>
    </div>
  );
};

export default EditableChatNameBox;

const EditInfoModal = ({
  setIsEditOpen,
  isEditOpen,
  groupName,
  setGroupName,
  groupIcon,
  setGroupIcon,
  userId,
  chatId,
}) => {
  const [newName, setNewName] = useState(groupName);
  const [isNameChanging, setIsNameChanging] = useState(false);

  const handleChangeName = async () => {
    try {
      setIsNameChanging(true);
      const data = {
        newName: newName,
        user: userId,
        chatId: chatId,
      };
      if (groupName === newName) {
        toast.error("New name is same as old name");
        return;
      }

      const response = await axios.put(`/api/chat/changeGroupName`, data);
      if (response.data.status === "success") {
        setGroupName(newName);
        toast.success(response.data.msg);
        return;
      }

      toast.error(response.data.msg);
    } catch (error) {
    } finally {
      setIsNameChanging(false);
    }
  };
  return (
    <div className=" w-[90%] md:w-96 h-72 shadow-lg drop-shadow-lg bg-white py-3 px-4 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-40">
      <div className="w-full h-[6.67%]">
        <GrClose
          onClick={() => setIsEditOpen(!isEditOpen)}
          className="cursor-pointer float-right "
          size={"1.2rem"}
        />
      </div>
      {/* <div className="w-full h-3/5 bg-red-300">
        <Image
          src={groupIcon}
          width={100}
          height={40}
          className="rounded-full border-2 border-gray-200 m-auto"
          alt="Avatar"
        />
        <input type="file" className="w-10" />
        <button className="text-white bg-black my-1 py-1 px-3  rounded-md">
          Change group icon
        </button>
      </div> */}
      <div className="w-full h-1/3 text-center p-2">
        <input
          type="text"
          className="py-1 px-2 outline-none border-2 border-stone-300 border-opacity-70 rounded-lg"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <br />
        <button
          className="text-white bg-black my-1 py-1 px-3 w-48 h-8 rounded-md relative"
          onClick={handleChangeName}
          disabled={isNameChanging}
        >
          {isNameChanging ? <Loader /> : "Change Group Name"}
        </button>
      </div>
    </div>
  );
};
