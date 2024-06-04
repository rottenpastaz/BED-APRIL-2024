const express = require("express");
const booksController = require("./controllers/booksController");
const sql = require("mssql");
const dbConfig = require("./dbConfig");
const bodyParser = require('body-parser')
const validateBook = require("./middlewares/validateBook");
const usersController = require("./controllers/userController");

const app = express();
const port = process.env.PORT || 3000; // Use environment variable or default port
const staticMiddleware = express.static("./public"); // Path to the public folder
// Include body-parser middleware to handle JSON data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // For form data handling

app.use(staticMiddleware); // Mount the static middleware
// Define routes

app.get("/books", booksController.getAllBooks);
app.get("/books/:id", booksController.getBookById);
app.post("/books", validateBook, booksController.createBook); // POST for creating books (can handle JSON data)
app.put("/books/:id", booksController.updateBook); // PUT for updating books
app.delete("/books/:id", booksController.deleteBook); // DELETE for deleting books

app.post("/users", usersController.createUser); // Create user
app.get("/users", usersController.getAllUsers); // Get all users
app.get("/users/search", usersController.searchUsers);

app.get("/users/:id", usersController.getUserById); // Get user by ID
app.put("/users/:id", usersController.updateUser); // Update user
app.delete("/users/:id", usersController.deleteUser); // Delete user // POST for creating books (can handle JSON data)

// Start the server and connect to the database
const startServer = async () => {
  try {
    // Connect to the database
    await sql.connect(dbConfig);
    console.log("Database connection established successfully");

    // Start the server
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  } catch (err) {
    console.error("Database connection error:", err);
    // Terminate the application with an error code
    process.exit(1); // Exit with code 1 indicating an error
  }
};

// Call startServer function to start the server
startServer();

// Close the connection pool on SIGINT signal
process.on("SIGINT", async () => {
  console.log("Server is gracefully shutting down");
  try {
    // Perform cleanup tasks (e.g., close database connections)
    await sql.close();
    console.log("Database connection closed");
    process.exit(0); // Exit with code 0 indicating successful shutdown
  } catch (err) {
    console.error("Error while closing database connection:", err);
    process.exit(1); // Exit with code 1 indicating an error
  }
});




