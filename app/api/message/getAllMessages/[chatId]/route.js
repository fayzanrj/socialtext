import Chat from "@/models/chatModel";
import Message from "@/models/msgModel";
import { connectToDB } from "@/utilities/db";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import User from "@/models/userModel";

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

    // IF DATA DOESNT COME THROUGH
    if (!params.chatId) {
      return NextResponse.json({ msg: "Incomplete data" }, { status: 409 });
    }

    const msgs = await Message.find({
      chatId: params.chatId,
    })
      .populate("sender", "username icon")
      .populate("readBy", "username")
      .populate({
        path: "isReplyTo",
        select: "content sender msgType",
        populate: {
          path: "sender",
          select: "username email icon",
        },
      });

    return NextResponse.json(
      {
        messages: msgs,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error.message);
    return NextResponse.json(
      {
        msg: "Internal server error",
      },
      { status: 500 }
    );
  }
};
