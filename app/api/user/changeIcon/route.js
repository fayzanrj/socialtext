import User from "@/models/userModel";
import { connectToDB } from "@/utilities/db";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export const PUT = async (req) => {
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

    const { userId, newIconUrl } = await req.json();

    if (!userId || !newIconUrl) {
      return NextResponse.json({ msg: "Incomplete data" }, { status: 409 });
    }

    const user = await User.findByIdAndUpdate(userId, {
      icon: newIconUrl,
    });

    if (!user) {
      return NextResponse.json(
        {
          msg: "Internal server error",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        msg: "Icon updated",
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
