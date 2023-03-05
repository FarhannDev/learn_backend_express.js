const data = {
  employees: require("../models/employees.json"),
  setEmployees: function (data) {
    this.employees = data;
  },
};

module.exports.getAllEmployees = (req, res) => {
  res.json(data.employees);
};

module.exports.getEmployee = (req, res) => {
  const employee = data.employees.find(
    (emp) => emp.id === parseInt(req.body.id)
  );

  if (!employee) {
    return res.status(400).json({
      message: `Employee ID ${req.body.id} Not Found`,
    });
  }

  res.json(employee);
};

module.exports.createNewEmployee = (req, res) => {
  const { firstname, lastname } = req.body;
  const newEmployee = {
    id: data.employees[data.employees.length - 1].id + 1 || 1,
    firstname: firstname,
    lastname: lastname,
  };

  if (!newEmployee.firstname || !newEmployee.lastname) {
    return res.status(400).json({
      message: "Field is required!",
    });
  }

  data.setEmployees([...data.employees, newEmployee]);
  res.status(201).json(data.employees);
};

module.exports.updateEmployee = (req, res) => {
  const { id } = req.params.id;
  const { firstname, lastname } = req.body;
  const employee = data.employees.find(
    (emp) => emp.id === parseInt(req.body.id)
  );

  if (!employee) {
    return res.status(400).json({
      message: `Employee ID ${req.body.id} Not Found`,
    });
  }

  if (firstname) employee.firstname = firstname;
  if (lastname) employee.lastname = lastname;

  const filteredArray = data.employees.filter(
    (emp) => emp.id !== parseInt(req.body.id)
  );

  const unsortedArray = [...filteredArray, employee];

  data.setEmployees(
    unsortedArray.sort((a, b) => (a.id > b.id ? 1 : a.id < b.id ? -1 : 0))
  );
  res.json(data.employees);
};

module.exports.deleteEmployee = (req, res) => {
  const employee = data.employees.find(
    (emp) => emp.id === parseInt(req.body.id)
  );

  if (!employee) {
    return res.status(400).json({
      message: `Employee ID ${req.body.id} Not Found`,
    });
  }

  const filteredArray = data.employees.filter(
    (emp) => emp.id !== parseInt(req.body.id)
  );

  data.employees([...filteredArray]);
  res.json(data.employees);
};
