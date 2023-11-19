import Chat from "@/models/chatModel";
import Message from "@/models/msgModel";
import User from "@/models/userModel";
import { connectToDB } from "@/utilities/db";
import { pusherServer } from "@/utilities/pusher";
import { NextResponse } from "next/server";

const removeUser = (array, userId) => {
  const filtered = array.filter((user) => {
    return user.toString() !== userId;
  });
  return filtered;
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
    await connectToDB();

    const { admin, user, chatId } = await request.json();

    // FINDING CHAT
    const chat = await Chat.findById(chatId);
    // FINDING USER DETAILS
    const userDetails = await User.findById(user);

    // CREATING LATEST MESSAGE
    const message = await Message.create({
      sender: admin,
      content: `@${userDetails.username} has been removed`,
      chatId: chatId,
      readBy: [admin],
      isChatUpdate: true,
    });

    // UPDATING CHATLIST OF THE CHAT BY REMOVING THE REQUESTED USER
    const updatedChat = await Chat.findByIdAndUpdate(chatId, {
      chatUsers: removeUser(chat.chatUsers, user),
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

    // UPDATING CHAT LIST OF THE REMOVED USER
    await pusherServer.trigger(user, "delete-chat", chatId);

    // UPDATING OTHER USERS CHATLIST
    await UpdateChatsInUI(updatedChat.chatUsers, msgWithDetails);

    return NextResponse.json({
      status: "success",
      msg: "User has been removed",
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      status: "failed",
      msg: "Internal server error",
    });
  }
};
