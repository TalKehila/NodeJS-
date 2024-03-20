const express = require('express');
const http = require("http");
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

// Store active users and their corresponding rooms
const activeUsers = {};

io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("join_room", (data) => {
        const { username, room } = data;
        const user = { id: socket.id, username };

        // Check if the room exists
        if (!activeUsers[room]) {
            activeUsers[room] = [];
        }

        // Check if the room is already full
        if (activeUsers[room].length >= 2) {
            socket.emit("room_full");
            return;
        }

        // Add user to the room
        socket.join(room);
        activeUsers[room].push(user);
        console.log(`User ${username} joined room: ${room}`);

        // Notify user about successful join
        socket.emit("joined_room", { room, users: activeUsers[room] });
    });

    socket.on("send_message", (data) => {
        const { room, author, message } = data;
        const recipientSocket = activeUsers[room].find(user => user.username !== author);

        if (recipientSocket) {
            io.to(recipientSocket.id).emit("receive_message", { author, message });
        } else {
            console.log("Recipient not found");
        }
    });

    socket.on("send_game_request", (data) => {
        const { room, author } = data;
        const recipientSocket = activeUsers[room].find(user => user.username !== author);

        if (recipientSocket) {
            io.to(recipientSocket.id).emit("receive_game_request", { author });
        } else {
            console.log("Recipient not found");
        }
    });

    socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.id}`);

        // Remove the user from all active rooms
        for (const room in activeUsers) {
            activeUsers[room] = activeUsers[room].filter(user => user.id !== socket.id);
        }
    });
});

server.listen(3001, () => {
    console.log("Server is running");
});
