import Chat from "@/models/chatModel";
import Message from "@/models/msgModel";
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

    // IF DATA DOESNT COME THROUGH
    if (!params.chatId) {
      return NextResponse.json({ msg: "Incomplete data" }, { status: 409 });
    }

    console.log(params.chatId);
    const msgs = await Message.find({
      chatId: params.chatId,
    })
      .populate("sender", "username icon")
      .populate("readBy", "username");
    console.log(msgs);
    // const chat = await Chat.findById(params.chatId).populate(
    //   "chatUsers -password"
    // );

    return NextResponse.json(
      {
        messages: msgs,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error.messageu);
    return NextResponse.json(
      {
        msg: "Internal server error",
      },
      { status: 500 }
    );
  }
};
