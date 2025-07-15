const express = require('express');
const router = express.Router();
const { ClerkExpressRequireAuth } = require('@clerk/clerk-sdk-node');
const logController = require('../controllers/LogController');

router.get('/getAll', ClerkExpressRequireAuth(), logController.getAllLogs);

router.post('/add', ClerkExpressRequireAuth(), logController.addLog);

module.exports = router;