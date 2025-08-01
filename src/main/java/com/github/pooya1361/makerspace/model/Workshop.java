package com.github.pooya1361.makerspace.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

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

    private String description;

    private double size;

    @OneToMany(mappedBy = "workshop", fetch = FetchType.LAZY)
    // @JsonManagedReference // If you have bidirectional relationships and want to avoid infinite recursion in JSON
    private List<Activity> activities; // Assuming Activity is your entity for activities
}
