"use client";
import Loader from "@/components/Loader";
import axios from "axios";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { GrFormSearch } from "react-icons/gr";

// HEADERS FOR API REQUEST
const headers = {
  "Content-Type": "application/json",
  api_key: process.env.NEXT_PUBLIC_API_KEY,
};

const CreateGroup = ({ params }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [searched, setSearched] = useState([]);
  const search = useRef();
  const groupName = useRef();
  const [selectedUsers, setSelectedUsers] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await axios.get(`/api/search/${search.current.value}`);
    setSearched(await response.data);
  };

  const handleCreateGroup = async () => {
    if (selectedUsers.length <= 1) {
      toast.error("You have to select minimum 2 users to form a group");
      return;
    }

    if (groupName.current.value.length <= 0) {
      toast.error("Enter Group name");
      return;
    }

    setIsLoading(true);

    const users = [params.userId];
    selectedUsers.map((user) => {
      users.push(user.id);
    });

    const data = {
      users: users,
      groupAdmin: params.userId,
      groupName: groupName.current.value,
    };

    const response = await axios.post(`/api/chat/createGroup`, data, {
      headers,
    });
    if (response.data.status === "success") {
      //
    }

    setIsLoading(false);
  };

  return (
      <div className="w-full h-[92svh] sm:h-[100svh] relative bg-white overflow-y-auto">
        {/* FORM TO SEARCH */}
        <form
          onSubmit={handleSubmit}
          className="w-full h-[9%] sm:h-[8%] relative bg-white pt-2"
        >
          <div className="w-[90%] bg-gray-200 rounded-3xl flex m-auto justify-center items-center">
            <input
              id="search"
              ref={search}
              placeholder="Search users"
              className="w-[95%]  bg-transparent px-[1rem] outline-none "
            />
            <button aria-label="SearchBtn" type="submit">
              <GrFormSearch size={"2.5rem"} />
            </button>
          </div>
        </form>
        {/* SELECTED USERS FOR GROUP && BUTTON TO CREATE GROUP */}
        <div className="w-full  min-h-[30%]">
          <div className="w-full min-h-[70%] overflow-hidden max-h-fit flex flex-wrap gap-2 p-2">
            {selectedUsers.length <= 0 ? (
              <div className="w-full text-center h-24 pt-6 font-semibold text-lg">
                Search users to add
              </div>
            ) : (
              selectedUsers.map((user, index) => {
                return (
                  <SelectedUserItem
                    key={index}
                    index={index}
                    username={user.username}
                    icon={user.icon}
                    setSelectedUsers={setSelectedUsers}
                    selectedUsers={selectedUsers}
                  />
                );
              })
            )}
          </div>
          <div className="w-96 h-[6%] mx-auto mb-4 border-b-2 border-stone-400">
            <input
              ref={groupName}
              placeholder="Enter group name"
              className="w-full outline-none p-2 text-lg"
            />
          </div>
          <div className="w-full h-16 text-center py-1 overflow-hidden">
            <button
              className="w-1/2 md:w-1/3 h-3/4 mx-auto rounded-lg bg-black text-white relative"
              type="button"
              disabled={isLoading}
              onClick={handleCreateGroup}
            >
              {isLoading ? <Loader /> : "Create Group"}
            </button>
          </div>
        </div>
        {/* SEARCHED USERS */}
        <div className="w-full min-h-[55%] h-fit p-2 flex flex-wrap justify-center sm:justify-start">
          {searched.length > 1 &&
            searched.map((item, index) => {
              return item._id !== params.userId ? (
                <SearchedUsersGroup
                  key={index}
                  userId={params.userId}
                  searchedUserId={item._id}
                  username={item.username}
                  email={item.email}
                  icon={item.icon}
                  selectedUsers={selectedUsers}
                  setSelectedUsers={setSelectedUsers}
                />
              ) : null;
            })}
        </div>
      </div>
  );
};

export default CreateGroup;

const SelectedUserItem = ({ username, icon, index, setSelectedUsers }) => {
  const removeFromList = () => {
    setSelectedUsers((selectedUsers) => {
      return selectedUsers.filter((_, i) => i !== index);
    });
  };
  return (
    <div className="w-32 h-24 p-3 bg-white relative select-none">
      <div
        className="text-black text-right absolute top-0 right-3 cursor-pointer"
        onClick={removeFromList}
      >
        x
      </div>
      <Image
        src={icon}
        width={50}
        height={50}
        className="mx-auto rounded-full"
        alt="avatar"
      />
      <div className="text-black text-center">@{username}</div>
    </div>
  );
};

const SearchedUsersGroup = ({
  username,
  email,
  icon,
  searchedUserId,
  selectedUsers,
  setSelectedUsers,
}) => {
  const handleAdd = async () => {
    const isAdded = await selectedUsers.find(
      (user) => user.id === searchedUserId
    );
    if (isAdded) {
      toast.error("User already selected");
      return;
    }
    const member = {
      username: username,
      id: searchedUserId,
      icon: icon,
    };

    setSelectedUsers([...selectedUsers, member]);
  };
  return (
    <div className="w-64 h-32 m-3 pb-3 px-1 bg-white shadow-lg rounded-md drop-shadow-2xl">
      <div className="w-full h-[75%]  p-4 flex gap-3 items-center cursor-pointer sm:hover:bg-stone-200">
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
            <p className="font-semibold text-sm sm:text-[.83rem] w-[70%] max-w-[70%] max-h-[80%] overflow-hidden ">
              @{username}
            </p>
          </div>
          <div className=" w-full h-1/2 max-h-1/2 overflow-hidden mt-2 sm:text-[.79rem] text-sm pl-1  ">
            {email}
          </div>
        </div>
      </div>
      <div className="w-full h-1/4 text-center">
        <button
          onClick={handleAdd}
          className="w-[90%] h-full  bg-black text-white rounded-lg "
        >
          Add to group
        </button>
      </div>
    </div>
  );
};
