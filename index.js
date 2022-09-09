// Dependencies
const inquirer = require ('inquirer');
const mysql = require ('mysql2');
const consTable = require ('console.table');
require('dotenv').config()

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

db.connect(err => {
    if (err) throw err;
    console.log("Connected as Id" + db.threadId);
    appWelcome();
});

function appWelcome() {
console.log("***********************************")
console.log("*                                 *")
console.log("*        EMPLOYEE TRACKER         *")
console.log("*                                 *")
console.log("***********************************")
promptUser();
};

function promptUser() {
     const choices = {
        type: 'list',
        message: 'What would you like to do?',
        choices: ['View All Employees',
                  'View All Departments',
                  'View All Roles', 
                  'Update Employee Role', 
                  'Add Employee',
                  'Add Role',
                  'Add Department', 
                  'Quit'],
        name: 'userOperation',
    }
 
    inquirer.prompt(choices)
    .then((answers) => {
        switch (answers.userOperation) {
            case 'View All Employees':
                viewAllEmployees();
                break;
            case 'View All Departments':
                viewAllDepartments();
                break;
            case 'View All Roles':
                viewAllRoles();
                break;  
            case 'Update Employee Role':
                updateEmployee();
                break;
            case 'Add Employee':
                addEmployee();
                break;
            case 'Add Role':
                addRole();
                break;
            case 'Add Department':
                addDepartment();
                break;  
            case 'Quit':
                db.end();
                break;     
        }
    })
    .catch(err => {
        console.error(err);
      });
}

function viewAllEmployees() {
    const sqlQuery = `
    SELECT employees.id, 
    employees.first_name, 
    employees.last_name, 
    roles.title, 
    departments.name AS department,
    roles.salary, 
    CONCAT (manager.first_name, " ", manager.last_name) AS manager
    FROM employees
    LEFT JOIN roles ON employees.role_id = roles.id
    LEFT JOIN departments ON roles.department_id = departments.id
    LEFT JOIN employees manager ON employees.manager_id = manager.id`;

    db.query(sqlQuery, function (err, results) {
        if (err) throw err;
            console.table(results);
            promptUser();
    });
}

function viewAllRoles() {
    const sqlQuery = `
    SELECT roles.id, 
    roles.title,
    departments.name AS department,  
    roles.salary
    FROM roles
    LEFT JOIN departments ON roles.department_id = departments.id `;
    
    db.query(sqlQuery, function (err, results) {
        if (err) throw err;
            console.table(results);
            promptUser();
    });
}

function viewAllDepartments() {
    db.query(`SELECT * FROM departments`, function (err, results) {
        if (err) throw err;
            console.table(results);
            promptUser();
    });
}

function addEmployee() {
    const managerArray = [{
        name: 'None',
        value: 'NULL'
    }];
    db.query("SELECT * FROM employees WHERE manager_id IS NULL", function (err, results) {
        if (err) throw err;
        for (var i = 0; i < results.length; i++) {
            managerArray.push({
                name: results[i].first_name + ' ' + results[i].last_name,
                value: results[i].id
            });    
        }
    });
    
    const roleArray = [];
    db.query("SELECT * FROM roles", function (err, results) {
        if (err) throw err;
        
        for (var i = 0; i < results.length; i++) {
            roleArray.push({
                name: results[i].title,
                value: results[i].id
            });    
        }
    });
    
    let questions = [
        {
            type: 'input',
            message: "What is the employee's first name?", 
            name: 'firstName', 
        },
        {
            type: 'input',
            message: "What is the employee's last name?", 
            name: 'lastName',
        }, 
        {
            type: 'list',
            message: "What is the employee's role?", 
            choices: roleArray,
            name: 'employeeRole'
        },
        {
            type: 'list',
            message: "Who is the employee's manager?",
            choices: managerArray,
            name: 'employeeManager'
        }
    ] 
    
    inquirer.prompt(questions)
    .then(answers => {
        const sqlQuery = `
        INSERT INTO employees (first_name, last_name, role_id, manager_id) 
        VALUES 
        ('${answers.firstName}', '${answers.lastName}', ${answers.employeeRole}, ${answers.employeeManager})`;
  
        db.query(sqlQuery, function (err, results) {
            if (err) throw err;
            console.log('New employee added.');
            promptUser();
        });
    }) 
}

function addRole () {
    
    const departmentArray = [];
    db.query("SELECT * FROM departments", function (err, results) {
    if (err) throw err;
    for (var i = 0; i < results.length; i++) {
        let dept = {
            name: results[i].name,
            value: results[i].id
        }
        departmentArray.push(dept);
    }
    });

    inquirer.prompt ([{
        type: 'input',
        message: 'What is the name of the role?', 
        name: 'roleName'
    }, 
    
    {
        type: 'input',
        message: 'What is the salary of the role?',
        name: 'roleSalary'
    },

    {
        type: 'list', 
        message: 'Which department does the role belong to?',
        choices: departmentArray,
        name: 'roleDepartment'
    }])
    .then(answers => {
        db.query(`INSERT INTO roles (title, salary, department_id) VALUES ('${answers.roleName}', ${answers.roleSalary}, ${answers.roleDepartment})`, function (err, results) {
            if (err) throw err;
            console.log('New role added.');
            promptUser();
        });
    }) 
}

function addDepartment () {  
    inquirer.prompt ({
        type: 'input',
        message: 'What is the name of the department?', 
        name: 'departmentName'
    })
    .then(answers => {
        db.query(`INSERT INTO departments (name) VALUES ('${answers.departmentName}');`, function (err, results) {
            if (err) throw err;
            console.log('New department added.');
            promptUser();
        });

    })
}

function updateEmployee () {
    db.query("SELECT * FROM employees", function (err, results) {
        if (err) throw err;
        const employeeArray = [];
        for (var i = 0; i < results.length; i++) {
            employeeArray.push({
                name: results[i].first_name + ' ' + results[i].last_name,
                value: results[i].id
            }); 
        }
  
        db.query("SELECT * FROM roles", function (err, results) {
            if (err) throw err;
            const roleArray = [];
            for (var i = 0; i < results.length; i++) {
                roleArray.push({
                    name: results[i].title,
                    value: results[i].id
                }); 
            }

        let questions = [
            {
                type: 'list',
                message: "Which employee's role do you want to update?",
                choices: employeeArray,
                name: 'employeeUpdate'
            
            },
            {
                type: 'list',
                message: 'Which role do you want to assign the selected employee?', 
                choices: roleArray,
                name: 'newRole' 
            }
        ]
    
        inquirer.prompt(questions)
        .then(answers => {
            db.query(`UPDATE employees SET role_id = ${answers.newRole} WHERE id = ${answers.employeeUpdate}`, function (err, results) {
                if (err) throw err;
                console.table(`${answers.employeeUpdate}`);
                promptUser();
            });
        })
    });
  });
}