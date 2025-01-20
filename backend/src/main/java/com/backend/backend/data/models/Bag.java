package com.backend.backend.data.models;

import io.swagger.v3.oas.annotations.tags.Tags;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;

import java.sql.Timestamp;

@Entity
@Data
@NoArgsConstructor
@Table(name = "Bags")
public class Bag{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private Timestamp createdAt;

    private String createdBy;
    private Long lotNumber;
    private Long bagNumber;
    private String status;
    private Timestamp scannedOutDate;
    private String scannedOutBy;

}
