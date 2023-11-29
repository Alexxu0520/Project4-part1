package com.example.demo;

import org.springframework.data.repository.CrudRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface GameRecordRepository extends CrudRepository<GameRecord, Long> {
    List<GameRecord> findByUserId(String userId);
    // Custom method to delete records by userId
    @Transactional
    void deleteByUserId(String userId);
    @Transactional
    void deleteByHandle(String userId);
}