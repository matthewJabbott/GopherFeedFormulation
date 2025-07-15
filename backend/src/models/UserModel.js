const BaseModel = require('./BaseModel');
const db = require('../config/db');

class UserModel extends BaseModel {
  constructor() {
    super('users');
  }

  async findByClerkID(clerkID) {
    const [rows] = await db.query(`SELECT * FROM ${this.tableName} WHERE clerk_id = ?`, [clerkID]);
    return rows[0];
  }

  async updateByClerkID(clerkID, data) {
    const [result] = await db.query(`UPDATE ${this.tableName} SET ? WHERE clerk_id = ?`, [data, clerkID]);
    return result.affectedRows > 0;
  }

  async deleteManyByClerkID(clerkIds) {
    if (!Array.isArray(clerkIds) || clerkIds.length === 0) {
      return { affectedRows: 0 };
    }
    const placeholders = clerkIds.map(() => '?').join(', ');
    const sql = `DELETE FROM \`${this.tableName}\` WHERE clerk_id IN (${placeholders})`;
    const [result] = await db.query(sql, clerkIds);
    return result; 
  }

  async deleteByClerkID(clerkID) {
    const [result] = await db.query(`DELETE FROM ${this.tableName} WHERE clerk_id = ?`, [clerkID]);
    return result.affectedRows > 0;
  }

  async updateUser(id, data) {
    const [result] = await db.query(`UPDATE ${this.tableName} SET ? WHERE clerk_id = ?`, [data, id]);
    return result.affectedRows > 0;
  }

  async findByField(field, value) {
    const [rows] = await db.query(`SELECT * FROM ${this.tableName} WHERE \`${field}\` = ? LIMIT 1`, [value]);
    return rows[0]; 
  }

  async getAllUsers(req, res) {
    try {
      const users = await this.model.findAll(); 
      return res.status(200).json({
        success: true,
        message: 'Users retrieved successfully',
        data: users
      });
    } catch (error) {
      console.error('Error fetching users:', error);
      return res.status(500).json({
        success: false,
        message: 'Error fetching users',
        error: error.message
      });
    }
  }

}

module.exports = UserModel;