import Chat from "@/models/chatModel";
import ChatRoom from "@/models/chatRoomModel";
import Message from "@/models/msgModel";
import User from "@/models/userModel";
import { connectToDB } from "@/utilities/db";
import { pusherServer } from "@/utilities/pusher";
import { NextResponse } from "next/server";

export const POST = async (req) => {
  try {
    await connectToDB();

    const { groupName, users, groupAdmin } = await req.json();
    // console.log(data)

    const chatRoom = await ChatRoom.create({});

    const chat = await Chat.create({
      chatName: groupName,
      chatUsers: users,
      groupAdmin: groupAdmin,
      chatRoom: chatRoom.id,
      isGroupChat: true,
    });

    const admin = await User.findById(users[0]);

    const message = await Message.create({
      sender: chat.groupAdmin,
      content: `New Group Created by @${admin.username}`,
      chatId: chat._id,
      readBy: [users[0]],
      isChatUpdate: true,
      msgType : "text"
    });

    const updatedChat = await Chat.findByIdAndUpdate(chat._id, {
      latestMessage: message,
    });

    if (!chat || !updatedChat) {
      return NextResponse.json({
        status: "failed",
        msg: "Internal server error",
      });
    }

    const chatWithDetails = await Chat.findById(chat._id)
      .populate("chatUsers", "email username icon")
      .populate("groupAdmin", "email username icon")
      .populate({
        path: "latestMessage",
        populate: {
          path: "sender",
          select: "username email",
        },
      });
    const UpdateChatsInUI = async (chatUsers, chatWithDetails) => {
      console.log("sending");
      const notifications = chatUsers.map(async (user) => {
        return pusherServer.trigger(
          user._id.toString(),
          "add-newChat",
          chatWithDetails
        );
      });

      await Promise.all(notifications);

      return;
    };

    await UpdateChatsInUI(chat.chatUsers, chatWithDetails);

    return NextResponse.json({ chat: chatWithDetails }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        msg: "Internal server error",
      },
      { status: 500 }
    );
  }
};
