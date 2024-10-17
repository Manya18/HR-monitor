const Router = require('express');
const router = new Router();
const hrsController = require('../controller/hr.controller');

router.get('/hrs', hrsController.getHRs);

module.exports = router;