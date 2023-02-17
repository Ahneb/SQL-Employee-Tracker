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
      {value: 'add',name: 'Update Employee Role'},
      {value: 'quit',name: 'Quit '},
    ]
  },
]

// const branch1 = [
//   {
//     type: 'input',
//     name: 'Add_Department',
//     message: 'What department would you like to add? ',
//   },
// ]

// const branch2 = [
//   {
//     type: 'input',
//     name: 'Add_Roles_Title',
//     message: 'What department would you like to add? ',
//   },
//   {
//     type: 'input',
//     name: 'Add_Roles_Salary',
//     message: 'What is the salary? ',
//   },
// ]

// const branch3 = [
//   {
//     type: 'input',
//     name: 'Add_Employee_First',
//     message: 'What is their first name? ',
//   },
//   {
//     type: 'input',
//     name: 'Add_Employee_Last',
//     message: 'What is their last name? ',
//   },
//   {
    
//     type: 'list',
//     name: 'Add_Employee',
//     message: 'Select an Option',
//     //allow for different values in case we need the change later
//     choices: [
//       {value: 'addEmpFirst',name: 'What is their first name? '},
//       {value: 'addEmpLast',name: 'What is their last name? '},
//     ]
//   },
// ]

// const branch4 = [
//   {
//     type: 'list',
//     name: 'Add_Employee',
//     message: 'Select an Option',
//     //allow for different values in case we need the change later
//     choices: [
//       {value: 'addEmpFirst',name: 'What is their first name? '},
//       {value: 'addEmpLast',name: 'What is their last name? '},
//     ]
//   },
// ]


// function chooseOption() {
//   inquirer.prompt(options).then(answer => {
//     let chosenOption = answer['Actions'];
//     if (chosenOption === 'add') {
//     }
//   })
// }


// // function to prompt questions
// function promptQuestions(index) {
//   let currentQuestion = questions[index];
//   //check if all questions have been asked
//   if (index >= questions.length) {

//     chooseOption();
//     return;
//   }

//   inquirer.prompt(currentQuestion).then(answer => {
//     let keyVal = currentQuestion.name;
//     console.log(answer[keyVal]);
//     if (answerChecks(answer[keyVal]) === false){
//       promptQuestions(index);
//       return;
//     }

//     responses[keyVal] = answer[keyVal];
//     promptQuestions(index + 1);
//   });
// }

// // function writeToDb() {
// //   fs.writeFileSync('./db/db.json', JSON.stringify(allWorkers));
// // }


// //check for empty string and check for esc
// function answerChecks(answerToCheck) {
//   if (answerToCheck === 'esc') {
//     process.exit();
//   } else if (answerToCheck.trim().length === 0) {
//     return false;
//   }
// }


// function init() {
//   // chooseOption();
// }

// init();

connection.query('select * from departments', function(err, results) {
  console.table(results);

});

connection.query('select * from roles', function(err, results) {
  console.table(results);

});

connection.query('select * from employee', function(err, results) {
  console.table(results);
});

connection.end();