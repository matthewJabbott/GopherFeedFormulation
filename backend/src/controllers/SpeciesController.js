const BaseController = require("./BaseController");
const SpeciesModel = require("../models/SpeciesModel");
const pool = require("../config/db");
// const logModel = require("../models/LogModel");

class SpeciesController extends BaseController {
  constructor() {
    super(SpeciesModel);
  }

  async create(req, res) {
    try {
      const { common_name, scientific_name, source, general_info } = req.body;

      // Validate required fields
      if (!common_name || !scientific_name) {
        return res.status(400).json({
          success: false,
          message: 'Common name and scientific name are required fields'
        });
      }

      // Check if species with same common name already exists
      const existingSpecies = await pool.query(
        'SELECT id FROM species WHERE common_name = ?',
        [common_name]
      );

      if (existingSpecies[0].length > 0) {
        return res.status(400).json({
          success: false,
          message: 'A species with this common name already exists'
        });
      }

      // Insert the new species
      const result = await pool.query(
        'INSERT INTO species (common_name, scientific_name, source, general_info) VALUES (?, ?, ?, ?)',
        [common_name, scientific_name, source || null, general_info || null]
      );

      /* Commented log for new species

      await logModel.insertLog(
        req.auth.userId,
        'species',
        `Added new species: ${common_name} (${scientific_name})`,
        req.headers['x-forwarded-for'] || req.ip
      );

      */
      
      res.status(201).json({
        success: true,
        message: 'Species created successfully',
        data: {
          id: result[0].insertId,
          common_name,
          scientific_name,
          source,
          general_info
        }
      });
    } catch (error) {
      console.error('Error creating species:', error);
      res.status(500).json({
        success: false,
        message: 'Error creating species',
        error: error.message
      });
    }
  }

  async delete(req, res) {
    const speciesId = parseInt(req.params.id, 10);

    if (isNaN(speciesId)) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid species ID format" });
    }

    try {
      const result = await this.model.deleteSpeciesWithDependencies(speciesId);

      if (result.success) {

        /* Commented log for delete species

        await logModel.insertLog(
          req.auth.userId,
          'species',
          `Deleted species: ${speciesData.common_name} (${speciesData.scientific_name})`,
          req.headers['x-forwarded-for'] || req.ip
        );

        */

        return res.status(200).json({
          success: true,
          message:
            "Species and all associated feeds have been successfully deleted",
        });
      } else {
        return res.status(404).json({
          success: false,
          error: result.error,
        });
      }
    } catch (err) {
      console.error("Error deleting species:", err);
      return res.status(500).json({
        success: false,
        error: "An unexpected error occurred while deleting the species",
      });
    }
  }

  // Get Species with search, pagination, filtering and sorting
  async getAll(req, res) {
    try {
      const page = Number.isInteger(+req.query.page) && +req.query.page > 0 ? parseInt(req.query.page) : 1;
      const itemsPerPage = 50;
      const offset = (page - 1) * itemsPerPage;
  
      const {
        search,
        sortBy = 'id',
        sortOrder = 'ASC'
      } = req.query;
  
      const conditions = [];
      const values = [];
  
      if (search) {
        conditions.push('(common_name LIKE ? OR scientific_name LIKE ?)');
        values.push(`%${search}%`, `%${search}%`);
      }
  
      const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  
      const query = `
        SELECT *
        FROM species
        ${whereClause}
        ORDER BY ${sortBy} ${sortOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC'}
        LIMIT ? OFFSET ?
      `;
  
      const [species] = await pool.query(query, [...values, itemsPerPage, offset]);
  
      const [countRows] = await pool.query(
        `SELECT COUNT(*) AS total FROM species ${whereClause}`,
        values
      );
  
      const totalItems = countRows[0]?.total || 0;
  
      res.status(200).json({
        success: true,
        data: species,
        totalItems,
        itemsPerPage,
        currentPage: page
      });
  
    } catch (error) {
      console.error('Error in getAll species:', error);
      res.status(500).json({ success: false, message: "Failed to fetch species data" });
    }
  }
  

  async getById(req, res) {
    try {
      const speciesId = parseInt(req.params.id, 10);
      
      if (isNaN(speciesId)) {
        return res.status(400).json({ 
          success: false, 
          error: 'Invalid species ID format' 
        });
      }

      const species = await this.model.findById(speciesId);
      
      if (!species) {
        return res.status(404).json({
          success: false,
          error: 'Species not found'
        });
      }

      res.status(200).json({
        success: true,
        data: species
      });
    } catch (error) {
      console.error('Error in getById:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async update(req, res) {
    try {
      const speciesId = parseInt(req.params.id, 10);
      
      if (isNaN(speciesId)) {
        return res.status(400).json({ 
          success: false, 
          error: 'Invalid species ID format' 
        });
      }
  
      const requiredFields = ['name', 'categoryId', 'dietSpecId', 'ingSpecId'];
      const missingFields = requiredFields.filter(field => !(field in req.body));
  
      if (missingFields.length > 0) {
        return res.status(400).json({
          success: false,
          error: `Missing required fields: ${missingFields.join(', ')}`
        });
      }
  
      const result = await this.model.updateSpeciesWithTransaction(speciesId, req.body);
      
      if (!result.success) {
        return res.status(404).json({
          success: false,
          error: 'Species not found'
        });
      }
  
      /* Commented log for update species

      await logModel.insertLog(
        req.auth.userId,
        'species',
        `Updated species: ${oldSpecies.common_name} (${oldSpecies.scientific_name})`,
        req.headers['x-forwarded-for'] || req.ip
      );
      
      */

      res.status(200).json({
        success: true,
        data: result.data
      });
    } catch (error) {
      console.error('Update error:', error.message);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }  
  }
}

module.exports = new SpeciesController();
