// src/main/java/com/github/pooya1361/makerspace/converter/OptionalLocalDateTimeConverter.java
package com.github.pooya1361.makerspace.converter;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

import java.time.LocalDateTime;
import java.util.Optional;

@Converter(autoApply = true) // This annotation tells JPA to apply this converter automatically
public class OptionalLocalDateTimeConverter implements AttributeConverter<Optional<LocalDateTime>, LocalDateTime> {

    @Override
    public LocalDateTime convertToDatabaseColumn(Optional<LocalDateTime> attribute) {
        // Convert Optional<LocalDateTime> to LocalDateTime for database storage
        return attribute.orElse(null); // If Optional is empty, store null in DB
    }

    @Override
    public Optional<LocalDateTime> convertToEntityAttribute(LocalDateTime dbData) {
        // Convert LocalDateTime from database to Optional<LocalDateTime> for the entity
        return Optional.ofNullable(dbData); // If DB data is null, Optional will be empty
    }
}