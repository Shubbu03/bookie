const express = require("express");
const dotenv = require("dotenv");
const { mongoose } = require("mongoose");
const cors = require("cors");
dotenv.config();
const app = express();
const { userRoutes } = require("./routes/user.routes");

app.use(cors());
app.use(express.json());

app.use("/user", userRoutes);

async function main() {
  const isConnected = await mongoose.connect(process.env.MONGODB_URI);

  if (isConnected) {
    console.log(`DB Connected`);
    app.listen(process.env.PORT, () => {
      console.log(`Server started on port: ${process.env.PORT}`);
    });
  } else {
    console.log(`Error occured while connecting to db`);
  }
}

main();
