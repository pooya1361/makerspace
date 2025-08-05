# Use multi-stage build for smaller final image
FROM maven:3.9.6-eclipse-temurin-21-alpine AS build

# Set working directory
WORKDIR /app

# Copy pom.xml first for better Docker layer caching
COPY pom.xml .

# Download dependencies
RUN mvn dependency:go-offline -B

# Copy source code
COPY src ./src

# Build the application
RUN mvn clean package -DskipTests

# Runtime stage
FROM eclipse-temurin:21-jre-alpine

# Set working directory
WORKDIR /app

# Copy the JAR from build stage
COPY --from=build /app/target/makerspace-*.jar app.jar

# Expose port
EXPOSE 8080

# Set environment variables (you can override these in Amplify)
ENV SPRING_PROFILES_ACTIVE=docker
ENV SERVER_PORT=8080

# Install curl for health check
RUN apk add --no-cache curl

# Simple health check (since actuator might not be enabled)
HEALTHCHECK --interval=30s --timeout=3s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:8080/ || exit 1

# Run the application
ENTRYPOINT ["java", "-Dspring.profiles.active=docker", "-jar", "app.jar"]