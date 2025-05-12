require("dotenv").config();

// express 모듈 셋팅
const express = require("express");
const app = express();

app.listen(process.env.PORT);

// user-demo
const userRouter = require("./routes/users");
// channel-demo
const channelRouter = require("./routes/channels");

app.use("/", userRouter);
app.use("/channels", channelRouter);
