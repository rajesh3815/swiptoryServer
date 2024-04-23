const express = require("express");
const { verifyToken } = require("../middleware/VerifyToken");
const { createStory, demo, getAll, updateStory, getStorybyId } = require("../controller/story");
const storyRouter = express.Router();

storyRouter.post("/create", verifyToken, createStory);
storyRouter.get("/getAllstory", getAll);
storyRouter.get("/getStoryById/:storyId",getStorybyId)
storyRouter.put('/update/:storyId',verifyToken,updateStory)

module.exports = storyRouter;
