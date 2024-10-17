const Router = require('express');
const router = new Router();
const candidateDefaultStatusController = require('../controller/candidate_default_status.controller');

router.get('/candidateStatuses', candidateDefaultStatusController.getCandidateDefaultStatus);

module.exports = router;