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

    // DESTRUCTING DATA FROM REQUEST
    const { acceptedBy, sentBy } = await req.json();

    // IF DATA DOESNT COME THROUGH
    if (!acceptedBy || !sentBy) {
      return NextResponse.json({ msg: "Incomplete data" }, { status: 409 });
    }

    // CHECKING IF USER EXISTS
    const acceptedByUser = await User.findById(acceptedBy);
    if (!acceptedByUser) {
      return NextResponse.json({ msg: "No user found" }, { status: 404 });
    }

    // CHECKING IF USER EXISTS
    const sentByUser = await User.findById(sentBy);
    if (!sentByUser) {
      return NextResponse.json({ msg: "No user found" }, { status: 404 });
    }

    // ADDING REQUEST IN THE DB OF THE USER WHO SENT IT
    const updatedUser = await User.findByIdAndUpdate(sentBy, {
      $addToSet: { friends: acceptedBy },
      $pull : {hasRequested : acceptedBy}
    });

    if (!updatedUser) {
      return NextResponse.json(
        { msg: "Internal Server Error" },
        { status: 500 }
      );
    }

    // ADDING REQUEST IN THE DB OF THE USER WHO HAS BEEN REQUESTED
    const userAccepted = await User.findByIdAndUpdate(acceptedBy, {
      $addToSet: { friends: sentBy },
      $pull : {requestedBy : sentBy}
    });

    if (!userAccepted) {
      return NextResponse.json(
        { msg: "Internal Server Error" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { msg: "Request has been accepted" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ msg: "Internal Server Error" }, { status: 500 });
  }
};
