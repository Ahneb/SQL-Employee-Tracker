require('dotenv').config();
const inquirer = require('inquirer');
const path = require('path');
const fs = require('fs');
const mysql = require('mysql2');


const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_DB,
  password: process.env.DB_PASS,
});

const mainMenu = [
  {
    type: 'list',
    name: 'Menu',
    message: 'Select an Option',
    choices: [
      {value: 'viewDep',name: 'View All Department'},
      {value: 'viewRole',name: 'View All Roles'},
      {value: 'viewEmp',name: 'View All Employee'},
      {value: 'addDep',name: 'Add Department'},
      {value: 'addRole',name: 'Add Roles'},
      {value: 'addEmp',name: 'Add Employee'},
      {value: 'updateEmp',name: 'Update Employee Role'},
      {value: 'quit',name: 'Quit '},
    ]
  },
];

const branch1 = [
  {
    type: 'input',
    name: 'Add_Department',
    message: 'What department would you like to add? ',
  },
];

let branch2 =[];

let branch3 = [];

let branch4 = [];


function chooseOption() {
  inquirer.prompt(mainMenu).then(answer => {
    let chosenOption = answer['Menu'];
    switch(chosenOption) {
      case 'viewDep':
        viewDepartment();
        break;
      case 'viewRole':
        viewRoles();
        break;
      case 'viewEmp':
        viewEmployees();
        break;
      case 'addDep':
        addDepartment();
        break;
      case 'addRole':
        createDynamicDepartments();
        break;
      case 'addEmp':
        createDynamicRoles();
        break;
      case 'updateEmp':
        updateEmployee();
        break;
      case 'quit':
        process.exit();
        break;
    }
  })
};

let responses = {};
let dynamicDepartments = [];
let dynamicRoles = [];
let dynamicEmployees = [];
let dynamicManagers = [];


function createDynamicDepartments() {
  //reset global array to empty
  dynamicDepartments = [];
  //make a query to mysql
  connection.query('Select name, id FROM departments ORDER BY departments.id', (err, results) =>{
    results.forEach(elem => {
      dynamicDepartments.push({value: `${elem.id}`, name: elem.name});
      // console.log(elem);

    });
    // console.log('this is the dep',dynamicDepartments);
    
    branch2 = [
      {
        type: 'input',
        name: 'Add_Roles_Title',
        message: 'What role would you like to add? ',
      },
      {
        type: 'input',
        name: 'Add_Roles_Salary',
        message: 'What is the yearly salary? ',
      },
      {
        type: 'list',
        name: 'Add_Roles_Department',
        message: 'What department does the roles belong to? ',
        choices: dynamicDepartments
      },
    ];

    promptQuestions(branch2, 0);
  });

  
};

function createDynamicRoles() {
  //reset global array to empty
  dynamicRoles = [];
  dynamicEmployees = [];
  //make a query to mysql
  connection.query('Select title, id FROM roles ORDER BY roles.id', (err, results) =>{
    // console.log('this is the results ',results);
    results.forEach(elem => {
      dynamicRoles.push({value: `${elem.id}`, name: elem.title});
      // console.log(elem.id, elem.title);
    });
    // console.log('this is the roles',dynamicRoles);
  
    connection.query(`Select CONCAT(employee.first_name, ' ', employee.last_name) AS name, id FROM employee ORDER BY employee.id`, (err, results) =>{
      // console.log('this is the results ',results);
      // console.log(results.length);
      results.forEach(elem => {
        // console.log(dynamicEmployees.length);
        dynamicEmployees.push({value: `${elem.id}`, name: elem.name});
        if (dynamicEmployees.length === results.length) {
          // console.log('we hit 8');
          dynamicEmployees.push({value: 'null', name: 'none'});
        }
        // console.log(dynamicEmployees.length);
        // console.log(elem.id, elem.name);
      });
      // console.log('this is the employees',dynamicEmployees);

      branch3 = [
        {
          type: 'input',
          name: 'Add_Employee_First',
          message: 'What is their first name? ',
        },
        {
          type: 'input',
          name: 'Add_Employee_Last',
          message: 'What is their last name? ',
        },
        {
          type: 'list',
          name: 'Add_Employee_Role',
          message: 'What is their role? ',
          choices: dynamicRoles
        },
        {
          type: 'list',
          name: 'Add_Employee_Manager',
          message: 'Who is their manager? ',
          choices: dynamicEmployees
        },
      ];
  
      promptQuestions(branch3, 0);
    });
  });

};

