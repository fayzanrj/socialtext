import Image from "next/image";
import Link from "next/link";
import React from "react";
import ChatEdit from "./ChatEdit";
import EditableChatNameBox from "./GroupEditComponents/EditableChatNameBox";

const ChatTopBox = ({
  name,
  userId,
  icon,
  chat,
}) => {
  return (
    <div className="w-full py-2 px-4 flex items-center justify-between border-b-2 border-stone-200 h-[8%]">
      <div className="flex items-center gap-2">
        <div className="pb-2 mr-2">
          <Link href={`/${userId}/conversations`} className="text-[2.5rem]">
            &#8249;
          </Link>
        </div>
        <Image
          className="rounded-full"
          src={icon}
          width={40}
          height={50}
          alt="avatar"
        />
        <div className="font-semibold text-sm">
          {chat.isGroupChat ? <EditableChatNameBox name={name} /> : `@${name}`}
        </div>
      </div>
      <ChatEdit
        isGroupChat={chat.isGroupChat}
        groupAdmin={chat.groupAdmin}
        userId={userId}
        chatId={chat._id}
        chatUsers={chat.chatUsers}
      />
    </div>
  );
};

export default ChatTopBox;
