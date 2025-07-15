const BaseController = require('./BaseController');
const { Webhook } = require('svix');
const db = require('../config/db');
const { clerkClient } = require('@clerk/clerk-sdk-node');
const logModel = require('../models/LogModel');


class UserController extends BaseController {
  constructor(userModel) {
    super(userModel);
  }

  async processWebhooks(req, res) {
    // If you need to re-enable this in future, uncomment the code below and make sure 'svix' is installed and SIGNING_SECRET is set.
    
    const SIGNING_SECRET = process.env.SIGNING_SECRET;
    if (!SIGNING_SECRET) {
      return res.status(500).json({ message: 'Error: Please add SIGNING_SECRET to .env' });
    }

    const wh = new Webhook(SIGNING_SECRET);
    const headers = req.headers;
    const payload = req.body;

    const svix_id = headers['svix-id'];
    const svix_timestamp = headers['svix-timestamp'];
    const svix_signature = headers['svix-signature'];

    if (!svix_id || !svix_timestamp || !svix_signature) {
      return res.status(400).json({ success: false, message: 'Missing svix headers' });
    }

    let evt;
    try {
      evt = wh.verify(JSON.stringify(payload), {
        'svix-id': svix_id,
        'svix-timestamp': svix_timestamp,
        'svix-signature': svix_signature,
      });
    } catch (err) {
      return res.status(400).json({ success: false, message: err.message });
    }

    const eventType = evt.type;
    const userData = evt.data;
  	const httpRequest = evt.event_attributes.http_request;
  
  	// Function and Options to convert from UTC/GMT to AEST/AEDT
    const dateTimeOptions = {
    	timeZone: 'Australia/Melbourne',
    	year: 'numeric',
    	month: '2-digit',
    	day: '2-digit',
    	hour: '2-digit',
    	minute: '2-digit',
    	second: '2-digit',
    	hour12: false
    }
    function formatToSQLDateTime(dateStr) {
    	if (!dateStr) return null;
    		const formatted = new Intl.DateTimeFormat('en-GB', dateTimeOptions).format(new Date(dateStr));
  			const [datePart, timePart] = formatted.split(', ');
  			const [day, month, year] = datePart.split('/');
  			return `${year}-${month}-${day} ${timePart}`;
	}

  // Handle session.created
  	if (eventType === 'session.created') {
    	try {
      	const userId = userData.user_id;
        const sessionCreatedAt = formatToSQLDateTime(userData.created_at)
        const userIPAddress = httpRequest.client_ip;

      	await this.model.updateByClerkID(userId, {
        	last_login: sessionCreatedAt,
          ip_address: userIPAddress
      	});

        await logModel.insertLog(userId, 'user', `User logged in`, userIPAddress);

      	return res.status(200).json({ success: true, message: 'Session details updated.' });
    	} catch (error) {
      	console.error('Error updating session details:', error);
      	return res.status(500).json({
        	success: false,
        	message: 'Failed to update session details'
      	});
    	}
  	}

    if (eventType === 'user.created' || eventType === 'user.updated' || eventType === 'user.deleted') {
      try {
        const createdAt = formatToSQLDateTime(userData.created_at)
      	const updatedAt = formatToSQLDateTime(userData.updated_at)

        const firstName = userData.first_name || null;
        const lastName = userData.last_name || null;
        const ip = httpRequest.client_ip;

        if (eventType === 'user.created') {
          await this.model.create({
            clerk_id: userData.id,
            email: userData.email_addresses?.[0]?.email_address || null,
            username: userData.username || null,
            first_name: firstName,
            last_name: lastName,
            created_at: createdAt,
            updated_at: updatedAt,
          });
          await logModel.insertLog(userData.id, 'user', `User created`, ip);

        } else if (eventType === 'user.updated') {
          await this.model.updateByClerkID(userData.id, {
            email: userData.email_addresses?.[0]?.email_address || null,
            username: userData.username || null,
            first_name: firstName,
            last_name: lastName,
            updated_at: updatedAt,
          });
          await logModel.insertLog(userData.id, 'user', `User updated`, ip);

        } else if (eventType === 'user.deleted') {
          await this.model.deleteByClerkID(userData.id);
          await logModel.insertLog(userData.id, 'user', `User deleted`, ip);
        }

        return res.status(200).json({ success: true });
      } catch (error) {
        console.error('Error updating database:', error);
        return res.status(500).json({
          success: false,
          message: 'Error updating database for Clerk.js event',
        });
      }
    } else {
      return res.status(200).json({
        success: true,
        message: `Received and ignored event type: ${eventType}`,
      });
    }
  }

