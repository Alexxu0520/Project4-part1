package com.example.demo;

import org.springframework.data.repository.CrudRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

// Repository interface extending CrudRepository for GameRecord entities
public interface GameRecordRepository extends CrudRepository<GameRecord, Long> {

    // Custom query method to find game records by userId
    List<GameRecord> findByUserId(String userId);

    // Custom method to delete records by userId (Transactional for database consistency)
    @Transactional
    void deleteByUserId(String userId);

    // Custom method to delete records by handle (Assuming it's a typo in the method name)
    // (Transactional for database consistency)
    @Transactional
    void deleteByHandle(String handle);
}
