import Chat from "@/models/chatModel";
import Message from "@/models/msgModel";
import { connectToDB } from "@/utilities/db";
import { pusherServer } from "@/utilities/pusher";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

const UpdateChatsInUI = async (chatUsers, msgWithDetails, sendBy) => {
  try {
    const notifications = chatUsers.map(async (user) => {
      if (user._id.toString() !== sendBy) {
        await pusherServer.trigger(
          user._id.toString(),
          "message-notification",
          msgWithDetails
        );
      }
      return pusherServer.trigger(
        user._id.toString(),
        "update-chatList",
        msgWithDetails
      );
    });

    await Promise.all(notifications);
  } catch (error) {
    console.error("Error updating chats in UI:", error);
  }
};

export const POST = async (request) => {
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

    const { msg, chatId, sendBy, chatRoom, msgType, isReplyTo } =
      await request.json();

    // IF DATA DOESNT COME THROUGH
    if (!msg || !chatId || !sendBy || !chatRoom || !msgType) {
      return NextResponse.json({ msg: "Incomplete data" }, { status: 409 });
    }

    const messageData = {
      sender: sendBy,
      content: msg,
      chatId: chatId,
      readBy: [sendBy],
      msgType: msgType,
    };

    // Check if isReply exists before adding it to the messageData
    if (isReplyTo) {
      messageData.isReplyTo = isReplyTo;
    }

    const message = await Message.create(messageData);

    const messageWithDetails = await Message.findById(message._id)
      .populate("sender", "username email icon")
      .populate({
        path: "isReplyTo",
        select: "content sender msgType",
        populate: {
          path: "sender",
          select: "username email icon",
        },
      });

    await pusherServer.trigger(
      chatRoom,
      "incoming-message",
      messageWithDetails
    );

    if (!message) {
      return NextResponse.json(
        {
          msg: "Internal server error",
        },
        { status: 500 }
      );
    }

    const chat = await Chat.findByIdAndUpdate(chatId, {
      latestMessage: message.id,
    })
      .populate("latestMessage")
      .populate("chatUsers", "-password");

    await UpdateChatsInUI(chat.chatUsers, messageWithDetails, sendBy);

    return NextResponse.json(
      {
        msg: "Message sent",
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
