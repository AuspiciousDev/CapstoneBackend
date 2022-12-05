const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader?.startsWith("Bearer "))
      return res.status(400).json({ message: "Authentication Failed!" });
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err)
        return res.status(400).json({ message: "Authentication Failed!" });

      //sucess
      req.user = user;
      next();
    });
  } catch (error) {
    console.log(error);
    res.status(500), json({ message: error.message });
  }
};

module.exports = auth;
