import { headers } from "next/headers";
import { connectToDB } from "@/utilities/db";
import { NextResponse } from "next/server";
import User from "@/models/userModel";

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

    // DESTRUCTING DATA FROM REQUEST
    const { sentBy, sentTo } = await req.json();

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

    // CHECKING IF REQUEST IS SENT ALREADY
    if (sentByExists.hasRequested.includes(sentTo)) {
      return NextResponse.json(
        { msg: "Request has already been sent" },
        { status: 200 }
      );
    }

    // CHECKING IF REQUESTED USER HAS SENT TO THE USER
    if (sentToExists.hasRequested.includes(sentBy)) {
      const userRequested = await User.findByIdAndUpdate(sentBy, {
        $addToSet: { requestedBy: sentTo },
      });
      return NextResponse.json(
        {
          msg: "This user has sent you request already. If you cannot find the request try blocking then unblocking the person",
        },
        { status: 200 }
      );
    }

    // ADDING REQUEST IN THE DB OF THE USER WHO SENT IT
    const userRequested = await User.findByIdAndUpdate(sentBy, {
      $addToSet: { hasRequested: sentTo },
    });

    if (!userRequested) {
      return NextResponse.json(
        { msg: "Internal Server Error" },
        { status: 500 }
      );
    }

    // ADDING REQUEST IN THE DB OF THE USER WHO HAS BEEN REQUESTED
    const userRequestedTo = await User.findByIdAndUpdate(sentTo, {
      $addToSet: { requestedBy: sentBy },
    });

    if (!userRequestedTo) {
      return NextResponse.json(
        { msg: "Internal Server Error" },
        { status: 500 }
      );
    }

    return NextResponse.json({ msg: "Request Sent" }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ msg: "Internal Server Error" }, { status: 500 });
  }
};
