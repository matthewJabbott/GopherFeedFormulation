# Feed Formulation Portal

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`
Runs the app in development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### `npm test -- --verbose`
Launches the test runner in watch mode.

### `npm run build`
Builds the app for production to the `build` folder.\
Optimizes the build for the best performance.

## Testing

Unit tests are written using [Jest](https://jestjs.io/) and [React Testing Library](https://testing-library.com/).

### Libraries & Setup
- **Test Runner**: [Jest](https://jestjs.io/)
- **UI Testing**: [React Testing Library](https://testing-library.com/)
- **Test Environment**: jsdom
- **Setup File**: `src/setupTests.js`
- **TextEncoder Polyfill**: Included via `text-encoding` for compatibility.

### Common Commands:
- `npm install`: Install all the required libraries.
- `npm test -- --verbose`:  Run all unit tests in watch mode with detailed output.

### Test Coverage: 

#### **1. IngredientForm Component:**
Located in: `src/components/__test__/IngredientForm.test.js`
- General Validation
  - Empty ingredient name triggers error message.
  - Ingredient name input limited to 255 characters.
  - "Core Ingredient" checkbox is hidden for member role.
- Input Number Validation
  - Prevents non-numeric input for numeric fields.
  - Limits numeric input to 99999999.99 (matching with the database structure).
  - Rounds input to 2 decimal places.

#### **2. FeedForm Component:**
Located in: `src/components/__test__/FeedForm.test.js`
- General Validation
  - Feed name input limited to 40 characters.
  - Existing feed name triggers error message.
  - Feed description input limited to 100 characters. 
- Percentage Input Validation
  - Prevents non-numeric input for numeric fields.
  - Limits numeric input to 100.50 (no more than the total range).
  - Rounds percentage input to 2 decimal places.
- Cost Input Validation
  - Prevents non-numeric input for numeric fields.
  - Limits numeric input to 99999.99.
  - Rounds cost input to 2 decimal places.
- Carbon Footprint Input Validation
  - Prevents non-numeric input for numeric fields.
  - Limits numeric input to 99999.99.
  - Rounds carbon footprint input to 2 decimal places.

#### **3. UserForm Component:**
Located in: `src/components/__test__/UserForm.test.js`
- Input Length Validation
  - username input limited to 40 characters.
  - firstname input limited to 40 characters.
  - lastname input limited to 40 characters.
  - email input limited to 255 characters.
  - password input limited to 40 characters.
- Username and Email Uniqueness Validation
  - Existing username triggers error message.
  - Existing email triggers error message.  
- Input Validation
  - Empty username triggers error message.
  - Empty firstname triggers error message.
  - Empty lastname triggers error message.
  - Empty email triggers error message.
  - Invalid email triggers error message.
  - Empty password triggers error message.
  - Password failed to match strength criteria triggers error message.