// Init data
const usersDB = {
  users: require("../../models/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};

// Include package
const fsPromises = require("fs/promises");
const path = require("path");
const bcrypt = require("bcrypt");
const { nanoid } = require("nanoid");

module.exports.registerController = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res
      .status(400)
      .json({ status: "fail", message: "Username and password required" });
  //  check duplicate username
  const duplicate = usersDB.users.find(
    (person) => person.username === username
  );
  if (duplicate)
    return res
      .status(400)
      .json({ status: "fail", message: "Username already exists." });
  try {
    const userId = nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;
    const hashedPassword = await bcrypt.hash(password, 10);
    // Store new users
    const newUsers = {
      id: userId,
      username: username,
      password: hashedPassword,
      createdAt,
      updatedAt,
    };

    usersDB.setUsers([...usersDB.users, newUsers]);
    console.log(usersDB.users);
    await fsPromises.writeFile(
      path.join(__dirname, "..", "..", "models", "users.json"),
      JSON.stringify(usersDB.users)
    );
    res.status(201).json({
      status: "success",
      message: "User has been created.",
      data: {
        userId,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
