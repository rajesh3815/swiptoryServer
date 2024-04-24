const express = require("express");
const { verifyToken } = require("../middleware/VerifyToken");
const {
  createStory,
  getAll,
  updateStory,
  getStorybyId,
  likeStory,
  bookmark,
  getBookmarks,
} = require("../controller/story");
const storyRouter = express.Router();

storyRouter.post("/create", verifyToken, createStory);
storyRouter.get("/getAllstory", getAll);
storyRouter.get("/getStoryById/:storyId", getStorybyId);
storyRouter.put("/update/:storyId", verifyToken, updateStory);
storyRouter.put("/likedStory/:storyId/:userId", verifyToken, likeStory);
storyRouter.put("/bookmarkStory", verifyToken, bookmark);
storyRouter.get("/getBookmarks", verifyToken, getBookmarks);

module.exports = storyRouter;
