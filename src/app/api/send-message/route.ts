import connectdb from "@/lib/connectDb";
import userModel, { Message } from "@/models/User";

export async function POST(request: Request) {
  await connectdb();
  try {
    const { username, content } = await request.json();
console.log("this is request data :",username,content)
    const user = await userModel.findOne({ username });
    console.log("this is user :",user)
    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    if (!user.isAcceptingMessage) {
      return Response.json(
        {
          success: false,
          message: "User is not accepting messages",
        },
        { status: 400 }
      );
    }
    const newMessage = { content, createdAt: new Date() };
    user.message.push(newMessage as Message);
    await user.save();
    return Response.json(
      {
        success: true,
        message: "successfully sent message",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error send message");
    return Response.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
