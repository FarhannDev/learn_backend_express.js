require("dotenv").config();
const fsPromises = require("fs/promises");
const bcrypt = require("bcrypt");
const path = require("path");
const { logEvents } = require("../../middleware/logEvents");
const { responseFail } = require("../../utils/response");
const {
  Users,
  userSigninValidation,
  userAccessTokenHandler,
  userRefreshTokenHandler,
  userSaveTokenHandler,
  userPasswordVerify,
  userFindUsername,
  setResponseSuccess,
} = require("../../models/users");

exports.userLoginHandler = async (req, res) => {
  const { username, password } = req.body;
  const values = { username, password };
  const { error } = userSigninValidation.validate(values);
  error && res.status(400).json(responseFail(`The field ${error.message}`));
  const users = userFindUsername(Users.users, username);
  !users && res.status(400).json(responseFail("Incorrect username/password"));
  const passwordVerify = await userPasswordVerify(password, users.password);
  !passwordVerify &&
    res.status(400).json(responseFail("Incorrect username / password"));

  // Create JWT
  const isUsername = users.username;
  const accessToken = userAccessTokenHandler(isUsername, "1d");
  const refreshToken = userRefreshTokenHandler(isUsername, "1d");
  const otherUsers = Users.users.filter((user) => user.username !== isUsername);
  const currentUsers = userSaveTokenHandler(users, refreshToken);

  Users.setUsers([...otherUsers, currentUsers]);
  await fsPromises.writeFile(
    path.join(__dirname, "..", "..", "data", "users.json"),
    JSON.stringify(Users.users)
  );

  res.cookie("jwt", refreshToken, {
    httpOnly: true,
    sameSite: "None",
    // secure: true,
    maxAge: 24 * 60 * 60 * 1000,
  });
  res.status(200).json(setResponseSuccess(currentUsers, accessToken));
  logEvents(`User ${users.username} logged in to application`, "login.txt");
};
