# Makerspace Project

This project, "Makerspace," is a full-stack application designed to manage scheduled lessons, proposed time slots, and user interactions with comprehensive authentication and authorization. It demonstrates a modern technology stack for both the backend and frontend with robust security and testing practices.

---

## Technologies Used

### Backend (Java/Spring Boot)

* **Java 21**: The core programming language. Chosen for its robustness, performance, latest language features, and vast ecosystem.
* **Spring Boot 3.5.3**: A powerful framework for building stand-alone, production-grade Spring applications. It simplifies backend development with convention-over-configuration and embedded servers.
* **Spring Security**: Comprehensive security framework providing authentication, authorization, and protection against common security vulnerabilities. Integrated with JWT for stateless authentication.
* **JWT (JSON Web Tokens)**: Stateless authentication mechanism using the `jjwt` library (v0.12.6). Provides secure token-based authentication with HTTP-only cookies for enhanced security.
* **Spring Data JPA**: Simplifies data access layers by providing an easy way to implement JPA-based repositories, reducing boilerplate code for database interactions.
* **PostgreSQL**: A powerful, open-source relational database system. Chosen for its reliability, feature richness, and strong support for complex queries.
* **Lombok**: A library that reduces boilerplate code for Java classes (e.g., getters, setters, constructors, `equals`, `hashCode`). Improves code readability and maintainability.
* **MapStruct 1.6.2**: An annotation-based code generator that greatly simplifies the implementation of mapping interfaces between Java bean types (e.g., converting Entities to DTOs and vice-versa). Reduces manual mapping code and potential errors.
* **SpringDoc OpenAPI 2.8.5 (Swagger UI)**: Automatically generates API documentation and provides an interactive UI for testing REST endpoints. Enhances API discoverability and simplifies collaboration.

### Testing Framework

* **JUnit 5**: Modern testing framework for Java applications with improved annotations, assertions, and test lifecycle management.
* **Mockito 5.12.0**: Powerful mocking framework for unit testing, enabling isolated testing of components by mocking dependencies.
* **Spring Boot Test**: Comprehensive testing support including `@WebMvcTest`, `@MockBean`, and security testing utilities.
* **MockMvc**: Spring's testing framework for testing web layers in isolation with simulated HTTP requests and responses.
* **H2 Database**: In-memory database used for testing environments, providing fast and isolated test execution.
* **Spring Security Test**: Testing utilities for security-related functionality including authentication and authorization testing.

### Authentication & Security

* **JWT Authentication**: Stateless authentication using JSON Web Tokens
* **HTTP-Only Cookies**: Secure token storage preventing XSS attacks
* **Role-Based Access Control**: User roles and permissions management
* **Password Encryption**: Secure password hashing using Spring Security's password encoders
* **CORS Configuration**: Cross-Origin Resource Sharing setup for frontend-backend communication

---

### Frontend (Next.js/React)

* **Next.js**: A React framework for building full-stack web applications. Provides features like server-side rendering (SSR), static site generation (SSG), and API routes, optimizing performance and developer experience.
* **React**: A declarative, component-based JavaScript library for building user interfaces. Simplifies the creation of interactive and reusable UI components.
* **TypeScript**: A typed superset of JavaScript that compiles to plain JavaScript. Enhances code quality, readability, and maintainability by catching errors at compile time.
* **Tailwind CSS**: A utility-first CSS framework. Enables rapid UI development by providing low-level utility classes directly in your JSX, reducing the need for custom CSS.
* **Redux Toolkit (RTK)**: The official, opinionated, batteries-included toolset for efficient Redux development. Simplifies Redux setup and common tasks.
* **RTK Query**: A powerful data fetching and caching tool built on top of Redux Toolkit. Greatly reduces boilerplate for API interactions, provides automatic caching, revalidation, and handles loading/error states.
* **`cz.habarta.typescript-generator-maven-plugin`**: A Maven plugin used to automatically generate TypeScript interfaces (e.g., from Java DTOs). Ensures type safety and consistency between frontend and backend data models.

---

## API Endpoints

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login (returns JWT in HTTP-only cookie)
- `POST /api/auth/logout` - User logout (clears authentication cookie)
- `GET /api/auth/me` - Get current authenticated user information

### API Documentation
- **Swagger UI**: Available at `http://localhost:8080/swagger-ui.html`
- **OpenAPI JSON**: Available at `http://localhost:8080/v3/api-docs`

---

## Testing

The project includes comprehensive testing coverage:

- **Unit Tests**: Component-level testing with Mockito mocks
- **Integration Tests**: `@WebMvcTest` for web layer testing
- **Security Tests**: Authentication and authorization testing
- **Repository Tests**: Data layer testing with H2 in-memory database

Run tests with:
```bash
mvn test
```

---

## Getting Started

### Prerequisites
- **Java 21** or higher
- **Maven 3.6+**
- **PostgreSQL** (for production)
- **Node.js 18+** (for frontend)
- **npm** or **yarn**

### Backend Setup

1. **Clone the repository**
```bash
git clone https://github.com/pooya1361/makerspace.git
cd makerspace
```

2. **Configure PostgreSQL database**

   Create a database and update `src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/makerspace
spring.datasource.username=your_username
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=update
```

3. **Build and run the backend**
```bash
mvn clean install
mvn spring-boot:run
```

The backend will be available at `http://localhost:8080`

### Frontend Setup

```bash
cd webapp
npm install # or yarn install
npm run dev # or yarn dev
```

The frontend will be available at `http://localhost:3000`

### Development Tools

- **API Documentation**: Visit `http://localhost:8080/swagger-ui.html` to explore and test API endpoints
- **Database Console**: H2 console available during testing at `http://localhost:8080/h2-console`
- **Hot Reload**: Both backend (Spring Boot DevTools) and frontend (Next.js) support hot reloading for development

---

## Project Structure

```
makerspace/
├── src/main/java/com/github/pooya1361/makerspace/
│   ├── auth/                    # Authentication controllers and DTOs
│   ├── controller/              # REST controllers
│   ├── model/                   # JPA entities
│   ├── dto/                     # Data Transfer Objects
│   ├── mapper/                  # MapStruct mappers
│   ├── repository/              # JPA repositories
│   ├── security/                # Security configuration and JWT handling
│   └── MakerspaceApplication.java
├── src/test/java/               # Test classes
├── webapp/                      # Next.js frontend application
└── pom.xml                      # Maven configuration
```

---

## Security Features

- **JWT Token Authentication**: Stateless authentication with secure token generation
- **HTTP-Only Cookies**: Prevents XSS attacks by storing tokens in HTTP-only cookies
- **Password Encryption**: BCrypt password hashing
- **CORS Configuration**: Properly configured for frontend-backend communication
- **Role-Based Access Control**: Support for different user roles and permissions
- **Security Testing**: Comprehensive security test coverage

---

## License

*(Add your license information here)*

## Contributing

*(Add contributing guidelines here)*