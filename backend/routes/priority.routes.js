const Router = require('express');
const router = new Router();
const priorityController = require('../controller/priority.controller');

router.get('/priorities', priorityController.getPriorities);

module.exports = router;