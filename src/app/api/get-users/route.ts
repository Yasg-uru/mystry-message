import connectdb from "@/lib/connectDb";
import userModel from "@/models/User";
export async function GET(request: Request) {
  await connectdb();

  try {
    const { searchParams } = new URL(request.url);
    const params = searchParams.get("pagenumber");
    const pagenumber = params ? parseInt(params) : 1;

    if (pagenumber < 1) {
      return Response.json(
        {
          success: false,
          message: "please give me pagenumber",
        },
        { status: 404 }
      );
    }
    const pagesize: number = 2;
    const TotalDocuments = await userModel.countDocuments({ isVerified: true });
    const skip: number = (pagenumber - 1) * pagesize;
    const users = await userModel
      .find({ isVerified: true })
      .skip(skip)
      .limit(pagesize);
    if (userModel.length === 0) {
      return Response.json(
        {
          success: false,
          message: "user not found",
        },
        { status: 404 }
      );
    }
    console.log("this is skip", skip, pagenumber);
    //calculating the totalpages
    const Totalpages = Math.ceil(TotalDocuments / pagesize);
    const hasNextpage: boolean = pagenumber < Totalpages;
    const namesArray = users.map((user) => user.username);

    return Response.json(
      {
        success: true,
        message: "successfully fetched usernames",
        namesArray,
        hasNextpage,
        Totalpages,
        TotalDocuments,
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "internal server error",
      },
      { status: 500 }
    );
  }
}
