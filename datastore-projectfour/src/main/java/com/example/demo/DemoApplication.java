package com.example.demo;

import com.google.api.client.util.Lists;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.shell.standard.ShellMethod;

import java.util.List;
@SpringBootApplication
public class DemoApplication {

    @Autowired
    GameRecordRepository gameRecordRepository;
    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);
    }

    @ShellMethod("Load all game records")
    public String showAllRecords() {
        Iterable<GameRecord> gameRecords = this.gameRecordRepository.findAll();
        return Lists.newArrayList(gameRecords).toString();
    }
    @ShellMethod("Deletes game records by userId: delete-by-userId <userId>")
    public String deleteByUserId(String userId) {
        gameRecordRepository.deleteByUserId(userId);
        return "Deleted game records for userId: " + userId;
    }
    @ShellMethod("Deletes game records by handle: delete-by-handle <handle>")
    public String deleteByHandle(String handle) {
        gameRecordRepository.deleteByHandle(handle);
        return "Deleted game records for handle: " + handle;
    }
    @ShellMethod("Loads game records by userId: find-by-userId <userId>")
    public String findByUserId(String userId){
        List<GameRecord> gameRecords = this.gameRecordRepository.findByUserId(userId);
        return gameRecords.toString();
    }
}