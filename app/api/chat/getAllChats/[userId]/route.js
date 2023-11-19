import Chat from "@/models/chatModel";
import Message from "@/models/msgModel"
import { connectToDB } from "@/utilities/db";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export const GET = async (request, { params }) => {
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

    if (!params.userId) {
      return NextResponse.json({ msg: "Incomplete data" }, { status: 409 });
    }

    const chats = await Chat.find({ chatUsers: params.userId })
      .populate("chatUsers", "username email icon")
      .populate("groupAdmin", "username email icon")
      .populate({
        path: "latestMessage",
        populate: {
          path: "sender",
          select: "username email icon",
        },
      })
      .sort({ updatedAt: -1 });

    if (!chats || chats.length < 1) {
      return NextResponse.json(
        {
          msg: "No chats found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        chats,
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
