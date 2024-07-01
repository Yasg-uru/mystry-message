import connectdb from "@/lib/connectDb";
import { z } from "zod";
import { usernamevalidation } from "@/schemas/signupSchema";
import userModel from "@/models/User";

const usernameQuerySchema = z.object({
  username: usernamevalidation,
});
export async function GET(request: Request) {
  await connectdb();
  try {
    const { searchParams } = new URL(request.url);
    const queryParams = {
      username: searchParams.get("username"),
    };
    const result = usernameQuerySchema.safeParse(queryParams);
    console.log("this is a zod validation of username:", result.error);
    if (!result.success) {
      const usernameErrors = result.error.format()._errors || [];
      return Response.json(
        {
          success: false,
          message:
            usernameErrors.length > 0
              ? usernameErrors.join(",")
              : "Invalid query parameters",
        },
        {
          status: 400,
        }
      );
    }
    const username = result.data;
    const ExistingVerifiedUser = await userModel.findOne({
      ...username,
      isVerified: true,
    });
    if (ExistingVerifiedUser) {
      return Response.json(
        {
          success: false,
          message: "Username is already taken",
        },
        {
          status: 400,
        }
      );
    }
    return Response.json(
      {
        success: false,
        message: "Username is available",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("Error username validation", error);
    return Response.json(
      {
        success: false,
        message: "Error checking username",
      },
      {
        status: 500,
      }
    );
  }
}
