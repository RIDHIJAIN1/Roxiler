const {Router} = require('express');
const InstallationController = require('../Controllers/InstallationController');
const router = Router();
const {getTransactions, getStatistics , getBarChartData , getPieChartData} = require('../Controllers/transaction')


router.get('/', InstallationController.test);
router.get('/init', InstallationController.init);
router.get('/transactions', getTransactions);
router.get('/statistics', getStatistics);
router.get('/bar-chart', getBarChartData);
router.get('/pie-chart', getPieChartData);


module.exports = router;