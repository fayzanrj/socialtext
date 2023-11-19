import ChatEdit from "@/components/conversationComponents/ChatEdit";
import ChatInputBox from "@/components/conversationComponents/ChatInputBox";
import ChatTopBox from "@/components/conversationComponents/ChatTopBox";
import EditableChatNameBox from "@/components/conversationComponents/GroupEditComponents/EditableChatNameBox";
import MessagesBox from "@/components/conversationComponents/MessagesBox";
import Chat from "@/models/chatModel";
import Message from "@/models/msgModel";
import User from "@/models/userModel";
import { connectToDB } from "@/utilities/db";
import getChatIcon from "@/utilities/getChatIcon";
import getChatName from "@/utilities/getChatName";
import Image from "next/image";
import Link from "next/link";

const Page = async ({ params }) => {
  const { conversationId, userId } = params;

  await connectToDB();
  const currentUser = await User.findById(userId).populate("username icon");
  const existingMessages = await Message.find({
    chatId: conversationId,
  })
    .populate("sender", "username icon")
    .populate("readBy", "username");
  const chat = await Chat.findById(conversationId).populate(
    "chatUsers",
    "-password"
  );

  // const name =
  return (
    <div className="block sm:pl-80 h-[100svh]">
      <main className="w-full h-full bg-white relative ">
        {/* CHAT TOP BOX */}
        <div className="w-full py-2 px-4 flex items-center justify-between border-b-2 border-stone-200 h-[8%]">
          {chat.isGroupChat ? (
            <EditableChatNameBox
              name={getChatName(chat, userId)}
              icon={getChatIcon(chat, userId)}
              userId={userId}
              chatId={conversationId}
            />
          ) : (
            <div className="flex items-center gap-2 cursor-pointer">
              <div className="pb-2 mr-2">
                <Link
                  href={`/${userId}/conversations`}
                  className="text-[2.5rem]"
                >
                  &#8249;
                </Link>
              </div>
              <Image
                className="rounded-full "
                src={getChatIcon(chat, userId)}
                width={40}
                height={50}
                alt="avatar"
              />
              <div className="font-semibold text-sm">
                @{getChatName(chat, userId)}
              </div>
            </div>
          )}
          <ChatEdit
            isGroupChat={chat.isGroupChat}
            groupAdmin={chat.groupAdmin}
            userId={userId}
            chatId={conversationId}
            chatUsers={JSON.parse(JSON.stringify(chat.chatUsers))}
          />
        </div>

        <MessagesBox
          chatId={conversationId}
          messages={JSON.parse(JSON.stringify(existingMessages))}
          userId={userId}
          chatRoomId={JSON.parse(JSON.stringify(chat.chatRoom))}
          currentUser={JSON.parse(JSON.stringify(currentUser))}
        />

        {/* INPUT BOX */}
        <ChatInputBox
          userId={userId}
          conversationId={conversationId}
          chatRoomId={JSON.parse(JSON.stringify(chat.chatRoom))}
        />
      </main>
    </div>
  );
};

export default Page;
