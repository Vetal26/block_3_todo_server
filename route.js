const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const router = express.Router();

const utils = require('./utils/utils');
const { updatePosition } = require('./utils/utils');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

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
    let todoIdx = content.todos.findIndex(t => t.id === +req.params.id);
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

router.put('/dnd/:id', (req, res) => {
  fs.readFile('./data/todos.json', (err, data) => {
    if (err) {
      throw err;
    }

    let content = JSON.parse(data);
    let currentTodoIdx = content.todos.findIndex(t => t.id === +req.params.id);
    
    let changePosition = (posPrev, posNext) => {
      if (posPrev) {
        let newPos = updatePosition(posPrev);
        if (!posNext || newPos < posNext) {
          return newPos;
        } else {
          do {
            newPos = updatePosition(posPrev);
          } while (newPos > posNext);
          return newPos;
        }
      } else if (!posPrev) {
        return posNext.slice(0, posNext.length - 1)
      }
    }

    if (currentTodoIdx !== -1) {
      content.todos[currentTodoIdx].position = changePosition.apply(this, req.body);
    }
    
    content.todos.sort((a,b) => {
      if (a.position < b.position) return -1;
      if (a.position > b.position) return 1;
      return 0;
    });

    fs.writeFile('./data/todos.json', JSON.stringify(content),  (err) => {
      if (err) {
        return console.error(err);
      }});
  });
  res.status(200).end();
});

module.exports = router;