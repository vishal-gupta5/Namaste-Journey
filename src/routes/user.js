const express = require("express");
const { userAuth } = require("../middleware/auth");
const ConnectionRequest = require("../models/connectionRequest");
const userRouter = express.Router();

const USER_SAFE_DATA = "firstName lastName";

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", USER_SAFE_DATA);

    res.json({
      message: `Fetched Requests Successfully!`,
      data: connectionRequests,
    });
  } catch (err) {
    return res.status(401).json({ message: `Error: ${err.message}` });
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" }, 
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
    }).populate("fromUserId", USER_SAFE_DATA);

    const data = await connectionRequests.map((row) => row.fromUserId);
    res.json({ data });
  } catch (err) {
    return res.status(400).json({ message: `Error: ${err.message}` });
  }
});

module.exports = userRouter;
