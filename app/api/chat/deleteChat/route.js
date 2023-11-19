import Chat from "@/models/chatModel";
import Message from "@/models/msgModel";
import User from "@/models/userModel";
import { connectToDB } from "@/utilities/db";
import { pusherServer } from "@/utilities/pusher";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

const removeUser = async (chatUsers, userToDelete) => {
  const updatedChatUsers = chatUsers.filter(
    (item) => item.toString() !== userToDelete
  );
  return updatedChatUsers;
};

export const DELETE = async (request) => {
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

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const chatId = searchParams.get("chatId");

    // CHECKING IF DATA DOESNT COME THROUGH
    if (!userId || !chatId) {
      return NextResponse.json({ msg: "Incomplete data" }, { status: 409 });
    }

    const chat = await Chat.findById(chatId);
    const user = await User.findById(userId);

    if (!chat || !user) {
      return NextResponse.json(
        {
          msg: "Internal server error",
        },
        { status: 500 }
      );
    }

    let newChat;

    //IF THERE'S ONLY ONE USER IN THE CHAT
    if (chat.chatUsers.length === 1) {
      newChat = await Chat.findByIdAndDelete(chatId);
      const delMsgs = await Message.deleteMany({ chatId: chatId });

      if (!delMsgs || !newChat) {
        return NextResponse.json(
          {
            msg: "Internal server error",
          },
          { status: 500 }
        );
      }
    } else {
      newChat = await Chat.findByIdAndUpdate(chatId, {
        chatUsers: await removeUser(chat.chatUsers, userId),
        chatName: user.username,
      });
    }

    if (!newChat) {
      return NextResponse.json(
        {
          msg: "Internal server error",
        },
        { status: 500 }
      );
    }

    await pusherServer.trigger(userId, "delete-chat", chatId);

    return NextResponse.json(
      {
        msg: "Chat has been deleted",
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
