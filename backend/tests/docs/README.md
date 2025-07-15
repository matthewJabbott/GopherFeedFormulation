# Feed Formulation Portal Testing Documentation

## Test Structure
```
tests/
├── config/         # Test configuration files
├── docs/          # Test documentation
├── integration/   # Integration tests
├── mocks/         # Mock data and mock implementations
└── unit/          # Unit tests
```

## Test Coverage
- **Unit Tests**: Controller-level tests covering core business logic
- **Integration Tests**: API endpoint tests covering full request/response cycle
- **Known Limitations**: 
  - Some integration tests related to database configuration are currently skipped
  - Database mocking is primarily focused on controller-level tests

## Running Tests
```bash
# Run all tests
npm test

# Run unit tests only
npm run test:unit

# Run integration tests only
npm run test:integration

# Generate coverage report
npm run test:coverage
```

## Test Configuration
- Jest is used as the testing framework
- Database operations are mocked for unit tests
- Integration tests use a test database configuration

## Mock Strategy
- Database operations are mocked using `mysql2/promise` mocks
- Authentication is mocked using Clerk SDK mocks
- Test data fixtures are provided in the mocks directory

## Current Status
- 40+ passing controller-specific tests
- Core functionality well covered by unit tests
- Some integration tests pending infrastructure improvements

## Future Improvements
- [ ] Enhance database configuration for integration tests
- [ ] Add more comprehensive API integration tests
- [ ] Improve test data fixtures
- [ ] Add performance testing suite 