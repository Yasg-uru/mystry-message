import connectdb from "@/lib/connectDb";
import userModel from "@/models/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmails";
export async function POST(request: Request) {
  await connectdb();
  try {
    const { username, email, password } = await request.json();
    //finding the exisiting user with username and their verifystatus is true
    const existingVerifiedUserByUsername = await userModel.findOne({
      username,
      isVerified: true,
    });
    if (existingVerifiedUserByUsername) {
      return Response.json(
        {
          success: false,
          message: "Username already taken",
        },
        {
          status: 400,
        }
      );
    }

    const ExistingUserbyEmail = await userModel.findOne({ email });
    let verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    if (ExistingUserbyEmail) {
      if (ExistingUserbyEmail.isVerified) {
        Response.json(
          {
            success: false,
            message: "user already exist with this email",
          },
          {
            status: 400,
          }
        );
      } else {
        //user exist but their verification status is false
        ExistingUserbyEmail.password = await bcrypt.hash(password, 10);
        ExistingUserbyEmail.verifyCode = verifyCode;
        ExistingUserbyEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
        await ExistingUserbyEmail.save();
      }
    } else {
      //if user not exist then
      const hashedpassword = await bcrypt.hash(password, 10);
      const Expirydate = new Date();
      Expirydate.setHours(Expirydate.getHours() + 1);
      const newuser = new userModel({
        username,
        email,
        password: hashedpassword,
        verifyCode,
        verifyCodeExpiry: Expirydate,
        isVerified: false,
        isAcceptingMessage: true,
        message: [],
      });
      await newuser.save();
    }
    //sendverification email
    const emailResponse = await sendVerificationEmail(
      username,
      email,
      verifyCode
    );
    if (!emailResponse.success) {
      return Response.json(
        {
          success: false,
          message: emailResponse.message,
        },
        {
          status: 500,
        }
      );
    }
    return Response.json(
      {
        success: true,
        message: "User registered successfully. Please verify your account.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.log("Error registering user");
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
