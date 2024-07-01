import mongoose, { Schema, Document } from "mongoose";
export interface Message extends Document {
  content: string;
  createdAt: Date;
  // _id:string
}
const MessageSchema: Schema<Message> = new Schema({
  content: {
    type: String,
    required: [true, "please enter the content"],
  },
  createdAt: {
    type: Date,
    required: [true, "created At is mendetory"],
    default: Date.now,
  },
});

export interface User extends Document {
  username: string;
  email: string;
  password: string;
  verifyCode: string;
  isVerified: boolean;
  verifyCodeExpiry: Date;
  isAcceptingMessage: boolean;
  message: Message[];
}

const UserSchema: Schema<User> = new Schema({
  username: {
    type: String,
    trim: true,
    required: [true, "pleae enter user name"],
    unique: true,
  },
  email: {
    type: String,
    required: [true, "please enter email"],
    unique: true,
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "please enter valid email ",
    ],
  },
  password: {
    type: String,
    required: [true, "please enter password "],
    minlength: [5, "your password should be of atleast of 5 characters"],
  },
  verifyCode: {
    type: String,
    required: [true, "verify code is mendatory"],
  },
  verifyCodeExpiry: {
    type: Date,
    required: [true, "verify code expiry is required "],
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isAcceptingMessage: {
    type: Boolean,
    default: true,
  },
  message: [MessageSchema],
});

const userModel =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>("User", UserSchema);
export default userModel;
