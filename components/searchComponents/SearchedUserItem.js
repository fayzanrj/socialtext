import Image from "next/image";
import Link from "next/link";
import React from "react";
import StartChat from "./StartChat";
import SendRequest from "./SendRequest";
import { connectToDB } from "@/utilities/db";
import User from "@/models/userModel";

const SearchedUserItem = async ({
  username,
  email,
  icon,
  userId,
  searchedUserId,
}) => {
  const block = false;

  await connectToDB();
  const user = await User.findById(userId).select(
    "friends hasRequested requestedBy"
  );
  console.log(user);

  return (
    <div className="w-68 h-48 m-3 pb-3  bg-white shadow-lg rounded-md drop-shadow-2xl">
      <div className="w-full h-[50%]  p-4 flex gap-3 items-center cursor-pointer sm:hover:bg-stone-200">
        {/* USER AVATAR DIV */}
        <div className="w-[15%] sm:w-[20%] min-w-min-[15%]">
          <Image
            className="rounded-full"
            src={icon}
            width={100}
            height={50}
            alt="avatar"
          />
        </div>

        <div className="w-[85%] sm:max-w-[80%] h-full p-1">
          {/* USERNAME AND TIME */}
          <div className=" w-full h-1/2 max-h-1/2 overflow-hidden">
            <p className="font-semibold text-sm sm:text-[.83rem] w-[70%] max-w-[70%] max-h-[80%] overflow-hidden">
              @{username}
            </p>
          </div>

          <div className=" w-full h-1/2 max-h-1/2 overflow-hidden mt-2 sm:text-[.79rem] text-sm pl-1">
            {email}
          </div>
        </div>
      </div>
      <hr className="w-[90%] m-auto " />
      <div className="p-4 gap-1">
        {user.friends.includes(searchedUserId) ? (
          <StartChat userId={userId} searchedUserId={searchedUserId} />
        ) : (
          <SendRequest
            requested={user.hasRequested.includes(searchedUserId)}
            userHasRequested={user.requestedBy.includes(searchedUserId)}
            userId={userId}
            searchedUserId={searchedUserId}
          />
        )}
        <div
          className={`${
            block ? "bg-red-600" : "bg-black"
          } text-white py-1 my-1 rounded-md text-center hover:bg-red-600`}
        >
          {block ? "UNBLOCK" : "BLOCK"}
        </div>
      </div>
    </div>
  );
};

export default SearchedUserItem;
