import User from "@/models/userModel";
import { connectToDB } from "@/utilities/db";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

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

    // IF DATA DOESNT COME TROUGH
    if (!params.userId) {
      return NextResponse.json({ msg: "Incomplete data" }, { status: 409 });
    }

    const user = await User.findById(params.userId).select(
      "-blockedBy -password -isVerified"
    );

    // IF NO USE FOUND
    if (!user) {
      return NextResponse.json({ msg: "Could not find user" }, { status: 404 });
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      {
        msg: "Internal server error",
      },
      { status: 500 }
    );
  }
};
