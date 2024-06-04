const User = require("../models/user");

// Controller function to create a new user
const createUser = async (req, res) => {
  try {
    const userData = req.body;
    const newUser = await User.createUser(userData);
    res.status(201).json({ message: "User created successfully", user: newUser });
  } catch (error) {
    res.status(500).json({ message: "Error creating user", error: error.message });
  }
};

// Controller function to get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving users", error: error.message });
  }
};

// Controller function to get a user by ID
const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.getUserById(userId);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error retrieving user", error: error.message });
  }
};


// Controller function to update a user
const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const updatedData = req.body;
    const updatedUser = await User.updateUser(userId, updatedData);
    if (updatedUser) {
      res.status(200).json({ message: "User updated successfully", user: updatedUser });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error updating user", error: error.message });
  }
};

// Controller function to delete a user
const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const success = await User.deleteUser(userId);
    if (success) {
      res.status(200).json({ message: "User deleted successfully" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error: error.message });
  }
};


// ... existing controller functions ...

async function searchUsers(req, res) {
  const searchTerm = req.query.searchTerm; // Extract search term from query params

  try {    
    const users = await User.searchUsers(searchTerm);
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error searching users" });
  }
}
async function getUsersWithBooks(req, res) {
    try {
      const users = await User.getUsersWithBooks();
      res.json(users);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error fetching users with books" });
    }
  
};

  

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    searchUsers,
    getUsersWithBooks,
  };
