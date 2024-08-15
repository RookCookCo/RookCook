# RookCook mernRC

This folder contains the core components of the RookCook application, built on the MERN stack (MongoDB, Express, React, Node.js). The `mernRC` directory is organized into separate sections for frontend and backend development, providing a structured approach to building and maintaining the application.

## Structure

- **Frontend (`src` folder)**: Contains all the components, styles, and assets needed to build the user interface of the application.
- **Backend (`backend` folder)**: Includes server setup and database models, handling data processing and storage.

## Installation

To set up the RookCook application locally, follow these steps:

1. **Navigate to the mernRC Directory**:
   ```bash
   cd /[path to project]/RookCook/mernRC
   ```

2. **Install Dependencies and Build Assets**:
   ```bash
   npm install
   npm run build
   ```

3. **Start Local Server**:
   ```bash
   npm start
   ```

## Frontend Development

The frontend code is located in the `src` folder. This directory includes:

- **Components**: React components that define the UI elements.
- **Styles**: CSS files for styling the application.
- **Assets**: Images and other static files used in the UI.

## Backend Development

The backend logic is housed in the `backend` folder. This directory includes:

- **Server Setup**: Configuration for running the Node.js server.
- **Database Models**: Mongoose models for interacting with MongoDB.

### Database Setup

1. Navigate to the backend directory:
   ```bash
   cd /[path to project]/RookCook/mernRC/backend
   ```
2. Install backend dependencies:
   ```bash
   npm install
   ```
   - If a dependency is missing, such as `mongoose`, install it separately:
     ```bash
     npm install mongoose
     ```
3. Start the backend server:
   ```bash
   node server.js
   ```

## Notes

- Please refer only to the `src` and `backend` folders for development. Other directories were part of the initial MERN stack installation and have not been modified.
- The application is configured to use a single server setup in the backend for simplicity and efficiency.

## Contributing

We welcome contributions to improve RookCook. Please ensure your code follows our coding standards and is well-documented.

## Contact

For questions or support, please contact us at rookcookco@gmail.com.

Thank you for contributing to RookCook!
