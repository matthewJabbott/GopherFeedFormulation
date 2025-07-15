const mockConnection = {
  query: jest.fn(),
  execute: jest.fn().mockImplementation((sql, params) => {
    if (sql.includes('INSERT INTO feeds')) {
      return Promise.resolve([{ insertId: 2 }]);
    }
    if (sql.includes('INSERT INTO feed_ingredient_association')) {
      return Promise.resolve([{ affectedRows: 1 }]);
    }
    if (sql.includes('UPDATE')) {
      return Promise.resolve([{ affectedRows: 1 }]);
    }
    if (sql.includes('DELETE')) {
      return Promise.resolve([{ affectedRows: 1 }]);
    }
    return Promise.resolve([{}, {}]);
  }),
  beginTransaction: jest.fn().mockResolvedValue(),
  commit: jest.fn().mockResolvedValue(),
  rollback: jest.fn().mockResolvedValue(),
  release: jest.fn().mockResolvedValue()
};

const mockPool = {
  query: jest.fn().mockImplementation((sql, params) => {
    return mockConnection.query(sql, params);
  }),
  execute: jest.fn().mockImplementation((sql, params) => {
    return mockConnection.execute(sql, params);
  }),
  getConnection: jest.fn().mockResolvedValue(mockConnection)
};

module.exports = {
  mockConnection,
  mockPool
}; 