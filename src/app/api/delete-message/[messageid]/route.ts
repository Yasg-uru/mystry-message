import connectdb from "@/lib/connectDb";
import { User, getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import userModel from "@/models/User";

export async function DELETE(
  request: Request,
  { params }: { params: { messageid: string } }
) {
  await connectdb();
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;
  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "Not authenticated",
      },
      {
        status: 400,
      }
    );
  }
  const messageid = params.messageid;

  try {
    const updatedUser = await userModel.updateOne(
      {
        _id: user._id,
      },
      {
        $pull: { message: { _id: messageid } },
      }
    );
    if (updatedUser.modifiedCount === 0) {
      return Response.json(
        {
          success: false,
          message: "Message not found or already deleted",
        },
        { status: 404 }
      );
    }
    return Response.json(
      {
        success: true,
        message: "Message deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error deleting message");
    return Response.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
