import { headers } from "next/headers";
import { connectToDB } from "@/utilities/db";
import { NextResponse } from "next/server";
import User, { findByIdAndUpdate } from "@/models/userModel";

export const DELETE = async (req) => {
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

    // DESTRUCTING DATA FROM URL
    const { searchParams } = new URL(req.url);
    const removedBy = searchParams.get("removedBy");
    const removed = searchParams.get("removed");

    // IF DATA DOESNT COME THROUGH
    if (!removedBy || !removed) {
      return NextResponse.json({ msg: "Incomplete data" }, { status: 409 });
    }

    // CHECKING IS USER EXISTS
    const removedByExists = await User.findById(removedBy);
    if (!removedByExists) {
      return NextResponse.json({ msg: "No user found" }, { status: 404 });
    }

    // CHECKING IS USER EXISTS
    const removedExists = await User.findById(removed);
    if (!removedExists) {
      return NextResponse.json({ msg: "No user found" }, { status: 404 });
    }

    // DELETING REQUEST IN THE DB OF THE USER WHO SENT IT
    const userRemovedBy = await User.findByIdAndUpdate(removedBy, {
      $pull: { friends: removed },
    });

    if (!userRemovedBy) {
      return NextResponse.json(
        { msg: "Internal Server Error" },
        { status: 500 }
      );
    }

    // DELETING REQUEST IN THE DB OF THE USER WHO HAS BEEN REQUESTED
    const userRemoved = await User.findByIdAndUpdate(removed, {
      $pull: { friends: removedBy },
    });

    if (!userRemoved) {
      return NextResponse.json(
        { msg: "Internal Server Error" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { msg: `${userRemoved.username} has been removed` },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ msg: "Internal Server Error" }, { status: 500 });
  }
};
