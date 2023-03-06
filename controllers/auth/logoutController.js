const fsPromises = require("fs/promises");
const path = require("path");
const { Users } = require("../../models/users");

const logoutController = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); // No content

  const refreshToken = cookies.jwt;
  const founderUser = Users.users.find(
    (user) => user.refreshToken === refreshToken
  );

  if (!founderUser) {
    res.clearCookie("jwt", { httpOnly: true });
    return res.sendStatus(204); // No content
  }

  // Delete refresh token from database
  const otherUsers = Users.users.filter(
    (user) => user.refreshToken !== founderUser.refreshToken
  );
  const currentUser = { ...founderUser, refreshToken: "" };
  Users.setUsers([...otherUsers, currentUser]);
  await fsPromises.writeFile(
    path.join(__dirname, "..", "..", "data", "users.json"),
    JSON.stringify(Users.users)
  );
  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
  res.sendStatus(204);
};

module.exports = { logoutController };
