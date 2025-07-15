-- Migration to fix foreign key constraints and standardize column names
-- Date: 2024-03-18

-- Step 1: Drop existing foreign key constraints
ALTER TABLE ingredients DROP FOREIGN KEY ingredients_ibfk_1;
ALTER TABLE feeds DROP FOREIGN KEY feeds_ibfk_3;
ALTER TABLE logs DROP FOREIGN KEY logs_ibfk_1;

-- Step 2: Rename columns to standardize on clerk_id
ALTER TABLE ingredients CHANGE COLUMN CreatedById clerk_id VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
ALTER TABLE feeds CHANGE COLUMN CreatedById clerk_id VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

-- Step 3: Add back foreign key constraints with proper character set and collation
ALTER TABLE ingredients 
ADD CONSTRAINT ingredients_ibfk_1 
FOREIGN KEY (clerk_id) REFERENCES users(clerk_id);

ALTER TABLE feeds 
ADD CONSTRAINT feeds_ibfk_3 
FOREIGN KEY (clerk_id) REFERENCES users(clerk_id);

ALTER TABLE logs 
ADD CONSTRAINT logs_ibfk_1 
FOREIGN KEY (clerk_id) REFERENCES users(clerk_id);

-- Step 4: Verify the changes
SELECT TABLE_NAME, COLUMN_NAME, CHARACTER_SET_NAME, COLLATION_NAME 
FROM information_schema.COLUMNS 
WHERE TABLE_SCHEMA = DATABASE() 
AND COLUMN_NAME IN ('clerk_id', 'CreatedById')
ORDER BY TABLE_NAME, COLUMN_NAME; 