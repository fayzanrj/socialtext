import User from "@/models/userModel";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { connectToDB } from "@/utilities/db";

export const GET = async (req, { params }) => {
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

    const userId = await params.userId;

    // CHECING IF USER EXISTS
    const user = await User.findById(userId).populate({
      path: "hasBlocked",
      select: "email icon username",
    }).sort({ updatedAt: -1 });;

    if (!user) {
      return NextResponse.json(
        { msg: "No user found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ blocked: user.hasBlocked }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ msg: "Internal Server Error" }, { status: 500 });
  }
};
