// src/main/java/com/github/pooya1361/makerspace/mapper/OptionalMapper.java
package com.github.pooya1361.makerspace.mapper;

import java.time.LocalDateTime;
import java.util.Optional;
import org.springframework.stereotype.Component;

// This class contains reusable mapping logic for Optionals.
@Component
public class OptionalMapper {

    // Converts Optional<LocalDateTime> to LocalDateTime
    public LocalDateTime map(Optional<LocalDateTime> value) {
        return value != null ? value.orElse(null) : null;
    }

    // Converts LocalDateTime to Optional<LocalDateTime> (for the reverse mapping)
    public Optional<LocalDateTime> map(LocalDateTime value) {
        return Optional.ofNullable(value);
    }
}