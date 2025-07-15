const express = require('express');
const { ClerkExpressRequireAuth } = require('@clerk/clerk-sdk-node');
const { ClerkExpressWithAuth } = require('@clerk/clerk-sdk-node');


class UserRouter {
  constructor(controller) {
    this.router = express.Router();
    this.controller = controller;
    this.setupRoutes();
  }

  setupRoutes() {
    // Webhook route to process Clerk events
    this.router.post("/webhooks", express.raw({ type: 'application/json' }), this.controller.processWebhooks.bind(this.controller));

    // Role checker route
    this.router.get('/getUserRole', ClerkExpressRequireAuth(), this.controller.RoleChecker.bind(this.controller));

    // Route for user update
    this.router.post("/update", ClerkExpressRequireAuth(), express.json(), this.controller.updateUser.bind(this.controller));

    // Route for user deletion - only authenticated users can delete
    this.router.delete('/delete/:ids', ClerkExpressRequireAuth(), this.controller.deleteUsers.bind(this.controller));

    // Route for user add
    this.router.post('/add', ClerkExpressWithAuth(), this.controller.addUser.bind(this.controller));

     //Route for obtaining all users
     this.router.get('/getAll', ClerkExpressRequireAuth(), this.controller.getAllUsers.bind(this.controller));
  }

  getRouter() {
    return this.router;
  }
}

module.exports = UserRouter;
