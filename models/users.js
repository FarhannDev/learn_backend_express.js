const Joi = require("joi");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { nanoid } = require("nanoid");

const Users = {
  users: require("../data/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};

const userValidation = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  email: Joi.string().max(255).required().email(),
  username: Joi.string().alphanum().max(8).required(),
  password: Joi.string().min(6).max(255).required(),
  confirmPassword: Joi.string().valid(Joi.ref("password")).required(),
});

const userSigninValidation = Joi.object({
  // email: Joi.string().max(255).required().email(),
  username: Joi.string().alphanum().required(),
  password: Joi.string().min(6).max(255).required(),
});

const addNewUser = (user) => {
  const userId = nanoid(16);
  const createdAt = new Date().toISOString();
  const updatedAt = createdAt;

  user.id = userId;
  user.createdAt = createdAt;
  user.updatedAt = updatedAt;
  return user;
};

const userAccessTokenHandler = (username, expired) => {
  return jwt.sign({ username: username }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: expired,
  });
};

const userRefreshTokenHandler = (username, expired) => {
  return jwt.sign({ username: username }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: expired,
  });
};

const userSaveTokenHandler = (users, refreshToken) => {
  return { ...users, refreshToken };
};

const userFindUsername = (users, username) => {
  return users.find((user) => user.username === username);
};

const userPasswordVerify = (password, passwordInput) => {
  return bcrypt.compare(password, passwordInput);
};

const setResponseSuccess = (data, token) => {
  return {
    error: null,
    status: "OK",
    status_code: 200,
    message: "User logged in",
    data: {
      users: {
        id: data.id,
        name: data.name,
        email: data.email,
        token: token,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      },
    },
  };
};

module.exports = {
  Users,
  userValidation,
  userSigninValidation,
  userAccessTokenHandler,
  userRefreshTokenHandler,
  userSaveTokenHandler,
  userPasswordVerify,
  userFindUsername,
  addNewUser,
  setResponseSuccess,
};
