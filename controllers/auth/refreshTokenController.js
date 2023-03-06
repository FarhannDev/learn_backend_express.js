const jwt = require("jsonwebtoken");
const { Users } = require("../../models/users");
require("dotenv").config();

const refreshTokenController = (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(401);
  const refreshToken = cookies.jwt;
  const foundUser = Users.users.find(
    (person) => person.refreshToken === refreshToken
  );
  if (!foundUser) return res.sendStatus(403); //Forbidden

  // JWT VERIFY
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err || foundUser.username !== decoded.username)
      return res.sendStatus(403);
    const accessToken = jwt.sign(
      { username: decoded.username },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1d" }
    );
    res.status(200).json({
      error: null,
      status: "OK",
      status_code: 200,
      message: "Successfully tokens refresh",
      data: {
        users: {
          id: foundUser.id,
          name: foundUser.name,
          email: foundUser.email,
          tokens: {
            accessToken,
          },
          createdAt: foundUser.createdAt,
          updatedAt: foundUser.updatedAt,
        },
      },
    });
  });
};

module.exports = { refreshTokenController };
