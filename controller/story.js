const { verifyStory } = require("../middleware/VerifyToken");
const story = require("../model/story");
const user = require("../model/user");
const createStory = async (req, res) => {
  const slides = req.body;
  const userId = req.userId;
  if (!slides) {
    return res.status(400).send({
      message: "slides not present",
    });
  }
  try {
    const newStory = new story({ userId, slides });
    await newStory.save();
    res.send({
      status: 1,
      message: "Story Created Successfully",
    });
  } catch (error) {
    res.send({
      status: 0,
      message: "Error in story creation",
    });
    console.log("error from story Creation):" + error);
  }
};

const updateStory = async (req, res) => {
  try {
    const { storyId } = req.params;

    const isStory = await story.findOne({ _id: storyId });
    if (!isStory) {
      return res.status(400).send({
        message: "Error storyid",
      });
    }

    const slides = req.body;
    const userId = req.userId;
    if (!slides) {
      return res.status(400).send({
        message: "slides not present",
      });
    }
    isStory.slides = slides;
    await isStory.save();
    res.send("story updated successfully");
  } catch (error) {
    console.log("====================================");
    console.log("error in story updation", error);
    console.log("====================================");
  }
};

const getStorybyId = async (req, res) => {
  try {
    const { storyId } = req.params;
    const isStory = await story.findOne({ _id: storyId });
    if (!isStory) {
      return res.status(400).send({
        message: "Error storyid",
      });
    }
    res.send({
      success: true,
      story: isStory,
      likes: isStory?.likes?.length,
    });
  } catch (error) {
    console.log("====================================");
    console.log("error in story by id", error);
    console.log("====================================");
  }
};

const getAll = async (req, res) => {
  const token = req.headers["authorization"];
  const userId = verifyStory(token);
  const categoriesconsts = ["Food", "fitness", "fashion", "World", "medical"];
  const categories = req.query.categories; //this is the extra
  const page = parseInt(req.query.page) || 1;
  let cat = req.query.cat;
  let categoryFilter;
  let filter = {};
  let limit = 4 * page;
  if (categories) {
    categoryFilter = categories.replace(/[\[\]\"']/g, "").split(",");
    filter = { "slides.category": { $in: categoryFilter } };
  }
  //find for all categories just group them into category wise
  try {
    if (cat && cat.toLowerCase() === "all") {
      const groupStories = {};
      const storyLen = {};
      for (const item of categoriesconsts) {
        const stories = await story
          .find({
            slides: { $elemMatch: { category: item } },
          })
          .limit(limit);
        groupStories[item] = stories;

        const slen = await story.find({
          slides: { $elemMatch: { category: item } },
        });
        storyLen[item] = slen.length;
      }
      const myStory = await story.find({ userId: userId });
      groupStories["myStory"] = myStory;
      return res.send({
        storyData: groupStories,
        storyLength: storyLen,
      });
    }
  } catch (error) {
    console.log(error);
  }

  //if not all just return all the items that belong to the perticular category
  try {
    if (cat && cat.toLowerCase() !== "all") {
      const storybyCategory = await story
        .find({ "slides.category": cat })
        .limit(limit);
      return res.send({
        storyData: storybyCategory,
      });
    }
  } catch (error) {
    console.log("errrr", error);
  }

  //this is for if there is not any category present then it going to gave all data
  try {
    const allStory = await story.find({
      ...filter,
    });
    res.send({
      storyData: allStory,
    });
  } catch (error) {
    console.log("last", error);
  }
};

const likeStory = async (req, res) => {
  const { storyId, userId } = req.params;
  try {
    const isStory = await story.findOne({ _id: storyId });
    if (!isStory) {
      return res.status(400).send({
        message: "Error storyid",
      });
    }
    let likearr = isStory.likes;
    let flg = likearr.includes(userId);
    if (flg) {
      likearr = likearr.filter((item) => item !== userId);
    } else {
      likearr.push(userId);
    }

    await story.updateOne({ _id: storyId }, { $set: { likes: likearr } });
    res.status(200).send({ message: "Story liked successfully" });
  } catch (error) {
    res.status(500).send("error in story like ");
    console.log("====================================");
    console.log("error in story like by id:)", error);
    console.log("====================================");
  }
};

const bookmark = async (req, res) => {
  try {
    const data = req.body;
    const userId = req.userId;
    const isUser = await user.findOne({ _id: userId });
    if (!isUser) {
      return res.status(400).send("user doesnot exist");
    }
    let arr = isUser.bookmarks;
    let flg = false;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i]._id === data._id) {
        flg = true;
      }
    }
    if (flg) {
      arr = arr.filter((item) => item._id !== data._id);
    } else {
      arr.push(data);
    }

    await user.updateOne({ _id: userId }, { $set: { bookmarks: arr } });
    res.send({ message: "bookmarked Successfully" });
  } catch (error) {
    res.status(400).send({
      message: "error in bookmark creation",
    });
    console.log("====================================");
    console.log("error in story bookmark", error);
    console.log("====================================");
  }
};

const getBookmarks = async (req, res) => {
  try {
    const userId = req.userId;
    const isUser = await user.findOne({ _id: userId });
    if (!isUser) {
      return res.status(400).send("user doesnot exist");
    }
    const bookmarkData = isUser.bookmarks;
    res.send({
      bookmarks: bookmarkData,
    });
  } catch (error) {
    res.status(400).send({
      message: "error in bookmarks get",
    });
    console.log("====================================");
    console.log("error in story bookmark", error);
    console.log("====================================");
  }
};

module.exports = {
  createStory,
  getAll,
  updateStory,
  getStorybyId,
  likeStory,
  bookmark,
  getBookmarks,
};
