import Chat from "@/models/chatModel";
import ChatRoom from "@/models/chatRoomModel";
import Message from "@/models/msgModel";
import User from "@/models/userModel";
import { connectToDB } from "@/utilities/db";
import { pusherServer } from "@/utilities/pusher";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export const POST = async (req) => {
  try {
     // GETTING HEADERS
     const headersList = headers();
     const referer = headersList.get("api_key");
 
     // CHECKING IF API KEY MATCHES
     if (referer !== process.env.API_KEY) {
       return NextResponse.json(
         {
           msg: "Not authorized",
         },
         { status: 401 }
       );
     }
    await connectToDB();

    // DESTRUCTURING DATA
    const { users } = await req.json();

    // IF DATA DOESNT COME THROUGH
    if (!users || users.length < 2) {
      return NextResponse.json({ msg: "Incomplete data" }, { status: 409 });
    }

    // FIND IF CHAT ALREADY EXISTS
    let chatExists = await Chat.findOne({
      isGroupChat: false,
      chatUsers: { $all: [users[0], users[1]] }
    });

    if (chatExists) {
      const chatWithDetails = await Chat.findById(chatExists._id)
      .populate("chatUsers", "email username icon")
      .populate("groupAdmin", "email username icon")
      .populate({
        path: "latestMessage",
        populate: {
          path: "sender",
          select: "username email",
        },
      });
      return NextResponse.json({ chat: chatWithDetails }, { status: 200 });
    }

    // CREATE CHAT ROOM
    const chatRoom = await ChatRoom.create({});
    const admin = await User.findById(users[0]);

    const chat = await Chat.create({
      chatName: "sender",
      chatUsers: users,
      groupAdmin: users[0],
      chatRoom: chatRoom.id,
    });

    const message = await Message.create({
      sender: users[0],
      content: `New Chat Started by @${admin.username}`,
      chatId: chat._id,
      readBy: [users[0]],
      isChatUpdate: true,
      msgType: "text",
    });

    const updatedChat = await Chat.findByIdAndUpdate(chat._id, {
      latestMessage: message,
    });

    if (!chat) {
      return NextResponse.json(
        {
          msg: "Internal server error",
        },
        { status: 500 }
      );
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

    return NextResponse.json(
      {
        chat: chatWithDetails,
      },
      { status: 200 }
    );
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
