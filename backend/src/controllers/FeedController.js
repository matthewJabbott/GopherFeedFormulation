const pool = require('../config/db');
const logModel = require('../models/LogModel');

class FeedController {

  // Get all feeds with ingredients and species with search,  pagination, filtering and sorting
  async getAllFeeds(req, res) {
    try {

      const first = parseInt(req.query.page, 10) || 0;
      const rows = parseInt(req.query.itemsPerPage, 10) || 50;
      const sortField = req.query.sortField || 'feed_id';
      const sortOrder = req.query.sortOrder ? req.query.sortOrder.toUpperCase() : 'ASC';
      const globalSearch = req.query.globalSearch || '';

      // Start constructing the WHERE clause for filtering
      let whereClause = '';
      if (globalSearch) {
        whereClause = `WHERE f.name LIKE '%${globalSearch}%' 
                        OR f.feed_description LIKE '%${globalSearch}%'
                        OR s.common_name LIKE '%${globalSearch}%' 
                        OR w.category_name LIKE '%${globalSearch}%' 
                        OR i.name LIKE '%${globalSearch}%'`;
      }
  
      // Fetch all matching records WITHOUT LIMIT and OFFSET
      const [rowsResult] = await pool.query(`
        SELECT 
          f.id AS feed_id,
          f.name AS feed_name,
          f.feed_description,
          s.common_name AS species_name,
          w.category_name AS weight_category_name,
          f.created_at AS created_at,
          i.id AS ingredient_id,
          i.name AS ingredient_name,
          fia.percentage AS percentage,
          u.username AS created_by
        FROM feeds f
        LEFT JOIN species s ON f.species_id = s.id
        LEFT JOIN weight_category w ON f.weight_cat_id = w.id
        LEFT JOIN users u ON f.clerk_id = u.clerk_id
        JOIN feed_ingredient_association fia ON f.id = fia.feed_id
        JOIN ingredients i ON fia.ingredient_id = i.id
        ${whereClause};
      `);
  
      // Group feeds and their ingredients
      const feedsMap = {};
  
      for (const row of rowsResult) {
        const feedID = row.feed_id;
        var species_checked = '';

        if (!row.species_name && !row.weight_category_name) {
          species_checked = 'N/A';
        } else {
          species_checked = row.species_name + ' - ' + row.weight_category_name;
        }
  
        if (!feedsMap[feedID]) {
          feedsMap[feedID] = {
            feed_id: row.feed_id,
            feed_name: row.feed_name,
            feed_description: row.feed_description,
            species: species_checked,
            created_at: row.created_at,
            created_by: row.created_by,
            ingredients: []
          };
        }
  
        feedsMap[feedID].ingredients.push({
          ingredient_id: row.ingredient_id,
          ingredient_name: row.ingredient_name,
          percentage: row.percentage
        });
      }
  
      // Convert map to array
      let feeds = Object.values(feedsMap);
  
      // Sort the feeds
      feeds.sort((a, b) => {
        const fieldA = a[sortField];
        const fieldB = b[sortField];
  
        if (fieldA == null) return 1;
        if (fieldB == null) return -1;
  
        if (typeof fieldA === 'string' && typeof fieldB === 'string') {
          return sortOrder === 'ASC'
            ? fieldA.localeCompare(fieldB)
            : fieldB.localeCompare(fieldA);
        } else {
          return sortOrder === 'ASC'
            ? (fieldA > fieldB ? 1 : -1)
            : (fieldA < fieldB ? 1 : -1);
        }
      });
  
      const totalRecords = feeds.length; // Total number before pagination
  
      // Paginate the results
      const paginatedFeeds = feeds.slice(first, first + rows);
  
      return res.status(200).json({
        data: paginatedFeeds,
        totalRecords
      });
  
    } catch (error) {
      console.error('Error in getAllFeeds:', error);
      res.status(500).json({
        success: false,
        message: 'Server error while fetching feeds'
      });
    }
  }

  // POST: Add a new feed with its ingredients
  async addFeed(req, res) {
    const clerkId = req.auth?.userId;
    const { name, feed_description, species_id, weight_cat_id, ingredients } = req.body;

    // Validate input
    if (!clerkId) {
      return res.status(400).json({
        success: false,
        message: 'Missing required parameter: clerkId'
      });
    }

    // Validate clerkId format
    if (!/^user_[a-zA-Z0-9]+$/.test(clerkId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid clerkId format'
      });
    }

    const errors = [];

    if (!name) errors.push('Feed name is required.');
    if (!feed_description) errors.push('Feed description is required.');
    if (!ingredients || typeof ingredients !== 'object') errors.push('Ingredients must be provided in an object format.');

