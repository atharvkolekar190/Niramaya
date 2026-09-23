# Community Application Database Schema

This directory contains database schemas for the community application that integrates with your existing telemedicine system's users table.

## Database Files

- `sqlite_schema.sql` - SQLite database schema
- `mysql_schema.sql` - MySQL database schema  
- `postgresql_schema.sql` - PostgreSQL database schema

## Schema Overview

The community application requires three main tables that work with your existing `users` table:

### 1. Posts Table
- **Purpose**: Store community posts/threads
- **Key Fields**: 
  - `id` - Primary key
  - `user_id` - Foreign key to users table
  - `title` - Post title
  - `content` - Post content
  - `image_url` - Optional image attachment
  - `created_at` / `updated_at` - Timestamps
  - `is_deleted` - Soft delete flag

### 2. Comments Table
- **Purpose**: Store comments on posts
- **Key Fields**:
  - `id` - Primary key
  - `post_id` - Foreign key to posts table
  - `user_id` - Foreign key to users table
  - `content` - Comment content
  - `created_at` / `updated_at` - Timestamps
  - `is_deleted` - Soft delete flag

### 3. Likes Table
- **Purpose**: Store post likes
- **Key Fields**:
  - `id` - Primary key
  - `post_id` - Foreign key to posts table
  - `user_id` - Foreign key to users table
  - `created_at` - Like timestamp
  - Unique constraint on (post_id, user_id) to prevent duplicate likes

## Features

### Database-Specific Optimizations

**SQLite:**
- Uses triggers for automatic `updated_at` timestamp updates
- Includes comprehensive indexes for performance

**MySQL:**
- Uses `ON UPDATE CURRENT_TIMESTAMP` for automatic timestamp updates
- Includes a helpful view `post_with_user` for common queries
- Uses InnoDB engine with UTF8MB4 collation

**PostgreSQL:**
- Uses trigger functions for timestamp updates
- Includes timezone-aware timestamps
- Includes a helpful view `post_with_user` for common queries

### Performance Features
- Indexes on foreign keys and commonly queried fields
- Soft delete support with `is_deleted` flags
- Automatic timestamp management
- Unique constraints to prevent data inconsistencies

## Setup Instructions

### SQLite
```bash
sqlite3 community.db < sqlite_schema.sql
```

### MySQL
```bash
mysql -u username -p database_name < mysql_schema.sql
```

### PostgreSQL
```bash
psql -U username -d database_name -f postgresql_schema.sql
```

## API Endpoint Mapping

The schema supports all the API endpoints shown in your requirements:

- `POST /api/community/posts` → Insert into `posts` table
- `GET /api/community/posts` → Query `posts` table with user info
- `GET /api/community/posts/:id` → Query `posts` with related `comments`
- `POST /api/community/posts/:id/comments` → Insert into `comments` table
- `GET /api/community/posts/:id/comments` → Query `comments` table
- `POST /api/community/posts/:id/like` → Insert/delete from `likes` table

## Dependencies

This schema assumes you have an existing `users` table with at least these fields:
- `id` (Primary key)
- `username` (for display purposes)
- `email` (for display purposes)

The foreign key relationships will automatically handle cascading deletes when users are removed from your system.
