const response = (status, message, data) => {
  return {
    status: status,
    message: message,
    data: data,
  };
};

const responseSuccess = (data, message) => {
  return {
    error: null,
    status: "OK",
    status_code: 200,
    message: "",
    data: data,
  };
};

const responseCreated = (data) => {
  return response("success", "Account created successfully", { userId: data });
};

const responseFail = (message) => {
  return response("fail", message);
};

module.exports = { response, responseCreated, responseFail, responseSuccess };
