const express = require("express");
const app = express();
const PORT = process.env.port || 5000;
const path = require("path");
const cors = require("cors");
const { logger } = require("./middleware/logEvents");
const errorHandler = require("./middleware/errorHandler");

/*
 * @middleware
 */
app.use(logger);
app.use(cors(require("./utils/corsOptions")));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

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
app.use("/employees", require("./routes/api/employes"));
app.use("*", require("./routes/error"));
app.use(errorHandler);

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
