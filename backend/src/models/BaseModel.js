const db = require('../config/db');

class BaseModel {
  constructor(tableName) {
    this.tableName = tableName;
  }

  async findAll() {
    const [rows] = await db.query(`SELECT * FROM ${this.tableName}`);
    return rows;
  }

  async findById(id) {
    const [rows] = await db.query(`SELECT * FROM ${this.tableName} WHERE id = ?`, [id]);
    return rows[0];
  }
  
  async findByField(field, value) {
    const [rows] = await db.query(
      `SELECT * FROM \`${this.tableName}\` WHERE LOWER(\`${field}\`) = LOWER(?) LIMIT 1`,
      [value]
    );
    return rows[0];
  }

  async create(data) {
    const [result] = await db.query(`INSERT INTO ${this.tableName} SET ?`, [data]);
    return result.insertId;
  }

  async update(id, data) {
    const [result] = await db.query(`UPDATE ${this.tableName} SET ? WHERE id = ?`, [data, id]);
    return result.affectedRows > 0;
  }

  async delete(id) {
    const [result] = await db.query(`DELETE FROM ${this.tableName} WHERE id = ?`, [id]);
    return result.affectedRows > 0;
  }
}

module.exports = BaseModel; 