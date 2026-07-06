package com.hiresense.recruitment.model;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import org.postgresql.util.PGobject;
import java.sql.SQLException;

@Converter(autoApply = true)
public class VectorConverter implements AttributeConverter<float[], Object> {

    @Override
    public Object convertToDatabaseColumn(float[] attribute) {
        if (attribute == null) {
            return null;
        }
        try {
            PGobject pgobject = new PGobject();
            pgobject.setType("vector");
            StringBuilder sb = new StringBuilder();
            sb.append("[");
            for (int i = 0; i < attribute.length; i++) {
                sb.append(attribute[i]);
                if (i < attribute.length - 1) {
                    sb.append(",");
                }
            }
            sb.append("]");
            pgobject.setValue(sb.toString());
            return pgobject;
        } catch (SQLException e) {
            throw new RuntimeException("Failed to convert float[] to PGobject vector", e);
        }
    }

    @Override
    public float[] convertToEntityAttribute(Object dbData) {
        if (dbData == null) {
            return null;
        }
        String value = dbData.toString();
        if (value.startsWith("[") && value.endsWith("]")) {
            value = value.substring(1, value.length() - 1);
        }
        if (value.trim().isEmpty()) {
            return new float[0];
        }
        String[] parts = value.split(",");
        float[] result = new float[parts.length];
        for (int i = 0; i < parts.length; i++) {
            result[i] = Float.parseFloat(parts[i].trim());
        }
        return result;
    }
}
