-- Feature Request Tracker - Database Setup
-- Run this file to initialize the database

CREATE DATABASE IF NOT EXISTS feature_tracker;
USE feature_tracker;

CREATE TABLE IF NOT EXISTS feature_requests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  priority ENUM('Low', 'Medium', 'High') NOT NULL DEFAULT 'Medium',
  status ENUM('Open', 'In Progress', 'Completed') NOT NULL DEFAULT 'Open',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Sample seed data
INSERT INTO feature_requests (title, description, priority, status) VALUES
  ('Dark Mode Support', 'Add a dark mode toggle to improve user experience during night-time usage.', 'High', 'Open'),
  ('Export to CSV', 'Allow users to export their feature request data as a CSV file for reporting.', 'Medium', 'In Progress'),
  ('Email Notifications', 'Send email alerts when a feature request status changes.', 'Low', 'Open'),
  ('User Authentication', 'Implement login and registration with JWT-based sessions.', 'High', 'In Progress'),
  ('Bulk Delete', 'Allow selecting multiple requests and deleting them at once.', 'Low', 'Completed');
