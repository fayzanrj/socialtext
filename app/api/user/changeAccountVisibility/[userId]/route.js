import User from "@/models/userModel";
import { connectToDB } from "@/utilities/db";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export const PUT = async (req, { params }) => {
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

    // CHECKING IF USER EXISTS
    const userExists = await User.findById(params.userId).select("isPrivate");
    if (!userExists) {
      return NextResponse.json({ msg: "User not found" }, { status: 404 });
    }

    // CHANGING VISIBILITY
    const user = await User.findByIdAndUpdate(userExists.id, {
      isPrivate: !userExists.isPrivate,
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
        msg: `Account visibility changed to ${
          user.isPrivate ? "PUBLIC" : "PRIVATE"
        }`,
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
