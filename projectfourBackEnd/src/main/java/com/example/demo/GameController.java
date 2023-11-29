package com.example.demo;

import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
public class GameController {

  // GameRecordRepository to interact with game records in the database
  private final GameRecordRepository gameRecordRepository;

  // Constructor injection for GameRecordRepository
  public GameController(GameRecordRepository gameRecordRepository) {
    this.gameRecordRepository = gameRecordRepository;
  }

  // Endpoint to delete game records by userId
  @DeleteMapping("/deleteByUserId")
  @CrossOrigin(origins = "*")
  public String deleteByUserId(@RequestParam String userId) {
    gameRecordRepository.deleteByUserId(userId);
    return "Deleted records for userId: " + userId;
  }

  // Endpoint to delete game records by handle
  @DeleteMapping("/deleteByHandle")
  @CrossOrigin(origins = "*")
  public String deleteByHandle(@RequestParam String handle) {
    gameRecordRepository.deleteByHandle(handle);
    return "Deleted records for handle: " + handle;
  }

  // Endpoint to add a new game record
  @PostMapping("/addGameRecord")
  @CrossOrigin(origins = "*")
  public String addGameRecord(@RequestBody GameRecord gameRecord) {
    // Check if the provided game record is valid
    if (gameRecord == null) {
      return "The gameRecord is invalid";
    }
    // Save the game record to the repository
    this.gameRecordRepository.save(gameRecord);
    return "success";
  }

  // Endpoint to find game records by userId
  @GetMapping("/findByUserId")
  @CrossOrigin(origins = "*")
  public List<GameRecord> findByUserId(@RequestParam String userId) {
    return gameRecordRepository.findByUserId(userId);
  }

  // Endpoint to fetch all game records
  @GetMapping("/showAllRecords")
  @ResponseBody
  @CrossOrigin(origins = "*")
  public List<GameRecord> showAllRecords() {
    // Fetch all game records from the repository
    Iterable<GameRecord> gameRecords = this.gameRecordRepository.findAll();
    List<GameRecord> recordList = new ArrayList<>();
    // Convert the Iterable to a List
    gameRecords.forEach(recordList::add);
    return recordList;
  }
}
