const express = require("express");
const app = express();
const PORT = process.env.port || 5000;
const path = require("path");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const { logger } = require("./middleware/logEvents");
const errorHandler = require("./middleware/errorHandler");
const verifyJWT = require("./middleware/verifyJWT");
const cookieParser = require("cookie-parser");
const credentials = require("./middleware/credentials");

/*
 * @Express middleware
 */
app.use(logger);
app.use(credentials);
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

/*
 * @Express Static files
 */
app.use("/", express.static(path.join(__dirname, "/public/")));
// app.use("/subdir", express.static(path.join(__dirname, "/public/")));

/*
 * @Express routes
 */
// app.use("/subdir", require("./routes/subdir"));
app.use("/", require("./routes/root"));
app.use("/api/auth/register", require("./routes/api/auth/register"));
app.use("/api/auth/login", require("./routes/api/auth/login"));
app.use("/api/auth/refresh", require("./routes/api/auth/refresh"));
app.use("/api/auth/logout", require("./routes/api/auth/logout"));

// Express Protect routes
app.use(verifyJWT);
app.use("/api/employee", require("./routes/api/employes"));
app.use("*", require("./routes/error"));
app.use(errorHandler);

// Development server running...
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
