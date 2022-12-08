const jwt = require("jsonwebtoken");

const createToken = {
  activation: (payload) => {
    return jwt.sign(payload, process.env.ACTIVATION_TOKEN_SECRET, {
      expiresIn: "10m",
    });
  },
  access: (payload) => {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "30m" });
  },
};

module.exports = createToken;
