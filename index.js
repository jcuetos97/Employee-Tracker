// Dependencies
const inquirer = require ('inquirer');
const mysql = require ('mysql2');
const queries = require ('./queries');
const consTable = require ('console.table');


require('doteenv').config()


// Connection to database
const db = mysql.createConnection(
    {
      host: 'localhost',
      user: 'root',
      password: process.env.MYSQL_PASSWORD,
      database: 'employee_db'
    },
    console.log('Connected to the employee_db database.')
);


function appWelcome () {
console.log("***********************************")
console.log("*                                 *")
console.log("*        EMPLOYEE TRACKER         *")
console.log("*                                 *")
console.log("***********************************")
promptUser();
};

function promptUser () {
    inquirer.prompt  ({
        type: 'list',
        message: 'What would you like to do?',
        choices: ['Add Employee', 'Update Employee Role', 'View All Roles', 'Add Role',
                  'View All Departments', 'Add Departments', 'Quit'],
        name: 'userOperation',
    })
    .then(answers => {
        switch (answers.userOperation) {
            case 'Add Employee':
                queries.addEmployee();
                break;
            case 'Update Employee Role':
                queries.updateEmployee();
                break;
            case 'View All Roles':
                queries.viewAllRoles();
                break;
            case 'Add Role':
                queries.addRole();
                break;
            case 'View All Departments':
                queries.viewAllDepartments();
                break;
            case 'Add Departments':
                queries.addDepartment();
                break;    
        }
    })
}

appWelcome ();