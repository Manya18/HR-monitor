const Router = require('express');
const router = new Router();
const MetricsController = require('../controller/metrics.controller');

router.get('/commonMetrics', MetricsController.getCommonMetrics);
router.get('/processedVacancies', MetricsController.getProcessedVacancies);
router.get('/selectionFunnel', MetricsController.getSelectionFunnel);
router.get('/rangeDiagram', MetricsController.getRangeDiagram);
router.get('/rejectedVacancies', MetricsController.getRejectedVacancies);


module.exports = router;