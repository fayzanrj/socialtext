"use client";
import React, { useState } from "react";
import ListItem from "./ListItem";
import { BiRefresh } from "react-icons/bi";
import { usePathname } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

const headers = {
  "Content-Type": "application/json",
  api_key: process.env.NEXT_PUBLIC_API_KEY,
};

const fetchFriends = async (userId, setList) => {
  try {
    const response = await axios.get(`/api/users/getFriendList/${userId}`, {
      headers: headers,
    });
    setList(response.data.friends);
    toast.success("Friend list updated");
  } catch (error) {
    if (error.response) {
      toast.error(error.response.data.msg);
    } else {
      toast.error(error.message);
    }
  }
};

const fetchRequests = async (userId, setList) => {
  try {
    const response = await axios.get(
      `/api/users/getRecievedRequests/${userId}`,
      {
        headers: headers,
      }
    );
    setList(response.data.requests);
    toast.success("Request list updated");
  } catch (error) {
    if (error.response) {
      toast.error(error.response.data.msg);
    } else {
      toast.error(error.message);
    }
  }
};

const fetchRequested = async (userId, setList) => {
  try {
    const response = await axios.get(`/api/users/getSentRequests/${userId}`, {
      headers: headers,
    });
    setList(response.data.requests);
    toast.success("Request list updated");
  } catch (error) {
    if (error.response) {
      toast.error(error.response.data.msg);
    } else {
      toast.error(error.message);
    }
  }
};

const List = ({ items, userId }) => {
  const [list, setList] = useState(items);
  const pathname = usePathname();
  const path = pathname.split("/");

  const handleClick = () => {
    if (path[3] === "friends") {
      fetchFriends(userId, setList);
    } else if (path[3] === "requests") {
      fetchRequests(userId, setList);
    } else if (path[3] === "requested") {
      fetchRequested(userId, setList);
    }
  };

  if (!list || list.length <= 0) {
    return (
      <div className="w-full h-full">
        <button className="ml-5" onClick={handleClick}>
          <BiRefresh size={"1.75rem"} />
        </button>
        <p className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-3xl uppercase">
          Coudn't find anything
        </p>
      </div>
    );
  }
  return (
    <div className="w-full h-full">
      <button className="ml-5" onClick={handleClick}>
        <BiRefresh size={"1.75rem"} />
      </button>
      <div className="border-t-[1px]">
        {list.map((item, index) => {
          return (
            <ListItem
              key={index}
              index={index}
              setList={setList}
              userId={userId}
              itemId={item._id}
              username={item.username}
              email={item.email}
              icon={item.icon}
              route={path[3]}
            />
          );
        })}
      </div>
    </div>
  );
};

export default List;
