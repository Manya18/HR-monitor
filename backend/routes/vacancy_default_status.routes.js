const Router = require('express');
const router = new Router();
const vacancyDefaultStatusController = require('../controller/vacancy_default_status.controller');

router.get('/vacancyStatuses', vacancyDefaultStatusController.getVacancyDefaultStatus);

module.exports = router;