const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

mongoose.connect(process.env.MONGODB_URI);

const bookmarkSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^(ftp|http|https):\/\/[^ "]+$/.test(v);
      },
      message: (props) => `${props.value} is not a valid URL!`,
    },
  },
  isFavourite: {
    type: Boolean,
    default: false,
  },
});

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (v) {
        return /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/.test(v);
      },
      message: (props) => `${props.value} is not a valid email!`,
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  bookmark: [bookmarkSchema],
});


const userModel = mongoose.model("User", userSchema, "bookmark-user");
const bookmarkModel = mongoose.model(
  "Bookmark",
  bookmarkSchema,
  "bookmark-book"
);

module.exports = {
  userModel,
  bookmarkModel,
};
