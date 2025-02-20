import { connect } from "mongoose";

const connectDB = async () => {
  try {
    await connect("mongodb+srv://motupallisnmsdurgapramod531:WKchtXvV2bZpwLth@squidgame.ntfvz.mongodb.net/?retryWrites=true&w=majority&appName=SquidGame", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB Connected!");
  } catch (err) {
    console.error("MongoDB Connection Failed:", err);
    process.exit(1);
  }
};

export default connectDB;
