const BaseModel = require('./BaseModel');
const db = require('../config/db');

class LogModel extends BaseModel {
  constructor() {
    super();
    this.tableName = 'logs';
  }

  async insertLog(clerkId, category, description, ipAddress) {
    const query = `INSERT INTO ${this.tableName} (clerk_id, category, description, ip_address) VALUES (?, ?, ?, ?)`;
    const [result] = await db.query(query, [clerkId, category, description, ipAddress]);
    return result.insertId;
  }

  async getAllLogs({ page = 0, rows = 10, sortField = 'timestamp', sortOrder = 'DESC', filters = {} }) {
    const offset = page * rows;
  
    let whereClauses = [];
    let values = [];
  
    // Global search
    if (filters.global?.value) {
      const search = `%${filters.global.value}%`;
      whereClauses.push(`(
        logs.timestamp LIKE ? OR
        users.username LIKE ? OR
        users.email LIKE ? OR
        logs.description LIKE ? OR
        logs.category LIKE ? OR
        logs.ip_address LIKE ?
      )`);
      values.push(search, search, search, search, search);
    }
  
    // Individual column filters
    const fields = {
      timestamp: 'logs.timestamp',
      username: 'users.username',
      email: 'users.email',
      description: 'logs.description',
      category: 'logs.category',
      ip_address: 'logs.ip_address',
    };
  
    for (const key in filters) {
      if (key !== 'global' && filters[key]?.value) {
        whereClauses.push(`${fields[key]} LIKE ?`);
        values.push(`%${filters[key].value}%`);
      }
    }
  
    const whereSQL = whereClauses.length ? `WHERE ${whereClauses.join(' AND ')}` : '';
    const orderSQL = sortField ? `ORDER BY ${fields[sortField] || 'logs.timestamp'} ${sortOrder === -1 ? 'DESC' : 'ASC'}` : '';
    const limitSQL = `LIMIT ? OFFSET ?`;
  
    // Add pagination values
    values.push(rows, offset);
  
    const [rowsResult] = await db.query(
      `
      SELECT 
        logs.id AS log_id,
        users.username,
        users.email,
        logs.category,
        logs.description,
        logs.ip_address,
        logs.timestamp
      FROM ${this.tableName}
      INNER JOIN users ON logs.clerk_id = users.clerk_id
      ${whereSQL}
      ${orderSQL}
      ${limitSQL}
      `,
      values
    );
  
    // Total count for pagination
    const [countResult] = await db.query(
      `
      SELECT COUNT(*) AS total
      FROM ${this.tableName}
      INNER JOIN users ON logs.clerk_id = users.clerk_id
      ${whereSQL}
      `,
      values.slice(0, values.length - 2) // remove LIMIT & OFFSET for count
    );
  
    return { logs: rowsResult, totalRecords: countResult[0].total };
  }
  
}

module.exports = new LogModel();