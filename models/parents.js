const db = require('../database/db');

const addParent = async ({ parentName, email, studentId, studentName }) => {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const [matchingUser] = await connection.execute('SELECT * FROM users WHERE name = ?', [parentName]);

    if (matchingUser.length > 0) {
      const parentId = matchingUser[0].user_id;
      console.log('Matching user found. Setting parentId:', parentId);

      const [existingParent] = await connection.execute('SELECT * FROM parents WHERE parentId = ?', [parentId]);

      if (existingParent.length === 0) {
        await connection.execute(
          'INSERT INTO parents (parentId, parentName, email, studentId, studentName) VALUES (?, ?, ?, ?, ?)',
          [parentId, parentName, email, studentId, studentName]
        );

        console.log('Parent Added:', { parentId, parentName, email, studentId, studentName });
      } else {
        throw new Error('Duplicate entry for parentId');
      }
    } else {
      throw new Error('No matching user found');
    }

    await connection.commit();

    const [insertedParent] = await connection.execute(
      'SELECT * FROM parents WHERE parentId = ?',
      [studentId]
    );

    const response = {
      success: true,
      message: 'Parent added successfully',
      data: insertedParent[0],
    };

    return response;
  } catch (error) {
    await connection.rollback();
    console.error('Error adding parent:', error);

    const response = {
      success: false,
      message: 'Failed to add parent',
      error: error.message, 
    };

    throw response;
  } finally {
    connection.release();
  }
};

const deleteParent = async (parentId) => {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const [existingParent] = await connection.execute(
      'SELECT * FROM parents WHERE parentId = ?',
      [parentId]
    );

    if (existingParent.length === 0) {
      return false;
    }

    await connection.execute('DELETE FROM parents WHERE parentId = ?', [parentId]);

    await connection.commit();

    return true;
  } catch (error) {
    await connection.rollback();
    console.error('Error deleting parent:', error);
    throw new Error('Failed to delete parent');
  } finally {
    connection.release();
  }
};

const updateParent = async (parentId, { parentName, email, studentId, studentName }) => {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    await connection.execute(
      'UPDATE parents SET parentName = ?, email = ?, studentId = ?, studentName = ? WHERE parentId = ?',
      [parentName, email, studentId, studentName, parentId]
    );

    await connection.commit();

    const [updatedParent] = await connection.execute(
      'SELECT * FROM parents WHERE parentId = ?',
      [parentId]
    );

    return updatedParent[0]; 
  } catch (error) {
    await connection.rollback();
    console.error('Error updating parent:', error);
    throw new Error('Failed to update parent');
  } finally {
    connection.release();
  }
};

const getCoursesForParent = async (parentId) => {
  const connection = await db.getConnection();
  try {
    const [rows] = await connection.execute(
      'SELECT * FROM student_courses WHERE studentId IN (SELECT studentId FROM parents WHERE parentId = ?)',
      [parentId]
    );
    return rows;
  } catch (error) {
    console.error('Error retrieving courses for the parent:', error);
    throw new Error('Failed to retrieve courses for the parent');
  } finally {
    connection.release();
  }
};

const getAllPresence = async (studentId) => {
    const connection = await db.getConnection();
    try {
      const [rows] = await connection.execute(
        'SELECT * FROM presence_records WHERE studentId = ?',
        [studentId]
      );
      return rows;
    } catch (error) {
      console.error('Error retrieving presence records:', error);
      throw new Error('Failed to retrieve presence records');
    } finally {
      connection.release();
    }
  };

module.exports = {
  addParent,
  deleteParent,
  updateParent,
  getCoursesForParent,
  getAllPresence,
};
