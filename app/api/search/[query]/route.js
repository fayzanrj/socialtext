import User from "@/models/userModel";
import { connectToDB } from "@/utilities/db";
import { NextResponse } from "next/server";

export const GET = async (req, { params }) => {
  try {
    await connectToDB();
    const keyword = params.query
      ? {
          $or: [
            { username: { $regex: params.query, $options: "i" } },
            { email: { $regex: params.query, $options: "i" } },
          ],
        }
      : {};

    const users = await User.find(keyword, "username email icon id");
    // .find({
    //   id: { $ne: req.user._id },
    // });

    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({
      status: "failed",
      message: "Internal Server Error",
    });
  }
};
