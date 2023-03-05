const express = require("express");
const router = express.Router();
const employeesController = require("../../controllers/employeesController");

router
  .route("/")
  .get(employeesController.getAllEmployees)
  .post(employeesController.createNewEmployee)
  .put(employeesController.updateEmployee)
  .delete(employeesController.deleteEmployee);

router.route("/:id", employeesController.getEmployee);

module.exports = router;
