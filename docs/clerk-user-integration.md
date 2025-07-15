# Clerk User Table Integration

## Overview
This system automatically mirrors Clerk users into our local database, maintaining synchronization between Clerk and our application. Every time a user signs up, updates their profile, or is deleted in Clerk, our database is automatically updated through webhooks.

## Database Schema
```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  clerk_id VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(40),
  first_name VARCHAR(40),
  last_name VARCHAR(40),
  role ENUM( 'Admin', 'Member', 'Guest') NOT NULL DEFAULT 'Guest',
  last_login TIMESTAMP NULL DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  ip_address VARCHAR(45) DEFAULT NULL
);
```

## Setup Instructions

### 1. Environment Variables
⚠️ **Important Update**: The environment files in Teams have been updated with new SSH key configurations required for the Clerk webhook integration. Even if you already have environment files set up, you need to update them with the new SSH key.

Download the updated environment files:
- Backend .env file: [Download here](https://deakin365.sharepoint.com/:u:/r/sites/GopherIndustries2/Shared%20Documents/Feed%20Formulation%20Portal/env%20-%20Backend?csf=1&web=1&e=CcLlgQ)
- Frontend .env file: [Download here](https://deakin365.sharepoint.com/:u:/r/sites/GopherIndustries2/Shared%20Documents/Feed%20Formulation%20Portal/env%20-%20Frontend?csf=1&web=1&e=NFZWjd)

OR if you prefer to get them from Teams:
1. Navigate to the project's Files tab in Teams
2. Download `env - Backend` and `env - Frontend`
3. Place them in their respective directories and change both file names to `.env`

The updated environment files include:
- All existing Clerk authentication keys
- New SSH key configuration for webhook security
- Updated database credentials

⚠️ **Important Security Notes:**
- Never commit the `.env` file to version control
- Keep the Teams access restricted to authorized team members
- Rotate credentials regularly as per security policies
- Report any unauthorized access immediately

### 2. Local Development Setup with ngrok

For local development and webhook testing, we use ngrok to create a public URL for your local server. The only difference from standard ngrok setup is that we run it on port 5000:

1. Install ngrok and loG in, head to the Domains section, under the Universal Gateway Category, Then Create a new Domain. 
2. Copy your custom URL/Domain, then open a new terminal/command prompt
3. Run:
   ```bash
   ngrok http --url=your-custom-url.ngrok-free.app 5000
   ```

### 3. Clerk Webhook Configuration (Production)
1. Go to your Clerk Dashboard
2. Navigate to Webhooks
3. Add a new webhook endpoint: `https://your-domain.com/api/user/webhooks`
4. Select these events:
   - `user.created`
   - `user.updated`
   - `user.deleted`
   - `session.created`
5. Copy the `Signing Secret` and add it to your Microsoft Teams environment file (SESSION_SECRET=...)

## API Endpoints

### Webhook Endpoint
```
POST /api/user/webhooks
```
This endpoint receives Clerk webhooks and updates our database accordingly.

#### Headers Required
```
svix-id: [unique-id]
svix-timestamp: [timestamp]
svix-signature: [signature]
```

#### Response Format
```json
{
    "success": true,
    "message": "Processed webhook: user.created"
}
```

## How It Works

### User Creation Flow
1. User signs up in Clerk
2. Clerk sends webhook to our endpoint
3. System verifies webhook signature
4. User data is stored in our database

### User Update Flow
1. User updates profile in Clerk
2. Clerk sends webhook to our endpoint
3. System verifies webhook signature
4. User data is updated in our database

### User Deletion Flow
1. User is deleted in Clerk
2. Clerk sends webhook to our endpoint
3. System verifies webhook signature
4. User is removed from our database

### Session Created Flow
1. Session is created in Clerk via a login
2. Clerk sends webhook to our endpoint
3. System verifies webhook signature
4. last login and ip address is stored in user table

## Error Handling

### Webhook Verification Errors
```json
{
    "success": false,
    "message": "Error: Missing svix headers"
}
```

### Database Operation Errors
```json
{
    "success": false,
    "message": "Error updating database for Clerk.js event"
}
```

## Testing

### Local Testing
1. Use Clerk's webhook testing tool
2. Send test events to your local endpoint
3. Verify database updates

### Production Testing
1. Create a test user in Clerk
2. Verify user appears in database
3. Update test user in Clerk
4. Verify updates in database
5. Login to the frontend
6. Verify last login and ip address update
7. Delete test user in Clerk
8. Verify removal from database

## Troubleshooting

### Common Issues
1. **Webhook Not Received**
   - Check Clerk dashboard for webhook status
   - Verify endpoint URL is correct (and running)
   - Check server logs for errors

2. **Database Not Updated**
   - Verify webhook signature
   - Check database connection
   - Review server logs

3. **Signature Verification Failed**
   - Verify SIGNING_SECRET in Microsoft Teams environment file
   - Check webhook headers
   - Ensure timestamp is current

## Security Considerations

1. **Webhook Verification**
   - All webhooks are verified using Svix
   - Invalid signatures are rejected
   - Missing headers result in 400 error

2. **Data Protection**
   - Sensitive data is not logged
   - Database operations are atomic
   - Proper error handling prevents data leaks

## Maintenance

### Regular Checks
1. Monitor webhook delivery status
2. Review error logs
3. Check database synchronization

### Updates
1. Keep Clerk SDK updated
2. Monitor for webhook changes
3. Update documentation as needed

## Support

For issues or questions:
1. Check server logs
2. Review Clerk documentation
3. Contact the development team
