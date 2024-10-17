const Router = require('express');
const router = new Router();
const taskController = require('../controller/task.controller');

router.get('/tasks', taskController.getTasks);
router.get('/task/:id', taskController.getTask);

module.exports = router;