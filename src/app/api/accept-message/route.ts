import userModel from "@/models/User";
import connectdb from "@/lib/connectDb";
import { getServerSession } from "next-auth";
import { User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
export async function POST(request: Request) {
  await connectdb();
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;
  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "user not authenticated",
      },
      {
        status: 401,
      }
    );
  }
  const userId = user._id;
  try {
    const { acceptMessages } = await request.json();
    const Updateduser = await userModel.findByIdAndUpdate(
      userId,
      {
        isAcceptingMessage: acceptMessages,
      },
      {
        new: true,
      }
    );
    if (!Updateduser) {
      return Response.json(
        {
          success: false,
          message: "Unable to find user to update message acceptance status",
        },
        {
          status: 404,
        }
      );
    }
    return Response.json({
      success: true,
      message: "Message acceptance status updated successfully",
      Updateduser,
    },{status:200});
  } catch (error) {
    console.log("Error updating message acceptance status", error);
    return Response.json(
      {
        success: true,
        message: "Error updating message acceptance status",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;
  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "Not authenticated",
      },
      { status: 400 }
    );
  }
  try {
    const foundUser = await userModel.findById(user._id);
    if (!foundUser) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }
    return Response.json(
      {
        success: true,
        isAcceptingMessages: foundUser.isAcceptingMessage,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error retrieving message acceptance status:", error);
    return Response.json(
      { success: false, message: "Error retrieving message acceptance status" },
      { status: 500 }
    );
  }
}
