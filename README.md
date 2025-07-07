<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

# Backend Technical Test - Selaski

REST API with NestJS, Prisma ORM, and relational data modeling.

## Table of Contents

1. [Introduction](#introduction)
2. [Features](#features)
3. [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
    - [Running the Application](#running-the-application)
4. [Architecture](#architecture)
    - [Directory Structure](#directory-structure)
    - [Clean Architecture](#clean-architecture)
    - [CQRS Pattern](#cqrs-pattern)
    - [Domain-Driven Design](#domain-driven-design)
    - [Value Objects](#value-objects)
    - [Repository Pattern](#repository-pattern)
    - [Mapper Pattern](#mapper-pattern)

5. [Database](#database)
    - [Migrations](#migrations)
    - [Seeds](#seeds)
    - [Default Credentials](#default-credentials)
6. [Tests](#tests)
7. [Rate Limiting with Throttler](./docs/THROTTLER.md)

## Introduction

This project follows the principles of clean architecture.

## Features

- 🏗️ **Architecture**:
    - Clean Architecture principles
    - Command Query Responsibility Segregation (CQRS)
    - Domain-Driven Design concepts
        - Comprehensive Value Objects for stronger typing and encapsulation
        - Repository pattern with proper domain/persistence separation
        - Rich domain model with encapsulated behavior
    - Dependency Injection

- 🛠️ **Technologies**:
    - NestJS framework
    - TypeScript
    - Mysql database
    - Prisma ORM

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/viktorhugo/proof-backend-selaski.git
   cd proof-backend-selaski
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.example .env
   ```
   Edit the `.env` file to set secure values for secrets.

### Running the Application

1. **Run database migrations**:
   ```bash
   npx prisma migrate dev
   ```

2. **Generate Prisma client**:
   ```bash
   npx prisma generate
   ```

3. **Start the application**:
   ```bash
   npm run start:dev
   ```

The application will now be running at http://localhost:4100

## Architecture

The application follows clean architecture principles, separating concerns into distinct layers.

### Directory Structure

```
nestjs-template/
├── src/
│   ├── application/ - Application layer (Commands, DTOs)
│   ├── core/ - Domain layer (Entities, Value Objects, Services)
│   ├── infrastructure/ - Infrastructure layer (Repositories, Database, Storage)
│   ├── presentation/ - Presentation layer (Controllers, Guards)
│   └── shared/ - Shared utilities and decorators
├── prisma/ - Prisma schema and migrations
├── test/ - Tests
└── .env.example - Example environment variables
```

### ERD
The following is the Entity-Relationship Diagram (ERD) for the application:

```mermaid
erDiagram
    User {
        string id PK
        string name
        string email UNIQUE
    }
    Message {
        string id PK
        string content
        string createdAt
        string userId FK
    }
    User ||--o{ Message : has
```

### Clean Architecture

The application follows a clean architecture approach with the following layers:

1. **Domain Layer** (`core/`): Contains the business entities, value objects, and core business logic.
   - **Entities**: Rich domain objects with behavior (User, Role, Permission, etc.)
   - **Value Objects**: Immutable objects representing domain concepts (Email, Name)
   - **Services**: Domain services implementing core business logic
   - **Repository Interfaces**: Abstractions for data access

2. **Application Layer** (`application/`): Contains application-specific logic, command handlers, and DTOs.
   - **Commands/Queries**: CQRS implementation with handlers
   - **DTOs**: Data Transfer Objects for input/output
   - **Mappers**: Transform domain objects to/from DTOs

3. **Infrastructure Layer** (`infrastructure/`): Contains database repositories, external services, and other infrastructure concerns.
   - **Repositories**: Concrete implementations of repository interfaces
   - **Database**: Database connection and ORM configurations
   - **External Services**: Integration with external systems

4. **Presentation Layer** (`presentation/`): Contains controllers, guards, and other presentation concerns.
   - **Controllers**: HTTP endpoints with request/response handling
   - **Guards**: Authentication and authorization checks
   - **Filters**: Exception handling and logging

### CQRS Pattern

The application uses the Command Query Responsibility Segregation (CQRS) pattern, separating command operations (write) from query operations (read).

### Domain-Driven Design

The application follows Domain-Driven Design (DDD) principles, focusing on the core domain and domain logic. Domain concepts are represented as first-class citizens:

- **Entities**: Objects with identity and lifecycle (User, Message)
- **Value Objects**: Immutable objects representing concepts without identity (Email, Name)
- **Aggregates**: Clusters of entities and value objects treated as a unit
- **Repositories**: Collections of objects with data access methods
- **Domain Services**: Complex operations that don't fit in entities or value objects

### Value Objects

The application uses Value Objects to encapsulate domain concepts, providing:

1. **Type Safety**: Strong typing for domain values
2. **Validation**: Ensures values meet business rules
3. **Immutability**: Prevents unexpected changes
4. **Encapsulation**: Hides implementation details
5. **Domain Logic**: Business rules live with the data

#### Core Value Objects

| Value Object | Description | Validation Rules |
|--------------|-------------|------------------|
| `Email` | Email addresses with validation | Format validation with regex |
| `Name` | Person name components | Length limits, formatting |
| `UserId` | Type-safe user identifiers | UUID validation |

#### Usage Example

Instead of using primitive strings:

```typescript
// Without value objects - using primitives
function createUser(email: string, name: string): User {
  // Must validate email format here
  if (!isValidEmail(email)) throw new Error('Invalid email');
  
  // And here
  return new User(email, name);
}
```

Value objects handle validation internally:

```typescript
// With value objects
function createUser(email: Email, name: Name): User {
  // Email and Name are already validated
  return new User(email, name);
}

// Creating a user with value objects
const email = new Email('victor.mosquera@unillanos.edu.co'); // Throws if invalid
const name = new Name('Victor Hugo Mosquera'); // Throws if invalid
const user = createUser(email, name);
```

### Repository Pattern

The application implements the Repository pattern to decouple the domain model from the data access logic:

1. **Repository Interfaces** (in `core/repositories/`): Define contracts for data access
2. **Repository Implementations** (in `infrastructure/repositories/`): Implement these contracts using specific technologies (Prisma)

#### Domain/Persistence Mapping

Repositories handle mapping between domain objects with value objects and database primitives:

```typescript
// Database stores primitives
// {
//   id: "45440fe0-bf9e-49c1-93a4-ce8ac5ac720f",
//   email: "victor.mosquera@unillanos.edu.co", 
//   name: "Victor Hugo Mosquera",
//   lastName: "Smith"
// }

// Mapping from database to domain in repository
private mapToModel(record: UserRecord): User {
  // Create value objects from primitives
  const email = new Email(record.email);
  const name = new Name(record.name);
  
  // Create entity with value objects
  const user = new User(email, name);
  user.id = record.id;
  
  return user;
}

// Mapping from domain to database in repository
async create(user: User): Promise<User> {
  const record = await this.database.create({
    id: user.id,
    email: user.email.getValue(), // Extract primitive from value object
    name: user.name.getValue(),
  });
  
  return this.mapToModel(record);
}
```

#### Error Handling

All repositories inherit from `BaseRepository` which provides consistent error handling:

```typescript
protected async executeWithErrorHandling<R>(
  operation: string,
  action: () => Promise<R>,
  fallbackValue?: R
): Promise<R> {
  try {
    return await action();
  } catch (error) {
    return this.handleError(operation, error, fallbackValue);
  }
}
```

### Mapper Pattern

The application uses the Mapper pattern to transform between domain entities and response/request DTOs:

#### Purpose

1. **Separation of Concerns**: Keep domain entities focused on business logic
2. **Consistent Transformation**: Standard way to convert between layers
3. **Value Object Handling**: Extract primitives from value objects for API responses

#### Implementation

Mappers are implemented in the application layer to convert between domain entities and DTOs:

```typescript
// User mapper example
export class UserMapper {
  // Maps a User entity to a IUserDetailResponse DTO
  static toDetailResponse(user: User): IUserDetailResponse {
    return {
      id: user.id,
      email: user.email.getValue(), // Extract primitive from value object
      name: user.name.getValue(),
    };
  }
  
  // More mapping methods for different response types...
}
```

#### Usage

Commands and queries use these mappers to return consistent responses:

```typescript
  @CommandHandler(CreateUserCommand)
  export class CreateUserCommandHandler implements ICommandHandler<CreateUserCommand> {
    async execute(command: LoginCommand): Promise<AuthResponse> {
      const user = await this.userService.createUser(/*...*/);
      
      // Use mapper to convert domain entity to response DTO
      // Use the mapper to convert to response DTO
      return UserMapper.toBaseResponse(user);
    }
  }
```

## Database

The application uses MySQL as the database and Prisma as the ORM.

### Migrations

Migrations are managed using Prisma Migrate. The initial migration creates all the required tables for the application.

#### Running Migrations

To run migrations and update your database schema:

```bash
# Apply migrations to the database
npm run db:migrate

# Or to just push the schema without migrations
npm run db:push
```

### Seeds

Seeds provide initial data for the database

#### Running Seeds

To seed your database with initial data:

1. user:
    - Id: '45440fe0-bf9e-49c1-93a4-ce8ac5ac720f'
    - Name: 'Victor Hugo Mosquera'
    - Email: 'victor.mosquera@unillanos.edu.co'

2. messages:
  1. - content: '¡Hi there, Criss !'
  2. - content: 'Can you help me with this selection process ?',

```bash
# Seed the database
npm run db:seed
```

## Tests

The test implementation follows best practices including:
- Clear Arrange/Act/Assert structure
- Mocking of dependencies
- Testing both happy and error paths
- Clear test naming and organization

You can run the tests using the npm scripts defined in package.json:
- `npm test` - Run unit tests
- `npm run test:cov` - Run with coverage
- `npm run test:e2e` - Run end-to-end tests

## Documentation

 - Swagger documentation available in `http://localhost:4100/docs` (requires basic authentication, username and password defined in environment variables).