    if (errors.length > 0) {
      return res.status(400).json({ success: false, errors });
    }

    const connection = await pool.getConnection();

    try {
      
      await connection.beginTransaction();
      const currentDate = new Date().toISOString().slice(0, 10);

      const [result] = await connection.execute(
        'INSERT INTO feeds (name, feed_description, species_id, weight_cat_id, created_at, clerk_id) VALUES (?, ?, ?, ?, ?, ?)',
        [name, feed_description, species_id, weight_cat_id, currentDate, clerkId]  //capturing the user id 
      );

      const feedId = result.insertId;

      const assocStmt = 'INSERT INTO feed_ingredient_association (feed_id, ingredient_id, percentage) VALUES (?, ?, ?)';

      for (const [ingredientId, percentage] of Object.entries(ingredients)) {
        await connection.execute(assocStmt, [feedId, ingredientId, percentage]);
      }

      await connection.commit();

      await logModel.insertLog(
        req.auth.userId,
        'feed',
        `Added new feed: ${name}`,
        req.headers['x-forwarded-for'] || req.ip
      );

      res.status(201).json({
        success: true,
        feedId,
        message: 'Feed - ' + name + ' added successfully.'
      });

    } catch (error) {
      await connection.rollback();
      res.status(500).json({
        success: false,
        message: 'Something went wrong!',
        error: error.message
      });
    } finally {
      connection.release();
    }
  }

  async deleteFeed(req, res) {
    const feedId = parseInt(req.params.id, 10);
    
    if (isNaN(feedId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid feed ID format'
      });
    }

    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();

      const [feedRows] = await connection.query('SELECT name FROM feeds WHERE id = ?', [feedId]);
      const feedName = feedRows.length > 0 ? feedRows[0].name : null;
      if (!feedName) {
        await connection.rollback();
        return res.status(404).json({ success: false, error: 'Feed not found' });
      }

      // 1. Delete ingredient associations
      await connection.query(
        'DELETE FROM feed_ingredient_association WHERE feed_id = ?',
        [feedId]
      );

      // 2. Delete the feed
      const [result] = await connection.query(
        'DELETE FROM feeds WHERE id = ?',
        [feedId]
      );

      if (result.affectedRows === 0) {
        await connection.rollback();
        return res.status(404).json({
          success: false,
          error: 'Feed not found'
        });
      }

      await connection.commit();
      
      await logModel.insertLog(
        req.auth.userId,
        'feed',
        `Deleted feed: ${feedName}`,
        req.headers['x-forwarded-for'] || req.ip
      );

      res.json({
        success: true,
        message: 'Feed and associated ingredients deleted successfully'
      });

    } catch (error) {
      await connection.rollback();
      console.error('Delete feed error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete feed'
      });
    } finally {
      connection.release();
    }
  }

  async updateFeed(req, res) {
    const feedId = parseInt(req.params.id, 10);
    const { name, feed_description, species_id, weight_cat_id, ingredients } = req.body;
  
    // Validate feedId
    if (isNaN(feedId)) {
      return res.status(400).json({ success: false, message: 'Invalid feed ID format' });
    }
  
    // Validate request body
    const errors = [];
    if (!name) errors.push('Feed name is required.');
    if (!feed_description) errors.push('Feed description is required.');
    if (!ingredients || typeof ingredients !== 'object') errors.push('Ingredients must be provided.');
  
    if (errors.length > 0) {
      return res.status(400).json({ success: false, errors });
    }
  
    const connection = await pool.getConnection();
  
    try {
      await connection.beginTransaction();
  
      const [feedRows] = await connection.query('SELECT name FROM feeds WHERE id = ?', [feedId]);
      const oldFeedName = feedRows.length > 0 ? feedRows[0].name : null;
      if (!oldFeedName) {
        await connection.rollback();
        return res.status(404).json({ success: false, message: 'Feed not found' });
      }

      // 1. Update feed metadata
      const [updateResult] = await connection.query(
        'UPDATE feeds SET name = ?, feed_description = ?, species_id = ?, weight_cat_id = ? WHERE id = ?',
        [name, feed_description, species_id, weight_cat_id, feedId]
      );
  
      if (updateResult.affectedRows === 0) {
        await connection.rollback();
        return res.status(404).json({ success: false, message: 'Feed not found' });
      }
  
      // 2. Delete existing ingredient associations
      await connection.query('DELETE FROM feed_ingredient_association WHERE feed_id = ?', [feedId]);
  
      // 3. Insert new ingredient associations
      const assocStmt = 'INSERT INTO feed_ingredient_association (feed_id, ingredient_id, percentage) VALUES (?, ?, ?)';
      for (const [ingredientId, percentage] of Object.entries(ingredients)) {
        await connection.execute(assocStmt, [feedId, ingredientId, percentage]);
      }
  
      await connection.commit();

      await logModel.insertLog(
        req.auth.userId,
        'feed',
        `Updated feed: ${oldFeedName} → ${name}`,
        req.headers['x-forwarded-for'] || req.ip
      );

      res.json({ success: true, message: 'Feed - ' + name + ' Updated successfully.' });
  
    } catch (error) {
      await connection.rollback();
      console.error('Error updating feed:', error);
      res.status(500).json({ success: false, message: 'Error updating feed', error: error.message });
    } finally {
      connection.release();
    }
  }

  async getFeedByUserId(req, res) {
    try {
      const clerkId = req.auth?.userId;
      const page = parseInt(req.query.page, 10) || 1;
      const itemsPerPage = parseInt(req.query.itemsPerPage, 10) || 50;
      const offset = (page - 1) * itemsPerPage;
      const sortField = req.query.sortField || 'id';
      const sortOrder = req.query.sortOrder ? req.query.sortOrder.toUpperCase() : 'ASC';
      const globalSearch = req.query.globalSearch || '';
  
      if (!clerkId) {
        return res.status(400).json({
          success: false,
          message: 'Missing required parameter: clerkId'
        });
      }
  
      if (!/^user_[a-zA-Z0-9]+$/.test(clerkId)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid clerkId format'
        });
      }
  
      // Construct WHERE clause and query params
      let searchClause = '';
      const queryParams = [clerkId];
  
      if (globalSearch) {
        searchClause = `
          AND (
            f.name LIKE ? OR
            f.feed_description LIKE ? OR
            s.common_name LIKE ? OR
            w.category_name LIKE ? OR
            i.name LIKE ?
          )
        `;
        const likeQuery = `%${globalSearch}%`;
        queryParams.push(likeQuery, likeQuery, likeQuery, likeQuery, likeQuery);
      }
  
      queryParams.push(itemsPerPage, offset);
  
      const [rowsResult] = await pool.query(`
        SELECT 
          f.id AS feed_id,
          f.name AS feed_name,
          f.feed_description,
          s.common_name AS species_name,
          w.category_name AS weight_category_name,
          f.created_at AS created_at,
          i.id AS ingredient_id,
          i.name AS ingredient_name,
          fia.percentage AS percentage,
          u.username AS created_by
        FROM feeds f
        LEFT JOIN species s ON f.species_id = s.id
        LEFT JOIN weight_category w ON f.weight_cat_id = w.id
        LEFT JOIN users u ON f.clerk_id = u.clerk_id
        JOIN feed_ingredient_association fia ON f.id = fia.feed_id
        JOIN ingredients i ON fia.ingredient_id = i.id
        WHERE f.clerk_id = ?
        ${searchClause}
      `, queryParams);
  
      const feedsMap = {};
  
      for (const row of rowsResult) {
        const feedID = row.feed_id;
        const species_checked = row.species_name && row.weight_category_name
          ? `${row.species_name} - ${row.weight_category_name}`
          : 'N/A';
  
        if (!feedsMap[feedID]) {
          feedsMap[feedID] = {
            feed_id: row.feed_id,
            feed_name: row.feed_name,
            feed_description: row.feed_description,
            species: species_checked,
            created_at: row.created_at,
            ingredients: []
          };
        }
  
        feedsMap[feedID].ingredients.push({
          ingredient_id: row.ingredient_id,
          ingredient_name: row.ingredient_name,
          percentage: row.percentage
        });
      }

      // Convert map to array
      let feeds = Object.values(feedsMap);
  
      // Sort the feeds
      feeds.sort((a, b) => {
        const fieldA = a[sortField];
        const fieldB = b[sortField];
  
        if (fieldA == null) return 1;
        if (fieldB == null) return -1;
  
        if (typeof fieldA === 'string' && typeof fieldB === 'string') {
          return sortOrder === 'ASC'
            ? fieldA.localeCompare(fieldB)
            : fieldB.localeCompare(fieldA);
        } else {
          return sortOrder === 'ASC'
            ? (fieldA > fieldB ? 1 : -1)
            : (fieldA < fieldB ? 1 : -1);
        }
      });
  
      const totalRecords = feeds.length; // Total number before pagination
  
      // Paginate the results
      const paginatedFeeds = feeds.slice(offset, offset + itemsPerPage);
  
      res.status(200).json({ 
        success: true, 
        data: paginatedFeeds,
        totalRecords,
        itemsPerPage,
        currentPage: page
      });
  
    } catch (error) {
      console.error('[Feed] Error in getByUserId:', error);
      res.status(500).json({ 
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
  
  

}

module.exports = new FeedController();
