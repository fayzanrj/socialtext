import Chat from "@/models/chatModel";
import Message from "@/models/msgModel";
import User from "@/models/userModel";
import { connectToDB } from "@/utilities/db";
import { pusherServer } from "@/utilities/pusher";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

const addUser = (array, userId) => {
  array.push(userId);
  return array;
};

const UpdateChatsInUI = async (chatUsers, msgWithDetails) => {
  const notifications = chatUsers.map(async (user) => {
    return pusherServer.trigger(
      user._id.toString(),
      "update-chatList",
      msgWithDetails
    );
  });

  await Promise.all(notifications);

  return;
};

export const PUT = async (request) => {
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

    const { admin, user, chatId } = await request.json();

    // FINDING CHAT
    const chat = await Chat.findById(chatId);
    // FINDING USER DETAILS
    const userDetails = await User.findById(user);

    // CREATING LATEST MESSAGE
    const message = await Message.create({
      sender: admin,
      content: `@${userDetails.username} has been added`,
      chatId: chatId,
      readBy: [admin],
      isChatUpdate: true,
      type : "text"
    });

    // UPDATING CHATLIST OF THE CHAT BY REMOVING THE REQUESTED USER
    const updatedChat = await Chat.findByIdAndUpdate(chatId, {
      chatUsers: addUser(chat.chatUsers, user),
      latestMessage: message,
    });

    const msgWithDetails = await Message.findById(message._id).populate(
      "sender",
      "username email icon"
    );

    // SENDING CHAT UPDATE IN THE CHAT BOX
    await pusherServer.trigger(
      updatedChat.chatRoom.toString(),
      "incoming-message",
      message
    );

    // CHAT WITH DETAILS
    const chatWithDetails = await Chat.findById(updatedChat._id)
      .populate("chatUsers", "-password")
      .populate("groupAdmin", "-password")
      .populate({
        path: "latestMessage",
        populate: {
          path: "sender",
          select: "username email",
        },
      });

    // UPDATING CHAT LIST OF THE REMOVED USER
    await pusherServer.trigger(user, "add-newChat", chatWithDetails);

    // UPDATING OTHER USERS CHATLIST
    await UpdateChatsInUI(updatedChat.chatUsers, msgWithDetails);

    return NextResponse.json(
      {
        msg: `${userDetails.username} has been added`,
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
