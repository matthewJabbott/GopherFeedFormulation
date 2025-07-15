# Feed Formulation Portal Testing Documentation

## 📖 Table of Contents
1. [Introduction](#introduction)
2. [Test Directory Structure](#test-directory-structure)
3. [Types of Tests](#types-of-tests)
4. [Running Tests](#running-tests)
5. [Test Cases Overview](#test-cases-overview)
6. [Test Results and Coverage](#test-results-and-coverage)
7. [Mocks and Test Data](#mocks-and-test-data)
8. [Troubleshooting](#troubleshooting)

## Introduction

This documentation outlines the comprehensive testing strategy implemented for the Feed Formulation Portal. The testing framework ensures systematic verification of all components, from individual units to integrated systems, maintaining code quality and reliability.

## Test Directory Structure

Our tests are organized like a well-arranged kitchen:

```
tests/
├── config/          # Test settings and configuration
├── docs/           # Test documentation and examples
├── integration/    # Tests that check multiple parts working together
└── mocks/          # Fake data we use for testing
```

## Types of Tests

### 1. Unit Tests 🔍
These test individual pieces of code, like testing a single ingredient:
- **User Management Tests**
  - Creating new users
  - Updating user information
  - Deleting users
  - Checking user roles
  - Validating user input

- **Feed Management Tests**
  - Creating new feed formulas
  - Updating existing formulas
  - Validating feed ingredients
  - Checking nutritional calculations
  - Testing cost optimization

- **Ingredient Management Tests**
  - Adding new ingredients
  - Updating ingredient properties
  - Validating nutrient values
  - Checking ingredient constraints

### 2. Integration Tests 🔄
These test how different parts work together, like checking if ingredients mix well:
- **User-Feed Integration**
  - User creating and managing feeds
  - Permission checks for feed access
  - Feed sharing between users

- **Feed-Ingredient Integration**
  - Adding ingredients to feeds
  - Calculating total nutrition
  - Cost calculations
  - Constraint validation

### 3. API Tests 🌐
Testing our web services, like checking if orders are received correctly:
- **Authentication Tests**
  - Login process
  - Token validation
  - Permission checks
  - Session management

- **Data API Tests**
  - Feed creation endpoints
  - Ingredient management endpoints
  - User management endpoints
  - Error handling

## Test Results and Coverage

### Latest Test Execution Results (Updated: 2024-03-27)

#### Test Suite Summary
- **Total Test Suites**: 5
  - ✅ Passed: 4
  - ❌ Failed: 1
- **Total Tests**: 43
  - ✅ Passed: 40
  - ❌ Failed: 3
- **Execution Time**: 0.329s

#### Passed Test Suites

1. **UserController Tests** ✅
   - ✓ Validate required fields
   - ✓ Validate role
   - ✓ Prevent duplicate users
   - ✓ Create user successfully
   - ✓ Return paginated users list
   - ✓ Validate user ID
   - ✓ Validate role on update
   - ✓ Update user successfully
   - ✓ Validate user ID for deletion
   - ✓ Prevent admin user deletion
   - ✓ Delete user successfully
   - ✓ Validate webhook payload
   - ✓ Handle user.created event
   - ✓ Handle user.deleted event
   - ✓ Reject unsupported events

2. **FeedController Tests** ✅
   - ✓ Validate required fields
   - ✓ Validate ingredients array
   - ✓ Validate total percentage equals 100%
   - ✓ Create feed successfully
   - ✓ Return paginated feeds
   - ✓ Validate feed ID
   - ✓ Update feed successfully
   - ✓ Validate feed ID for deletion
   - ✓ Delete feed successfully

3. **SpeciesController Tests** ✅
   - ✓ Validate required fields
   - ✓ Prevent duplicate species names
   - ✓ Create species successfully
   - ✓ Return paginated species list
   - ✓ Validate species ID
   - ✓ Prevent duplicate names on update
   - ✓ Update species successfully
   - ✓ Validate species ID for deletion
   - ✓ Prevent deletion of species with feeds
   - ✓ Delete species successfully

4. **IngredientController Tests** ✅
   - ✓ Validate required fields
   - ✓ Validate numeric fields
   - ✓ Create ingredient successfully
   - ✓ Return user ingredients and core ingredients

#### Failed Tests (Server Integration Tests)
1. Authentication Tests
   - ❌ Access protected route with mock auth
   - Expected: 200, Received: 500

2. User Management Tests
   - ❌ Get all users with mock auth
   - Expected: 200, Received: 500

3. Feed Management Tests
   - ❌ Create feed with valid data
   - Expected: 200, Received: 400

#### Known Issues
- Database connection errors with SQLite online service
- Authentication middleware requires configuration updates
- Feed creation validation needs adjustment

## Mocks and Test Data

We use fake (mock) data to test our system. It's like using practice ingredients that look and behave like real ones but aren't actually real.

### Example Mock Data:
```javascript
// Example mock user
const mockUser = {
  id: "test-123",
  email: "test@example.com",
  role: "Member"
};

// Example mock feed
const mockFeed = {
  id: "feed-123",
  name: "Test Feed",
  ingredients: [...]
};
```

### Where to Find Mock Data
- User mocks: `tests/mocks/userMocks.js`
- Feed mocks: `tests/mocks/feedMocks.js`
- Ingredient mocks: `tests/mocks/ingredientMocks.js`

## Troubleshooting

### Common Issues and Solutions

1. **Tests Failing to Start**
   - Check if database is running
   - Verify environment variables
   - Ensure all dependencies are installed

2. **Authentication Test Failures**
   - Check if mock tokens are valid
   - Verify Clerk configuration
   - Ensure test environment variables are set

3. **Database Test Failures**
   - Check database connection
   - Verify test database exists
   - Ensure migrations are up to date

### Debug Mode
Run tests in debug mode for more information:
```bash
npm run test:debug
```

## Best Practices for Writing New Tests

1. **Name Your Tests Clearly**
   ```javascript
   // Good
   test('should create new user with valid email', () => {});
   
   // Bad
   test('user test 1', () => {});
   ```

2. **One Assert per Test**
   ```javascript
   // Good
   test('should validate user email', () => {
     expect(isValidEmail('test@example.com')).toBe(true);
   });

   // Bad
   test('should validate user', () => {
     expect(isValidEmail('test@example.com')).toBe(true);
     expect(isValidPassword('password123')).toBe(true);
     expect(isValidName('John')).toBe(true);
   });
   ```

3. **Use Descriptive Error Messages**
   ```javascript
   expect(user.email).toBe('test@example.com',
     'User email should match the provided email');
   ```

## Test Coverage

We aim for high test coverage to ensure our code is reliable:

- 🎯 Current coverage goals:
  - Lines: 80%
  - Functions: 90%
  - Branches: 75%
  - Statements: 80%

To check current coverage:
```bash
npm run test:coverage
```

## Contributing to Tests

When contributing new features or modifications:

1. Implement comprehensive test coverage
2. Update test documentation
3. Execute complete test suite
4. Include coverage analysis
5. Follow established naming conventions
6. Implement proper error handling
7. Document edge cases and assumptions

## Author

**Kush Sharma**  
GitHub: [@Kushsharma1](https://github.com/Kushsharma1)

## Need Help?

If you're stuck:
1. Check this documentation
2. Look at existing test examples
3. Ask in the team chat
4. Create an issue with the "test-help" label

Remember: No question is too simple! We want everyone to understand our testing process. 🌟 