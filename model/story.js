const mongoose = require("mongoose");

const storySchema = new mongoose.Schema({
  userId: {
    type: mongoose.ObjectId,
    required: true,
  },
  slides: [
    {
      heading: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
      imageUrl: {
        type: String,
        required: true,
      },
      category: {
        type: String,
        required: true,
      },
    },
  ],
  likes: [
    {
      userid: {
        type: mongoose.ObjectId,
      },
    },
  ],
});

const story = mongoose.model("story", storySchema);

module.exports = story;
