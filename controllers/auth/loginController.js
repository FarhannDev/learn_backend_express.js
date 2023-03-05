// Init data
const usersDB = {
  users: require("../../models/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};

const bcrypt = require("bcrypt");
const { logEvents } = require("../../middleware/logEvents");

const userLoginHandler = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res
      .status(400)
      .json({ status: "fail", message: "Username and password are required" });

  const findUser = usersDB.users.find((user) => user.username === username);
  if (!findUser) return res.sendStatus(401);
  const match = await bcrypt.compare(password, findUser.password);
  if (match) {
    logEvents(
      `User ${findUser.username} logged in to application`,
      "login.txt"
    );
    res.status(200).json({ status: "success", message: "User logged in!" });
  } else {
    logEvents(`Unauthorized`, "login.txt");
    res.sendStatus(401);
  }
};

module.exports = { userLoginHandler };
