const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.header("benis-token");
  if (!token) {
    return res.status(401).json({ err: "Токен не введен" });
  }
  try {
    const decoded = jwt.verify(token, process.env.jwtSecret);

    req.player = decoded.player;
  } catch (error) {
    res.status(401).json({ err: "Неверный токен" });
  }
};
