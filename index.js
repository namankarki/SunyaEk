const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const userRoutes = require("./Routes/userRouter");
const vehicleRoutes = require("./Routes/vehicleRouter");
const PORT = process.env.PORT || 8080;

app.get("/test", (req, res) => {
  res.send("Hi I am working");
});

app.use(express.json());
app.use(bodyParser.json());
app.use(cors());
app.use("/user", userRoutes);
app.use("/vechicles", vehicleRoutes);

console.log(process.env.DATABASE_URL);

app.listen(PORT, () => {
  console.log(`The Server is Running on ${PORT}`);
});
