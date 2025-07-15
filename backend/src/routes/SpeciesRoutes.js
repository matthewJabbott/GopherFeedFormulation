const express = require('express');
const router = express.Router();
const SpeciesController = require('../controllers/SpeciesController');
const { ClerkExpressRequireAuth } = require('@clerk/clerk-sdk-node');

// Get all species
router.get('/', ClerkExpressRequireAuth(), SpeciesController.getAll);

// Get species by ID
router.get('/:id', ClerkExpressRequireAuth(), SpeciesController.getById);

// Create new species
router.post('/', ClerkExpressRequireAuth(), SpeciesController.create);

// Update species
router.put('/:id', ClerkExpressRequireAuth(), SpeciesController.update);

// Delete species
router.delete('/:id', ClerkExpressRequireAuth(), SpeciesController.delete);

module.exports = router;
