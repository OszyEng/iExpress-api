iExpress API

Description
The iExpress API is a platform backend built with Node.js, Express, and PostgreSQL. It allows users to register, log in, follow other users, create posts and replies, and search for posts. Authentication is handled via session IDs, and the API is documented with Swagger for easy testing and exploration.

Key features:
- User management (register, get user info, delete user)
- Session management (login, logout)
- Follow/unfollow users
- Create and retrieve posts and replies
- Search posts by content
- Swagger UI for interactive API documentation


Quick Start
Requirements
- Docker and Docker Compose installed
- Node.js
- CMD/Terminal to run commands

Setup
1. Clone the repository:

   git clone https://github.com/OszyEng/iExpress-api
   cd iExpress-api

2. Install dependencies:
   npm install

3. Create a `.env` file in the project root with the following:

   NODE_ENV=development
   PORT=3000
   DB_HOST=db
   DB_PORT=5432
   DB_NAME=iExpress-db
   DB_USER=user
   DB_PASSWORD=password

4. Build and start the Docker containers:
   docker-compose up --build

   The API will be available at `http://localhost:3000`, and Swagger UI at `http://localhost:3000/api-docs`.

Stop the Application
- Stop containers:
  docker-compose down

- Remove containers and database volume (to reset):
  docker-compose down -v


Usage
Accessing the API
- Base URL: `http://localhost:3000`
- Swagger UI: `http://localhost:3000/api-docs`
- Authentication: Most endpoints require an `X-Session-ID` header obtained from `POST /session/login`.





