package com.example.demo;

import com.google.cloud.spring.data.datastore.core.mapping.Entity;
import org.springframework.data.annotation.Id;
import java.util.Date;

// Entity annotation indicates that this class is a Datastore entity
@Entity(name = "games")
public class GameRecord {
  
  // Unique identifier for the GameRecord
  @Id
  private Long id;

  // User ID associated with the game record
  private String userId;

  // User's handle or game name
  private String handle;

  // Score achieved in the game
  private int score;

  // Date when the game record was created
  private Date date;

  // Constructor to create a new GameRecord with user details and score
  public GameRecord(String userId, String handle, int score) {
    this.userId = userId;
    this.handle = handle;
    this.score = score;
    this.date = new Date(); // Set the current date when the record is created
  }

  // ToString method to provide a string representation of the GameRecord
  @Override
  public String toString() {
    return "GameRecord{" +
            "id=" + id +
            ", userId='" + userId + '\'' +
            ", handle='" + handle + '\'' +
            ", score=" + score +
            ", date=" + date +
            '}';
  }

  // Getter and setter methods for various attributes

  public void setId(Long id) {
    this.id = id;
  }

  public void setUserId(String userId) {
    this.userId = userId;
  }

  public void setHandle(String handle) {
    this.handle = handle;
  }

  public void setScore(int score) {
    this.score = score;
  }

  public Long getId() {
    return id;
  }

  public String getUserId() {
    return userId;
  }

  public String getHandle() {
    return handle;
  }

  public int getScore() {
    return score;
  }

  public Date getDate() {
    return date;
  }

  public void setDate(Date date) {
    this.date = date;
  }
}
