const BaseModel = require("./BaseModel");
const db = require('../config/db');

class SpeciesModel extends BaseModel {
  constructor() {
    super("species");
  }

  async create(data) {
    const connection = await this.getConnection();
    try {
      await connection.beginTransaction();

      // Insert into species table
      const [result] = await connection.query(
        'INSERT INTO species (common_name, scientific_name, source, general_info) VALUES (?, ?, ?, ?)',
        [data.common_name, data.scientific_name, data.source || null, data.general_info || null]
      );

      await connection.commit();
      return result.insertId;
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  }

  async deleteSpeciesWithDependencies(speciesId) {
    const connection = await this.getConnection();
    try {
      await connection.beginTransaction();

      // Check if species exists
      const [speciesRows] = await connection.query(
        "SELECT id FROM species WHERE id = ?",
        [speciesId]
      );
      if (!speciesRows || speciesRows.length === 0) {
        await connection.rollback();
        return { success: false, error: "Species not found" };
      }

      // Find feeds linked to this species
      const [feeds] = await connection.query(
        "SELECT id FROM feeds WHERE species_id = ?",
        [speciesId]
      );
      const feedIds = feeds.map((feed) => feed.id);

      if (feedIds.length > 0) {
        // Delete all ingredient links for those feeds
        await connection.query(
          "DELETE FROM feed_ingredient_association WHERE feed_id IN (?)",
          [feedIds]
        );

        // Delete the feeds themselves
        await connection.query("DELETE FROM feeds WHERE species_id = ?", [
          speciesId,
        ]);
      }

      // Delete the species
      const deleted = await this.delete(speciesId);

      if (deleted) {
        await connection.commit();
        return { success: true };
      } else {
        await connection.rollback();
        return { success: false, error: "Failed to delete species" };
      }
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  }

  // Get all species with related information
  async findAllWithRelations() {
    const connection = await this.getConnection();
    try {
      const [rows] = await connection.query(`
        SELECT 
          s.*, 
          c.name AS category_name,
          ds.name AS diet_spec_name,
          ins.name AS ingredient_spec_name
        FROM species s
        LEFT JOIN species_category c ON s.category_id = c.id
        LEFT JOIN diet_specification ds ON ds.species_id = s.id
        LEFT JOIN ingredient_specification ins ON ins.species_id = s.id
      `);
      return rows;
    } finally {
      connection.release();
    }
  }

  async updateSpeciesWithTransaction(id, updateData) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // 1. Check species exists
      const [species] = await connection.query(
        "SELECT id FROM species WHERE id = ?",
        [id]
      );
      if (!species.length) {
        await connection.rollback();
        return { success: false, error: "Species not found" };
      }

      // 2. Validate foreign keys (mirror delete pattern)
      const [category] = await connection.query(
        "SELECT id FROM SpeciesCategory WHERE id = ?",
        [updateData.categoryId]
      );
      const [diet] = await connection.query(
        "SELECT id FROM DietSpecifications WHERE id = ?",
        [updateData.dietSpecId]
      );
      const [ingredient] = await connection.query(
        "SELECT id FROM IngredientSpecifications WHERE id = ?",
        [updateData.ingSpecId]
      );

      if (!category.length || !diet.length || !ingredient.length) {
        await connection.rollback();
        return {
          success: false,
          error: "Invalid category, diet, or ingredient ID",
        };
      }

      // 3. Perform update
      const [result] = await connection.query(
        "UPDATE species SET ? WHERE id = ?",
        [updateData, id]
      );

      await connection.commit();
      return {
        success: result.affectedRows > 0,
        data: await this.findById(id),
      };
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  }
}

module.exports = new SpeciesModel();
