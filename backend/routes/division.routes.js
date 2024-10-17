const Router = require('express');
const router = new Router();
const divisionController = require('../controller/division.controller');

router.get('/divisions', divisionController.getDivisions);

module.exports = router;