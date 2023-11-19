import Chat from "@/models/chatModel";
import Message from "@/models/msgModel";
import { connectToDB } from "@/utilities/db";
import { pusherServer } from "@/utilities/pusher";
import { NextResponse } from "next/server";

export const PUT = async (request) => {
  try {
    await connectToDB();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const chatId = searchParams.get("chatId");

    // Find the chat
    const chat = await Chat.findById(chatId).populate("latestMessage");

    // Check if chat exists
    if (!chat) {
      return NextResponse.json({
        status: "failed",
        msg: "Chat not found",
      });
    }

    const updateReadBy = (array, userId) => {
      if (!array.includes(userId)) {
        array.push(userId);
        return array;
      } else {
        console.log(false);
      }
    };

    const msg = await Message.findByIdAndUpdate(chat.latestMessage._id, {
      readBy: updateReadBy(chat.latestMessage.readBy, userId),
    });

    // await pusherServer
    const newMsg = await Message.findById(msg._id);
    const newMsgWithDetails = await Message.findById(msg._id).populate('readBy');

    await pusherServer.trigger(userId, "update-readBy", newMsg);
    await pusherServer.trigger(chat.chatRoom.toString(), "update-seenBy", newMsgWithDetails);


    return NextResponse.json({
      status: "success",
      msg: "Chat marked as read",
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      status: "failed",
      msg: "Internal server error",
    });
  }
};
