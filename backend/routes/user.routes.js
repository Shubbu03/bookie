const { Router } = require("express");
const userRoutes = Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { userMiddleware } = require("../middlewares/user.middleware");
const { userModel } = require("../schemas/user.model");

const encrytPass = (password) => {
  return bcrypt.hash(password, 10);
};

//AUTHENTICATION

userRoutes.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(401).json({
        message: "All fields are required !!",
      });
    }

    let hashedPassword = await encrytPass(password);

    const user = new userModel({
      email,
      password: hashedPassword,
    });

    await user.save();

    return res.json({
      message: "New user signed up successfully!!",
      data: user,
    });
  } catch (error) {
    return res.status(401).json({
      message: "Error occured while signing up",
      error: error,
    });
  }
});

userRoutes.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(403).json({
        message: "Incorrect credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      const token = jwt.sign(
        {
          id: user._id.toString(),
        },
        process.env.JWT_SECRET
      );

      res.status(201).json({
        message: "User signed in successfully",
        token,
      });
    } else {
      res.status(403).json({
        message: "Incorrect credentials",
      });
    }
  } catch (error) {
    res.status(401).json({
      message: "Error occurred while signing in",
      error: error,
    });
  }
});

//CRUD BOOKMARK

userRoutes.post("/add-bookmark", userMiddleware, async (req, res) => {
  try {
    const { title, url } = req.body;
    const userId = req.userId;

    const user = await userModel.findById({
      _id: userId,
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!title || !url) {
      res.status(402).json({ message: "All fields are required" });
    }

    const data = user.bookmark.push({
      title: title,
      url: url,
    });

    if (!data) {
      res.status(402).json({ message: "Error adding bookmark" });
    }

    await user.save();

    res.status(201).json({
      message: "Bookmark added",
      data: user.bookmark,
    });
  } catch (error) {
    res.status(401).json({
      message: "Error occured while adding bookmark",
      error: error,
    });
  }
});

userRoutes.get("/view-bookmark", userMiddleware, async (req, res) => {
  try {
    const userId = req.userId;

    const user = await userModel.findById({
      _id: userId,
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const data = user.bookmark;

    if (!data || !data.length) {
      return res.status(404).json({ message: "No bookmarks found" });
    }

    res.status(201).json({
      message: "Bookmarks fetched",
      data: data,
    });
  } catch (error) {
    res.status(401).json({
      message: "Error occured while fetching bookmark",
      error: error,
    });
  }
});

userRoutes.put("/edit-bookmark", userMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const { id, title, url } = req.body;

    if (!id || !title || !url) {
      res.status(401).json({
        message: "data not provided",
      });
    }

    const user = await userModel.findOne({
      _id: userId,
    });

    if (!user) {
      return res.status(401).json({
        message: "Unable to edit user bookmark!!",
      });
    }

    const bookmarkIndex = user.bookmark.findIndex(
      (sub) => sub._id.toString() === id
    );

    if (bookmarkIndex === -1) {
      return res.status(404).json({
        message: "Bookmark not found!!",
      });
    }

    user.bookmark[bookmarkIndex] = {
      title: title,
      url: url,
    };

    await user.save();
    res.status(201).json({
      message: "Bookmark edited",
      data: user.bookmark[bookmarkIndex],
    });
  } catch (error) {
    console.log("error", error);
    res.status(401).json({
      message: "Error occured while editing bookmark",
      error: error,
    });
  }
});

userRoutes.delete("/delete-all-bookmark", userMiddleware, async (req, res) => {
  try {
    const userId = req.userId;

    const user = await userModel.findById({
      _id: userId,
    });

    if (!user) {
      return res.json(
        {
          message: "User not found!!",
        },
        { status: 404 }
      );
    }

    user.bookmark.splice(0, user.bookmark.length);

    await user.save();

    res.status(201).json({
      message: "All bookamrks deleted",
      bookamrk: user.bookmark,
    });
  } catch (error) {
    res.status(401).json({
      message: "Error occured while deleting bookmark",
      error: error,
    });
  }
});

userRoutes.delete("/delete-bookmark", userMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const { bookmarkId } = req.body;

    const user = await userModel.findById({
      _id: userId,
    });

    if (!user) {
      return res.json(
        {
          message: "User not found!!",
        },
        { status: 404 }
      );
    }

    const deleteBookmark = user.bookmark.filter(
      (book) => book._id != bookmarkId
    );

    if (!deleteBookmark || !deleteBookmark.length) {
      res.status(404).json({ message: "Bookmark not found" });
    }

    user.bookmark = deleteBookmark;

    await user.save();

    res.status(201).json({
      message: " bookamrks deleted",
      bookamrk: user.bookmark,
    });
  } catch (error) {
    res.status(401).json({
      message: "Error occured while deleting bookmark",
      error: error,
    });
  }
});

//CRUD FAVS

userRoutes.put("/toggle-fav", userMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const { bookmarkId } = req.body;

    if (!bookmarkId) {
      res.status(401).json({
        message: "id not provided",
      });
    }

    const user = await userModel.findOne({
      _id: userId,
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found!!",
      });
    }

    const bookmarkIndex = user.bookmark.findIndex(
      (sub) => sub._id.toString() === bookmarkId
    );

    if (bookmarkIndex === -1) {
      return res.status(404).json({
        message: "Bookmark not found!!",
      });
    }

    user.bookmark[bookmarkIndex] = {
      title: user.bookmark[bookmarkIndex].title,
      url: user.bookmark[bookmarkIndex].url,
      isFavourite: !user.bookmark[bookmarkIndex].isFavourite,
    };

    await user.save();

    if (user.bookmark[bookmarkIndex].isFavourite == true) {
      res.status(201).json({
        message: "Bookmark added to favourite",
        data: user.bookmark[bookmarkIndex],
      });
    } else {
      res.status(201).json({
        message: "Bookmark removed to favourite",
        data: user.bookmark[bookmarkIndex],
      });
    }
  } catch (error) {
    res.status(401).json({
      message: "Error occured while adding bookmark to favourite",
      error: error,
    });
  }
});

userRoutes.get("/view-fav", userMiddleware, async (req, res) => {
  try {
    const userId = req.userId;

    const user = await userModel.findOne({
      _id: userId,
    });

    if (!user) {
      return res.status(401).json({
        message: "Unable to edit user bookmark!!",
      });
    }

    const favBookmark = user.bookmark.filter(
      (book) => book.isFavourite == true
    );

    if (!favBookmark || !favBookmark.length) {
      res.status(401).json({
        message: "No fav bookamrk found",
      });
    }

    res.status(201).json({
      message: "Favourite bookmarks found",
      data: favBookmark,
    });
  } catch (error) {
    res.status(401).json({
      message: "Error occured while fetching favourite bookmark",
      error: error,
    });
  }
});

module.exports = {
  userRoutes,
};
