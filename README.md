# Makerspace Project

This project, "Makerspace," is a full-stack application designed to manage scheduled lessons, proposed time slots, and user interactions. It demonstrates a modern technology stack for both the backend and frontend.

---

## Technologies Used

### Backend (Java/Spring Boot)

* **Java 21**: The core programming language. Chosen for its robustness, performance, and vast ecosystem.
* **Spring Boot 3.x**: A powerful framework for building stand-alone, production-grade Spring applications. It simplifies backend development with convention-over-configuration and embedded servers.
* **Spring Data JPA**: Simplifies data access layers by providing an easy way to implement JPA-based repositories, reducing boilerplate code for database interactions.
* **PostgreSQL**: A powerful, open-source relational database system. Chosen for its reliability, feature richness, and strong support for complex queries.
* **Lombok**: A library that reduces boilerplate code for Java classes (e.g., getters, setters, constructors, `equals`, `hashCode`). Improves code readability and maintainability.
* **MapStruct**: An annotation-based code generator that greatly simplifies the implementation of mapping interfaces between Java bean types (e.g., converting Entities to DTOs and vice-versa). Reduces manual mapping code and potential errors.
* **SpringDoc OpenAPI (Swagger UI)**: Automatically generates API documentation and provides an interactive UI for testing REST endpoints. Enhances API discoverability and simplifies collaboration.

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

## Getting Started

*(Add instructions here on how to set up and run the project locally, e.g., clone repository, build backend, run frontend, database setup, etc.)*

```bash
# Example Placeholder Instructions
# 1. Clone the repository
git clone [https://github.com/pooya1361/makerspace.git](https://github.com/pooya1361/makerspace.git)
cd makerspace

# 2. Backend Setup (Java/Maven)
# Configure your PostgreSQL database in src/main/resources/application.properties
# Run the Spring Boot application
mvn clean install
mvn spring-boot:run

# 3. Frontend Setup (Next.js/npm/yarn)
cd webapp
npm install # or yarn install
npm run dev # or yarn dev
