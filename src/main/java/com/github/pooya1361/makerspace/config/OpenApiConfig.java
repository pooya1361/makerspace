package com.github.pooya1361.makerspace.config;

import io.swagger.v3.oas.annotations.enums.SecuritySchemeIn;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.beans.factory.annotation.Value;

import java.util.ArrayList;
import java.util.List;

@Configuration
@SecurityScheme(
        name = "bearerAuth",
        description = "JWT authentication using Bearer token",
        scheme = "bearer",
        type = SecuritySchemeType.HTTP,
        bearerFormat = "JWT",
        in = SecuritySchemeIn.HEADER
)
public class OpenApiConfig {

    // This gets the server port from your application.properties or application.yml file.
    // It defaults to 8080 if not specified.
    @Value("${server.port:${SERVER_PORT:8080}}")
    private int port;

    @Value("${app.base-url:http://localhost}")
    private String baseUrl;

    @Bean
    public OpenAPI makerspaceOpenAPI() {
        // Define the global security requirement
        SecurityRequirement securityRequirement = new SecurityRequirement().addList("bearerAuth");

        // Define your info object
        Info info = new Info()
                .contact(new Contact()
                        .name("Pouya Mahpeikar")
                        .email("pooya1361@gmail.com")
                        .url("https://www.makerspace.com")
                )
                .description("OpenAPI documentation for Makerspace Application")
                .title("Makerspace API - OpenAPI 3.0")
                .version("1.0")
                .license(new License()
                        .name("Apache 2.0")
                        .url("http://www.apache.org/licenses/LICENSE-2.0")
                )
                .termsOfService("Terms of service for Makerspace API");

        List<Server> servers = new ArrayList<>();

        String environment = System.getenv("ENVIRONMENT"); // Set this in AWS

        if ("production".equals(environment) || "aws".equals(environment)) {
            // Create server for your actual AWS deployment
            Server awsServer = new Server();
            awsServer.setUrl("https://d10bevpih9tc2u.cloudfront.net" + ":" + port);
            awsServer.setDescription("AWS Production Server");
        } else {
            // Keep localhost for local development
            Server localServer = new Server();
            localServer.setUrl(baseUrl + ":" + port);
            localServer.setDescription("Local Development Server");
        }

        return new OpenAPI()
                .info(info)
                .servers(servers)  // AWS first, then local
                .addSecurityItem(securityRequirement);
    }
}
