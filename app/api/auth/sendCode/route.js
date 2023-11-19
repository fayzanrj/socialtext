import { connectToDB } from "@/utilities/db";
import { NextResponse } from "next/server";
import generateCode from "@/utilities/generateCode";
import Code from "@/models/codeModel";
import sendEmail from "@/utilities/sendEmail";
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

    // DESTRUCTURING
    const { email, username, id } = await req.json();

    // IF DATA DOESNT COME THROUGH
    if (!email || !username || !id) {
      return NextResponse.json({ msg: "Incomplete data" }, { status: 403 });
    }

    const generatedCode = await generateCode();
    if (!generateCode) {
      return NextResponse.json({ msg: "Some Error Occured" }, { status: 500 });
    }

    const emailSent = await sendEmail(
      email,
      username,
      "Email Verification for Social Text",
      generatedCode
    );

    // IF EMAIL IS SENT
    if (!emailSent) {
      return NextResponse.json({ msg: "Some Error Occured" }, { status: 500 });
    }

    // UPDATING VERIFICATION CODE IN DATABASE
    const code = await Code.findOneAndUpdate(
      {
        userId: id,
      },
      {
        code: generatedCode,
      }
    );

    if (!code) {
      await Code.create({
        userId: id,
        code: generatedCode,
      });
      await sendEmail(
        email,
        username,
        "Email Verification for Social Text",
        generatedCode
      );
    }

    // RETURNING RESPONSE
    return NextResponse.json({
      msg: "A verification code has been sent to your provided email address. Kindly verify your identity and then log in",
    },{status : 200});
  } catch (error) {
    console.log(error)
    return NextResponse.json({ msg: "Internal Server Error" }, { status: 500 });
  }
};
