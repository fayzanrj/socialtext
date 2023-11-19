import User from "@/models/userModel";
import { connectToDB } from "@/utilities/db";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import generateCode from "@/utilities/generateCode";
import sendEmail from "@/utilities/sendEmail";
import Code from "@/models/codeModel";
import { headers } from "next/headers";

export const POST = async (req) => {
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

    // DESTRUCTURING DATA FROM REQUEST BODY
    const { username, password, email } = await req.json();

    // CHECKING IF DATA CAME FROM REQUEST
    if (!username || !password || !email) {
      return NextResponse.json({ msg: "Incomplete data" }, { status: 409 });
    }

    // CHECKING IF A USER ALREADY EXISTS WITH THIS USERNAME
    const usernameExists = await User.findOne({ username: username.toLowerCase() });
    if (usernameExists) {
      return NextResponse.json(
        { msg: "Username already taken" },
        { status: 403 }
      );
    }

    // CHECKING IF A USER ALREADY EXISTS WITH THIS EMAIL
    const emailExists = await User.findOne({ email: email.toLowerCase() });
    if (emailExists) {
      return NextResponse.json(
        { msg: "Email is already in use" },
        { status: 403 }
      );
    }

    // HASHING PASSWORD
    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(password, salt);

    // CREATING USER
    const newUser = await User.create({
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      password: secPass,
    });

    // IF USER IS NOT CREATED
    if (!newUser) {
      return NextResponse.json(
        { msg: "Internal Server Error" },
        { status: 500 }
      );
    }

    // GENERATING VERIFICATION CODE
    const generatedCode = await generateCode();
    // IF CODE IS NOT GENERATED
    if(!generatedCode){
      return NextResponse.json({ msg: "Internal Server Error" }, { status: 500 });
    }

    // SENDING EMAIL WITH VERIFICATION CODE ON USER'S EMAIL
    const emailSent = await sendEmail(
      newUser.email,
      newUser.username,
      "Email Verification for Social Text",
      generatedCode
    );

    // SAVING GENERATED CODE IN DATABASE
    const code = await Code.create({
      userId: newUser.id,
      code: generatedCode,
    });

    // IF CODE IS NOT SAVED
    if(!code){
      return NextResponse.json({ msg: "Internal Server Error" }, { status: 500 });
    }

    // SENDING RESPONSE
    return NextResponse.json(
      { msg: "A verification code has been sent to your email. If you could not find the code, kindly check your spam." },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ msg: "Internal Server Error" }, { status: 500 });
  }
};
