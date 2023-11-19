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
    const sentBy = searchParams.get("sentBy");
    const sentTo = searchParams.get("sentTo");

    // IF DATA DOESNT COME THROUGH
    if (!sentBy || !sentTo) {
      return NextResponse.json({ msg: "Incomplete data" }, { status: 409 });
    }

    // CHECKING IS USER EXISTS
    const sentByExists = await User.findById(sentBy);
    if (!sentByExists) {
      return NextResponse.json({ msg: "No user found" }, { status: 404 });
    }

    // CHECKING IS USER EXISTS
    const sentToExists = await User.findById(sentTo);
    if (!sentToExists) {
      return NextResponse.json({ msg: "No user found" }, { status: 404 });
    }


    // DELETING REQUEST IN THE DB OF THE USER WHO SENT IT
    const userRequested = await User.findByIdAndUpdate(sentBy, {
      $pull: { hasRequested: sentTo },
    });

    if (!userRequested) {
      return NextResponse.json(
        { msg: "Internal Server Error" },
        { status: 500 }
      );
    }

    // DELETING REQUEST IN THE DB OF THE USER WHO HAS BEEN REQUESTED
    const userRequestedTo = await User.findByIdAndUpdate(sentTo, {
      $pull: { requestedBy: sentBy },
    });

    if (!userRequestedTo) {
      return NextResponse.json(
        { msg: "Internal Server Error" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { msg: "Request has been deleted" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ msg: "Internal Server Error" }, { status: 500 });
  }
};