function updateEmployee() {
  //reset global array to empty
  dynamicRoles = [];
  dynamicEmployees = [];
  dynamicManagers = [];
  //make a query to mysql
  connection.query('Select title, id FROM roles ORDER BY roles.id', (err, results) =>{
    // console.log('this is the results ',results);
    results.forEach(elem => {
      dynamicRoles.push({value: `${elem.id}`, name: elem.title});
      // console.log(elem.id, elem.title);
    });
    // console.log('this is the roles',dynamicRoles);
  
    connection.query(`Select CONCAT(employee.first_name, ' ', employee.last_name) AS name, id FROM employee ORDER BY employee.id`, (err, results) =>{
      // console.log('this is the results ',results);
      console.log(results.length);
      results.forEach(elem => {
        // console.log(dynamicEmployees.length);
        dynamicEmployees.push({value: `${elem.id}`, name: elem.name});
        dynamicManagers.push({value: `${elem.id}`, name: elem.name});
        if (dynamicManagers.length === results.length) {
          // console.log('we hit 8');
          dynamicManagers.push({value: 'null', name: 'none'});
        };
        // console.log(dynamicEmployees.length);
        // console.log(elem.id, elem.name);
      });
      console.log('this is the employees ', dynamicEmployees);
      console.log('this is the manager ', dynamicManagers);

      branch4 = [
        {
          type: 'list',
          name: 'Chosen_Employee',
          message: 'Which employee do you want to change? ',
          choices: dynamicEmployees
        },
        {
          type: 'list',
          name: 'Add_Employee_Role',
          message: 'What is their new role? ',
          choices: dynamicRoles
        },
        {
          type: 'list',
          name: 'Add_Employee_Manager',
          message: 'Who is their new manager? ',
          choices: dynamicManagers
        },
      ];
  
      promptQuestions(branch4, 0);
    });
  });

};

function viewDepartment() {
  connection.query('select * from departments ORDER BY departments.id;', function(err, results) {
    console.table(results);
    chooseOption();
  });
};

function viewRoles() {
  connection.query(`
    SELECT roles.id, 
      roles.title, 
      departments.name AS department,
      roles.salary
    FROM roles 
      JOIN departments ON roles.department_id = departments.id 
    ORDER BY roles.id;
    `,
    function(err, results) {
      console.table(results);
      chooseOption();
    }
  );
};

function viewEmployees() {
  connection.query(`
    SELECT e.id, 
      CONCAT(e.first_name, ' ', e.last_name) AS name, 
      roles.title AS title, 
      departments.name AS department, 
      roles.salary AS salary, 
      CONCAT(m.first_name, ' ', m.last_name) AS manager
    From employee e
      JOIN roles ON e.role_id = roles.id 
      JOIN departments ON roles.department_id = departments.id
      left JOIN employee m ON e.manager_id = m.id
    ORDER BY e.id;
    `, 
    function(err, results) {
      console.table(results);
      chooseOption();
    }
  );
};

function addDepartment() {
  promptQuestions(branch1, 0);
};

