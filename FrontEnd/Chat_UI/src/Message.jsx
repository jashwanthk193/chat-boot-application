// import React from "react";
// import {
//   Box,
//   Card,
//   CardContent,
//   Typography,
//   Avatar,
//   Stack,
//   Divider,
// } from "@mui/material";

// const dummyMessages = [
//   {
//     id: 1,
//     sender: "John Doe",
//     message: "Hey! Are you available for a quick meeting today?",
//     time: "2:30 PM",
//   },
//   {
//     id: 2,
//     sender: "Sarah Parker",
//     message: "Thanks for the update! I’ll review the file soon.",
//     time: "1:15 PM",
//   },
//   {
//     id: 3,
//     sender: "Alex Smith",
//     message: "Got your message, let’s catch up tomorrow.",
//     time: "11:45 AM",
//   },
//   {
//     id: 4,
//     sender: "Priya Mehta",
//     message: "Can you send me the final project report?",
//     time: "Yesterday",
//   },
// ];

// const Message = () => {
//   return (
//     <Box
//       sx={{
//         p: 3,
//         bgcolor: "#f4f6f8",
//         minHeight: "85vh",
//       }}
//     >
//       <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
//         Message Details
//       </Typography>

//       <Stack spacing={2}>
//         {dummyMessages.map((msg) => (
//           <Card
//             key={msg.id}
//             sx={{
//               borderRadius: 3,
//               p: 1,
//               transition: "0.3s",
//               "&:hover": { boxShadow: 4, transform: "scale(1.01)" },
//             }}
//           >
//             <CardContent sx={{ display: "flex", alignItems: "center" }}>
//               <Avatar sx={{ bgcolor: "#1976d2", mr: 2 }}>
//                 {msg.sender[0]}
//               </Avatar>

//               <Box sx={{ flex: 1 }}>
//                 <Typography variant="subtitle1" fontWeight="bold">
//                   {msg.sender}
//                 </Typography>
//                 <Typography
//                   variant="body2"
//                   color="text.secondary"
//                   sx={{
//                     whiteSpace: "nowrap",
//                     overflow: "hidden",
//                     textOverflow: "ellipsis",
//                     maxWidth: "90%",
//                   }}
//                 >
//                   {msg.message}
//                 </Typography>
//               </Box>

//               <Typography
//                 variant="caption"
//                 color="text.secondary"
//                 sx={{ ml: 2, whiteSpace: "nowrap" }}
//               >
//                 {msg.time}
//               </Typography>
//             </CardContent>

//             <Divider />
//           </Card>
//         ))}
//       </Stack>
//     </Box>
//   );
// };

// export default Message;

import React, { useEffect, useState } from "react";
import { getMessagesByReceiver } from "./api";
import { socket } from "./socket"; // ✅ import socket
import {
  Box,
  CircularProgress,
  Typography,
  Stack,
  Card,
  CardContent,
  Avatar,
  Divider,
} from "@mui/material";

const Message = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId) {
      console.warn("⚠️ No userId in localStorage");
      return;
    }

    // ✅ Join the socket room for this user
    socket.emit("join_room", userId);
    console.log(`🟢 Joined socket room for user ${userId}`);

    // ✅ Fetch existing messages from DB
    const fetchMessages = async () => {
      try {
        const data = await getMessagesByReceiver(userId);
        console.log("📨 Loaded DB messages:", data);
        setMessages(data);
      } catch (error) {
        console.error("❌ Error fetching messages:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();

    // ✅ Listen for new real-time messages
    socket.on("receive_message", (data) => {
      console.log("⚡ New live message received:", data);

      // Only add if it’s meant for this user
      if (data.receiverId.toString() === userId.toString()) {
        setMessages((prev) => [
          {
            MESSAGE_ID: Date.now(), // temp ID for UI
            MESSAGE_TEXT: data.message,
            SENDER_ID: data.senderId,
            RECEIVER_ID: data.receiverId,
            TIMESTAMP: new Date().toISOString(),
            SENDER_NAME: data.senderName || "User",
          },
          ...prev,
        ]);
      }
    });

    // Cleanup when unmounting
    return () => {
      socket.off("receive_message");
    };
  }, [userId]);

  if (loading)
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="85vh">
        <CircularProgress />
      </Box>
    );

  return (
    <Box sx={{ p: 3, bgcolor: "#f4f6f8", minHeight: "85vh" }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
        Received Messages (Live)
      </Typography>

      {messages.length === 0 ? (
        <Typography color="text.secondary" textAlign="center">
          No received messages.
        </Typography>
      ) : (
        <Stack spacing={2}>
          {messages.map((msg) => (
            <Card
              key={msg.MESSAGE_ID}
              sx={{
                borderRadius: 3,
                p: 1,
                backgroundColor: "#FFF3E0",
                transition: "0.3s",
                "&:hover": { boxShadow: 3, transform: "scale(1.01)" },
              }}
            >
              <CardContent sx={{ display: "flex", alignItems: "center" }}>
                <Avatar sx={{ bgcolor: "#1976d2", mr: 2 }}>
                  {msg.SENDER_NAME ? msg.SENDER_NAME[0] : "U"}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body1">{msg.MESSAGE_TEXT}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(msg.TIMESTAMP).toLocaleString("en-US", {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </Typography>
                </Box>
              </CardContent>
              <Divider />
            </Card>
          ))}
        </Stack>
      )}
    </Box>
  );
};

export default Message;
