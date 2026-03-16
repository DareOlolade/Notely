const jwt = require("jsonwebtoken");
const authMiddleware = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (authorization) {
    const token = authorization.split(" ")[1];
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
      } catch (error) {
        res.status(401).json({ message: "unauthorised" });
      }
    } else {
      res.status(401).json({ message: "unauthorised" });
    }
  } else {
    res.status(401).json({ message: "unauthorised" });
  }
};

module.exports = authMiddleware;
