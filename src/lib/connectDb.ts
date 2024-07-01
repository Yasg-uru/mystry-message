import mongoose from "mongoose";
type ConnectionObject = {
  isConnected?: number;
};
const connection: ConnectionObject = {};
async function connectdb() {
  if (connection.isConnected) {
    console.log("Already connected to database");
    return;
  }
  try {
    const db = await mongoose.connect(process.env.MONGO_URI || "", {});
    connection.isConnected = db.connections[0].readyState;
    console.log("Database connected successfully");
  } catch (error) {
    console.log("failed to connect with database", error);
    process.exit(1);
  }
}
export default connectdb;