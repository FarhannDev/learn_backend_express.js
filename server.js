const express = require("express");
const app = express();
const PORT = process.env.port || 5000;
const path = require("path");
const cors = require("cors");
const corsOptions = require("./utils/corsOptions");
const { logger } = require("./middleware/logEvents");
const errorHandler = require("./middleware/errorHandler");

/*
 * @middleware
 */
app.use(logger);
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(errorHandler);

/*
 * @Static files
 */
app.use("/", express.static(path.join(__dirname, "/public/")));
// app.use("/subdir", express.static(path.join(__dirname, "/public/")));

/*
 * @routes
 */
app.use("/", require("./routes/root"));
// app.use("/subdir", require("./routes/subdir"));
app.use("/api/v1/register", require("./routes/api/register"));
app.use("/api/v1/login", require("./routes/api/login"));
app.use("/api/v1/employees", require("./routes/api/employes"));
app.use("*", require("./routes/error"));

// Development server running...
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
