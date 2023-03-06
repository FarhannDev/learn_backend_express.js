const allowedOrigins = require("./allowedOrigins");

// Cross origin resource sharing (CORS)
const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not Allowed By CORS."));
    }
  },
  optionsSuccessStatus: 200,
};

module.exports = corsOptions;
