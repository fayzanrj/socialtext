import Code from "@/models/codeModel";
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

    // DESTRUCTURING
    const { verificationCode, username } = await req.json();

    // IF DATA DOESNT COME THROUGH
    if (!verificationCode || !username) {
      return NextResponse.json({ msg: "Invalid Code" }, { status: 400 });
    }

    // FINDING CODE IN DATABASE
    const CodeInDB = await Code.findOne({ code: verificationCode });
    const user = await User.findOne({ username: username });


    // IF CODE IS NOT FOUND IN DATABASE
    if (!CodeInDB || !user || CodeInDB.userId.toString() !== user._id.toString()) {
      return NextResponse.json(
        {
          msg: "Invalid Code",
        },
        { status: 400 }
      );
    }

    // UPDATING ISVERIFIED
    const updatedUser = await User.findByIdAndUpdate(CodeInDB.userId, {
      isVerified: true,
    });
    if (!updatedUser) {
      return NextResponse.json(
        { msg: "Internal Server Error" },
        { status: 500 }
      );
    }

    // DELETING CODE BECAUSE IT IS USLESS NOW
    const CodeDeleted = await Code.findByIdAndDelete(CodeInDB.id);
    if (!CodeDeleted) {
      return NextResponse.json(
        { msg: "Internal Server Error" },
        { status: 500 }
      );
    }

    // RESPONSE
    return NextResponse.json(
      {
        msg: `Congratulations ${user.username}, your account has been verified.`,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error)
    return NextResponse.json({ msg: "Internal Server Error" }, { status: 500 });
  }
};
