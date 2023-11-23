import User from "@/models/userModel";
import { connectToDB } from "@/utilities/db";
import { NextResponse } from "next/server";

export const GET = async (request, { params }) => {
  try {
    await connectToDB();
    let query = {
      $and: [
        {
          $or: [
            { username: { $regex: params.query, $options: "i" } },
            { email: { $regex: params.query, $options: "i" } },
          ],
        },
        { isPrivate: false },
      ],
    };

    const users = await User.find(query, "username email icon hasBlocked");

    return NextResponse.json({ users }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ msg: "Internal Server Error" }, { status: 500 });
  }
};
