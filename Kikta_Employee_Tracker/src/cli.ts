import inquirer from "inquirer";
import { QueryResult } from 'pg';
import { pool, connectToDb } from './connection.js';
await connectToDb();

//interface to define responses
interface DepartmentReponse {
  departmentName: string;
}

interface PromptAnswers {
  action: string;
}

interface RoleResponse {
  title: string;
  salary: string;
  department_id: string;
}

interface EmployeeResponse {
  first_name: string;
  last_name: string;
  role_id: number;
  manager_id: number;
}

interface UpdateEmployeeResponse {
  employee_id: number;
  update_role_id: number;
}

interface UpdateEmployeeManager {
  employee_id: number;
  update_manager_id: number;
}

interface ViewEmployeeManager {
  manager_id: number;
}

interface ViewEmployeeDepartment {
  department_id: number;
}

interface DeleteDepartment {
  department_id: number;
  confirm_delete: boolean;
}

interface DeleteRole {
  role_id: number;
  confirm_delete: boolean;
}

interface DeleteEmployee {
  employee_id: number;
  confirm_delete: boolean;
}

interface ViewBudget {
  department_id: number;
}

function performActions(): void {
    const promptUser = (): void => {
      inquirer
        .prompt([
          {
            type: 'list',
            name: 'action',
            message: 'Select an action',
            choices: [
              //options for user to select
              'View Departments', 
              'View Roles',
              'View Employees',
              'Add a Department',
              'Add a Role',
              'Add an Employee',
              'Update an Employee Role',
              'Update an Employee Manager',
              'View Employees by Manager',
              'View Employees by Department',
              'Delete a Department',
              'Delete a Role',
              'Delete an Employee',
              'View Total Budget of a Department',
              'Exit', // Add an option to exit
            ],
          },
        ])
        .then((answers: PromptAnswers) => {
          if (answers.action === 'Exit') {
            console.log('Goodbye!');
            return; // Exit the loop
          }
          // Perform the selected action
          if (answers.action === 'View Departments') {
            //show the departments table
            const sql = 'SELECT id, department_name AS department FROM departments';
  
            pool.query(sql, (err: Error, result: QueryResult) => {
              if (err) {
                console.error('Error fetching departments:', err.message);
              } else {
                console.table(result.rows); // Display results in the console
              }
              promptUser(); // Re-prompt the user
            });
          } else if (answers.action === 'View Roles') {
            //show the role table
            const sql = 'SELECT id, title, salary, department_id FROM roles';
  
            pool.query(sql, (err: Error, result: QueryResult) => {
              if (err) {
                console.error('Error fetching roles:', err.message);
              } else {
                console.table(result.rows); // Display results in the console
              }
              promptUser(); // Re-prompt the user
            });
          } else if (answers.action === 'View Employees') {
            //show the employees table
            const sql = 'SELECT id, first_name, last_name, role_id, manager_id FROM employees';
  
            pool.query(sql, (err: Error, result: QueryResult) => {
              if (err) {
                console.error('Error fetching employees:', err.message);
              } else {
                console.table(result.rows); // Display results in the console
              }
              promptUser(); // Re-prompt the user
            });
          } else if (answers.action === 'Add a Department') {
            inquirer
              //prompt to get new department information
              .prompt([
                {
                  type: 'input',
                  name: 'departmentName',
                  message: 'Enter the name of the new department:',
                },
              ])
              .then((response: DepartmentReponse) => {
                const sql = 'INSERT INTO departments (department_name) VALUES ($1)';
                const values = [response.departmentName];
  
                pool.query(sql, values, (err: Error) => {
                  if (err) {
                    console.error('Error adding department:', err.message);
                  } else {
                    console.log(`Department '${response.departmentName}' added successfully.`);
                  }
                  promptUser(); // Re-prompt the user
                });
              });
          } else if (answers.action === 'Add a Role') {
            inquirer
            //prompt to input new role information
              .prompt([
                {
                  type: 'input',
                  name: 'title',
                  message: 'Enter the title of the new role:',
                },
                {
                  type: 'input',
                  name: 'salary',
                  message: 'Enter the salary of the new role:',
                  validate: (input: string) => {
                      return !isNaN(parseFloat(input)) && parseFloat(input) > 0 ? true
                      : 'Please enter a valid positive number for the salary.';
                  }, 
                },
                {
                  type: 'input',
                  name: 'department_id',
                  message: 'Enter the department ID for the new role:',
                  validate: (input: string) => {
                      return !isNaN(parseInt(input)) && parseInt(input) > 0
                      ? true
                      : 'Please enter a valid department ID';
                  },
                },
              ])
              .then((response: RoleResponse) => {
                const sql = 'INSERT INTO roles (title, salary, department_id) VALUES ($1, $2, $3)';
                const values = [response.title, parseFloat(response.salary), parseInt(response.department_id)];
  
                pool.query(sql, values, (err: Error) => {
                  if (err) {
                    console.error('Error adding role:', err.message);
                  } else {
                    console.log(`Role '${response.title}' added successfully.`);
                  }
                  promptUser(); // Re-prompt the user
                });
              });
          } else if (answers.action === 'Add an Employee') {
            inquirer
              //prompt to input new employee information
              .prompt([
                {
                  type: 'input',
                  name: 'first_name',
                  message: 'Enter the First Name of the new employee:',
                },
                {
                  type: 'input',
                  name: 'last_name',
                  message: 'Enter the Last Name of the new employee:', 
                },
                {
                  type: 'input',
                  name: 'role_id',
                  message: 'Enter the role ID for the new employee:',
                  validate: (input: string) => {
                    return !isNaN(parseInt(input)) && parseInt(input) > 0 
                    ? true
                    : 'Please enter a valid department ID';
                  },
                },
                {
                  type: 'input',
                  name: 'manager_id',
                  message: 'Enter the manager ID for the new employee:',
                  validate: (input: string) => {
                    return !isNaN(parseInt(input)) && parseInt(input) > 0? true
                    : 'Please enter a valid department ID';
                  },
                },
                  ])
              .then((response: EmployeeResponse) => {
                const sql = 'INSERT INTO roles (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3)';
                const values = [response.first_name, response.last_name, response.role_id, response.manager_id];
      
                pool.query(sql, values, (err: Error) => {
                  if (err) {
                    console.error('Error adding employee:', err.message);
                  } else {
                    console.log(`Employee '${response.last_name}' added successfully.`);
                  }
                  promptUser(); // Re-prompt the user
                });
              });
          } else if (answers.action === 'Update an Employee Role') {
            inquirer
            //prompt to update employee role
              .prompt([
                {
                  type: 'input',
                  name: 'employee_id',
                  message: 'Enter the ID of the employee you wish to update:',
                  validate: (input: string) => {
                    return !isNaN(parseInt(input)) && parseInt(input) > 0
                    ? true
                    : 'Please enter a valid employee ID.';
                  },
                },
                {
                  type: 'input',
                  name: 'update_role_id',
                  message: 'What is the new role ID for the employee?',
                  validate: (input: string) => {
                    return !isNaN(parseInt(input)) && parseInt(input) > 0
                    ? true
                    : 'Please enter a valid role ID.';
                  },
                },
              ])
              .then((response: UpdateEmployeeResponse) => {
                const sql = 'UPDATE employees SET role_id = $1 WHERE id = $2';
                const values = [response.update_role_id, response.employee_id];

                pool.query(sql, values, (err: Error, result: QueryResult) => {
                  if (err) {
                    console.error('Error updating employee role:', err.message);
                  } else {
                    console.log(`Employee ID ${response.employee_id} updated to Role ID ${response.update_role_id} successfully.`);
                    console.log(`Rows affected: ${result.rowCount}`);
                  }
                  promptUser(); // Re-prompt the user
                });
              });
          } else if (answers.action === 'Update an Employee Manager') {
            inquirer
            //prompt to update employee manager
              .prompt([
                {
                  type: 'input',
                  name: 'employee_id',
                  message: 'Enter the ID of the employee you wish to update:',
                  validate: (input: string) => {
                    return !isNaN(parseInt(input)) && parseInt(input) > 0
                    ? true
                    : 'Please enter a valid employee ID.';
                  },
                },
                {
                  type: 'input',
                  name: 'update_manager_id',
                  message: 'What is the new manager ID for the employee?',
                  validate: (input: string) => {
                    return !isNaN(parseInt(input)) && parseInt(input) > 0
                    ? true
                    : 'Please enter a valid role ID.';
                  },
                },
              ])
              .then((response: UpdateEmployeeManager) => {
                const sql = 'UPDATE employees SET manager_id = $1 WHERE id = $2';
                const values = [response.update_manager_id, response.employee_id];

                pool.query(sql, values, (err: Error, result: QueryResult) => {
                  if (err) {
                    console.error('Error updating employee role:', err.message);
                  } else {
                    console.log(`Employee ID ${response.employee_id} updated to Role ID ${response.update_manager_id} successfully.`);
                    console.log(`Rows affected: ${result.rowCount}`);
                  }
                  promptUser(); // Re-prompt the user
                });                
              });
          } else if (answers.action === 'View Employees by Manager') {
            inquirer
              .prompt([
                {
                  type: 'input',
                  name: 'manager_id',
                  message: 'Enter the ID of the manager to view their employees:',
                  validate: (input: string) => {
                    return !isNaN(parseInt(input)) && parseInt(input) > 0
                      ? true
                      : 'Please enter a valid manager ID (positive integer).';
                  },
                },
              ])
              .then((response: ViewEmployeeManager) => {
                const sql = `
                  SELECT 
                    e.id, 
                    e.first_name, 
                    e.last_name, 
                    r.title AS role 
                  FROM employees e
                  LEFT JOIN roles r ON e.role_id = r.id
                  WHERE e.manager_id = $1
                `;
                const values = [response.manager_id];
          
                pool.query(sql, values, (err: Error, result: QueryResult) => {
                  if (err) {
                    console.error('Error retrieving employees by manager:', err.message);
                  } else if (result.rows.length === 0) {
                    console.log(`No employees found for Manager ID ${response.manager_id}.`);
                  } else {
                    console.log(`Employees managed by Manager ID ${response.manager_id}:`);
                    console.table(result.rows);
                  }
                  promptUser(); // Re-prompt the user
                });
              });
          } else if (answers.action === 'View Employees by Department') {
            inquirer
              .prompt([
                {
                  type: 'input',
                  name: 'department_id',
                  message: 'Enter the ID of the department to view the employees:',
                  validate: (input: string) => {
                    return !isNaN(parseInt(input)) && parseInt(input) > 0
                      ? true
                      : 'Please enter a valid department ID (positive integer).';
                  },
                },
              ])
              .then((response: ViewEmployeeDepartment) => {
                const sql = `
                  SELECT 
                    e.id, 
                    e.first_name, 
                    e.last_name, 
                    r.title AS role 
                  FROM employees e
                  LEFT JOIN roles r ON e.role_id = r.id
                  WHERE e.department_id = $1
                `;
                const values = [response.department_id];
          
                pool.query(sql, values, (err: Error, result: QueryResult) => {
                  if (err) {
                    console.error('Error retrieving employees by department:', err.message);
                  } else if (result.rows.length === 0) {
                    console.log(`No employees found for Department ID ${response.department_id}.`);
                  } else {
                    console.log(`Employees in Department: ${response.department_id}:`);
                    console.table(result.rows);
                  }
                  promptUser(); // Re-prompt the user
                });
              });
          } else if (answers.action === 'Delete a Department') {
            inquirer
              .prompt([
                {
                  type: 'input',
                  name: 'department_id',
                  message: 'Enter the ID of the department you want to delete:',
                  validate: (input: string) => {
                    return !isNaN(parseInt(input)) && parseInt(input) > 0
                      ? true
                      : 'Please enter a valid department ID (positive integer).';
                  },
                },
                {
                  type: 'confirm',
                  name: 'confirm_delete',
                  message: 'Are you sure you want to delete this department? This action cannot be undone.',
                  default: false,
                },
              ])
              .then((response: DeleteDepartment) => {
                if (!response.confirm_delete) {
                  console.log('Department deletion canceled.');
                  promptUser(); // Re-prompt the user
                  return;
                }
          
                const sql = 'DELETE FROM departments WHERE id = $1';
                const values = [response.department_id];
          
                pool.query(sql, values, (err: Error, result: QueryResult) => {
                  if (err) {
                    console.error('Error deleting department:', err.message);
                  } else if (result.rowCount === 0) {
                    console.log(`No department found with ID ${response.department_id}.`);
                  } else {
                    console.log(`Department ID ${response.department_id} deleted successfully.`);
                  }
                  promptUser(); // Re-prompt the user
                });
              });
          } else if (answers.action === 'Delete a Role') {
            inquirer
              .prompt([
                {
                  type: 'input',
                  name: 'role_id',
                  message: 'Enter the ID of the role you want to delete:',
                  validate: (input: string) => {
                    return !isNaN(parseInt(input)) && parseInt(input) > 0
                      ? true
                      : 'Please enter a valid role ID (positive integer).';
                  },
                },
                {
                  type: 'confirm',
                  name: 'confirm_delete',
                  message: 'Are you sure you want to delete this role? This action cannot be undone.',
                  default: false,
                },
              ])
              .then((response: DeleteRole) => {
                if (!response.confirm_delete) {
                  console.log('Role deletion canceled.');
                  promptUser(); // Re-prompt the user
                  return;
                }
          
                const sql = 'DELETE FROM roles WHERE id = $1';
                const values = [response.role_id];
          
                pool.query(sql, values, (err: Error, result: QueryResult) => {
                  if (err) {
                    console.error('Error deleting role:', err.message);
                  } else if (result.rowCount === 0) {
                    console.log(`No role found with ID ${response.role_id}.`);
                  } else {
                    console.log(`Role ID ${response.role_id} deleted successfully.`);
                  }
                  promptUser(); // Re-prompt the user
                });
              });
          } else if (answers.action === 'Delete an Employee') {
            inquirer
              .prompt([
                {
                  type: 'input',
                  name: 'employee_id',
                  message: 'Enter the ID of the employee you want to delete:',
                  validate: (input: string) => {
                    return !isNaN(parseInt(input)) && parseInt(input) > 0
                      ? true
                      : 'Please enter a valid employee ID (positive integer).';
                  },
                },
                {
                  type: 'confirm',
                  name: 'confirm_delete',
                  message: 'Are you sure you want to delete this employee? This action cannot be undone.',
                  default: false,
                },
              ])
              .then((response: DeleteEmployee) => {
                if (!response.confirm_delete) {
                  console.log('Employee deletion canceled.');
                  promptUser(); // Re-prompt the user
                  return;
                }
          
                const sql = 'DELETE FROM employees WHERE id = $1';
                const values = [response.employee_id];
          
                pool.query(sql, values, (err: Error, result: QueryResult) => {
                  if (err) {
                    console.error('Error deleting employee:', err.message);
                  } else if (result.rowCount === 0) {
                    console.log(`No employee found with ID ${response.employee_id}.`);
                  } else {
                    console.log(`Employee ID ${response.employee_id} deleted successfully.`);
                  }
                  promptUser(); // Re-prompt the user
                });
              });
          } else if (answers.action === 'View Total Budget of a Department') {
            const sql = `SELECT department_name AS name, id AS value FROM departments`
            
            pool.query(sql, (err: Error, result: QueryResult) => {
              if (err) {
                console.error('Error fetching departments:', err.message);
              } else {
                departmentBudget(result.rows); // Display results in the console
              }
            });

            function departmentBudget (choices: any[]) {

            inquirer
              .prompt([
                {
                  type: 'list',
                  name: 'department_id',
                  message: 'Select a department',
                  choices,
                  validate: (input: string) => {
                    return !isNaN(parseInt(input)) && parseInt(input) > 0
                      ? true
                      : 'Please enter a valid department ID (positive integer).';
                  },
                },
              ])
              .then((response: ViewBudget) => {
                const sql = `
                  SELECT 
                    d.department_name, 
                    COALESCE(SUM(r.salary), 0) AS total_budget
                  FROM departments d
                  LEFT JOIN roles r ON d.id = r.department_id
                  WHERE d.id = $1
                  GROUP BY d.id;
                `;
                const values = [response.department_id];
          
                pool.query(sql, values, (err: Error, result: QueryResult) => {
                  if (err) {
                    console.error('Error calculating total budget:', err.message);
                  } else if (result.rows.length === 0) {
                    console.log(`No department found with ID ${response.department_id}.`);
                  } else {
                    const { department_name, total_budget } = result.rows[0];
                    console.log(`Total budget for '${department_name}' department: $${total_budget}`);
                  }
                  promptUser(); // Re-prompt the user
                });
              });
            };
          } else {
            console.log(`Action '${answers.action}' is not implemented yet.`);
            promptUser(); // Re-prompt the user
          }
        });
    };
  
    // Start the prompt loop
    promptUser();
  }
   
  performActions();
  