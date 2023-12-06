const users = []; // Your user data store, ideally should be a database

// Function to get a user by email
const getUserByEmail = (email) => {
  return users.find((user) => user.email === email);
};

// Function to create a new user
const createUser = ({ email, password }) => {
  const newUser = {
    email,
    password, // Note: You should hash the password before saving it in a production environment
    // Add more user attributes as needed
  };
  users.push(newUser);
  return newUser;
};

module.exports = {
  getUserByEmail,
  createUser,
};