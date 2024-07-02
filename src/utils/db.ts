import mongoose from "mongoose";


const connect = async () => {
  if (mongoose.connections[0].readyState) return;
  try {
    await (process.env.MONGODB_URL,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("connected successfully");
  } catch (error) {
    throw new Error("error connectiong mongodb");
  }
};
export default connect;
