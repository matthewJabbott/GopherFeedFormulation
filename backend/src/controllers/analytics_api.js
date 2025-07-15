const db = require('../config/db');

const getUsersCounts = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT COUNT(*) AS total FROM users;');
    res.status(200).json({ total: rows[0].total });
  } catch (error) {
    console.error('Error in getUsers:', error);
    res.status(500).json({ message: 'Server error fetching users' });
  }
}

const getFeedsCounts = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT COUNT(*) AS total FROM feeds;');
    res.status(200).json({ total: rows[0].total });
  } catch (error) {
    console.error('Error in getFeeds:', error);
    res.status(500).json({ message: 'Server error fetching feeds' });
  }
}

const getIngredientCounts = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT COUNT(*) AS total FROM ingredients;');
    res.status(200).json({ total: rows[0].total });
  } catch (error) {
    console.error('Error in getSpecies:', error);
    res.status(500).json({ message: 'Server error fetching species' });
  }
}

const getFeedsPerSpecies = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT s.common_name AS species, COUNT(f.id) AS feedCount
      FROM feeds f
      JOIN species s ON f.species_id = s.id
      GROUP BY s.common_name;
    `);
    res.status(200).json(rows); 
  } catch (error) {
    console.error('Error in getFeedsPerSpecies:', error);
    res.status(500).json({ message: 'Server error fetching feeds per species' });
    console.error('Error fetching feeds per species:', error);
  }
};

const getIngredientUsage = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT i.Name, COUNT(fia.ingredient_id) AS usageCount
      FROM feed_ingredient_association fia
      JOIN ingredients i ON fia.ingredient_id = i.id
      GROUP BY i.Name;
    `);
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error in getIngredientUsage:', error);
    res.status(500).json({ message: 'Server error fetching ingredient usage' });
  }
};

module.exports = {
  getUsersCounts,
  getFeedsCounts,
  getIngredientCounts,
  getFeedsPerSpecies,
  getIngredientUsage
}; 