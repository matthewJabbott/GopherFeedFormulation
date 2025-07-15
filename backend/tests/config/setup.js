// Set up test environment variables
process.env.DB_HOST = 'localhost';
process.env.DB_USER = 'test_user';
process.env.DB_PASSWORD = 'test_password';
process.env.DB_NAME = 'test_db';
process.env.NODE_ENV = 'test';

// Mock Clerk authentication
jest.mock('@clerk/clerk-sdk-node', () => ({
  ClerkExpressRequireAuth: () => (req, res, next) => {
    req.auth = {
      userId: 'test_clerk_id',
      username: 'test-user'
    };
    next();
  },
  ClerkExpressWithAuth: () => (req, res, next) => {
    req.auth = {
      userId: 'test_clerk_id',
      username: 'test-user'
    };
    next();
  }
}));

// Import mock data
const mockData = require('../mocks/data');
const { mockConnection, mockPool } = require('../mocks/db');

// Mock mysql2/promise with our mock pool
jest.mock('mysql2/promise', () => ({
  createPool: jest.fn().mockReturnValue(mockPool)
}));

// Reset all mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
  Object.assign(mockConnection.query, {
    mockImplementation: (sql, params) => {
      if (sql.includes('SELECT') && sql.includes('users')) {
        return Promise.resolve([mockData.users, []]);
      }
      if (sql.includes('SELECT') && sql.includes('feeds')) {
        return Promise.resolve([mockData.feeds, []]);
      }
      if (sql.includes('SELECT') && sql.includes('species')) {
        return Promise.resolve([mockData.species, []]);
      }
      if (sql.includes('SELECT') && sql.includes('ingredients')) {
        return Promise.resolve([mockData.ingredients, []]);
      }
      if (sql.includes('INSERT INTO feeds')) {
        return Promise.resolve([{ insertId: 2 }]);
      }
      if (sql.includes('INSERT INTO feed_ingredient_association')) {
        return Promise.resolve([{ affectedRows: 1 }]);
      }
      return Promise.resolve([[], []]);
    }
  });
}); 