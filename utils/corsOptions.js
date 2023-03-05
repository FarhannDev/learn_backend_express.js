const whitelist = [
  "https://www.yoursite.com",
  "http://localhost:5000/",
  "http://127.0.0.1:3000",
];
// Cross origin resource sharing (CORS)
const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not Allowed By CORS."));
    }
  },
};

module.exports = corsOptions;
