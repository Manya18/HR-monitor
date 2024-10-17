const Router = require('express');
const router = new Router();
const vacancyController = require('../controller/vacancy.controller');

router.post('/vacancy', vacancyController.createVacancy);
router.get('/vacancies', vacancyController.getVacancies);
router.get('/vacancy/:id', vacancyController.getVacancy);

module.exports = router;