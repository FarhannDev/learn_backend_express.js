const fsPromises = require("fs/promises");
const path = require("path");
const bcrypt = require("bcrypt");
const { Users, userValidation, addNewUser } = require("../../models/users");
const { responseCreated, responseFail } = require("../../utils/response");

exports.registerController = async (req, res) => {
  const { name, email, username, password } = req.body;
  const value = { name, email, username, password };
  const { error } = userValidation.validate(value);
  if (error)
    return res.status(400).json(responseFail(`This field ${error.message}`));
  // Data user ada?
  const dataUser = Users.users.find((user) => user.email === value.email);
  if (dataUser)
    return res.status(400).json(responseFail("Email address already exists."));

  try {
    value.password = await bcrypt.hash(value.password, 10);
    let result = addNewUser(value);
    Users.setUsers([...Users.users, result]);
    await fsPromises.writeFile(
      path.join(__dirname, "..", "..", "data", "users.json"),
      JSON.stringify(Users.users)
    );

    res.status(201).json(responseCreated(result.id));
  } catch (error) {
    res.status(500).json(responseFail(error.message));
  }
};
