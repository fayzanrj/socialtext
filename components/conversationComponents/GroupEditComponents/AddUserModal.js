import axios from "axios";
import Image from "next/image";
import { useRef, useState } from "react";
import toast from "react-hot-toast";

const { GrClose, GrFormSearch } = require("react-icons/gr");

const AddUserModal = ({
  setIsAddUserModelOpen,
  groupMembers,
  setGroupMembers,
  userId,
  chatId,
}) => {
  const search = useRef();

  const [searchedUsers, setSearchedUsers] = useState([]);
  const handleSearch = async (e) => {
    e.preventDefault();
    const response = await axios.get(`/api/search/${search.current.value}`);
    setSearchedUsers(await response.data);
  };
  return (
    <div className="w-64 min-h-20 h-full bg-white p-3 text-black absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      {/* CLOSE BTN */}
      <div
        className="w-full h-[5%]  text-center"
        onClick={() => setIsAddUserModelOpen(false)}
      >
        <GrClose className="cursor-pointer" />
      </div>

      <form
        onSubmit={handleSearch}
        className="w-full h-[15%] relative  mt-2 pt-1"
      >
        <div className="w-full bg-gray-200 rounded-3xl flex m-auto justify-center items-center">
          <input
            id="search"
            ref={search}
            placeholder="Search a user"
            className="w-[95%]  bg-transparent px-[1rem] outline-none "
          />
          <button aria-label="SearchBtn" type="submit">
            <GrFormSearch size={"2rem"} />
          </button>
        </div>
      </form>

      <div className="w-full h-[80%] overflow-y-auto SCROLL_BAR">
        {searchedUsers.length > 1 &&
          searchedUsers.map((user, index) => {
            const groupMembersSet = new Set(
              groupMembers.map((member) => member._id)
            );

            if (!groupMembersSet.has(user._id)) {
              return (
                <SearchedItem
                  key={index}
                  icon={user.icon}
                  username={user.username}
                  email={user.email}
                  userToAddId={user._id}
                  chatId={chatId}
                  admin={userId}
                  setGroupMembers={setGroupMembers}
                  groupMembers={groupMembers}
                />
              );
            }

            return null;
          })}
      </div>
    </div>
  );
};

export default AddUserModal;

const SearchedItem = ({
  icon,
  username,
  email,
  userToAddId,
  chatId,
  admin,
  setGroupMembers,
  groupMembers,
}) => {
  const data = {
    admin: admin,
    user: userToAddId,
    chatId: chatId,
  };
  const handleAdd = async () => {
    const response = await axios.put(`/api/chat/addUser`, data);
    if (response.data.status === "success") {
      toast.success(response.data.msg);
      setGroupMembers([...groupMembers, response.data.user]);
    }
  };
  return (
    <div className="w-full h-24 mt-3 pb-1 bg-white shadow-lg rounded-md">
      <div className="w-full h-3/4  p-4 flex gap-3 items-center cursor-pointer">
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

        <div className="w-[85%] sm:max-w-[80%] h-full px-1 whitespace-nowrap">
          {/* USERNAME AND TIME */}
          <div className=" w-full min-h-1/2 max-h-1/2 overflow-hidden">
            <p className="font-semibold text-sm sm:text-[.83rem] w-[70%] max-w-[70%] max-h-[80%] overflow-hidden ">
              @{username}
            </p>
          </div>
          <div className=" w-full min-h-1/2 max-h-1/2 overflow-hidden sm:text-[.79rem] text-sm pl-1">
            {email}
          </div>
        </div>
      </div>
      <div className="w-full h-1/4 text-center">
        <button
          onClick={handleAdd}
          className="w-[90%] h-full text-sm bg-black text-white rounded-lg "
        >
          Add to group
        </button>
      </div>
    </div>
  );
};
