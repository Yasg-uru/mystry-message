import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";
export async function sendVerificationEmail(
  username: string,
  email: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    console.log("this is email details:",username,email,verifyCode)
    const emailres=await resend.emails.send({
      from: "yashpawar12122004@gmail.com",
      to: email,
      subject: "Mystry Message Verification Code",
      react: VerificationEmail({ username, otp: verifyCode }),
    });
    console.log("email sent successfully",emailres);
    return { success: true, message: "Verification Email sent Successfully" };
  } catch (error) {
    console.log("Error in sending verification code email");
    return {
      success: false,
      message: "Failed to send verification email",
    };
  }
}
