import dotenv from "dotenv";
dotenv.config();

import http from "http";
import { Server } from "socket.io";
import { app } from "./app.js"; // your Express app

const PORT = process.env.PORT || 4000;

// ✅ Create an HTTP server from Express
const server = http.createServer(app);

// ✅ Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: "*", // change to your frontend URL in production
    methods: ["GET", "POST"],
  },
});

// ✅ Socket.IO event listeners
io.on("connection", (socket) => {
  console.log("⚡ User connected:", socket.id);

  // When a user joins their own room
  socket.on("join_room", (userId) => {
    if (!userId) return;
    socket.join(userId.toString());
    console.log(`✅ User ${userId} joined room ${userId}`);
  });

  // When a message is sent
  // socket.on("send_message", (data) => {
  //   const { senderId, receiverId, message } = data;
  //   console.log("📩 Incoming message data:", data);

  //   if (!senderId || !receiverId || !message) {
  //     console.warn("⚠️ Incomplete message data");
  //     return;
  //   }

  //   // ✅ Emit message to receiver
  //   io.to(receiverId.toString()).emit("receive_message", {
  //     senderId,
  //     receiverId,
  //     message,
  //   });
  //   console.log(`📤 Sent message to room: ${receiverId}`);

  //   // ✅ Optionally, echo message back to sender (for instant UI update)
    
   
  // });
  socket.on("send_message", (data) => {
  console.log("📩 Incoming message data (socket):", data);
  // No emit here — handled by API now
});


  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});

// ✅ Start the server
server.listen(PORT, () => console.log(`✅ Server started on port ${PORT}`));
export { io };
