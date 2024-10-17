const Router = require('express');
const router = new Router();
const candidateController = require('../controller/candidate.controller');

router.get('/candidates', candidateController.getCandidates);
router.put('/candidate/:id', candidateController.updateCandidateStatus);
router.get('/candidate/:id', candidateController.getCandidate);

module.exports = router;