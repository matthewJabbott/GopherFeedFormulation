const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { ClerkExpressRequireAuth } = require('@clerk/clerk-sdk-node');
const BaseController = require('./controllers/BaseController');
const UserController = require('./controllers/UserController');
const BaseRouter = require('./routes/BaseRouter');
const UserRouter = require('./routes/UserRouter');
const UserModel = require('./models/UserModel');
const BaseModel = require('./models/BaseModel');
const { ClerkExpressWithAuth } = require('@clerk/clerk-sdk-node');

// Load environment variables
dotenv.config();

const app = express();

// Middleware to log the Authorization token
app.use((req, res, next) => {
  console.log("Authorization Header:", req.headers['authorization']);
  next();
});


// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Feed Portal API' });
});

// Protected route example (still left for reference)
app.get('/protected', ClerkExpressRequireAuth(), (req, res) => {
  if (!req.auth) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  res.json({ 
    message: 'This is a protected route', 
    user: {
      id: req.auth.userId,
      username: req.auth.username || 'Anonymous'
    }
  });
});

// Initialize models
const userModel = new UserModel();

// Initialize controllers
const userController = new UserController(userModel);

// Initialize routers
const userRouter = new UserRouter(userController);

// Mount routers with authentication
app.use('/api/feed', ClerkExpressRequireAuth(), require('./routes/feedRoutes'));
app.use('/api/ingredient', ClerkExpressRequireAuth(), require('./routes/IngredientRoutes'));
app.use('/api/species', ClerkExpressRequireAuth(), require('./routes/SpeciesRoutes'));
app.use('/api/user', userRouter.getRouter());
app.use('/api/log', ClerkExpressRequireAuth(), require('./routes/LogRoutes'));
app.use('/api/dashboard', ClerkExpressRequireAuth(), require('./routes/AnalyticsRoutes'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
const PORT = process.env.PORT || 5001;
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

// Enables req.auth
app.use(ClerkExpressWithAuth());

module.exports = app;  