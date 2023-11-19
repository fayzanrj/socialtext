"use client";
import axios from "axios";
import Image from "next/image";
import { useState } from "react";
import toast from "react-hot-toast";
import { RiPencilFill } from "react-icons/ri";
import Loader from "../Loader";

// HEADERS FOR API REQUEST
const headers = {
  "Content-Type": "application/json",
  api_key: process.env.NEXT_PUBLIC_API_KEY,
};

const MyProfileIcon = ({ userId, icon }) => {
  const [userIcon, setUserIcon] = useState(icon);
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <>
      {isModalOpen && (
        <IconSelectionModal
          setIsModalOpen={setIsModalOpen}
          userId={userId}
          icon={icon}
          userIcon={userIcon}
          setUserIcon={setUserIcon}
        />
      )}
      <div className="w-full relative">
        <div className="relative left-1/2 transform -translate-x-1/2 w-fit">
          <Image
            className="rounded-full"
            src={userIcon}
            width={100}
            height={50}
            alt="avatar"
          />
          <button
            className="p-1 bg-black text-white rounded-full absolute bottom-0 left-0"
            onClick={() => setIsModalOpen(true)}
          >
            <RiPencilFill size={"1rem"} />
          </button>
        </div>
      </div>
    </>
  );
};

export default MyProfileIcon;

const IconSelectionModal = ({
  setIsModalOpen,
  userId,
  icon,
  userIcon,
  setUserIcon,
}) => {
  const [selectedIcon, setSelectedIcon] = useState(userIcon);
  const [isLoading, setIsLoading] = useState(false);
  const handleChangeIcon = async () => {
    try {
      setIsLoading(true);
      const res = await axios.put(
        "/api/user/changeIcon",
        {
          userId: userId,
          newIconUrl: selectedIcon,
        },
        { headers: headers }
      );
      setUserIcon(selectedIcon);
      toast.success(res.data.msg);
    } catch (error) {
      toast.error(error.response ? error.response.data.msg : error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const iconsUrl = [
    "https://cdn-icons-png.flaticon.com/512/2202/2202112.png",
    "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
    "https://cdn-icons-png.flaticon.com/512/4140/4140048.png",
    "https://cdn-icons-png.flaticon.com/512/4140/4140047.png",
    "https://cdn-icons-png.flaticon.com/512/2507/2507657.png",
    "https://cdn-icons-png.flaticon.com/512/6997/6997662.png",
    "https://cdn-icons-png.flaticon.com/512/236/236832.png",
    "https://cdn-icons-png.flaticon.com/512/4128/4128176.png",
    "https://cdn-icons-png.flaticon.com/512/4140/4140061.png",
    "https://cdn-icons-png.flaticon.com/512/706/706830.png",
    "https://cdn-icons-png.flaticon.com/512/921/921124.png",
    "https://cdn-icons-png.flaticon.com/512/706/706831.png",
    "https://cdn-icons-png.flaticon.com/128/219/219970.png",
    "https://cdn-icons-png.flaticon.com/128/924/924874.png",
    "https://cdn-icons-png.flaticon.com/128/4140/4140046.png",
    "https://cdn-icons-png.flaticon.com/128/1154/1154448.png",
    "https://cdn-icons-png.flaticon.com/128/921/921009.png",
    "https://cdn-icons-png.flaticon.com/128/706/706819.png",
  ];
  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 w-[100%] md:w-[85%] lg:w-[60%]  min-h-[70%] mt-3 sm:mt-0 shadow-2xl drop-shadow-lg  bg-white">
      <div className="h-[40%] p-4 text-center overflow-hidden ">
        Selected Icon :{" "}
        <Image
          className="rounded-full m-auto mt-1"
          //   src={"https://cdn-icons-png.flaticon.com/128/1999/1999625.png"}
          src={selectedIcon}
          width={70}
          height={50}
          alt="avatar"
        />
      </div>

      <div className="flex justify-center flex-wrap p-4 gap-2 sm:gap-3 md:gap-4 lg:gap-6">
        {iconsUrl.map((icon, index) => {
          return (
            <Image
              key={index}
              className="rounded-full m-auto cursor-pointer"
              src={icon}
              width={70}
              height={50}
              alt="avatar"
              onClick={() => setSelectedIcon(icon)}
            />
          );
        })}
      </div>

      <div className="text-center my-4">
        <button
          className="w-[30%] bg-red-700 mx-1 p-2 text-white"
          onClick={handleCancel}
        >
          Close
        </button>
        <button
          className="w-[30%] h-10 overflow-hidden max-h-10 bg-black mx-1 p-2 text-white relative"
          onClick={handleChangeIcon}
        >
          {isLoading ? <Loader /> : "Save"}
        </button>
      </div>
    </div>
  );
};
