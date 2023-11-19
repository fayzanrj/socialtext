import React from "react";
import DesktopSidebar from "./DesktopSidebar";
import MobileFooter from "./MobileFooter";
import UserChatsList from "../chatListComponents/UserChatsList";

const Sidebar = async ({userId, allChats}) => {
  return (
    <div className="fixed flex h-full w-full">
      <DesktopSidebar userId = {userId}  />
      <MobileFooter userId = {userId}  />
      <UserChatsList userId = {userId} allChats={allChats}/>
    </div>
  );
};

export default Sidebar;
