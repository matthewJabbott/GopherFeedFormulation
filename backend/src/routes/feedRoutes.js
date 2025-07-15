const express = require("express");
const router = express.Router();
const { ClerkExpressRequireAuth } = require("@clerk/clerk-sdk-node");
const FeedController = require("../controllers/FeedController");

// Get all feeds
router.get("/getAll", ClerkExpressRequireAuth(), FeedController.getAllFeeds);

// Add new feed
router.post("/add", ClerkExpressRequireAuth(), FeedController.addFeed);

// Delete feed by ID
router.delete("/delete/:id", ClerkExpressRequireAuth(), FeedController.deleteFeed);

// Update feed by ID
router.put("/update/:id", ClerkExpressRequireAuth(), FeedController.updateFeed);

// Get feed by User's Clerk ID
router.get("/getByUserId", ClerkExpressRequireAuth(), FeedController.getFeedByUserId);

module.exports = router;
