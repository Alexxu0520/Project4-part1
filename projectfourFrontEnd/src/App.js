// Importing necessary dependencies and styles
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './App.css'; // Importing CSS for styling
import ControlPanel from './ControlPanel';
import GameBoard from './GameBoard';

// Importing Firebase authentication and configuration
import { initializeApp } from 'firebase/app';
import { GoogleAuthProvider, getAuth, signInWithRedirect } from 'firebase/auth';

const MAX_GUESSES = 11;
// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAilqOTb58wG9NdTO7LA9WrRO_fywZQW_A",
  authDomain: "delta-suprstate-405602.firebaseapp.com",
  projectId: "delta-suprstate-405602",
  storageBucket: "delta-suprstate-405602.appspot.com",
  messagingSenderId: "570118767429",
  appId: "1:570118767429:web:2d53db61a759086eafb42c",
};

initializeApp(firebaseConfig);

const App = () => {
  const [deleteUserId, setDeleteUserId] = useState('');
  const [newHandle, setNewHandle] = useState('');
  const [oldHandle, setOldHandle] = useState('');
  const [gameRecords, setGameRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState('');
  const [handle, setHandle] = useState('');
  const [score, setScore] = useState(0); // State to store the score
  const [gameOver, setGameOver] = useState(false); // State to track if the game is over

  const [viewOwnRecords, setViewOwnRecords] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 3; // You can adjust this number as needed
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = gameRecords.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(gameRecords.length / recordsPerPage);
  const goToNextPage = () => setCurrentPage(page => Math.min(page + 1, totalPages));
  const goToPreviousPage = () => setCurrentPage(page => Math.max(page - 1, 1));
  const goToPage = (pageNumber) => setCurrentPage(pageNumber);

  const [submitChoice, setSubmitChoice] = useState(null);


  // State hook for keeping track of all guesses made
  const [guesses, setGuesses] = useState([]);
  // The secret combination to be guessed, hardcoded for this example
  const secret = "RGBY";
 // Effect hook for handling authentication changes and fetching game records
  useEffect(() => {
    const auth = getAuth();
    auth.onAuthStateChanged(user => {
      if (user) {
        setUserId(user.uid);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    });
    if (viewOwnRecords) {
      displayUserGameRecords();
    } else {
      displayAllGameRecords();
    }
  }, [viewOwnRecords, userId]); // Make sure to include userId in the dependency array

  async function handleSubmit(event) {
    event.preventDefault();
    
    const postData = {
        userId,
        handle,
        score
    };

    try {
        const response = await axios.post('https://delta-suprstate-405602.uc.r.appspot.com/addGameRecord', postData);
        console.log('Response:', response.data);
        //showAllRecords()
    } catch (error) {
        console.error('Error posting data:', error);
    }
    startNewRound();
  };
  const handleDontSubmit = () => {
    setSubmitChoice(false);
    startNewRound();
  };

  const startNewRound = () => {
    setGameOver(false);
    setSubmitChoice(null);
    setScore(0);
    setGuesses([]);
    // Reset any other relevant state variables
  };
  const deleteByUserId = async () => {
    try {
      // Delete records from the database
      await axios.delete(`https://delta-suprstate-405602.uc.r.appspot.com/deleteByUserId?userId=${deleteUserId}`);

      // Update the local state by filtering out the deleted records
      setGameRecords(prevRecords => prevRecords.filter(record => record.userId !== deleteUserId));
    } catch (error) {
      console.error('Error deleting records by userId:', error);
    }
  };

  const changeHandle = async () => {
    try {
      // Find the game record with the old handle
      const recordToUpdate = gameRecords.find(record => record.handle.toLowerCase() === oldHandle.toLowerCase());

      if (recordToUpdate) {
        // Create a copy of the record with the updated handle
        const updatedRecord = {
          userId: recordToUpdate.userId,
          handle: newHandle,
          score: recordToUpdate.score,
        };

        // Delete the old record from the database
        await axios.delete(`https://delta-suprstate-405602.uc.r.appspot.com/deleteByHandle?handle=${oldHandle.toLowerCase()}`);

        // Add the updated record to the database
        await axios.post('https://delta-suprstate-405602.uc.r.appspot.com/addGameRecord', updatedRecord);

        // Update the local state with the modified game record
        setGameRecords(prevRecords => {
          const updatedRecords = prevRecords.map(record => {
            return record.id === recordToUpdate.id ? updatedRecord : record;
          });
          return updatedRecords;
        });
      }
    } catch (error) {
      console.error('Error updating handle:', error);
    }
  };
  
  // function to call API to get all books in DB
  function displayAllGameRecords() {
    setLoading(true);
    axios.get('https://delta-suprstate-405602.uc.r.appspot.com/showAllRecords')
      .then(response => {
        const sortedRecords = response.data.sort((a, b) => b.score - a.score);
        setGameRecords(sortedRecords);
        setLoading(false);
      })
      .catch(error => {
        setError(error.message);
        setLoading(false);
      });
  }
  

  function displayUserGameRecords() {
    setLoading(true);
    axios.get(`https://delta-suprstate-405602.uc.r.appspot.com/findByUserId?userId=${userId}`)
      .then(response => {
        const sortedRecords = response.data.sort((a, b) => b.score - a.score);
        setGameRecords(sortedRecords);
        setLoading(false);
      })
      .catch(error => {
        setError(error.message);
        setLoading(false);
      });
  }
  
  

  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    const auth = getAuth();
    signInWithRedirect(auth, provider);
  };
  
  const signOut = () => {
    const auth = getAuth();
    auth.signOut();
  };
  
  const calculateScore = (numberOfGuesses) => {
    return (MAX_GUESSES - numberOfGuesses) * 10;
  };

  // Function to add a new guess to the state
  const addGuess = (newGuess) => {
    // Compare the new guess to the secret to determine exact and partial matches
    const results = compareGuessToSecret(newGuess, secret);
    // Update the guesses state with the new guess and the results of the comparison
    setGuesses(guesses.concat({ guess: newGuess, results }));
    const newGuesses = guesses.concat({ guess: newGuess, results });
    setGuesses(newGuesses);

    // Check if the game is over
    if (results.exacts === secret.length || newGuesses.length >= MAX_GUESSES) {
      setGameOver(true);
      setScore(calculateScore(newGuesses.length));
        // Do not automatically submit. Instead, ask for user's choice.
        setSubmitChoice(null); // Reset the choice for a new game
    }
  };

  // Function to compare a guess to the secret
  const compareGuessToSecret = (guess, secret) => {
    let exacts = 0; // Counter for exact matches
    let partials = 0; // Counter for partial matches
    let secretArray = secret.split(''); // Split the secret into an array for comparison
    let guessArray = guess.split(''); // Split the guess into an array for comparison

    // Check for exact matches
    secretArray.forEach((s, index) => {
      if (s === guessArray[index]) {
        exacts++;
        // Nullify the matched elements to avoid recounting them in partial matches
        secretArray[index] = null;
        guessArray[index] = null;
      }
    });

    // Check for partial matches (correct color in the wrong place)
    guessArray.forEach((g, index) => {
      if (g && secretArray.includes(g)) {
        partials++;
        // Nullify the matched element in the secret array to avoid recounting
        secretArray[secretArray.indexOf(g)] = null;
      }
    });

    // Return the results as an object with exact and partial counts
    return { exacts, partials };
  };

  if (!isAuthenticated) {
    return (
      <div className="login-prompt">
        <button onClick={signInWithGoogle}>Sign in with Google</button>
      </div>
    );
  }
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  // Render the main game app with a title, game board, and control panel
  return (
    <div className="app">
      <h1>MasterMind Game</h1>
      <GameBoard guesses={guesses} />
      <ControlPanel onGuessSubmit={gameOver ? null : addGuess} />
      {gameOver && (
        <div>
          <p>Your score: {score}</p >
          {!submitChoice && (
            <div>
              <button onClick={() => setSubmitChoice(true)}>Submit Score</button>
              <button onClick={handleDontSubmit}>Don't Submit</button>
            </div>
          )}
          {submitChoice && submitChoice === true && (
            <form onSubmit={handleSubmit}>
        <label>
            Handle(YourGameName): 
            <input type="text" value={handle} onChange={e => setHandle(e.target.value)} />
        </label>
        <br />
        <button type="submit">Submit</button>
      </form>
      )}
                {submitChoice === false && <p>Game ended without submitting score.</p >}
        </div>
      )}
      
        {/* Input for userId to delete records */}
        <label>
        Delete records by UserId:
        <input type="text" value={deleteUserId} onChange={e => setDeleteUserId(e.target.value)} />
      </label>
      <button onClick={deleteByUserId}>Delete By UserId</button>


  {/* Input for old handle */}
  <label>
        Old Handle:
        <input type="text" value={oldHandle} onChange={e => setOldHandle(e.target.value)} />
      </label>

      {/* Input and button to change handle name */}
      <label>
        New Handle:
        <input type="text" value={newHandle} onChange={e => setNewHandle(e.target.value)} />
      </label>
      <button onClick={changeHandle}>Change Handle</button>

    <button onClick={() => setViewOwnRecords(!viewOwnRecords)}>
      {viewOwnRecords ? "View High Score" : "View My Records"}
    </button>
    {currentRecords.map(gameRecord => (
      <div className="game-record-item" key={gameRecord.id}>
        <p>{gameRecord.handle} ID:{gameRecord.userId}</p >
        <p>Score: {gameRecord.score}, Date: {gameRecord.date}</p >
        {/* Include other game record details as needed */}
      </div>
    ))}
    <div className="pagination">
        <button onClick={goToPreviousPage} disabled={currentPage === 1}>Previous</button>
        {[...Array(totalPages).keys()].map(number => (
          <button
            key={number}
            onClick={() => goToPage(number + 1)}
            disabled={currentPage === number + 1}
          >
            {number + 1}
          </button>
        ))}
        <button onClick={goToNextPage} disabled={currentPage === totalPages}>Next</button>
      </div>
      <button onClick={signOut}>Sign Out</button>
    </div>
  );
};

// Export the App component for use in other files
export default App;