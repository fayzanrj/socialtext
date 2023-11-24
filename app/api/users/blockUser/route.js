import { headers } from "next/headers";
import { connectToDB } from "@/utilities/db";
import { NextResponse } from "next/server";
import User, { findByIdAndUpdate } from "@/models/userModel";

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

    // DESTRUCTURING
    const { blocked, blockedBy } = await req.json();

    // IF DATA DOESNT COME THROUGH
    if (!blocked || !blockedBy) {
      return NextResponse.json({ msg: "Incomplete data" }, { status: 409 });
    }

    // CHECKING IF USER EXISTS
    const blockedUser = await User.findById(blocked);
    if (!blocked) {
      return NextResponse.json({ msg: "No user found" }, { status: 404 });
    }

    // CHECKING IF USER EXISTS
    const blockedByUser = await User.findById(blockedBy);
    if (!blockedBy) {
      return NextResponse.json({ msg: "No user found" }, { status: 404 });
    }

    // ADDING USER ID IN THE DB OF THE USER WHO BLOCKED
    const updatedUser = await User.findByIdAndUpdate(blockedBy, {
      $addToSet: { hasBlocked: blocked },
      $pull: { friends: blocked , hasRequested: blocked ,requestedBy: blocked},
    });

    if (!updatedUser) {
      return NextResponse.json(
        { msg: "Internal Server Error" },
        { status: 500 }
      );
    }

    // ADDING USER IN THE DB OF THE USER WHO HAS BEEN BLOCKED
    const userBlocked = await User.findByIdAndUpdate(blocked, {
      $addToSet: { blockedBy: blockedBy },
      $pull: { friends: blockedBy, hasRequested: blockedBy ,requestedBy: blockedBy },
    });

    if (!userBlocked) {
      return NextResponse.json(
        { msg: "Internal Server Error" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { msg: `${userBlocked.username} has been blocked` },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ msg: "Internal Server Error" }, { status: 500 });
  }
};
