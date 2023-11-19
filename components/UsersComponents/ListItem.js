"use Client";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import FriendListBtns from "./FriendListBtns";
import RequestsListBtns from "./RequestsListBtns";
import RequestedListBtns from "./RequestedListBtns";
import toast from "react-hot-toast";


const requestHeaders = {
  "Content-Type": "application/json",
  api_key: process.env.NEXT_PUBLIC_API_KEY,
};

const ListItem = ({
  username,
  email,
  itemId,
  icon,
  userId,
  route,
  index,
  setList,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  // BLOCK USER
  const blockUser = async () => {
    setIsLoading(true);
    try {
      const res = await axios.put(
        "/api/users/blockUser",
        {
          blocked: itemId,
          blockedBy: userId,
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
  return (
    <div className="w-full min-h-[7.5rem] flex justify-between items-center px-2  md:px-6 border-b-[1px]">
      {/* INFO DIV */}
      <div className="flex gap-2 overflow-x-auto SCROLL_BAR">
        <div>
          <Image
            quality={100}
            src={icon}
            width={50}
            height={50}
            className="rounded-full"
            alt="icon"
          />
        </div>

        <div className="md:ml-3 text-left">
          <div>{username}</div>
          <div>{email}</div>
        </div>
      </div>

      {/* ACTION DIV */}
      {route === "friends" && (
        <FriendListBtns
          setIsLoading={setIsLoading}
          isLoading={isLoading}
          userId={userId}
          itemId={itemId}
          requestHeaders={requestHeaders}
          blockUser={blockUser}
        />
      )}

      {route === "requests" && (
        <RequestsListBtns
          setIsLoading={setIsLoading}
          isLoading={isLoading}
          setList={setList}
          userId={userId}
          itemId={itemId}
          blockUser={blockUser}
        />
      )}

      {route === "requested" && (
        <RequestedListBtns
          setIsLoading={setIsLoading}
          isLoading={isLoading}
          setList={setList}
          userId={userId}
          itemId={itemId}
          blockUser={blockUser}
        />
      )}
    </div>
  );
};

export default ListItem;
