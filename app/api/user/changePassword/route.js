import { connectToDB } from "@/utilities/db";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/models/userModel";
import { headers } from "next/headers";

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
    const { userId, oldPass, newPass } = await req.json();

    // IF DATA DOESNT COME THROUGH
    if ((!userId || !oldPass || !newPass)) {
      return NextResponse.json({ msg: "Incomplete data" }, { status: 409 });
    }

    // CHECKING IF USER EXISTS
    const userExists = await User.findById(userId).select("password");
    if (!userExists) {
      return NextResponse.json({ msg: "User not found" }, { status: 404 });
    }


    // CHECKING IF OLD PASSWORD MATCHES
    const verifyPass = bcrypt.compareSync(oldPass, userExists.password);
    if (!verifyPass) {
      return NextResponse.json({ msg: "Wrong old password" }, { status: 409 });
    }

    // HASHING PASSWORD
    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(newPass, salt);

    const user = await User.findByIdAndUpdate(userExists.id, {
      password: secPass,
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
        msg: "Password Changed successfully",
      },
      { status: 200 }
    );
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
