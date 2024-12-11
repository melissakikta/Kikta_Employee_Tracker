INSERT INTO departments (department_name)
VALUES ('Marketing'),
       ('Sales'),
       ('Customer Support'),
       ('Maintance'),
       ('Management');

INSERT INTO roles (department_id, title, salary)
VALUES (1, 'Designer', 65000),
       (1, 'Editor', 90000),
       (2, 'Salesman', 45000),
       (2, 'Lead Salesman', 60000),
       (3, 'Agent', 45000),
       (3, 'Lead Agent', 60000),
       (4, 'Maintance', 50000),
       (4, 'Head Maintance', 80000),
       (5, 'VP', 100000),
       (5, 'CEO', 200000);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ('Mike', 'Smith', 1, 2),
       ('Sharron', 'Jack', 2, 5),
       ('Sam', 'Wilson', 3, 4),
       ('James', 'Jackson', 4, 9),
       ('Susan', 'Zachs', 5, 6),
       ('Carol', 'Jones', 6, 9),
       ('Teddy', 'Thompson', 7, 8),
       ('Robby', 'Black', 8, 9),
       ('Harold', 'Miller', 9, 10),
       ('Ellie', 'Knapp', 10, 10);

SELECT * FROM departments;

SELECT * FROM roles;

SELECT * FROM employees;