const pool = require('../database/db');

class User {
  constructor() {
    this.pool = pool;
  }
  
  async findOneByUsername(username) {
    let connection;
    try {
      connection = await this.pool.getConnection();
      const [rows] = await connection.query('SELECT * FROM users WHERE username = ?', [username]);
      return rows[0]; // Assuming username is unique, returning the first user found
    } catch (error) {
      throw new Error(`Error finding user by username: ${error.message}`);
    } finally {
      if (connection) connection.release();
    }
  }

  async getAllUsers() {
    let connection;
    try {
      connection = await this.pool.getConnection();
      const [rows] = await connection.query('SELECT * FROM users');
      return rows;
    } catch (error) {
      throw new Error(`Error getting all users: ${error.message}`);
    } finally {
      if (connection) connection.release();
    }
  }

  async createUser({ username, password, role }) {
    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
    let connection;
    try {
      connection = await this.pool.getConnection();
      const [result] = await connection.query('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', [
        username,
        hashedPassword,
        role,
      ]);
      return result.insertId; // Return the ID of the newly inserted user
    } catch (error) {
      throw new Error(`Error creating user: ${error.message}`);
    } finally {
      if (connection) connection.release();
    }
  }

  async updateUser(userId, { username, password, role }) {
    let connection;
    try {
      connection = await this.pool.getConnection();
      const [result] = await connection.query(
        'UPDATE users SET username = ?, password = ?, role = ? WHERE id = ?',
        [username, password, role, userId]
      );
      if (result.affectedRows === 0) {
        throw new Error('User not found or no changes were made');
      }
      return true; // Return true if user was updated successfully
    } catch (error) {
      throw new Error(`Error updating user: ${error.message}`);
    } finally {
      if (connection) connection.release();
    }
  }

  async deleteUser(userId) {
    let connection;
    try {
      connection = await this.pool.getConnection();
      const [result] = await connection.query('DELETE FROM users WHERE id = ?', [userId]);
      if (result.affectedRows === 0) {
        throw new Error('User not found');
      }
      return true; // Return true if user was deleted successfully
    } catch (error) {
      throw new Error(`Error deleting user: ${error.message}`);
    } finally {
      if (connection) connection.release();
    }
  }
}

module.exports = User;
