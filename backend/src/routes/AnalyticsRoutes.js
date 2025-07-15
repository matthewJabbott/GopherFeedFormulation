const express = require('express');
const router = express.Router();
const analyticsApi = require('../controllers/analytics_api');

router.get('/getUsersCounts', analyticsApi.getUsersCounts);
router.get('/getFeedsCounts', analyticsApi.getFeedsCounts);
router.get('/getIngredientCounts', analyticsApi.getIngredientCounts);
router.get('/getFeedsPerSpecies', analyticsApi.getFeedsPerSpecies);
router.get('/getIngredientUsage', analyticsApi.getIngredientUsage);

module.exports = router; 