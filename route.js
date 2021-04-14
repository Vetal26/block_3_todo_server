const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const router = express.Router();

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.get('/', (req, res) => {
  res.send('Hello World!!!');
});

router.get('/todos', (req, res) => {
  fs.readFile('./data/todos.json', (err, data) => {
    const content = JSON.parse(data);
    res.json(content);
  });
});

router.post('/todos', (req, res) => {
  fs.readFile('./data/todos.json', (err, data) => {
    if (err) throw err;
    let content = JSON.parse(data);
    content.todos.push(req.body);
    fs.writeFile('./data/todos.json', JSON.stringify(content), (err) => {
      if (err) throw err;
      console.log("JSON data is saved.");
    });
  });
  res.status(200).end();
});

router.delete('/todos', (req, res) => {
  fs.readFile('./data/todos.json', (err, data) => {
    if (err) {
      throw err;
    }
    let content = JSON.parse(data);
    for (id of req.body) {
      let idx = content.todos.findIndex(t => t.id === id);
      content.todos.splice(idx, 1);
    }
    fs.writeFile('./data/todos.json', JSON.stringify(content),  (err) => {
      if (err) {
        return console.error(err);
      }});
  });
  res.status(200).end();
});

router.delete('/todos/:id', (req, res) => {
  fs.readFile('./data/todos.json', (err, data) => {
    if (err) {
      throw err;
    }
    let content = JSON.parse(data);
    let idx = content.todos.findIndex(t => t.id === +req.params.id);
    content.todos.splice(idx, 1);
    fs.writeFile('./data/todos.json', JSON.stringify(content),  (err) => {
      if (err) {
        return console.error(err);
      }});
  });
  res.status(200).end();
});

router.put('/todos/:id', (req, res) => {
  fs.readFile('./data/todos.json', (err, data) => {
    if (err) {
      throw err;
    }
    let content = JSON.parse(data);
    let todoIdx = content.todos.findIndex(t => t.id === +req.params.id)
    if (todoIdx !== -1) {
      content.todos[todoIdx].isDone = !content.todos[todoIdx].isDone;
    }
    fs.writeFile('./data/todos.json', JSON.stringify(content),  (err) => {
      if (err) {
        return console.error(err);
      }});
  });
  res.status(200).end();
});

router.put('/todos', (req, res) => {
  fs.readFile('./data/todos.json', (err, data) => {
    if (err) {
      throw err;
    }
    let content = JSON.parse(data);
    content.todos.forEach(todo => {
      todo.isDone = req.body[0];
    });
    fs.writeFile('./data/todos.json', JSON.stringify(content),  (err) => {
      if (err) {
        return console.error(err);
      }});
  });
  res.status(200).end();
});

router.put('/todos/:idf/:ids', (req, res) => {
  fs.readFile('./data/todos.json', (err, data) => {
    if (err) {
      throw err;
    }
    let content = JSON.parse(data);
    let currentTodoIdx = content.todos.findIndex(t => t.id === +req.params.idf)
    let currentTodo = content.todos.splice(currentTodoIdx, 1);
    if (+req.params.ids) {
      let prevTodoIdx = content.todos.findIndex(t => t.id === +req.params.ids);
      content.todos.splice(prevTodoIdx + 1, 0, currentTodo[0]);
    } else if (!+req.params.ids) {
      content.todos.unshift(currentTodo[0]);
    }
    fs.writeFile('./data/todos.json', JSON.stringify(content),  (err) => {
      if (err) {
        return console.error(err);
      }});
  });
  res.status(200).end();
});

module.exports = router;