import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Paper,
  Typography,
  IconButton,
  TextField,
  InputAdornment,
  Avatar,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import ForumIcon from "@mui/icons-material/Forum";
import { useLocation } from "react-router-dom";
import { postMessage, getMessages } from "./api";
import { socket } from "./socket";

const Chat = () => {
  const location = useLocation();
  const personName = location.state?.NAME || "Chat Support";
  const receiverId = location.state?.USER_ID || 2;
  const currentUserId = parseInt(localStorage.getItem("userId")) || 1;

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Fetch chat
  useEffect(() => {
    const fetchChat = async () => {
      try {
        const data = await getMessages(currentUserId, receiverId);
        setMessages(data);
        setTimeout(scrollToBottom, 100);
      } catch (err) {
        console.error("❌ Error fetching chat:", err);
      }
    };

    fetchChat();

    socket.emit("join_room", currentUserId);
    socket.off("receive_message");
    socket.on("receive_message", (data) => {
      if (
        (data.senderId === receiverId && data.receiverId === currentUserId) ||
        (data.senderId === currentUserId && data.receiverId === receiverId)
      ) {
        setMessages((prev) => [
          ...prev,
          {
            MESSAGE_ID: Date.now(),
            MESSAGE_TEXT: data.message,
            SENDER_ID: data.senderId,
            RECEIVER_ID: data.receiverId,
            TIMESTAMP: new Date().toISOString(),
          },
        ]);
        setTimeout(scrollToBottom, 100);
      }
    });

    return () => socket.off("receive_message");
  }, [currentUserId, receiverId]);

  // Send message
  const handleSend = async () => {
    if (!input.trim()) return;
    const msgText = input;
    setInput("");

    const newMsg = {
      MESSAGE_ID: Date.now(),
      SENDER_ID: currentUserId,
      RECEIVER_ID: receiverId,
      MESSAGE_TEXT: msgText,
      TIMESTAMP: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, newMsg]);
    setTimeout(scrollToBottom, 100);

    try {
      await postMessage({
        senderId: currentUserId,
        receiverId,
        messageText: msgText,
      });
      socket.emit("send_message", {
        senderId: currentUserId,
        receiverId,
        message: msgText,
      });
    } catch (err) {
      console.error("❌ Error sending message:", err);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "85vh",
        p: 2,
        bgcolor: "#e5ddd5", // WhatsApp-like background
        borderRadius: 3,
      }}
    >
      {/* Header */}
      <Paper
        elevation={2}
        sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
          mb: 2,
          borderRadius: 3,
          bgcolor: "#075E54",
          color: "#fff",
        }}
      >
        <ForumIcon sx={{ mr: 1 }} />
        <Typography variant="h6" fontWeight={600}>
          {personName}
        </Typography>
      </Paper>

      {/* Messages */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          px: 2,
          py: 1,
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
      >
        {messages.map((msg) => {
          const isMine = msg.SENDER_ID === currentUserId;
          return (
            <Box
              key={msg.MESSAGE_ID}
              sx={{
                display: "flex",
                justifyContent: isMine ? "flex-end" : "flex-start",
              }}
            >
              {!isMine && (
                <Avatar
                  sx={{
                    width: 28,
                    height: 28,
                    fontSize: 14,
                    bgcolor: "#128C7E",
                    mr: 1,
                  }}
                >
                  {personName[0]}
                </Avatar>
              )}
              <Box
                sx={{
                  bgcolor: isMine ? "#DCF8C6" : "#fff",
                  color: "#000",
                  px: 1.5,
                  py: 1,
                  borderRadius: 2,
                  maxWidth: "70%",
                  boxShadow: 1,
                  borderTopRightRadius: isMine ? 0 : 16,
                  borderTopLeftRadius: isMine ? 16 : 0,
                }}
              >
                <Typography variant="body1" sx={{ wordBreak: "break-word" }}>
                  {msg.MESSAGE_TEXT}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    fontSize: "0.7rem",
                    color: "#666",
                    display: "block",
                    textAlign: "right",
                    mt: 0.5,
                  }}
                >
                  {new Date(msg.TIMESTAMP).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Typography>
              </Box>
            </Box>
          );
        })}
        <div ref={messagesEndRef} />
      </Box>

      {/* Input */}
      <Paper
        elevation={3}
        sx={{
          p: 1,
          display: "flex",
          alignItems: "center",
          borderRadius: 3,
          bgcolor: "#f0f0f0",
        }}
      >
        <TextField
          fullWidth
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          InputProps={{
            sx: { borderRadius: 3, bgcolor: "#fff" },
            endAdornment: (
              <InputAdornment position="end">
                <IconButton color="primary" onClick={handleSend}>
                  <SendIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Paper>
    </Box>
  );
};

export default Chat;