// function to prompt questions
function promptQuestions(branch, index) {
  let currentQuestion = branch[index];
  //check if all questions have been asked
  if (index >= branch.length) {
    if (branch === branch2) {
      console.log('this is the final response', responses);
      // console.log(responses.Add_Roles_Title);
      // console.log(responses.Add_Roles_Salary);
      // console.log(parseInt(responses.Add_Roles_Department));
      connection.query(`INSERT INTO roles (title, salary, department_id) values ('${responses.Add_Roles_Title}', ${parseInt(responses.Add_Roles_Salary)}, ${parseInt(responses.Add_Roles_Department)})`, (err, results) => {
        console.log(`Successfully added a new Role:
        Name: ${responses.Add_Roles_Title}, 
        Salary: ${responses.Add_Roles_Salary}, 
        Department: ${parseInt(responses.Add_Roles_Department)}`);
        chooseOption();
      });
    } else if (branch === branch3) {
      // console.log('this is the final response', responses);
      connection.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) values ('${responses.Add_Employee_First}', '${responses.Add_Employee_Last}', ${parseInt(responses.Add_Employee_Role)}, ${responses.Add_Employee_Manager});`, (err, results) => {
        console.log(`Successfully added a new Employee:
        First: ${responses.Add_Employee_First}, 
        Last: ${responses.Add_Employee_Last}, 
        Role: ${parseInt(responses.Add_Employee_Role)},
        Manager: ${responses.Add_Employee_Manager},
        `),
        chooseOption();
      });
    } else if (branch === branch4) {
      console.log('this is the final response', responses);

      connection.query(`UPDATE employee SET manager_id = ${responses.Add_Employee_Manager}, role_id = ${responses.Add_Employee_Role} WHERE employee.id = '${responses.Chosen_Employee}';`, (err, results) => {
        console.log(`Successfully updated an Employee:
        Employee: ${responses.Chosen_Employee}, 
        New Role: ${responses.Add_Employee_Role},
        New Manager: ${responses.Add_Employee_Manager},
        `),
        chooseOption();
      });

    } else {
      chooseOption();
    }
    return;
  };

  switch(branch){
    case branch1:
      inquirer.prompt(currentQuestion).then(answer => {
        let keyVal = currentQuestion.name;
    
        if (answerChecks(answer[keyVal]) === false){
          promptQuestions(branch, index);
          return;
        };
    
        connection.query(`INSERT INTO departments (name) values ('${answer[keyVal]}')`, (err, results) => {
          console.log(`Successfully added new Department: ${answer[keyVal]}`);
          chooseOption();
        });
      });
      break;
    case branch2:
      inquirer.prompt(currentQuestion).then(answer => {
        let keyVal = currentQuestion.name;

        if (answerChecks(answer[keyVal]) === false){
          promptQuestions(branch, index);
          return;
        };

        // console.log('this is the answer keyval ',  answer[keyVal]);
        responses[keyVal] = answer[keyVal];
        promptQuestions(branch, index + 1);
      });
      break;
    case branch3:
      inquirer.prompt(currentQuestion).then(answer => {
        let keyVal = currentQuestion.name;
    
        if (answerChecks(answer[keyVal]) === false){
          promptQuestions(branch, index);
          return;
        };
    
        responses[keyVal] = answer[keyVal];
        promptQuestions(branch, index + 1);
      });
      break;
    case branch4:
      console.log('branch4');
      inquirer.prompt(currentQuestion).then(answer => {
        let keyVal = currentQuestion.name;
        console.log('this is the key val ',keyVal);
        if (answerChecks(answer[keyVal]) === false){
          promptQuestions(branch, index);
          return;
        };
    
        // console.log('this is the answer keyval ',  answer[keyVal]);
        responses[keyVal] = answer[keyVal];
        promptQuestions(branch, index + 1);
      });
      break;  
  }
};

//check for empty string and check for esc
function answerChecks(answerToCheck) {
  if (answerToCheck === 'esc') {
    process.exit();
  } else if (answerToCheck.trim().length === 0) {
    return false;
  }
};

function init() {
  chooseOption();
};

init();