  //** RoleChecker: Fetch role using user ID from the users table */
  async RoleChecker(req, res) {
    const { clerkId } = req.query;

    if (!clerkId) {
      return res.status(400).json({
        message: 'Please provide a user ID.',
        role: null
      });
    }

    try {
      const [rows] = await db.query(
        'SELECT role FROM users WHERE clerk_id = ?',
        [clerkId]
      );

      if (rows.length === 0) {
        return res.status(404).json({
          message: 'No user found with this ID.',
          role: null
        });
      }

      const role = rows[0].role || 'Guest';

      return res.status(200).json({
        message: `User is assigned role: ${role}`,
        role
      });

    }  catch (error) {
      console.error('Something went wrong:', error);
      console.error('Full error object:', error); 
      return res.status(500).json({
        message: 'Oops! Something went wrong while checking the user role.',
        role: null
      });
    }
  }

  async updateUser(req, res) {
    const clerkId = req.auth?.userId;
    if (!clerkId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const user = await this.model.findByClerkID(clerkId);
    if (!user || (user.role !== 'Admin')) {
      return res.status(403).json({ message: 'Only users with Admin role can add new users' });
    }

    const { id, email, username, first_name, last_name, role } = req.body;
  
    const errors = [];
    const validRoles = ['Admin', 'Member', 'Guest'];
  
    if (!id) errors.push('User ID is required.');
    if (!role) errors.push('Role is required.');
    if (role && !validRoles.includes(role)) {
      errors.push(`Role must be one of: ${validRoles.join(', ')}`);
    }

    if (errors.length > 0) {
      return res.status(400).json({ success: false, errors });
    }
  
    try {
      let user = await this.model.findByClerkID(id)
      if (!user) {
        return res.status(400).json({ success: false, message: 'User does not exist.' });
      }

      const updateData = {
        email: email ?? user.email,
        username: username ?? user.username,
        first_name: first_name ?? user.first_name,
        last_name: last_name ?? user.last_name,
        role: role,
        updated_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
      };

      await this.model.updateUser(id, updateData);
      await logModel.insertLog(id, 'user', `User account updated by Admin`, req.ip);
  
      // Get the updated user data
      const updatedUser = await this.model.findByClerkID(id);
  
      res.status(200).json({ 
        success: true, 
        message: 'User updated successfully.',
        data: updatedUser
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: 'Error updating the user',
        error: error.message 
      });
    }
  }

  async deleteUsers(req, res) {
    const clerkId = req.auth?.userId;
    if (!clerkId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const user = await this.model.findByClerkID(clerkId);
    if (!user || (user.role !== 'Admin')) {
      return res.status(403).json({ message: 'Only users with Admin role can add new users' });
    }

    const idsParam = req.params.ids || '';
    const clerkIds = idsParam
      .split(',')
      .map(id => id.trim())
      .filter(Boolean);

    if (clerkIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid user IDs provided in path parameter.'
      });
    }

    try {
      // Delete users from Clerk - the webhook will handle database deletion
      const deletePromises = clerkIds.map(async (clerkId) => {
        try {
          await clerkClient.users.deleteUser(clerkId);
          await logModel.insertLog(clerkId, 'user', `User account deleted by Admin`, req.ip);
          return { id: clerkId, success: true };
        } catch (error) {
          console.error(`Failed to delete user ${clerkId} from Clerk:`, error);
          return { id: clerkId, success: false, error: error.message };
        }
      });

      const results = await Promise.all(deletePromises);
      const successfulDeletes = results.filter(r => r.success);
      const failedDeletes = results.filter(r => !r.success);

      if (successfulDeletes.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Failed to delete any users from Clerk',
          errors: failedDeletes
        });
      }

      return res.status(200).json({
        success: true,
        message: `Successfully deleted ${successfulDeletes.length} user(s) from Clerk. Database cleanup will be handled by webhook.`,
        successfulDeletes: successfulDeletes.map(r => r.id),
        failedDeletes: failedDeletes
      });
    } catch (error) {
      console.error('Error deleting users:', error);
      return res.status(500).json({
        success: false,
        message: 'Server error while deleting users',
        error: error.longMessage
      });
    }
  }
 
  async addUser(req, res) {
    try {
      const clerkId = req.auth?.userId;
      if (!clerkId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
  
      const user = await this.model.findByClerkID(clerkId);
      if (!user || (user.role !== 'Admin')) {
        return res.status(403).json({ message: 'Only users with Admin role can add new users' });
      }
  
      const { email, username, first_name, last_name, password } = req.body;
  
      if (!email || !username || !first_name || !last_name) {
        return res.status(400).json({
          message: 'email, username, first_name, and last_name are required'
        });
      }
  
      const existingUser = await this.model.findByField('email', email);
      if (existingUser) {
        return res.status(409).json({
          message: `User with email ${email} already exists`
        });
      }

      const newUser = await clerkClient.users.createUser({
        email_address: [email], 
        first_name,
        last_name,
        username,
        password
      });
  
      return res.status(200).json({
        success: true,
        message: `User ${email} created successfully`,
        clerk_id: newUser.id
      });
  
    } catch (error) {
      console.error('Error creating user:', error);
      return res.status(500).json({
        message: 'Something went wrong while creating the user'
      });
    }
  }

  async getAllUsers(req, res) {
    try {
      const users = await this.model.findAll(); // uses BaseModel's method
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

module.exports = UserController;
