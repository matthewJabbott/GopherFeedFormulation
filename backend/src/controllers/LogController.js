const logModel = require('../models/LogModel');

class LogController {
  async getAllLogs(req, res) {
    try {
      const lazyParams = req.query.lazyParams;
      
      const {
        page = 0,
        rows = 10,
        sortField = 'timestamp',
        sortOrder = -1,
        filters = {}
      } = lazyParams;    
  
      const result = await logModel.getAllLogs({
        page: parseInt(page) || 0,
        rows: parseInt(rows) || 10,
        sortField,
        sortOrder: parseInt(sortOrder),
        filters: filters,
      });
  
      res.status(200).json({
        success: true,
        message: 'Logs fetched successfully',
        data: result
      });
    } catch (error) {
      console.error('Error fetching logs:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch logs',
        error: error.message
      });
    }
  }  

  async addLog(req, res) {
    try {
      const { clerkId, category, description } = req.body;
      const ipAddress = req.headers['x-forwarded-for'] || req.ip;

      const missingFields = [];
      if (!clerkId) missingFields.push('clerkId');
      if (!category) missingFields.push('category');
      if (!description) missingFields.push('description');

      if (missingFields.length > 0) {
        return res.status(400).json({ message: `Missing fields: ${missingFields.join(', ')}` });
      }

      const logId = await logModel.insertLog(clerkId, category, description, ipAddress);
      res.status(201).json({ message: 'Log added successfully', logId });
    } catch (error) {
      console.error('Error adding log:', error);
      res.status(500).json({ message: 'Failed to add log' });
    }
  }
}

module.exports = new LogController();