

import { DatabaseHandler } from "../config/db.js";
import oracledb from "oracledb";
import { io } from "../server.js";
import { Socket } from "socket.io";

const db = new DatabaseHandler();

export async function sendMessage(req, res) {
  let connection;

  try {
    const { senderId, receiverId, messageText } = req.body;

    console.log("📩 Incoming message data:", req.body);

    // ✅ Validation
    if (
      senderId === undefined ||
      receiverId === undefined ||
      messageText === undefined
    ) {
      return res
        .status(400)
        .json({ error: "senderId, receiverId, and messageText are required." });
    }

    const senderNum = parseInt(senderId);
    const receiverNum = parseInt(receiverId);

    if (isNaN(senderNum) || isNaN(receiverNum)) {
      return res
        .status(400)
        .json({ error: "senderId and receiverId must be valid numbers." });
    }

    connection = await db.getConnection();

    const query = `
      INSERT INTO MESSAGES_TEST 
        (MESSAGE_ID, SENDER_ID, RECEIVER_ID, MESSAGE_TEXT, TIMESTAMP)
      VALUES 
        (MESSAGE_SEQ.NEXTVAL, :senderId, :receiverId, :messageText, SYSTIMESTAMP)
    `;

    const binds = {
      senderId: senderNum,
      receiverId: receiverNum,
      messageText: messageText.toString(),
    };

    await connection.execute(query, binds, { autoCommit: true });

    console.log("✅ Message saved successfully!");

    // ✅ Emit message in real time to the receiver (important!)
    io.to(receiverNum.toString()).emit("receive_message", {
      senderId: senderNum,
      receiverId: receiverNum,
      message: messageText,
    });

    console.log(`📤 Real-time message sent to receiver ${receiverNum}`);

    res
      .status(201)
      .json({ success: true, message: "Message saved and emitted successfully" });

  } catch (err) {
    console.error("❌ Error saving message:", err);
    res.status(500).json({ error: err.message });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Error closing connection:", err);
      }
    }
  }
}

export async function getChatBetweenUsers(req, res) {
  let { userId, receiverId } = req.params;
  let connection;

  try {
    // Convert both to numbers to avoid ORA-01722
    userId = Number(userId);
    receiverId = Number(receiverId);

    connection = await db.getConnection();

    console.log(`💬 Fetching chat between ${userId} and ${receiverId}`);

    const result = await connection.execute(
      `
      SELECT * FROM MESSAGES_TEST
      WHERE 
        (SENDER_ID = :userId AND RECEIVER_ID = :receiverId)
        OR 
        (SENDER_ID = :receiverId AND RECEIVER_ID = :userId)
      ORDER BY TIMESTAMP ASC
      `,
      { userId, receiverId },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    res.json(result.rows);
  } catch (err) {
    console.error("❌ Error fetching chat:", err);
    res.status(500).json({ error: err.message });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Error closing connection:", err);
      }
    }
  }
}

// Get messages RECEIVED by a specific user
// 📦 messageController.js

/**
 * ✅ Get all messages where RECEIVER_ID matches the userId
 */
export const getMessagesByReceiver = async (req, res) => {
  let connection;
  try {
    const { receiverId } = req.params;

    if (!receiverId) {
      return res.status(400).json({ error: "Receiver ID is required" });
    }

    connection = await db.getConnection();

    console.log(`📨 Fetching all messages for receiver ID: ${receiverId}`);

    const result = await connection.execute(
      `
      SELECT MESSAGE_ID, SENDER_ID, RECEIVER_ID, MESSAGE_TEXT, TIMESTAMP
      FROM MESSAGES_TEST
      WHERE RECEIVER_ID = :receiverId
      ORDER BY TIMESTAMP DESC
      `,
      { receiverId: Number(receiverId) },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    console.log(`✅ Found ${result.rows.length} messages for receiver ${receiverId}`);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("❌ Error fetching messages by receiver:", err);
    res.status(500).json({ error: err.message });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Error closing connection:", err);
      }
    }
  }
};
 



