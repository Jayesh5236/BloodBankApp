import mongoose from "mongoose";
import colors from "colors";

async function dbConnect() {
 try {
    await mongoose.connect(process.env.MONGO_URL)
    console.log(`Connected To MONGODB Database ${mongoose.connection.host}`.bgYellow.white);
 } catch (error) {
    console.log(`Mongodb Database Error ${error}`.bgRed.white);
 }
  }
export default dbConnect;
