const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const db = require('./database/db'); // Ensure this path is correct

function initialize(passport) {
  const authenticateUser = async (email, password, done) => {
    let connection;
    try {
      connection = await db.getConnection();
      const [users] = await connection.query('SELECT * FROM users WHERE email = ?', [email]);

      if (users.length > 0) {
        const user = users[0];
        if (await bcrypt.compare(password, user.password)) {
          return done(null, user);
        } else {
          return done(null, false, { message: 'Password incorrect' });
        }
      } else {
        return done(null, false, { message: 'No user with that email' });
      }
    } catch (e) {
      return done(e);
    } finally {
      if (connection) {
        connection.release();
      }
    }
  };

  passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser));

  passport.serializeUser((user, done) => done(null, user.id));

  passport.deserializeUser(async (id, done) => {
    let connection;
    try {
      connection = await db.getConnection();
      const [users] = await connection.query('SELECT * FROM users WHERE id = ?', [id]);
      if (users.length > 0) {
        return done(null, users[0]);
      } else {
        return done(new Error('User not found'));
      }
    } catch (e) {
      return done(e);
    } finally {
      if (connection) {
        connection.release();
      }
    }
  });
}

module.exports = initialize;
