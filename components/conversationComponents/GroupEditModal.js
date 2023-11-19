"use client";
import axios from "axios";
import Image from "next/image";
import { useState } from "react";
import toast from "react-hot-toast";
import { GrClose, GrFormSearch } from "react-icons/gr";
import AddUserModal from "./GroupEditComponents/AddUserModal";

const GroupEditModal = ({ groupAdmin, chatUsers, chatId, userId }) => {
  const [groupMembers, setGroupMembers] = useState(chatUsers);
  const [isAddUserModalOpen, setIsAddUserModelOpen] = useState(false);
  return (
    <div className="w-64 min-h-20 h-fit p-4 absolute right-1/2 sm:right-[65%] top-4 sm:top-1/2 bg-white text-white shadow-2xl drop-shadow-xl rounded-lg border-2 border-stone-100 z-30 overflow-hidden">
      {/* ADD USER MODAL */}
      {isAddUserModalOpen && (
        <AddUserModal
          setIsAddUserModelOpen={setIsAddUserModelOpen}
          groupMembers={groupMembers}
          setGroupMembers={setGroupMembers}
          chatId={chatId}
          userId={userId}
        />
      )}

      {/* GROUP MENU */}
      {groupAdmin.toString() === userId && (
        <button
          className="text-sm w-full h-9 bg-red-700 my-1 rounded-md"
          onClick={() => setIsAddUserModelOpen(true)}
        >
          Add a user
        </button>
      )}
      <button className="text-sm w-full h-9 bg-red-700 my-1 rounded-md">
        Leave this group
      </button>
      <div>
        <p className="text-black w-full text-center mt-3">
          <i>Members</i>
        </p>
        <hr />
        {groupMembers.map((user, index) => {
          return (
            <GroupMember
              key={index}
              index={index}
              icon={user.icon}
              username={user.username}
              groupAdmin={groupAdmin.toString()}
              userId={userId}
              chatUserId={user._id}
              chatId={chatId}
              setGroupMembers={setGroupMembers}
            />
          );
        })}
      </div>
    </div>
  );
};

export default GroupEditModal;

const GroupMember = ({
  icon,
  index,
  groupAdmin,
  userId,
  username,
  chatUserId,
  chatId,
  setGroupMembers,
}) => {
  let isAdmin = groupAdmin === userId;

  const removeMember = () => {
    setGroupMembers((members) => {
      return members.filter((_, i) => i !== index);
    });
    toast.success(`@${username} has been removed from the group`);
  };

  const handleKick = async () => {
    const data = {
      admin: groupAdmin,
      user: chatUserId,
      chatId: chatId,
    };
    console.log(data);
    const response = await axios.put(`/api/chat/removeUser`, data);
    if (response.data.status === "success") {
      removeMember();
    } else {
      toast.error(response.data.message);
    }
  };

  return (
    <div className="text-black flex items-center overflow-hidden my-3">
      <div className="w-1/4">
        <Image
          src={icon}
          width={30}
          height={20}
          alt="avatar"
          className="rounded-full"
        />
      </div>
      <div
        className={`${
          isAdmin ? "w-1/2" : "w-3/4"
        } text-black text-sm whitespace-nowrap`}
      >
        @{username}
      </div>
      {isAdmin && (
        <button
          onClick={handleKick}
          className="w-1/4 text-red-700 font-extrabold"
        >
          Kick
        </button>
      )}
    </div>
  );
};
