package com.backend.backend.data.repositories;

import com.backend.backend.data.models.Bag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface BagRepository extends JpaRepository<Bag, Long> {


    @Query("SELECT b FROM Bag b WHERE b.bagNumber = :bagNumber AND b.lotNumber = :lotNumber")
    Optional<Bag> findByBagNumberAndLotNumber(Long bagNumber, Long lotNumber);

    @Query("SELECT b FROM Bag b WHERE b.lotNumber = :lotNumber")
    List<Bag> findByLotNumber(Long lotNumber);


    @Query("SELECT b FROM Bag b WHERE b.status = :status")
    List<Bag> findByStatus(String status);
}
