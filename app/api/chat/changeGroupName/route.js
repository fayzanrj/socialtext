import Chat from "@/models/chatModel";
import Message from "@/models/msgModel";
import User from "@/models/userModel";
import { connectToDB } from "@/utilities/db";
import { pusherServer } from "@/utilities/pusher";
import { NextResponse } from "next/server";

const UpdateChatsInUI = async (chatUsers, chatDetails) => {
  const notifications = chatUsers.map(async (user) => {
    return pusherServer.trigger(
      user._id.toString(),
      "update-chatName",
      chatDetails
    );
  });

  await Promise.all(notifications);

  return;
};

export const PUT = async (request) => {
  try {
    await connectToDB();

    const { newName, user, chatId } = await request.json();

    // FINDING CHAT
    const chat = await Chat.findById(chatId);
    // FINDING USER DETAILS
    const userDetails = await User.findById(user);

    // CREATING LATEST MESSAGE
    const message = await Message.create({
      sender: chat.groupAdmin,
      content: `@${userDetails.username} changed group name to ${newName}`,
      chatId: chatId,
      readBy: [user],
      isChatUpdate: true,
    });

    // UPDATING CHATLIST OF THE CHAT BY REMOVING THE REQUESTED USER
    const updatedChat = await Chat.findByIdAndUpdate(chatId, {
      chatName: newName,
      latestMessage: message,
    });

    // SENDING CHAT UPDATE IN THE CHAT BOX
    await pusherServer.trigger(
      updatedChat.chatRoom.toString(),
      "incoming-message",
      message
    );

    const msgWithDetails = await Message.findById(message._id).populate(
      "sender",
      "username email icon"
    );

    // UPDATING OTHER USERS CHATLIST
    await UpdateChatsInUI(updatedChat.chatUsers, {
      chatId: chatId,
      newName: newName,
      msg: msgWithDetails,
    });

    return NextResponse.json({
      status: "success",
      msg: `@${userDetails.username} changed group name to ${newName}`,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      status: "failed",
      msg: "Internal server error",
    });
  }
};
