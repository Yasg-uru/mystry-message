import connectdb from "@/lib/connectDb";
import userModel from "@/models/User";

export async function GET(
  request: Request,
  { params }: { params: { pagenumber: number } }
) {
  await connectdb();
  try {
    const { pagenumber } = params;
    console.log("this is pagenumber:",pagenumber);
    // const allUsers = await userModel.find({});
    // console.log("this is a page number ");
    // if (allUsers.length==0) {
    //   return Response.json({
    //     success: false,
    //     message: "User not found",
    //   });
    // }

    // if users then we need to use the pagination method bacause user is existed more
    const TotalDocuments = await userModel.countDocuments({});
    const Totalpages = TotalDocuments / 10;
    const hasNextpage = Totalpages > pagenumber;

    //after that we need to create a logic of skip
    const skip = (pagenumber - 1) * 10;
    const result = await userModel.find({}).skip(skip).limit(10);
    if (result.length == 0) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }
    return Response.json({
      success: true,
      message: "successfully fetched users",
      result,
      hasNextpage,
      Totalpages,
    });
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
