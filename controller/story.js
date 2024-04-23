const story = require("../model/story");

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
    isStory.slides=slides
    await isStory.save()
   res.send("story updated successfully")

  } catch (error) {
    console.log("====================================");
    console.log("error in story updation",error);
    console.log("====================================");
  }
};

const getStorybyId= async(req,res)=>{
  try {
    const { storyId } = req.params;
    const isStory = await story.findOne({ _id: storyId });
    if(!isStory){
      return res.status(400).send({
        message: "Error storyid",
      });
    }
    res.send({
      success:true,
      story:isStory
    })
  } catch (error) {
    console.log('====================================');
    console.log("error in story by id",error);
    console.log('====================================');
  }

}

const getAll = async (req, res) => {
  const categoriesconsts = ["Food", "fitness", "fashion", "World", "medical"];
  const categories = req.query.categories;
  const page = parseInt(req.query.page) || 1;
  let cat = req.query.cat;
  // console.log(cat);
  //removing unnessary things
  // cat=cat.replace(/[\[\]\"']/g, "")
  // console.log(cat);
  let categoryFilter;
  let filter = {};
  let limit = 4 * page;
  // const token = req.headers["authorization"];
  if (categories) {
    categoryFilter = categories.replace(/[\[\]\"']/g, "").split(",");
    filter = { "slides.category": { $in: categoryFilter } };
  }
  //find for all categories just group them into category wise
  try {
    if (cat && cat.toLowerCase() === "all") {
      console.log("ss", cat);
      const groupStories = {};
      for (const item of categoriesconsts) {
        const stories = await story
          .find({
            slides: { $elemMatch: { category: item } },
          })
          .limit(limit);
        groupStories[item] = stories;
      }
      return res.send({
        storyData: groupStories,
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
module.exports = { createStory, getAll,updateStory ,getStorybyId};
