const Router = require('express');
const router = new Router();
const vacancyTypeController = require('../controller/vacancy_type.controller');

router.get('/vacancy_types', vacancyTypeController.getVacancyTypes);

module.exports = router;