// import { resend } from "@/lib/resend";
// export async function sendVerificationEmail(
//   username: string,
//   email: string,
//   verifyCode: string
// ): Promise<ApiResponse> {
//   try {
//     console.log("this is email details:",username,email,verifyCode)
//     const emailres=await resend.emails.send({
//       from: "yashpawar12122004@gmail.com",
//       to: email,
//       subject: "Mystry Message Verification Code",
//       react: VerificationEmail({ username, otp: verifyCode }),
//     });
//     console.log("email sent successfully",emailres);
//     return { success: true, message: "Verification Email sent Successfully" };
//   } catch (error) {
//     console.log("Error in sending verification code email");
//     return {
//       success: false,
//       message: "Failed to send verification email",
//     };
//   }
// }

import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";
import nodemailer from "nodemailer";
//after importing this we need to create a transporter 
const Transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  // service: process.env.SMPT_SERVICE,
  service: "yashpawar12122004@gmail.com",
  auth: {
    user: "yashpawar12122004@gmail.com",
    // user: process.env.SMPT_MAIL,
    pass: "nwxb yuwl uioz dzkc",
    // pass: 'yash1212204',
  },
});
export async function sendVerificationEmail(username:string ,email:string,verifyCode:string):Promise<ApiResponse>{
  try {
    const mailoptions={
      from:"yashpawar12122004@gmail.com",
      to:email,
      subject:"Mystry message verification code ",
      // react:VerificationEmail({username,otp:verifyCode})
      text:`your verification code is ${verifyCode} for username :${username}`
    }
    await Transporter.sendMail(mailoptions);
    return {
      success:true,
      message:"Verification email sent successfully"
    }
  } catch (error) {
    console.log("Error in sending verification code email");
    return {
      success: false,
      message: "Failed to send verification email",
    };
  }
}
