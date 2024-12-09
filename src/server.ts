import express from 'express';
import { QueryResult } from 'pg';
import { pool, connectToDb } from './connection.js';

await connectToDb();

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//get request for department table - ask about the pathways
app.get('/api/departments', (_req, res) => {
  const sql = 'SELECT id, department_name AS department FROM departments';

  pool.query(sql, (err: Error, result: QueryResult) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    const { rows } = result;
    res.json({
      message: 'success',
      data: rows,
    });
  });
});

//get request for roles table
app.get('/api/roles', (_req, res) => {
  const sql = 'SELECT id, title, salary, department_id AS role FROM roles';

  pool.query(sql, (err: Error, result: QueryResult) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    const { rows } = result;
    res.json({
      message: 'success',
      data: rows,
    });
  });
});

//get request for employees tables combine two tables worth of data
app.get('/api/employess', (_req, res) => {
  const sql = 'SELECT id, frist_name, last_name, role_id,  AS role FROM roles';

  pool.query(sql, (err: Error, result: QueryResult) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    const { rows } = result;
    res.json({
      message: 'success',
      data: rows,
    });
  });
});

//post request for department
app.post('/api/new-department', ({ body }, res) => {
  const sql = 'INSERT INTO departments (department_name) VALUES ($1)';
  const params = [body.department_name];

  pool.query(sql, params, (err, _result) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: body,
    });
  });
});

//post request for role new roles has more than one insert field.
app.post('/api/new-role', ({ body }, res) => {
  const sql = 'INSERT INTO roles (title, salary, department_id) VALUES ($1)';
  const params = [body.department_name];
//what to do with body.department_name for this post?
  pool.query(sql, params, (err, _result) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: body,
    });
  });
});

//post request for employee has more than one insert field.
app.post('/api/new-employee', ({ body }, res) => {
  const sql = 'INSERT INTO roles (first_name, last_name, role_id, manager_id) VALUES ($1)';
  const params = [body.department_name];
//what to do with body.department_name for this post?
  pool.query(sql, params, (err, _result) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: body,
    });
  });
});

//put request to update employee has more than one field
app.put('api/employees/:id', (req, res) => {
  const sql = 'UPDATE employees SET review = $1 WHERE id = $2';
  const params = [req.body.review, req.params.id];
//how do I update more than 1 field
  pool.query(sql, params, (err:Error, result: QueryResult) => {
    if (err) {
      res.status(400).json({ error: err.message });
    } else {
      res.json({
        message: 'success',
        data: req.body,
        changes: result.rowCount,
      });
    }
  });
});


//BONUS DELETE a department
app.delete('/api/departments/:id', (req, res) => {
  const sql = 'DELETE FROM departments WHERE id = $1';
  const params = [req.params.id];

  pool.query(sql, params, (err: Error, result: QueryResult) => {
    if (err) {
      res.status(400).json({ error: err.message });
    } else {
      res.json({
        message: 'deleted',
        changes: result.rowCount,
        id: req.params.id,
      });
    }
  });
});

//BONUS DELETE a roles
app.delete('/api/roles/:id', (req, res) => {
  const sql = 'DELETE FROM roles WHERE id = $1';
  const params = [req.params.id];

  pool.query(sql, params, (err: Error, result: QueryResult) => {
    if (err) {
      res.status(400).json({ error: err.message });
    } else {
      res.json({
        message: 'deleted',
        changes: result.rowCount,
        id: req.params.id,
      });
    }
  });
});

//BONUS DELETE an employee
app.delete('/api/employees/:id', (req, res) => {
  const sql = 'DELETE FROM employee WHERE id = $1';
  const params = [req.params.id];

  pool.query(sql, params, (err: Error, result: QueryResult) => {
    if (err) {
      res.status(400).json({ error: err.message });
    } else {
      res.json({
        message: 'deleted',
        changes: result.rowCount,
        id: req.params.id,
      });
    }
  });
});

// // Default response for any other request (Not Found)
app.use((_req, res) => {
  res.status(404).end();
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
