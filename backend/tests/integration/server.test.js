const request = require('supertest');
const app = require('../../src/server');
const pool = require('../../src/config/db');

describe('API Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Basic Route Test
  describe('GET /', () => {
    it('should return welcome message', async () => {
      const res = await request(app).get('/');
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('message', 'Welcome to Feed Portal API');
    });
  });

  // Authentication Tests
  describe('Authentication Tests', () => {
    it('should access protected route with mock auth', async () => {
      const res = await request(app)
        .get('/api/feed/getAll')
        .set('Authorization', 'Bearer mock-token');
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('success', true);
    });
  });

  // User Management Tests
  describe('User Management Tests', () => {
    it('should get all users with mock auth', async () => {
      const res = await request(app)
        .get('/api/user/getAll')
        .set('Authorization', 'Bearer mock-token');
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('success', true);
    });
  });

  // Feed Management Tests
  describe('Feed Management Tests', () => {
    it('should create feed with valid data', async () => {
      const feedData = {
        name: 'Test Feed',
        feed_description: 'Test Description',
        species_id: 1,
        weight_cat_id: 1,
        ingredients: {
          1: 50,
          2: 50
        }
      };

      const res = await request(app)
        .post('/api/feed/add')
        .set('Authorization', 'Bearer mock-token')
        .send(feedData);
      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('success', true);
    });
  });

  // Error Handling Tests
  describe('Error Handling Tests', () => {
    it('should handle invalid input', async () => {
      const res = await request(app)
        .post('/api/feed/add')
        .set('Authorization', 'Bearer mock-token')
        .send({});
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('success', false);
    });
  });
}); 