import "./App.css";
import io from "socket.io-client";
import { useState } from "react";
import Chat from "./Chat";

const socket = io.connect("http://localhost:3001");

function App() {
  const [username, setUsername] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null); // New state to track selected user
  const [confirmationVisible, setConfirmationVisible] = useState(false); // State to manage visibility of confirmation dialog

  // Function to handle chat initiation with a selected user
  const startChat = (user) => {
    setSelectedUser(user);
    setConfirmationVisible(true);
  };

  // Function to handle confirmation of chat initiation
  const handleChatConfirmation = (confirm) => {
    if (confirm) {
      setShowChat(true);
    }
    setConfirmationVisible(false);
  };
  return (
    <div className="App">
      {confirmationVisible && (
        <div className="confirmationBox">
          <p>Do you want to start a chat with {selectedUser}?</p>
          <button onClick={() => handleChatConfirmation(true)}>Yes</button>
          <button onClick={() => handleChatConfirmation(false)}>No</button>
        </div>
      )}
      {!showChat && !confirmationVisible && (
        <div className="joinChatContainer">
          <h3>Join A Chat</h3>
          <input
            type="text"
            placeholder="Type..."
            onChange={(event) => {
              setUsername(event.target.value);
            }}
          />
          <button
            onClick={() => startChat(username)}
            style={{ backgroundColor: "green", color: "white" }} 
          >
            Join A Chat
          </button>
        </div>
      )}
      {showChat && <Chat socket={socket} username={username} selectedUser={selectedUser} />}
    </div>
  );
}

export default App;
