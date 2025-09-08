# Makerspace Project

🚀 **Live Demo**: [https://makerspace.mahpeikar.se](https://makerspace.mahpeikar.se)

📊 **API Documentation**:
- [REST API (Swagger UI)](https://api.makerspace.mahpeikar.se/swagger-ui.html)
- [GraphQL Playground](https://api.makerspace.mahpeikar.se/graphiql) *(Development)*

This project, "Makerspace," is a full-stack application designed to manage scheduled lessons, proposed time slots, and user interactions with comprehensive authentication and authorization. It demonstrates a modern technology stack deployed on **AWS** with robust security, testing practices, and **dual API architecture** supporting both REST and GraphQL.

## 📋 Table of Contents

- [Live Deployment](#-live-deployment)
- [Technologies Used](#-technologies-used)
- [Authentication & Security](#-authentication--security)
- [API Architecture](#-api-architecture)
- [Frontend Architecture](#-frontend-architecture)
- [Testing](#-testing)
- [Local Development](#-local-development)
- [Deployment Architecture](#-deployment-architecture)
- [Migration Strategy](#-migration-strategy)
- [Developer](#-developer)

---

## 🌟 Live Deployment

**Architecture Overview:**
- **Frontend**: Next.js deployed on **AWS Amplify** with HTTPS and Server-Side Rendering (SSR)
- **Backend**: Spring Boot deployed on **AWS Elastic Beanstalk** with dual API support
- **Database**: PostgreSQL on **AWS RDS**
- **Domain**: Custom SSL certificates and load balancing

### Demo Accounts
Test the live application with these accounts:
- **Test**: `test@makerspace.com` / `test`
- **Admin**: `admin@makerspace.com` / `!Admin`

---

## 🛠️ Technologies Used

### Backend (Java/Spring Boot)

* **Java 21**: The core programming language. Chosen for its robustness, performance, latest language features, and vast ecosystem.
* **Spring Boot 3.5.3**: A powerful framework for building stand-alone, production-grade Spring applications. It simplifies backend development with convention-over-configuration and embedded servers.
* **Spring Security**: Comprehensive security framework providing authentication, authorization, and protection against common security vulnerabilities. Integrated with JWT for stateless authentication.
* **Spring GraphQL**: Modern GraphQL integration for Spring Boot, providing type-safe query execution and seamless security integration.
* **JWT (JSON Web Tokens)**: Stateless authentication mechanism using the `jjwt` library (v0.12.6). Provides secure token-based authentication with HTTP-only cookies for enhanced security.
* **Spring Data JPA**: Simplifies data access layers by providing an easy way to implement JPA-based repositories, reducing boilerplate code for database interactions.
* **PostgreSQL**: A powerful, open-source relational database system. Chosen for its reliability, feature richness, and strong support for complex queries.
* **Lombok**: A library that reduces boilerplate code for Java classes (e.g., getters, setters, constructors, `equals`, `hashCode`). Improves code readability and maintainability.
* **MapStruct 1.6.2**: An annotation-based code generator that greatly simplifies the implementation of mapping interfaces between Java bean types (e.g., converting Entities to DTOs and vice-versa). Reduces manual mapping code and potential errors.
* **SpringDoc OpenAPI 2.8.5 (Swagger UI)**: Automatically generates API documentation and provides an interactive UI for testing REST endpoints. Enhances API discoverability and simplifies collaboration.

### Frontend (Next.js/React)

* **Next.js 15**: A React framework for building full-stack web applications. Provides features like server-side rendering (SSR), static site generation (SSG), and API routes, optimizing performance and developer experience.
* **React**: A declarative, component-based JavaScript library for building user interfaces. Simplifies the creation of interactive and reusable UI components.
* **TypeScript**: A typed superset of JavaScript that compiles to plain JavaScript. Enhances code quality, readability, and maintainability by catching errors at compile time.
* **Tailwind CSS**: A utility-first CSS framework. Enables rapid UI development by providing low-level utility classes directly in your JSX, reducing the need for custom CSS.
* **Redux Toolkit (RTK)**: The official, opinionated, batteries-included toolset for efficient Redux development. Simplifies Redux setup and common tasks.
* **RTK Query**: A powerful data fetching and caching tool built on top of Redux Toolkit. Supports both REST and GraphQL endpoints, provides automatic caching, revalidation, and handles loading/error states.
* **Server-Side Rendering (SSR)**: Full SSR support with Next.js middleware for authentication and RTK Query server-side data prefetching.
* **`cz.habarta.typescript-generator-maven-plugin`**: A Maven plugin used to automatically generate TypeScript interfaces (e.g., from Java DTOs). Ensures type safety and consistency between frontend and backend data models.

### Testing Framework

* **JUnit 5**: Modern testing framework for Java applications with improved annotations, assertions, and test lifecycle management.
* **Mockito 5.12.0**: Powerful mocking framework for unit testing, enabling isolated testing of components by mocking dependencies.
* **Spring Boot Test**: Comprehensive testing support including `@WebMvcTest`, `@MockBean`, and security testing utilities.
* **MockMvc**: Spring's testing framework for testing web layers in isolation with simulated HTTP requests and responses.
* **H2 Database**: In-memory database used for testing environments, providing fast and isolated test execution.
* **Spring Security Test**: Testing utilities for security-related functionality including authentication and authorization testing.

### Cloud Infrastructure (AWS)

* **AWS Amplify**: Frontend hosting with automatic CI/CD from GitHub, HTTPS certificates, and global CDN
* **AWS Elastic Beanstalk**: Backend application hosting with auto-scaling, load balancing, and health monitoring
* **Amazon RDS (PostgreSQL)**: Managed relational database service with automated backups and security
* **AWS VPC**: Virtual private cloud with proper security groups and network configuration

---

## 🔐 Authentication & Security

* **JWT Authentication**: Stateless authentication using JSON Web Tokens
* **HTTP-Only Cookies**: Secure token storage preventing XSS attacks
* **Role-Based Access Control**: User roles and permissions management (Student, Instructor, Admin)
* **Password Encryption**: Secure password hashing using Spring Security's password encoders
* **CORS Configuration**: Cross-Origin Resource Sharing setup for frontend-backend communication
* **HTTPS Encryption**: SSL/TLS certificates for secure data transmission
* **GraphQL Security**: Method-level security with `@PreAuthorize` annotations for GraphQL mutations
* **Next.js Middleware**: Route protection and authentication validation at the edge

---

## 📚 API Architecture

This application supports **dual API architecture** - both REST and GraphQL endpoints running simultaneously:

### REST API Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login (returns JWT in HTTP-only cookie)
- `POST /api/auth/logout` - User logout (clears authentication cookie)
- `GET /api/auth/me` - Get current authenticated user information
- **Lessons Management**: CRUD operations for lesson scheduling
- **User Management**: User profiles and role management
- **Workshop Management**: Workshop creation and enrollment
- **Time Slot Management**: Available time slot management and voting

### GraphQL API Endpoints
- **Single Endpoint**: `POST /graphql` - All GraphQL operations
- **Development UI**: `/graphiql` - Interactive GraphQL playground

#### GraphQL Schema Features
```graphql
# Queries
workshops: [WorkshopResponse!]!
workshop(id: ID!): WorkshopResponse

# Mutations (Admin/SuperAdmin only)
createWorkshop(input: WorkshopCreateInput!): WorkshopResponse!
updateWorkshop(id: ID!, input: WorkshopCreateInput!): WorkshopResponse!
deleteWorkshop(id: ID!): Boolean!

# Types
type WorkshopResponse {
  id: ID!
  name: String!
  description: String
  size: Float!
  activities: [ActivitySummary!]
}
```

### API Documentation
- **REST API**: [Swagger UI](https://api.makerspace.mahpeikar.se/swagger-ui.html)
- **GraphQL**: [GraphiQL Playground](https://api.makerspace.mahpeikar.se/graphiql)
- **OpenAPI JSON**: Available at `/v3/api-docs`

---

## 🏗️ Frontend Architecture

### Server-Side Rendering (SSR)
- **True SSR**: Data fetched on server with authentication
- **RTK Query SSR**: Server-side data prefetching with seamless client hydration
- **No Loading States**: Instant page renders with pre-fetched data
- **SEO Optimized**: Complete HTML rendered on server

### Data Fetching Strategy
```typescript
// Server Component (page.tsx)
await dispatchWithServerCookies(
  store.dispatch, 
  apiSlice.endpoints.getWorkshopsGraphQL, 
  cookieHeader
);

// Client Component
const { data: workshops } = useGetWorkshopsGraphQLQuery();
// Uses server-cached data instantly - no loading state!
```

### Authentication Flow
```
1. Next.js Middleware → Route Protection
2. Server Component → Pre-fetch Data with Cookies  
3. Client Component → Use Cached Data + Mutations
4. RTK Query → Handle Cache Invalidation
```

---

## ♿ Accessibility & WCAG Compliance

This application is built with accessibility as a core requirement, following **WCAG 2.1 AA guidelines** to ensure usability for all users, including those with disabilities.

### Accessibility Features

* **Semantic HTML**: Proper use of heading hierarchy, landmarks, and semantic elements (`<article>`, `<nav>`, `<main>`)
* **Keyboard Navigation**: Full keyboard accessibility with visible focus indicators and logical tab order
* **Screen Reader Support**: ARIA labels, roles, and properties for assistive technology compatibility
* **Color Contrast**: All text meets WCAG AA contrast ratio requirements (4.5:1 minimum)
* **Form Accessibility**: Properly associated labels, error messages, and validation feedback
* **Focus Management**: Automatic focus handling in modals and dynamic content
* **Motion Preferences**: Respects `prefers-reduced-motion` for users sensitive to animations

### WCAG Compliance Implementation

* **Form Components**: All forms include proper label associations, required field indicators, and field-specific error messages
* **Modal Dialogs**: Accessible confirmation dialogs with focus trapping and keyboard support (Escape to close)
* **Interactive Elements**: Buttons and links with descriptive labels and appropriate ARIA attributes
* **Loading States**: Screen reader announcements for dynamic content changes
* **Error Handling**: Accessible error messages with `role="alert"` for immediate user feedback
* **Navigation**: Skip links and proper heading structure for easy page navigation

### Accessibility Testing

The application undergoes regular accessibility testing using:
* **Automated Testing**: axe-core integration for continuous accessibility monitoring
* **Manual Testing**: Keyboard navigation and screen reader testing
* **Color Contrast**: WebAIM Contrast Checker validation for all color combinations
* **WCAG Audits**: Regular compliance audits against WCAG 2.1 AA standards

### Screen Reader Compatibility

Tested and optimized for:
* **NVDA** (Windows)
* **JAWS** (Windows) 
* **VoiceOver** (macOS)
* **Orca** (Linux)

### Accessibility Standards

* **WCAG 2.1 Level AA**: Full compliance with Web Content Accessibility Guidelines
* **Section 508**: US federal accessibility requirements
* **ADA Compliance**: Americans with Disabilities Act digital accessibility standards
* **EN 301 549**: European accessibility standard for ICT products and services

---

## 🧪 Testing

The project includes comprehensive testing coverage:

- **Unit Tests**: Component-level testing with Mockito mocks
- **Integration Tests**: `@WebMvcTest` for web layer testing
- **GraphQL Tests**: Query and mutation testing with Spring GraphQL Test
- **Security Tests**: Authentication and authorization testing for both REST and GraphQL
- **Repository Tests**: Data layer testing with H2 in-memory database

Run tests with:
```bash
mvn test
```

---

## 🚀 Local Development

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

# GraphQL Configuration
spring.graphql.graphiql.enabled=true
spring.graphql.graphiql.path=/graphiql
```

3. **Build and run the backend**
```bash
mvn clean install
mvn spring-boot:run
```

The backend will be available at:
- **REST API**: `http://localhost:8080`
- **GraphQL**: `http://localhost:8080/graphql`
- **GraphiQL**: `http://localhost:8080/graphiql`

### Frontend Setup

```bash
cd webapp
npm install # or yarn install
npm run dev # or yarn dev
```

The frontend will be available at `http://localhost:3000`

### Development Tools

- **REST API Documentation**: Visit `http://localhost:8080/swagger-ui.html` to explore and test REST endpoints
- **GraphQL Playground**: Visit `http://localhost:8080/graphiql` for interactive GraphQL queries
- **Database Console**: H2 console available during testing at `http://localhost:8080/h2-console`
- **Hot Reload**: Both backend (Spring Boot DevTools) and frontend (Next.js) support hot reloading for development

### Example GraphQL Queries

```graphql
# Get all workshops
query {
   workshops {
      id
      name
      description
      size
      activities {
         id
         name
      }
   }
}

# Create a workshop (requires Admin role)
mutation {
   createWorkshop(input: {
      name: "3D Printing Workshop"
      description: "Learn 3D printing basics"
      size: 150.0
      activityIds: ["1", "2"]
   }) {
      id
      name
      size
   }
}
```

---

## 📁 Project Structure

```
makerspace/
├── src/main/java/com/github/pooya1361/makerspace/
│   ├── auth/                    # Authentication controllers and DTOs
│   ├── controller/              # REST controllers
│   ├── graphql/                 # GraphQL controllers and resolvers
│   ├── model/                   # JPA entities
│   ├── dto/                     # Data Transfer Objects
│   ├── mapper/                  # MapStruct mappers
│   ├── repository/              # JPA repositories
│   ├── security/                # Security configuration and JWT handling
│   └── MakerspaceApplication.java
├── src/main/resources/
│   ├── graphql/                 # GraphQL schema definitions
│   │   └── schema.graphqls
│   └── application.properties
├── src/test/java/               # Test classes
├── webapp/                      # Next.js frontend application
│   ├── app/
│   │   ├── lib/features/api/    # RTK Query API slice (REST + GraphQL)
│   │   ├── workshops/           # Workshop pages with SSR
│   │   └── middleware.ts        # Next.js authentication middleware
│   └── package.json
└── pom.xml                      # Maven configuration
```

---

## 🏗️ Deployment Architecture

```
┌─────────────────┐    HTTPS     ┌─────────────────┐
│   AWS Amplify   │◄─────────────┤     Users       │
│ (Next.js SSR)   │              │   (Browsers)    │
└─────────┬───────┘              └─────────────────┘
          │
          │ HTTPS API Calls (REST + GraphQL)
          ▼
┌─────────────────┐              ┌─────────────────┐
│ Elastic         │◄─────────────┤ Application     │
│ Beanstalk       │              │ Load Balancer   │
│ (Spring Boot)   │              │ (HTTPS/HTTP)    │
│ REST + GraphQL  │              └─────────────────┘
└─────────┬───────┘              
          │
          │ PostgreSQL Protocol
          ▼
┌─────────────────┐              ┌─────────────────┐
│   Amazon RDS    │◄─────────────┤   VPC Security  │
│  (PostgreSQL)   │              │     Groups      │
└─────────────────┘              └─────────────────┘
```

---

## 🎯 Features Demonstrated

- **Dual API Architecture**: Both REST and GraphQL endpoints running simultaneously
- **Full-Stack SSR**: Next.js server-side rendering with authenticated data fetching
- **Modern Frontend**: React with TypeScript, Redux state management, and responsive design
- **GraphQL Integration**: Type-safe GraphQL with Spring GraphQL and client-side caching
- **Advanced Authentication**: JWT-based security with Next.js middleware and role-based access
- **Database Integration**: Complex relationships and queries with PostgreSQL
- **Cloud Deployment**: Production-ready deployment on AWS with proper scaling
- **Testing**: Comprehensive test suite with unit, integration, and GraphQL tests
- **API Documentation**: Auto-generated interactive documentation for both REST and GraphQL
- **Security Best Practices**: HTTPS, password hashing, CORS, and secure cookie handling
- **Performance Optimization**: RTK Query caching, SSR, and optimized bundle sizes

---

## 📈 Performance & Scalability

- **Server-Side Rendering**: Faster initial page loads and better SEO
- **RTK Query Caching**: Intelligent client-side caching reduces API calls
- **GraphQL Efficiency**: Request only needed data, reducing network overhead
- **Auto-scaling**: Elastic Beanstalk automatically scales based on traffic
- **Database Performance**: RDS with proper indexing and connection pooling
- **CDN**: Amplify provides global content delivery for frontend assets
- **Load Balancing**: Application Load Balancer distributes traffic across instances

---

## 🔄 Migration Strategy

The application demonstrates a **gradual migration approach** from REST to GraphQL:

1. **Phase 1**: REST API foundation (✅ Complete)
2. **Phase 2**: GraphQL endpoints alongside REST (✅ Complete)
3. **Phase 3**: Client-side GraphQL adoption with SSR (✅ Complete)
4. **Phase 4**: Gradual REST endpoint deprecation (🔄 In Progress)

This approach allows for:
- **Zero downtime** during migration
- **Gradual team adoption** of GraphQL
- **Fallback options** if issues arise
- **Performance comparison** between approaches

---

## 👨‍💻 Developer

**Pouya Mahpeikar**  
Full-Stack Developer  
[GitHub](https://github.com/pooya1361) | [LinkedIn](https://www.linkedin.com/in/pouya-mahpeikar-2b473a53/) | [Portfolio](https://portfolio.mahpeikar.se)

---

*This project showcases modern full-stack development practices, including dual API architecture (REST + GraphQL), server-side rendering, cloud deployment expertise, and production-ready software engineering skills.*