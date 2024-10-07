const jwt = require("jsonwebtoken");

const userMiddleware = (req, res, next) => {
  const token = req.headers.token;

  if (!token) {
    res.status(404).json({
      message: "Token not found!!",
    });
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  if (!decoded) {
    res.status(404).json({
      message: "Not signed in!!",
    });
  }

  req.userId = decoded.id;
  next();
};

module.exports = { userMiddleware };
