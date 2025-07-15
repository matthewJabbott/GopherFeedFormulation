const express = require('express');
const { ClerkExpressRequireAuth } = require('@clerk/clerk-sdk-node');

class BaseRouter {
  constructor(controller) {
    this.router = express.Router();
    this.controller = controller;
    this.setupRoutes();
  }

  setupRoutes() {
    // 1) Defining all FIRST for pagination
    this.router.get('/all', ClerkExpressRequireAuth(), this.controller.getAll.bind(this.controller));

    //  defining the dynamic :id route
    this.router.get('/:id', ClerkExpressRequireAuth(), this.controller.getById.bind(this.controller));

    // to GET all items, 
    // this.router.get('/', ClerkExpressRequireAuth(), this.controller.getAll.bind(this.controller));

    // Create a new item
    this.router.post('/', ClerkExpressRequireAuth(), this.controller.create.bind(this.controller));

    // Update item by ID
    this.router.put('/:id', ClerkExpressRequireAuth(), this.controller.update.bind(this.controller));

    // Delete item by ID
    this.router.delete('/:id', ClerkExpressRequireAuth(), this.controller.delete.bind(this.controller));
  }

  getRouter() {
    return this.router;
  }
}

module.exports = BaseRouter;
