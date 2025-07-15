const express = require('express');
const router = express.Router();
const { ClerkExpressRequireAuth } = require('@clerk/clerk-sdk-node');
const IngredientController = require('../controllers/IngredientController');

// Protected routes
router.get('/getAll', ClerkExpressRequireAuth(), IngredientController.getAllIngredients.bind(IngredientController));
router.post('/add', ClerkExpressRequireAuth(), IngredientController.create.bind(IngredientController));
router.delete('/delete/:id', ClerkExpressRequireAuth(), IngredientController.deleteIngredient.bind(IngredientController));
router.get('/getByUserId', ClerkExpressRequireAuth(), IngredientController.getIngredientByUserId.bind(IngredientController));

module.exports = router;
