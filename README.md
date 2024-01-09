NestJS Web Shop API
----------------------------------

### Description

This project is a comprehensive backend API for a web shop application, developed using NestJS and Prisma. It features modules for user authentication, product management, order processing, and more, providing a robust foundation for building a full-fledged e-commerce platform.

Prerequisites
-------------

*   Node.js (version > 18.x)
*   Docker (for containerization, optional)
*   A PostgreSQL database (or modify `prisma/schema.prisma` for your preferred database)

Installation
------------

1.  **Clone the Repository**:
    
    `git clone [repository-url]`
    
2.  **Navigate to the Project Directory**:
    
    `cd web-shop-api`
    
3.  **Install Dependencies**:
    
    `npm install`
    

Database Setup
--------------

*   Initialize your database and update the `.env` file with your database credentials from `.env.example` file.
*   Run Prisma migrations:
    
    `npx prisma migrate dev`
    

Running the Application
-----------------------

1.  **Development Mode**:
    
    `npm run start:dev`
    
2.  **Production Build**:
    
    `npm run start:prod`
    

Using Docker
------------

*   Ensure Docker is installed and running on your system.
*   Build and run the application using Docker:
    
    `docker-compose up -d --build`
    
API Documentation
-----------------

*   Access Swagger documentation at `http://localhost:5000/api/docs` for detailed API endpoints and usage.

Modules
-------

### Auth

*   Manages user authentication, including login, login via Google, registration, and JWT token management.

### Category

*   Handles the categorization of products, allowing creation, modification, and deletion of categories.

### Image

*   Provides functionality for uploading and managing images associated with products.

### Order

*   Manages customer orders, including order creation, status updates, and history.

### Product

*   Responsible for product management, including adding new products, updating details, and inventory management.

### User

*   Handles user profiles, data management, and administrative actions on user accounts.

