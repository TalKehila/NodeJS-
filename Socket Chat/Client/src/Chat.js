import React, { useEffect, useState } from "react";
import Draggable from "react-draggable";
import ScrollToBottom from "react-scroll-to-bottom";

function Chat({ socket, username, selectedUser }) {
    const [currentMessage, setCurrentMessage] = useState("");
    const [messageList, setMessageList] = useState([]);

    // const sendMessage = async () => {
    //     if (currentMessage !== "") {
    //         const messageData = {
    //             room: `${username}_${selectedUser}`,
    //             author: username,
    //             message: currentMessage,
    //             time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes(),
    //         };

    //         await socket.emit("send_message", messageData);
    //         setMessageList((list) => [...list, messageData]);
    //         setCurrentMessage("");
    //     }
    // };
    const sendMessage = async () => {
        if (currentMessage !== "") {
            const messageData = {
                room: `${username}_${selectedUser}`,
                author: username,
                recipient: selectedUser, // Include recipient's username
                message: currentMessage,
                time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes(),
            };

            await socket.emit("send_message", messageData);
            setMessageList((list) => [...list, messageData]);
            setCurrentMessage("");
        }
    };


    useEffect(() => {
        socket.off("receive_message").on("receive_message", (data) => {
            setMessageList((list) => [...list, data]);
        });
    }, [socket]);

    return (
        <Draggable handle=".chat-header">
            <div className="chat-window">
                <div className="chat-header">
                    <p>Live Chat with {selectedUser}</p>
                </div>
                <div className="chat-body">
                    <ScrollToBottom className="message-container">
                        {messageList.map((messageContent, index) => {
                            return (
                                <div
                                    className="message"
                                    id={username === messageContent.author ? "you" : "other"}
                                    key={index}
                                >
                                    <div>
                                        <div className="message-content">
                                            <p>{messageContent.message}</p>
                                        </div>
                                        <div className="message-meta">
                                            <p id="time">{messageContent.time}</p>
                                            <p id="author">{messageContent.author}</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </ScrollToBottom>
                </div>
                <div className="chat-footer">
                    <input
                        type="text"
                        value={currentMessage}
                        placeholder="Hey..."
                        onChange={(event) => {
                            setCurrentMessage(event.target.value);
                        }}
                        onKeyPress={(event) => {
                            event.key === "Enter" && sendMessage();
                        }}
                    />
                    <button onClick={sendMessage}>&#9658;</button>
                </div>
            </div>
        </Draggable>
    );
}

export default Chat;
