const User = require("../model/User");
const handleLogout = async (req, res) => {
  // on Client, also delete the acessToken
  try {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204); //Success but no content
    const refreshToken = cookies.jwt;

    // is Refreshtoken in DB?
    const foundUser = await User.findOne({ refreshToken }).exec();
    if (!foundUser) {
      res.clearCookie("jwt", {
        httpOnly: true,
        sameSite: "None",
        secure: true,
      });
      res.sendStatus(204); //Success but no content
    }

    // Delete refreshToken in DB
    foundUser.refreshToken = "";
    const result = await foundUser.save();
    console.log("Logout Controller :", result);

    res.clearCookie("jwt", {
      httpOnly: true,
      sameSite: "None",
      secure: true,
    }); // secure true - only serves in https
    res.sendStatus(204);
  } catch (error) {
    console.log(
      "🚀 ~ file: logoutController.js:32 ~ handleLogout ~ error",
      error
    );
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  handleLogout,
};
