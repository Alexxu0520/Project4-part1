package com.example.demo;

import com.google.api.client.util.Lists;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.shell.standard.ShellMethod;

import java.util.List;

@SpringBootApplication
public class DemoApplication {

    // Autowired annotation for dependency injection of GameRecordRepository
    @Autowired
    GameRecordRepository gameRecordRepository;

    // Main method to run the Spring Boot application
    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);
    }

    // Shell command to load all game records
    @ShellMethod("Load all game records")
    public String showAllRecords() {
        // Fetch all game records from the repository
        Iterable<GameRecord> gameRecords = this.gameRecordRepository.findAll();
        // Convert the Iterable to a List and return its string representation
        return Lists.newArrayList(gameRecords).toString();
    }

    // Shell command to delete game records by userId
    @ShellMethod("Deletes game records by userId: delete-by-userId <userId>")
    public String deleteByUserId(String userId) {
        // Delete game records by userId using the repository
        gameRecordRepository.deleteByUserId(userId);
        return "Deleted game records for userId: " + userId;
    }

    // Shell command to delete game records by handle
    @ShellMethod("Deletes game records by handle: delete-by-handle <handle>")
    public String deleteByHandle(String handle) {
        // Delete game records by handle using the repository
        gameRecordRepository.deleteByHandle(handle);
        return "Deleted game records for handle: " + handle;
    }

    // Shell command to load game records by userId
    @ShellMethod("Loads game records by userId: find-by-userId <userId>")
    public String findByUserId(String userId){
        // Fetch game records by userId from the repository
        List<GameRecord> gameRecords = this.gameRecordRepository.findByUserId(userId);
        // Return the string representation of the list of game records
        return gameRecords.toString();
    }
}
