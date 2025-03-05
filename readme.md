# Pokemon API

A RESTful API for managing Pokemon data built with Node.js, Express, TypeScript, and Prisma.

## Features

- CRUD operations for Pokemon data
- Integration with the official PokeAPI
- RESTful architecture
- Swagger documentation
- Error handling middleware
- Unit and integration tests

## Tech Stack

- Node.js & Express
- TypeScript
- Prisma ORM
- SQLite database
- Jest for testing
- Swagger for API documentation

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn

## Installation

1. Clone the repository:

```bash
git clone https://github.com/jgalmeida93/pokemon-api.git
cd pokemon-api
```

2. Install dependencies:

```bash
npm install
```

## Running the Application Locally

1. Set up environment variables:

```bash
cp .env.example .env
```

2. Generate Prisma client:

```bash
npm run prisma:generate
```

3. Run database migrations:

```bash
npm run prisma:migrate
```

### Running with Docker

```bash
docker compose up --build
```

The server will start on port 3000 (or the port specified in your .env file).

## API Documentation

Once the server is running, you can access the Swagger documentation at:

```
http://localhost:3000/api-docs
```

## API Endpoints

| Method | Endpoint         | Description          |
| ------ | ---------------- | -------------------- |
| GET    | /api/pokemon     | Get all Pokemon      |
| GET    | /api/pokemon/:id | Get Pokemon by ID    |
| POST   | /api/pokemon     | Create a new Pokemon |
| PUT    | /api/pokemon/:id | Update a Pokemon     |
| DELETE | /api/pokemon/:id | Delete a Pokemon     |

## Testing

Run tests:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

Generate test coverage report:

```bash
npm run test:coverage
```

## Database

This project uses SQLite with Prisma ORM. The database file (dev.db) is created when you run the migrations.

**Note:** The database file should not be committed to version control.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
