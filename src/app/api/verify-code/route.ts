import connectdb from "@/lib/connectDb";
import userModel from "@/models/User";

export async function POST(request: Request) {
  await connectdb();
  try {
    const { username, code } = await request.json();
    const user = await userModel.findOne({
      username,
    });
    if (!user) {
      return Response.json({
        success: false,
        message: "user not found with this username",
      });
    }
    const isValidCode = user.verifyCode === code;
    const isNotCodeExpired = new Date(user.verifyCodeExpiry) > new Date();
    if (isValidCode && isNotCodeExpired) {
      user.isVerified = true;
      await user.save();
      return Response.json(
        {
          success: true,
          message: "your account has been successfully verified",
        },
        { status: 200 }
      );
    } else if (!isNotCodeExpired) {
      //code is expired
      return Response.json(
        {
          success: false,
          message:
            "Verification code has expired. Please sign up again to get a new code.",
        },
        { status: 400 }
      );
    } else {
      return Response.json(
        {
          success: false,
          message: "Incorrect verification code.",
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error verifying user", error);
    return Response.json(
      {
        success: false,
        message: "Error verifying user",
      },
      { status: 500 }
    );
  }
}
