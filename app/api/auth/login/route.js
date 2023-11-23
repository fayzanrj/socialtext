import User from "@/models/userModel";
import { connectToDB } from "@/utilities/db";
import bcrypt from "bcryptjs";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export const POST = async (req) => {
  try {
    // GETTING HEADERS
    const headersList = headers();
    const referer = headersList.get("api_key");

    // CHECKING IF API KEY MATCHES
    if (referer !== process.env.API_KEY) {
      console.log(referer)
      return NextResponse.json(
        {
          msg: "Not authorized",
        },
        { status: 401 }
      );
    }
    await connectToDB();

    // DESTRUCTING DATA FROM REQUEST
    const { userDetail, password } = await req.json();

    // CHECKING IF DATA CAME THROUGH
    if (!userDetail || !password) {
      return NextResponse.json({ msg: "Invalid credentials" }, { status: 403 });
    }

    // FINDING USER WITH USERNAME OR EMAIL
    let user = await User.findOne({
      $or: [
        { username: userDetail.toLowerCase() },
        { email: userDetail.toLowerCase() },
      ],
    });
    // IF USER NOT FOUND
    if (!user) {
      return NextResponse.json({ msg: "Invalid credentials" }, { status: 403 });
    }

    // MATCHING PASSWORDS
    const credentialsMatch = bcrypt.compareSync(password, user.password);

    // IF PASSWORD DOESN'T MATCH
    if (!credentialsMatch) {
      return NextResponse.json({ msg: "Invalid credentials" }, { status: 403 });
    }

    // DEPOPULATING PASSWORD
    const userWithDetails = await User.findById(user.id).select(
      "-password -createdAt -updatedAt"
    );

    // SENDNG DATA
    return NextResponse.json(
      {
        user: userWithDetails,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ msg: "Internal Server Error" }, { status: 500 });
  }
};
