const Joi = require("joi");
const { nanoid } = require("nanoid");

const Employee = {
  employees: require("../data/employee.json"),
  setEmployees: function (data) {
    this.employees = data;
  },
};

const EmployeeSchema = Joi.object({
  // employeeNumber: Joi.number().integer(),
  firstname: Joi.string().alphanum().min(3).max(30).required(),
  lastname: Joi.string().alphanum().min(3).max(30).required(),
  grade:
    Joi.string()
    .required(),
  birthDate: Joi.date().raw().required(),
  joinDate: Joi.date().raw().required(),
  salary: Joi.number().required(),
  email: Joi.string().email(),
});

const getAllEmployee = () => {
  const result = Employee.employees;
  return result;
};

const addNewEmployee = (employee) => {
  employee.id = nanoid(16);
  employee.createdAt = new Date().toISOString();
  employee.updatedAt = new Date().toISOString();

  return employee;
};

module.exports = { Employee, EmployeeSchema, getAllEmployee, addNewEmployee };
