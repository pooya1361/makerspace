// src/main/java/com/github/pooya1361/makerspace/converter/OptionalOffsetDateTimeConverter.java
package com.github.pooya1361.makerspace.converter;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

import java.time.OffsetDateTime;
import java.util.Optional;

@Converter(autoApply = true) // This annotation tells JPA to apply this converter automatically
public class OptionalOffsetDateTimeConverter implements AttributeConverter<Optional<OffsetDateTime>, OffsetDateTime> {

    @Override
    public OffsetDateTime convertToDatabaseColumn(Optional<OffsetDateTime> attribute) {
        if (attribute == null) {
            return null;
        }
        // Convert Optional<OffsetDateTime> to OffsetDateTime for database storage
        return attribute.orElse(null); // If Optional is empty, store null in DB
    }

    @Override
    public Optional<OffsetDateTime> convertToEntityAttribute(OffsetDateTime dbData) {
        if (dbData == null) {
            return Optional.empty();
        }
        // Convert LocalDateTime from database to Optional<LocalDateTime> for the entity
        return Optional.ofNullable(dbData); // If DB data is null, Optional will be empty
    }
}