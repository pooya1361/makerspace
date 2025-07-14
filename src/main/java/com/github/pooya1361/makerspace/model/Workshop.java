package com.github.pooya1361.makerspace.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity // Marks this class as a JPA entity, mapped to a database table
@Table(name = "workshops") // Specifies the name of the database table (singular 'user' is often reserved)
@Data // Lombok: Generates getters, setters, toString, equals, and hashCode
@NoArgsConstructor // Lombok: Generates a no-argument constructor
@AllArgsConstructor // Lombok: Generates a constructor with all fields
public class Workshop {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(nullable = true) // Ensures username is not null and is unique
    private String description;
    @Column(nullable = true) // Ensures username is not null and is unique
    private double size;

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public double getSize() {
        return size;
    }

    public void setSize(double size) {
        this.size = size;
    }

    public Workshop(Workshop workshop) {
        this.id = workshop.getId();
        this.name = workshop.getName();
        this.description = workshop.getDescription();
        this.size = workshop.getSize();
    }
}
