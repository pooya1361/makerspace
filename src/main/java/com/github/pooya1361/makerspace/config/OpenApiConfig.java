package com.github.pooya1361.makerspace.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeIn;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.info.License;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import io.swagger.v3.oas.annotations.servers.Server;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(
        info = @Info(
                contact = @Contact(
                        name = "Pouya Mahpeikar",
                        email = "pooya1361@gmail.com",
                        url = "https://www.makerspace.com"
                ),
                description = "OpenAPI documentation for Makerspace Application",
                title = "Makerspace API - OpenAPI 3.0",
                version = "1.0",
                license = @License(
                        name = "Apache 2.0",
                        url = "http://www.apache.org/licenses/LICENSE-2.0"
                ),
                termsOfService = "Terms of service for Makerspace API"
        ),
        servers = {
                @Server(
                        description = "Local DEV Server",
                        url = "http://localhost:8080"
                )
        },
        // This is the key part: applying the security scheme globally
        security = {
                @SecurityRequirement(name = "bearerAuth")
        }
)
@SecurityScheme(
        name = "bearerAuth", // This name must match the 'name' in @SecurityRequirement
        description = "JWT authentication using Bearer token",
        scheme = "bearer",
        type = SecuritySchemeType.HTTP,
        bearerFormat = "JWT",
        in = SecuritySchemeIn.HEADER // The token is expected in the header
)
public class OpenApiConfig {
    // This class primarily holds the annotations for OpenAPI definition
}