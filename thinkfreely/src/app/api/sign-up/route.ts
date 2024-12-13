import dbConnect from "@/app/lib/dbConnect";
import UserModel from "@/app/model/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/app/helpers/sendVerificationemail";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, email, password } = await request.json();
    const existingUserVerificationByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingUserVerificationByUsername) {
      return Response.json(
        {
          sucess: false,
          message: "Username is already taken",
        },
        { status: 400 }
      );
    }
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    const existingUserByEmail = await UserModel.findOne({ email });
    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return Response.json(
          {
            sucess: false,
            message: "User already exists with this email",
          },
          { status: 401 }
        );
      } else {
        const hashPassword = await bcrypt.hash(password, 10);
        existingUserByEmail.password = hashPassword;
        existingUserByEmail.verifyCode = verifyCode;
        existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
        await existingUserByEmail.save();
      }
    } else {
      const hashPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
      const newUser = new UserModel({
        username,
        email,
        password: hashPassword,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
        isAcceptingMessage: true,
        messages: [],
      });
      await newUser.save();
    }
    //send verification code
    const emailResponse = await sendVerificationEmail(
      email,
      username,
      verifyCode
    );
    if (!emailResponse.sucess) {
      return Response.json(
        {
          sucess: false,
          message: emailResponse.message,
        },
        { status: 500 }
      );
    } else {
      return Response.json(
        {
          sucess: true,
          message: "User registered sucessfully . Please verify your email",
        },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error("Error registering user", error);
    return Response.json(
      {
        success: false,
        message: "Error registering user",
      },
      {
        status: 500,
      }
    );
  }
}
