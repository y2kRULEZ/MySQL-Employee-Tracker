
const inquirer = require("inquirer")

const db = require("./config/connection")

require("console.table")

db.connect(()=>{
    menu()
})

const menuQuestions =[{
    type:"list",
    name:"menu",
    message:"Choose one of the following",
    choices:["view all departments",
    "view all roles",
    "view all employees",
    "add a department",
    "add an employee",
    "add a role",
    "update an employee role"]
    
}

]




function menu(){

    inquirer.prompt(menuQuestions)
    .then(res => {
        if(res.menu==="view all employees"){
            viewEmployees()
        }
        else if(res.menu==="view all departments"){
            viewDepartments()
        }
        else if(res.menu==="view all roles"){
            viewRoles()
        }
        else if(res.menu==="add an employee"){
            addEmployee()
        }
        else if(res.menu==="add a department"){
            addDepartment()
        }
        else if(res.menu==="add a role"){
            addRole()
        }
        else if(res.menu==="update an employee role"){
            updateEmployeeRole()
        }
    })

}

function viewEmployees(){
    db.query(`SELECT employee.id, 
    employee.first_name,
    employee.last_name,
    role.title,
    department.name,
    role.salary,
    CONCAT(mgr.first_name,"",mgr.last_name) as manager
    FROM employee
    LEFT JOIN role ON role.id = employee.role_id
    LEFT JOIN department ON role.department_id = department.id
    LEFT JOIN employee as mgr ON employee.id = mgr.manager_id
    `,(err,data)=>{
        console.table(data)
        menu()

    })
}
function viewDepartments(){
    db.query(`SELECTmdepartment.name,
    `,(err,data)=>{
        console.table(data)
        menu()

    })
}

function viewRoles(){
    db.query(`SELECT role.title,
    `,(err,data)=>{
        console.table(data)
        menu()

    })
}

function addEmployee(){
    db.query("SELECT title as name, id as value from role",(err,roleData)=>{

        db.query(`SELECT CONCAT (first_name," ", last_name) as name, id as value from employee where manager_id = null`,
        (err,managerData)=>{
            const employeeAddQuestions=[
                {
                type: "input",
                name: "First name" ,
                message: 'What is your first name?'
            },
            {
                type: "input",
                name: "Last name" ,
                message: 'What is your last name?' 
            },
            {
                type:"list",
                name:"role_id",
                message:"choose the following role title",
                choice:roleData
            },
            {
                type:"list",
                name:"manager_id",
                message:"choose the following manager",
                choice:managerData
            }
            
            ]
            inquirer.prompt(employeeAddQuestions)
            .then(res=>{
                const parameters = [res.first_name,res.last_name,res.role_id, res.manager_id]
                db.query("INSERT into employee (first_name, last_name, role_id,manager_id)VALUES(?,?,?,?)",parameters,(err,data)=>{
                    viewEmployees()
                })
            })

        })
    })
}
function addDepartment(){

} 
function addRole(){

}

function updateEmployeeRole(){

}