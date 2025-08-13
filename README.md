
this is a rebase test # Feed Formulation Portal - MERN Stack Application


# Feed Formulation Portal - MERN Stack Application
And this line should happen if we rebased.

A modern web portal for feed formulation management, built with the MERN stack (MySQL, Express.js, React.js, Node.js) and Clerk.js for authentication.


## Features

- User Authentication with Clerk.js
- Protected Routes
- Modern UI with PrimeReact
- RESTful API Architecture
- MySQL Database Integration
- Responsive Design

## Test Status ✅

The following core functionality tests are passing:

### Controller Tests
- Feed Management: Create, Read, Update, Delete operations
- Ingredient Management: Core ingredients, permissions, validation
- Species Management: Species operations and validation
- User Management: Authentication and role management

### Validation Tests
- Input data validation
- Required fields checking
- Numeric field validation
- Permission validation

All critical business logic is covered by passing tests.

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or higher)
- MySQL (v8 or higher)
- npm or yarn package manager
- Git

## Project Structure

```
mern-feed-portal/
├── backend/
│   ├── src/
│   │   ├── config/         # Database and other configurations
│   │   ├── controllers/    # Route controllers
│   │   ├── models/        # Database models
│   │   ├── routes/        # API routes
│   │   ├── services/      # Business logic
│   │   ├── utils/         # Utility functions
│   │   ├── middleware/    # Custom middleware
│   │   └── server.js      # Main server file
│   ├── sql/              # SQL files for database setup
│   ├── .env              # Environment variables
│   └── package.json      # Backend dependencies
│
└── frontend/
    ├── public/           # Static files
    ├── src/
    │   ├── components/   # React components
    │   ├── pages/        # Page components
    │   ├── services/     # API services
    │   ├── utils/        # Utility functions
    │   └── App.js        # Main React component
    ├── .env             # Frontend environment variables
    └── package.json     # Frontend dependencies
```

## Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd FeedFormulationPortalV2
```

### 2. Create Your Feature Branch

Before starting work, create a new branch following this format:
```bash
git checkout -b username/feature-name
```

For example:
```bash
git checkout -b kush/update-feed-api
```

Branch naming convention:
- Use your username followed by a forward slash
- Use hyphens to separate words in the feature name (not underscores)
- Keep feature names descriptive but concise
- Use lowercase letters
- Include the type of change (e.g., api, fix, feat, docs)
- Follow the pattern: `username/type-description`

Examples of valid branch names:
- `john/feat-add-user-auth`
- `sarah/api-update-feed`
- `mike/fix-db-connection`
- `alice/docs-update-readme`
- `bob/api-delete-ingredient`

Note: We use hyphens instead of underscores for better readability and consistency with our API naming conventions.

### 3. Environment Setup

1. Download the environment files:
   - Backend .env file: [Download here](https://deakin365.sharepoint.com/:u:/r/sites/GopherIndustries2/Shared%20Documents/Feed%20Formulation%20Portal/env%20-%20Backend?csf=1&web=1&e=CcLlgQ)
   - Frontend .env file: [Download here](https://deakin365.sharepoint.com/:u:/r/sites/GopherIndustries2/Shared%20Documents/Feed%20Formulation%20Portal/env%20-%20Frontend?csf=1&web=1&e=NFZWjd)
   
   OR if you prefer to get them from Teams:
   - Navigate to the project's Files tab in Teams
   - Download `env - Backend` and `env - Frontend`
   - Place them in their respective directories and change both file names to `.env`

2. Update the database credentials in `backend/.env`:
```
DB_HOST=localhost
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=feed_portal
```

### 4. Database Setup

1. Create a new MySQL database:
```sql
CREATE DATABASE feed_portal;
```

2. Set up the tables using the SQL files in `backend/sql/`:
   - First, run `ingredients.sql` to create the ingredients table
   - Then, run `feeds.sql` to create the feeds and association tables

You can run these files using MySQL command line or a tool like MySQL Workbench:
```bash
mysql -u your_username -p feed_portal < backend/sql/ingredients.sql
mysql -u your_username -p feed_portal < backend/sql/feed.sql
```

### 5. Install Dependencies

Backend:
```bash
cd backend
npm install
```

Frontend:
```bash
cd frontend
npm install
```

### 6. Start the Application

1. Start the backend server:
```bash
cd backend
npm run dev
```

2. Start the frontend development server:
```bash
cd frontend
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

### 7. Login Credentials

Use the following credentials to log in to the application:
- Email: testuser@feedportal.com
- Password: O1PsEVa3I1

## Development Guidelines

### Code Style

- Use ESLint and Prettier for code formatting
- Follow the existing project structure
- Write meaningful commit messages
- Create feature branches for new development

### API Development

- Follow RESTful API conventions
- All endpoints should follow the pattern `/api/{resource}/{action}`
  - GET requests: `/api/{resource}/getAll`
  - POST requests: `/api/{resource}/add`
  - DELETE requests: `/api/{resource}/delete/:id`
  - PUT requests: `/api/{resource}/update/:id`
- All routes must be protected with ClerkExpressRequireAuth()
- Use consistent response format:
  - Success responses: `{ message: "Success message" }`
  - Error responses: `{ message: "Error description" }`
- Use the base controller and router classes for CRUD operations
- Implement proper error handling and validation
- Add input validation for all endpoints

Examples:
```
GET    /api/ingredient/getAll      # Get all ingredients
POST   /api/ingredient/add         # Add new ingredient
DELETE /api/ingredient/delete/:id  # Delete ingredient by ID
GET    /api/feed/getAll           # Get all feeds
POST   /api/feed/add              # Add new feed
```

### Frontend Development

- Use functional components with hooks
- Follow PrimeReact best practices
- Implement responsive design
- Use proper state management

## Available Scripts

### Backend
- `npm run dev`: Start development server with nodemon
- `npm start`: Start production server
- `npm test`: Run tests

### Frontend
- `npm start`: Start development server
- `npm build`: Build for production
- `npm test`: Run tests
- `npm eject`: Eject from create-react-app

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

### For support, please contact the project lead or write your concern in the project's MS Teams chat channels.

### Author

- **Kush Sharma** - [@Kushsharma1](https://github.com/Kushsharma1)

## Last updated

June 2024
