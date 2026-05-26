-- ==============================
-- Spring Security Integration Migration
-- ==============================
-- This migration adds authentication and authorization tables to support Spring Security with JWT
-- Requirements: 1.1, 1.2, 1.3, 1.4, 1.7, 1.8, 15.1, 15.2, 15.3, 15.4, 15.5, 15.6, 15.7

-- ==============================
-- Step 1: Add security columns to users table
-- ==============================
-- Add password column for BCrypt-hashed passwords (Requirement 1.1)
ALTER TABLE users 
ADD COLUMN password VARCHAR(255) NOT NULL DEFAULT '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy';
-- Default password hash represents "ChangeMe123!" (Requirement 15.2)

-- Add enabled column for account status (Requirement 1.2)
ALTER TABLE users 
ADD COLUMN enabled BOOLEAN NOT NULL DEFAULT TRUE;

-- Add accountNonLocked column for account security (Requirement 1.3)
ALTER TABLE users 
ADD COLUMN account_non_locked BOOLEAN NOT NULL DEFAULT TRUE;

-- Set all existing users to enabled and unlocked (Requirements 15.3, 15.4)
UPDATE users 
SET enabled = TRUE, account_non_locked = TRUE 
WHERE enabled IS NULL OR account_non_locked IS NULL;

-- ==============================
-- Step 2: Create roles table
-- ==============================
-- Create roles table with predefined roles (Requirements 1.7, 15.5)
CREATE TABLE IF NOT EXISTS roles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255),
    CONSTRAINT chk_role_name CHECK (name IN ('ADMIN', 'MANAGER', 'DEVELOPER', 'TESTER'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert predefined roles (Requirement 15.5)
INSERT INTO roles (name, description) VALUES
('ADMIN', 'Full system access - can manage users, projects, and all resources'),
('MANAGER', 'Project management access - can create/update/delete projects and manage teams'),
('DEVELOPER', 'Development team member - can create/update tasks and add comments'),
('TESTER', 'Testing team member - can view projects/tasks, add comments, and update task status');

-- ==============================
-- Step 3: Create user_roles join table
-- ==============================
-- Create many-to-many relationship table (Requirements 1.8, 15.6)
CREATE TABLE IF NOT EXISTS user_roles (
    user_id BIGINT NOT NULL,
    role_id BIGINT NOT NULL,
    PRIMARY KEY (user_id, role_id),
    CONSTRAINT fk_user_roles_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_user_roles_role FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==============================
-- Step 4: Migrate existing user roles to user_roles table
-- ==============================
-- Migrate existing role enum values to role associations (Requirement 15.7)
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id
FROM users u
INNER JOIN roles r ON u.role = r.name
WHERE NOT EXISTS (
    SELECT 1 FROM user_roles ur 
    WHERE ur.user_id = u.id AND ur.role_id = r.id
);

-- ==============================
-- Step 5: Create indexes for performance optimization
-- ==============================
-- Index on user_id for faster role lookups (Requirement 1.8)
CREATE INDEX idx_user_roles_user_id ON user_roles(user_id);

-- Index on role_id for faster user lookups by role (Requirement 1.8)
CREATE INDEX idx_user_roles_role_id ON user_roles(role_id);

-- Index on email for faster authentication queries (Requirement 1.4)
CREATE INDEX idx_users_email ON users(email);

-- Index on enabled and account_non_locked for faster authentication checks
CREATE INDEX idx_users_enabled ON users(enabled);
CREATE INDEX idx_users_account_non_locked ON users(account_non_locked);

-- ==============================
-- Migration Complete
-- ==============================
-- Summary:
-- 1. Added password, enabled, and account_non_locked columns to users table
-- 2. Created roles table with 4 predefined roles (ADMIN, MANAGER, DEVELOPER, TESTER)
-- 3. Created user_roles join table for many-to-many relationship
-- 4. Migrated existing user role enum values to user_roles associations
-- 5. Added indexes for performance optimization
-- 
-- Note: The existing 'role' column in users table is preserved for backward compatibility
-- All existing users have default password "ChangeMe123!" and should change it on first login
